/**
 * Hero karelerini 1920×1080'den 3840×2160'a çıkarır.
 *
 * Kareler tek tek Real-ESRGAN'dan geçer; sonuç `frames_4k/` altına yazılır.
 * Var olan kareyi atlar, böylece yarıda kesilirse kaldığı yerden devam eder.
 *
 *   node tools/upscale-hero.mjs            tüm kareler
 *   node tools/upscale-hero.mjs 1 2        yalnız 1. ve 2. kare (deneme)
 */
import fs from "node:fs";
import path from "node:path";
import { run, download, first } from "./replicate.mjs";

const SRC = "tools/.cache/hero/frames_src";
const OUT = "tools/.cache/hero/frames_4k";
fs.mkdirSync(OUT, { recursive: true });

const all = fs.readdirSync(SRC).filter((f) => f.endsWith(".png")).sort();
const only = process.argv.slice(2).map(Number).filter((n) => !Number.isNaN(n));
const queue = only.length ? only.map((n) => all[n - 1]).filter(Boolean) : all;

const toDataUri = (p) => `data:image/png;base64,${fs.readFileSync(p).toString("base64")}`;

const CONCURRENCY = 1;
const pending = [...queue];
let ok = 0;
let skip = 0;
let fail = 0;

await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (pending.length) {
      const name = pending.shift();
      const dest = path.join(OUT, name);
      if (fs.existsSync(dest) && !only.length) {
        skip++;
        continue;
      }
      try {
        const out = await run(
          "nightmareai/real-esrgan",
          { image: toDataUri(path.join(SRC, name)), scale: 2, face_enhance: false },
          { label: `upscale/${name}` }
        );
        await download(first(out), dest);
        ok++;
        if (ok % 10 === 0) console.log(`  ${ok + skip}/${queue.length}`);
      } catch (e) {
        fail++;
        console.log(`HATA ${name}: ${e.message}`);
      }
    }
  })
);

console.log(`bitti — büyütülen ${ok}, atlanan ${skip}, hata ${fail}`);
