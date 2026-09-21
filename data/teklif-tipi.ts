/**
 * Teklif talebi kaydı.
 *
 * Form gönderildiğinde e-posta *ve* bu kayıt oluşur. E-posta bildirimdir;
 * asıl kaynak bu kayıttır — panel bunun üstünde çalışır. Ürünün fotoğrafı ve
 * modelin teknik tablosu burada tutulmaz, katalogdan `urunSlug`/`modelSlug`
 * ile okunur; böylece katalog güncellenince eski talepler de güncel veriyi
 * gösterir.
 */

export const DURUMLAR = ["yeni", "okundu", "yanitlandi", "kazanildi", "kaybedildi"] as const;
export type Durum = (typeof DURUMLAR)[number];

export const DURUM_ETIKET: Record<Durum, string> = {
  yeni: "Yeni",
  okundu: "Okundu",
  yanitlandi: "Yanıtlandı",
  kazanildi: "Kazanıldı",
  kaybedildi: "Kaybedildi",
};

/** Durum rengi — panelde nokta, rozet ve kenar çizgisi bunu kullanır. */
export const DURUM_RENK: Record<Durum, string> = {
  yeni: "var(--red)",
  okundu: "var(--ink-faint)",
  yanitlandi: "#2563eb",
  kazanildi: "#15803d",
  kaybedildi: "var(--line-strong)",
};

export type Secim = { group: string; value: string };

export type Not = {
  zaman: string;
  metin: string;
};

/** Panelden gönderilmiş yanıt — yazışmanın kaydı burada tutulur. */
export type Yanit = {
  zaman: string;
  konu: string;
  metin: string;
};

export type Teklif = {
  /** Zaman damgalı, sözlük sırasına göre sıralanabilir kimlik. */
  id: string;
  olusturuldu: string;
  durum: Durum;

  musteri: {
    ad: string;
    firma?: string;
    telefon: string;
    eposta: string;
    not?: string;
  };

  /** Katalog anahtarları — detay bunlardan türetilir. */
  urunSlug?: string;
  urunKodu?: string;
  urunAdi?: string;
  modelAdi?: string;

  /** Formda işaretlenen değerler (model, debi, basınç, adet…). */
  secimler: Secim[];

  /** Ekip içi notlar — müşteri görmez. */
  notlar: Not[];

  /** Panelden müşteriye gönderilen yanıtlar. */
  yanitlar?: Yanit[];

  /** Bildirim e-postası gitti mi. */
  epostaGonderildi: boolean;
};
