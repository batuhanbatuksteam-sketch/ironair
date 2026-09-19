import type { Product, ProductModel } from "./types";
import katalog from "./katalog.json";

/**
 * Tam katalog — 454 modelin spec tabloları dahil (3,9 MB).
 *
 * Yalnızca sunucu bileşenlerinden import edilir. Bir istemci bileşeni bunu
 * çekerse 3,9 MB tarayıcı paketine girer; ürün sayfası buradan tek serinin
 * modellerini alıp yalnızca onu istemciye geçirir.
 */
const seriler = katalog.series as Product[];

/** Serinin modelleriyle birlikte tam kaydı. */
export const seriDetay = (slug: string) => seriler.find((s) => s.slug === slug);

/** Bir serinin model listesi — ürün sayfasındaki tablo ve seçici bunu kullanır. */
export const modeller = (slug: string): ProductModel[] => seriDetay(slug)?.models ?? [];
