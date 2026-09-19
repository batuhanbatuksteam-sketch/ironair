// MARK-07 "Hız İzi" — nihai marka işareti, gerçek vektör (SVG).
// recraft-v3-svg $0.08/görsel · 5 deneme = $0.40 (bütçe $0.50)
import { run, download, first } from "./replicate.mjs";
import path from "node:path";

const OUT = path.join(process.cwd(), "tools/.cache/ikon");
const TABAN =
  "Flat vector logo icon on pure white background. Single solid red color #E4141B. " +
  "No text, no letters, no numbers, no human figures, no scene, no background objects. " +
  "Sharp clean vector edges, centered composition, professional corporate brand mark.";

const DENEMELER = [
  { id: "v1-klasik",
    p: `A five-blade industrial fan rotor seen straight from the front, blades curved and swept like a pinwheel, a small solid circle hub with a thin ring around it at the exact center, and three short straight speed-streak lines on the left side and three on the right side to suggest fast spinning. ${TABAN}` },
  { id: "v2-dengeli",
    p: `A six-blade centrifugal fan impeller viewed front-on, evenly spaced backward-curved blades radiating from a small ringed center hub, with four short horizontal motion streak lines trailing on each side. Perfectly symmetric and balanced. ${TABAN}` },
  { id: "v3-sikistirilmis",
    p: `A compact five-blade fan rotor icon, thick bold swept blades forming a tight circular disc, small ring hub at center, and two short thick speed dashes on each side close to the blade tips. Bold heavy weight, minimal negative space. ${TABAN}` },
  { id: "v4-dinamik",
    p: `A five-blade fan rotor tilted with dynamic energy, swept blades trailing into three long tapering speed lines on the left that get progressively shorter, small ringed hub at center. Sense of forward motion and acceleration. ${TABAN}` },
  { id: "v5-cember-icinde",
    p: `A five-blade fan rotor with a small ringed hub at center, enclosed inside a thin perfect circle border, with three short speed streak lines breaking outward through the circle on the right side. Badge style. ${TABAN}` },
];

for (const d of DENEMELER) {
  process.stdout.write(`  ${d.id} ... `);
  const out = await run("recraft-ai/recraft-v3-svg",
    { prompt: d.p, size: "1024x1024", style: "any" }, { label: d.id });
  await download(first(out), path.join(OUT, `${d.id}.svg`));
  console.log("✓");
}
console.log(`\n${DENEMELER.length} vektör üretildi · maliyet $${(DENEMELER.length*0.08).toFixed(2)}`);
