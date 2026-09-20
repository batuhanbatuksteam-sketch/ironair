"use client";

import { useActionState } from "react";
import { girisYap } from "../eylemler";

export default function GirisFormu() {
  const [hata, gonder, bekliyor] = useActionState(girisYap, null);

  return (
    <form action={gonder} className="mt-8">
      <label htmlFor="parola" className="mb-1.5 block text-sm font-medium">
        Parola
      </label>
      <input
        id="parola"
        name="parola"
        type="password"
        autoFocus
        autoComplete="current-password"
        className="w-full rounded-[2px] border bg-surface px-3.5 py-2.5 outline-none focus:border-red"
      />
      {hata && (
        <p role="alert" className="mt-2 text-sm text-red-text">
          {hata}
        </p>
      )}
      <button type="submit" disabled={bekliyor} className="btn btn-primary mt-5 w-full">
        {bekliyor ? "Kontrol ediliyor…" : "Gir"}
      </button>
    </form>
  );
}
