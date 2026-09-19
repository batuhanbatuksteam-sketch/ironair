import MarkaIsareti from "./MarkaIsareti";

/**
 * Marka kilidi: "Hız İzi" işareti ve sıkı harf aralıklı IRONAIR yazısı.
 *
 * İşaret markanın kırmızısını taşır, yazı bulunduğu yerin mürekkep rengini —
 * böylece koyu hero'da da açık kartta da aynı kilit çalışır.
 */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <MarkaIsareti className="h-[1.35em] w-[1.35em] shrink-0 text-red" />
      <span className="text-[1.06rem] font-extrabold" style={{ letterSpacing: "-0.055em" }}>
        IRONAIR
      </span>
    </span>
  );
}
