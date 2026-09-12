import { Parser } from "@/parser/parser";
import tokens from "./lexer";

const parser = new Parser(tokens);

const ast = parser.parse();

// console.dir(ast.body, { depth: null });