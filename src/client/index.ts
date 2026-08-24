// 语音输入 client 半端（P1）：composer 输入条麦克风按钮 + 浏览器内置 Web Speech API（zh-CN）。
// 注册模式照 dsh-client-ui-input-trigger（conversation.input.* 先例）：
// conversation.input.right（list, session）→ 按钮；settings.plugins.tab → 状态页。
// NOTE: React 由 DSH client 运行时提供；本文件经 tsup 打进 lib/client.js 后由 wrap-client.mjs 包装。

import { useState, useEffect, useRef, createElement } from 'react'

export const inject = ['slots']

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
// 标准 kit 提供 useInput（draft 快照）与 inputActions（setDraft/submit）。
function MicButton(props: any): any {
  const { useInput, inputActions } = props
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
    if (!Ctor) { showError('当前浏览器不支持语音识别，请使用 Chrome 或 Edge'); return }
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
      showError('麦克风权限被拒绝——点击地址栏左侧图标，允许使用麦克风后重试')
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
        showError('麦克风权限被拒绝——点击地址栏左侧图标，允许使用麦克风后重试')
      } else if (code === 'no-speech') {
        showError('没有听到声音，请靠近麦克风再试')
      } else if (code === 'audio-capture') {
        showError('找不到可用的麦克风设备')
      } else if (code === 'network') {
        showError('语音识别服务不可用（网络受限？可稍后重试）')
      } else if (code !== 'aborted') {
        showError('语音识别出错：' + String(code))
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
      showError('语音识别启动失败，请重试')
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
            listening ? '聆听中… ' + (hint ?? '') : (hint ?? '')),
    ),
    createElement('button', {
      type: 'button',
      title: supported
        ? (listening ? '结束语音输入' : '语音输入（说中文，说完自动填入输入框）')
        : '当前浏览器不支持语音识别（请用 Chrome / Edge）',
      'aria-label': listening ? '结束语音输入' : '语音输入',
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
function VoiceSettingsPanel(_props: any): any {
  const [health, setHealth] = useState<any>(null)
  const supported = typeof window !== 'undefined' && speechRecognitionCtor() !== null
  useEffect(() => {
    let alive = true
    fetch('/dsh-voice-input/health', { cache: 'no-store' })
      .then((r: any) => r.json())
      .then((d: any) => { if (alive) setHealth(d) })
      .catch(() => { if (alive) setHealth({ ok: false, error: 'health 路由不可达（插件未加载？）' }) })
    return () => { alive = false }
  }, [])
  const card = { border: '1px solid rgba(0,0,0,.12)', borderRadius: 10, padding: '10px 14px', display: 'flex', flexDirection: 'column' as const, gap: 6 }
  return createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
    createElement('h2', null, '语音输入 / Voice Input'),
    createElement('div', { style: card },
      createElement('strong', null, '识别引擎：浏览器内置 Web Speech API（zh-CN）'),
      createElement('span', { style: { fontSize: 12, opacity: 0.75 } },
        '无需配置、无需密钥，识别在浏览器内完成（Chrome / Edge 内置服务，需要能访问其在线识别接口）。'),
      createElement('span', { style: { fontSize: 12 } },
        supported
          ? '✅ 当前浏览器支持语音识别'
          : '⚠️ 当前浏览器不支持语音识别——请使用 Chrome 或 Edge 打开本界面。'),
    ),
    createElement('div', { style: card },
      createElement('strong', null, '用法'),
      createElement('span', { style: { fontSize: 12, opacity: 0.8 } },
        '1. 在对话框输入条点击 🎤 麦克风按钮（首次会请求麦克风权限，请允许）'),
      createElement('span', { style: { fontSize: 12, opacity: 0.8 } },
        '2. 直接说话，说完停顿一下即自动结束（也可再点一次提前结束）'),
      createElement('span', { style: { fontSize: 12, opacity: 0.8 } },
        '3. 识别文字自动填入输入框草稿，检查/修改后按回车发送。'),
    ),
    createElement('div', { style: card },
      createElement('strong', null, '插件状态'),
      createElement('span', { style: { fontSize: 12 } },
        health == null ? '正在读取…'
          : health.ok
            ? '✅ host 已加载（version ' + health.version + ' · ' + health.engine + '）'
            : '❌ ' + (health.error ?? 'host 状态未知')),
    ),
  )
}

export function apply(ctx: any): void {
  ctx.slots.inject('conversation.input.right', () => ctx.slots.register({
    name: 'conversation.input.right',
    id: 'voice-input',
    order: 10,
  }, MicButton))
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'voice-input-settings',
    order: 40,
    label: () => '语音输入',
    inject: () => ({}),
  }, VoiceSettingsPanel))
}
