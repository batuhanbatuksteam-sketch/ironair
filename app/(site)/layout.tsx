import Header from "../components/Header";
import Footer from "../components/Footer";
import Cursor from "../components/Cursor";

/** Ziyaretçiye açık sayfaların kabuğu: başlık, içerik, altlık. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
