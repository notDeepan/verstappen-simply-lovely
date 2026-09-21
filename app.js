import { createMediaController } from "./modules/media.js?v=20260922";
import {
  createStoryMotion,
  createChapterNavigation,
  createCursor,
} from "./modules/story.js?v=20260922";
import { createGallery } from "./modules/gallery.js?v=20260922";

const $ = (selector) => document.querySelector(selector);
const events = new AbortController();
const story = createStoryMotion();
const navigation = createChapterNavigation();
const media = createMediaController((paused) => {
  story.configure(paused);
  navigation.update();
});
const menu = $("#menu-panel");
const film = $("#film-dialog");
const player = $("#film-player");
const studioDialog = $("#studio-dialog");
let studio, studioPromise;
const focusReturn = new WeakMap();
function navigateToChapter(hash, behavior = "smooth") {
  const target = document.querySelector(hash);
  if (!target) return;
  const heading = target.querySelector(".chapter-heading");
  const pinned = target.classList.contains("is-pinned");
  const top = pinned
    ? target.getBoundingClientRect().top + scrollY
    : heading
      ? heading.getBoundingClientRect().top + scrollY - 105
      : target.getBoundingClientRect().top + scrollY;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: media.paused ? "instant" : behavior,
  });
}
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  if (link.closest(".year-nav") || link.classList.contains("skip-link")) return;
  link.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      history.pushState(null, "", link.hash);
      navigateToChapter(link.hash);
    },
    { signal: events.signal },
  );
});
window.addEventListener(
  "popstate",
  () => {
    if (!location.hash.startsWith("#moment-"))
      navigateToChapter(location.hash || "#top", "instant");
  },
  { signal: events.signal },
);
function openDialog(dialog, returnTo = document.activeElement) {
  focusReturn.set(dialog, returnTo);
  dialog.showModal();
  document.body.classList.add("modal-open");
  media.sync();
}
for (const dialog of document.querySelectorAll("dialog")) {
  dialog
    .querySelector("[data-close]")
    ?.addEventListener("click", () => dialog.close(), {
      signal: events.signal,
    });
  dialog.addEventListener(
    "close",
    () => {
      if (!document.querySelector("dialog[open]"))
        document.body.classList.remove("modal-open");
      if (dialog === film) player.pause();
      if (dialog === studioDialog) studio?.pause();
      if (dialog === menu)
        $(".menu-toggle").setAttribute("aria-expanded", "false");
      media.sync();
      if (!document.querySelector("dialog[open]"))
        focusReturn.get(dialog)?.focus({ preventScroll: true });
    },
    { signal: events.signal },
  );
  dialog.addEventListener(
    "click",
    (event) => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (
        event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom
      )
        dialog.close();
    },
    { signal: events.signal },
  );
}
$(".menu-toggle").addEventListener(
  "click",
  () => {
    openDialog(menu);
    $(".menu-toggle").setAttribute("aria-expanded", "true");
  },
  { signal: events.signal },
);
menu.querySelectorAll('a[href^="#"]').forEach((link) =>
  link.addEventListener(
    "click",
    () => {
      menu.close();
      const section = document.querySelector(link.hash);
      section.setAttribute("tabindex", "-1");
      requestAnimationFrame(() => section.focus({ preventScroll: true }));
    },
    { signal: events.signal },
  ),
);
document.querySelectorAll("[data-credits]").forEach((button) =>
  button.addEventListener(
    "click",
    () => {
      const returnTo = menu.open ? $(".menu-toggle") : button;
      if (menu.open) menu.close();
      openDialog($("#credits-dialog"), returnTo);
    },
    { signal: events.signal },
  ),
);
document.querySelectorAll("[data-film]").forEach((button) =>
  button.addEventListener(
    "click",
    () => {
      player.src = "media/dutchman.mp4";
      player.poster = "media/dutchman-poster.jpg";
      openDialog(film);
      player.play().catch(() => {});
    },
    { signal: events.signal },
  ),
);
document.addEventListener(
  "visibilitychange",
  () => {
    if (document.hidden) {
      player.pause();
      studio?.pause();
    } else if (studioDialog.open) studio?.resume();
  },
  { signal: events.signal },
);
$("#open-studio").addEventListener(
  "click",
  async () => {
    openDialog(studioDialog);
    try {
      studioPromise ??= import("./helmet.js")
        .then(({ createHelmetStudio }) => createHelmetStudio($("#studio-view")))
        .catch((error) => {
          studioPromise = null;
          throw error;
        });
      studio = await studioPromise;
      if (studioDialog.open) studio.resume();
    } catch {
      $("#studio-status").textContent =
        "MODEL PREVIEW / INTERACTIVE VIEW UNAVAILABLE";
      $(".helmet-viewer-fallback").hidden = false;
    }
  },
  { signal: events.signal },
);
function setReference(value) {
  studio?.setReference(value);
  $("#helmet-reference").setAttribute("aria-pressed", String(value));
  $("#helmet-interactive").setAttribute("aria-pressed", String(!value));
}
$("#helmet-reference").addEventListener("click", () => setReference(true), {
  signal: events.signal,
});
$("#helmet-interactive").addEventListener("click", () => setReference(false), {
  signal: events.signal,
});
$("#reset-helmet").addEventListener(
  "click",
  () => {
    studio?.reset();
    setReference(false);
  },
  { signal: events.signal },
);
const disposeGallery = createGallery(openDialog, () => {
  story.refresh();
  navigation.update();
});
const disposeCursor = createCursor();

// Content is never blocked by the loading mark. Cached posters bypass it.
const poster = new Image();
poster.src = "media/hero-poster.jpg";
if (!poster.complete) document.body.classList.add("loading");
const finishLoading = () => document.body.classList.remove("loading");
poster.addEventListener("load", finishLoading, { once: true });
poster.addEventListener("error", finishLoading, { once: true });
const loadingTimeout = setTimeout(finishLoading, 1200);
// Fonts settle before measurements; a timeout also covers font failure.
Promise.race([
  document.fonts.ready,
  new Promise((resolve) => setTimeout(resolve, 1500)),
]).then(() => {
  story.configure(media.paused);
  story.hashNavigate();
  if (location.hash && !location.hash.startsWith("#moment-"))
    navigateToChapter(location.hash, "instant");
  navigation.update();
});
window.addEventListener("load", () => story.refresh(), {
  once: true,
  signal: events.signal,
});
window.addEventListener(
  "pagehide",
  (event) => {
    if (event.persisted) return;
    clearTimeout(loadingTimeout);
    events.abort();
    media.dispose();
    story.dispose();
    navigation.dispose();
    disposeGallery();
    disposeCursor();
    studio?.dispose();
  },
  { once: true },
);
