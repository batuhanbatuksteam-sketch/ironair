import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, categoryBySlug } from "@/data/categories";
import { productsByCategory } from "@/data/products";
import ProductCard from "../../../components/ProductCard";

type Params = { params: Promise<{ kategori: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ kategori: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { kategori } = await params;
  const c = categoryBySlug(kategori);
  if (!c) return {};
  return { title: c.name, description: c.summary };
}

export default async function CategoryPage({ params }: Params) {
  const { kategori } = await params;
  const category = categoryBySlug(kategori);
  if (!category) notFound();

  /* Sıra katalogdan gelir: firmanın öne aldığı seriler başta, kalanlar büyük
     debiden küçüğe (tools/katalog-normalize.py). */
  const items = productsByCategory(category.slug);

  const modelToplam = items.reduce((n, p) => n + p.modelCount, 0);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 pt-28 sm:px-10 lg:px-14">
      <nav aria-label="Konum" className="mb-8 text-sm text-ink-faint">
        <Link href="/urunler" className="hover:text-red-text">
          Ürünler
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink-muted">{category.name}</span>
      </nav>

      <div className="gauge-rule" />
      <div
        aria-hidden="true"
        className="mt-6 h-[3px] w-24"
        style={{ background: category.accent }}
      />
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end">
        <h1 className="h1">{category.name}</h1>
        <div>
          <p className="prose-measure text-ink-muted">{category.summary}</p>
          <p className="tabular mt-4 text-sm text-ink-faint">
            {items.length} seri · {modelToplam} model
          </p>
        </div>
      </div>

      <ul className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </ul>
    </div>
  );
}
