import { Parser } from './parser'
import { Position } from '../utils/loc'
declare module './parser' {
    interface Parser {
        curPosition() : Position | null
    }
} 
const pp = Parser.prototype
pp.curPosition = function() {
    if(this.options.locations) {
        return new Position( this.curLine, this.pos - this.lineStart)
    }
    return null
}