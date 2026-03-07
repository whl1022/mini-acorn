import { TokenType } from "../tokenizer/tokenTypes"
import type { optionsProp } from "./options"
import { defaultOptions } from "./options"
import  { keywords } from '../tokenizer/tokenTypes'
import { Position } from "../utils/loc"
function keywordRegexp( words : string) {
    return new RegExp( "^(?:" + words.replace(/ /g,'|') + ")$")
}
export class Parser {
    input: string
    options: optionsProp
    keywords: RegExp
    pos: number // 当前索引
    start: number
    end: number
    lineStart: number // token在当前行的起始索引
    curLine: number //当前行号
    startLoc: Position | null // 当前ast节点的开始位置
    endLoc: Position | null // 当前ast节点的结束位置
    lastTokStart: number
    lastTokEnd: number
    lastTokStartLoc: Position | null
    lastTokEndLoc: Position | null
    type:  TokenType | null // 当前tokenType
    value: any
   
    constructor( options: optionsProp, input: string) {
        if (Array.isArray(options.onToken)) {
            let tokens = options.onToken
            options.onToken = (token) => { tokens.push(token) }
        }
        this.options = Object.assign({}, defaultOptions ,options)
        this.keywords = keywordRegexp( keywords)
        this.input = String(input)
        this.type = null
        this.value = undefined
        this.pos = this.lineStart = 0
        this.start = this.end = this.pos
        this.curLine = 1
        this.startLoc = this.endLoc = this.curPosition()
        this.lastTokEnd = this.lastTokStart = this.pos
        this.lastTokEndLoc = this.lastTokStartLoc = null
       
    }
    // 插件扩展Parser
    static extend( ...plugins : Array<(cls: typeof Parser ) => typeof Parser>) {
        let cls : typeof Parser = this
        for(const plugin of plugins){
            cls =  plugin(cls)
        }
        return cls
    }
    parse() {
        let node = this.startNode()
        this.nextToken()
        return this.parseTopLevel(node)
    }
    static parse(input: string,options: optionsProp) {
        return new this(options,input).parse()
    }
}