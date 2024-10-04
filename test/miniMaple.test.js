import {
    symbolicEqual
  } from 'mathjs'
import {MiniMaple as m} from "../src/miniMaple";

function expect_derivative(input, variable, expected) {
    expect(symbolicEqual(m.deriviative(input, variable), expected)).toBeTruthy;
}

test('simple arithm', () => {
    expect_derivative('x*4 + 2', 'x', '4');
    expect_derivative('x*y - 6', 'y', 'x');
    expect_derivative('x*x + x + 2', 'y', '0');
    expect_derivative('x*x', 'x', '2*x');
    expect_derivative('1/x', 'x', '-1/x^2');
    expect_derivative('x*x*x', 'x', '3*x^2');
    expect_derivative('-10*x^2', 'x', '-20*x');
    expect_derivative('-x*-x', 'x', 'x');
});

test('power', () => {
    expect_derivative('3*x^2', 'x', '6*x');
    expect_derivative('2^x', 'y', '0');
    expect_derivative('2^x', 'x', '2^x*ln(2)');
    expect_derivative('x^y - y^y', 'y', 'x^y*ln(x) - y^y*(ln(y) + 1)');
    expect_derivative('(x^x)^x', 'x', '(x^x)^x*(ln(x^x)+x+x*ln(x))');
    expect_derivative('x^x^x', 'x', 'x ^ (x ^ x + x) * (ln(x) ^ 2 + ln(x)) + x ^ (x ^ x + x - 1)');
});

test('functions', () => {
    expect_derivative('ln(x)', 'x', '1/x');
    expect_derivative('ln(ln(x))', 'x', '1/(x*ln(x))');
    expect_derivative('sin(x)', 'x', 'cos(x)');
    expect_derivative('cos(x)', 'x', '-sin(x)');
    expect_derivative('sin(x^2)/x', 'x', '2*cos(x^2)-sin(x^2)/x^2');
    expect_derivative('sqrt(x^sin(x))', 'x', 'sqrt(x^sin(x))*(sin(x)+x*ln(x)*cos(x))/(2*x)');
});