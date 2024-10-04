import { Parser } from "../src/parser.js";

import { Node,
    BinOp,
    UnOp,
    Var,
    Const,
    Num } from "../src/node.js";

function expect_tree(input, varName, node) {
    let p = new Parser(input, varName);
    expect(p.parse()).toEqual(node);
}

test('tree building', () => {
    expect_tree('x+2', 'x', new BinOp('+', 
        new Var('x'), 
        new Num(2)
    ));

    expect_tree('a*(x + 10)', 'x', new BinOp('*', 
        new Const('a'),
        new BinOp(
            '+',
            new Var('x'),
            new Num(10),
            true
        )
    ));


    expect_tree('ln(x)^sqrt(x/a)', 'x', 
        new BinOp(
            '^',
            new UnOp('ln', new Var('x', true)),
            new UnOp('sqrt', new BinOp('/', 
                new Var('x'), 
                new Const('a', true),
                true
            )
            ),
        )
    );

    expect_tree('sin(x)+cos(x)', 'x', 
        new BinOp(
            '+',
            new UnOp('sin', new Var('x', true)),
            new UnOp('cos', new Var('x',true)),
        )
    );

    expect_tree('-x^-(a*b)', 'x', new BinOp('^', 
        new UnOp(
            '-',
            new Var('x')
        ),
        new UnOp(
            '-',
            new BinOp(
                '*',
                new Const('a'),
                new Const('b'),
                true
            ),
        )
    ));

    expect_tree('x^a^b', 'x', 
        new BinOp(
            '^',
            new Var('x'),
            new BinOp(
                '^',
                new Const('a'),
                new Const('b'),
            ),
        ),
    )
    
    expect_tree('(x^a)^b', 'x', 
        new BinOp(
            '^',
            new BinOp(
                '^',
                new Var('x'),
                new Const('a'),
                true
            ),
            new Const('b'),
        ),
    )
    
});

test('subtraction and division shenanigans', () => {
    expect_tree('x - a + b', 'x', 
        new BinOp(
            '-',
            new Var('x'),
            new BinOp('-',
                new Const('a'),
                new Const('b', true),
                true
            )
        )
    );

    expect_tree('x - 10 - 20 + 30', 'x', 
        new BinOp(
            '-',
            new Var('x'),
            new BinOp('+',
                new Num(10),
                new BinOp(
                    '-',
                    new Num(20),
                    new Num(30, true)
                ),
                true
            )
        )
    );

    expect_tree('x / a * b', 'x', 
        new BinOp(
            '/',
            new Var('x'),
            new BinOp('/',
                new Const('a'),
                new Const('b', true),
                true
            )
        )
    );

    expect_tree('x / 10 / 20 * 30', 'x', 
        new BinOp(
            '/',
            new Var('x'),
            new BinOp('*',
                new Num(10),
                new BinOp(
                    '/',
                    new Num(20),
                    new Num(30, true)
                ),
                true
            )
        )
    );
});

test('string from tree', () => {
    let binOp = new BinOp(
        '^',
        new BinOp(
            '+',
            new Var('x'),
            new Const('a'),
            true
        ),
        new BinOp(
            '*',
            new Const('a'),
            new Num(3),
            true
        )
    )

    let func = new UnOp(
        "ln",
        new BinOp(
            '+',
            new Var('a'),
            new UnOp(
                'ln',
                new Var('a', true),
            ),
            true
        )
    )
    
    let mul = new BinOp(
        "/",
        new Var('x'),
        new BinOp(
            '*',
            new Const('a'),
            new Const('b'),
        )
    )

    expect(Parser.toString(binOp)).toBe('(x + a)^(a*3)');
    expect(Parser.toString(func)).toBe('ln(a + ln(a))');
    expect(Parser.toString(mul)).toBe('x/(a*b)');
});

test('errors', () => {
    expect(()=>new Parser('x+x x', 'x').parse()).toThrow('Parser error. End of expression expected. Received: "var"');
    expect(()=>new Parser('x*x(', 'x').parse()).toThrow('Parser error. End of expression expected. Received: "("');

    expect(()=>new Parser('x^x*(', 'x').parse()).toThrow('Parser error. Expected number, vaiable, constant, function or expression in brackets. Received: "end"');
    expect(()=>new Parser('x-()', 'x').parse()).toThrow('Parser error. Expected number, vaiable, constant, function or expression in brackets. Received: ")"');

    expect(()=>new Parser('ln +', 'x').parse()).toThrow('Parser error. Expected function argument in brackets. Received: "+"');
    expect(()=>new Parser('ln 2', 'x').parse()).toThrow('Parser error. Expected function argument in brackets. Received: "num"');

    expect(()=>new Parser('((a+(a+b))', 'x').parse()).toThrow('Parser error. Expected closing bracket');
});