"use client";

import { useRef, useState, useTransition } from "react";
import { yanitGonder } from "./eylemler";

/**
 * Panelden yanıt yazma kutusu.
 *
 * Kapalı başlar; teklif okunurken ekranı meşgul etmesin, yazmaya karar
 * verildiğinde açılsın. Taslak konu ve gövde hazır gelir — kullanıcı yalnız
 * fiyatı ve süreyi doldurur.
 */
export default function YanitKutusu({
  id,
  konuTaslagi,
  metinTaslagi,
  alici,
}: {
  id: string;
  konuTaslagi: string;
  metinTaslagi: string;
  alici: string;
}) {
  const [acik, setAcik] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [gonderildi, setGonderildi] = useState(false);
  const [bekliyor, basla] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  if (!acik) {
    return (
      <button
        type="button"
        onClick={() => setAcik(true)}
        className="btn btn-primary mt-3 w-full justify-center sm:w-auto"
      >
        Panelden yanıt yaz
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={(form) =>
        basla(async () => {
          const sonuc = await yanitGonder(id, form);
          setHata(sonuc);
          if (!sonuc) {
            setGonderildi(true);
            setAcik(false);
            formRef.current?.reset();
          }
        })
      }
      className="mt-3 rounded-[2px] border bg-surface p-4"
    >
      <p className="text-xs text-ink-faint">
        Alıcı: <span className="font-medium text-ink-muted">{alici}</span> · bir nüshası
        şirket kutusuna da düşer
      </p>

      <label htmlFor={`konu-${id}`} className="mt-3 mb-1 block text-xs font-medium">
        Konu
      </label>
      <input
        id={`konu-${id}`}
        name="konu"
        defaultValue={konuTaslagi}
        className="w-full rounded-[2px] border bg-void px-3 py-2 text-sm outline-none focus:border-red"
      />

      <label htmlFor={`metin-${id}`} className="mt-3 mb-1 block text-xs font-medium">
        Mesaj
      </label>
      <textarea
        id={`metin-${id}`}
        name="metin"
        rows={10}
        defaultValue={metinTaslagi}
        className="w-full resize-y rounded-[2px] border bg-void px-3 py-2 text-sm leading-relaxed outline-none focus:border-red"
      />

      {hata && (
        <p role="alert" className="mt-2 text-sm text-red-text">
          {hata}
        </p>
      )}

      <div className="mt-3 flex items-center gap-2">
        <button type="submit" disabled={bekliyor} className="btn btn-primary">
          {bekliyor ? "Gönderiliyor…" : "Gönder"}
        </button>
        <button
          type="button"
          onClick={() => {
            setAcik(false);
            setHata(null);
          }}
          className="rounded-[2px] border px-3 py-2 text-sm text-ink-muted transition-colors hover:text-red-text"
        >
          Vazgeç
        </button>
        {gonderildi && <span className="text-xs text-ink-faint">Önceki yanıt gönderildi ✓</span>}
      </div>
    </form>
  );
}
