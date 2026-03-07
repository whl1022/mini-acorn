// 该字符是否可以作为标识符的开头
export function isIdentifierStart(code : number) {
    if (code < 65) return code === 36 // 是否是$符号
    if (code < 91) return true // 大写字母
    if (code < 97) return code === 95 // 是否是_
    if (code < 123) return true // 小写字母
    return false
}
// 该字符的unicode编码是否是js标识符规则允许
export function isIdentifierChar(code : number) {
    if (code < 48) return code === 36
    if (code < 58) return true
    if (code < 65) return false
    if (code < 91) return true
    if (code < 97) return code === 95
    if (code < 123) return true
    return false
}