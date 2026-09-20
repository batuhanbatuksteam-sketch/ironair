import type { Metadata } from "next";
import Link from "next/link";
import FanSelector from "../../components/FanSelector";
import PageHeader from "../../components/PageHeader";

export const metadata: Metadata = {
  title: "Fan seçim aracı",
  description:
    "Ortamın hacmini ve kullanım amacını girin, gerekli debiyi ve basınç sınıfını hesaplayalım; uygun fan grubunu önerelim.",
};

export default function FanSelectionPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 pt-28 sm:px-10 lg:px-14">
      <PageHeader
        baslik="Fan seçim aracı"
        aciklama="Debi ve basınç değerlerini bilmeden de doğru gruba ulaşabilirsiniz. Ortamın ölçüsünü ve ne iş gördüğünü girin — gerisini hesaplayalım."
      />

      <div className="mt-16">
        <FanSelector />
      </div>

      <section className="mt-28">
        <div className="gauge-rule" />
        <h2 className="h2 mt-10">Hesap nasıl yapılıyor</h2>
        <div className="prose-measure mt-6 space-y-4 text-ink-muted">
          <p>
            Bir ortamın havasının saatte kaç kez tamamen değişmesi gerektiği, orada ne
            yapıldığına bağlıdır. Depoda dört değişim yeterken boyahanede otuza çıkar.
            Hacmi bu sayıyla çarpınca fanın taşıması gereken debi çıkar.
          </p>
          <p>
            Basınç ise havanın önündeki dirençtir. Fan doğrudan duvara takılıysa direnç
            düşüktür; uzun kanal, dirsek, menfez ve filtre eklendikçe artar. Aynı debiyi
            yüksek dirençte vermek için farklı bir fan tipi gerekir — aksiyel bu noktada
            debisini kaybeder, radyal kaybetmez.
          </p>
          <p>
            Sonuca %15 emniyet payı eklenir. Filtre kirlendikçe ve kanal yağlandıkça
            direnç artar; pay bu kaybı karşılar.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/urunler" className="btn btn-ghost">
            Ürün kataloğu
          </Link>
          <Link href="/sss" className="btn btn-ghost">
            Sık sorulanlar
          </Link>
        </div>
      </section>
    </div>
  );
}
