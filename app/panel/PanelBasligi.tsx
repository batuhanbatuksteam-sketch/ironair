import Link from "next/link";
import MarkaIsareti from "../components/MarkaIsareti";
import { cikisYap } from "./eylemler";

export default function PanelBasligi({ toplam, yeni }: { toplam: number; yeni: number }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b bg-surface px-5 py-3">
      <div className="flex items-center gap-3">
        <MarkaIsareti className="h-6 w-6 shrink-0 text-red" />
        <div className="min-w-0">
          <h1 className="text-[0.95rem] leading-tight font-extrabold tracking-tight">
            Teklif Masası
          </h1>
          <p className="tabular text-xs text-ink-faint">
            {toplam} talep
            {yeni > 0 && (
              <>
                {" · "}
                <span className="font-semibold text-red-text">{yeni} yeni</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="rounded-[2px] border px-3 py-1.5 text-xs text-ink-muted transition-colors hover:text-red-text"
        >
          Siteye dön
        </Link>
        <form action={cikisYap}>
          <button
            type="submit"
            className="rounded-[2px] border px-3 py-1.5 text-xs text-ink-muted transition-colors hover:text-red-text"
          >
            Çıkış
          </button>
        </form>
      </div>
    </header>
  );
}
