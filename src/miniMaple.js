import {
    simplify
} from 'mathjs'

import { Parser } from "./parser.js";

import { Node,
    BinOp,
    UnOp,
    Var,
    Const,
    Num } from "./node.js";


class MiniMaple {
    /**
     * @param {string} input 
     * @param {string} varName 
     * @param {boolean} raw 
     * @returns {string}
     */
    static deriviative(input, varName, raw=false) {
        let parser = new Parser(input, varName);
        let node = parser.parse();
        let res = Parser.toString(this._deriviate(node));
        return raw ? res : simplify(res).toString();
    }

    static _deriviate(node) {
        switch(node.className) {
            case 'BinOp':
                return this._deriviateBinOp(node);
            case 'UnOp':
                return this._deriviateUnOp(node);
            case 'Var':
                return new Num(1);
            case 'Const':
            case 'Num':
                return new Num(0);
        }
    }
    static _deriviateBinOp(binOp) {
        switch (binOp.name) {
            case '+':
            case '-':
                return new BinOp(
                    binOp.name,
                    this._deriviate(binOp.left),
                    this._deriviate(binOp.right),
                    binOp.inBrackets
                );
            case '*':
                return new BinOp(
                    '+',
                    new BinOp(
                        '*',
                        this._deriviate(binOp.left),
                        binOp.right
                    ),
                    new BinOp(
                        '*',
                        binOp.left,
                        this._deriviate(binOp.right)
                    ),
                    true // ???
                );
            case '/':
                return new BinOp(
                    '/',
                    new BinOp(
                        '-',
                        new BinOp(
                            '*',
                            this._deriviate(binOp.left),
                            binOp.right
                        ),
                        new BinOp(
                            '*',
                            binOp.left,
                            this._deriviate(binOp.right)
                        ),
                        true
                    ),
                    new BinOp(
                        '^',
                        binOp.right,
                        new Num(2),
                    ),
                    binOp.inBrackets
                );
            case '^':
                let lnArg = {...binOp.left};
                lnArg.inBrackets = true;
                return new BinOp(
                    '*',
                    new BinOp(
                        '^',
                        binOp.left,
                        binOp.right
                    ),
                    this._deriviateBinOp(
                        new BinOp(
                            '*',
                            new UnOp(
                                'ln',
                                lnArg
                            ),
                            binOp.right,
                        )
                    ),
                    true //???
                )
        }
    }
    static _deriviateUnOp(unOp) {
        switch (unOp.name) {
            case '-':
                return new UnOp(
                    '-',
                    this._deriviate(unOp.argument)
                );
            case 'ln':
                return this._chainRule(
                    new BinOp(
                        '/',
                        new Num(1),
                        unOp.argument
                    ), 
                unOp.argument);
            case 'sin':
                return this._chainRule(
                    new UnOp(
                        'cos',
                        unOp.argument               
                    ),
                    unOp.argument
                );
            case 'cos':
                return this._chainRule(
                    new UnOp(
                        '-',
                        new UnOp(
                            'sin',
                            unOp.argument
                        )             
                    ),
                    unOp.argument
                );
            case 'sqrt':
                return this._chainRule(
                    new BinOp(
                        '/',
                        new Num(1),
                        new BinOp(
                            '*',
                            new Num(2),
                            new UnOp(
                                'sqrt',
                                unOp.argument
                            ),
                            true
                        )
                    ),
                    unOp.argument
                );
        }
    }

    static _chainRule(functionDeriviate, argument) {
        return new BinOp(
            '*',
            functionDeriviate,
            this._deriviate(argument),
            //true
        )
    }
    
}

export { MiniMaple }