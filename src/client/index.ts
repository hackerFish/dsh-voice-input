// 语音输入 client 半端（P1）：composer 输入条麦克风按钮 + 浏览器内置 Web Speech API（zh-CN）。
// 注册模式照 dsh-client-ui-input-trigger（conversation.input.* 先例）：
// conversation.input.right（list, session）→ 按钮；settings.plugins.tab → 状态页。
// 文案走官方 locale 机制：ctx.locale.register(NS, {zh, en}) + slot locale: NS → 组件收 t(key, params)。
// NOTE: React 由 DSH client 运行时提供；本文件经 tsup 打进 lib/client.js 后由 wrap-client.mjs 包装。

import { useState, useEffect, useRef, createElement } from 'react'

export const inject = ['slots', 'locale']

// ── 语言字典：命名空间 voice.input（zh / en） ──
const VOICE_NS = 'voice.input'

const zh = {
  'settings.tabLabel': '语音输入',
  // 麦克风按钮
  'mic.title.idle': '语音输入（说中文，说完自动填入输入框）',
  'mic.title.listening': '结束语音输入',
  'mic.title.unsupported': '当前浏览器不支持语音识别（请用 Chrome / Edge）',
  'mic.label.idle': '语音输入',
  'mic.label.listening': '结束语音输入',
  'mic.listening': '聆听中… ',
  // 错误提示
  'mic.err.unsupported': '当前浏览器不支持语音识别，请使用 Chrome 或 Edge',
  'mic.err.permission': '麦克风权限被拒绝——点击地址栏左侧图标，允许使用麦克风后重试',
  'mic.err.noSpeech': '没有听到声音，请靠近麦克风再试',
  'mic.err.noDevice': '找不到可用的麦克风设备',
  'mic.err.network': '语音识别服务不可用（网络受限？可稍后重试）',
  'mic.err.generic': '语音识别出错：{code}',
  'mic.err.startFailed': '语音识别启动失败，请重试',
  // 设置页
  'settings.title': '语音输入',
  'settings.engine': '识别引擎：浏览器内置 Web Speech API（zh-CN）',
  'settings.engineDesc': '无需配置、无需密钥，识别在浏览器内完成（Chrome / Edge 内置服务，需要能访问其在线识别接口）。',
  'settings.supported': '✅ 当前浏览器支持语音识别',
  'settings.unsupported': '⚠️ 当前浏览器不支持语音识别——请使用 Chrome 或 Edge 打开本界面。',
  'settings.usageTitle': '用法',
  'settings.usage1': '1. 在对话框输入条点击 🎤 麦克风按钮（首次会请求麦克风权限，请允许）',
  'settings.usage2': '2. 直接说话，说完停顿一下即自动结束（也可再点一次提前结束）',
  'settings.usage3': '3. 识别文字自动填入输入框草稿，检查/修改后按回车发送。',
  'settings.statusTitle': '插件状态',
  'settings.status.loading': '正在读取…',
  'settings.status.loaded': '✅ host 已加载（version {version} · {engine}）',
  'settings.status.error': '❌ {error}',
}

const en: Record<string, string> = {
  'settings.tabLabel': 'Voice Input',
  // Mic button
  'mic.title.idle': 'Voice input (speak Chinese; the transcript is filled into the draft)',
  'mic.title.listening': 'Stop voice input',
  'mic.title.unsupported': 'Speech recognition unsupported in this browser (use Chrome / Edge)',
  'mic.label.idle': 'Voice input',
  'mic.label.listening': 'Stop voice input',
  'mic.listening': 'Listening… ',
  // Errors
  'mic.err.unsupported': 'Speech recognition is not supported in this browser — use Chrome or Edge',
  'mic.err.permission': 'Microphone permission denied — click the icon at the left of the address bar to allow the microphone, then retry',
  'mic.err.noSpeech': 'No speech detected — try again closer to the microphone',
  'mic.err.noDevice': 'No usable microphone device found',
  'mic.err.network': 'Speech recognition service unavailable (network restricted? retry later)',
  'mic.err.generic': 'Speech recognition error: {code}',
  'mic.err.startFailed': 'Failed to start speech recognition — please retry',
  // Settings page
  'settings.title': 'Voice Input',
  'settings.engine': 'Engine: browser-native Web Speech API (zh-CN)',
  'settings.engineDesc': 'No config, no keys — recognition runs inside the browser (Chrome/Edge built-in service; needs access to its online recognition API).',
  'settings.supported': '✅ Speech recognition is supported in this browser',
  'settings.unsupported': '⚠️ Speech recognition is not supported in this browser — open this page in Chrome or Edge.',
  'settings.usageTitle': 'Usage',
  'settings.usage1': '1. Click the 🎤 mic button in the composer (the first click asks for microphone permission — allow it)',
  'settings.usage2': '2. Just speak; it stops automatically after a pause (or click again to stop early)',
  'settings.usage3': '3. The transcript is filled into the draft — review/edit it, then press Enter to send.',
  'settings.statusTitle': 'Plugin status',
  'settings.status.loading': 'Loading…',
  'settings.status.loaded': '✅ host loaded (version {version} · {engine})',
  'settings.status.error': '❌ {error}',
}

