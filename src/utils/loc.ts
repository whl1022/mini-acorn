export class Position {
    line: number
    column: number

    constructor( line : number, column : number ) {
        this.line = line
        this.column = column
    }
    offset (n : number) {
        return new Position( this.line, this.column + n)
    }
}

export class SourceLocation {
    start : Position  | null
    end: Position  | null
    constructor( start : Position | null, end : Position | null) {
        this.start = start
        this.end = end
    }
}