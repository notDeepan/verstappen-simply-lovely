# Max Verstappen — Simply Lovely

An independent cinematic fan redesign. Static HTML, CSS and JavaScript; no install or build step required. The original prototype is preserved in `original/` and the original source ZIP remains one directory above this project.

Live website: https://notdeepan.github.io/verstappen-simply-lovely/

Repository: https://github.com/notDeepan/verstappen-simply-lovely

## Preview

Serve this directory over HTTP (ES modules cannot run by double-clicking index.html):

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080. If Python is unavailable, use any static HTTP server. The workspace currently has a local preview on port 8080.

## Make it yours

| File | What to edit |
| --- | --- |
| `index.html` | Story, dated milestones, imagery, chapter links, accessibility labels and metadata |
| `styles.css` | Colors in `:root`, typography, section layouts, responsive breakpoints |
| `app.js` | Dialogs, year tabs, archive filtering, video playback and GSAP choreography |
| `helmet.js` | On-demand Sketchfab embed for bad_bovy’s detailed 2024 Imola Schuberth SF3 ABP helmet |
| `media/generated/` | Retired GPT Image portrait and helmet concept masters; neither is displayed on the active page |
| `media/` | Supplied fan-film footage and photographs |
| `fonts/`, `vendor/`, `licenses/` | Self-hosted fonts, pinned libraries and notices |

The design progresses from a silent looping racing film with the SIMPLY LOVELY headline through the driver, four career chapters, a film interlude, helmet lab, photo archive and official destinations. Desktop and mobile have separately composed image crops and layouts.

## Interactions

- Four year tabs: click or use arrow keys, Home and End.
- Gallery: filter by mood; open photos and navigate with arrows; Escape closes.
- Films: native playback controls; close or hide the page to pause.
- Hero and ambient footage: silent autoplay, loop and inline mobile playback; pause offscreen, when the page is hidden, or while a dialog is open. Small pause controls remain available. The hero has no Watch the film button.
- Helmet studio: drag to rotate, scroll/pinch to zoom, and use the hosted viewer’s native controls. Switch to Reference image for a still view; Reset view reloads the initial camera. Invented liveries and artificial shell separation were removed.
- All overlays use native dialogs with focus return and Escape handling.
- OS reduced-motion preference disables scroll choreography and automatic motion; visitors can explicitly request playback.

The helmet viewer is created only after opening the studio and removed on dialog close or page exit, releasing the embedded renderer. The matching preview remains visible until the Viewer API confirms the 3D scene is ready. After 15 seconds without readiness, a direct interactive-view link appears. The Reference image option is always available. The model is streamed from Sketchfab, with its do-not-track option enabled. It requires internet access and is not included as an editable GLB. Its appearance and hosting remain controlled by the creator. The preview depicts the same model. This is an artist reconstruction, not manufacturer-certified geometry.

## Assets and dependencies

See `ASSET-NOTES.md` for image generation briefs and provenance, and `licenses/THIRD-PARTY.md` for library notices. The page’s fonts and first-party application scripts are local. The Sketchfab Viewer API 1.12.1 loads from its official host only when the studio opens. The helmet preview and interactive viewer use external Sketchfab hosting. There are no first-party analytics, account forms, external font requests or build dependencies.

Historical figures are deliberately dated: titles in 2021–2024 and season records in 2023. The four chapter links lead to Formula 1 reporting. Supplied racing imagery illustrates atmosphere and is not asserted to show the exact races described. Existing footage is reused; no new AI video or soundtrack was generated. The supplied media's original rights and credits were not independently established.

## Verification

JavaScript syntax checks: `npm run check` (or `node --check app.js` and `node --check helmet.js`). Local assets and anchor targets were checked for existence. Browser checks covered desktop and narrow mobile layouts, year navigation, gallery filtering/lightbox, film controls, menu navigation, and the previous procedural helmet controls. For the replacement branded model, in-page rendering could not be verified in the in-app browser; the preview, fallback and standalone 3D view were checked. `QA-NOTES.md` records scope and limitations. Performance targets are design targets; no field Core Web Vitals or award evaluation has been performed.

## Packaging and hosting

`verstappen-simply-lovely.zip` in the workspace root contains the working site and documentation, excluding the original backup and full-resolution PNG masters. It can be served by any static host with no build command. The canonical URL and social preview URL target GitHub Pages. GitHub Pages publishes the repository root from `main`: https://notdeepan.github.io/verstappen-simply-lovely/. Push commits to `main` to update the live site.

The research, creative brief and Graphify outputs are retained in the workspace root as `ART-DIRECTION.md` and `graphify-out/`. The graph maps the original prototype and references before the redesign.

## Helmet fidelity correction

The active helmet is now [bad_bovy’s 2024 Imola model](https://sketchfab.com/3d-models/max-verstappen-2024-helmet-f1-world-champion-f7b576c4294441478b3ffe3900360de1). It includes the mapped Red Bull graphics, Oracle band, Mobil 1, Player 0.0, TAG Heuer, Viaplay, Bybit and other race markings. The publisher identifies it as a Schuberth SF3 ABP. Creator attribution is visible beneath the section and inside the viewer. See `HELMET-SOURCE.md`.

The prior approximation is retained under `original/helmet-concept-v1/` solely as a development backup and is no longer imported. Legacy Three.js vendor files remain for that backup; they are not requested by the active site.

## Driver spread and transition

The opening now flows through a level navy text loop into a compact driver spread. Two equal, viewport-filling text groups prevent gaps at wide widths. The driver section has a capped content width, balanced portrait height and career records beneath its copy; it stacks on mobile. The broader scrolling treatment is unchanged pending the next design pass.
