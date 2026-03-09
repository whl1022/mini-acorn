import { Parser } from './parser/parser'
import './parser/location'
import './parser/statement'
import './tokenizer/token'
import type { optionsProp } from './parser/options'
import type { Token } from './tokenizer/token'
export { Parser } from './parser/parser'
export function parse(input: string, options: optionsProp) {
    return Parser.parse(input,options)
}
const code = "const a = 1"
const tokenArr : Token[] = []
parse(code, {
    ecmaVersion: 6,
    locations: true,
    onToken: tokenArr
})
console.log('tokenizer arr -->', tokenArr)