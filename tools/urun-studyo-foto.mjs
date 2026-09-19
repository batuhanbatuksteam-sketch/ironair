/**
 * Her ürün serisine bir adet stüdyo ürün fotoğrafı üretir.
 *
 * Girdi  : public/katalog/<slug>/ana.webp   (markalanmış 2K render)
 * Çıktı  : tools/.cache/studyo/<slug>.png   (zeminli, ışıklandırılmış sahne)
 * Model  : bytedance/seedream-4 ($0.03/görsel)
 *
 * Model seçimi ölçümle yapıldı: nano-banana logonun rengini kaydırdı,
 * flux-kontext çözünürlüğü yarıya düşürdü. seedream-4 girdinin çözünürlüğünü
 * birebir koruyor (2048 px), sahneyi en gerçekçi kuran ve en ucuz olan.
 *
 * Önbellek: tamamlanan dosya varsa atlanır — yeniden çalıştırmak para harcamaz.
 */
import { run, download, first } from "./replicate.mjs";
import fs from "node:fs";
import path from "node:path";

const KOK = process.cwd();
const CACHE = path.join(KOK, "tools/.cache/studyo");
const ESZAMANLI = 5;

/**
 * Sahne tarifi. İki ders prompt'a işlendi:
 *  - Işık ekipmanı tarif edilirse model softbox'ları kadraja sokuyor; bu yüzden
 *    ekipman değil sonuç anlatılıyor ve görünür ekipman açıkça yasaklanıyor.
 *  - "fills most of the frame" olmadan ürün sahnede küçülüyor.
 */
const SAHNE =
  "Turn this into a high-end commercial studio product photograph. The product stands on a smooth " +
  "polished dark charcoal floor and fills most of the frame, tightly and confidently composed, shot " +
  "slightly above eye level. Beneath it a soft realistic contact shadow and a faint mirror reflection. " +
  "Behind it a seamless dark grey backdrop with a soft glow right behind the product that falls off to " +
  "near black in the corners. Even, flattering illumination on the product so every surface and edge " +
  "reads clearly. Neutral colour grading, no blue or teal tint. Photorealistic, ultra sharp, medium " +
  "format camera, 85mm lens, professional industrial catalogue photography. " +
  "IMPORTANT: the frame contains ONLY the product, the floor and the backdrop — absolutely no visible " +
  "studio equipment, no softboxes, no lamps, no light panels, no stands, no cables, no people, no text " +
  "and no props of any kind. " +
  "Do not change the product itself: keep the exact same geometry, proportions, the red and dark grey " +
  "colours and the IRONAIR logo exactly as they are.";

const index = JSON.parse(fs.readFileSync(path.join(KOK, "data/katalog-index.json"), "utf8"));
const isler = index.series.map((s) => ({ slug: s.slug, kod: s.code }));
fs.mkdirSync(CACHE, { recursive: true });

let bitti = 0, atlandi = 0, hata = 0;

async function isle(is) {
  const cikti = path.join(CACHE, `${is.slug}.png`);
  if (fs.existsSync(cikti)) { atlandi++; return; }
  const kaynak = path.join(KOK, "public/katalog", is.slug, "ana.webp");
  if (!fs.existsSync(kaynak)) { hata++; console.log(`  ! ${is.slug}: kaynak yok`); return; }

  try {
    const uri = "data:image/png;base64," + fs.readFileSync(kaynak).toString("base64");
    const out = await run("bytedance/seedream-4",
      { prompt: SAHNE, image_input: [uri], size: "2K", aspect_ratio: "match_input_image" },
      { label: is.slug, timeoutMs: 420000 });
    await download(first(out), cikti);
    bitti++;
  } catch (e) {
    hata++;
    console.log(`  ! ${is.slug}: ${String(e.message).slice(0, 110)}`);
  }
  const n = bitti + atlandi + hata;
  if (n % 5 === 0) console.log(`  ${n}/${isler.length} · yeni ${bitti} · atlanan ${atlandi} · hata ${hata} · ≈$${(bitti * 0.03).toFixed(2)}`);
}

const kuyruk = [...isler];
console.log(`${kuyruk.length} ürün · ${ESZAMANLI} eşzamanlı\n`);
await Promise.all(Array.from({ length: ESZAMANLI }, async () => {
  while (kuyruk.length) await isle(kuyruk.shift());
}));
console.log(`\nbitti: ${bitti} yeni · ${atlandi} atlandı · ${hata} hata · maliyet ≈ $${(bitti * 0.03).toFixed(2)}`);
