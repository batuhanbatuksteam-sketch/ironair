import Link from "next/link";
import { DURUMLAR, DURUM_ETIKET, DURUM_RENK, type Durum, type Teklif } from "@/data/teklif-tipi";
import { gecenSure } from "./zaman";

function bag(id: string | null, suzgec: Durum | null) {
  const p = new URLSearchParams();
  if (id) p.set("t", id);
  if (suzgec) p.set("d", suzgec);
  const s = p.toString();
  return s ? `/panel?${s}` : "/panel";
}

export default function TeklifListesi({
  teklifler,
  secilenId,
  suzgec,
  sayim,
  toplam,
}: {
  teklifler: Teklif[];
  secilenId: string | null;
  suzgec: Durum | null;
  sayim: Record<Durum, number>;
  toplam: number;
}) {
  return (
    <div className="flex min-h-0 flex-col">
      {/* Süzgeç şeridi — sayılar görünür olsun ki hangi yığın büyüdüğü belli olsun */}
      <div className="flex shrink-0 gap-1.5 overflow-x-auto border-b px-4 py-3">
        <Link
          href={bag(null, null)}
          className="shrink-0 rounded-[2px] border px-2.5 py-1 text-xs transition-colors"
          style={
            suzgec === null
              ? { borderColor: "var(--red)", background: "var(--red-wash)", color: "var(--red-text)" }
              : undefined
          }
        >
          Tümü <span className="tabular opacity-70">{toplam}</span>
        </Link>
        {DURUMLAR.filter((d) => sayim[d] > 0).map((d) => (
          <Link
            key={d}
            href={bag(null, d)}
            className="flex shrink-0 items-center gap-1.5 rounded-[2px] border px-2.5 py-1 text-xs transition-colors"
            style={
              suzgec === d
                ? { borderColor: "var(--red)", background: "var(--red-wash)", color: "var(--red-text)" }
                : undefined
            }
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: DURUM_RENK[d] }}
            />
            {DURUM_ETIKET[d]} <span className="tabular opacity-70">{sayim[d]}</span>
          </Link>
        ))}
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto">
        {teklifler.map((t) => {
          const secili = t.id === secilenId;
          return (
            <li key={t.id}>
              <Link
                href={bag(t.id, suzgec)}
                aria-current={secili ? "true" : undefined}
                className="block border-b px-4 py-3.5 transition-colors"
                style={
                  secili
                    ? { background: "var(--red-wash)", boxShadow: "inset 3px 0 0 var(--red)" }
                    : undefined
                }
              >
                <div className="flex items-baseline gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2 w-2 shrink-0 self-start rounded-full"
                    style={{ background: DURUM_RENK[t.durum] }}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                    {t.musteri.ad}
                  </span>
                  <span className="tabular shrink-0 text-xs text-ink-faint">
                    {gecenSure(t.olusturuldu)}
                  </span>
                </div>

                <div className="mt-1 flex items-baseline gap-2 pl-4">
                  {t.musteri.firma && (
                    <span className="min-w-0 truncate text-xs text-ink-muted">
                      {t.musteri.firma}
                    </span>
                  )}
                  {t.urunKodu && (
                    <span className="tabular ml-auto shrink-0 rounded-[2px] border px-1.5 py-0.5 text-[0.68rem] text-ink-faint">
                      {t.modelAdi ?? t.urunKodu}
                    </span>
                  )}
                </div>

                {t.musteri.not && (
                  <p className="mt-1.5 line-clamp-1 pl-4 text-xs text-ink-faint">
                    {t.musteri.not}
                  </p>
                )}
              </Link>
            </li>
          );
        })}

        {teklifler.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-ink-faint">
            Bu süzgeçte talep yok.
          </li>
        )}
      </ul>
    </div>
  );
}
