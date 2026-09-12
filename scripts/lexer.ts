import { Lexer } from "@/scanner/lexer";

const str = "fn name()";

const lexer = new Lexer(str);

const tokens = lexer.tokenize();

console.log(tokens);