const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const html = `file://${path.join(__dirname, "recording.html")}`;
const output = path.join(__dirname, "business-partners-help-preview.webm");
const userData = path.join(__dirname, ".chromium-profile");
const port = 9333;

fs.mkdirSync(userData, { recursive: true });

const chrome = spawn("chromium", [
  "--headless",
  "--no-sandbox",
  "--disable-gpu",
  "--autoplay-policy=no-user-gesture-required",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userData}`,
  html,
], { stdio: ["ignore", "ignore", "pipe"] });

chrome.stderr.on("data", () => {});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    }
  };
  return new Promise((resolve, reject) => {
    ws.onerror = reject;
    ws.onopen = () => resolve({
      send(method, params = {}) {
        const callId = ++id;
        ws.send(JSON.stringify({ id: callId, method, params }));
        return new Promise((resolve, reject) => pending.set(callId, { resolve, reject }));
      },
      close() { ws.close(); }
    });
  });
}

(async () => {
  try {
    let pages = [];
    for (let i = 0; i < 40; i++) {
      try {
        pages = await getJson(`http://127.0.0.1:${port}/json`);
        if (pages.length) break;
      } catch (_) {}
      await wait(250);
    }
    const page = pages.find(p => p.url.startsWith("file://")) || pages[0];
    if (!page) throw new Error("No Chromium page found");
    const client = await cdp(page.webSocketDebuggerUrl);
    await client.send("Runtime.enable");

    let dataUrl = "";
    for (let i = 0; i < 80; i++) {
      const result = await client.send("Runtime.evaluate", {
        expression: "document.body.dataset.video || ''",
        returnByValue: true
      });
      dataUrl = result.result.value || "";
      if (dataUrl.startsWith("data:video/webm;base64,")) break;
      await wait(250);
    }

    if (!dataUrl.startsWith("data:video/webm;base64,")) {
      throw new Error("Recording did not complete");
    }
    fs.writeFileSync(output, Buffer.from(dataUrl.split(",", 2)[1], "base64"));
    client.close();
    chrome.kill("SIGTERM");
    console.log(output);
  } catch (err) {
    chrome.kill("SIGTERM");
    console.error(err.message);
    process.exit(1);
  }
})();
