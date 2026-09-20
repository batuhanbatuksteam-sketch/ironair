import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Panel oturumu.
 *
 * Panelde müşteri adı, telefonu ve e-postası görünüyor; açıkta bırakılamaz.
 * Tek kişilik bir ekip için tam kullanıcı yönetimi gereksiz ağır olurdu:
 * ortak bir parola ve imzalı çerez yeterli. Çerez parolanın kendisini değil,
 * gizli anahtarla üretilmiş HMAC'ini taşır — çerez çalınsa bile parola
 * okunamaz, elle üretilemez.
 */

const CEREZ = "ironair_panel";
const OMUR = 60 * 60 * 24 * 30; // 30 gün

function gizliAnahtar() {
  const s = process.env.PANEL_SIFRE;
  if (!s) throw new Error("PANEL_SIFRE tanımlı değil");
  return s;
}

function imzala(deger: string) {
  return createHmac("sha256", gizliAnahtar()).update(deger).digest("hex");
}

/** Sabit süreli karşılaştırma — zamanlama üzerinden parola sızdırmaz. */
function esit(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function parolaDogru(girilen: string) {
  const beklenen = process.env.PANEL_SIFRE;
  if (!beklenen) return false;
  return esit(girilen, beklenen);
}

export async function oturumAc() {
  const jeton = imzala("acik");
  (await cookies()).set(CEREZ, jeton, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: OMUR,
  });
}

export async function oturumKapat() {
  (await cookies()).delete(CEREZ);
}

export async function oturumAcikMi() {
  if (!process.env.PANEL_SIFRE) return false;
  const jeton = (await cookies()).get(CEREZ)?.value;
  if (!jeton) return false;
  try {
    return esit(jeton, imzala("acik"));
  } catch {
    return false;
  }
}
