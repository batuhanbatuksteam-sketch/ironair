import type { Metadata, Viewport } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[2px] focus:bg-red focus:px-4 focus:py-2 focus:text-on-red"
        >
          İçeriğe geç
        </a>
        <Cursor />
        <Header />
        <main id="icerik">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
