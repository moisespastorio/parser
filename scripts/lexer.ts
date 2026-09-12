import { Lexer } from "@/scanner/lexer";
import { readSource } from "@/utils/loader";

const str = readSource(import.meta.dirname, "test.moi");

const lexer = new Lexer(str);

const tokens = lexer.tokenize();

console.log(tokens);

export default tokens;