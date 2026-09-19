/**
 * Her ürün için saydam arka planlı katalog görseli üretir.
 *
 *   1. nano-banana düz beyaz fon üzerinde ürünü çizer
 *   2. arka plan kaldırıcı fonu saydama çevirir
 *
 * Zaten üretilmiş dosyaları atlar, böylece tekrar çalıştırmak ucuzdur.
 * Yalnız belirli ürünleri yenilemek için: node tools/gen-products.mjs slug1 slug2
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { run, download, first } from "./replicate.mjs";

/** products.ts içinden yalnız slug ve render alanlarını okur. */
function readCatalog() {
  const src = fs.readFileSync("data/products.ts", "utf8");
  const out = [];
  const re = /slug:\s*"([^"]+)"[\s\S]*?render:\s*((?:\s*"(?:[^"\\]|\\.)*"\s*\+?)+),?\n/g;
  for (const m of src.matchAll(re)) {
    const render = [...m[2].matchAll(/"((?:[^"\\]|\\.)*)"/g)]
      .map((s) => s[1])
      .join("")
      .replace(/\\n/g, " ")
      .trim();
    out.push({ slug: m[1], render });
  }
  return out;
}

const products = readCatalog();
if (!products.length) throw new Error("products.ts okunamadı");

const OUT = "public/generated/products";
const RAW = "tools/.cache/raw";
const CUT = "tools/.cache/products-png";
for (const d of [OUT, RAW, CUT]) fs.mkdirSync(d, { recursive: true });

const only = process.argv.slice(2);
const queue = products.filter((p) => (only.length ? only.includes(p.slug) : true));

const shotPrompt = (p) =>
  `Professional industrial catalogue product photograph of ${p.render}.
Single product, centred, three-quarter angle view, complete product visible with generous margin around it.
Isolated on a plain pure white seamless studio background, bright even softbox lighting from both sides,
clean crisp edges, no cast shadow on the background, sharp focus throughout, realistic materials.

Finish: bare galvanised steel, brushed aluminium and dark graphite grey powder coating.
Any painted part is either graphite grey or deep signal red.
Strictly no blue, no yellow, no green, no orange paint anywhere on the product or its base frame.

No text, no labels, no watermark, no people, no hands, no props, no floor line, no other objects.`;

async function makeOne(p) {
  const finalPath = path.join(OUT, `${p.slug}.webp`);
  if (fs.existsSync(finalPath) && !only.length) return { slug: p.slug, skipped: true };

  const rawUrl = first(
    await run(
      "google/nano-banana",
      { prompt: shotPrompt(p), aspect_ratio: "1:1", output_format: "png" },
      { label: `${p.slug}/render` }
    )
  );
  await download(rawUrl, path.join(RAW, `${p.slug}.png`));

  // Fonu saydama çevir; birincil model düşerse ikincisine geç.
  let cutUrl;
  try {
    cutUrl = first(
      await run("851-labs/background-remover", { image: rawUrl }, { label: `${p.slug}/cut` })
    );
  } catch {
    cutUrl = first(
      await run("bria/remove-background", { image: rawUrl }, { label: `${p.slug}/cut2` })
    );
  }

  // Kesilmiş PNG kaynak olarak saklanır, siteye alfalı WebP konur (~20 kat küçük).
  const cutPath = path.join(CUT, `${p.slug}.png`);
  await download(cutUrl, cutPath);
  execFileSync("cwebp", ["-quiet", "-q", "90", "-alpha_q", "100", "-m", "6", cutPath, "-o", finalPath]);

  return { slug: p.slug, skipped: false };
}

const CONCURRENCY = 2;
const pending = [...queue];
let ok = 0;
let fail = 0;
let skip = 0;

await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (pending.length) {
      const p = pending.shift();
      try {
        const r = await makeOne(p);
        if (r.skipped) {
          skip++;
        } else {
          ok++;
          console.log(`OK   ${r.slug}  (${ok + skip}/${queue.length})`);
        }
      } catch (e) {
        fail++;
        console.log(`HATA ${p.slug}: ${e.message}`);
      }
    }
  })
);

console.log(`\nbitti — üretilen ${ok}, atlanan ${skip}, hata ${fail}`);
