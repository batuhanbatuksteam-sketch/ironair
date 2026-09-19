/**
 * 4K hero karelerini siteye konacak üç WebP setine çevirir.
 *
 *   f2560  retina masaüstü   ~2560 px
 *   f1440  normal masaüstü   ~1440 px
 *   f768   mobil             ~768 px
 *
 * Kaynak kare eksikse (upscale yarıda kaldıysa) 1080p'lik orijinali kullanır,
 * böylece dizi her zaman eksiksiz çıkar.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const SRC_4K = "tools/.cache/hero/frames_4k";
const SRC_HD = "tools/.cache/hero/frames_src";
const OUT = "public/hero";

const SETLER = [
  { dir: "f2560", genislik: 2560, kalite: 80 },
  { dir: "f1440", genislik: 1440, kalite: 84 },
  { dir: "f768", genislik: 768, kalite: 80 },
];

const kareler = fs.readdirSync(SRC_HD).filter((f) => f.endsWith(".png")).sort();
if (!kareler.length) throw new Error("kaynak kare yok");

for (const s of SETLER) fs.mkdirSync(path.join(OUT, s.dir), { recursive: true });

let dusuk = 0;
for (const kare of kareler) {
  const buyuk = path.join(SRC_4K, kare);
  const kaynak = fs.existsSync(buyuk) ? buyuk : path.join(SRC_HD, kare);
  if (kaynak !== buyuk) dusuk++;

  for (const s of SETLER) {
    const hedef = path.join(OUT, s.dir, kare.replace(".png", ".webp"));
    execFileSync("cwebp", [
      "-quiet",
      "-q", String(s.kalite),
      "-m", "6",
      "-resize", String(s.genislik), "0",
      kaynak,
      "-o", hedef,
    ]);
  }
}

fs.copyFileSync(path.join(OUT, "f1440", "0001.webp"), path.join(OUT, "poster.webp"));

console.log(`bitti — ${kareler.length} kare × ${SETLER.length} set`);
if (dusuk) console.log(`uyarı: ${dusuk} kare 4K yerine 1080p kaynaktan kodlandı`);
