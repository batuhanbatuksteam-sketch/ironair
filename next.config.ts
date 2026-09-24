import type { NextConfig } from "next";
import yonlendirme from "./data/katalog-yonlendirme.json";

/** IRT- önekli eski ürün adresleri → güncel IRR- adresleri. */
const eskiUrunler = Object.entries(
  yonlendirme.series as Record<string, { slug: string; categorySlug: string }>,
).map(([eski, yeni]) => ({
  source: `/urunler/:kategori/${eski}`,
  destination: `/urunler/${yeni.categorySlug}/${yeni.slug}`,
  permanent: true,
}));

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return eskiUrunler;
  },
};

export default nextConfig;
