"use client";

import { useTransition } from "react";
import { DURUMLAR, DURUM_ETIKET, DURUM_RENK, type Durum } from "@/data/teklif-tipi";
import { durumuGuncelle } from "./eylemler";

export default function DurumSecici({ id, durum }: { id: string; durum: Durum }) {
  const [bekliyor, basla] = useTransition();

  return (
    <div className="flex flex-wrap gap-1.5" aria-busy={bekliyor}>
      {DURUMLAR.map((d) => {
        const aktif = d === durum;
        return (
          <button
            key={d}
            type="button"
            disabled={bekliyor || aktif}
            onClick={() => basla(() => void durumuGuncelle(id, d))}
            className="flex items-center gap-1.5 rounded-[2px] border px-2.5 py-1 text-xs transition-colors disabled:cursor-default"
            style={
              aktif
                ? {
                    borderColor: DURUM_RENK[d],
                    background: "color-mix(in srgb, " + DURUM_RENK[d] + " 12%, transparent)",
                    color: DURUM_RENK[d],
                    fontWeight: 600,
                  }
                : { opacity: bekliyor ? 0.5 : 1 }
            }
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: DURUM_RENK[d] }}
            />
            {DURUM_ETIKET[d]}
          </button>
        );
      })}
    </div>
  );
}
