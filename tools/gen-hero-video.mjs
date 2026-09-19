import fs from "node:fs";
import { run, download, first } from "./replicate.mjs";

const START = "tools/.cache/hero/hero2-nano-a.png";
const IMAGE = `data:image/png;base64,${fs.readFileSync(START).toString("base64")}`;

const PROMPT = `The industrial ventilation fans drift weightlessly through an infinite pure black void.
Every fan spins steadily around its own axis — the axial impeller blades rotate, the centrifugal drum turns,
the roof cowl revolves, the bare impeller wheel spins — while each unit also tumbles slowly on its own path
through the darkness, passing at different depths, some drifting toward the camera and some away.
The camera pushes in very slowly and smoothly.
Deep crimson red rim light keeps raking across the brushed steel edges, thin red haze drifts through the void,
sharp specular glints travel along the metal.
One continuous shot, no cuts, no text, background stays pure black, nothing supports the fans.`;

const NEG =
  "wires, cables, strings, ropes, chains, rigging, floor, ground, walls, text, watermark, people, cuts, flicker, morphing, distortion";

const jobs = [
  {
    name: "hero2-seedance",
    model: "bytedance/seedance-1-pro",
    input: {
      prompt: PROMPT,
      image: IMAGE,
      duration: 5,
      resolution: "1080p",
      aspect_ratio: "16:9",
      fps: 24,
      camera_fixed: false,
    },
  },
  {
    name: "hero2-kling",
    model: "kwaivgi/kling-v2.5-turbo-pro",
    input: {
      prompt: PROMPT,
      start_image: IMAGE,
      duration: 5,
      aspect_ratio: "16:9",
      negative_prompt: NEG,
    },
  },
];

for (const j of jobs) {
  try {
    const out = await run(j.model, j.input, { label: j.name });
    await download(first(out), `tools/.cache/hero/${j.name}.mp4`);
    console.log(`OK   ${j.name}.mp4`);
  } catch (e) {
    console.log(`HATA ${j.name}: ${e.message}`);
  }
}
