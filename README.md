## 1、实现
source code
   ↓
Tokenizer（词法分析）
   ↓
Parser（语法分析）
   ↓
AST

## 2、源码结构
mini-acorn
 ├─ tokenizer
 │   ├─ token.js
 │   ├─ readToken.js
 │   └─ tokenTypes.js
 │
 ├─ parser
 │   ├─ parser.js
 │   ├─ statement.js
 │   ├─ expression.js
 │   └─ program.js
 │
 └─ ast
     └─ node.js