import { Parser } from "../parser/parser";
import { SourceLocation } from "../utils/loc";
import { Position } from "../utils/loc";
export class Node {
    type: string // 节点类型
    start: number 
    end: number
    loc : SourceLocation | null
    body ?: Array<Node>
    constructor( parser:  Parser, pos: number, loc: Position | null) {
        this.type = ''
        this.start = pos
        this.end = 0
        this.loc = null
        if( parser.options.locations){
            this.loc = new SourceLocation( loc, null)
        }
    }
}
declare module '../parser/parser' {
    interface Parser {
        startNode() : Node
        finishNode( node : Node, type : string) : Node
        finishNodeAt( node : Node, type : string, pos : number, loc : Position | null) : Node
    }
}
const pp = Parser.prototype
pp.startNode = function() {
    return new Node(this, this.start, this.startLoc)
}
function finishNodeAt( this: Parser, node: Node, type: string, pos: number, loc : Position | null ) {
    node.type = type
    node.end = pos
    if( this.options.locations && node.loc) {
        node.loc.end = loc
    } 
    return node
}
pp.finishNode = function(node, type) {
    return finishNodeAt.call( this, node,type, this.lastTokEnd, this.lastTokEndLoc)
}
pp.finishNodeAt = function(node,type , pos, loc) {
    return finishNodeAt.call(this, node, type, pos, loc)
}