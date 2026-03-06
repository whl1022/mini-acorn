class SourceLocation {
    start: { line: number; column: number }
    end: { line: number; column: number }
  
    constructor(p: any, startLoc: { line: number; column: number }, endLoc: { line: number; column: number }) {
      this.start = startLoc
      this.end = endLoc
    }
  }
// 定义 Token 构造函数参数的类型
interface TokenParams {
    type: any
    value: string | null
    start: number
    end: number
    startLoc?: { line: number; column: number }
    endLoc?: { line: number; column: number }
    options: {
        locations?: boolean
        ranges?: boolean
    }
}

class Token {
    type: any
    value: string | null
    start: number
    end: number
    loc ?: SourceLocation
    range ?: [number,number]

    constructor(p : TokenParams) {
        this.type = p.type
        this.value = p.value
        this.start = p.start
        this.end = p.end
        if (p.options.locations && p.startLoc && p.endLoc) {
            this.loc = new SourceLocation(this, p.startLoc, p.endLoc)
        }
        if (p.options.ranges) {
            this.range = [p.start,p.end]
        }
    }
}