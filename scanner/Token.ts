export type Token = {
    kind: TokenType;
    value: string;
};

export enum TokenType {
    BANG = "BANG",
    BANG_EQUAL = "BANG_EQUAL",
    EQUAL = "EQUAL",
    EQUAL_EQUAL = "EQUAL_EQUAL",
    GT = "GT",
    GTE = "GTE",
    LT = "LT",
    LTE = "LTE",
    MINUS = "MINUS",
    PLUS = "PLUS",
    MULT = "MULT",
    DIV = "DIV",
    MOD = "MOD",
    OPENPAREN = "OPENPAREN",
    CLOSEPAREN = "CLOSEPAREN",
    SEMICOLON = "SEMICOLON",
    HASH = "HASH",
    INIT = "INIT",
    PRINT = "PRINT",
    IDENTIFIER = "IDENTIFIER",
    NUMBER = "NUMBER",
    STRING = "STRING",
    EOF = "EOF",
};

export const symbols: Partial<Record<TokenType, string>> = {
    [TokenType.BANG]: "!",
    [TokenType.BANG_EQUAL]: "!=",
    [TokenType.EQUAL]: "=",
    [TokenType.EQUAL_EQUAL]: "==",
    [TokenType.GT]: ">",
    [TokenType.GTE]: ">=",
    [TokenType.LT]: "<",
    [TokenType.LTE]: "<=",
    [TokenType.SEMICOLON]: ";",
    [TokenType.MINUS]: "-",
    [TokenType.PLUS]: "+",
    [TokenType.MULT]: "*",
    [TokenType.DIV]: "/",
    [TokenType.MOD]: "%",
    [TokenType.OPENPAREN]: "(",
    [TokenType.CLOSEPAREN]: ")",
    [TokenType.HASH]: "#",
    [TokenType.EOF]: "EOF",
    [TokenType.PRINT]: "PRINT",
    [TokenType.INIT]: "INIT"
};