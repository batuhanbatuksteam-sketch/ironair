import { put, list, get } from "@vercel/blob";
import type { Teklif, Durum, Not, Yanit } from "@/data/teklif-tipi";

/**
 * Teklif kayıtlarının deposu — Vercel Blob üstünde.
 *
 * Her talep tek bir JSON nesnesi olarak `teklif/<id>.json` yoluna yazılır.
 * Kimlik zaman damgasıyla başlar (`20260920T143012-a1b2`), böylece Blob'un
 * yol sırasına göre listelemesi doğrudan kronolojik sıra verir ve ayrı bir
 * dizin dosyası tutmaya gerek kalmaz.
 *
 * Depo **private**: kayıtlarda müşteri adı, telefonu ve e-postası var, bunlar
 * tahmin edilemez bir URL'nin arkasında bile açıkta duramaz. Okuma da yazma da
 * kimlik doğrulamasından geçiyor (Vercel OIDC).
 *
 * Bu ölçek için yeterli: endüstriyel B2B sitesi günde birkaç talep alır,
 * yüzlerce kayıtta bile listeleme tek çağrı. Hacim büyürse buradaki
 * fonksiyonların imzası korunarak altına gerçek bir veritabanı konabilir.
 */

const ONEK = "teklif/";
const ERISIM = "private" as const;

function kimlikUret() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const damga =
    `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}`;
  return `${damga}-${Math.random().toString(36).slice(2, 6)}`;
}

function yol(id: string) {
  return `${ONEK}${id}.json`;
}

async function yaz(teklif: Teklif) {
  await put(yol(teklif.id), JSON.stringify(teklif, null, 1), {
    access: ERISIM,
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
  return teklif;
}

/** Private blob'u okuyup JSON'a çevirir; yoksa null. */
async function oku(pathname: string): Promise<Teklif | null> {
  try {
    // useCache:false — durum değişince panel anında güncel kaydı görsün.
    const sonuc = await get(pathname, { access: ERISIM, useCache: false });
    if (!sonuc) return null;
    return JSON.parse(await new Response(sonuc.stream).text()) as Teklif;
  } catch {
    return null;
  }
}

export async function teklifOlustur(
  girdi: Omit<Teklif, "id" | "olusturuldu" | "durum" | "notlar">
): Promise<Teklif> {
  return yaz({
    ...girdi,
    id: kimlikUret(),
    olusturuldu: new Date().toISOString(),
    durum: "yeni",
    notlar: [],
  });
}

/** Yeniden eskiye sıralı tüm talepler. */
export async function teklifleriListele(): Promise<Teklif[]> {
  const { blobs } = await list({ prefix: ONEK, limit: 1000 });
  const kayitlar = await Promise.all(blobs.map((b) => oku(b.pathname)));
  return kayitlar
    .filter((t): t is Teklif => !!t)
    .sort((a, b) => b.id.localeCompare(a.id));
}

export async function teklifGetir(id: string): Promise<Teklif | null> {
  return oku(yol(id));
}

export async function durumDegistir(id: string, durum: Durum): Promise<Teklif | null> {
  const teklif = await teklifGetir(id);
  if (!teklif) return null;
  return yaz({ ...teklif, durum });
}

export async function notEkle(id: string, metin: string): Promise<Teklif | null> {
  const teklif = await teklifGetir(id);
  if (!teklif) return null;
  const not: Not = { zaman: new Date().toISOString(), metin };
  return yaz({ ...teklif, notlar: [...teklif.notlar, not] });
}

/** Gönderilen yanıtı kaydeder ve talebi "yanıtlandı" durumuna alır. */
export async function yanitKaydet(id: string, yanit: Yanit): Promise<Teklif | null> {
  const teklif = await teklifGetir(id);
  if (!teklif) return null;
  return yaz({
    ...teklif,
    durum: "yanitlandi",
    yanitlar: [...(teklif.yanitlar ?? []), yanit],
  });
}
