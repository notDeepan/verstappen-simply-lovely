/** Media policy is shared by every background film; no autoplay soundtrack. */
export function canPlay({ paused, hidden, modal, visible, failed }) {
  return !paused && !hidden && !modal && visible && !failed;
}
export function createMediaController(onMotionChange) {
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const videos = [...document.querySelectorAll("[data-ambient]")];
  const visible = new Map(videos.map((v) => [v, false]));
  const failed = new Set();
  const events = new AbortController();
  let paused = preference.matches;
  try {
    paused ||= sessionStorage.getItem("motion") === "off";
  } catch {}
  const sync = () => {
    document.documentElement.dataset.motion = paused ? "off" : "on";
    for (const video of videos) {
      const allowed = canPlay({
        paused,
        hidden: document.hidden,
        modal: !!document.querySelector("dialog[open]"),
        visible: visible.get(video),
        failed: failed.has(video),
      });
      if (allowed) {
        if (!video.getAttribute("src")) {
          video.src = video.dataset.src;
          video.load();
        }
        video.play().catch(() => {
          /* Browser may require a gesture. Keep the poster. */
        });
      } else video.pause();
    }
    document.querySelectorAll("[data-motion-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(paused));
      button.setAttribute(
        "aria-label",
        paused
          ? "Enable motion and background video"
          : "Pause motion and background video",
      );
      button.innerHTML = paused
        ? 'Motion off <span aria-hidden="true">▷</span>'
        : 'Motion on <span aria-hidden="true">Ⅱ</span>';
    });
  };
  const setPaused = (value) => {
    paused = value;
    sync();
    onMotionChange(paused);
  };
  videos.forEach((video) => {
    video.muted = true;
    video.addEventListener(
      "error",
      () => {
        failed.add(video);
        video.removeAttribute("src");
        video.load();
      },
      { signal: events.signal },
    );
    video.addEventListener(
      "playing",
      () => (video.dataset.playback = "playing"),
      { signal: events.signal },
    );
    video.addEventListener("pause", () => (video.dataset.playback = "paused"), {
      signal: events.signal,
    });
  });
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) =>
        visible.set(
          entry.target,
          entry.isIntersecting && entry.intersectionRatio > 0.08,
        ),
      );
      sync();
    },
    { threshold: [0, 0.08, 0.25] },
  );
  videos.forEach((v) => observer.observe(v));
  document.querySelectorAll("[data-motion-toggle]").forEach((button) =>
    button.addEventListener(
      "click",
      () => {
        setPaused(!paused);
        try {
          sessionStorage.setItem("motion", paused ? "off" : "on");
        } catch {}
      },
      { signal: events.signal },
    ),
  );
  preference.addEventListener("change", (event) => setPaused(event.matches), {
    signal: events.signal,
  });
  document.addEventListener("visibilitychange", sync, {
    signal: events.signal,
  });
  sync();
  return {
    sync,
    get paused() {
      return paused;
    },
    dispose() {
      events.abort();
      observer.disconnect();
      videos.forEach((v) => v.pause());
    },
  };
}
