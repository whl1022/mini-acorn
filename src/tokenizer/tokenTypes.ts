export type kwType = 'const' | 'var' | 'let'
interface TokenTypeConf {
    keyword?: string
    beforeExpr?: boolean
    startExpr?: boolean
    isAssign?: boolean
    isLoop?: boolean
}
export class TokenType  {
    label: string
    keyword: string
    beforeExpr: boolean // 后面可以跟表达式
    startExpr: boolean // 作为表达式的开头
    isAssign: boolean // 赋值符号
    isLoop: boolean // 循环

    constructor(label : string, conf : TokenTypeConf = {} ) {
        this.label = label
        const { keyword = '', beforeExpr = false, startExpr = false, isAssign = false, isLoop = false} = conf
        this.keyword = keyword
        this.beforeExpr = !!beforeExpr
        this.startExpr = !!startExpr
        this.isAssign = !!isAssign
        this.isLoop = !!isLoop
    }
}
const START_EXPR = { startExpr: true };
const BEFORE_EXPR = { beforeExpr: true };
function kw( name: string, options : TokenTypeConf = {}){
    options.keyword = name 
    return  new TokenType(name, options)
}
export const kwTokenMap : Record<kwType,TokenType> = {
    'const': kw('const'),
    'let': kw('let'),
    'var': kw('var')
}
export const tokenTypeMap = {
    num: new TokenType("num", START_EXPR), // 数字字面量
    string: new TokenType("string", START_EXPR), // 字符串字面量
    name: new TokenType("name", START_EXPR), // 变量标识符
    eof: new TokenType("eof"), // 文件结束
    // 运算符
    eq: new TokenType("=",{...BEFORE_EXPR, isAssign: true}),
    // es6 keywords
    _const: kwTokenMap.const,
    _let: kwTokenMap.let,
    _var: kwTokenMap.var
}