import type { Metadata } from "next";
import Link from "next/link";
import { sss } from "@/data/site";
import PageHeader from "../components/PageHeader";

export const metadata: Metadata = {
  title: "Sık sorulan sorular",
  description:
    "Fan seçimi, debi ve basınç farkı, özel ölçü üretim, teslim süresi, ses sorunu, yedek parça ve bakım hakkında sık sorulan sorular.",
};

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 pt-28 sm:px-10 lg:px-14">
      <PageHeader
        baslik="Sık sorulan sorular"
        aciklama="Teklif aşamasında en çok gelen sorular ve kısa cevapları. Aradığınız burada yoksa doğrudan arayın."
      />

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          {sss.map((s, i) => (
            <details key={s.soru} className="sss-ogesi group border-b" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start gap-4 py-5">
                <span className="tabular mt-1 shrink-0 text-sm text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h3 min-w-0 grow">{s.soru}</span>
                <span
                  aria-hidden="true"
                  className="sss-isaret mt-1 grid h-6 w-6 shrink-0 place-items-center"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                </span>
              </summary>
              <p className="prose-measure pb-6 pl-[2.75rem] text-ink-muted">{s.cevap}</p>
            </details>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2px] border bg-surface p-6">
            <h2 className="h3">Cevabı bulamadınız mı?</h2>
            <p className="mt-3 text-sm text-ink-muted">
              Teknik ekip mesai saatleri içinde telefonda. Ölçüyü bilmeseniz de olur —
              ortamı anlatmanız yeterli.
            </p>
            <Link href="/iletisim" className="btn btn-ghost mt-6 w-full">
              İletişim
            </Link>
            <Link href="/fan-secimi" className="btn btn-primary mt-2 w-full">
              Fan seçim aracı
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
