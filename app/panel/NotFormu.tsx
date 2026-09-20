"use client";

import { useRef, useTransition } from "react";
import { notKaydet } from "./eylemler";

export default function NotFormu({ id }: { id: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [bekliyor, basla] = useTransition();

  return (
    <form
      ref={formRef}
      action={(form) =>
        basla(async () => {
          await notKaydet(id, form);
          formRef.current?.reset();
        })
      }
      className="mt-3"
    >
      <label htmlFor={`not-${id}`} className="sr-only">
        Not ekle
      </label>
      <textarea
        id={`not-${id}`}
        name="not"
        rows={2}
        placeholder="Görüşme notu, verilen fiyat, takip tarihi…"
        className="w-full resize-y rounded-[2px] border bg-surface px-3 py-2 text-sm outline-none focus:border-red"
      />
      <button
        type="submit"
        disabled={bekliyor}
        className="mt-2 rounded-[2px] border px-3 py-1.5 text-xs font-medium transition-colors hover:border-red-line hover:text-red-text disabled:opacity-50"
      >
        {bekliyor ? "Kaydediliyor…" : "Not ekle"}
      </button>
    </form>
  );
}
