import { Program, Stmt, Expr, Binary, Unary, IfStmt, Logical, WhileStmt } from "../parser/AST";
import { TokenType } from "../scanner/Token";
import { Environment } from "./Environment";

export class Interpreter {
    private environment: Environment = new Environment();
    private prevEnvironment: Environment = this.environment;
    interpret(program: Program): void {
        const stmts = program.body;
        for(let stmt of stmts) {
            this.execute(stmt);
        }
    }

    private execute(stmt: Stmt): void {
        switch(stmt.type) {
            case "expression":
                this.evaluate(stmt.expr);
                break;
            case "if":
                this.evaluateIf(stmt);
                break;
            case "while":
                this.evaluateWhile(stmt);
                break;
            case "print":
                const value = this.evaluate(stmt.expr);
                console.log(value);
                break;
            case "init":
                let varValue = null;

                if(stmt.initializer !== null) {
                    varValue = this.evaluate(stmt.initializer);
                }

                this.environment.define(
                    stmt.name.value as string,
                    varValue
                )

                break;
            case "block":
                this.executeBlock(stmt.stmts);
        }
    }

    private executeBlock(stmts: Stmt[]): void {
        this.prevEnvironment = this.environment;
        try {
            this.environment = new Environment(this.environment);

            for(let stmt of stmts) {
                this.execute(stmt);
            }
        } finally {
            this.environment = this.prevEnvironment;
        }
    }

    private evaluate(expr: Expr): unknown {
        switch(expr.type) {
            case "literal":
                return expr.value;
            case "logical":
                return this.evaluateLogical(expr);
            case "binary":
                return this.evaluateBinary(expr);
            case "unary":
                return this.evaluateUnary(expr);
            case "variable":
                return this.environment.get(expr.name as string);
            case "assign":
                const value = this.evaluate(expr.value);

                this.environment.assign(
                    expr.name,
                    value
                );

                return value;
        }
    }

    private evaluateIf(stmt: IfStmt): void {
        if(this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.stmts as Stmt);
        } else if(stmt.elseBranch !== null) {
            this.execute(stmt.elseBranch);
        }
    }

    evaluateWhile(stmt: WhileStmt): void {
        while(this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.stmts);
        }
    }

    private evaluateLogical(expr: Logical): unknown {
        let left = this.evaluate(expr.left);

        if(expr.operator.kind === TokenType.OR) {
            if(this.isTruthy(left)) return true;
        } else {
            if(!this.isTruthy(left)) return false;
        }

        const right = this.evaluate(expr.right);

        return this.isTruthy(right);
    }

    private evaluateBinary(expr: Binary): unknown {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);

        switch(expr.operator.kind) {
            case TokenType.PLUS:
                return (left as number) + (right as number);
            case TokenType.MINUS:
                return (left as number) - (right as number);
            case TokenType.MULT:
                return (left as number) * (right as number);
            case TokenType.DIV:
                return (left as number) / (right as number);
            case TokenType.MOD:
                return (left as number) % (right as number);
            case TokenType.GT:
                return (left as number) > (right as number);
            case TokenType.GTE:
                return (left as number) >= (right as number);
            case TokenType.LT:
                return (left as number) < (right as number);
            case TokenType.LTE:
                return (left as number) <= (right as number);
            case TokenType.EQUAL_EQUAL:
                return left === right;
            case TokenType.BANG_EQUAL:
                return left !== right;
        }

        throw new Error("Unknown binary operator: " + expr.operator.value);
    }

    private evaluateUnary(expr: Unary): unknown {
        const right = this.evaluate(expr.right);

        switch(expr.operator.kind) {
            case TokenType.MINUS:
                return -(right as number);
            case TokenType.BANG:
                return !right;
        }

        throw new Error("Unknown unary operator: " + expr.operator.value);
    }

    private isTruthy(value: unknown): boolean {
        if(value === null) {
            return false;
        }

        if(typeof value === "boolean") {
            return value;
        }

        return true;
    }
}