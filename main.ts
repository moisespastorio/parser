import { Parser } from "./parser/parser";
import { Lexer } from "./scanner/lexer";

let str = "print 1 + 1;";

const lexer = new Lexer(str);
let tok = lexer.tokenize();
// console.log(tok)
const parser = new Parser(tok);

// console.log(tok);
console.log(parser.parse());