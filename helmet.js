/**
 * Max Verstappen 2024 Imola / Schuberth SF3 ABP.
 * The artist's public Sketchfab embed preserves the actual mapped sponsor artwork.
 * The model is streamed from its creator; no mesh or texture is copied/relicensed.
 */
export const HELMET_MODEL = {
  id: "f7b576c4294441478b3ffe3900360de1",
  page: "https://sketchfab.com/3d-models/max-verstappen-2024-helmet-f1-world-champion-f7b576c4294441478b3ffe3900360de1",
  embed:
    "https://sketchfab.com/models/f7b576c4294441478b3ffe3900360de1/embed?autostart=1&dnt=1&ui_infos=0&ui_inspector=0&ui_theme=dark",
  author: "bad_bovy",
};

let viewerScript;
function loadViewerAPI() {
  if (window.Sketchfab) return Promise.resolve(window.Sketchfab);
  viewerScript ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js";
    script.onload = () => resolve(window.Sketchfab);
    script.onerror = () => {
      script.remove();
      viewerScript = undefined;
      reject(new Error("Viewer API unavailable"));
    };
    document.head.append(script);
  });
  return viewerScript;
}

export function createHelmetStudio(container) {
  const mount = container.querySelector(".helmet-model-mount");
  const status = container.querySelector("#studio-status");
  const preview = container.querySelector(".studio-reference");
  let frame = null;
  let active = false;
  let referenceOnly = false;
  let loadingTimer;
  let generation = 0;
  const fallback = container
    .closest("dialog")
    .querySelector(".helmet-viewer-fallback");

  function unload() {
    generation++;
    clearTimeout(loadingTimer);
    frame?.remove();
    frame = null;
    container.classList.remove("model-active");
    fallback.hidden = true;
  }

  function render() {
    const showModel = active && !referenceOnly;
    preview.hidden = false;
    mount.hidden = !showModel;
    if (!showModel) {
      unload();
      status.textContent = "2024 IMOLA / CREATOR’S MODEL PREVIEW";
      return;
    }
    if (frame) return;
    status.textContent = "LOADING THE 2024 IMOLA HELMET…";
    frame = document.createElement("iframe");
    frame.title =
      "Max Verstappen 2024 Imola helmet — interactive 3D by bad_bovy on Sketchfab";
    frame.allow = "autoplay; fullscreen";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    mount.append(frame);
    const current = ++generation;
    const unavailable = () => {
      if (current !== generation) return;
      fallback.hidden = false;
      status.textContent = "2024 IMOLA / MODEL PREVIEW";
    };
    loadingTimer = setTimeout(unavailable, 15000);
    loadViewerAPI()
      .then((Sketchfab) => {
        if (current !== generation) return;
        new Sketchfab("1.12.1", frame).init(HELMET_MODEL.id, {
          autostart: 1,
          dnt: 1,
          ui_infos: 0,
          ui_inspector: 0,
          ui_theme: "dark",
          success(api) {
            if (current !== generation) return;
            api.addEventListener("viewerready", () => {
              if (current !== generation) return;
              clearTimeout(loadingTimer);
              fallback.hidden = true;
              container.classList.add("model-active");
              status.textContent = "DRAG TO ROTATE · SCROLL OR PINCH TO ZOOM";
            });
            api.start();
          },
          error: unavailable,
        });
      })
      .catch(unavailable);
  }

  return {
    resume() {
      active = true;
      render();
    },
    pause() {
      active = false;
      unload();
    },
    setReference(value) {
      referenceOnly = value;
      render();
    },
    reset() {
      referenceOnly = false;
      unload();
      render();
    },
    dispose() {
      active = false;
      unload();
    },
  };
}
