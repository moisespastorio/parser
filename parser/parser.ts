import { Token, TokenType } from "../scanner/Token";
import { Expr, Literal, Binary, Unary, ExprStmt, PrintStmt, InitStmt, Stmt } from "./AST";

export class Parser {
    private tokens: Token[];
    private current: number = 0;
    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }
    parse(): Stmt {
        return this.declaration();
    }
    declaration(): Stmt {
        if(this.match(TokenType.INIT)) {
            return this.initDeclaration();
        }
        return this.stmt();
    }
    initDeclaration(): InitStmt {
        const name = this.consume(
            TokenType.IDENTIFIER,
            "Expect: identifier after 'init'."
        )

        let initializer = null;
        if(this.match(TokenType.EQUAL)) {
            initializer = this.expr();
        }

        this.consume(
            TokenType.SEMICOLON,
            "Expect: ';' after variable declaration"
        )

        return {
            type: "Init",
            name,
            initializer
        }
    }
    stmt(): Stmt {
        if(this.match(TokenType.PRINT)) {
            return this.printStmt();
        }
        return this.exprStmt();
    }
    printStmt(): Stmt {
        const expr = this.expr();

        this.consume(
            TokenType.SEMICOLON,
            "Expect: ';' after value."
        )

        return {
            type: "print",
            expr
        }
    }
    exprStmt(): Stmt {
        const expr = this.expr();

        this.consume(
            TokenType.SEMICOLON,
            "Expect: ';' after expression."
        )

        return {
            type: "expression",
            expr
        };
    }
    expr(): Expr {
        // return this.assignment();
        return this.equality();
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
                operator
            };
        }
        return Binary;
    }
    comparison(): Expr {
        let Binary: Expr = this.term();
        while (this.match(TokenType.GT, TokenType.GTE, TokenType.LT, TokenType.LTE)) {
            let operator = this.prev();
            let right = this.term();
            Binary = {
                type: "binary",
                left: Binary,
                right,
                operator
            }
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
                operator
            }
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
                operator
            }
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
                right
            }
        }
        return this.primary();
    }
    primary(): Expr {
        if (this.match(TokenType.NUMBER)) {
            return {
                type: "literal",
                value: this.prev()!.value
            };
        };
        if (this.match(TokenType.OPENPAREN)) {
            let expr = this.expr();
            this.consume(TokenType.CLOSEPAREN, "Expected closing parenthesis at the end of expression.");
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