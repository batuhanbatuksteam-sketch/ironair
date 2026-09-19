import type { Product, SpecRange } from "./types";
import index from "./katalog-index.json";

/**
 * Ürün dizini — 52 seri, modelsiz.
 *
 * Modeller burada yok: `katalog-index.json` 88 KB, tam katalog 3,9 MB. Liste,
 * kart ve teklif formu dizinle çalışır; model tablosuna ihtiyaç duyan ürün
 * sayfası `data/katalog.ts` üzerinden sunucu tarafında okur.
 */
export const products = index.series as Product[];

export const productsByCategory = (categorySlug: string) =>
  products.filter((p) => p.categorySlug === categorySlug);

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

/** Katalogdaki toplam model sayısı — 52 serinin altındaki bütün fan boyları. */
export const modelCount = index.modelCount;

/** Kartta ve künyede öne çıkan iki değer: debi ve statik basınç. */
export const leadRanges = (p: Product) =>
  (["debi", "basinc"] as const)
    .map((f) => p.ranges.find((r) => r.field === f))
    .filter((r): r is SpecRange => !!r);