// ── Web Speech API 能力探测（Chrome / Edge 内置） ──
function speechRecognitionCtor(): any | null {
  const w = window as any
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

const PULSE_KEYFRAMES =
  '@keyframes dsh-voice-input-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.65); } }'
let pulseStyleInjected = false
function ensurePulseStyle(): void {
  if (pulseStyleInjected || typeof document === 'undefined') return
  pulseStyleInjected = true
  const el = document.createElement('style')
  el.textContent = PULSE_KEYFRAMES
  document.head.appendChild(el)
}

function MicIcon({ size = 15 }: { size?: number }): any {
  return createElement('svg', {
    viewBox: '0 0 24 24',
    width: size,
    height: size,
    'aria-hidden': true,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
    createElement('path', { d: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z' }),
    createElement('path', { d: 'M19 10v2a7 7 0 0 1-14 0v-2' }),
    createElement('line', { x1: '12', y1: '19', x2: '12', y2: '22' }),
  )
}

// ── 麦克风按钮：conversation.input.right ──
// 标准 kit 提供 useInput（draft 快照）、inputActions（setDraft/submit）与 t（locale 绑定）。
function MicButton(props: any): any {
  const { useInput, inputActions, t } = props
  const input = useInput((s: any) => s)
  const draftRef = useRef('')
  draftRef.current = input?.draft ?? '' // 每次渲染同步最新草稿（识别结束时用最新值合并）
  const supported = speechRecognitionCtor() !== null
  const [state, setState] = useState<'idle' | 'listening' | 'starting'>('idle')
  const [hint, setHint] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hover, setHover] = useState(false)
  const recRef = useRef<any>(null)
  const finalRef = useRef('')
  const liveRef = useRef(false)
  const busyRef = useRef(false)
  const errorTimerRef = useRef<number | null>(null)

  useEffect(() => {
    ensurePulseStyle()
    return () => {
      liveRef.current = false
      try { recRef.current?.abort() } catch { /* 忽略 */ }
      if (errorTimerRef.current !== null) window.clearTimeout(errorTimerRef.current)
    }
  }, [])

  const showError = (text: string): void => {
    setError(text)
    if (errorTimerRef.current !== null) window.clearTimeout(errorTimerRef.current)
    errorTimerRef.current = window.setTimeout(() => setError(null), 5000)
  }

  const commit = (text: string): void => {
    const base = (draftRef.current ?? '').trimEnd()
    const merged = base === '' ? text : base + ' ' + text
    if (merged.trim() !== '' && typeof inputActions?.setDraft === 'function') {
      inputActions.setDraft(merged)
    }
  }

  const stopRecognition = (): void => {
    try { recRef.current?.stop() } catch { /* 忽略 */ }
  }

  const startRecognition = async (): Promise<void> => {
    if (busyRef.current) return // 防重入：权限等待/启动中忽略连点
    const Ctor = speechRecognitionCtor()
    if (!Ctor) { showError(t('mic.err.unsupported')); return }
    busyRef.current = true
    setState('starting')
    setError(null)
    setHint(null)
    // 预检麦克风权限：失败时给出明确提示（SpeechRecognition 的权限报错较隐晦）
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
    } catch {
      busyRef.current = false
      setState('idle')
      showError(t('mic.err.permission'))
      return
    }
    const rec = new Ctor()
    rec.lang = 'zh-CN'
    rec.interimResults = true
    rec.continuous = false // 停顿自动结束，一次点击说一句
    rec.maxAlternatives = 1
    finalRef.current = ''
    liveRef.current = true
    rec.onresult = (e: any) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) finalRef.current += r[0].transcript
        else interim += r[0].transcript
      }
      setHint(finalRef.current + interim)
    }
    rec.onerror = (e: any) => {
      liveRef.current = false
      busyRef.current = false
      const code = e?.error
      if (code === 'not-allowed' || code === 'service-not-allowed') {
        showError(t('mic.err.permission'))
      } else if (code === 'no-speech') {
        showError(t('mic.err.noSpeech'))
      } else if (code === 'audio-capture') {
        showError(t('mic.err.noDevice'))
      } else if (code === 'network') {
        showError(t('mic.err.network'))
      } else if (code !== 'aborted') {
        showError(t('mic.err.generic', { code: String(code) }))
      }
      setState('idle')
      setHint(null)
    }
    rec.onend = () => {
      liveRef.current = false
      busyRef.current = false
      const text = finalRef.current.trim()
      if (text !== '') commit(text)
      setState('idle')
      setHint(null)
    }
    recRef.current = rec
    try {
      rec.start()
      setState('listening')
    } catch {
      busyRef.current = false
      setState('idle')
      showError(t('mic.err.startFailed'))
    }
  }

  const onToggle = (): void => {
    if (state === 'listening' || state === 'starting') stopRecognition()
    else void startRecognition()
  }

  const listening = state === 'listening' || state === 'starting'
  const btnStyle: Record<string, string | number> = {
    width: 28,
    height: 28,
    borderRadius: 8,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: 0,
    border: 'none',
    cursor: supported ? 'pointer' : 'not-allowed',
    background: listening
      ? 'var(--dsw-alias-state-warn-tertiary, rgba(255,171,0,.18))'
      : hover && supported
        ? 'var(--dsw-alias-interactive-bg-hover, rgba(128,128,128,.14))'
        : 'transparent',
    color: listening
      ? 'var(--dsw-alias-state-warn-primary, #b3870e)'
      : 'var(--dsw-alias-label-secondary, rgba(128,128,128,.9))',
    transition: 'background .15s ease, color .15s ease',
  }
  const statusStyle: Record<string, string | number> = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    maxWidth: 200,
    fontSize: 12,
    lineHeight: '18px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    color: 'var(--dsw-alias-label-secondary, rgba(128,128,128,.9))',
  }
  return createElement('div', { style: { display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 } },
    (hint !== null || error !== null) && createElement('div', { style: statusStyle, 'aria-live': 'polite' },
      listening && createElement('span', {
        style: {
          width: 8,
          height: 8,
          borderRadius: '50%',
          flexShrink: 0,
          background: 'var(--dsw-alias-state-error-primary, #c83c3c)',
          animation: 'dsh-voice-input-pulse 1.2s ease-in-out infinite',
        },
      }),
      error !== null
        ? createElement('span', { style: { color: 'var(--dsw-alias-state-error-primary, #c83c3c)' } }, '⚠ ' + error)
        : createElement('span', { style: { textOverflow: 'ellipsis', overflow: 'hidden' } },
            listening ? t('mic.listening') + (hint ?? '') : (hint ?? '')),
    ),
    createElement('button', {
      type: 'button',
      title: supported
        ? (listening ? t('mic.title.listening') : t('mic.title.idle'))
        : t('mic.title.unsupported'),
      'aria-label': listening ? t('mic.label.listening') : t('mic.label.idle'),
      'aria-pressed': listening,
      disabled: !supported,
      onClick: onToggle,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: btnStyle,
    }, createElement(MicIcon, { size: 15 })),
  )
}

