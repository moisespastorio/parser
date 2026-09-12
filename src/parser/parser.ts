import { Token, TokenType } from "../scanner/Token";
import {
  Expr,
  Literal,
  Binary,
  Unary,
  ExprStmt,
  PrintStmt,
  InitStmt,
  Stmt,
  Program,
} from "./AST";

export class Parser {
  private tokens: Token[];
  private current: number = 0;
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
  parse(): Program {
    let stmts: Stmt[] = [];
    while (!this.isEOF()) {
      stmts.push(this.declaration());
    }
    return {
      type: "program",
      body: stmts,
    };
  }
  declaration(): Stmt {
    if (this.match(TokenType.INIT)) {
      return this.initDeclaration();
    }
    return this.stmt();
  }
  initDeclaration(): InitStmt {
    const name = this.consume(
      TokenType.IDENTIFIER,
      "Expect: identifier after 'init'.",
    );

    let initializer = null;
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expr();
    }

    this.consume(TokenType.SEMICOLON, "Expect: ';' after variable declaration");

    return {
      type: "init",
      name,
      initializer,
    };
  }
  stmt(): Stmt {
    if (this.match(TokenType.FOR)) {
      return this.forStmt();
    }
    if (this.match(TokenType.IF)) {
      return this.ifStmt();
    }
    if (this.match(TokenType.WHILE)) {
      return this.whileStmt();
    }
    if (this.match(TokenType.PRINT)) {
      return this.printStmt();
    }
    if (this.match(TokenType.OPENBRACKET)) {
      return this.blockStmt();
    }
    return this.exprStmt();
  }
  forStmt(): Stmt {
    this.consume(TokenType.OPENPAREN, "Expect: '(' after for keyword.");

    let initializer;
    if (this.match(TokenType.SEMICOLON)) {
      initializer = null;
    } else if (this.match(TokenType.INIT)) {
      initializer = this.initDeclaration();
    } else {
      initializer = this.exprStmt();
    }

    let condition: Expr | null = null;
    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.expr();
    }
    this.consume(TokenType.SEMICOLON, "Expect: ';' after loop condition.");

    let increment = null;
    if (!this.check(TokenType.CLOSEPAREN)) {
      increment = this.expr();
    }

    this.consume(TokenType.CLOSEPAREN, "Expect ')' after for clauses.");
    
    let body = this.stmt();

    if(increment !== null) {
        body = {
            type: "block",
            stmts: [
                body,
                {
                    type: "expression",
                    expr: increment
                }
            ]
        }
    }

    if(condition === null) {
        condition = {
            type: "literal",
            value: true
        }
    }

    body = {
        type: "while",
        condition,
        stmts: body
    }

    if(initializer !== null) {
        body = {
            type: "block",
            stmts: [
                initializer, 
                body
            ]
        }
    }

    return body;
  }
  ifStmt(): Stmt {
    this.consume(TokenType.OPENPAREN, "Expect: '(' after if statement.");
    const condition = this.expr();
    this.consume(TokenType.CLOSEPAREN, "Expect: ')' after if statement.");

    const stmt: Stmt = this.stmt();
    let elseBranch: Stmt | null = null;
    if (this.match(TokenType.ELSE)) {
      elseBranch = this.stmt();
    }

    return {
      type: "if",
      condition,
      elseBranch,
      stmts: stmt,
    };
  }

  whileStmt(): Stmt {
    this.consume(TokenType.OPENPAREN, "Expect '(' after while keyword.");
    let condition = this.expr();
    this.consume(TokenType.CLOSEPAREN, "Expect ')' after while condition.");

    let stmts = this.stmt();

    return {
      type: "while",
      condition,
      stmts,
    };
  }

  printStmt(): Stmt {
    const expr = this.expr();

    this.consume(TokenType.SEMICOLON, "Expect: ';' after value.");

    return {
      type: "print",
      expr,
    };
  }
  blockStmt(): Stmt {
    const stmts: Stmt[] = [];

    while (!this.check(TokenType.CLOSEBRACKET) && !this.isEOF()) {
      stmts.push(this.declaration());
    }

    this.consume(TokenType.CLOSEBRACKET, "Expect: '}' after block.");

    return {
      type: "block",
      stmts,
    };
  }
  exprStmt(): Stmt {
    const expr = this.expr();

    this.consume(TokenType.SEMICOLON, "Expect: ';' after expression.");

    return {
      type: "expression",
      expr,
    };
  }

  // Expressions
  expr(): Expr {
    return this.assignment();
  }
  assignment(): Expr {
    const expr = this.or();

    if (this.match(TokenType.EQUAL)) {
      const value = this.assignment();

      if (expr.type === "variable") {
        return {
          type: "assign",
          name: expr.name,
          value,
        };
      }

      throw new Error("Invalid assignment target.");
    }

    return expr;
  }
  or(): Expr {
    let expr: Expr = this.and();

    while (this.match(TokenType.OR)) {
      let operator = this.prev();
      let right = this.and();
      expr = {
        type: "logical",
        left: expr,
        right,
        operator,
      };
    }

    return expr;
  }
  and(): Expr {
    let expr: Expr = this.equality();

    while (this.match(TokenType.AND)) {
      let operator = this.prev();
      let right = this.equality();
      expr = {
        type: "logical",
        left: expr,
        right,
        operator,
      };
    }

    return expr;
  }
  equality(): Expr {
    let Binary: Expr = this.comparison();
    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      let operator = this.prev();
      let right = this.comparison();
      Binary = {
        type: "binary",
        left: Binary,
        right,
        operator,
      };
    }
    return Binary;
  }
  comparison(): Expr {
    let Binary: Expr = this.term();
    while (
      this.match(TokenType.GT, TokenType.GTE, TokenType.LT, TokenType.LTE)
    ) {
      let operator = this.prev();
      let right = this.term();
      Binary = {
        type: "binary",
        left: Binary,
        right,
        operator,
      };
    }
    return Binary;
  }
  term(): Expr {
    let Binary: Expr = this.factor();
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      let operator = this.prev();
      let right = this.factor();
      Binary = {
        type: "binary",
        left: Binary,
        right,
        operator,
      };
    }
    return Binary;
  }
  factor(): Expr {
    let Binary: Expr = this.unary();
    while (this.match(TokenType.MULT, TokenType.DIV, TokenType.MOD)) {
      let operator = this.prev();
      let right = this.unary();
      Binary = {
        type: "binary",
        left: Binary,
        right,
        operator,
      };
    }
    return Binary;
  }
  unary(): Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      let operator = this.prev();
      let right = this.unary();

      return {
        type: "unary",
        operator,
        right,
      };
    }
    return this.primary();
  }
  primary(): Expr {
    // console.log(this.peek());
    if (
      this.match(
        TokenType.NUMBER,
        TokenType.STRING,
        TokenType.BOOLEAN,
        TokenType.NIL,
      )
    ) {
      return {
        type: "literal",
        value: this.prev()!.value,
      };
    }
    if (this.match(TokenType.IDENTIFIER)) {
      return {
        type: "variable",
        name: this.prev().value as string,
      };
    }
    if (this.match(TokenType.OPENPAREN)) {
      let expr = this.expr();
      this.consume(
        TokenType.CLOSEPAREN,
        "Expected closing parenthesis at the end of expression.",
      );
      return expr;
    }
    throw new Error("Expected expression.");
  }
  peek(): TokenType {
    return this.tokens[this.current].kind;
  }
  advance(): void {
    this.current++;
  }
  check(expect: TokenType): boolean {
    return this.peek() === expect;
  }
  consume(expect: TokenType, errMsg: string): Token {
    if (this.peek() !== expect) {
      throw new Error("Unexpected Token: " + errMsg);
    }

    const token = this.tokens[this.current];
    this.advance();

    return token;
  }
  match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.peek() === type) {
        this.advance();
        return true;
      }
    }

    return false;
  }
  prev(): Token {
    return this.tokens[this.current - 1];
  }
  isEOF(): boolean {
    return this.tokens[this.current].kind === TokenType.EOF;
  }
}
