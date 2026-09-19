import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { uygulamalar } from "@/data/site";
import { categoryBySlug } from "@/data/categories";
import { productsByCategory } from "@/data/products";
import PageHeader from "../components/PageHeader";

export const metadata: Metadata = {
  title: "Uygulama alanları",
  description:
    "Fabrikadan ticari mutfağa, kapalı otoparktan kimya tesisine — her ortamın havalandırma sorunu ve ona uyan IRONAIR fan grupları.",
};

export default function ApplicationsPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 pt-28 sm:px-10 lg:px-14">
      <PageHeader
        baslik="Uygulama alanları"
        aciklama="Aynı fan her yere uymaz. Ortamın ne ürettiği, havanın ne taşıdığı ve kanalın ne kadar uzun olduğu seçimi baştan değiştirir."
      />

      <ul className="mt-16 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {uygulamalar.map((u, i) => {
          const ilkGrup = categoryBySlug(u.gruplar[0]);
          // Aynı grup birkaç alanda geçtiği için farklı ürünü gösteriyoruz.
          const grupUrunleri = ilkGrup ? productsByCategory(ilkGrup.slug) : [];
          const gorsel = grupUrunleri[i % Math.max(grupUrunleri.length, 1)];

          return (
            <li key={u.slug}>
              <Link
                href={`/uygulama-alanlari/${u.slug}`}
                className="grup-kart group relative flex h-full flex-col justify-between overflow-hidden rounded-[2px] border p-6"
                style={
                  {
                    "--acc": ilkGrup?.accent ?? "#E4141B",
                    "--acc-light": ilkGrup?.accentLight ?? "#B00D13",
                  } as React.CSSProperties
                }
              >
                <span aria-hidden="true" className="grup-isik" />

                <span className="relative">
                  <span className="grup-ad block text-[1.2rem] font-bold leading-tight tracking-tight">
                    {u.ad}
                  </span>
                  <span className="mt-3 block text-sm text-ink-muted">{u.ozet}</span>
                </span>

                <span className="relative mt-auto flex items-end justify-between gap-4 pt-6">
                  <span className="tabular shrink-0 text-xs text-ink-faint">
                    {u.degerler[1]?.deger ?? u.degerler[0]?.deger}
                  </span>
                  {gorsel && (
                    <span className="relative -mb-2 block h-32 w-44 shrink-0">
                      <Image
                        src={gorsel.image ?? ""}
                        alt=""
                        fill
                        sizes="220px"
                        className="object-contain object-bottom-right transition-transform duration-500 group-hover:scale-[1.08]"
                      />
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="mt-24">
        <div className="gauge-rule" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <h2 className="h2">Alanınız listede yoksa</h2>
            <p className="prose-measure mt-4 text-ink-muted">
              Ortamın hacmini ve ne iş gördüğünü fan seçim aracına girin, gerekli debiyi
              hesaplayıp uygun grubu önersin.
            </p>
          </div>
          <Link href="/fan-secimi" className="btn btn-primary lg:!min-h-[54px] lg:!px-8">
            Fan seçim aracı
          </Link>
        </div>
      </section>
    </div>
  );
}
