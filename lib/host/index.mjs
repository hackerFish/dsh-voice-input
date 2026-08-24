// src/host/index.ts
var name = "dsh-voice-input";
function sendJson(response, status, payload) {
  response.writeHead(status, { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}
function apply(ctx) {
  ctx.inject(["webServer"], (host) => {
    host.effect(() => host.webServer.register({
      kind: "exact",
      path: "/dsh-voice-input/health",
      handler: async (request, response) => {
        if (request.method !== "GET") {
          response.writeHead(405, { allow: "GET" });
          response.end();
          return;
        }
        sendJson(response, 200, {
          ok: true,
          version: "0.1.0",
          engine: "web-speech-api",
          note: "\u8BC6\u522B\u5728\u6D4F\u89C8\u5668\u5185\u5B8C\u6210\uFF08Chrome/Edge \u5185\u7F6E\uFF09\uFF0Chost \u4EC5\u5065\u5EB7\u68C0\u67E5"
        });
      }
    }), "dsh-voice-input: http route");
  });
}
export {
  apply,
  name
};
