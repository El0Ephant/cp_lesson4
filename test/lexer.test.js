import { Lexer, Tok } from "../src/lexer.js";

function expect_lexemes(input, variable, expected) {
    let l = new Lexer(input, variable);
    let res = []
    while (l.lexKind !== Tok.End) {
        res.push(l.lexKind);
        l.nextLexem();
    }
    res.push(l.lexKind);
    expect(res).toEqual(expected);
}

test('operations', () => {
    expect_lexemes('x + 4', 'x', [Tok.Var, Tok.Add, Tok.Num, Tok.End]);
    expect_lexemes('-4*n', 'n', [Tok.Sub, Tok.Num, Tok.Mul, Tok.Var, Tok.End]);
    expect_lexemes('2*a+b^2', 'a', [Tok.Num, Tok.Mul, Tok.Var, Tok.Add, Tok.Const, Tok.Exp, Tok.Num, Tok.End]);
    expect_lexemes('(x1  +  10)/(x1  -  x2)', 'x1', [Tok.Open, Tok.Var, Tok.Add, Tok.Num, Tok.Close, Tok.Div, Tok.Open, Tok.Var, Tok.Sub, Tok.Const,  Tok.Close, Tok.End]);
});

test('functions', () => {
    expect_lexemes('ln(x)', 'x', [Tok.Func, Tok.Open, Tok.Var, Tok.Close, Tok.End]);
    expect_lexemes('sin(x)^2 + cos(x)^2', 'x', [Tok.Func, Tok.Open, Tok.Var, Tok.Close, Tok.Exp, Tok.Num, 
        Tok.Add, Tok.Func, Tok.Open, Tok.Var, Tok.Close, Tok.Exp, Tok.Num, Tok.End]);
    expect_lexemes('sqrt(x^2+x)', 'x', [Tok.Func, Tok.Open, Tok.Var, Tok.Exp, Tok.Num, Tok.Add, Tok.Var, Tok.Close, Tok.End]);
});

test('errors', () => {
    expect(() => new Lexer('2*ln + ln^2', 'ln')).toThrow('Lexer error. Variable name "ln" is reserved');
    expect(() => new Lexer('~', 'x')).toThrow('Lexer error. Token unknown: "~"');
    expect(() => new Lexer('0', '1ax')).toThrow('Lexer error. Incorrect variable name "1ax". Should start with letter and contain only alphanumericals');
    expect(() => new Lexer('0', 'ln(x)')).toThrow('Lexer error. Incorrect variable name "ln(x)". Should start with letter and contain only alphanumericals');
});