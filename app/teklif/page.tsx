import type { Metadata } from "next";
import GeneralQuoteForm from "../components/GeneralQuoteForm";

export const metadata: Metadata = {
  title: "Teklif iste",
  description:
    "Projenizin debi ve basınç ihtiyacını yazın, uygun fan serisini seçip aynı iş günü içinde teklif gönderelim.",
};

export default function QuotePage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 pt-28 sm:px-10 lg:px-14">
      <div className="gauge-rule" data-accent="true" />
      <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <h1 className="h1">Teklif iste</h1>
          <p className="prose-measure mt-6 text-ink-muted">
            Hangi seriyi istediğinizi biliyorsanız ürün sayfasından yapılandırıp
            göndermek en hızlısı. Emin değilseniz bu formu kullanın — hacim,
            kullanım amacı ve kanal uzunluğunu yazmanız yeterli, seriyi biz seçelim.
          </p>

          <h2 className="h3 mt-12 border-b pb-3">Teklife ne dahil</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            <li className="border-b pb-3">
              Seçtiğiniz ölçü ve devirde birim fiyat
            </li>
            <li className="border-b pb-3">Debi–basınç eğrisi ve ses seviyesi</li>
            <li className="border-b pb-3">Teknik resim ve montaj ölçüleri</li>
            <li className="border-b pb-3">Termin süresi ve nakliye</li>
          </ul>
        </div>

        <GeneralQuoteForm />
      </div>
    </div>
  );
}
