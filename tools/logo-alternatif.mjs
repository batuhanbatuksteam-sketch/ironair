// MARK-06 (akış çizgileri + ok) yönünün alternatifleri.
// 8 keşif flux-schnell'de ($0.003), en güçlü 2'si recraft-v3'te ($0.04)
// yeniden üretilip kıyaslanıyor — toplam ≈ $0.10.
import { run, download, first } from "./replicate.mjs";
import path from "node:path";

const OUT = path.join(process.cwd(), "tools/.cache/logo-katalog");
const ORTAK =
  "flat vector logo mark, minimalist industrial branding, isolated on pure white background, " +
  "no text, no letters, no watermark, clean sharp vector edges, single bold color #E4141B red on white, " +
  "centered composition, professional corporate identity design, high contrast, studio quality";

const AILE_TEMASI =
  "three curved airflow wind lines sweeping forward and converging into a forward-pointing arrow head, " +
  "conveys moving air, dynamic yet clean";

const FLUX_ALTERNATIFLER = [
  {
    id: "06a-iki-cizgi",
    ad: "İki Çizgi — Keskin Ok",
    prompt: `logo mark, only two sharp airflow lines sweeping forward into one crisp angular arrowhead, geometric and precise, fewer strokes than usual, ${ORTAK}`,
  },
  {
    id: "06b-bes-cizgi",
    ad: "Beş Çizgi — Kurdele Akış",
    prompt: `logo mark, five thin ribbon-like curved airflow lines flowing forward together into a soft arrow shape, graceful and fluid like silk ribbons, ${ORTAK}`,
  },
  {
    id: "06c-rozet-icinde",
    ad: "Çember İçinde Akış",
    prompt: `logo mark, ${AILE_TEMASI}, contained inside a thin perfect circle border like a badge, icon sized for a small favicon, ${ORTAK}`,
  },
  {
    id: "06d-kademeli-sevron",
    ad: "Kademeli Şevron",
    prompt: `logo mark, three stacked chevron arrow shapes layered like airflow waves getting progressively larger, forming a forward arrow, architectural and structured, ${ORTAK}`,
  },
  {
    id: "06e-spiralden-oka",
    ad: "Sarmaldan Oka",
    prompt: `logo mark, a spiral swirl of air unwinding into a straight forward arrow, transformation from circular motion to linear thrust, ${ORTAK}`,
  },
  {
    id: "06f-yatay-lokup",
    ad: "Yatay Lokup (başlık için)",
    prompt: `logo mark, ${AILE_TEMASI}, wide horizontal compact composition designed to sit next to a wordmark in a website header, ${ORTAK}`,
  },
  {
    id: "06g-kalin-serit",
    ad: "Kalın Tek Şerit",
    prompt: `logo mark, one single thick bold ribbon of air flowing forward into a solid triangular arrowhead, heavy industrial weight, no thin lines, ${ORTAK}`,
  },
  {
    id: "06h-cift-yonlu",
    ad: "Giriş-Çıkış (çift ok)",
    prompt: `logo mark, two airflow arrows facing each other from left and right merging at center point, representing intake and exhaust airflow, symmetrical, ${ORTAK}`,
  },
];

console.log(`Aşama 1 — flux-schnell keşif: ${FLUX_ALTERNATIFLER.length} görsel\n`);
for (const k of FLUX_ALTERNATIFLER) {
  process.stdout.write(`  ${k.id}  ${k.ad} ... `);
  const out = await run(
    "black-forest-labs/flux-schnell",
    { prompt: k.prompt, aspect_ratio: "1:1", num_outputs: 1, output_format: "png", go_fast: true, megapixels: "1" },
    { label: k.id }
  );
  await download(first(out), path.join(OUT, `${k.id}.png`));
  console.log("✓");
}

// En güçlü iki yön — sarmaldan oka ve kalın şerit — recraft-v3-svg ile gerçek
// vektör (SVG) çıktısı olarak yeniden üretiliyor; $0.08/görsel ama kenar
// kalitesi flux-schnell'in rasterinden çok daha temiz.
const RECRAFT_FINALIST = [
  {
    id: "06e-recraft",
    ad: "Sarmaldan Oka — recraft",
    prompt: `A minimalist vector logo icon: a spiral swirl of air unwinding into a straight forward-pointing arrow. Single bold red color #E4141B on pure white background. No text. Clean geometric vector shapes, sharp edges, professional industrial corporate branding, centered.`,
  },
  {
    id: "06g-recraft",
    ad: "Kalın Tek Şerit — recraft",
    prompt: `A minimalist vector logo icon: one single thick bold ribbon shape representing airflow, flowing forward into a solid triangular arrowhead. Single bold red color #E4141B on pure white background. No text. Clean geometric vector shapes, heavy weight, sharp edges, professional industrial corporate branding, centered.`,
  },
];

console.log(`\nAşama 2 — recraft-v3 rafine: ${RECRAFT_FINALIST.length} görsel\n`);
for (const k of RECRAFT_FINALIST) {
  process.stdout.write(`  ${k.id}  ${k.ad} ... `);
  const out = await run(
    "recraft-ai/recraft-v3-svg",
    { prompt: k.prompt, size: "1024x1024", style: "any" },
    { label: k.id }
  );
  await download(first(out), path.join(OUT, `${k.id}.svg`));
  console.log("✓");
}

const toplam = FLUX_ALTERNATIFLER.length * 0.003 + RECRAFT_FINALIST.length * 0.08;
console.log(`\nToplam üretilen: ${FLUX_ALTERNATIFLER.length + RECRAFT_FINALIST.length} görsel`);
console.log(`Tahmini maliyet: $${toplam.toFixed(3)}`);
