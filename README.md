# dsh-voice-input · Voice Input Plugin

[![GitHub](https://img.shields.io/badge/GitHub-hackerFish%2Fdsh--voice--input-181717?logo=github&logoColor=white)](https://github.com/hackerFish/dsh-voice-input)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![dsh](https://img.shields.io/badge/dsh%20ecosystem-plugin-4b32c3)](https://github.com/topics/dsh)

[中文](README.zh.md)

A voice-input plugin for DSH (DeepSeek Harness): adds a 🎤 mic button to the chat composer.
It uses the **browser-native Web Speech API (zh-CN)** to transcribe Chinese speech in real time;
when you finish speaking, the transcript is filled into the input draft for review/editing
before you press Enter to send. **Zero config, zero keys, pure browser capability** (Chrome / Edge).

## Features

- Mic button on the right side of the composer (`conversation.input.right` slot) — click to start listening, click again or pause to stop;
- Live transcript with a pulsing indicator while listening; the final text is **appended to the current draft** (never auto-sends);
- Clear error hints for denied permission / no microphone / restricted network / unsupported browser;
- Settings tab "Voice Input" (`settings.plugins.tab`): browser support status + plugin load status;
- **UI fully localized (zh / en)** — follows the DSH language preference automatically.

## Structure

```
src/
  host/index.ts     host half: /dsh-voice-input/health route (recognition itself is pure browser)
  client/index.ts   client half: mic button + Web Speech API + settings page (i18n zh/en)
scripts/
  wrap-client.mjs       wraps the client bundle with the official __ModuleLoader__.load protocol
  self-test-client.mjs  structure / load / registration assertions
tsup.config.ts      dual build: host (esm, node) + client (cjs, browser)
cordis.patch.yml   profile stack insertion patch
```

## Develop / Build

```bash
npm install
npm run build   # tsup build + client wrap + self-test
```

Outputs: `lib/host/index.mjs` (host), `lib/client/index.js` (client bundle).

## Install into dsh

Local development (a `file:` reference; reinstall after code changes):

1. `npm run build` to make sure `lib/` is up to date;
2. In the target profile's `package.json` (`$DSH_HOME/profiles/<profile>/package.json`):
   - add `"@hackerfish/dsh-voice-input": "file:<absolute path to the plugin dir>"` to `dependencies`;
   - add `"@hackerfish/dsh-voice-input"` to `dsh.profile.bundles`;
3. Run `pnpm install` in that profile directory;
4. Restart dsh and refresh the page — you will see the 🎤 button on the right of the composer.

Install from GitHub:

```bash
dsh plugin --profile web add https://github.com/hackerFish/dsh-voice-input
```

(or add `github:hackerFish/dsh-voice-input` to the profile's `dependencies` and run `pnpm install`.)

## Notes & Limitations

- Recognition depends on the online speech service built into Chrome/Edge; when offline or unreachable, a "network restricted" hint is shown.
- The first click requests microphone permission (a `getUserMedia` pre-check); a denial shows clear guidance.
- One utterance at a time: it stops automatically after a pause (`continuous=false`), or click again to stop early.
- The transcript only fills the draft and never auto-sends, so misrecognitions can be corrected before sending.
