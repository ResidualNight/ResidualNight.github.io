import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Only prepare web assets: preserve image content and remove camera metadata.
// Cropping and tonal presentation belong to the page CSS; originals stay untouched.
const sources = process.argv.slice(2);
if (sources.length !== 3) {
  throw new Error("Pass the desktop, list, and rear photo paths in that order.");
}

const destination = new URL("../public/projects/rss-reader/", import.meta.url);
await mkdir(destination, { recursive: true });
for (const [index, name] of ["desktop", "list", "buttons"].entries()) {
  for (const width of [800, 1600]) {
    const result = await sharp(sources[index])
      .autoOrient()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(fileURLToPath(new URL(`${name}-${width}.webp`, destination)));
    console.log(`${path.basename(sources[index])} → ${name}-${width}.webp: ${result.width}×${result.height}, ${result.size} bytes`);
  }
}
