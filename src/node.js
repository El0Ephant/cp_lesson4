class Node {
    /**
     * @param {boolean} inBrackets 
     */
    constructor(inBrackets = false) {
        this.className = 'Node'
        this.inBrackets = inBrackets;
    }
}

class BinOp extends Node {
    /**
     * @param {string} name 
     * @param {Node} left 
     * @param {Node} right 
     * @param {boolean} inBrackets 
     */
    constructor(name, left, right, inBrackets = false) {
        super(inBrackets);
        this.className = 'BinOp'
        this.name = name;
        this.left = left;
        this.right = right;
    }
}

class UnOp extends Node {
    /**
     * @param {string} name 
     * @param {Node} argument 
     * @param {boolean} inBrackets 
     */
    constructor(name, argument, inBrackets = false) {
        super(inBrackets);
        this.className = 'UnOp'
        this.name = name;
        this.argument = argument;
    }
}

class Var extends Node {
    /**
     * @param {string} name 
     * @param {boolean} inBrackets 
     */
    constructor(name, inBrackets = false) {
        super(inBrackets);
        this.className = 'Var'
        this.name = name;
    }
}

class Const extends Node {
    /**
     * @param {string} name 
     * @param {boolean} inBrackets 
     */
    constructor(name, inBrackets = false) {
        super(inBrackets);
        this.className = 'Const'
        this.name = name;
    }
}

class Num extends Node {
    /**
     * @param {number} val 
     * @param {boolean} inBrackets 
     */
    constructor(val, inBrackets = false) {
        super(inBrackets);
        this.className = 'Num'
        this.val = val;
    }
}

export {
    Node,
    BinOp,
    UnOp,
    Var,
    Const,
    Num
}