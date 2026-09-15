import { writeFile } from "node:fs/promises";

const ws = new WebSocket(process.argv[2]);
let sequence = 1;
const pending = new Map();

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  const resolve = pending.get(message.id);
  if (resolve) {
    pending.delete(message.id);
    resolve(message);
  }
};

await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

function send(method, params = {}) {
  return new Promise((resolve) => {
    const id = sequence++;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function waitForRender() {
  await new Promise((resolve) => setTimeout(resolve, 450));
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.result.value;
}

async function capture(path) {
  const result = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, fromSurface: true });
  await writeFile(path, Buffer.from(result.result.data, "base64"));
}

await capture("public/research/trajectory-scene-map.png");
await evaluate("(()=>{const select=document.querySelector('#keyframe');select.value='287';select.dispatchEvent(new Event('change',{bubbles:true}));return document.querySelector('#status').textContent})()");
await waitForRender();
await capture("public/research/trajectory-keyframe-route.png");
await evaluate("(()=>{const id='1687b6db-b074-4c95-a62a-43258a68b99c';const select=document.querySelector('#keyframe');select.value='287';select.dispatchEvent(new Event('change',{bubbles:true}));const node=[...document.querySelectorAll('[data-key]')].find(n=>n.dataset.key==='candidate:'+id);node?.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));return {inspector:document.querySelector('#inspector').innerText.includes('Reward vector'),tag:document.querySelectorAll('.counterfactual-best').length}})()");
await waitForRender();
await capture("public/research/trajectory-reward-inspector.png");
ws.close();
