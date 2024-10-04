/**
 * @param {string} char 
 * @returns 
 */
function isLetter(char) {
    return /^[a-zA-Z]$/.test(char);
}

/**
 * @param {string} char 
 * @returns 
 */
function isDigit(char) {
    return /^[0-9]$/.test(char);
}

export { isLetter, isDigit}
