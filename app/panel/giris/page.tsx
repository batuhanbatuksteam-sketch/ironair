import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { oturumAcikMi } from "@/lib/panel-oturum";
import Wordmark from "../../components/Wordmark";
import GirisFormu from "./GirisFormu";

export const metadata: Metadata = {
  title: "Teklif Masası — Giriş",
  robots: { index: false, follow: false },
};

export default async function GirisSayfasi() {
  if (await oturumAcikMi()) redirect("/panel");

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Wordmark />
        <h1 className="h2 mt-8">Teklif Masası</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Siteden gelen teklif taleplerini görmek için parolayı girin.
        </p>
        <GirisFormu />
      </div>
    </div>
  );
}
