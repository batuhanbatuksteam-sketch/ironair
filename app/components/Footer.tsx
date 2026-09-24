import Link from "next/link";
import { categories } from "@/data/categories";
import { COMPANY } from "@/data/company";
import Wordmark from "./Wordmark";

export default function Footer() {
  return (
    <footer className="border-t bg-surface">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-16 sm:px-10 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <Wordmark />
            <p className="prose-measure mt-5 text-sm text-ink-muted">
              Endüstriyel fan ve havalandırma sistemleri üretimi. Aksiyel, radyal,
              çatı, kanal tipi ve hücreli fan grupları.
            </p>
            <dl className="mt-7 space-y-2 text-sm">
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 text-ink-faint">Telefon</dt>
                <dd>
                  <a href={`tel:${COMPANY.phoneRaw}`} className="tabular hover:text-red-text">
                    {COMPANY.phone}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 text-ink-faint">Sabit hat</dt>
                <dd>
                  <a href={`tel:${COMPANY.landlineRaw}`} className="tabular hover:text-red-text">
                    {COMPANY.landline}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 text-ink-faint">E-posta</dt>
                <dd>
                  <a href={`mailto:${COMPANY.email}`} className="hover:text-red-text">
                    {COMPANY.email}
                  </a>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0 text-ink-faint">Adres</dt>
                <dd className="text-ink-muted">{COMPANY.address}</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="h3 mb-4">Ürün grupları</h2>
              <ul className="space-y-2 text-sm">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/urunler/${c.slug}`} className="text-ink-muted hover:text-red-text">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="h3 mb-4">Kurumsal</h2>
              <ul className="space-y-2 text-sm">
                {[
                  { href: "/hakkimizda", metin: "Hakkımızda" },
                  { href: "/uygulama-alanlari", metin: "Uygulama alanları" },
                  { href: "/fan-secimi", metin: "Fan seçim aracı" },
                  { href: "/referanslar", metin: "Referanslar" },
                  { href: "/belgeler", metin: "Belgeler ve standartlar" },
                  { href: "/sss", metin: "Sık sorulanlar" },
                  { href: "/teklif", metin: "Teklif iste" },
                  { href: "/iletisim", metin: "İletişim" },
                ].map((m) => (
                  <li key={m.href}>
                    <Link href={m.href} className="text-ink-muted hover:text-red-text">
                      {m.metin}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="gauge-rule mt-14" />
        <p className="mt-6 text-xs text-ink-faint">
          © {new Date().getFullYear()} IRONAIR. Teknik değerler haber verilmeksizin
          değiştirilebilir; bağlayıcı değerler için teklif formunu kullanın.
        </p>
      </div>
    </footer>
  );
}
