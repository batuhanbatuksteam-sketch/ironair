// 10 farklı logo konsepti — flux-schnell ($0.003/görsel, 10 görsel ≈ $0.03).
// Her prompt yalnızca ikon/işaret üretir (yazı yok) — flux-schnell'in zayıf
// noktası harf render'ı; marka adı zaten Wordmark.tsx'te elle çizili vektör.
import { run, download, first } from "./replicate.mjs";
import path from "node:path";

const OUT = path.join(process.cwd(), "tools/.cache/logo-katalog");
const ORTAK =
  "flat vector logo mark, minimalist industrial branding, isolated on pure white background, " +
  "no text, no letters, no watermark, clean sharp vector edges, single bold color #E4141B red on white, " +
  "centered composition, professional corporate identity design, high contrast, studio quality";

const KONSEPTLER = [
  {
    id: "01-negatif-a",
    ad: "Negatif boşluklu A-monogram",
    prompt: `logo mark where three swept turbine fan blades form the negative space of the letter A, ${ORTAK}`,
  },
  {
    id: "02-altigen-rotor",
    ad: "Altıgen sanayi rozeti",
    prompt: `industrial badge logo, hexagon outline containing a centered five-blade turbine fan silhouette, engineering emblem style, ${ORTAK}`,
  },
  {
    id: "03-tek-cizgi",
    ad: "Tek çizgi outline fan",
    prompt: `single continuous line drawing of a spinning fan blade forming a circular loop, minimalist line-art icon, thin uniform stroke weight, ${ORTAK}`,
  },
  {
    id: "04-monogram-ia",
    ad: "IA harf kaynaşması",
    prompt: `abstract monogram logo built from geometric fan blade shapes suggesting the letters I and A interlocked, sharp angular geometry, ${ORTAK}`,
  },
  {
    id: "05-vintage-muhur",
    ad: "Vintage fabrika mührü",
    prompt: `vintage industrial factory seal emblem, circular border with a turbine fan icon at center, engraved badge aesthetic, retro engineering stamp, ${ORTAK}`,
  },
  {
    id: "06-ruzgar-ok",
    ad: "Rüzgâr akışı + ok hibriti",
    prompt: `logo combining three curved airflow wind lines that sweep into a forward-pointing arrow, dynamic air movement icon, ${ORTAK}`,
  },
  {
    id: "07-hizli-carpi",
    ad: "Hızlı çark izi (dinamik)",
    prompt: `energetic motion-blur style fan blade logo, diagonal speed trail streaks behind three blades suggesting fast rotation, dynamic sporty industrial mark, ${ORTAK}`,
  },
  {
    id: "08-kalkan-sertifika",
    ad: "Kalkan rozeti",
    prompt: `shield-shaped industrial certification badge logo with a fan turbine icon centered inside, trustworthy engineering emblem, ${ORTAK}`,
  },
  {
    id: "09-minimal-nokta",
    ad: "Ultra minimal İsviçre tarzı",
    prompt: `extremely minimal swiss-style geometric logo, one single solid triangle blade shape orbiting a small dot, lots of negative space, tiny simple mark, ${ORTAK}`,
  },
  {
    id: "10-izometrik-kup",
    ad: "İzometrik 3B küp fan",
    prompt: `isometric 3D style logo icon of a fan turbine built from geometric cube and prism shapes, technical blueprint feel, ${ORTAK}`,
  },
];

console.log(`${KONSEPTLER.length} konsept, flux-schnell ile üretiliyor...\n`);
let toplamGorsel = 0;

for (const k of KONSEPTLER) {
  process.stdout.write(`  ${k.id}  ${k.ad} ... `);
  const out = await run(
    "black-forest-labs/flux-schnell",
    {
      prompt: k.prompt,
      aspect_ratio: "1:1",
      num_outputs: 1,
      output_format: "png",
      go_fast: true,
      megapixels: "1",
    },
    { label: k.id }
  );
  const url = first(out);
  await download(url, path.join(OUT, `${k.id}.png`));
  toplamGorsel++;
  console.log("✓");
}

console.log(`\n${toplamGorsel} görsel indirildi → tools/.cache/logo-katalog/`);
console.log(`Tahmini maliyet: ${(toplamGorsel * 0.003).toFixed(3)} $`);
