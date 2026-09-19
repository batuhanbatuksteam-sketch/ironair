import Link from "next/link";

/** Sayfa girişleri için ortak başlık bloğu — ölçü çizgisi, başlık, açıklama. */
export default function PageHeader({
  baslik,
  aciklama,
  ustBaglanti,
}: {
  baslik: string;
  aciklama: string;
  /** İsteğe bağlı üst kırıntı bağlantısı. */
  ustBaglanti?: { href: string; metin: string };
}) {
  return (
    <>
      {ustBaglanti && (
        <nav aria-label="Konum" className="mb-8 text-sm text-ink-faint">
          <Link href={ustBaglanti.href} className="hover:text-red-text">
            {ustBaglanti.metin}
          </Link>
        </nav>
      )}
      <div className="gauge-rule" data-accent="true" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end">
        <h1 className="h1">{baslik}</h1>
        <p className="prose-measure text-ink-muted">{aciklama}</p>
      </div>
    </>
  );
}
