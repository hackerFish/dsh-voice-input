// 官方 client-modules 注册协议（对齐线上产物格式）：
// window.__ModuleLoader__.load({ id: "<包名>", factory: (require) => { ...CJS 主体... } })
// require 由宿主 createRequire 提供 → react / react-dom 全部解析到宿主真实包，不打进 bundle。
import { readFileSync, writeFileSync } from 'node:fs'

const PKG_ID = '@hackerfish/dsh-voice-input'
const file = new URL('../lib/client/index.js', import.meta.url)
const body = readFileSync(file, 'utf8')
const wrapped = `window.__ModuleLoader__.load({\n  id: "${PKG_ID}",\n  factory: (require) => {\n    var module = { exports: {} };\n    var exports = module.exports;\n${body}\n    return module.exports;\n  }\n});\n`
writeFileSync(file, wrapped)
console.log('client bundle wrapped: __ModuleLoader__.load(' + PKG_ID + ')')
