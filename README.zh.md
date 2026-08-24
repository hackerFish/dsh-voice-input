# dsh-voice-input · 语音输入插件

[![GitHub](https://img.shields.io/badge/GitHub-hackerFish%2Fdsh--voice--input-181717?logo=github&logoColor=white)](https://github.com/hackerFish/dsh-voice-input)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![dsh](https://img.shields.io/badge/dsh%20ecosystem-plugin-4b32c3)](https://github.com/topics/dsh)

[English](README.md)

DSH（DeepSeek Harness）的对话框语音输入插件：在聊天输入条加一个 🎤 麦克风按钮，
用**浏览器内置的 Web Speech API（zh-CN）** 实时识别中文语音，说完自动把文字填入输入框草稿，
检查/修改后回车发送。**零配置、零密钥、纯浏览器能力**（Chrome / Edge）。

## 功能

- 输入条右侧麦克风按钮（`conversation.input.right` 插槽），点击开始聆听、再点或停顿结束；
- 聆听中显示实时转写与脉冲指示；结束后识别文本**追加到当前草稿**（不自动发送）；
- 权限被拒 / 无麦克风 / 网络受限 / 浏览器不支持等错误均有明确提示；
- 设置页「语音输入」标签（`settings.plugins.tab`）：浏览器支持状态 + 插件加载状态；
- **UI 全量国际化（中 / 英）**：跟随 DSH 的语言偏好自动切换。

## 结构

```
src/
  host/index.ts     host 半端：/dsh-voice-input/health 健康路由（识别本身纯浏览器）
  client/index.ts   client 半端：麦克风按钮 + Web Speech API + 设置页（zh/en 国际化）
scripts/
  wrap-client.mjs      按官方 __ModuleLoader__.load 协议包装 client bundle
  self-test-client.mjs 结构 / 加载 / 注册三关自测
tsup.config.ts      host(esm,node) + client(cjs,browser) 双构建
cordis.patch.yml   profile 层栈插入补丁
```

## 开发 / 构建

```bash
npm install
npm run build   # tsup 构建 + client 包装 + 自测
```

产物：`lib/host/index.mjs`（host）、`lib/client/index.js`（client bundle）。

## 安装到 dsh

本地开发（`file:` 引用，改代码后需重装才生效）：

1. `npm run build` 确保 `lib/` 产物最新；
2. 在目标 profile 的 `package.json`（`$DSH_HOME/profiles/<profile>/package.json`）中：
   - `dependencies` 加 `"@hackerfish/dsh-voice-input": "file:<本机插件目录绝对路径>"`；
   - `dsh.profile.bundles` 加 `"@hackerfish/dsh-voice-input"`；
3. 在该 profile 目录执行 `pnpm install`；
4. 重启 dsh，刷新页面即可看到输入条右侧的 🎤 按钮。

GitHub 安装：

```bash
dsh plugin --profile web add https://github.com/hackerFish/dsh-voice-input
```

（或手动把 `github:hackerFish/dsh-voice-input` 加进 profile 的 dependencies 后 `pnpm install`。）

## 说明与限制

- 识别依赖 Chrome/Edge 内置的在线语音识别服务；断网或服务不可达时报「网络受限」提示。
- 首次点击会请求麦克风权限（`getUserMedia` 预检），拒绝后有明确指引。
- 默认一次说一句：停顿自动结束（`continuous=false`），也可再点按钮提前结束。
- 识别结果只填入草稿，不自动发送，避免误识别直接发出。
