import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const outRoot = new URL("../out/", import.meta.url);

async function readOutput(path) {
  return readFile(new URL(path, outRoot), "utf8");
}

test("exports the three core pages and a static error page", async () => {
  await Promise.all([
    access(new URL("index.html", outRoot)),
    access(new URL("blog/index.html", outRoot)),
    access(new URL("photography/index.html", outRoot)),
    access(new URL("404.html", outRoot)),
  ]);

  const [home, blog, photography] = await Promise.all([
    readOutput("index.html"),
    readOutput("blog/index.html"),
    readOutput("photography/index.html"),
  ]);

  assert.match(home, /reflex4/);
  assert.match(home, /MacOS 硬盘照片管理软件/);
  assert.match(home, /RSS Reader for M5Papercolor/);
  assert.match(blog, /Writing Archive/);
  assert.match(photography, /Light \/ Time \/ Observation/);
  assert.doesNotMatch(blog, /\/api\/blog\/search/);
});

test("exports every published Markdown article as a directory index", async () => {
  const postFiles = (await readdir(new URL("../app/blog/posts/", import.meta.url)))
    .filter((fileName) => fileName.endsWith(".md"));
  const exportedArticles = (await readdir(new URL("blog/", outRoot), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && entry.name !== "_next")
    .map((entry) => entry.name);

  for (const fileName of postFiles) {
    const source = await readFile(new URL(`../app/blog/posts/${fileName}`, import.meta.url), "utf8");
    const isDraft = /^draft:\s*true\s*$/mu.test(source);
    if (isDraft) continue;

    const slug = fileName.replace(/\.md$/u, "");
    assert.ok(exportedArticles.includes(slug), `missing static article: ${slug}`);
    const html = await readOutput(`blog/${slug}/index.html`);
    assert.match(html, /article-shell/);
  }
});

test("contains browser assets but no deployable server runtime", async () => {
  await access(new URL("_next/static/", outRoot));
  await assert.rejects(access(new URL("server/", outRoot)));
  await assert.rejects(
    access(new URL("motion-lab/index.html", outRoot)),
    undefined,
    "Motion Lab is an internal experiment and must not be published",
  );
  await assert.rejects(access(new URL("og-motion-lab.png", outRoot)));

  const nextConfig = await readFile(new URL("next.config.ts", projectRoot), "utf8");
  assert.match(nextConfig, /output:\s*["']export["']/);
  assert.match(nextConfig, /trailingSlash:\s*true/);
});
