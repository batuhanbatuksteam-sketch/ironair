/** Panelin detay bölmesine geçirilen, katalogdan türetilmiş veri. */
export type DetayVerisi = {
  urun: {
    slug: string;
    kod: string;
    ad: string;
    ozet: string;
    gorsel: string | null;
    kategoriSlug: string;
    modelSayisi: number;
    aralik: { etiket: string; gosterim: string }[];
  } | null;
  model: {
    ad: string;
    gruplar: { id: string; ad: string; satirlar: { ad: string; deger: string }[] }[];
  } | null;
};
