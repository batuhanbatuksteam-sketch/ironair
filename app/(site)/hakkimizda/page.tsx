import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/data/categories";
import { modelCount, products } from "@/data/products";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "IRONAIR endüstriyel fan ve havalandırma sistemleri üretir. Aksiyel, radyal, çatı, kanal tipi, ATEX exproof ve hücreli fan grupları.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 pt-28 sm:px-10 lg:px-14">
      <div className="gauge-rule" data-accent="true" />
      <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <h1 className="h1">Havayı hareket ettiren makineleri üretiyoruz</h1>

        <div className="prose-measure space-y-5 text-ink-muted">
          <p>
            IRONAIR, sanayi tesisleri ve ticari yapılar için fan ve havalandırma
            ekipmanı üretir. Katalogda {products.length} seri ve {modelCount} model{" "}
            {categories.length} grupta toplanmıştır: havayı pervane ekseninde iten
            aksiyel fanlardan, kanal direncini yenen radyal fanlara; çatı
            aspiratörlerinden ATEX sertifikalı exproof serilere kadar.
          </p>
          <p>
            Ürünlerin çoğu stoktan değil, projenin debi ve basınç ihtiyacına göre
            üretilir. Çark çapı, motor devri, gövde malzemesi ve koruma sınıfı
            sipariş sırasında belirlenir. Standart dışı ölçülerde teknik resim
            üzerinden çalışırız.
          </p>
          <p>
            Bir fanın doğru seçilmesi, tesisin enerji faturasını ve çalışanların
            soluduğu havayı doğrudan etkiler. Bu yüzden teklif aşamasında yalnız
            fiyat değil, debi–basınç eğrisi ve ses seviyesi de gönderilir.
          </p>
        </div>
      </div>

      <div className="gauge-rule mt-24" />
      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div>
          <h2 className="h2">Doğru seriyi birlikte seçelim</h2>
          <p className="prose-measure mt-4 text-ink-muted">
            Ölçüleri bilmeseniz de olur — ortamın hacmini ve kullanım amacını yazın.
          </p>
        </div>
        <Link href="/teklif" className="btn btn-primary lg:!min-h-[54px] lg:!px-8">
          Teklif iste
        </Link>
      </div>
    </div>
  );
}
