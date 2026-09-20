import MarkaIsareti from "../components/MarkaIsareti";

export default function BosDurum() {
  return (
    <div className="grid flex-1 place-items-center px-6 py-16">
      <div className="max-w-sm text-center">
        <MarkaIsareti className="mx-auto h-10 w-10 text-line-strong" izsiz />
        <h2 className="h3 mt-5">Henüz talep yok</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Sitedeki bir ürün sayfasından teklif istendiğinde talep buraya düşer —
          müşterinin bilgileri, seçtiği model ve o modelin tam teknik tablosuyla
          birlikte.
        </p>
      </div>
    </div>
  );
}
