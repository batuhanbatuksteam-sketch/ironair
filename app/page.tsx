import Link from "next/link";
import Image from "next/image";
import ScrollHero from "./components/ScrollHero";
import CategoryIndex from "./components/CategoryIndex";
import { modelCount, products, productsByCategory } from "@/data/products";
import { categories, categoryBySlug } from "@/data/categories";
import { nedenler, referanslar, sss, surec, uygulamalar } from "@/data/site";

export default function Home() {
  return (
    <>
      <ScrollHero productCount={products.length} />

      {/* ── Katalog ─────────────────────────────────────────────────────── */}
      <section id="katalog" className="bg-void">
        <div className="mx-auto w-full max-w-[1400px] px-6 pt-20 sm:px-10 lg:px-14">
          <div className="gauge-rule" data-accent="true" />
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end">
            <h2 className="h1">Hangi fanı arıyorsunuz?</h2>
            <p className="prose-measure text-ink-muted">
              Ürünler çalışma prensibine ve montaj şekline göre {categories.length} grupta
              toplanmıştır. Grubu seçin, ölçü ve devir kademelerini işaretleyin, teklifi
              seçtiğiniz haliyle gönderin.
            </p>
          </div>
        </div>

        <CategoryIndex />

        <div className="mx-auto mt-10 w-full max-w-[1400px] px-6 sm:px-10 lg:px-14">
          <Link href="/urunler" className="btn btn-ghost">
            {products.length} serinin tamamını gör
          </Link>
        </div>
      </section>

      {/* ── Neden IRONAIR ───────────────────────────────────────────────── */}
      <section className="mt-24 bg-surface">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-14">
          <div className="gauge-rule" data-accent="true" />
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end">
            <h2 className="h1">Neden IRONAIR</h2>
            <p className="prose-measure text-ink-muted">
              Bir fanın doğru seçilmesi tesisin enerji faturasını ve çalışanın soluduğu
              havayı doğrudan etkiler.
            </p>
          </div>

          <ul className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {nedenler.map((n) => (
              <li key={n.baslik} className="border-t pt-6">
                <h3 className="h3">{n.baslik}</h3>
                <p className="mt-3 text-sm text-ink-muted">{n.metin}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            <Figure value={String(modelCount)} unit="katalog modeli" />
            <Figure value="80.000" unit="m³/h debi" />
            <Figure value="8.000" unit="Pa basınç" />
            <Figure value="ATEX" unit="sertifikalı" />
            <Figure value="+200" unit="°C çalışma" />
            <Figure value="%85" unit="ısı geri kazanımı" />
          </dl>
        </div>
      </section>

      {/* ── Uygulama alanları ───────────────────────────────────────────── */}
      <section className="bg-void">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-14">
          <div className="gauge-rule" data-accent="true" />
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end">
            <h2 className="h1">Nerede kullanılıyor</h2>
            <p className="prose-measure text-ink-muted">
              Aynı fan her yere uymaz. Ortamın ne ürettiği ve havanın ne taşıdığı seçimi
              baştan değiştirir.
            </p>
          </div>

          <ul className="mt-14 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {uygulamalar.slice(0, 4).map((u) => {
              const grup = categoryBySlug(u.gruplar[0]);
              const gorsel = grup ? productsByCategory(grup.slug)[0] : undefined;
              return (
                <li key={u.slug}>
                  <Link
                    href={`/uygulama-alanlari/${u.slug}`}
                    className="grup-kart group relative flex h-full flex-col justify-between overflow-hidden rounded-[2px] border p-6"
                    style={
                      {
                        "--acc": grup?.accent ?? "#E4141B",
                        "--acc-light": grup?.accentLight ?? "#B00D13",
                      } as React.CSSProperties
                    }
                  >
                    <span aria-hidden="true" className="grup-isik" />
                    <span className="relative">
                      <span className="grup-ad block text-[1.1rem] font-bold leading-tight tracking-tight">
                        {u.ad}
                      </span>
                      <span className="mt-3 block text-sm text-ink-muted">{u.ozet}</span>
                    </span>
                    {gorsel && (
                      <span className="relative mt-6 block h-20 w-full">
                        <Image
                          src={gorsel.image ?? ""}
                          alt=""
                          fill
                          sizes="220px"
                          className="object-contain object-right transition-transform duration-500 group-hover:scale-[1.08]"
                        />
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link href="/uygulama-alanlari" className="btn btn-ghost mt-10">
            Tüm uygulama alanları
          </Link>
        </div>
      </section>

      {/* ── Fan seçim aracı ─────────────────────────────────────────────── */}
      <section className="bg-surface">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-14">
          <div className="gauge-rule" data-accent="true" />
          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2 className="h1">Ölçüyü bilmiyorsanız hesaplayalım</h2>
              <p className="prose-measure mt-6 text-ink-muted">
                Ortamın en, boy ve yüksekliğini girin, ne iş gördüğünü seçin. Gerekli
                debiyi ve basınç sınıfını hesaplayıp uygun ürün grubunu önerelim.
              </p>
              <Link href="/fan-secimi" className="btn btn-primary mt-8">
                Fan seçim aracını aç
              </Link>
            </div>

            <div className="rounded-[2px] border bg-void p-6 sm:p-8">
              <p className="text-sm text-ink-muted">Örnek: 20 × 30 × 6 m üretim holü</p>
              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="text-sm text-ink-muted">Hacim</dt>
                  <dd className="tabular mt-1 text-[1.5rem] font-bold leading-none">
                    3.600 <span className="text-base font-medium text-ink-faint">m³</span>
                  </dd>
                </div>
                <div className="border-t pt-5">
                  <dt className="text-sm text-ink-muted">Gerekli debi</dt>
                  <dd className="tabular mt-1 text-[2.2rem] font-bold leading-none text-red-text">
                    41.400 <span className="text-base font-medium text-ink-faint">m³/h</span>
                  </dd>
                  <dd className="mt-2 text-xs text-ink-faint">
                    10 hava değişimi + %15 emniyet payı
                  </dd>
                </div>
                <div className="border-t pt-5">
                  <dt className="text-sm text-ink-muted">Basınç sınıfı</dt>
                  <dd className="tabular mt-1 text-[1.5rem] font-bold leading-none">
                    400 – 900 <span className="text-base font-medium text-ink-faint">Pa</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ── Süreç ───────────────────────────────────────────────────────── */}
      <section className="bg-void">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-14">
          <div className="gauge-rule" data-accent="true" />
          <h2 className="h1 mt-10">Nasıl çalışıyoruz</h2>

          <ol className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {surec.map((s, i) => (
              <li key={s.baslik} className="border-t pt-6">
                <span className="tabular block text-sm text-red-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="h3 mt-3">{s.baslik}</h3>
                <p className="mt-3 text-sm text-ink-muted">{s.metin}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Referanslar ─────────────────────────────────────────────────── */}
      <section className="bg-surface">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-14">
          <div className="gauge-rule" data-accent="true" />
          <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
            <h2 className="h1">Son projeler</h2>
            <Link href="/referanslar" className="btn btn-ghost">
              Tüm referanslar
            </Link>
          </div>

          <ul className="mt-12">
            {referanslar.slice(0, 5).map((r) => (
              <li
                key={r.ad}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 border-b py-5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto_auto]"
              >
                <span className="font-medium">{r.ad}</span>
                <span className="text-sm text-ink-muted sm:order-none">{r.is}</span>
                <span className="tabular text-right text-sm">{r.olcu}</span>
                <span className="tabular hidden text-right text-sm text-ink-faint sm:block">
                  {r.yil}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Sık sorulanlar ──────────────────────────────────────────────── */}
      <section className="bg-void">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-14">
          <div className="gauge-rule" data-accent="true" />
          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-20">
            <div>
              <h2 className="h1">Sık sorulanlar</h2>
              <Link href="/sss" className="btn btn-ghost mt-8">
                Hepsini gör
              </Link>
            </div>

            <div>
              {sss.slice(0, 4).map((s, i) => (
                <details key={s.soru} className="sss-ogesi border-b" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-start gap-4 py-5">
                    <span className="h3 min-w-0 grow">{s.soru}</span>
                    <span
                      aria-hidden="true"
                      className="sss-isaret mt-1 grid h-6 w-6 shrink-0 place-items-center"
                    >
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="prose-measure pb-6 text-ink-muted">{s.cevap}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Teklif ──────────────────────────────────────────────────────── */}
      <section id="iletisim" className="bg-surface">
        <div className="mx-auto w-full max-w-[1400px] px-6 py-24 sm:px-10 lg:px-14">
          <div className="gauge-rule" data-accent="true" />
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className="h1">Projenizi anlatın, ölçelim</h2>
              <p className="prose-measure mt-5 text-ink-muted">
                Debi ve basınç değerlerini bilmiyorsanız da sorun değil — hacim, kullanım
                amacı ve kanal uzunluğunu yazın, doğru seriyi biz seçelim.
              </p>
            </div>
            <Link href="/teklif" className="btn btn-primary lg:!min-h-[54px] lg:!px-8">
              Teklif iste
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Figure({ value, unit }: { value: string; unit: string }) {
  return (
    <div>
      <dt className="sr-only">{unit}</dt>
      <dd>
        <span className="tabular block text-[1.9rem] font-bold leading-none tracking-tight">
          {value}
        </span>
        <span className="mt-2 block text-sm text-ink-muted">{unit}</span>
      </dd>
    </div>
  );
}
