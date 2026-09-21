import Image from "next/image";
import Link from "next/link";
import type { Teklif } from "@/data/teklif-tipi";
import { COMPANY } from "@/data/company";
import DurumSecici from "./DurumSecici";
import NotFormu from "./NotFormu";
import { tamZaman, gecenSure } from "./zaman";
import type { DetayVerisi } from "./tipler";

/** wa.me yalnız rakam kabul eder. */
const sadeNumara = (v: string) => v.replace(/\D/g, "");

function yanitTaslagi(teklif: Teklif, detay: DetayVerisi) {
  const urun = detay.urun?.ad ?? teklif.urunAdi ?? "ürün";
  const model = teklif.modelAdi ? ` (${teklif.modelAdi})` : "";
  return [
    `Merhaba ${teklif.musteri.ad},`,
    "",
    `${urun}${model} için talebinizi aldık.`,
    "",
    "Fiyat: ",
    "Teslim süresi: ",
    "",
    "İyi çalışmalar,",
    COMPANY.name,
    COMPANY.phone,
  ].join("\n");
}

export default function TeklifDetay({
  teklif,
  detay,
}: {
  teklif: Teklif;
  detay: DetayVerisi;
}) {
  const { musteri } = teklif;
  const konu = `IRONAIR Teklif — ${detay.urun?.ad ?? teklif.urunAdi ?? "ürün"}${
    teklif.modelAdi ? ` (${teklif.modelAdi})` : ""
  }`;
  const govde = yanitTaslagi(teklif, detay);
  /* Gmail'in yazma ekranı. `mailto:` yalnız masaüstünde tanımlı bir mail
     uygulaması varsa çalışıyor; şirket Workspace kullandığı için asıl mail
     istemcisi tarayıcıdaki Gmail — bağlantı doğrudan oraya gidiyor. */
  const gmail =
    "https://mail.google.com/mail/?view=cm&fs=1" +
    `&to=${encodeURIComponent(musteri.eposta)}` +
    `&su=${encodeURIComponent(konu)}` +
    `&body=${encodeURIComponent(govde)}`;
  const mailto = `mailto:${musteri.eposta}?subject=${encodeURIComponent(
    konu
  )}&body=${encodeURIComponent(govde)}`;
  const whatsapp = `https://wa.me/${sadeNumara(musteri.telefon)}?text=${encodeURIComponent(govde)}`;

  return (
    <article className="mx-auto max-w-[900px] px-6 py-7 sm:px-8">
      {/* Künye */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="h3">{musteri.ad}</h2>
          {musteri.firma && <p className="mt-0.5 text-sm text-ink-muted">{musteri.firma}</p>}
          <p className="tabular mt-1 text-xs text-ink-faint">
            {tamZaman(teklif.olusturuldu)} · {gecenSure(teklif.olusturuldu)}
            {!teklif.epostaGonderildi && (
              <span className="ml-2 text-red-text">· e-posta gönderilemedi</span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <DurumSecici id={teklif.id} durum={teklif.durum} />
      </div>

      {/* Tek dokunuşla iletişim — panelin asıl işi bu */}
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <a href={`tel:${sadeNumara(musteri.telefon)}`} className="btn btn-primary justify-center">
          Ara
        </a>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-[2px] border px-4 py-2.5 text-sm font-medium transition-colors hover:border-red-line hover:text-red-text"
        >
          WhatsApp
        </a>
        <a
          href={gmail}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-[2px] border px-4 py-2.5 text-sm font-medium transition-colors hover:border-red-line hover:text-red-text"
        >
          Gmail'de yanıtla
        </a>
      </div>

      {/* Masaüstünde tanımlı bir mail uygulaması olanlar için yedek yol */}
      <p className="mt-2 text-right text-xs text-ink-faint">
        <a href={mailto} className="underline-offset-4 hover:text-red-text hover:underline">
          varsayılan mail uygulamasında aç
        </a>
      </p>

      <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        <div className="flex items-baseline justify-between gap-3 border-b py-2">
          <dt className="text-ink-faint">Telefon</dt>
          <dd className="tabular font-medium">{musteri.telefon}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 border-b py-2">
          <dt className="text-ink-faint">E-posta</dt>
          <dd className="min-w-0 truncate font-medium">{musteri.eposta}</dd>
        </div>
      </dl>

      {musteri.not && (
        <blockquote className="mt-5 border-l-2 border-red-line bg-red-wash px-4 py-3 text-sm">
          <p className="text-xs font-semibold text-red-text">Müşterinin notu</p>
          <p className="mt-1.5 whitespace-pre-line text-ink">{musteri.not}</p>
        </blockquote>
      )}

      {/* Ürün — fotoğraf ve seri künyesi */}
      {detay.urun && (
        <section className="mt-8">
          <h3 className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
            Talep edilen ürün
          </h3>
          <div className="mt-3 flex gap-4 rounded-[2px] border p-3">
            {detay.urun.gorsel && (
              <div className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-[2px] bg-sunk sm:w-44">
                <Image
                  src={detay.urun.gorsel}
                  alt={detay.urun.ad}
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="font-semibold">{detay.urun.ad}</h4>
                <span className="tabular shrink-0 text-xs text-ink-faint">{detay.urun.kod}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{detay.urun.ozet}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {detay.urun.aralik.slice(0, 3).map((a) => (
                  <span
                    key={a.etiket}
                    className="tabular rounded-[2px] border px-1.5 py-0.5 text-[0.7rem] text-ink-faint"
                  >
                    {a.gosterim}
                  </span>
                ))}
              </div>
              <Link
                href={`/urunler/${detay.urun.kategoriSlug}/${detay.urun.slug}`}
                target="_blank"
                className="mt-2 inline-block text-xs text-ink-muted underline-offset-4 hover:text-red-text hover:underline"
              >
                Ürün sayfasını aç
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Formda işaretlenenler */}
      {teklif.secimler.length > 0 && (
        <section className="mt-6">
          <h3 className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
            Formda seçilenler
          </h3>
          <dl className="mt-2">
            {teklif.secimler.map((s) => (
              <div
                key={s.group + s.value}
                className="flex items-baseline justify-between gap-4 border-b py-2 text-sm"
              >
                <dt className="text-ink-muted">{s.group}</dt>
                <dd className="tabular font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Seçilen modelin tam tablosu — fiyat verirken lazım olan her şey */}
      {detay.model && (
        <section className="mt-8">
          <h3 className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
            {detay.model.ad} — teknik tablo
          </h3>
          <div className="mt-3 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {detay.model.gruplar.map((g) => (
              <div key={g.id} className="min-w-0">
                <h4 className="text-[0.7rem] font-semibold tracking-wide text-ink-faint uppercase">
                  {g.ad}
                </h4>
                <dl className="mt-1">
                  {g.satirlar.map((r) => (
                    <div
                      key={r.ad}
                      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b py-1.5 text-[0.82rem]"
                    >
                      <dt className="text-ink-muted">{r.ad}</dt>
                      <dd className="tabular font-medium">{r.deger}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ekip içi notlar */}
      <section className="mt-8 border-t pt-6">
        <h3 className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
          Ekip notları
        </h3>
        {teklif.notlar.length > 0 && (
          <ul className="mt-3 space-y-2">
            {teklif.notlar.map((n) => (
              <li key={n.zaman} className="rounded-[2px] border bg-surface px-3 py-2">
                <p className="tabular text-[0.7rem] text-ink-faint">{tamZaman(n.zaman)}</p>
                <p className="mt-1 whitespace-pre-line text-sm">{n.metin}</p>
              </li>
            ))}
          </ul>
        )}
        <NotFormu id={teklif.id} />
      </section>
    </article>
  );
}
