"use client";

import { useMemo, useState } from "react";
import type { Product, ProductModel } from "@/data/types";
import QuoteDialog from "./QuoteDialog";

/**
 * Model seçici.
 *
 * Seri bir ürün ailesi; teklif tek bir fan boyu için verilir. Katalogdaki her
 * model gerçek debi/basınç/güç değerleriyle listelenir, seçilen modelin tam
 * spec tablosu yanda açılır. Kullanıcı tahmin etmek zorunda kalmasın diye
 * model satırının üstünde o boyun üç ana değeri yazılı.
 */

/** Model satırında gösterilecek özet değerler. */
const OZET_ANAHTAR = ["volumeMax", "pressureStaticMax", "powerRated"] as const;

function ozet(model: ProductModel) {
  const hepsi = model.groups.flatMap((g) => g.rows);
  return OZET_ANAHTAR.map((k) => hepsi.find((r) => r.key === k)).filter((r) => !!r);
}

export default function Configurator({
  product,
  models,
}: {
  product: Product;
  models: ProductModel[];
}) {
  /* Tek modelli seride seçim diye bir şey yok — baştan işaretli gelir. */
  const [seciliSlug, setSeciliSlug] = useState<string | null>(
    models.length === 1 ? models[0].slug : null
  );
  const [adet, setAdet] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uyari, setUyari] = useState(false);

  const secili = useMemo(
    () => models.find((m) => m.slug === seciliSlug) ?? null,
    [models, seciliSlug]
  );

  /* Teklif formuna giden satırlar: seçilen modelin ana değerleri + adet. */
  const secimler = useMemo(() => {
    if (!secili) return [];
    return [
      { group: "Model", value: secili.name },
      ...secili.groups
        .flatMap((g) => g.rows)
        .filter((r) => OZET_ANAHTAR.includes(r.key as (typeof OZET_ANAHTAR)[number]))
        .map((r) => ({ group: r.label, value: r.display })),
      { group: "Adet", value: `${adet}` },
    ];
  }, [secili, adet]);

  const teklifAc = () => {
    if (!secili) {
      setUyari(true);
      document.getElementById("model-listesi")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    setDialogOpen(true);
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-14">
      <div className="min-w-0">
        <h2 className="h2">Model seçin</h2>
        <p className="prose-measure mt-3 text-sm text-ink-muted">
          {product.code} serisinde {models.length} boy var. Aradığınız debi ve basınca
          en yakın satırı işaretleyin — tam tablosu açılır, teklif o boy için hazırlanır.
        </p>

        {uyari && (
          <p role="alert" className="mt-5 text-sm text-red-text">
            Teklif için bir model seçmeniz gerekiyor.
          </p>
        )}

        <div id="model-listesi" className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-ink-faint">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Model
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-medium">
                  Debi
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-medium">
                  Statik basınç
                </th>
                <th scope="col" className="py-2 text-right font-medium">
                  Nominal güç
                </th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => {
                const aktif = m.slug === seciliSlug;
                const degerler = ozet(m);
                return (
                  <tr
                    key={m.slug}
                    onClick={() => {
                      setSeciliSlug(m.slug);
                      setUyari(false);
                    }}
                    className="cursor-pointer border-b transition-colors"
                    style={{ background: aktif ? "var(--red-wash)" : "transparent" }}
                  >
                    <td className="py-3 pr-4">
                      <label className="flex cursor-pointer items-center gap-2.5">
                        <input
                          type="radio"
                          name={`${product.slug}-model`}
                          value={m.slug}
                          checked={aktif}
                          onChange={() => {
                            setSeciliSlug(m.slug);
                            setUyari(false);
                          }}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className="h-3 w-3 shrink-0 rounded-full border"
                          style={{
                            borderColor: aktif ? "var(--red)" : "var(--line)",
                            boxShadow: aktif ? "inset 0 0 0 3px var(--red)" : undefined,
                          }}
                        />
                        <span
                          className="tabular font-semibold"
                          style={{ color: aktif ? "var(--red-text)" : "var(--ink)" }}
                        >
                          {m.name}
                        </span>
                      </label>
                    </td>
                    {degerler.map((r) => (
                      <td key={r.key} className="tabular py-3 pr-4 text-right last:pr-0">
                        {r.display}
                      </td>
                    ))}
                    {/* Kataloğunda o değer olmayan modelde sütun boş kalmasın */}
                    {Array.from({ length: 3 - degerler.length }).map((_, i) => (
                      <td key={`bos-${i}`} className="py-3 pr-4 text-right text-ink-faint">
                        —
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {secili && (
          <div className="mt-14">
            <h3 className="h3 border-b pb-3">
              {secili.name} — tam teknik tablo
            </h3>
            <div className="mt-8 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {secili.groups.map((g) => (
                <section key={g.id} className="min-w-0">
                  <h4 className="text-xs font-semibold tracking-wide text-ink-faint uppercase">
                    {g.label}
                  </h4>
                  <dl className="mt-2">
                    {g.rows.map((r) => (
                      <div
                        key={r.key}
                        className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 border-b py-2 text-sm"
                      >
                        <dt className="shrink-0 text-ink-muted">{r.label}</dt>
                        <dd className="tabular min-w-0 grow text-right font-medium break-words">
                          {r.display}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Seçim özeti — masaüstünde yapışkan, mobilde akışın sonunda */}
      <aside className="lg:sticky lg:top-24">
        <div className="rounded-[2px] border bg-surface p-6">
          <h3 className="h3">Seçiminiz</h3>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-baseline justify-between gap-4 border-b pb-3">
              <dt className="shrink-0 text-ink-faint">Seri</dt>
              <dd className="min-w-0 text-right font-semibold text-balance">
                {product.name}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b pb-3">
              <dt className="text-ink-faint">Kod</dt>
              <dd className="tabular text-right">{product.code}</dd>
            </div>
            {secimler.length > 0 ? (
              secimler.slice(0, -1).map((s) => (
                <div
                  key={s.group}
                  className="flex items-baseline justify-between gap-4 border-b pb-3"
                >
                  <dt className="shrink-0 text-ink-faint">{s.group}</dt>
                  <dd className="tabular min-w-0 text-right font-medium">{s.value}</dd>
                </div>
              ))
            ) : (
              <div className="flex items-baseline justify-between gap-4 border-b pb-3">
                <dt className="text-ink-faint">Model</dt>
                <dd className="text-right text-ink-faint">seçilmedi</dd>
              </div>
            )}
          </dl>

          <div className="mt-5 flex items-center justify-between gap-4">
            <label htmlFor="adet" className="text-sm text-ink-faint">
              Adet
            </label>
            <input
              id="adet"
              type="number"
              min={1}
              max={999}
              value={adet}
              onChange={(e) =>
                setAdet(Math.min(999, Math.max(1, Number(e.target.value) || 1)))
              }
              className="tabular w-20 rounded-[2px] border bg-transparent px-3 py-1.5 text-right"
            />
          </div>

          <button type="button" onClick={teklifAc} className="btn btn-primary mt-7 w-full">
            {secili ? "Teklif iste" : "Önce model seçin"}
          </button>

          <p className="mt-3 text-xs text-ink-faint">
            Teklif e-posta ve WhatsApp ile ulaşır. Fiyat bağlayıcı değildir.
          </p>
        </div>
      </aside>

      <QuoteDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        product={product}
        selections={secimler}
      />
    </div>
  );
}
