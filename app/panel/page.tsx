import { redirect } from "next/navigation";
import { DURUMLAR, type Durum, type Teklif } from "@/data/teklif-tipi";
import { seriDetay } from "@/data/katalog";
import { productBySlug } from "@/data/products";
import { guncelModelAdi, guncelSlug } from "@/data/eski-kodlar";
import { teklifleriListele } from "@/lib/teklif-deposu";
import { oturumAcikMi } from "@/lib/panel-oturum";
import PanelBasligi from "./PanelBasligi";
import TeklifListesi from "./TeklifListesi";
import TeklifDetay from "./TeklifDetay";
import BosDurum from "./BosDurum";
import type { DetayVerisi } from "./tipler";

export const dynamic = "force-dynamic";

/**
 * Seçilen talebin katalog karşılığını toplar: ürünün fotoğrafı, serinin
 * aralıkları ve müşterinin işaretlediği modelin tam teknik tablosu.
 *
 * Bu veriyi talebin içinde saklamıyoruz; katalog güncellenince eski talepler
 * de güncel tabloyu göstersin diye her seferinde buradan okunuyor.
 */
function detayTopla(teklif: Teklif): DetayVerisi {
  // Eski talepler IRT- kodlarıyla kayıtlı; güncel kataloğa çevrilerek okunur.
  const slug = teklif.urunSlug ? guncelSlug(teklif.urunSlug) : undefined;
  const urun = slug ? productBySlug(slug) : undefined;
  const seri = slug ? seriDetay(slug) : undefined;
  const modelAdi = teklif.modelAdi ? guncelModelAdi(teklif.modelAdi) : undefined;
  const model =
    modelAdi && seri?.models ? seri.models.find((m) => m.name === modelAdi) : undefined;
  return {
    urun: urun
      ? {
          slug: urun.slug,
          kod: urun.code,
          ad: urun.name,
          ozet: urun.summary,
          gorsel: urun.image,
          kategoriSlug: urun.categorySlug,
          modelSayisi: urun.modelCount,
          aralik: urun.ranges.map((r) => ({ etiket: r.label, gosterim: r.display })),
        }
      : null,
    model: model
      ? {
          ad: model.name,
          gruplar: model.groups.map((g) => ({
            id: g.id,
            ad: g.label,
            satirlar: g.rows.map((r) => ({ ad: r.label, deger: r.display })),
          })),
        }
      : null,
  };
}

type Params = { searchParams: Promise<{ t?: string; d?: string }> };

export default async function PanelSayfasi({ searchParams }: Params) {
  if (!(await oturumAcikMi())) redirect("/panel/giris");

  const { t: secilenId, d: durumSuzgeci } = await searchParams;
  const hepsi = await teklifleriListele();

  const sayim = Object.fromEntries(
    DURUMLAR.map((d) => [d, hepsi.filter((x) => x.durum === d).length])
  ) as Record<Durum, number>;

  const suzgec = DURUMLAR.includes(durumSuzgeci as Durum) ? (durumSuzgeci as Durum) : null;
  const liste = suzgec ? hepsi.filter((x) => x.durum === suzgec) : hepsi;

  const secilen = secilenId ? hepsi.find((x) => x.id === secilenId) ?? null : liste[0] ?? null;
  const detay = secilen ? detayTopla(secilen) : null;

  return (
    <div className="flex h-[100dvh] flex-col">
      <PanelBasligi toplam={hepsi.length} yeni={sayim.yeni} />

      {hepsi.length === 0 ? (
        <BosDurum />
      ) : (
        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(320px,400px)_minmax(0,1fr)]">
          <TeklifListesi
            teklifler={liste}
            secilenId={secilen?.id ?? null}
            suzgec={suzgec}
            sayim={sayim}
            toplam={hepsi.length}
          />
          <div className="min-w-0 overflow-y-auto border-l max-lg:hidden">
            {secilen && detay ? (
              <TeklifDetay teklif={secilen} detay={detay} />
            ) : (
              <div className="grid h-full place-items-center p-10 text-sm text-ink-faint">
                Soldan bir talep seçin.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
