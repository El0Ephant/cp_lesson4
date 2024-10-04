import {
    isUndefined,
    simplify
} from 'mathjs'

import { Lexer, Tok } from "./lexer.js";

import { Node,
    BinOp,
    UnOp,
    Var,
    Const,
    Num } from "./node.js";


class Parser {
    /**
     * @param {string} input 
     * @param {string} varName 
     */
    constructor(input, varName) {
        this.lexer = new Lexer(input, varName);
    }

    parse() {
        let res = this.sum();
        if (this.lexer.lexKind != Tok.End) {
            throw new Error(`Parser error. End of expression expected. Received: "${this.lexer.lexKind.name}"`);
        }

        return res;
    }

    /**
     * @param {Node} node 
     * @returns {string}
     */
    static toString(node) {
        let res;
        switch (node.className) {
            case 'BinOp':
                if (node.name == '+') {
                    res = `${this.toString(node.left)} ${node.name} ${this.toString(node.right)}`;
                }
                else if (node.name == '-') {
                    res = `${this.toString(node.left)} ${node.name} (${this.toString(node.right)})`;
                }
                else if (node.name == '/') {
                    res = `${this.toString(node.left)}${node.name}(${this.toString(node.right)})`;
                }
                else {
                    res = `${this.toString(node.left)}${node.name}${this.toString(node.right)}`;
                }
                break;
            case 'UnOp':
                res = `${node.name}${this.toString(node.argument)}`;
                break;
            case 'Var':
            case 'Const':
                res = node.name;
                break;
            case 'Num':
                res = `${node.val}`;
                break;
        }
        return node.inBrackets ? `(${res})` : res;
    }

    sum(inBrackets = false, isNegative = false) {
        let res = this.mul();

        if (this.lexer.lexKind.name === Tok.Add.name) {
            this.lexer.nextLexem();
            return new BinOp(isNegative ? '-' : '+', res, this.sum(isNegative, false), inBrackets);
        }

        if (this.lexer.lexKind.name === Tok.Sub.name) {
            this.lexer.nextLexem();
            return new BinOp(isNegative ? '+' : '-', res, this.sum(!isNegative, true), inBrackets);
        }

        res.inBrackets ||= inBrackets;
        return res;
    }

    mul(inBrackets = false, isDivided = false) {
        let res = this.exp();

        if (this.lexer.lexKind.name === Tok.Mul.name) {
            this.lexer.nextLexem();
            return new BinOp(isDivided ? '/' : '*', res, this.mul(isDivided, false), inBrackets);
        }

        if (this.lexer.lexKind.name === Tok.Div.name) {
            this.lexer.nextLexem();
            return new BinOp(isDivided ? '*' : '/', res, this.mul(!isDivided, true), inBrackets);
        }

        res.inBrackets ||= inBrackets;
        return res;
    }

    exp() {
        let res = this.end();
        if (this.lexer.lexKind.name === Tok.Exp.name) {
            this.lexer.nextLexem();
            return new BinOp('^', res, this.exp());
        }

        return res;
    }

    end() {
        let isSub = this.lexer.lexKind.name === Tok.Sub.name;
        if (isSub) {
            this.lexer.nextLexem();
        }

        let res;
        switch (this.lexer.lexKind.name) {
            case Tok.Num.name:
                res = this.num();
                break;
            case Tok.Var.name:
                res = this.variable();
                break;
            case Tok.Const.name:
                res = this.constant();
                break;
            case Tok.Func.name:
                res = this.func();
                break;
            case Tok.Open.name:
                res = this.bracketed();
                break;
            default:
                throw new Error(`Parser error. Expected number, vaiable, constant, function or expression in brackets. Received: "${this.lexer.lexKind.name}"`);
        }
        return isSub ? new UnOp('-', res) : res;
    }

    num() {
        let res = new Num(Number(this.lexer.lexText));
        this.lexer.nextLexem();
        return res;
    }
    variable() {
        let res = new Var(this.lexer.lexText);
        this.lexer.nextLexem();
        return res;
    }

    constant() {
        let res = new Const(this.lexer.lexText);
        this.lexer.nextLexem();
        return res;
    }

    func() {
        let name = this.lexer.lexText;
        this.lexer.nextLexem();
        if (this.lexer.lexKind.name === Tok.Open.name) {
            return new UnOp(name, this.bracketed());
        }
        throw new Error(`Parser error. Expected function argument in brackets. Received: "${this.lexer.lexKind.name}"`);
    }

    bracketed() {
        this.lexer.nextLexem();

        let res = this.sum(true);
        if (this.lexer.lexKind.name === Tok.Close.name) {
            this.lexer.nextLexem();
            return res;
        }

        throw new Error(`Parser error. Expected closing bracket`);
    }
}

export {
    Parser
}