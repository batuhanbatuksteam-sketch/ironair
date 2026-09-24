import yonlendirme from "./katalog-yonlendirme.json";

/**
 * 2026-09-24 öncesi yayındaki IRT- kodlarının güncel karşılıkları.
 *
 * Kayıtlı teklif talepleri ürünü ve modeli o günkü slug/adla tutuyor; panel
 * bunları buradan güncel kataloğa bağlar. Eski ürün adreslerinin
 * yönlendirmesi `next.config.ts` içinde aynı dosyadan üretiliyor.
 */
const seriler = yonlendirme.series as Record<string, { slug: string; categorySlug: string }>;
const modeller = yonlendirme.models as Record<string, string>;

/** Eski seri slug'unu güncel slug'a çevirir; güncel slug olduğu gibi döner. */
export const guncelSlug = (slug: string) => seriler[slug]?.slug ?? slug;

/** Eski model adını güncel ada çevirir; güncel ad olduğu gibi döner. */
export const guncelModelAdi = (ad: string) => modeller[ad] ?? ad;
