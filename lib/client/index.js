window.__ModuleLoader__.load({
  id: "@hackerfish/dsh-voice-input",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");
var inject = ["slots", "locale"];
var VOICE_NS = "voice.input";
var zh = {
  "settings.tabLabel": "\u8BED\u97F3\u8F93\u5165",
  // 麦克风按钮
  "mic.title.idle": "\u8BED\u97F3\u8F93\u5165\uFF08\u8BF4\u4E2D\u6587\uFF0C\u8BF4\u5B8C\u81EA\u52A8\u586B\u5165\u8F93\u5165\u6846\uFF09",
  "mic.title.listening": "\u7ED3\u675F\u8BED\u97F3\u8F93\u5165",
  "mic.title.unsupported": "\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u8BED\u97F3\u8BC6\u522B\uFF08\u8BF7\u7528 Chrome / Edge\uFF09",
  "mic.label.idle": "\u8BED\u97F3\u8F93\u5165",
  "mic.label.listening": "\u7ED3\u675F\u8BED\u97F3\u8F93\u5165",
  "mic.listening": "\u8046\u542C\u4E2D\u2026 ",
  // 错误提示
  "mic.err.unsupported": "\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u8BED\u97F3\u8BC6\u522B\uFF0C\u8BF7\u4F7F\u7528 Chrome \u6216 Edge",
  "mic.err.permission": "\u9EA6\u514B\u98CE\u6743\u9650\u88AB\u62D2\u7EDD\u2014\u2014\u70B9\u51FB\u5730\u5740\u680F\u5DE6\u4FA7\u56FE\u6807\uFF0C\u5141\u8BB8\u4F7F\u7528\u9EA6\u514B\u98CE\u540E\u91CD\u8BD5",
  "mic.err.noSpeech": "\u6CA1\u6709\u542C\u5230\u58F0\u97F3\uFF0C\u8BF7\u9760\u8FD1\u9EA6\u514B\u98CE\u518D\u8BD5",
  "mic.err.noDevice": "\u627E\u4E0D\u5230\u53EF\u7528\u7684\u9EA6\u514B\u98CE\u8BBE\u5907",
  "mic.err.network": "\u8BED\u97F3\u8BC6\u522B\u670D\u52A1\u4E0D\u53EF\u7528\uFF08\u7F51\u7EDC\u53D7\u9650\uFF1F\u53EF\u7A0D\u540E\u91CD\u8BD5\uFF09",
  "mic.err.generic": "\u8BED\u97F3\u8BC6\u522B\u51FA\u9519\uFF1A{code}",
  "mic.err.startFailed": "\u8BED\u97F3\u8BC6\u522B\u542F\u52A8\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5",
  // 设置页
  "settings.title": "\u8BED\u97F3\u8F93\u5165",
  "settings.engine": "\u8BC6\u522B\u5F15\u64CE\uFF1A\u6D4F\u89C8\u5668\u5185\u7F6E Web Speech API\uFF08zh-CN\uFF09",
  "settings.engineDesc": "\u65E0\u9700\u914D\u7F6E\u3001\u65E0\u9700\u5BC6\u94A5\uFF0C\u8BC6\u522B\u5728\u6D4F\u89C8\u5668\u5185\u5B8C\u6210\uFF08Chrome / Edge \u5185\u7F6E\u670D\u52A1\uFF0C\u9700\u8981\u80FD\u8BBF\u95EE\u5176\u5728\u7EBF\u8BC6\u522B\u63A5\u53E3\uFF09\u3002",
  "settings.supported": "\u2705 \u5F53\u524D\u6D4F\u89C8\u5668\u652F\u6301\u8BED\u97F3\u8BC6\u522B",
  "settings.unsupported": "\u26A0\uFE0F \u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u8BED\u97F3\u8BC6\u522B\u2014\u2014\u8BF7\u4F7F\u7528 Chrome \u6216 Edge \u6253\u5F00\u672C\u754C\u9762\u3002",
  "settings.usageTitle": "\u7528\u6CD5",
  "settings.usage1": "1. \u5728\u5BF9\u8BDD\u6846\u8F93\u5165\u6761\u70B9\u51FB \u{1F3A4} \u9EA6\u514B\u98CE\u6309\u94AE\uFF08\u9996\u6B21\u4F1A\u8BF7\u6C42\u9EA6\u514B\u98CE\u6743\u9650\uFF0C\u8BF7\u5141\u8BB8\uFF09",
  "settings.usage2": "2. \u76F4\u63A5\u8BF4\u8BDD\uFF0C\u8BF4\u5B8C\u505C\u987F\u4E00\u4E0B\u5373\u81EA\u52A8\u7ED3\u675F\uFF08\u4E5F\u53EF\u518D\u70B9\u4E00\u6B21\u63D0\u524D\u7ED3\u675F\uFF09",
  "settings.usage3": "3. \u8BC6\u522B\u6587\u5B57\u81EA\u52A8\u586B\u5165\u8F93\u5165\u6846\u8349\u7A3F\uFF0C\u68C0\u67E5/\u4FEE\u6539\u540E\u6309\u56DE\u8F66\u53D1\u9001\u3002",
  "settings.statusTitle": "\u63D2\u4EF6\u72B6\u6001",
  "settings.status.loading": "\u6B63\u5728\u8BFB\u53D6\u2026",
  "settings.status.loaded": "\u2705 host \u5DF2\u52A0\u8F7D\uFF08version {version} \xB7 {engine}\uFF09",
  "settings.status.error": "\u274C {error}"
};
var en = {
  "settings.tabLabel": "Voice Input",
  // Mic button
  "mic.title.idle": "Voice input (speak Chinese; the transcript is filled into the draft)",
  "mic.title.listening": "Stop voice input",
  "mic.title.unsupported": "Speech recognition unsupported in this browser (use Chrome / Edge)",
  "mic.label.idle": "Voice input",
  "mic.label.listening": "Stop voice input",
  "mic.listening": "Listening\u2026 ",
  // Errors
  "mic.err.unsupported": "Speech recognition is not supported in this browser \u2014 use Chrome or Edge",
  "mic.err.permission": "Microphone permission denied \u2014 click the icon at the left of the address bar to allow the microphone, then retry",
  "mic.err.noSpeech": "No speech detected \u2014 try again closer to the microphone",
  "mic.err.noDevice": "No usable microphone device found",
  "mic.err.network": "Speech recognition service unavailable (network restricted? retry later)",
  "mic.err.generic": "Speech recognition error: {code}",
  "mic.err.startFailed": "Failed to start speech recognition \u2014 please retry",
  // Settings page
  "settings.title": "Voice Input",
  "settings.engine": "Engine: browser-native Web Speech API (zh-CN)",
  "settings.engineDesc": "No config, no keys \u2014 recognition runs inside the browser (Chrome/Edge built-in service; needs access to its online recognition API).",
  "settings.supported": "\u2705 Speech recognition is supported in this browser",
  "settings.unsupported": "\u26A0\uFE0F Speech recognition is not supported in this browser \u2014 open this page in Chrome or Edge.",
  "settings.usageTitle": "Usage",
  "settings.usage1": "1. Click the \u{1F3A4} mic button in the composer (the first click asks for microphone permission \u2014 allow it)",
  "settings.usage2": "2. Just speak; it stops automatically after a pause (or click again to stop early)",
  "settings.usage3": "3. The transcript is filled into the draft \u2014 review/edit it, then press Enter to send.",
  "settings.statusTitle": "Plugin status",
  "settings.status.loading": "Loading\u2026",
  "settings.status.loaded": "\u2705 host loaded (version {version} \xB7 {engine})",
  "settings.status.error": "\u274C {error}"
};
function speechRecognitionCtor() {
  const w = window;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
var PULSE_KEYFRAMES = "@keyframes dsh-voice-input-pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.65); } }";
var pulseStyleInjected = false;
function ensurePulseStyle() {
  if (pulseStyleInjected || typeof document === "undefined") return;
  pulseStyleInjected = true;
  const el = document.createElement("style");
  el.textContent = PULSE_KEYFRAMES;
  document.head.appendChild(el);
}
function MicIcon({ size = 15 }) {
  return (0, import_react.createElement)(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: size,
      height: size,
      "aria-hidden": true,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    },
    (0, import_react.createElement)("path", { d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" }),
    (0, import_react.createElement)("path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }),
    (0, import_react.createElement)("line", { x1: "12", y1: "19", x2: "12", y2: "22" })
  );
}
function MicButton(props) {
  const { useInput, inputActions, t } = props;
  const input = useInput((s) => s);
  const draftRef = (0, import_react.useRef)("");
  draftRef.current = input?.draft ?? "";
  const supported = speechRecognitionCtor() !== null;
  const [state, setState] = (0, import_react.useState)("idle");
  const [hint, setHint] = (0, import_react.useState)(null);
  const [error, setError] = (0, import_react.useState)(null);
  const [hover, setHover] = (0, import_react.useState)(false);
  const recRef = (0, import_react.useRef)(null);
  const finalRef = (0, import_react.useRef)("");
  const liveRef = (0, import_react.useRef)(false);
  const busyRef = (0, import_react.useRef)(false);
  const errorTimerRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    ensurePulseStyle();
    return () => {
      liveRef.current = false;
      try {
        recRef.current?.abort();
      } catch {
      }
      if (errorTimerRef.current !== null) window.clearTimeout(errorTimerRef.current);
    };
  }, []);
  const showError = (text) => {
    setError(text);
    if (errorTimerRef.current !== null) window.clearTimeout(errorTimerRef.current);
    errorTimerRef.current = window.setTimeout(() => setError(null), 5e3);
  };
  const commit = (text) => {
    const base = (draftRef.current ?? "").trimEnd();
    const merged = base === "" ? text : base + " " + text;
    if (merged.trim() !== "" && typeof inputActions?.setDraft === "function") {
      inputActions.setDraft(merged);
    }
  };
  const stopRecognition = () => {
    try {
      recRef.current?.stop();
    } catch {
    }
  };
  const startRecognition = async () => {
    if (busyRef.current) return;
    const Ctor = speechRecognitionCtor();
    if (!Ctor) {
      showError(t("mic.err.unsupported"));
      return;
    }
    busyRef.current = true;
    setState("starting");
    setError(null);
    setHint(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      busyRef.current = false;
      setState("idle");
      showError(t("mic.err.permission"));
      return;
    }
    const rec = new Ctor();
    rec.lang = "zh-CN";
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    finalRef.current = "";
    liveRef.current = true;
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalRef.current += r[0].transcript;
        else interim += r[0].transcript;
      }
      setHint(finalRef.current + interim);
    };
    rec.onerror = (e) => {
      liveRef.current = false;
      busyRef.current = false;
      const code = e?.error;
      if (code === "not-allowed" || code === "service-not-allowed") {
        showError(t("mic.err.permission"));
      } else if (code === "no-speech") {
        showError(t("mic.err.noSpeech"));
      } else if (code === "audio-capture") {
        showError(t("mic.err.noDevice"));
      } else if (code === "network") {
        showError(t("mic.err.network"));
      } else if (code !== "aborted") {
        showError(t("mic.err.generic", { code: String(code) }));
      }
      setState("idle");
      setHint(null);
    };
    rec.onend = () => {
      liveRef.current = false;
      busyRef.current = false;
      const text = finalRef.current.trim();
      if (text !== "") commit(text);
      setState("idle");
      setHint(null);
    };
    recRef.current = rec;
    try {
      rec.start();
      setState("listening");
    } catch {
      busyRef.current = false;
      setState("idle");
      showError(t("mic.err.startFailed"));
    }
  };
  const onToggle = () => {
    if (state === "listening" || state === "starting") stopRecognition();
    else void startRecognition();
  };
  const listening = state === "listening" || state === "starting";
  const btnStyle = {
    width: 28,
    height: 28,
    borderRadius: 8,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: 0,
    border: "none",
    cursor: supported ? "pointer" : "not-allowed",
    background: listening ? "var(--dsw-alias-state-warn-tertiary, rgba(255,171,0,.18))" : hover && supported ? "var(--dsw-alias-interactive-bg-hover, rgba(128,128,128,.14))" : "transparent",
    color: listening ? "var(--dsw-alias-state-warn-primary, #b3870e)" : "var(--dsw-alias-label-secondary, rgba(128,128,128,.9))",
    transition: "background .15s ease, color .15s ease"
  };
  const statusStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    maxWidth: 200,
    fontSize: 12,
    lineHeight: "18px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    color: "var(--dsw-alias-label-secondary, rgba(128,128,128,.9))"
  };
  return (0, import_react.createElement)(
    "div",
    { style: { display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0 } },
    (hint !== null || error !== null) && (0, import_react.createElement)(
      "div",
      { style: statusStyle, "aria-live": "polite" },
      listening && (0, import_react.createElement)("span", {
        style: {
          width: 8,
          height: 8,
          borderRadius: "50%",
          flexShrink: 0,
          background: "var(--dsw-alias-state-error-primary, #c83c3c)",
          animation: "dsh-voice-input-pulse 1.2s ease-in-out infinite"
        }
      }),
      error !== null ? (0, import_react.createElement)("span", { style: { color: "var(--dsw-alias-state-error-primary, #c83c3c)" } }, "\u26A0 " + error) : (0, import_react.createElement)(
        "span",
        { style: { textOverflow: "ellipsis", overflow: "hidden" } },
        listening ? t("mic.listening") + (hint ?? "") : hint ?? ""
      )
    ),
    (0, import_react.createElement)("button", {
      type: "button",
      title: supported ? listening ? t("mic.title.listening") : t("mic.title.idle") : t("mic.title.unsupported"),
      "aria-label": listening ? t("mic.label.listening") : t("mic.label.idle"),
      "aria-pressed": listening,
      disabled: !supported,
      onClick: onToggle,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: btnStyle
    }, (0, import_react.createElement)(MicIcon, { size: 15 }))
  );
}
function VoiceSettingsPanel(props) {
  const { t } = props;
  const [health, setHealth] = (0, import_react.useState)(null);
  const supported = typeof window !== "undefined" && speechRecognitionCtor() !== null;
  (0, import_react.useEffect)(() => {
    let alive = true;
    fetch("/dsh-voice-input/health", { cache: "no-store" }).then((r) => r.json()).then((d) => {
      if (alive) setHealth(d);
    }).catch(() => {
      if (alive) setHealth({ ok: false, error: t("settings.status.error") });
    });
    return () => {
      alive = false;
    };
  }, [t]);
  const card = { border: "1px solid rgba(0,0,0,.12)", borderRadius: 10, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 6 };
  return (0, import_react.createElement)(
    "div",
    { style: { display: "flex", flexDirection: "column", gap: 10 } },
    (0, import_react.createElement)("h2", null, t("settings.title")),
    (0, import_react.createElement)(
      "div",
      { style: card },
      (0, import_react.createElement)("strong", null, t("settings.engine")),
      (0, import_react.createElement)("span", { style: { fontSize: 12, opacity: 0.75 } }, t("settings.engineDesc")),
      (0, import_react.createElement)(
        "span",
        { style: { fontSize: 12 } },
        supported ? t("settings.supported") : t("settings.unsupported")
      )
    ),
    (0, import_react.createElement)(
      "div",
      { style: card },
      (0, import_react.createElement)("strong", null, t("settings.usageTitle")),
      (0, import_react.createElement)("span", { style: { fontSize: 12, opacity: 0.8 } }, t("settings.usage1")),
      (0, import_react.createElement)("span", { style: { fontSize: 12, opacity: 0.8 } }, t("settings.usage2")),
      (0, import_react.createElement)("span", { style: { fontSize: 12, opacity: 0.8 } }, t("settings.usage3"))
    ),
    (0, import_react.createElement)(
      "div",
      { style: card },
      (0, import_react.createElement)("strong", null, t("settings.statusTitle")),
      (0, import_react.createElement)(
        "span",
        { style: { fontSize: 12 } },
        health == null ? t("settings.status.loading") : health.ok ? t("settings.status.loaded", { version: health.version, engine: health.engine }) : t("settings.status.error", { error: health.error ?? "?" })
      )
    )
  );
}
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(VOICE_NS, { zh, en }), "dsh-voice-input: dictionaries");
  const t = ctx.locale.bind(VOICE_NS);
  ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
    name: "conversation.input.right",
    id: "voice-input",
    order: 10,
    locale: VOICE_NS
  }, MicButton));
  ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
    name: "settings.plugins.tab",
    id: "voice-input-settings",
    order: 40,
    label: () => t("settings.tabLabel"),
    locale: VOICE_NS,
    inject: () => ({})
  }, VoiceSettingsPanel));
}

    return module.exports;
  }
});
