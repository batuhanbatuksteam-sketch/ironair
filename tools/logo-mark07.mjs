// MARK-07 (hız izi / motion blur fan) yönünün 10 alternatifi — MARK-06 turuyla
// aynı yöntem: flux-schnell keşif ($0.003/gör.), en güçlü çıkan tek yön
// recraft-v3-svg ile vektöre rafine edilir ($0.08).
import { run, download, first } from "./replicate.mjs";
import path from "node:path";

const OUT = path.join(process.cwd(), "tools/.cache/logo-katalog");
const ORTAK =
  "flat vector logo mark, minimalist industrial branding, isolated on pure white background, " +
  "no text, no letters, no watermark, no human figures, no scene, clean sharp vector edges, " +
  "single bold color #E4141B red on white, centered composition, professional corporate identity design, " +
  "high contrast, studio quality";

const ALTERNATIFLER = [
  { id: "07a-uc-serit", ad: "Üç Şerit İz",
    prompt: `logo mark, a three-blade fan silhouette with exactly three straight parallel speed-streak lines trailing behind it, crisp motion trail, ${ORTAK}` },
  { id: "07b-saf-hiz", ad: "Saf Hız Çizgileri",
    prompt: `logo mark, no fan blades at all, just three curved speed lines racing forward and converging to a point, pure velocity abstraction, ${ORTAK}` },
  { id: "07c-sevron-firlama", ad: "Şevron Fırlama",
    prompt: `logo mark, a small circular rotor at the back with three chevron speed marks shooting forward away from it, like a rocket launch trail, ${ORTAK}` },
  { id: "07d-kuyruklu-yildiz", ad: "Kuyruklu Yıldız Kanat",
    prompt: `logo mark, one single fan blade shape with one long tapering comet-like tail streaking behind it, elegant single trail, ${ORTAK}` },
  { id: "07e-patlama", ad: "Merkezden Patlama",
    prompt: `logo mark, radial burst of short speed lines exploding outward from a small central dot, starburst of motion, ${ORTAK}` },
  { id: "07f-hizolcer", ad: "Hız Göstergesi",
    prompt: `logo mark, a speedometer-style curved arc with a blurred motion needle sweeping across it, dashboard gauge feel, ${ORTAK}` },
  { id: "07g-klasik-hiz", ad: "Klasik Hız İkonu",
    prompt: `logo mark, a compact fan blade icon with three short horizontal speed lines beside it like a classic universal 'fast' symbol, simple and iconic, ${ORTAK}` },
  { id: "07h-stroboskop", ad: "Stroboskopik Çoklama",
    prompt: `logo mark, a fan blade shape repeated three times in a fading stroboscopic sequence suggesting fast rotation, each repeat more transparent, ${ORTAK}` },
  { id: "07i-hiz-halkasi", ad: "Hız Halkası",
    prompt: `logo mark, a static solid core dot surrounded by a circular ring made of motion-blur speed streaks, spinning ring of velocity, ${ORTAK}` },
  { id: "07j-soyut-kume", ad: "Soyut Çizgi Kümesi",
    prompt: `logo mark, a cluster of diagonal dashes and streaks of varying length arranged to abstractly imply a spinning rotor shape without drawing one directly, ${ORTAK}` },
];

console.log(`MARK-07 ailesi — flux-schnell keşif: ${ALTERNATIFLER.length} görsel\n`);
for (const k of ALTERNATIFLER) {
  process.stdout.write(`  ${k.id}  ${k.ad} ... `);
  const out = await run(
    "black-forest-labs/flux-schnell",
    { prompt: k.prompt, aspect_ratio: "1:1", num_outputs: 1, output_format: "png", go_fast: true, megapixels: "1" },
    { label: k.id }
  );
  await download(first(out), path.join(OUT, `${k.id}.png`));
  console.log("✓");
}

console.log(`\n${ALTERNATIFLER.length} görsel indirildi. Tahmini maliyet: $${(ALTERNATIFLER.length * 0.003).toFixed(3)}`);
