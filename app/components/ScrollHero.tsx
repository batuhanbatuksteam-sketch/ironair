"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_COUNT = 121;
/**
 * Sahnenin kaç ekran boyu sürdüğü. 180 = bir ekran yapışkan sahne + 80vh
 * kaydırma yolu; dizi tek hamlede akıp geçer.
 */
const TRACK_VH = 180;

/**
 * Ekran genişliği ve piksel yoğunluğuna göre kare setleri, en iyisinden en
 * güvenlisine. İlk kare yüklenemezse sıradaki sete düşülür — bir set eksik
 * yayınlanmışsa sahne boş kalmaz.
 */
function frameDirs() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const need = window.innerWidth * dpr;
  const hepsi = ["f2560", "f1440", "f768"];
  if (need >= 2200) return hepsi;
  if (need >= 1100) return hepsi.slice(1);
  return hepsi.slice(2);
}

const framePath = (i: number, dir: string) =>
  `/hero/${dir}/${String(i + 1).padStart(4, "0")}.webp`;

/**
 * Kare dizisini canvas'a çizen kaydırma sahnesi.
 *
 * Kare, videonun `currentTime`'ı yerine sayfa konumundan hesaplanır: aşağı
 * kaydırmak diziyi ileri, yukarı kaydırmak geri sarar. Son kareye gelindiğinde
 * yapışkan sahne serbest kalır ve sayfa normal akışına devam eder.
 */
export default function ScrollHero({ productCount }: { productCount: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
  const currentRef = useRef(-1);
  const rafRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  /* Hareket kısıtı açıkken dizi oynatılmaz; o zaman uzun kaydırma yolu da
     gereksiz — sahne tek ekrana iner. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /** Yüklenmiş en yakın kareyi bulur — dizi tam dolmadan da akıcı kalır. */
  const nearestLoaded = useCallback((want: number) => {
    const frames = framesRef.current;
    if (frames[want]) return want;
    for (let d = 1; d < FRAME_COUNT; d++) {
      if (frames[want - d]) return want - d;
      if (frames[want + d]) return want + d;
    }
    return -1;
  }, []);

  const draw = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      const img = framesRef.current[index];
      if (!canvas || !img) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      // object-fit: cover
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    },
    []
  );

  /* Kareleri kabadan inceye yükle: önce ilk kare, sonra her 8'incisi, sonra kalanlar. */
  useEffect(() => {
    const adaylar = frameDirs();
    let cancelled = false;
    let done = 0;

    const order: number[] = [0];
    for (let i = 8; i < FRAME_COUNT; i += 8) order.push(i);
    for (let i = 0; i < FRAME_COUNT; i++) if (!order.includes(i)) order.push(i);

    const loadOne = (i: number, dir: string) =>
      new Promise<boolean>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (cancelled) return resolve(true);
          framesRef.current[i] = img;
          done++;
          setLoaded(done);
          if (i === 0) {
            setReady(true);
            draw(0);
            currentRef.current = 0;
          }
          resolve(true);
        };
        img.onerror = () => resolve(false);
        img.src = framePath(i, dir);
      });

    (async () => {
      // İlk kareyi en iyi setten dene; yoksa sırayla daha küçük sete düş.
      let dir = adaylar[adaylar.length - 1];
      let acildi = false;
      for (const aday of adaylar) {
        if (await loadOne(0, aday)) {
          dir = aday;
          acildi = true;
          break;
        }
      }
      // Hiçbir set yüklenemediyse sahneyi yine de aç — kapak ekranı sayfayı
      // kilitlemesin, başlık ve düğmeler görünür kalsın.
      if (!acildi && !cancelled) setReady(true);

      const rest = order.slice(1);
      const CONCURRENCY = 6;
      await Promise.all(
        Array.from({ length: CONCURRENCY }, async () => {
          while (rest.length && !cancelled) {
            const next = rest.shift();
            if (next !== undefined) await loadOne(next, dir);
          }
        })
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [draw]);

  /* Kaydırma konumunu kareye çevir. */
  useEffect(() => {
    const update = () => {
      rafRef.current = 0;
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const scrollable = track.offsetHeight - window.innerHeight;
      const p = scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0;
      setProgress(p);

      const want = Math.round(p * (FRAME_COUNT - 1));
      if (want === currentRef.current) return;
      const use = reduced ? 0 : nearestLoaded(want);
      if (use >= 0) {
        draw(use);
        currentRef.current = want;
      }
    };

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw, nearestLoaded, reduced]);

  /* Başlık, sahnenin ilk yarısında okunur; sonra ürünlere yer bırakır. */
  const copyOpacity = Math.max(0, 1 - progress / 0.45);
  const copyShift = progress * -70;

  return (
    <div ref={trackRef} style={{ height: reduced ? "100vh" : `${TRACK_VH}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-stage">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        {/* Başlığın okunabilirliği için alt taraftan siyaha iniş */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 52%, rgba(0,0,0,.82) 100%)",
          }}
        />

        <div
          className="absolute inset-x-0 bottom-0 px-6 pb-16 sm:px-10 lg:px-14"
          style={{
            opacity: copyOpacity,
            transform: `translate3d(0, ${copyShift}px, 0)`,
            willChange: "opacity, transform",
          }}
        >
          <div className="mx-auto w-full max-w-[1400px]">
            <h1 className="display max-w-[19ch] text-white">
              Ağır sanayi için fan üretiyoruz
            </h1>
            <p className="prose-measure mt-6 text-[1.05rem] text-white/72">
              Aksiyelden radyale, çatı fanından ısı geri kazanımına {productCount} ürün
              ailesi. Ölçünüzü seçin, teklifinizi aynı gün alın.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#katalog" className="btn btn-primary">
                Kataloğu aç
              </a>
              <a
                href="#iletisim"
                className="btn"
                style={{
                  border: "1px solid rgba(255,255,255,.34)",
                  color: "#fff",
                }}
              >
                Teklif iste
              </a>
            </div>
          </div>
        </div>

        {/* Sahne göstergesi: dolan çizgi kaç kareye gelindiğini ölçer. */}
        {!reduced && (
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/12">
            <div
              className="h-full bg-red transition-none"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}

        {!ready && (
          <div className="absolute inset-0 grid place-items-center bg-black">
            <span className="tabular text-xs text-white/45">
              {Math.round((loaded / FRAME_COUNT) * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
