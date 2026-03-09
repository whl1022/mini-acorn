import { Parser } from '../parser/parser'
import { kwTokenMap, TokenType, tokenTypeMap, type kwType } from "./tokenTypes";
import { isIdentifierChar, isIdentifierStart } from "../utils/identifier";
import { SourceLocation } from '../utils/loc';
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
            this.loc = new SourceLocation( p.startLoc, p.endLoc)
        }
    }
}
declare module "../parser/parser" {
    interface Parser {
        next() : undefined
        nextToken() : undefined
        readToken( code: number) : undefined
        finishToken( type: TokenType , val ?: any) : undefined
        fullCharCodeAtPos() : number
        readWord() : undefined
        readWord1() : string
        getTokenFromCode( code : number) : undefined
        readToken_eq_excl( code : number) : undefined
        finishOp( token: TokenType, size: number) : undefined
        readNumber( startsWithDot: boolean) : undefined
        readInt( radix : number, len ?: number) : number | null
        skipSpace() : undefined
    }

}
const pp = Parser.prototype
pp.next = function() {
    if (this.options.onToken && typeof this.options.onToken === 'function')
      this.options.onToken(new Token(this))
    this.lastTokEnd = this.end
    this.lastTokStart = this.start
    this.lastTokEndLoc = this.endLoc
    this.lastTokStartLoc = this.startLoc
    this.nextToken()
  }
pp.nextToken = function() {
    this.skipSpace()
    this.start = this.pos
    if( this.options.locations ) this.startLoc = this.curPosition()
    if( this.pos >= this.input.length) return this.finishToken( tokenTypeMap.eof)
    this.readToken(this.fullCharCodeAtPos())
    
}
pp.skipSpace = function() {
  loop: while (this.pos < this.input.length) {
    let ch = this.input.charCodeAt(this.pos)
    switch (ch) {
    case 32: case 160: // ' '
      ++this.pos
      break
    case 13:
      if (this.input.charCodeAt(this.pos + 1) === 10) {
        ++this.pos
      }
    case 10: case 8232: case 8233:
      ++this.pos
      if (this.options.locations) {
        ++this.curLine
        this.lineStart = this.pos
      }
      break
    default:
      if (ch > 8 && ch < 14 || ch >= 5760 ) {
        ++this.pos
      } else {
        break loop
      }
    }
  }
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
pp.readWord = function() {
    let word = this.readWord1()
    let type = tokenTypeMap.name
    if( this.keywords.test(word)) {
        type = kwTokenMap[word as kwType]
    }
    return this.finishToken(type,word)
}
/* 
    读取完整的标识符
    相比较acorn6.0去掉了unicode转义字符的逻辑
*/
pp.readWord1 = function() {
    let word = '',first = true, chunkStart = this.pos;
    while(this.pos < this.input.length) {
        let ch = this.fullCharCodeAtPos()
        if( isIdentifierChar(ch)) {
            this.pos += ch <= 0xffff ? 1 : 2
        }else {
            break;
        }
        first = false
    }
    return word + this.input.slice(chunkStart,this.pos)
}
/*
    处理运算符、特殊符号、数字
*/
pp.getTokenFromCode = function (code) {
    switch(code) {
        case 61: // '='
        return this.readToken_eq_excl(code);
        case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: // 1-9
        return this.readNumber(false)
    }
}
/*
    处理赋值运算符
*/
pp.readToken_eq_excl = function(code) {
    if (code === 61) {
        return this.finishOp(tokenTypeMap.eq,1) 
    }
}
pp.finishOp = function(type, size) {
    let str = this.input.slice(this.pos, this.pos + size)
    this.pos += size
    return this.finishToken(type, str)
}
pp.readNumber = function( startsWithDot ) {
    let start = this.pos
    let str = this.input.slice(start, this.pos)
    let val = parseFloat(str)
    return this.finishToken(tokenTypeMap.num, val)
}
pp.readInt = function(radix,len){
    let start = this.pos, total = 0
    for (let i = 0, e = len == null ? Infinity : len; i < e; ++i) {
        let code = this.input.charCodeAt(this.pos), val
        if (code >= 97) val = code - 97 + 10 // a
        else if (code >= 65) val = code - 65 + 10 // A
        else if (code >= 48 && code <= 57) val = code - 48 // 0-9
        else val = Infinity
        if (val >= radix) break
        ++this.pos
        total = total * radix + val
    }
    if (this.pos === start || len != null && this.pos - start !== len) return null
    return total
}