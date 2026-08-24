// 客户端包自测：在 Node 里模拟 DSH 浏览器的 __ModuleLoader__ 加载协议，
// 断言结构、加载、注册三关（对齐 dsh-video-studio 的自测脚本）。
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import assert from 'node:assert/strict'

const PKG_ID = '@hackerfish/dsh-voice-input'
const code = readFileSync(new URL('../lib/client/index.js', import.meta.url), 'utf8')

// ── 静态结构断言 ──
assert.ok(code.startsWith('window.__ModuleLoader__.load({'), '① 缺少 __ModuleLoader__.load 注册调用')
assert.ok(code.includes(`id: "${PKG_ID}"`), '② 包名 id 错误')
assert.ok(code.includes('var module = { exports: {} };'), '③ 缺 module 声明')
assert.ok(code.includes('var exports = module.exports;'), '④ 缺 exports 声明')
assert.ok(code.includes('require("react")'), '⑤ React 未外置')
assert.ok(code.trimEnd().endsWith('});'), '⑥ 尾部结构错误')

// ── 动态模拟：执行 bundle ──
const requireReal = createRequire(import.meta.url)
const loaded = { exports: null }
const fakeWindow = {
  __ModuleLoader__: {
    load(entry) {
      assert.equal(entry.id, PKG_ID, '加载器收到的 id 不匹配')
      loaded.exports = entry.factory((spec) => {
        if (spec === 'react') return requireReal('react')
        if (spec === 'react-dom') return requireReal('react-dom')
        if (spec === 'react/jsx-runtime') return requireReal('react/jsx-runtime')
        throw new Error('意外 require: ' + spec)
      })
    },
  },
}
// eslint-disable-next-line no-new-func
new Function('window', code)(fakeWindow)
assert.ok(loaded.exports, '⑦ factory 未被执行')
assert.equal(typeof loaded.exports.apply, 'function', '⑧ apply 导出缺失')
assert.ok(Array.isArray(loaded.exports.inject), '⑨ inject 导出缺失')

// ── apply(ctx) 冒烟：确认 locale 字典注册 + 两处 slot 注册 ──
const registered = []
const localeCalls = []
const ctx = {
  slots: {
    inject: (_slot, thunk) => { registered.push(thunk()); return () => {} },
    register: (opts) => ({ ...opts }),
  },
  effect: (fn) => { fn(); return () => {} },
  locale: {
    register: (ns, dicts) => { localeCalls.push({ ns, dicts }); return () => {} },
    bind: () => (key) => key,
  },
}
loaded.exports.apply(ctx)
assert.ok(localeCalls.length >= 1, '⑩ 未注册 locale 字典')
const lc = localeCalls[0]
assert.equal(lc.ns, 'voice.input', '⑪ locale 命名空间错误')
assert.ok(lc.dicts.zh && lc.dicts.zh['mic.listening'], '⑫ 缺 zh 字典')
assert.ok(lc.dicts.en && lc.dicts.en['mic.listening'], '⑬ 缺 en 字典')
assert.ok(registered.some((r) => r.name === 'conversation.input.right' && r.id === 'voice-input' && r.locale === 'voice.input'), '⑭ 麦克风按钮未注册/缺 locale')
assert.ok(registered.some((r) => r.name === 'settings.plugins.tab' && r.id === 'voice-input-settings' && r.locale === 'voice.input'), '⑮ 设置页未注册/缺 locale')

console.log('✅ client 包自测通过：结构 6 项 + 加载 3 项 + locale/注册 6 项，共 15 项断言')
