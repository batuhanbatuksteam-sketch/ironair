"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Durum } from "@/data/teklif-tipi";
import { durumDegistir, notEkle } from "@/lib/teklif-deposu";
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
