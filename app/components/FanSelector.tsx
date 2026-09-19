"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

/**
 * Fan seçim aracı.
 *
 * Hacim × saatlik hava değişimi = gerekli debi. Kanal durumu basınç sınıfını,
 * ikisi birlikte önerilecek ürün grubunu belirler. Sonuç yaklaşıktır; bağlayıcı
 * seçim teklif aşamasında debi–basınç eğrisiyle yapılır.
 */

type Kullanim = {
  id: string;
  ad: string;
  /** Saatte kaç kez havanın tamamen değişmesi gerektiği. */
  degisim: number;
  not: string;
};

const KULLANIMLAR: Kullanim[] = [
  { id: "depo", ad: "Depo / ambar", degisim: 4, not: "Nem ve koku kontrolü" },
  { id: "ofis", ad: "Ofis", degisim: 6, not: "Kişi yoğunluğuna göre" },
  { id: "otopark", ad: "Kapalı otopark", degisim: 8, not: "CO tahliyesi" },
  { id: "uretim", ad: "Üretim holü", degisim: 10, not: "Makine ısısı" },
  { id: "restoran", ad: "Restoran salonu", degisim: 10, not: "Koku ve nem" },
  { id: "wc", ad: "Islak hacim / WC", degisim: 12, not: "Nem tahliyesi" },
  { id: "kazan", ad: "Kazan / jeneratör odası", degisim: 15, not: "Yanma havası" },
  { id: "kaynak", ad: "Kaynak atölyesi", degisim: 20, not: "Duman tahliyesi" },
  { id: "mutfak", ad: "Ticari mutfak", degisim: 25, not: "Yağ ve sıcaklık" },
  { id: "boyahane", ad: "Boyahane", degisim: 30, not: "Solvent buharı" },
];

type Kanal = {
  id: string;
  ad: string;
  basinc: [number, number];
  not: string;
  gruplar: string[];
};

const KANALLAR: Kanal[] = [
  {
    id: "yok",
    ad: "Kanal yok — duvara veya çatıya doğrudan",
    basinc: [50, 150],
    not: "Fan doğrudan dışarı atıyor",
    gruplar: ["aksiyel-fanlar", "cati-fanlari"],
  },
  {
    id: "kisa",
    ad: "Kısa kanal — 10 m'ye kadar, birkaç dirsek",
    basinc: [150, 400],
    not: "Menfez ve panjur dahil",
    gruplar: ["aksiyel-fanlar", "kanal-fanlari"],
  },
  {
    id: "orta",
    ad: "Orta kanal — 10 – 30 m, menfezli",
    basinc: [400, 900],
    not: "Aksiyel bu dirençte debisini kaybeder",
    gruplar: ["kanal-fanlari", "radyal-fanlar"],
  },
  {
    id: "uzun",
    ad: "Uzun kanal + filtre",
    basinc: [900, 2000],
    not: "Filtre direnci zamanla artar",
    gruplar: ["radyal-fanlar", "kanal-fanlari"],
  },
  {
    id: "tasima",
    ad: "Toz toplama / malzeme taşıma",
    basinc: [2000, 8000],
    not: "Aşınmaya dayanıklı çark gerekir",
    gruplar: ["radyal-fanlar"],
  },
];

const ORTAMLAR = [
  { id: "normal", ad: "Normal", carpan: 1, gruplar: [] as string[] },
  { id: "nemli", ad: "Nemli veya korozif", carpan: 1, gruplar: [] as string[] },
  { id: "patlayici", ad: "Patlayıcı gaz / toz (ATEX)", carpan: 1, gruplar: [] },
  { id: "sicak", ad: "Sıcak gaz (+120 °C üstü)", carpan: 1.15, gruplar: ["radyal-fanlar"] },
];

const bicim = (n: number) => Math.round(n).toLocaleString("tr-TR");

