import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY } from "@/data/company";

export const metadata: Metadata = {
  title: "İletişim",
  description: "IRONAIR iletişim bilgileri — telefon, e-posta ve WhatsApp.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 pt-28 sm:px-10 lg:px-14">
      <div className="gauge-rule" data-accent="true" />
      <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <h1 className="h1">İletişim</h1>
          <p className="prose-measure mt-6 text-ink-muted">
            Teknik sorularınız için doğrudan arayabilir, teklif için formu
            kullanabilirsiniz. Mesai saatleri içinde telefon en hızlı yol.
          </p>
          <Link href="/teklif" className="btn btn-primary mt-8">
            Teklif iste
          </Link>
        </div>

        <dl className="text-[1.05rem]">
          <div className="border-t py-5">
            <dt className="text-sm text-ink-faint">Telefon</dt>
            <dd className="mt-1">
              <a href={`tel:${COMPANY.phoneRaw}`} className="tabular font-medium hover:text-red-text">
                {COMPANY.phone}
              </a>
            </dd>
          </div>
          <div className="border-t py-5">
            <dt className="text-sm text-ink-faint">Sabit hat</dt>
            <dd className="mt-1">
              <a href={`tel:${COMPANY.landlineRaw}`} className="tabular font-medium hover:text-red-text">
                {COMPANY.landline}
              </a>
            </dd>
          </div>
          <div className="border-t py-5">
            <dt className="text-sm text-ink-faint">WhatsApp</dt>
            <dd className="mt-1">
              <a
                href={`https://wa.me/${COMPANY.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-red-text"
              >
                Mesaj gönder
              </a>
            </dd>
          </div>
          <div className="border-t py-5">
            <dt className="text-sm text-ink-faint">E-posta</dt>
            <dd className="mt-1">
              <a href={`mailto:${COMPANY.email}`} className="font-medium hover:text-red-text">
                {COMPANY.email}
              </a>
            </dd>
          </div>
          <div className="border-y py-5">
            <dt className="text-sm text-ink-faint">Adres</dt>
            <dd className="mt-1 font-medium">{COMPANY.address}</dd>
            <dd className="mt-2">
              <a
                href={COMPANY.haritaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink-muted underline-offset-4 hover:text-red-text hover:underline"
              >
                Haritada aç
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
