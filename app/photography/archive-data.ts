import generatedEntries from "./archive.generated.json";

export type PhotoFormat = "landscape" | "portrait" | "square";
export type PlaceholderTone = "forest" | "wine" | "rust";

export interface PhotographyExif {
  camera: string | null;
  lens: string | null;
  aperture: string | null;
  shutterSpeed: string | null;
  iso: string | null;
  focalLength: string | null;
}

export interface PhotographyAsset {
  id: string;
  thumbnailSrc: string | null;
  originalSrc: string | null;
  alt: string;
  format: PhotoFormat;
  placeholderTone: PlaceholderTone;
  exif: PhotographyExif;
}

export interface PhotographyArchiveEntry {
  id: string;
  capturedOn: string;
  title: string;
  location: string;
  photos: PhotographyAsset[];
}

function placeholderSet(
  frame: string,
  formats: PhotoFormat[],
  tones: PlaceholderTone[],
): PhotographyAsset[] {
  return formats.map((format, index) => ({
    id: `${frame}-photo-${index + 1}`,
    thumbnailSrc: null,
    originalSrc: null,
    alt: `摄影作品组 ${frame} 的第 ${index + 1} 张图片占位`,
    format,
    placeholderTone: tones[index % tones.length],
    exif: {
      camera: null,
      lens: null,
      aperture: null,
      shutterSpeed: null,
      iso: null,
      focalLength: null,
    },
  }));
}

const placeholderEntries: PhotographyArchiveEntry[] = [
  ["08", "2026-06-21", ["landscape", "portrait", "square"], ["forest", "rust", "wine"]],
  ["07", "2026-05-04", ["portrait", "landscape", "square"], ["rust", "forest", "wine"]],
  ["06", "2026-02-16", ["square", "landscape", "portrait"], ["wine", "forest", "rust"]],
  ["05", "2025-11-29", ["landscape", "square", "portrait"], ["rust", "wine", "forest"]],
  ["04", "2025-08-12", ["portrait", "square", "landscape"], ["forest", "rust", "wine"]],
  ["03", "2025-03-07", ["landscape", "portrait", "square"], ["wine", "forest", "rust"]],
  ["02", "2024-09-18", ["square", "portrait", "landscape"], ["forest", "wine", "rust"]],
  ["01", "2024-01-03", ["landscape", "square", "portrait"], ["rust", "forest", "wine"]],
].map(([frame, capturedOn, formats, tones]) => ({
  id: `frame-${frame as string}`,
  capturedOn: capturedOn as string,
  title: `光线样本 / ${frame as string}`,
  location: "位置待录入",
  photos: placeholderSet(
    frame as string,
    formats as PhotoFormat[],
    tones as PlaceholderTone[],
  ),
}));

const importedEntries = generatedEntries as PhotographyArchiveEntry[];

export const archiveEntries = importedEntries.length > 0
  ? importedEntries
  : placeholderEntries;
