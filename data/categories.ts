import type { Category } from "./types";

/**
 * Ürün grupları.
 *
 * Gruplar katalog verisinden gelir; her serinin kategorisi kaynakta
 * tanımlı, hücreli fanlar ise `katalog-normalize.py` içinde kanal fanlarından
 * ayrılıyor. Renkler marka kırmızısının ailesinden seçildi — marka kırmızısından
 * bordoya — böylece katalog tek tema içinde kalırken gruplar birbirinden
 * ayırt edilebiliyor. Turuncu tona hiç çıkılmıyor: ürün render'ları da
 * kırmızıya çevrildi, kartın arkasındaki ışık turuncu kalırsa görsel bütünlük
 * bozuluyor. `accent` karanlık, `accentLight` aydınlık modda kullanılır.
 */
export const categories: Category[] = [
  {
    slug: "radyal-fanlar",
    name: "Radyal Fanlar",
    short: "Radyal",
    summary:
      "Salyangoz gövdeli, havayı 90° çevirerek basınç üreten fanlar. Kanal direncinin yüksek olduğu tesisatlarda, toz taşımada ve sanayi egzozunda kullanılır.",
    accent: "#E4141B",
    accentLight: "#B00D13",
  },
  {
    slug: "kanal-fanlari",
    name: "Kanal Fanları",
    short: "Kanal",
    summary:
      "Doğrudan kanal hattının içine giren yuvarlak ve dikdörtgen fanlar. Isı geri kazanımı, sığınak havalandırması ve genel kanal egzozu bu grupta.",
    accent: "#FF3B30",
    accentLight: "#C21F16",
  },
  {
    slug: "hucreli-fanlar",
    name: "Hücreli Fanlar",
    short: "Hücreli",
    summary:
      "Alüminyum profil çerçeveli, yalıtımlı kabin içindeki radyal fanlar. Ticari mutfak egzozu ve kanal hattına bağlanan sessiz egzoz üniteleri bu grupta.",
    accent: "#F0283C",
    accentLight: "#B5142A",
  },
  {
    slug: "aksiyel-fanlar",
    name: "Aksiyel Fanlar",
    short: "Aksiyel",
    summary:
      "Havayı pervane ekseni boyunca iten fanlar. Yüksek debi ve düşük basınç gerektiren duvar, kanal ve otopark uygulamaları ile duman tahliyesi için.",
    accent: "#D6202E",
    accentLight: "#A3101E",
  },
  {
    slug: "cati-fanlari",
    name: "Çatı Fanları",
    short: "Çatı",
    summary:
      "Çatıya monte edilen, egzoz havasını dikey veya yatay atan radyal ve aksiyel fanlar. Üretim holü ve ticari mutfak egzozunun son halkası.",
    accent: "#B01030",
    accentLight: "#8C0A26",
  },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
