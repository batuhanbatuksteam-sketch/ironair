"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Kırmızı imleç.
 *
 * Nokta imleci birebir takip eder, halka biraz geriden gelir. İkisinin arasında
 * bir fan çarkı döner: imleç hızlandıkça çark hızlanır, durunca ataletiyle
 * yavaşlayıp durur. Tıklamada ikisi de büyür; bağlantı ve düğmelerin üstünde
 * halka açılır.
 *
 * Yalnız hassas işaretleyicisi olan cihazlarda çalışır — dokunmatikte ve
 * hareket kısıtı açıkken hiç takılmaz, sistem imleci yerinde kalır.
 */
/** Çark: nokta (ø9) ile halkanın (ø34) arasına oturan geriye eğik kanatlar. */
const KANAT_SAYISI = 9;
const R_IC = 6.8;
const R_DIS = 16.2;
/** Kanadın iç yarıçaptan dış yarıçapa kadar süpürdüğü açı — geriye eğim. */
const SUPURME = 40;

function kanatYolu(i: number) {
  const nokta = (r: number, derece: number) => {
    const rad = ((derece - 90) * Math.PI) / 180;
    return [20 + r * Math.cos(rad), 20 + r * Math.sin(rad)] as const;
  };
  const taban = (i * 360) / KANAT_SAYISI;
  const [x1, y1] = nokta(R_IC, taban);
  const [cx, cy] = nokta((R_IC + R_DIS) / 2, taban + SUPURME * 0.35);
  const [x2, y2] = nokta(R_DIS, taban + SUPURME);
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} Q${cx.toFixed(2)} ${cy.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const fanRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setActive(true);
    document.documentElement.classList.add("ozel-imlec");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };
    /* Çark ataleti: bir önceki karedeki imleç konumu, o anki açı ve açısal hız. */
    const onceki = { x: target.x, y: target.y };
    let aci = 0;
    let omega = 0;
    let down = false;
    let over = false;
    let visible = false;
    let raf = 0;

    const tick = () => {
      // Halka noktayı yumuşak takip eder — hareket yönünü okunur kılar.
      ring.x += (target.x - ring.x) * 0.18;
      ring.y += (target.y - ring.y) * 0.18;

      /* Çark, imlecin kare başına aldığı yolla beslenir. Hızlanma ani,
         yavaşlama ağır: el durunca kanat hemen kesilmez, dönerek durur. */
      const kareHizi = Math.hypot(target.x - onceki.x, target.y - onceki.y);
      onceki.x = target.x;
      onceki.y = target.y;

      const hedefOmega = Math.min(kareHizi * 0.85, 24);
      omega += (hedefOmega - omega) * (hedefOmega > omega ? 0.28 : 0.045);
      if (omega < 0.04) omega = 0;
      aci = (aci + omega) % 360;

      if (fanRef.current) {
        fanRef.current.style.transform = `rotate(${aci.toFixed(2)}deg)`;
      }

      const dotScale = down ? 2.1 : 1;
      const ringScale = down ? 1.9 : over ? 1.55 : 1;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const show = () => {
      if (visible) return;
      visible = true;
      dotRef.current?.style.setProperty("opacity", "1");
      ringRef.current?.style.setProperty("opacity", "1");
    };
    const hide = () => {
      visible = false;
      dotRef.current?.style.setProperty("opacity", "0");
      ringRef.current?.style.setProperty("opacity", "0");
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      show();
      over = !!(e.target as Element | null)?.closest?.(
        'a, button, label, select, textarea, input, [role="button"], summary'
      );
    };
    const onDown = () => {
      down = true;
    };
    const onUp = () => {
      down = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      document.documentElement.classList.remove("ozel-imlec");
    };
  }, []);

  if (!active) return null;

  return (
    <>
      <div ref={ringRef} className="imlec-halka" aria-hidden="true">
        <svg ref={fanRef} className="imlec-fan" viewBox="0 0 40 40">
          {Array.from({ length: KANAT_SAYISI }, (_, i) => (
            <path key={i} d={kanatYolu(i)} />
          ))}
        </svg>
      </div>
      <div ref={dotRef} className="imlec-nokta" aria-hidden="true" />
    </>
  );
}
