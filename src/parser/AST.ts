import { Token, TokenType } from "../scanner/Token"

export type Expr =
    | CallExpr
    | Logical
    | Binary
    | Literal
    | Unary
    | InitExpr
    | AssignExpr;

export type Logical = {
    type: "logical";
    left: Expr;
    right: Expr;
    operator: Token;
}

export type Binary = {
    type: "binary";
    left: Expr;
    operator: Token;
    right: Expr;
};

export type Literal = {
    type: "literal";
    value: string | number | true |false | null;
};

export type Unary = {
    type: "unary";
    operator: Token;
    right: Expr;
}

export type FnStmt = {
    type: "function";
    name: Token;
    params: Token[];
    body: Stmt;
}

export type IfStmt = {
    type: "if";
    condition: Expr;
    elseBranch: Stmt | null;
    stmts: Stmt;
}

export type WhileStmt = {
    type: "while";
    condition: Expr;
    stmts: Stmt;
}

export type PrintStmt = {
    type: "print";
    expr: Expr;
}

export type InitStmt = {
    type: "init";
    name: Token;
    initializer: Expr | null;
}

export type CallExpr = {
    type: "call";
    callee: Expr;
    args: Expr[];
}

export type InitExpr = {
    type: "variable";
    name: string;
}

export type AssignExpr = {
    type: "assign";
    name: string;
    value: Expr;
}

export type ExprStmt = {
    type: "expression";
    expr: Expr;
}

export type Stmt = 
    | FnStmt
    | IfStmt
    | WhileStmt
    | PrintStmt
    | InitStmt
    | ExprStmt
    | BlockStmt;

export type BlockStmt = {
    type: "block";
    stmts: Stmt[];
}

export type Program = {
    type: "program";
    body: Stmt[];
}