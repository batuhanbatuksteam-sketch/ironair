import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "IRONAIR — Endüstriyel Fan ve Havalandırma Sistemleri",
    template: "%s — IRONAIR",
  },
  description:
    "Aksiyel aspiratör, radyal fan, çatı fanı, kanal tipi fan, ATEX exproof fan ve hücreli fan sistemleri. Ölçünüzü seçin, teklifinizi aynı gün alın.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eceef1" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

/** Sayfa boyanmadan kayıtlı temayı uygular — mod geçişinde beyaz parlama olmaz. */
const themeScript = `(function(){try{var t=localStorage.getItem("ironair-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

/**
 * Kök kabuk yalnızca belgeyi ve temayı kurar.
 *
 * Site başlığı/altlığı `(site)` grubunda, teklif paneli kendi kabuğunda
 * (`panel/layout.tsx`) yaşıyor — panel bir iç araç, pazarlama menüsünü
 * taşımaması gerekiyor.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
