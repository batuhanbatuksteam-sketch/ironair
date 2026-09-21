"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Durum } from "@/data/teklif-tipi";
import { COMPANY } from "@/data/company";
import { durumDegistir, notEkle, teklifGetir, yanitKaydet } from "@/lib/teklif-deposu";
import { oturumAc, oturumAcikMi, oturumKapat, parolaDogru } from "@/lib/panel-oturum";

async function korumaliIslem<T>(islem: () => Promise<T>) {
  if (!(await oturumAcikMi())) redirect("/panel/giris");
  return islem();
}

export async function girisYap(_onceki: string | null, form: FormData) {
  const parola = String(form.get("parola") ?? "");
  if (!parolaDogru(parola)) return "Parola yanlış.";
  await oturumAc();
  redirect("/panel");
}

export async function cikisYap() {
  await oturumKapat();
  redirect("/panel/giris");
}

export async function durumuGuncelle(id: string, durum: Durum) {
  await korumaliIslem(() => durumDegistir(id, durum));
  revalidatePath("/panel");
}

export async function notKaydet(id: string, form: FormData) {
  const metin = String(form.get("not") ?? "").trim();
  if (!metin) return;
  await korumaliIslem(() => notEkle(id, metin));
  revalidatePath("/panel");
}

/**
 * Panelden müşteriye yanıt gönderir.
 *
 * Gönderen `teklif@mail.ironair.com.tr`; `reply_to` ve gizli kopya şirketin
 * kendi kutusuna ayarlı. Böylece müşteri "Yanıtla" dediğinde mail Gmail'e
 * düşüyor ve gönderilen her yanıtın bir nüshası da Gmail'de duruyor — panel
 * kapalıyken bile yazışmanın izi kayboluyor değil.
 */
export async function yanitGonder(id: string, form: FormData): Promise<string | null> {
  if (!(await oturumAcikMi())) redirect("/panel/giris");

  const konu = String(form.get("konu") ?? "").trim();
  const metin = String(form.get("metin") ?? "").trim();
  if (!konu || !metin) return "Konu ve mesaj boş olamaz.";

  const teklif = await teklifGetir(id);
  if (!teklif) return "Talep bulunamadı.";

  const anahtar = process.env.RESEND_API_KEY;
  if (!anahtar) return "RESEND_API_KEY tanımlı değil.";

  const kutu = process.env.TEKLIF_ALICI_EPOSTA ?? COMPANY.email;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${anahtar}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.TEKLIF_GONDEREN_EPOSTA ?? "IRONAIR <teklif@mail.ironair.com.tr>",
      to: [teklif.musteri.eposta],
      bcc: [kutu],
      reply_to: kutu,
      subject: konu,
      text: metin,
    }),
  });

  if (!res.ok) {
    const govde = await res.text();
    console.error("[panel] yanıt gönderilemedi", res.status, govde);
    // Resend'in kendi açıklaması kullanıcıya en anlamlı bilgi.
    try {
      return `Gönderilemedi: ${JSON.parse(govde).message ?? res.status}`;
    } catch {
      return `Gönderilemedi (${res.status}).`;
    }
  }

  await yanitKaydet(id, { zaman: new Date().toISOString(), konu, metin });
  revalidatePath("/panel");
  return null;
}
