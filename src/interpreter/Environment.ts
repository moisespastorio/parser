export class Environment {
    private values = new Map<string, unknown>();

    
    constructor(public readonly enclosing?: Environment) {}

    define(name: string, value: unknown): void {
        this.values.set(name, value);
    }

    get(name: string): unknown {
        if(this.values.has(name)) {
            return this.values.get(name);
        }

        if(this.enclosing !== undefined) {
            return this.enclosing.get(name);
        }
        
        throw new Error('Undefined variable: ' + name);
    }

    assign(name: string, value: unknown): void {
        if(this.values.has(name)) {
            this.values.set(name, value);
            return;
        }

        if(this.enclosing !== undefined) {
            this.enclosing.assign(name, value);
            return;
        }
        
        throw new Error('Undefined variable: ' + name);
    }
}