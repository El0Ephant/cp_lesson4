import {
    isLetter, isDigit
} from './utils.js'


class Tok {
    static Add = new Tok('+');
    static Sub = new Tok('-');
    static Mul = new Tok('*');
    static Div = new Tok('/');
    static Exp = new Tok('^');
    static Open = new Tok('(');
    static Close = new Tok(')');
    static Func = new Tok('func');
    static Var = new Tok('var');
    static Const = new Tok('const');
    static Num = new Tok('num');
    static End = new Tok('end');

    constructor(name) {
        this.name = name;
    }

    /**
     * @param {string} name 
     * @returns {Tok}
     */
    static from(name) {
        if (!(Object.values(Tok).map((tok)=>tok.name).includes(name))) {
            throw new Error(`Lexer error. Token unknown: "${name}"`)
        }
        return new Tok(name);
    }

}

const reservedNames = ['ln', 'sin', 'cos', 'sqrt'];

class Lexer {
    /**
     * @param {string} input 
     * @param {string} varName 
     */
    constructor(input, varName) {
        if (!/^[a-zA-Z]\w*$/.test(varName)) {
            throw new Error(`Lexer error. Incorrect variable name "${varName}". Should start with letter and contain only alphanumericals`);
        }
        if (reservedNames.includes(varName)) {
            throw new Error(`Lexer error. Variable name "${varName}" is reserved`);
        }
        this.varName = varName;
        this.input = input;
        this._index = -1;
        this._currentChar = "";
        this.lexText = "";
        this.lexKind;

        this._nextChar();
        this.nextLexem();
    }

    _nextChar() {
        this.lexText += this._currentChar;
        this._index += 1;
        this._currentChar = this.input[this._index];
    }

    _passSpaces() {
        while (this._currentChar === ' ') {
            this._nextChar();
        }
    }

    nextLexem() {
        this._passSpaces();
        this.lexText = "";

        if (isLetter(this._currentChar)) {
            do {
                this._nextChar();
            } while (isLetter(this._currentChar) || isDigit(this._currentChar) || this._currentChar === '_');

            if (reservedNames.includes(this.lexText)) {
                this.lexKind = Tok.Func;
            }
            else if (this.lexText === this.varName) {
                this.lexKind = Tok.Var;
            }
            else {
                this.lexKind = Tok.Const;
            }
            return;
        }

        if (isDigit(this._currentChar)) {
            do {
                this._nextChar();
            } while (isDigit(this._currentChar));
            this.lexKind  = Tok.Num;
            return;
        }

        if (this._currentChar === undefined) {
            this.lexKind  = Tok.End;
            return;
        }
        
        this.lexKind = Tok.from(this._currentChar);
        this._nextChar();
    }
}

export {
    Lexer,
    Tok
}