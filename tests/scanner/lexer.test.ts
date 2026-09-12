import { expect, test } from 'vitest';

import { Lexer } from '@/scanner/lexer';
import { symbols, TokenType } from '@/scanner/Token';

test("Lexer deve reconhecer a keyword 'fn'", () => {
    const input = "fn";
    const result = new Lexer(input).tokenize();

    expect(result).toEqual([
        { kind: TokenType.IDENTIFIER, value: "fn"},
        { kind: TokenType.EOF, value: symbols[TokenType.EOF]}
    ])
});