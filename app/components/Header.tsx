"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import Wordmark from "./Wordmark";

/** Üst menü. Kalan sayfalar mobil menüde ve alt bilgide yer alır. */
const ANA_MENU = [
  { href: "/urunler", metin: "Ürünler" },
  { href: "/uygulama-alanlari", metin: "Uygulamalar" },
  { href: "/fan-secimi", metin: "Fan seçimi" },
  { href: "/hakkimizda", metin: "Hakkımızda" },
  { href: "/iletisim", metin: "İletişim" },
];

/** Mobil menünün alt bölümü — üst menüde yer kalmayan sayfalar. */
const EK_MENU = [
  { href: "/referanslar", metin: "Referanslar" },
  { href: "/belgeler", metin: "Belgeler" },
  { href: "/sss", metin: "Sık sorulanlar" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  /* Beyaz yazı yalnızca siyah hero'nun üstündeyken doğru; diğer sayfalarda
     başlık en tepede de zemin rengini alır, yoksa açık modda okunmaz. */
  const overHero = pathname === "/";
  const solid = scrolled || !overHero;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-200"
      style={{
        background: solid || open ? "color-mix(in srgb, var(--void) 88%, transparent)" : "transparent",
        backdropFilter: solid || open ? "blur(14px)" : "none",
        borderBottom: `1px solid ${solid || open ? "var(--line)" : "transparent"}`,
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-6 px-6 sm:px-10 lg:px-14">
        <Link href="/" aria-label="IRONAIR ana sayfa" className="shrink-0">
          <Wordmark className={solid || open ? "" : "text-white"} />
        </Link>

        <nav className="ml-auto hidden items-center gap-6 lg:flex">
          {ANA_MENU.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="text-sm font-medium transition-colors hover:text-red-text"
              style={{ color: solid ? "var(--ink)" : "#fff" }}
            >
              {m.metin}
            </Link>
          ))}
          <ThemeToggle light={!solid && !open} />
          <Link href="/teklif" className="btn btn-primary !min-h-[38px] !px-4 !text-sm">
            Teklif iste
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <ThemeToggle light={!solid && !open} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            className="grid h-11 w-11 place-items-center rounded-[2px] border"
            style={{ borderColor: solid || open ? "var(--line-strong)" : "rgba(255,255,255,.34)" }}
          >
            <span className="sr-only">Menü</span>
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M2 2l14 10M16 2L2 12"
                  stroke={solid || open ? "currentColor" : "#fff"}
                  strokeWidth="1.7"
                />
              ) : (
                <path
                  d="M0 1h18M0 7h18M0 13h18"
                  stroke={solid ? "currentColor" : "#fff"}
                  strokeWidth="1.7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t bg-void px-6 pb-10 pt-6 lg:hidden">
          <ul>
            {[...ANA_MENU, ...EK_MENU].map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  onClick={() => setOpen(false)}
                  className="block border-b py-3 text-[0.98rem] font-semibold"
                >
                  {m.metin}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-xs text-ink-faint">Ürün grupları</p>
          <ul className="mt-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/urunler/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 border-b py-3 text-[0.95rem] text-ink-muted"
                >
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: c.accent }}
                  />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/teklif" onClick={() => setOpen(false)} className="btn btn-primary mt-6 w-full">
            Teklif iste
          </Link>
        </div>
      )}
    </header>
  );
}

function ThemeToggle({ light }: { light: boolean }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("ironair-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("ironair-theme", next);
    } catch {
      /* özel pencerede yazılamaz — tema yine de bu sekmede geçerli */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Aydınlık moda geç" : "Karanlık moda geç"}
      className="grid h-11 w-11 place-items-center rounded-[2px] transition-colors hover:text-red-text"
      style={{ color: light ? "#fff" : "var(--ink)" }}
    >
      {theme === "dark" ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.4" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M12 1.8v2.6M12 19.6v2.6M22.2 12h-2.6M4.4 12H1.8M19.2 4.8l-1.8 1.8M6.6 17.4l-1.8 1.8M19.2 19.2l-1.8-1.8M6.6 6.6L4.8 4.8"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20.5 14.6A8.8 8.8 0 019.4 3.5a8.8 8.8 0 1011.1 11.1z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
