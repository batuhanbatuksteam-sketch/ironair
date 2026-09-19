/**
 * IRONAIR marka işareti — "Hız İzi".
 *
 * Beş süpürülmüş kanat, halkalı göbek ve çarkın dışında dönüş yönünü izleyen
 * iki yay. Geometri `tools/ikon-ciz.py` ile hesaplandı; oradaki sabitler
 * değişirse bu dosya yeniden üretilir, elle düzenlenmez.
 *
 * Renk `currentColor` üzerinden gelir — kullanıldığı yerde `text-*` ya da
 * `color` ne ise işaret onu alır, böylece açık ve koyu temada ayrı sürüm
 * gerekmiyor. `izsiz` küçük boyutlar için: 32 px altında yaylar okunmuyor,
 * o ölçekte sadece çark kalır.
 */
export default function MarkaIsareti({
  className = "",
  izsiz = false,
}: {
  className?: string;
  izsiz?: boolean;
}) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M50 38Q54.56 24.67 70.97 18.91A37.5 37.5 0 0 1 86.05 39.66Q66.98 30.66 53.47 38.51Z" />
      <path d="M61.41 46.29Q75.5 46.51 86.05 60.34A37.5 37.5 0 0 1 70.97 81.09Q73.64 60.17 62 49.75Z" />
      <path d="M57.05 59.71Q61.2 73.17 51.31 87.48A37.5 37.5 0 0 1 26.91 79.55Q47.63 75.63 53.95 61.33Z" />
      <path d="M42.95 59.71Q31.42 67.82 14.76 62.83A37.5 37.5 0 0 1 14.76 37.17Q24.89 55.67 40.44 57.26Z" />
      <path d="M38.59 46.29Q27.32 37.84 26.91 20.45A37.5 37.5 0 0 1 51.31 12.52Q36.85 27.87 40.15 43.15Z" />
      {!izsiz && (
        <>
          <path
            d="M63.44 8.63 A43.5 43.5 0 0 1 92.21 39.48"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <path
            d="M36.56 91.37 A43.5 43.5 0 0 1 7.79 60.52"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </>
      )}
      <circle cx="50" cy="50" r="10.2" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="50" cy="50" r="5.2" />
    </svg>
  );
}
