import { run, download, first } from "./replicate.mjs";

const PROMPT = `Ultra sharp cinematic industrial product photography, pure black infinite void background.
Seven heavy-duty industrial ventilation fans float weightlessly through deep dark space at clearly different depths:
a large steel scroll centrifugal blower with a spiral volute housing turned three-quarters toward camera,
a round axial duct fan with cast aluminium aerofoil blades seen almost head-on,
a mushroom-domed roof extractor fan tilted on its side, a long cylindrical inline duct fan receding into the dark,
a boxy cabinet fan unit with a bolted access panel, a bare double-inlet drum impeller with many narrow blades,
and a small high-pressure blower far in the background.

Materials: brushed stainless steel, galvanised sheet metal, dark graphite powder coating, machined bolts,
welded flanges, fine surface grain and micro-scratches visible, precision engineering, crisp mechanical detail.

Lighting: hard deep crimson red rim light raking from the left edge and a second red kicker from below,
cool white key light from upper right, strong specular highlights tracing every metal edge,
thin volumetric haze catching the red light, deep falloff into pure black.

Composition: products spread across the whole frame with generous negative space between them,
strong sense of three-dimensional depth, the nearest fan large and razor sharp, the farthest small and softly defocused.
Shot on 85mm at f4, extremely high detail, 8k quality, tack sharp focus on the foreground fan.

No text, no logos, no watermark, no people, no floor, no ground plane, no ground shadow, no walls.`;

const jobs = [
  {
    name: "hero2-frame-nano",
    model: "google/nano-banana",
    input: { prompt: PROMPT, aspect_ratio: "16:9", output_format: "png" },
  },
  {
    name: "hero2-frame-flux",
    model: "black-forest-labs/flux-1.1-pro",
    input: {
      prompt: PROMPT,
      aspect_ratio: "16:9",
      output_format: "png",
      safety_tolerance: 5,
      prompt_upsampling: false,
    },
  },
];

const results = await Promise.allSettled(
  jobs.map(async (j) => {
    const out = await run(j.model, j.input, { label: j.name });
    await download(first(out), `tools/.cache/hero/${j.name}.png`);
    return j.name;
  })
);

results.forEach((r, i) =>
  console.log(r.status === "fulfilled" ? `OK   ${r.value}` : `HATA ${jobs[i].name}: ${r.reason.message}`)
);
