import { Token, TokenType } from "../scanner/Token"

export type Expr =
    | Binary
    | Literal
    | Unary;

export type Binary = {
    type: "binary";
    left: Expr;
    operator: Token;
    right: Expr;
};

export type Literal = {
    type: "literal";
    value: string;
};

export type Unary = {
    type: "unary";
    operator: Token;
    right: Expr;
}

export type PrintStmt = {
    type: "print";
    expr: Expr;
}

export type InitStmt = {
    type: "Init";
    name: Token;
    initializer: Expr | null;
}

export type ExprStmt = {
    type: "expression";
    expr: Expr;
}

export type Stmt = 
    | PrintStmt
    | InitStmt
    | ExprStmt;