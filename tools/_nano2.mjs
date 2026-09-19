import { run, download, first } from "./replicate.mjs";

const BASE = `Ultra sharp cinematic industrial product photography, pure black infinite void background, full bleed frame edge to edge.
Seven heavy-duty industrial ventilation fans drift weightlessly in zero gravity through deep dark space at clearly different depths:
a large steel scroll centrifugal blower with a spiral volute turned three-quarters to camera in the foreground,
a round axial duct fan with cast aluminium aerofoil blades nearly head-on,
a mushroom-domed roof extractor tumbling on its side, a long cylindrical inline duct fan receding into darkness,
a boxy cabinet fan unit with a bolted access panel, a bare double-inlet drum impeller with many narrow blades,
and a small high-pressure blower far away in the background.

Materials: brushed stainless steel, galvanised sheet metal, dark graphite powder coating, machined bolts, welded flanges,
fine surface grain and micro scratches, precision engineering, razor crisp mechanical detail.

Lighting: hard deep crimson red rim light raking from the left edge, a second red kicker from below,
cool white key from upper right, brilliant specular highlights tracing every metal edge,
thin volumetric red haze, deep falloff into pure black.

Composition: fans spread across the entire frame with generous empty black space between them, powerful three-dimensional depth,
nearest fan large and tack sharp, farthest small and softly defocused. 85mm lens at f4, 8k detail.

The fans are FLOATING FREELY IN MID AIR, completely unsupported.
Absolutely no wires, no cables, no strings, no ropes, no chains, no rods, no hooks, no mounts, no stands, no rigging of any kind.
Nothing touches or hangs the fans. No text, no logos, no watermark, no people, no floor, no ground plane, no ground shadow,
no walls, no letterbox bars, no black borders.`;

const jobs = [
  { name: "hero2-nano-a", input: { prompt: BASE, aspect_ratio: "16:9", output_format: "png" } },
  { name: "hero2-nano-b", input: { prompt: BASE + "\nSlightly wider shot, more empty black space, fans smaller in frame.", aspect_ratio: "16:9", output_format: "png" } },
];

const r = await Promise.allSettled(jobs.map(async (j) => {
  const out = await run("google/nano-banana", j.input, { label: j.name });
  await download(first(out), `tools/.cache/hero/${j.name}.png`);
  return j.name;
}));
r.forEach((x, i) => console.log(x.status === "fulfilled" ? `OK   ${x.value}` : `HATA ${jobs[i].name}: ${x.reason.message}`));
