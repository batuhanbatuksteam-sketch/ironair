import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/types";
import { categoryBySlug } from "@/data/categories";
import { leadRanges } from "@/data/products";

/**
 * Ürün kartı. Görselin arkasındaki ışık, ürünün ait olduğu grubun rengini
 * taşır — katalogda hangi gruptasınız, karta bakınca belli olur. Alttaki iki
 * çip serinin gerçek debi ve basınç aralığı; kataloğun en çok sorulan değeri.
 */
export default function ProductCard({ product }: { product: Product }) {
  const kategori = categoryBySlug(product.categorySlug);
  const degerler = leadRanges(product);

  return (
    <li className="min-w-0">
      <Link
        href={`/urunler/${product.categorySlug}/${product.slug}`}
        className="urun-kart group flex h-full flex-col rounded-[2px] border p-4 transition-colors"
        style={
          {
            "--acc": kategori?.accent ?? "#E4141B",
            "--acc-light": kategori?.accentLight ?? "#B00D13",
          } as React.CSSProperties
        }
      >
        {/* Görseller stüdyo fotoğrafı: kendi zemini ve ışığı var, o yüzden
            kartın içinde yüzen bir nesne gibi değil, kadrajı dolduran bir
            fotoğraf olarak duruyor. */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] bg-sunk">
          {product.image && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          )}
        </div>

        <div className="mt-5 flex items-baseline justify-between gap-3">
          <h3 className="h3 urun-ad transition-colors">{product.name}</h3>
          <span className="tabular shrink-0 text-xs text-ink-faint">{product.code}</span>
        </div>
        <p className="mt-2 text-sm text-ink-muted">{product.summary}</p>

        <span className="mt-4 flex flex-wrap items-center gap-1.5">
          {degerler.map((r) => (
            <span
              key={r.field}
              className="tabular rounded-[2px] border px-2 py-0.5 text-xs text-ink-faint"
            >
              {r.display}
            </span>
          ))}
          <span className="tabular px-1 text-xs text-ink-faint">
            {product.modelCount} model
          </span>
        </span>
      </Link>
    </li>
  );
}
