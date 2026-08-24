# dsh-voice-input · 语音输入插件

DSH（DeepSeek Harness）的对话框语音输入插件：在聊天输入条加一个 🎤 麦克风按钮，
用**浏览器内置的 Web Speech API（zh-CN）** 实时识别中文语音，说完自动把文字填入输入框草稿，
检查/修改后回车发送。**零配置、零密钥、纯浏览器能力**（Chrome / Edge）。

## 功能

- 输入条右侧麦克风按钮（`conversation.input.right` 插槽），点击开始聆听、再点或停顿结束；
- 聆听中显示实时转写与脉冲指示；结束后识别文本**追加到当前草稿**（不自动发送）；
- 权限被拒 / 无麦克风 / 网络受限等错误均有明确中文提示；
- 设置页「语音输入」标签（`settings.plugins.tab`）：浏览器支持状态 + 插件加载状态。

## 结构

```
src/
  host/index.ts     host 半端：/dsh-voice-input/health 健康路由（识别本身纯浏览器）
  client/index.ts   client 半端：麦克风按钮 + Web Speech API + 设置页
scripts/
  wrap-client.mjs      按官方 __ModuleLoader__.load 协议包装 client bundle
  self-test-client.mjs 结构/加载/注册三关自测
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

1. `npm run build` 确保 `lib/` 产物最新；
2. 在 `D:\CY\dsh\.dsh\profiles\web\package.json` 的 `dependencies` 加
   `"@hackerfish/dsh-voice-input": "file:D:/CY/dsh-voice-input"`，
   在 `dsh.profile.bundles` 加 `"@hackerfish/dsh-voice-input"`；
3. 在 `D:\CY\dsh\.dsh\profiles\web` 执行 `pnpm install`；
4. 重启 dsh（`node D:\CY\dsh\dsh-launch\launcher.js`），刷新页面。

## 说明与限制

- 识别依赖 Chrome/Edge 内置的在线语音识别服务；断网或服务不可达时报「网络受限」提示。
- 首次点击会请求麦克风权限（`getUserMedia` 预检），拒绝后有明确指引。
- 默认一次说一句：停顿自动结束（`continuous=false`），也可再点按钮提前结束。
- 识别结果只填入草稿，不自动发送，避免误识别直接发出。
