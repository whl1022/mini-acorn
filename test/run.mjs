import { parse } from "../dist/main.js";
const  code = 'const a = 123';
const tokens = []
const resTree = parse( code,{
    ecmaVersion: 2020,
    onToken: tokens
})
console.log('esTree--->',resTree)
console.log('token--->',tokens)
