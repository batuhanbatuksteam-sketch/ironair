"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Product } from "@/data/types";

export type Selection = { group: string; value: string };

type Status = "idle" | "sending" | "sent" | "error";

export default function QuoteDialog({
  open,
  onClose,
  product,
  selections,
}: {
  open: boolean;
  onClose: () => void;
  product: Product;
  selections: Selection[];
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorText, setErrorText] = useState("");
  const [waLink, setWaLink] = useState<string | null>(null);
  const titleId = useId();

  /* Odağı yakala, Escape ile kapat, kapanınca odağı geri ver. */
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("input, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      restoreRef.current?.focus();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setErrorText("");
      setWaLink(null);
    }
  }, [open]);

  if (!open) return null;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setErrorText("");

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
          urun: { ad: product.name, kod: product.code, slug: product.slug },
          secimler: selections,
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

  return (
    <div className="fixed inset-0 z-[80] grid place-items-end sm:place-items-center">
      <div
        className="absolute inset-0 bg-black/62 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[2px] border bg-void p-6 sm:max-w-lg sm:rounded-[2px] sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-[2px] hover:text-red-text"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>

        {status === "sent" ? (
          <div>
            <h2 id={titleId} className="h2">
              Teklif talebiniz ulaştı
            </h2>
            <p className="mt-4 text-ink-muted">
              Seçimlerinizi aldık. Teknik ekip aynı iş günü içinde telefon veya
              e-posta ile döner.
            </p>
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost mt-6 w-full"
              >
                WhatsApp&apos;tan da gönder
              </a>
            )}
            <button type="button" onClick={onClose} className="btn btn-primary mt-2 w-full">
              Kapat
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <h2 id={titleId} className="h2">
              Teklif iste
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              {product.name} · <span className="tabular">{product.code}</span>
            </p>

            <ul className="mt-5 space-y-1.5 border-y py-4 text-sm">
              {selections.map((s) => (
                <li key={s.group} className="flex items-baseline justify-between gap-4">
                  <span className="text-ink-faint">{s.group}</span>
                  <span className={/^[Ø\d]/.test(s.value) ? "tabular" : "font-medium"}>
                    {s.value}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-4">
              <Field name="ad" label="Ad soyad" required autoComplete="name" />
              <Field name="firma" label="Firma" autoComplete="organization" />
              <Field
                name="telefon"
                label="Telefon"
                required
                type="tel"
                autoComplete="tel"
                placeholder="0___ ___ __ __"
              />
              <Field
                name="eposta"
                label="E-posta"
                required
                type="email"
                autoComplete="email"
              />
              <div>
                <label htmlFor="q-not" className="mb-1.5 block text-sm font-medium">
                  Not
                </label>
                <textarea
                  id="q-not"
                  name="not"
                  rows={3}
                  placeholder="Debi, basınç, montaj yeri veya teslim tarihi hakkında bilgi"
                  className="w-full rounded-[2px] border bg-surface px-3.5 py-2.5 text-[0.95rem] outline-none focus:border-red"
                />
              </div>
            </div>

            {status === "error" && (
              <p role="alert" className="mt-4 text-sm text-red-text">
                {errorText}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="btn btn-primary mt-6 w-full"
            >
              {status === "sending" ? "Gönderiliyor" : "Teklifi gönder"}
            </button>

            <p className="mt-3 text-xs text-ink-faint">
              Bilgileriniz yalnızca bu teklif için kullanılır.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  required,
  type = "text",
  autoComplete,
  placeholder,
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={`q-${name}`} className="mb-1.5 block text-sm font-medium">
        {label}
        {!required && <span className="ml-1.5 text-xs text-ink-faint">isteğe bağlı</span>}
      </label>
      <input
        id={`q-${name}`}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-[2px] border bg-surface px-3.5 py-2.5 text-[0.95rem] outline-none focus:border-red"
      />
    </div>
  );
}
