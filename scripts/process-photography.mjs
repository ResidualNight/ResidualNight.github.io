import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";
import exifr from "exifr";

const DEFAULTS = {
  input: "photography-source",
  output: "public/photography",
  data: "app/photography/archive.generated.json",
};

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg"]);
const TONES = ["forest", "rust", "wine"];

function parseArguments(argv) {
  const options = { ...DEFAULTS };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (!["--input", "--output", "--data"].includes(flag)) {
      throw new Error(`未知参数：${flag}`);
    }
    const value = argv[index + 1];
    if (!value) throw new Error(`${flag} 缺少路径`);
    options[flag.slice(2)] = value;
    index += 1;
  }
  return Object.fromEntries(
    Object.entries(options).map(([key, value]) => [key, path.resolve(value)]),
  );
}

function assertSafeGroupId(id, folderName) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    throw new Error(
      `${folderName}/group.json 的 id 必须只包含小写字母、数字和连字符`,
    );
  }
}

function assertDate(value, folderName) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${folderName}/group.json 的 capturedOn 必须是 YYYY-MM-DD`);
  }
}

function formatCamera(exif) {
  const parts = [exif?.Make, exif?.Model]
    .filter(Boolean)
    .map((value) => String(value).trim());
  return [...new Set(parts)].join(" ") || null;
}

function formatAperture(value) {
  const number = Number(value);
  return Number.isFinite(number) ? `f/${Number(number.toFixed(1))}` : null;
}

function formatShutter(value) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  if (seconds < 1) return `1/${Math.round(1 / seconds)} s`;
  return `${Number(seconds.toFixed(2))} s`;
}

function formatNumber(value, suffix = "") {
  const number = Number(value);
  return Number.isFinite(number) ? `${Number(number.toFixed(1))}${suffix}` : null;
}

function photoFormat(width, height) {
  const ratio = width / height;
  if (ratio > 1.12) return "landscape";
  if (ratio < 0.89) return "portrait";
  return "square";
}

async function readExif(source) {
  try {
    return await exifr.parse(source, {
      pick: [
        "Make",
        "Model",
        "LensModel",
        "Lens",
        "FNumber",
        "ExposureTime",
        "ISO",
        "FocalLength",
      ],
    });
  } catch (error) {
    console.warn(`  EXIF 无法读取：${path.basename(source)} (${error.message})`);
    return null;
  }
}

async function encodeWithinLimit(source, settings) {
  let edge = settings.maxEdge;
  let quality = settings.quality;
  let result;

  for (let attempt = 0; attempt < 18; attempt += 1) {
    result = await sharp(source)
      .rotate()
      .resize({
        width: edge,
        height: edge,
        fit: "inside",
        withoutEnlargement: true,
      })
      .toColorspace("srgb")
      .jpeg({
        quality,
        mozjpeg: true,
        chromaSubsampling: "4:4:4",
      })
      .toBuffer({ resolveWithObject: true });

    if (result.data.length <= settings.maxBytes) return result;

    if (quality > settings.minimumQuality) {
      quality -= 5;
    } else {
      edge = Math.max(900, Math.round(edge * 0.88));
      quality = settings.quality;
    }
  }

  throw new Error(
    `${path.basename(source)} 无法压到 ${Math.round(settings.maxBytes / 1024)} KiB 以内`,
  );
}

async function processVariant(source, destination, settings) {
  const result = await encodeWithinLimit(source, settings);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, result.data);
  return result;
}

async function loadGroup(folderPath, folderName) {
  const configPath = path.join(folderPath, "group.json");
  let config;
  try {
    config = JSON.parse(await readFile(configPath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`${folderName} 缺少 group.json`);
    }
    throw new Error(`${folderName}/group.json 不是有效 JSON：${error.message}`);
  }

  const required = ["id", "capturedOn", "title", "location"];
  for (const field of required) {
    if (typeof config[field] !== "string" || !config[field].trim()) {
      throw new Error(`${folderName}/group.json 缺少字符串字段 ${field}`);
    }
  }
  assertSafeGroupId(config.id, folderName);
  assertDate(config.capturedOn, folderName);

  const files = (await readdir(folderPath))
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));

  const photoConfigs = Array.isArray(config.photos)
    ? config.photos
    : files.map((file) => ({ file }));

  if (photoConfigs.length === 0) {
    throw new Error(`${folderName} 中没有 JPG 图片`);
  }

  for (const photo of photoConfigs) {
    if (!photo || typeof photo.file !== "string") {
      throw new Error(`${folderName}/group.json 的 photos 项必须包含 file`);
    }
    if (!files.includes(photo.file)) {
      throw new Error(`${folderName} 中找不到 ${photo.file}`);
    }
  }

  return { config, photoConfigs };
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const inputInfo = await stat(options.input).catch(() => null);
  if (!inputInfo?.isDirectory()) {
    throw new Error(`源目录不存在：${options.input}`);
  }

  const folders = (await readdir(options.input, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  if (folders.length === 0) throw new Error("源目录中没有照片组文件夹");

  const tempOutput = `${options.output}.tmp-${process.pid}`;
  await rm(tempOutput, { recursive: true, force: true });
  await mkdir(tempOutput, { recursive: true });

  const entries = [];
  let totalInputBytes = 0;
  let totalOutputBytes = 0;

  try {
    for (const folderName of folders) {
      const folderPath = path.join(options.input, folderName);
      const { config, photoConfigs } = await loadGroup(folderPath, folderName);
      const photos = [];
      console.log(`\n${config.capturedOn} · ${config.title}`);

      for (let index = 0; index < photoConfigs.length; index += 1) {
        const photoConfig = photoConfigs[index];
        const source = path.join(folderPath, photoConfig.file);
        const outputName = `${String(index + 1).padStart(2, "0")}.jpg`;
        const thumbnailPath = path.join(tempOutput, config.id, "thumbnail", outputName);
        const originalPath = path.join(tempOutput, config.id, "original", outputName);
        const sourceInfo = await stat(source);
        const exif = await readExif(source);

        const thumbnail = await processVariant(source, thumbnailPath, {
          maxEdge: 1600,
          quality: 78,
          minimumQuality: 58,
          maxBytes: 1024 * 1024,
        });
        const original = await processVariant(source, originalPath, {
          maxEdge: 3840,
          quality: 88,
          minimumQuality: 68,
          maxBytes: 5 * 1024 * 1024,
        });

        totalInputBytes += sourceInfo.size;
        totalOutputBytes += thumbnail.data.length + original.data.length;
        const width = original.info.width;
        const height = original.info.height;

        photos.push({
          id: `${config.id}-photo-${index + 1}`,
          thumbnailSrc: `/photography/${config.id}/thumbnail/${outputName}`,
          originalSrc: `/photography/${config.id}/original/${outputName}`,
          alt:
            typeof photoConfig.alt === "string" && photoConfig.alt.trim()
              ? photoConfig.alt.trim()
              : `${config.title}，第 ${index + 1} 张摄影作品`,
          format: photoFormat(width, height),
          placeholderTone: TONES[index % TONES.length],
          exif: {
            camera: formatCamera(exif),
            lens: exif?.LensModel || exif?.Lens || null,
            aperture: formatAperture(exif?.FNumber),
            shutterSpeed: formatShutter(exif?.ExposureTime),
            iso: formatNumber(exif?.ISO),
            focalLength: formatNumber(exif?.FocalLength, " mm"),
          },
        });

        console.log(
          `  ${photoConfig.file} → ${(thumbnail.data.length / 1024).toFixed(0)} KiB + ${(original.data.length / 1024 / 1024).toFixed(2)} MiB`,
        );
      }

      entries.push({
        id: config.id,
        capturedOn: config.capturedOn,
        title: config.title.trim(),
        location: config.location.trim(),
        photos,
      });
    }

    entries.sort((a, b) => b.capturedOn.localeCompare(a.capturedOn));
    await mkdir(path.dirname(options.data), { recursive: true });
    await writeFile(options.data, `${JSON.stringify(entries, null, 2)}\n`);
    await rm(options.output, { recursive: true, force: true });
    await rename(tempOutput, options.output);
  } catch (error) {
    await rm(tempOutput, { recursive: true, force: true });
    throw error;
  }

  console.log(
    `\n完成：${entries.length} 组，${entries.reduce((sum, entry) => sum + entry.photos.length, 0)} 张。`,
  );
  console.log(`源图合计 ${(totalInputBytes / 1024 / 1024).toFixed(2)} MiB`);
  console.log(`网页图片合计 ${(totalOutputBytes / 1024 / 1024).toFixed(2)} MiB`);
  console.log(`数据：${options.data}`);
  console.log(`图片：${options.output}`);
}

main().catch((error) => {
  console.error(`\n摄影图片处理失败：${error.message}`);
  process.exitCode = 1;
});
