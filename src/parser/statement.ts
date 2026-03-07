import { Parser } from "./parser";
import { Node } from "../ast/node";
import { tokenTypeMap } from "../tokenizer/tokenTypes";
declare module './parser' {
    interface Parser {
        parseTopLevel( node: Node) : Node
        parseStatement( topLevel: boolean) : Node | undefined
        parseVarStatement( node: Node) : Node
    }
}
const pp = Parser.prototype
pp.parseTopLevel = function( node : Node) {
    if( !node.body ) node.body = []
    while( this.type !== tokenTypeMap.eof) {
        let stmt = this.parseStatement(true)
        if(stmt) node.body.push(stmt)
    }
    this.next()
    return this.finishNode(node,"Program")
}
pp.parseStatement = function( topLevel ) {
    let starttype = this.type, node = this.startNode(),kind;
    switch( starttype) {
        case tokenTypeMap._const : 
        return this.parseVarStatement(node)
    }
}
pp.parseVarStatement = function( node ) {
    this.next()
    return this.finishNode( node , 'VariableDeclaration')
}