// ── 设置页：settings.plugins.tab ──
function VoiceSettingsPanel(props: any): any {
  const { t } = props
  const [health, setHealth] = useState<any>(null)
  const supported = typeof window !== 'undefined' && speechRecognitionCtor() !== null
  useEffect(() => {
    let alive = true
    fetch('/dsh-voice-input/health', { cache: 'no-store' })
      .then((r: any) => r.json())
      .then((d: any) => { if (alive) setHealth(d) })
      .catch(() => { if (alive) setHealth({ ok: false, error: t('settings.status.error') }) })
    return () => { alive = false }
  }, [t])
  const card = { border: '1px solid rgba(0,0,0,.12)', borderRadius: 10, padding: '10px 14px', display: 'flex', flexDirection: 'column' as const, gap: 6 }
  return createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
    createElement('h2', null, t('settings.title')),
    createElement('div', { style: card },
      createElement('strong', null, t('settings.engine')),
      createElement('span', { style: { fontSize: 12, opacity: 0.75 } }, t('settings.engineDesc')),
      createElement('span', { style: { fontSize: 12 } },
        supported ? t('settings.supported') : t('settings.unsupported')),
    ),
    createElement('div', { style: card },
      createElement('strong', null, t('settings.usageTitle')),
      createElement('span', { style: { fontSize: 12, opacity: 0.8 } }, t('settings.usage1')),
      createElement('span', { style: { fontSize: 12, opacity: 0.8 } }, t('settings.usage2')),
      createElement('span', { style: { fontSize: 12, opacity: 0.8 } }, t('settings.usage3')),
    ),
    createElement('div', { style: card },
      createElement('strong', null, t('settings.statusTitle')),
      createElement('span', { style: { fontSize: 12 } },
        health == null ? t('settings.status.loading')
          : health.ok
            ? t('settings.status.loaded', { version: health.version, engine: health.engine })
            : t('settings.status.error', { error: health.error ?? '?' })),
    ),
  )
}

export function apply(ctx: any): void {
  ctx.effect(() => ctx.locale.register(VOICE_NS, { zh, en }), 'dsh-voice-input: dictionaries')
  const t = ctx.locale.bind(VOICE_NS)
  ctx.slots.inject('conversation.input.right', () => ctx.slots.register({
    name: 'conversation.input.right',
    id: 'voice-input',
    order: 10,
    locale: VOICE_NS,
  }, MicButton))
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'voice-input-settings',
    order: 40,
    label: () => t('settings.tabLabel'),
    locale: VOICE_NS,
    inject: () => ({}),
  }, VoiceSettingsPanel))
}
