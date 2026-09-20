import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teklif Masası",
  robots: { index: false, follow: false },
};

/**
 * Panel kabuğu.
 *
 * Pazarlama başlığı ve altlığı yok: bu bir iş ekranı, tam yüksekliği
 * kullanması ve dikkat dağıtmaması gerekiyor. Giriş sayfası da bu kabuğu
 * kullanıyor, oturum kontrolü sayfaların kendisinde.
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100dvh] bg-void">{children}</div>;
}
