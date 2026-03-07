import { Token } from '../tokenizer/token'
export interface optionsProp {
    ecmaVersion : number
    locations : boolean
    onToken ?: ( token : Token) => void | Array<Token> 
}
export const defaultOptions : optionsProp = {
    ecmaVersion: 6, // 解析的ecmaScript版本
    locations: true // 启用后会在ast节点上标注行列信息，方便插件获取后提示用户
}