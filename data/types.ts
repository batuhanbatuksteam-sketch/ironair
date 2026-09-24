/**
 * Katalog tipleri.
 *
 * Veri `tools/katalog-normalize.py` tarafından üretilir; buradaki tipler o
 * çıktının şeklini yansıtır. Elle düzenlenmez — kaynak değişirse script
 * yeniden çalıştırılır.
 */

/** Model spec tablosundaki tek satır. */
export type SpecRow = {
  /** Kaynak anahtarı — `volumeMax`, `powerRated` gibi. */
  key: string;
  label: string;
  /** Katalogdaki sembol, HTML alt simge içerebilir (`q<sub>v, max</sub>`). */
  symbol: string | null;
  unit: string | null;
  value: string | number;
  /** Tabloda basılacak hali: binlik ayraçlı sayı + birim. */
  display: string;
};

/** Spec satırlarının konu başlığı — "Hava performansı", "Motor"… */
export type SpecGroup = {
  id: string;
  label: string;
  rows: SpecRow[];
};

/** Serideki tek bir fan boyu. Teklif bu seviyede verilir. */
export type ProductModel = {
  id: number;
  slug: string;
  name: string;
  subname: string | null;
  groups: SpecGroup[];
};

/** Serinin modelleri arasındaki min–max aralık. Kart ve künye bunu gösterir. */
export type SpecRange = {
  field: "debi" | "basinc" | "guc" | "devir" | "cap" | "agirlik";
  label: string;
  unit: string;
  min: number;
  max: number;
  /** "3.500 – 50.000 m³/h" */
  display: string;
};

/**
 * Ürün serisi — katalogdaki bir ürün ailesi.
 *
 * `models` yalnızca sunucu tarafında doldurulur (`seriDetay`); liste ve kart
 * bileşenleri modelsiz dizinle çalışır, böylece 454 modelin spec tablosu
 * istemci paketine girmez.
 */
export type Product = {
  slug: string;
  /** IRONAIR seri kodu — IRR-GB. */
  code: string;
  name: string;
  summary: string;
  categorySlug: string;
  image: string | null;
  gallery: string[];
  modelCount: number;
  ranges: SpecRange[];
  models?: ProductModel[];
};

export type Category = {
  slug: string;
  name: string;
  /** Dar alanlarda (filtre çipleri, rozetler) kullanılan kısa ad. */
  short: string;
  /** Kategori kartında ve listede görünen tek cümlelik tanım. */
  summary: string;
  /** Karanlık moddaki vurgu rengi. */
  accent: string;
  /** Aydınlık moddaki vurgu rengi — açık zeminde kontrastı taşır. */
  accentLight: string;
};
