// Local render/verification harness for the site. Drives headless Chrome over the
// DevTools Protocol with real device emulation, so CSS media queries and the
// viewport meta behave the way they do on a phone (plain --window-size does not).
//
// Usage: node tools/render_check.mjs <url> <w> <h> <mobile:0|1> <outPng|-> [evalFile]
//   evalFile: a file containing ONE JS expression; its value is printed as JSON.
//   FULLPAGE=1 env captures the whole page rather than the viewport.
//
// Example — measure the homepage on a phone, no screenshot:
//   python3 -m http.server 8899 &
//   node tools/render_check.mjs http://127.0.0.1:8899/ 390 844 1 - /tmp/check.js
//
// Local development only. Not used by the build and not referenced by any page.
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const [url, W, H, MOB, OUT, EVALF] = process.argv.slice(2);
const w = +W, h = +H, mobile = MOB === '1';
const PORT = 9333 + Math.floor(Math.random() * 500);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=/tmp/_cdp${PORT}`, 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let ws, id = 0; const pending = new Map();
const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
  const m = ++id; pending.set(m, { res, rej });
  ws.send(JSON.stringify({ id: m, method, params, ...(sessionId ? { sessionId } : {}) }));
});

try {
  let target = null;
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(200);
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await r.json();
      target = list.find(t => t.type === 'page');
    } catch {}
  }
  if (!target) throw new Error('no chrome target');

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => { ws.onopen = r; });
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id); pending.delete(m.id);
      m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
    }
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile,
    screenWidth: w, screenHeight: h,
  });
  if (mobile) {
    await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  }
  await send('Page.navigate', { url });
  await sleep(4000);
  // Reveal scroll-triggered animations, then return to top.
  // Force instant scrolling: the page sets scroll-behavior:smooth.
  await send('Runtime.evaluate', { expression: "document.documentElement.style.scrollBehavior='auto';window.scrollTo(0, document.body.scrollHeight)" });
  await sleep(2500);
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0,0)' });
  await sleep(2500);

  if (EVALF && existsSync(EVALF)) {
    const expr = readFileSync(EVALF, 'utf8');
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    console.log(JSON.stringify(r.result.value, null, 2));
  }

  if (OUT && OUT !== '-') {
    const full = process.env.FULLPAGE === '1';
    const shot = await send('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: full,
      ...(full ? {} : {}),
    });
    writeFileSync(OUT, Buffer.from(shot.data, 'base64'));
    console.error('wrote ' + OUT);
  }
} finally {
  try { ws && ws.close(); } catch {}
  chrome.kill('SIGKILL');
}
