import type { Metadata } from "next";
import Link from "next/link";
import { referanslar } from "@/data/site";
import PageHeader from "../../components/PageHeader";

export const metadata: Metadata = {
  title: "Referanslar",
  description:
    "IRONAIR'in dökümhaneden hastaneye, tersaneden kapalı otoparka kadar tamamladığı havalandırma projeleri.",
};

export default function ReferencesPage() {
  const sektorler = [...new Set(referanslar.map((r) => r.sektor))];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 pt-28 sm:px-10 lg:px-14">
      <PageHeader
        baslik="Referanslar"
        aciklama="Her proje kendi sorunuyla geldi: biri ocak üstündeki ısıyı, biri kanaldaki yağı, biri boyahanedeki solvent buharını çözmek zorundaydı."
      />

      <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
        <Sayi deger={String(referanslar.length)} etiket="listelenen proje" />
        <Sayi deger={String(sektorler.length)} etiket="farklı sektör" />
        <Sayi deger="2022" etiket="en eski kayıt" />
        <Sayi deger="2025" etiket="en yeni kayıt" />
      </dl>

      <div className="mt-16 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">Tamamlanan projeler listesi</caption>
          <thead>
            <tr className="border-y">
              <th scope="col" className="py-3 pr-6 text-sm font-semibold">Proje</th>
              <th scope="col" className="py-3 pr-6 text-sm font-semibold">Sektör</th>
              <th scope="col" className="py-3 pr-6 text-sm font-semibold">Şehir</th>
              <th scope="col" className="py-3 pr-6 text-sm font-semibold">Yapılan iş</th>
              <th scope="col" className="py-3 pr-6 text-right text-sm font-semibold">Ölçü</th>
              <th scope="col" className="py-3 text-right text-sm font-semibold">Yıl</th>
            </tr>
          </thead>
          <tbody>
            {referanslar.map((r) => (
              <tr key={r.ad} className="ref-satir border-b">
                <td className="py-4 pr-6 font-medium">{r.ad}</td>
                <td className="py-4 pr-6 text-sm text-ink-muted">{r.sektor}</td>
                <td className="py-4 pr-6 text-sm text-ink-muted">{r.sehir}</td>
                <td className="py-4 pr-6 text-sm text-ink-muted">{r.is}</td>
                <td className="tabular py-4 pr-6 text-right text-sm">{r.olcu}</td>
                <td className="tabular py-4 text-right text-sm text-ink-muted">{r.yil}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-xs text-ink-faint">
        Liste örnek niteliğindedir; müşteri adları ticari gizlilik gereği kısaltılmıştır.
      </p>

      <section className="mt-24">
        <div className="gauge-rule" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <h2 className="h2">Benzer bir işiniz mi var?</h2>
            <p className="prose-measure mt-4 text-ink-muted">
              Projenin hacmini ve ne iş gördüğünü anlatın; benzer kurulumlardan çıkan
              çalışma noktasını paylaşalım.
            </p>
          </div>
          <Link href="/teklif" className="btn btn-primary lg:!min-h-[54px] lg:!px-8">
            Teklif iste
          </Link>
        </div>
      </section>
    </div>
  );
}

function Sayi({ deger, etiket }: { deger: string; etiket: string }) {
  return (
    <div>
      <dt className="sr-only">{etiket}</dt>
      <dd>
        <span className="tabular block text-[2rem] font-bold leading-none tracking-tight">
          {deger}
        </span>
        <span className="mt-2 block text-sm text-ink-muted">{etiket}</span>
      </dd>
    </div>
  );
}
