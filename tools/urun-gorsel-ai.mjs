/**
 * Plandaki görselleri Replicate'ten geçirir ve ham çıktıyı önbelleğe yazar.
 *
 * İki model: marka izi taşıyanlarda qwen-image-edit (logo/etiket), ardından
 * 2K altında kalan her görselde real-esrgan. Renk dönüşümü bu adımda YOK —
 * o yerel olarak, deterministik biçimde en sonda uygulanıyor.
 *
 * Tamamlanan her dosya önbellekte kalır; script yeniden çalıştırılırsa
 * atlanır, aynı iş iki kez faturalanmaz.
 */
import { run, download, first } from "./replicate.mjs";
import fs from "node:fs";
import path from "node:path";

const KOK = process.cwd();
const CACHE = path.join(KOK, "tools/.cache/gorsel-ham");
const PLAN = JSON.parse(fs.readFileSync(path.join(KOK, "tools/.cache/gorsel-plan.json"), "utf8"));
const HEDEF_KENAR = 2048;
const ESZAMANLI = 3;

const YONERGE = {
  yazi:
    "Replace the UVENTS logo text with the text IRONAIR, in exactly the same orange color, " +
    "same font style, same size and same position. Remove any small round green sticker and any " +
    "small yellow warning label completely, leaving clean bare metal surface where they were. " +
    "Keep absolutely everything else identical: the fan geometry, the orange and dark grey colors, " +
    "the lighting, the shadows, the white background.",
  etiket:
    "Remove the small round green sticker and the small yellow warning label completely, leaving " +
    "clean bare metal surface where they were. Do not add any text or logo. Keep absolutely " +
    "everything else identical: the geometry, the orange and dark grey colors, the lighting, " +
    "the shadows, the white background.",
};

const uri = (p) => "data:image/png;base64," + fs.readFileSync(p).toString("base64");

let bitti = 0, atlandi = 0, hata = 0, qwenSayi = 0, upSayi = 0;

async function isle(is) {
  const cikti = path.join(CACHE, is.cikti.replace(/\.webp$/, ".png"));
  if (fs.existsSync(cikti)) { atlandi++; return; }
  fs.mkdirSync(path.dirname(cikti), { recursive: true });

  let gecici = is.kaynak;
  const ara = cikti + ".ara.png";

  try {
    // Önceki koşuda qwen'den dönmüş ama büyütme aşamasında kalmış çıktı varsa
    // onu kullan — aynı düzenleme için ikinci kez ödeme yapılmasın.
    if (fs.existsSync(ara)) {
      gecici = ara;
    } else if (is.iz) {
      const out = await run("qwen/qwen-image-edit",
        { image: uri(gecici), prompt: YONERGE[is.iz], output_format: "png" },
        { label: is.cikti, timeoutMs: 420000 });
      await download(first(out), ara);
      gecici = ara;
      qwenSayi++;
    }

    // 2) 2K altındaysa büyüt — qwen çıktısı da ~1100 px döndüğü için
    //    düzenlenen her görsel buraya düşer. real-esrgan ~3 MP üstü girdiyi
    //    reddediyor; o boyuttaki kareler zaten 2K'ya yakın, olduğu gibi geçer.
    const { width, height } = await olcu(gecici);
    const ESRGAN_PIKSEL_SINIRI = 2_000_000;
    if (Math.max(width, height) < HEDEF_KENAR && width * height < ESRGAN_PIKSEL_SINIRI) {
      const kat = Math.max(width, height) < 1100 ? 3 : 2;
      const up = await run("nightmareai/real-esrgan",
        { image: uri(gecici), scale: kat, face_enhance: false },
        { label: is.cikti + " ↑", timeoutMs: 420000 });
      await download(first(up), cikti);
      upSayi++;
    } else {
      fs.copyFileSync(gecici, cikti);
    }
    if (fs.existsSync(ara)) fs.unlinkSync(ara);
    bitti++;
  } catch (e) {
    hata++;
    console.log(`  ! ${is.cikti}: ${String(e.message).slice(0, 120)}`);
  }
  const toplam = bitti + atlandi + hata;
  if (toplam % 10 === 0) {
    console.log(`  ${toplam}/${PLAN.length} · yeni ${bitti} · atlanan ${atlandi} · hata ${hata} · ` +
      `≈$${(qwenSayi * 0.03 + upSayi * 0.002).toFixed(2)}`);
  }
}

/** PNG başlığından boyut okur — dosyayı tamamen çözmeye gerek yok. */
async function olcu(p) {
  const b = fs.readFileSync(p, { length: 33 });
  if (b.slice(1, 4).toString() === "PNG")
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  return { width: 0, height: 0 };
}

const kuyruk = [...PLAN];
console.log(`${kuyruk.length} görsel · ${ESZAMANLI} eşzamanlı\n`);
await Promise.all(Array.from({ length: ESZAMANLI }, async () => {
  while (kuyruk.length) await isle(kuyruk.shift());
}));

console.log(`\nbitti: ${bitti} yeni · ${atlandi} atlandı · ${hata} hata`);
console.log(`qwen ${qwenSayi} · esrgan ${upSayi} · gerçekleşen maliyet ≈ $${(qwenSayi * 0.03 + upSayi * 0.002).toFixed(2)}`);
