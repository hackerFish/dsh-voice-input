// 语音输入 host 入口。同官方 bundle 约定：export const name + export function apply(ctx)。
// 识别本身是纯浏览器能力（Web Speech API），host 只提供一个健康路由方便排查加载状态。
// NOTE: ctx 故意弱类型——DSH 运行时类型由 profile 在加载时提供。

export const name = 'dsh-voice-input'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sendJson(response: any, status: number, payload: unknown): void {
  response.writeHead(status, { 'cache-control': 'no-store', 'content-type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(payload))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apply(ctx: any): void {
  ctx.inject(['webServer'], (host: any) => {
    host.effect(() => host.webServer.register({
      kind: 'exact',
      path: '/dsh-voice-input/health',
      handler: async (request: any, response: any) => {
        if (request.method !== 'GET') {
          response.writeHead(405, { allow: 'GET' })
          response.end()
          return
        }
        sendJson(response, 200, {
          ok: true,
          version: '0.1.0',
          engine: 'web-speech-api',
          note: '识别在浏览器内完成（Chrome/Edge 内置），host 仅健康检查',
        })
      },
    }), 'dsh-voice-input: http route')
  })
}
