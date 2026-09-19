import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/data/categories";
import { modelCount, products, productsByCategory } from "@/data/products";
import ProductCard from "../components/ProductCard";

export const metadata: Metadata = {
  title: "Ürünler",
  description:
    "IRONAIR endüstriyel fan kataloğu: aksiyel aspiratör, radyal fan, sanayi tipi radyal fan, çatı fanı, kanal tipi fan, ATEX exproof fan ve hücreli fan sistemleri.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 pt-28 sm:px-10 lg:px-14">
      <div className="gauge-rule" data-accent="true" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end">
        <h1 className="h1">Ürün kataloğu</h1>
        <p className="prose-measure text-ink-muted">
          {products.length} seri ve {modelCount} model, {categories.length} grupta. Her
          serinin sayfasında model tablosundan boyu seçip o boyun tam teknik
          değerleriyle teklif isteyebilirsiniz.
        </p>
      </div>

      <nav aria-label="Ürün grupları" className="mt-10 flex flex-wrap gap-2">
        {categories.map((c) => (
          <a
            key={c.slug}
            href={`#${c.slug}`}
            className="oneri-satir flex items-center gap-2.5 rounded-[2px] border px-3.5 py-2 text-sm font-medium"
            style={{ "--acc": c.accent, "--acc-light": c.accentLight } as React.CSSProperties}
          >
            <span aria-hidden="true" className="oneri-nokta h-2 w-2 rounded-full" />
            {c.name}
          </a>
        ))}
      </nav>

      <div className="mt-20 space-y-24">
        {categories.map((c) => {
          const items = productsByCategory(c.slug);
          return (
            <section key={c.slug} id={c.slug} className="scroll-mt-24">
              <div
                aria-hidden="true"
                className="h-[3px] w-20"
                style={{ background: c.accent }}
              />
              <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4">
                <h2 className="h2">
                  <Link href={`/urunler/${c.slug}`} className="hover:text-red-text">
                    {c.name}
                  </Link>
                </h2>
                <span className="tabular text-sm text-ink-faint">
                  {items.length} seri · {items.reduce((n, p) => n + p.modelCount, 0)} model
                </span>
              </div>
              <p className="prose-measure mt-3 text-sm text-ink-muted">{c.summary}</p>

              <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
