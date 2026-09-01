import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const scriptPath = path.resolve("scripts/process-photography.mjs");

async function createSourceGroup(root, capturedOn = "2026-08-24") {
  const input = path.join(root, "source");
  const group = path.join(input, "group-one");
  await mkdir(group, { recursive: true });
  await writeFile(
    path.join(group, "group.json"),
    `${JSON.stringify({
      id: "review-fixture",
      capturedOn,
      title: "Review fixture",
      location: "Local test",
      photos: [{ file: "source.jpg", alt: "测试图片" }],
    })}\n`,
  );
  await sharp({
    create: {
      width: 48,
      height: 32,
      channels: 3,
      background: "#7e2736",
    },
  }).jpeg().toFile(path.join(group, "source.jpg"));
  return input;
}

async function createExistingPublication(root) {
  const output = path.join(root, "published-images");
  const data = path.join(root, "archive.json");
  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, "keep.txt"), "old images");
  await writeFile(data, "old index");
  return { output, data };
}

test("photography processor publishes matching image and index generations", async (context) => {
  const root = await mkdtemp(path.join(tmpdir(), "reflex4-photos-success-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  const input = await createSourceGroup(root);
  const { output, data } = await createExistingPublication(root);

  await execFileAsync(process.execPath, [
    scriptPath,
    "--input", input,
    "--output", output,
    "--data", data,
  ]);

  const archive = JSON.parse(await readFile(data, "utf8"));
  assert.equal(archive[0].id, "review-fixture");
  await access(path.join(output, "review-fixture", "thumbnail", "01.jpg"));
  await access(path.join(output, "review-fixture", "original", "01.jpg"));
  await assert.rejects(access(path.join(output, "keep.txt")));
});

test("photography processor restores old images when index installation fails", async (context) => {
  const root = await mkdtemp(path.join(tmpdir(), "reflex4-photos-rollback-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  const input = await createSourceGroup(root);
  const { output } = await createExistingPublication(root);
  const dataDirectory = path.join(root, "index-is-a-directory");
  await mkdir(dataDirectory);

  await assert.rejects(execFileAsync(process.execPath, [
    scriptPath,
    "--input", input,
    "--output", output,
    "--data", dataDirectory,
  ]));

  assert.equal(await readFile(path.join(output, "keep.txt"), "utf8"), "old images");
  await assert.rejects(access(path.join(output, "review-fixture")));
});

test("photography processor rejects invalid calendar dates before publishing", async (context) => {
  const root = await mkdtemp(path.join(tmpdir(), "reflex4-photos-date-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  const input = await createSourceGroup(root, "2026-02-30");
  const { output, data } = await createExistingPublication(root);

  await assert.rejects(
    execFileAsync(process.execPath, [
      scriptPath,
      "--input", input,
      "--output", output,
      "--data", data,
    ]),
    /capturedOn 不是有效日期/,
  );

  assert.equal(await readFile(path.join(output, "keep.txt"), "utf8"), "old images");
  assert.equal(await readFile(data, "utf8"), "old index");
});
