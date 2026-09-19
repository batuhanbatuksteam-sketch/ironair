import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";
import { productsByCategory } from "@/data/products";

/**
 * Katalog dizini.
 *
 * Her grubun kendi vurgu rengi var ve ürünün arkasına o renkte bir ışık
 * düşüyor — hero'daki renkli kenar ışığının devamı. İlk kart iki sütun
 * genişliğinde, böylece ızgara aynı boyda kartlar dizisi gibi okunmuyor.
 */
export default function CategoryIndex() {
  return (
    <ul className="mx-auto mt-14 grid w-full max-w-[1400px] gap-3 px-6 sm:px-10 md:grid-cols-2 lg:grid-cols-3 lg:px-14">
      {categories.map((c, i) => {
        const items = productsByCategory(c.slug);
        const lead = items[0];
        const genis = i === 0;

        return (
          <li key={c.slug} className={genis ? "md:col-span-2" : undefined}>
            <Link
              href={`/urunler/${c.slug}`}
              className="grup-kart group relative flex h-full flex-col overflow-hidden rounded-[2px] border p-6"
              style={
                {
                  "--acc": c.accent,
                  "--acc-light": c.accentLight,
                } as React.CSSProperties
              }
            >
              <span aria-hidden="true" className="grup-isik" />

              {/* Ürün görseli kartın sağ alt köşesini doldurur */}
              {lead && (
                <span
                  className={`pointer-events-none absolute bottom-4 right-4 block ${
                    genis ? "h-[72%] w-[36%]" : "h-[48%] w-[52%]"
                  }`}
                >
                  <Image
                    src={lead.image ?? ""}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 60vw, 300px"
                    className="object-contain object-bottom-right transition-transform duration-500 group-hover:scale-[1.07]"
                  />
                </span>
              )}

              <span className="relative flex items-start justify-between gap-4">
                <span className="min-w-0">
                  <span className="grup-ad block text-[1.3rem] font-bold leading-tight tracking-tight">
                    {c.name}
                  </span>
                  <span className="tabular mt-1 block text-xs text-ink-faint">
                    {items.length} ürün
                  </span>
                </span>
                <span className="grup-ok grid h-8 w-8 shrink-0 place-items-center rounded-[2px] border">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M1 13L13 1M13 1H4M13 1v9"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="square"
                    />
                  </svg>
                </span>
              </span>

              <span
                className={`relative mt-4 block text-sm text-ink-muted ${
                  genis ? "max-w-[52%]" : "max-w-[62%]"
                }`}
              >
                {c.summary}
              </span>

              {/* Gruptaki ilk ürünler — kartın ne barındırdığını gösterir.
                  Genişlik görselin alanına girmeyecek şekilde sınırlı. */}
              <span
                className={`relative mt-auto flex flex-wrap gap-1.5 pt-6 ${
                  genis ? "max-w-[58%]" : "max-w-[64%]"
                }`}
              >
                {items.slice(0, genis ? 3 : 2).map((p) => (
                  <span
                    key={p.slug}
                    className="truncate rounded-[2px] border px-2 py-0.5 text-xs text-ink-faint"
                  >
                    {p.name}
                  </span>
                ))}
                {items.length > (genis ? 3 : 2) && (
                  <span className="tabular px-1 py-0.5 text-xs text-ink-faint">
                    +{items.length - (genis ? 3 : 2)}
                  </span>
                )}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
