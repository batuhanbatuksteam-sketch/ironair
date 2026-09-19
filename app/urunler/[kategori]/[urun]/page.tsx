import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryBySlug } from "@/data/categories";
import { seriDetay } from "@/data/katalog";
import { productBySlug, products, productsByCategory } from "@/data/products";
import { uygulamalarByCategory } from "@/data/site";
import Configurator from "../../../components/Configurator";
import ProductCard from "../../../components/ProductCard";
import ProductGallery from "../../../components/ProductGallery";

type Params = { params: Promise<{ kategori: string; urun: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ kategori: p.categorySlug, urun: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { urun } = await params;
  const p = productBySlug(urun);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.code}`,
    description: `${p.summary} ${p.modelCount} model, ${
      p.ranges.find((r) => r.field === "debi")?.display ?? ""
    } debi aralığı.`.trim(),
  };
}

export default async function ProductPage({ params }: Params) {
  const { kategori, urun } = await params;
  const product = productBySlug(urun);
  const category = categoryBySlug(kategori);
  if (!product || !category || product.categorySlug !== category.slug) notFound();

  /* Model tabloları yalnızca bu sayfada gerekiyor — tam katalog sunucuda okunup
     istemciye tek serinin modelleri geçiriliyor. */
  const models = seriDetay(product.slug)?.models ?? [];

  const alanlar = uygulamalarByCategory(category.slug);

  const siblings = productsByCategory(category.slug)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 pt-28 sm:px-10 lg:px-14">
      <nav aria-label="Konum" className="mb-8 text-sm text-ink-faint">
        <Link href="/urunler" className="hover:text-red-text">
          Ürünler
        </Link>
        <span className="px-2">/</span>
        <Link href={`/urunler/${category.slug}`} className="hover:text-red-text">
          {category.name}
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink-muted">{product.name}</span>
      </nav>

      {/* Künye: galeri solda, tanım ve seri aralıkları sağda */}
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <ProductGallery
          images={[product.image, ...product.gallery].filter((s): s is string => !!s)}
          alt={product.name}
          accent={category.accent}
          accentLight={category.accentLight}
        />

        <div className="min-w-0">
          <span className="tabular text-sm text-ink-faint">{product.code}</span>
          <h1 className="h1 mt-2">{product.name}</h1>
          <p className="prose-measure mt-5 text-ink-muted">{product.summary}</p>

          <h2 className="h3 mt-10 border-b pb-3">
            Seri aralığı{" "}
            <span className="tabular text-sm font-normal text-ink-faint">
              {product.modelCount} model
            </span>
          </h2>
          <dl className="mt-1">
            {product.ranges.map((r) => (
              <div
                key={r.field}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-3 text-sm"
              >
                <dt className="shrink-0 text-ink-muted">{r.label}</dt>
                <dd className="tabular min-w-0 grow text-right font-medium break-words">
                  {r.display}
                </dd>
              </div>
            ))}
          </dl>

          {alanlar.length > 0 && (
            <>
              <h2 className="h3 mt-10 border-b pb-3">Kullanım alanları</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {alanlar.map((u) => (
                  <li key={u.slug}>
                    <Link
                      href={`/uygulama-alanlari/${u.slug}`}
                      className="block rounded-[2px] border px-3 py-1.5 text-sm text-ink-muted transition-colors hover:text-red-text"
                    >
                      {u.ad}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="gauge-rule mt-24" data-accent="true" />
      <div className="mt-14">
        <Configurator product={product} models={models} />
      </div>

      {siblings.length > 0 && (
        <section className="mt-28">
          <div className="gauge-rule" />
          <h2 className="h2 mt-10">{category.name} grubundan diğerleri</h2>
          <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
