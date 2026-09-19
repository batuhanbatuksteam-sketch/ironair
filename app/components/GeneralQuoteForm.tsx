"use client";

import { useState } from "react";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

type Status = "idle" | "sending" | "sent" | "error";

/** Ürün sayfası dışından gelen genel teklif formu. */
export default function GeneralQuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");
  const [waLink, setWaLink] = useState<string | null>(null);
  const [group, setGroup] = useState("");

  const seriesForGroup = group ? products.filter((p) => p.categorySlug === group) : [];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setErrorText("");

    const grupAdi = categories.find((c) => c.slug === form.get("grup"))?.name;
    const seriSlug = String(form.get("seri") ?? "");
    const seri = products.find((p) => p.slug === seriSlug);

    const secimler = [
      grupAdi ? { group: "Ürün grubu", value: grupAdi } : null,
      seri ? { group: "Seri", value: `${seri.name} (${seri.code})` } : null,
      form.get("debi") ? { group: "İhtiyaç duyulan debi", value: `${form.get("debi")} m³/h` } : null,
      form.get("basinc") ? { group: "İhtiyaç duyulan basınç", value: `${form.get("basinc")} Pa` } : null,
      form.get("adet") ? { group: "Adet", value: String(form.get("adet")) } : null,
    ].filter((s): s is { group: string; value: string } => s !== null);

    try {
      const res = await fetch("/api/teklif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad: String(form.get("ad") ?? ""),
          firma: String(form.get("firma") ?? ""),
          telefon: String(form.get("telefon") ?? ""),
          eposta: String(form.get("eposta") ?? ""),
          not: String(form.get("not") ?? ""),
          urun: seri
            ? { ad: seri.name, kod: seri.code, slug: seri.slug }
            : { ad: grupAdi ?? "Genel talep", kod: "-", slug: "-" },
          secimler,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.hata ?? "Teklif gönderilemedi.");
      setWaLink(data.whatsappUrl ?? null);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorText(err instanceof Error ? err.message : "Teklif gönderilemedi.");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-[2px] border bg-surface p-8">
        <h2 className="h2">Teklif talebiniz ulaştı</h2>
        <p className="mt-4 text-ink-muted">
          Teknik ekip aynı iş günü içinde telefon veya e-posta ile döner.
        </p>
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost mt-6"
          >
            WhatsApp&apos;tan da gönder
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-[2px] border bg-surface p-6 sm:p-8">
      <div className="space-y-5">
        <div>
          <label htmlFor="g-grup" className="mb-1.5 block text-sm font-medium">
            Ürün grubu <span className="ml-1.5 text-xs text-ink-faint">isteğe bağlı</span>
          </label>
          <select
            id="g-grup"
            name="grup"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="w-full rounded-[2px] border bg-void px-3.5 py-2.5 text-[0.95rem] outline-none focus:border-red"
          >
            <option value="">Bilmiyorum, siz seçin</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {seriesForGroup.length > 0 && (
          <div>
            <label htmlFor="g-seri" className="mb-1.5 block text-sm font-medium">
              Seri <span className="ml-1.5 text-xs text-ink-faint">isteğe bağlı</span>
            </label>
            <select
              id="g-seri"
              name="seri"
              className="w-full rounded-[2px] border bg-void px-3.5 py-2.5 text-[0.95rem] outline-none focus:border-red"
            >
              <option value="">Fark etmez</option>
              {seriesForGroup.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name} — {p.code}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-3">
          <Field name="debi" label="Debi" suffix="m³/h" inputMode="numeric" />
          <Field name="basinc" label="Basınç" suffix="Pa" inputMode="numeric" />
          <Field name="adet" label="Adet" inputMode="numeric" />
        </div>

        <div className="gauge-rule mb-3 mt-7" />

        <Field name="ad" label="Ad soyad" required autoComplete="name" />
        <Field name="firma" label="Firma" autoComplete="organization" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="telefon"
            label="Telefon"
            required
            type="tel"
            autoComplete="tel"
            placeholder="0___ ___ __ __"
          />
          <Field name="eposta" label="E-posta" required type="email" autoComplete="email" />
        </div>

        <div>
          <label htmlFor="g-not" className="mb-1.5 block text-sm font-medium">
            Projeniz <span className="ml-1.5 text-xs text-ink-faint">isteğe bağlı</span>
          </label>
          <textarea
            id="g-not"
            name="not"
            rows={4}
            placeholder="Ortamın hacmi, kullanım amacı, kanal uzunluğu, montaj yeri ve termin"
            className="w-full rounded-[2px] border bg-void px-3.5 py-2.5 text-[0.95rem] outline-none focus:border-red"
          />
        </div>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-5 text-sm text-red-text">
          {errorText}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn btn-primary mt-7 w-full">
        {status === "sending" ? "Gönderiliyor" : "Teklifi gönder"}
      </button>
      <p className="mt-3 text-xs text-ink-faint">
        Bilgileriniz yalnızca bu teklif için kullanılır.
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  required,
  type = "text",
  autoComplete,
  placeholder,
  suffix,
  inputMode,
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  suffix?: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <div>
      <label htmlFor={`g-${name}`} className="mb-1.5 block text-sm font-medium">
        {label}
        {suffix && <span className="tabular ml-1.5 text-xs text-ink-faint">{suffix}</span>}
        {!required && !suffix && (
          <span className="ml-1.5 text-xs text-ink-faint">isteğe bağlı</span>
        )}
      </label>
      <input
        id={`g-${name}`}
        name={name}
        type={type}
        inputMode={inputMode}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-[2px] border bg-void px-3.5 py-2.5 text-[0.95rem] outline-none focus:border-red"
      />
    </div>
  );
}
