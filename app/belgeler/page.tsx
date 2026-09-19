import type { Metadata } from "next";
import Link from "next/link";
import { belgeler } from "@/data/site";
import PageHeader from "../components/PageHeader";

export const metadata: Metadata = {
  title: "Belgeler ve standartlar",
  description:
    "IRONAIR ürünlerinin üretildiği standartlar: ATEX, CE, ISO 9001, EN 12101-3, EN 1886 ve ISO 1940 balans sınıfı.",
};

export default function CertificatesPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 pt-28 sm:px-10 lg:px-14">
      <PageHeader
        baslik="Belgeler ve standartlar"
        aciklama="Bir fanın hangi standarda göre üretildiği, patlayıcı ortamda güvenli olup olmadığını ve yangında ne kadar dayanacağını belirler."
      />

      <ul className="mt-16 grid gap-3 md:grid-cols-2">
        {belgeler.map((b) => (
          <li
            key={b.kod}
            className="flex flex-col rounded-[2px] border bg-surface p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="h3">{b.ad}</h2>
              <span
                className="tabular shrink-0 rounded-[2px] px-2.5 py-1 text-xs font-semibold"
                style={{ background: "var(--red-wash)", color: "var(--red-text)" }}
              >
                {b.kod}
              </span>
            </div>
            <p className="mt-4 text-sm text-ink-muted">{b.aciklama}</p>
            <p className="mt-5 border-t pt-4 text-sm">
              <span className="text-ink-faint">Kapsam: </span>
              {b.kapsam}
            </p>
          </li>
        ))}
      </ul>

      <section className="mt-24">
        <div className="gauge-rule" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 className="h2">Belge kopyası gerekiyorsa</h2>
            <p className="prose-measure mt-5 text-ink-muted">
              Proje dosyanız için sertifika kopyası, uygunluk beyanı veya test raporu
              isteyebilirsiniz. Ürün kodunu ve proje adını iletmeniz yeterli.
            </p>
            <Link href="/iletisim" className="btn btn-primary mt-8">
              Belge talep et
            </Link>
          </div>

          <div>
            <h2 className="h3 border-b pb-3">Sık karıştırılanlar</h2>
            <dl className="mt-1 text-sm">
              <div className="border-b py-4">
                <dt className="font-medium">ATEX ile exproof aynı şey mi?</dt>
                <dd className="mt-1.5 text-ink-muted">
                  Exproof ekipmanın özelliği, ATEX ise bunu belgeleyen yönetmeliktir.
                  Sertifikasız &quot;exproof&quot; ibaresi tek başına bir şey ifade etmez.
                </dd>
              </div>
              <div className="border-b py-4">
                <dt className="font-medium">F300 ne demek?</dt>
                <dd className="mt-1.5 text-ink-muted">
                  Fanın 300 °C dumanı 60 dakika boyunca tahliye edebildiğini gösterir.
                  F400 aynı süre için 400 °C anlamına gelir.
                </dd>
              </div>
              <div className="py-4">
                <dt className="font-medium">Balans sınıfı neden önemli?</dt>
                <dd className="mt-1.5 text-ink-muted">
                  Balanssız çark titrer; titreşim yatağı yer, ses seviyesini yükseltir ve
                  gövde kaynaklarını yorar. G6.3, endüstriyel fanlar için kabul edilen sınıftır.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
