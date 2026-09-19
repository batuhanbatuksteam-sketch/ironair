import { NextResponse } from "next/server";
import { COMPANY } from "@/data/company";

/**
 * Teklif talebi uç noktası.
 *
 * Şu an talebi doğrular, WhatsApp bağlantısını üretir ve e-postayı
 * RESEND_API_KEY tanımlıysa gönderir. Anahtar yoksa talep sunucu günlüğüne
 * yazılır ve akış bozulmaz — kalıcı e-posta/WhatsApp entegrasyonu sonraki adım.
 */

type Secim = { group: string; value: string };

type Govde = {
  ad?: string;
  firma?: string;
  telefon?: string;
  eposta?: string;
  not?: string;
  urun?: { ad?: string; kod?: string; slug?: string };
  secimler?: Secim[];
};

const EPOSTA_DESENI = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** En az 10 rakam — 0532…, +90 532…, (0212)… biçimlerini kabul eder. */
const telefonGecerli = (v: string) => (v.match(/\d/g) ?? []).length >= 10;

function metinKur(g: Govde) {
  const satirlar = [
    "Yeni teklif talebi",
    "",
    `Ürün: ${g.urun?.ad ?? "-"} (${g.urun?.kod ?? "-"})`,
    "",
    "Seçimler:",
    ...(g.secimler ?? []).map((s) => `• ${s.group}: ${s.value}`),
    "",
    `Ad soyad: ${g.ad}`,
    g.firma ? `Firma: ${g.firma}` : null,
    `Telefon: ${g.telefon}`,
    `E-posta: ${g.eposta}`,
    g.not ? `Not: ${g.not}` : null,
  ].filter(Boolean);
  return satirlar.join("\n");
}

async function epostaGonder(konu: string, metin: string) {
  const key = process.env.RESEND_API_KEY;
  const alici = process.env.TEKLIF_ALICI_EPOSTA ?? COMPANY.email;
  if (!key) {
    console.log(`[teklif] e-posta gönderilemedi (RESEND_API_KEY yok)\n${metin}`);
    return { gonderildi: false };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.TEKLIF_GONDEREN_EPOSTA ?? "IRONAIR <teklif@ironair.com.tr>",
      to: [alici],
      subject: konu,
      text: metin,
    }),
  });
  if (!res.ok) {
    console.error("[teklif] Resend hatası", res.status, await res.text());
    return { gonderildi: false };
  }
  return { gonderildi: true };
}

export async function POST(request: Request) {
  let govde: Govde;
  try {
    govde = await request.json();
  } catch {
    return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
  }

  const ad = (govde.ad ?? "").trim();
  const telefon = (govde.telefon ?? "").trim();
  const eposta = (govde.eposta ?? "").trim();

  if (!ad) return NextResponse.json({ hata: "Ad soyad gerekli." }, { status: 400 });
  if (!telefonGecerli(telefon))
    return NextResponse.json({ hata: "Telefon numarası eksik görünüyor." }, { status: 400 });
  if (!EPOSTA_DESENI.test(eposta))
    return NextResponse.json({ hata: "E-posta adresi geçersiz." }, { status: 400 });

  const metin = metinKur({ ...govde, ad, telefon, eposta });
  const konu = `Teklif: ${govde.urun?.ad ?? "ürün"} — ${ad}`;

  await epostaGonder(konu, metin);

  // Ziyaretçinin aynı talebi WhatsApp'tan da yollayabilmesi için hazır bağlantı.
  const whatsappUrl = `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(metin)}`;

  return NextResponse.json({ tamam: true, whatsappUrl });
}
