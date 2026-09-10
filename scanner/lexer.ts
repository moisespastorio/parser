import { TokenType, Token, symbols } from "./Token";

export class Lexer {
    private source: string[];
    tokens: Token[] = [];
    private lineCount: number = 0;
    private maxLoopCount: number = 200;
    constructor(source: string) {
        this.source = source.split('');
    }
    tokenize(): Token[] {
        while(this.source.length > 0 && this.maxLoopCount > 0) {
            this.maxLoopCount--;
            if(/\n/.test(this.source[0])) {
                this.consume();
                this.lineCount++;
                continue;
            }
            if(/\s/.test(this.source[0])) {
                this.consume();
                continue;
            }
            if(this.match(TokenType.HASH)) {
                this.comment();
                continue;
            }
            if(this.match(TokenType.SEMICOLON)) {
                this.add(TokenType.SEMICOLON);
                continue;
            }
            if(this.match(TokenType.EQUAL)) {
                if(this.match(TokenType.EQUAL)) {
                    this.add(TokenType.EQUAL_EQUAL);
                } else {
                    this.add(TokenType.EQUAL);
                }
                continue;
            }
            if(this.match(TokenType.PLUS)) {
                this.add(TokenType.PLUS);
                continue;
            }
            if(this.match(TokenType.MINUS)) {
                this.add(TokenType.MINUS);
                continue;
            }
            if(this.match(TokenType.MULT)) {
                this.add(TokenType.MULT);
                continue;
            }
            if(this.match(TokenType.DIV)) {
                this.add(TokenType.DIV);
                continue;
            }
            if(this.match(TokenType.OPENPAREN)) {
                this.add(TokenType.OPENPAREN);
                continue;
            }
            if(this.match(TokenType.CLOSEPAREN)) {
                this.add(TokenType.CLOSEPAREN);
                continue;
            }
            if(this.match(TokenType.MOD)) {
                this.add(TokenType.MOD);
                continue;
            }
            if(this.match(TokenType.BANG)) {
                if(this.match(TokenType.EQUAL)){
                    this.add(TokenType.BANG_EQUAL);
                } else {
                    this.add(TokenType.BANG);
                }
                continue;
            }
            if(this.match(TokenType.GT)) {
                if(this.match(TokenType.EQUAL)) {
                    this.add(TokenType.GTE);
                } else {
                    this.add(TokenType.GT)
                }
                continue;
            }
            if(this.match(TokenType.LT)) {
                if(this.match(TokenType.EQUAL)) {
                    this.add(TokenType.LTE);
                } else {
                    this.add(TokenType.LT)
                }
                continue;
            }
            if(this.isAlpha()) {
                this.string();
                continue;
            }
            if(this.isNumber()) {
                this.number();
                continue;
            }
        }
        this.add(TokenType.EOF);
        return this.tokens;
    }
    consume(): string {
        return this.source.shift() || "";
    }
    match(type: TokenType): boolean {
        const symbol = symbols[type];

        const cur = this.source[0];
        if(cur === symbol) {
            this.consume();
            return true;
        }
        
        return false;
    }
    comment(): void {
        while(this.consume() !== "\n" || this.source.length > 0) {};
    }
    add(type: TokenType): void {
        this.tokens.push({
            kind: type,
            value: symbols[type]!
        });
    }
    string(): void {
        let identifier = "";
        while(this.isAlphanumeric() && this.source.length > 0) {
            identifier += this.consume();
        }
        switch(identifier) {
            case "init":
                this.add(TokenType.INIT);
                break;
            case "print":
                this.add(TokenType.PRINT);
                break;
            default:
                this.tokens.push({
                    kind: TokenType.IDENTIFIER,
                    value: identifier
                });
        }
    }
    number(): void {
        let num = "";
        while(this.isNumber() && this.source.length > 0) {
            num += this.consume();
        };
        this.tokens.push({
            kind: TokenType.NUMBER,
            value: num
        });
    }
    isAlpha(): boolean {
        const alphaReg = /[a-zA-Z]/;
        return alphaReg.test(this.source[0]);
    }
    isAlphanumeric(): boolean {
        const alphanumericReg = /[0-9a-zA-Z]/;
        return alphanumericReg.test(this.source[0]);
    }
    isNumber(): boolean {
        return /[0-9]/.test(this.source[0]);
    }
}