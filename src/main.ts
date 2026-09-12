import { Parser } from "./parser/parser";
import { Lexer } from "./scanner/lexer";
import { Interpreter } from "./interpreter/interpreter";

import { ex01 as source } from "./examples/ex01";

const lexer = new Lexer(source);
let tok = lexer.tokenize();
// console.log(tok)
const parser = new Parser(tok);

// console.log(tok);

const parsed = parser.parse();
// console.log(parsed.body[0]);
const interpreter = new Interpreter();
interpreter.interpret(parsed);