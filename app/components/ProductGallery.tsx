"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Ürün galerisi.
 *
 * Katalogda her serinin ana fotoğrafı ve 1–8 arası detay görseli var; tek kare
 * göstermek yerine büyük kare + altında şerit. Arkadaki ışık ürün kartındakiyle
 * aynı — grubun rengini taşır.
 */
export default function ProductGallery({
  images,
  alt,
  accent,
  accentLight,
}: {
  images: string[];
  alt: string;
  accent: string;
  accentLight: string;
}) {
  const [aktif, setAktif] = useState(0);
  const renk = { "--acc": accent, "--acc-light": accentLight } as React.CSSProperties;

  if (images.length === 0) return null;

  return (
    <div className="min-w-0">
      {/* Stüdyo fotoğrafı kendi zeminini ve ışığını taşıyor — kırpmadan,
          kadrajı doldurarak gösteriliyor. */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] border bg-sunk"
        style={renk}
      >
        <Image
          src={images[aktif]}
          alt={aktif === 0 ? alt : `${alt} — görsel ${aktif + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setAktif(i)}
                aria-label={`Görsel ${i + 1}`}
                aria-current={i === aktif}
                className="relative block aspect-square w-full overflow-hidden rounded-[2px] border transition-colors"
                style={{
                  borderColor: i === aktif ? "var(--red)" : "var(--line)",
                  background: i === aktif ? "var(--red-wash)" : "transparent",
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-contain p-1.5"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
