// Replicate REST yardımcıları — token .env.local'dan okunur, koda gömülmez.
import fs from "node:fs";
import path from "node:path";

const ENV = path.join(process.cwd(), ".env.local");
if (fs.existsSync(ENV)) {
  for (const line of fs.readFileSync(ENV, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    // `vercel env pull` değerleri tırnak içinde yazıyor; tırnak jetona karışırsa 401 döner.
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"(.*)"$/, "$1");
  }
}
const TOKEN = process.env.REPLICATE_API_TOKEN;
if (!TOKEN) throw new Error("REPLICATE_API_TOKEN yok (.env.local)");

const H = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function run(model, input, { timeoutMs = 900_000, label = model, retries = 8 } = {}) {
  let res;
  let pred;

  // Kredi düşükken Replicate saniyede az istek kabul ediyor; 429'da bekleyip yeniden dene.
  for (let attempt = 0; ; attempt++) {
    res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
      method: "POST",
      headers: { ...H, Prefer: "wait=60" },
      body: JSON.stringify({ input }),
    });
    pred = await res.json();
    if (res.status !== 429 || attempt >= retries) break;
    const wait = (Number(pred?.retry_after) || 5) * 1000 + attempt * 1500;
    await sleep(wait);
  }
  if (!res.ok) throw new Error(`${label}: ${res.status} ${JSON.stringify(pred).slice(0, 400)}`);

  const started = Date.now();
  while (["starting", "processing"].includes(pred.status)) {
    if (Date.now() - started > timeoutMs) throw new Error(`${label}: zaman aşımı`);
    await sleep(2500);
    pred = await (await fetch(pred.urls.get, { headers: H })).json();
  }
  if (pred.status !== "succeeded") {
    throw new Error(`${label}: ${pred.status} — ${pred.error ?? "bilinmeyen hata"}`);
  }
  return pred.output;
}

export async function download(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`indirme başarısız ${res.status}: ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return dest;
}

export const first = (out) => (Array.isArray(out) ? out[0] : out);
