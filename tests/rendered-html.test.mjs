import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the 王XX achievement home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /王XX 成就 get!/);
  assert.match(html, /顺利抵达北京/);
  assert.match(html, /打开专属收藏夹/);
  assert.match(html, /王XX专属收藏夹｜茄茄与玄玄/);
});

test("keeps navigation, timed letter, and GitHub Pages output wired", async () => {
  const [page, staticHtml] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../docs/index.html", import.meta.url), "utf8"),
  ]);

  assert.match(page, /"2026-08-15T17:21:00\+08:00"/);
  assert.match(page, /秦皇岛旅行盲盒/);
  assert.match(page, /王XX专属天气预报/);
  assert.match(page, /回到最初的故事/);
  assert.match(staticHtml, /王XX专属收藏夹/);
  assert.match(staticHtml, /\/wangxixuan\/assets\/index-[^"']+\.js/);
  assert.match(staticHtml, /\/wangxixuan\/assets\/index-[^"']+\.css/);
});
