import { TokenType, tokenTypeMap } from "./tokenTypes";
import { Parser } from '../parser/parser'
import { isIdentifierStart } from "../utils/identifier";
class SourceLocation {
    start: { line: number; column: number }
    end: { line: number; column: number }
  
    constructor(p: any, startLoc: { line: number; column: number }, endLoc: { line: number; column: number }) {
      this.start = startLoc
      this.end = endLoc
    }
  }
export class Token {
    type:  TokenType | null
    value: string | null
    start: number
    end: number
    loc ?: SourceLocation
    range ?: [number,number]

    constructor(p : Parser) {
        this.type = p.type
        this.value = p.value
        this.start = p.start
        this.end = p.end
        if (p.options.locations && p.startLoc && p.endLoc) {
            this.loc = new SourceLocation(this, p.startLoc, p.endLoc)
        }
    }
}
declare module "../parser/parser" {
    interface Parser {
        next() : undefined
        nextToken() : undefined
        readToken( code: number) : Token
        finishToken( type: TokenType , val ?: any) : undefined
        fullCharCodeAtPos() : number
    }

}
const pp = Parser.prototype
pp.next = function() {
    if (this.options.onToken)
      this.options.onToken(new Token(this))
    this.lastTokEnd = this.end
    this.lastTokStart = this.start
    this.lastTokEndLoc = this.endLoc
    this.lastTokStartLoc = this.startLoc
    this.nextToken()
  }
pp.nextToken = function() {
    this.start = this.pos
    if( this.options.locations ) this.startLoc = this.curPosition()
    if( this.pos >= this.input.length) return this.finishToken( tokenTypeMap.eof)
    this.readToken(this.fullCharCodeAtPos())
    
}
pp.readToken = function( code ) {
    if( isIdentifierStart(code) || code === 92 /* '\' */){
        return this.readWord() // 标识符
    }
    return this.getTokenFromCode(code) // 特殊字符 运算符 
}
// 解析字符的unicode编码
pp.fullCharCodeAtPos = function() {
    let code = this.input.charCodeAt(this.pos)
    if (code <= 0xd7ff || code >= 0xe000) return code // 两个字节内可以表示的字符
    let next = this.input.charCodeAt(this.pos + 1)  // 表情包 生僻字 等需要四个字节才能表示的字符
    return (code << 10) + next - 0x35fdc00
}
pp.finishToken = function( type: TokenType, val ?: any) {
    this.end = this.pos
    if( this.options.locations) this.endLoc = this.curPosition()
    this.type = type
    this.value = val
}
