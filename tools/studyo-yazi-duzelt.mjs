/**
 * Stüdyo fotoğraflarındaki bozuk marka yazısını ve etiket kalıntılarını temizler.
 *
 * 52 fotoğrafın tamamı gözle denetlendi. Modelin 3B eğri yüzeye yazı yazması
 * güvenilir değil: 11 karede yazı bozuldu (4'ünde kaynak marka adı geri geldi).
 * Yeniden yazdırmak kumar — her deneme yeniden denetim ister ve ince hatalar
 * (çift çizgi, noktalı İ) küçük boyutta gözden kaçar. Bu yüzden bozuk karelerde
 * yazı tamamen kaldırılıyor: sonuç deterministik ve "yanlış marka adı görünmesin"
 * şartını kesin sağlıyor. Doğru yazılmış kareler olduğu gibi bırakıldı.
 */
import { run, download, first } from "./replicate.mjs";
import fs from "node:fs";
import path from "node:path";

const KOK = process.cwd();
const CACHE = path.join(KOK, "tools/.cache/studyo");

/** Yazısı bozuk ya da okunamayacak kadar belirsiz olanlar → yazı silinir. */
const YAZI_SIL = [
  "irt-al-k", "irt-ba", "irt-dka", "irt-dmk", "irt-igk",
  "irt-k", "irt-ko-h", "irt-t", "irt-ska", "irt-a", "irt-al",
];

/** Yazısı doğru ama üzerinde etiket kalıntısı olanlar → yazı korunur. */
const ETIKET_SIL = ["irt-fgm80", "irt-h", "irt-uvx", "irt-ujet-r"];

const P_YAZI =
  "Remove ALL text, lettering, words and logos from the product's surfaces. Every painted or printed " +
  "word must be gone, leaving the bare surface underneath — clean, evenly coloured metal with the same " +
  "paint finish, sheen and lighting as the surrounding panel. Do not replace the text with anything, " +
  "do not leave faint ghosting, smudges or outlines where the letters were. Also remove any small round " +
  "green sticker and any yellow warning label. " +
  "Change NOTHING else: keep the exact same product geometry, the same red and dark grey colours, the " +
  "same camera angle, the same studio floor, reflection, background and lighting.";

const P_ETIKET =
  "Remove only the small round green sticker and any small yellow warning label from the product, " +
  "leaving clean bare surface where they were, matching the surrounding paint finish and lighting. " +
  "KEEP the red IRONAIR wordmark exactly as it is — do not touch, move, redraw or alter that text. " +
  "Change NOTHING else: same geometry, same colours, same camera angle, same floor, reflection, " +
  "background and lighting.";

const isler = [
  ...YAZI_SIL.map((s) => ({ slug: s, prompt: P_YAZI, tip: "yazı" })),
  ...ETIKET_SIL.map((s) => ({ slug: s, prompt: P_ETIKET, tip: "etiket" })),
];

let n = 0;
for (const is of isler) {
  process.stdout.write(`  ${is.slug.padEnd(14)} (${is.tip}) ... `);
  try {
    const kaynak = path.join(KOK, "public/katalog", is.slug, "studyo.webp");
    const uri = "data:image/png;base64," + fs.readFileSync(kaynak).toString("base64");
    const out = await run("bytedance/seedream-4",
      { prompt: is.prompt, image_input: [uri], size: "2K", aspect_ratio: "match_input_image" },
      { label: is.slug, timeoutMs: 420000 });
    await download(first(out), path.join(CACHE, `${is.slug}.png`));
    n++;
    console.log("✓");
  } catch (e) { console.log("HATA:", String(e.message).slice(0, 110)); }
}
console.log(`\n${n}/${isler.length} düzeltildi · maliyet ≈ $${(n * 0.03).toFixed(2)}`);
