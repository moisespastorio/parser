import { Interpreter } from "@/interpreter/interpreter";

import ast from "./parser";

const interpreter = new Interpreter();

console.log(interpreter.interpret(ast));