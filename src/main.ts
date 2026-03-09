import './tokenizer/token'
import { Parser } from './parser/parser'
import './parser/location'
import './parser/statement'
import type { optionsProp } from './parser/options'
export function parse(input: string, options: optionsProp) {
    return Parser.parse(input,options)
}