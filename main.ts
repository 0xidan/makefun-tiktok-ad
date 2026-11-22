// Entry program for make.fun bounty bring-the-humans-03,
// "Bring the humans with a TikTok ad".
//
// The entry itself is the TikTok video: an original vertical ad for
// make.fun, posted publicly from the account @idantrn_. This program
// does the one job the kit asks of it — copy VIDEO.json, which names
// the video's full TikTok address, from the repository root into the
// output directory, where the house's gate reads it and matches it
// against its own reading of the video. Nothing written here about
// the video is scored; the score is the video's view count, which the
// house reads from TikTok itself.
//
// Local run, the way the grader runs it:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// On success it prints nothing and leaves out/VIDEO.json in place.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// In the grader's container these are /bot and /output; the
// environment variables stand in for them everywhere else.
const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Check VIDEO.json before copying it: it must be a JSON object whose
// url is a full TikTok video address, https://www.tiktok.com/@<handle>
// /video/<id> — short links (vm.tiktok.com and friends) are refused by
// the house, and a leftover placeholder should fail here, at hand-in
// time, instead of being copied through and refused by the gate.
const videoFile = join(botDir, "VIDEO.json");
let named: unknown;
try {
  named = JSON.parse(readFileSync(videoFile, "utf8"));
} catch (err) {
  console.error(`VIDEO.json does not read as JSON: ${(err as Error).message}`);
  process.exit(1);
}
const url = (named as { url?: unknown } | null)?.url;
if (typeof url !== "string" || !/^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/.test(url)) {
  console.error("VIDEO.json must name the video as {\"url\": \"https://www.tiktok.com/@<handle>/video/<id>\"}");
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(videoFile, join(outputDir, "VIDEO.json"));
