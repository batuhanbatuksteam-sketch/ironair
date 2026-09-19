import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { uygulamalar, uygulamaBySlug } from "@/data/site";
import { categoryBySlug } from "@/data/categories";
import { productsByCategory } from "@/data/products";
import ProductCard from "../../components/ProductCard";

type Params = { params: Promise<{ alan: string }> };

export function generateStaticParams() {
  return uygulamalar.map((u) => ({ alan: u.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { alan } = await params;
  const u = uygulamaBySlug(alan);
  if (!u) return {};
  return { title: u.ad, description: u.ozet };
}

export default async function ApplicationPage({ params }: Params) {
  const { alan } = await params;
  const uygulama = uygulamaBySlug(alan);
  if (!uygulama) notFound();

  const gruplar = uygulama.gruplar
    .map((s) => categoryBySlug(s))
    .filter((c): c is NonNullable<typeof c> => !!c);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 pt-28 sm:px-10 lg:px-14">
      <nav aria-label="Konum" className="mb-8 text-sm text-ink-faint">
        <Link href="/uygulama-alanlari" className="hover:text-red-text">
          Uygulama alanları
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink-muted">{uygulama.ad}</span>
      </nav>

      <div className="gauge-rule" data-accent="true" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end">
        <h1 className="h1">{uygulama.ad}</h1>
        <p className="prose-measure text-ink-muted">{uygulama.ozet}</p>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <h2 className="h2">Çözülmesi gereken</h2>
          <p className="prose-measure mt-5 text-ink-muted">{uygulama.sorun}</p>
        </div>

        <div>
          <h2 className="h3 border-b pb-3">Sahadan tipik değerler</h2>
          <dl className="mt-1">
            {uygulama.degerler.map((d) => (
              <div
                key={d.etiket}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-3 text-sm"
              >
                <dt className="shrink-0 text-ink-muted">{d.etiket}</dt>
                <dd className="tabular min-w-0 grow text-right font-medium">{d.deger}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="mt-24">
        <div className="gauge-rule" />
        <h2 className="h2 mt-10">Bu alanda kullanılan gruplar</h2>

        {gruplar.map((c) => {
          const items = productsByCategory(c.slug).slice(0, 3);
          return (
            <div key={c.slug} className="mt-14">
              <div className="flex flex-wrap items-baseline justify-between gap-4 border-b pb-4">
                <h3 className="h3">
                  <Link href={`/urunler/${c.slug}`} className="hover:text-red-text">
                    {c.name}
                  </Link>
                </h3>
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: c.accent }}
                  aria-hidden="true"
                />
              </div>
              <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="mt-24">
        <div className="gauge-rule" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <h2 className="h2">Bu ortam için teklif alın</h2>
            <p className="prose-measure mt-4 text-ink-muted">
              Hacmi ve kanal durumunu yazın, çalışma noktasını çıkarıp seriyi birlikte
              belirleyelim.
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
