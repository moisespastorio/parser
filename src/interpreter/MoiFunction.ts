import { FnStmt } from "@/parser/AST";
import { Environment } from "./Environment";

export class MoiFunction {
    constructor(
        public declaration: FnStmt,
        public closure: Environment
    )
    {}
}