export default function FanSelector() {
  const [en, setEn] = useState("20");
  const [boy, setBoy] = useState("30");
  const [yukseklik, setYukseklik] = useState("6");
  const [kullanimId, setKullanimId] = useState("uretim");
  const [kanalId, setKanalId] = useState("orta");
  const [ortamId, setOrtamId] = useState("normal");

  const sonuc = useMemo(() => {
    const e = parseFloat(en.replace(",", ".")) || 0;
    const b = parseFloat(boy.replace(",", ".")) || 0;
    const y = parseFloat(yukseklik.replace(",", ".")) || 0;
    const hacim = e * b * y;

    const kullanim = KULLANIMLAR.find((k) => k.id === kullanimId)!;
    const kanal = KANALLAR.find((k) => k.id === kanalId)!;
    const ortam = ORTAMLAR.find((o) => o.id === ortamId)!;

    const debi = hacim * kullanim.degisim * ortam.carpan;
    // Kanal ve menfez kirlendikçe direnç artar; seçim üst sınıra göre yapılır.
    const emniyetli = debi * 1.15;

    const slugs = [...new Set([...ortam.gruplar, ...kanal.gruplar])];
    const gruplar = slugs
      .map((s) => categories.find((c) => c.slug === s))
      .filter((c): c is NonNullable<typeof c> => !!c);

    /* Katalogdaki seriler arasından hesaplanan debiyi ve kanalın basınç
       sınıfını gerçekten karşılayanlar. Seri aralığı modellerin min–max'ı
       olduğu için "bu seride uygun bir boy var" demek. */
    const uyan = hacim
      ? products
          .filter((p) => slugs.includes(p.categorySlug))
          .map((p) => {
            const d = p.ranges.find((r) => r.field === "debi");
            const b = p.ranges.find((r) => r.field === "basinc");
            if (!d || !b) return null;
            const debiTutar = emniyetli <= d.max;
            const basincTutar = b.max >= kanal.basinc[0];
            if (!debiTutar || !basincTutar) return null;
            // Gereken debiye en yakın tavanı olan seri başa gelsin.
            return { urun: p, fark: d.max - emniyetli };
          })
          .filter((x): x is { urun: (typeof products)[number]; fark: number } => !!x)
          .sort((a, b) => a.fark - b.fark)
          .slice(0, 4)
          .map((x) => x.urun)
      : [];

    return { hacim, debi, emniyetli, kullanim, kanal, ortam, gruplar, uyan };
  }, [en, boy, yukseklik, kullanimId, kanalId, ortamId]);

  const gecerli = sonuc.hacim > 0;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
      <div>
        <fieldset>
          <legend className="h3 mb-1">Ortamın ölçüleri</legend>
          <p className="mb-4 text-sm text-ink-muted">Metre cinsinden yazın.</p>
          <div className="grid grid-cols-3 gap-3">
            <Sayi id="en" etiket="En" birim="m" value={en} onChange={setEn} />
            <Sayi id="boy" etiket="Boy" birim="m" value={boy} onChange={setBoy} />
            <Sayi id="yuk" etiket="Yükseklik" birim="m" value={yukseklik} onChange={setYukseklik} />
          </div>
          <p className="tabular mt-3 text-sm text-ink-faint">
            Hacim: {gecerli ? `${bicim(sonuc.hacim)} m³` : "—"}
          </p>
        </fieldset>

        <fieldset className="mt-10">
          <legend className="h3 mb-1">Ortam ne iş görüyor?</legend>
          <p className="mb-4 text-sm text-ink-muted">
            Saatte kaç kez havanın değişmesi gerektiğini bu belirler.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {KULLANIMLAR.map((k) => (
              <Secim
                key={k.id}
                name="kullanim"
                checked={kullanimId === k.id}
                onChange={() => setKullanimId(k.id)}
                baslik={k.ad}
                alt={`${k.degisim} değişim/saat · ${k.not}`}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-10">
          <legend className="h3 mb-1">Kanal durumu</legend>
          <p className="mb-4 text-sm text-ink-muted">
            Fanın yenmesi gereken direnci belirler.
          </p>
          <div className="grid gap-2">
            {KANALLAR.map((k) => (
              <Secim
                key={k.id}
                name="kanal"
                checked={kanalId === k.id}
                onChange={() => setKanalId(k.id)}
                baslik={k.ad}
                alt={`${k.basinc[0]} – ${k.basinc[1]} Pa · ${k.not}`}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-10">
          <legend className="h3 mb-1">Ortam koşulu</legend>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {ORTAMLAR.map((o) => (
              <Secim
                key={o.id}
                name="ortam"
                checked={ortamId === o.id}
                onChange={() => setOrtamId(o.id)}
                baslik={o.ad}
              />
            ))}
          </div>
        </fieldset>
      </div>

      {/* Sonuç — masaüstünde yapışkan, girdi değiştikçe anında güncellenir */}
      <aside className="lg:sticky lg:top-24">
        <div className="rounded-[2px] border bg-surface p-6 sm:p-8">
          <h2 className="h3">Hesaplanan ihtiyaç</h2>

          <dl className="mt-6 space-y-5" aria-live="polite">
            <div>
              <dt className="text-sm text-ink-muted">Gerekli debi</dt>
              <dd className="tabular mt-1 text-[2.4rem] font-bold leading-none tracking-tight">
                {gecerli ? bicim(sonuc.emniyetli) : "—"}
                <span className="ml-2 text-base font-medium text-ink-faint">m³/h</span>
              </dd>
              <dd className="mt-2 text-xs text-ink-faint">
                {gecerli
                  ? `${bicim(sonuc.hacim)} m³ × ${sonuc.kullanim.degisim} değişim + %15 emniyet payı`
                  : "Ölçüleri girin"}
              </dd>
            </div>

            <div className="border-t pt-5">
              <dt className="text-sm text-ink-muted">Gereken basınç aralığı</dt>
              <dd className="tabular mt-1 text-[1.6rem] font-bold leading-none tracking-tight">
                {sonuc.kanal.basinc[0]} – {sonuc.kanal.basinc[1]}
                <span className="ml-2 text-base font-medium text-ink-faint">Pa</span>
              </dd>
              <dd className="mt-2 text-xs text-ink-faint">{sonuc.kanal.not}</dd>
            </div>
          </dl>

          <div className="mt-7 border-t pt-6">
            <h3 className="text-sm font-semibold">
              {sonuc.uyan.length > 0 ? "Bu değerleri karşılayan seriler" : "Bu ihtiyaca uyan gruplar"}
            </h3>
            <ul className="mt-3 space-y-2">
              {sonuc.uyan.length > 0
                ? sonuc.uyan.map((p) => {
                    const c = categories.find((x) => x.slug === p.categorySlug);
                    const d = p.ranges.find((r) => r.field === "debi");
                    return (
                      <li key={p.slug}>
                        <Link
                          href={`/urunler/${p.categorySlug}/${p.slug}`}
                          className="oneri-satir flex items-center justify-between gap-3 rounded-[2px] border px-3.5 py-2.5 text-sm"
                          style={
                            {
                              "--acc": c?.accent,
                              "--acc-light": c?.accentLight,
                            } as React.CSSProperties
                          }
                        >
                          <span className="min-w-0">
                            <span className="font-medium">{p.name}</span>
                            <span className="tabular mt-0.5 block text-xs text-ink-faint">
                              {p.code} · {d?.display}
                            </span>
                          </span>
                          <span className="oneri-nokta h-2 w-2 shrink-0 rounded-full" />
                        </Link>
                      </li>
                    );
                  })
                : sonuc.gruplar.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/urunler/${c.slug}`}
                        className="oneri-satir flex items-center justify-between gap-3 rounded-[2px] border px-3.5 py-2.5 text-sm font-medium"
                        style={
                          { "--acc": c.accent, "--acc-light": c.accentLight } as React.CSSProperties
                        }
                      >
                        <span>{c.name}</span>
                        <span className="oneri-nokta h-2 w-2 shrink-0 rounded-full" />
                      </Link>
                    </li>
                  ))}
            </ul>
            {sonuc.ortam.id === "patlayici" && (
              <p className="mt-3 text-xs text-ink-faint">
                ATEX sertifikalı versiyonlar proje bazında üretilir — teklif notuna
                bölge sınıfını (Zone 1/2/21/22) yazın.
              </p>
            )}
          </div>

          <Link href="/teklif" className="btn btn-primary mt-7 w-full">
            Bu değerlerle teklif iste
          </Link>
          <p className="mt-3 text-xs text-ink-faint">
            Sonuç yaklaşıktır. Bağlayıcı seçim, debi–basınç eğrisi üzerinden yapılır.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Sayi({
  id,
  etiket,
  birim,
  value,
  onChange,
}: {
  id: string;
  etiket: string;
  birim: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {etiket}
        <span className="tabular ml-1.5 text-xs text-ink-faint">{birim}</span>
      </label>
      <input
        id={id}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="tabular w-full rounded-[2px] border bg-void px-3.5 py-2.5 text-[0.95rem] outline-none focus:border-red"
      />
    </div>
  );
}

function Secim({
  name,
  checked,
  onChange,
  baslik,
  alt,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  baslik: string;
  alt?: string;
}) {
  return (
    <label
      className="flex cursor-pointer items-start gap-3 rounded-[2px] border px-3.5 py-3 transition-colors"
      style={{
        borderColor: checked ? "var(--red)" : "var(--line)",
        background: checked ? "var(--red-wash)" : "transparent",
      }}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className="mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded-full border"
        style={{ borderColor: checked ? "var(--red)" : "var(--line-strong)" }}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-red" />}
      </span>
      <span className="min-w-0">
        <span
          className="block text-[0.92rem] font-medium leading-snug"
          style={{ color: checked ? "var(--red-text)" : "var(--ink)" }}
        >
          {baslik}
        </span>
        {alt && <span className="mt-0.5 block text-xs text-ink-faint">{alt}</span>}
      </span>
    </label>
  );
}
