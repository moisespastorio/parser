import { BlockStmt, FnStmt } from "@/parser/AST";
import { Environment } from "./Environment";
import { Interpreter } from "./interpreter";

export class MoiFunction {
    constructor(
        public declaration: FnStmt,
        public closure: Environment
    )
    {}

    call(interpreter: Interpreter, args: unknown[]): unknown {
    const environment = new Environment(this.closure);

    for (let i = 0; i < this.declaration.params.length; i++) {
        const param = this.declaration.params[i];

        environment.define(
            param.value as string,
            args[i]
        );
    }

    interpreter.executeBlock(
        (this.declaration.body as BlockStmt).stmts,
        environment
    );

    return null;
}
}