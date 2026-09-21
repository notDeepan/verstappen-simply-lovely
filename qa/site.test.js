import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import { canPlay } from "../modules/media.js";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
test("motion policy never plays offscreen, hidden, paused, failed or dialog-obscured media", () => {
  const ready = {
    paused: false,
    hidden: false,
    modal: false,
    visible: true,
    failed: false,
  };
  assert.equal(canPlay(ready), true);
  for (const key of ["paused", "hidden", "modal", "failed"])
    assert.equal(canPlay({ ...ready, [key]: true }), false, key);
  assert.equal(canPlay({ ...ready, visible: false }), false);
});
test("all internal destinations resolve to unique content IDs", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(ids.includes(target), target);
});
test("local sources, posters, fonts and scripts exist", () => {
  for (const [, path] of html.matchAll(
    /(?:src|poster|data-src|href)="((?:media|fonts|vendor|modules)\/[^"#]+)"/g,
  ))
    assert.ok(existsSync(new URL("../" + path, import.meta.url)), path);
});
test("every photograph declares alternative text and intrinsic dimensions", () => {
  for (const [image] of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(image, /\balt="/);
    assert.match(image, /\bwidth="\d+"/);
    assert.match(image, /\bheight="\d+"/);
  }
});
test("all background films remain muted, looping, inline, and deferred", () => {
  for (const [video] of html.matchAll(/<video\b[^>]*data-ambient[^>]*>/g)) {
    for (const attr of [
      "muted",
      "loop",
      "playsinline",
      'preload="none"',
      "data-src=",
    ])
      assert.ok(video.includes(attr), attr);
    assert.ok(!video.includes(" autoplay"));
  }
  assert.ok(!html.includes("<iframe"));
});
test("historical sources, independent status and creator attribution remain visible", () => {
  assert.equal([...html.matchAll(/class="moment"/g)].length, 4);
  assert.ok(html.includes("2021 — 2024"));
  assert.ok(html.includes("Independent fan concept."));
  assert.ok(html.includes("sketchfab.com/bad_bovy"));
  assert.ok(html.includes("creativecommons.org/licenses/by-sa/4.0/"));
  assert.ok(html.includes("verstappen-stuns-with-maiden-win-in-spain"));
});
test("first-party scripts remain below 50 KB; complete JS including GSAP below 250 KB", () => {
  const size = (path) => statSync(new URL("../" + path, import.meta.url)).size;
  const application = [
    "app.js",
    "helmet.js",
    "modules/media.js",
    "modules/story.js",
    "modules/gallery.js",
  ].reduce((n, p) => n + size(p), 0);
  assert.ok(application < 50000, application);
  assert.ok(
    application +
      size("vendor/gsap.min.js") +
      size("vendor/ScrollTrigger.min.js") <
      250000,
  );
});
