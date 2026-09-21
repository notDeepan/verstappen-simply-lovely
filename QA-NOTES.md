# Redesign QA — 22 September 2026

## Scope
Complete supplied specification and concept-board comparison, following repository audit in REDESIGN-AUDIT.md. This replaces the earlier light/navy layout with six connected black editorial chapters. Existing sourced records, two fan films, archive and credited helmet model remain.

## Verified
- Syntax checks: app, helmet and all three application modules pass.
- Seven Node checks pass: media gating, unique internal destinations, local assets, image metadata, deferred/muted films, historical attribution, and JavaScript size budgets.
- axe-core: 0 violations, 40 passing checks, across WCAG 2 A/AA, WCAG 2.1 AA and best-practice rules in the instrumented local page. Image/video background contrast requires manual inspection and is reported as incomplete by axe; it is not counted as an automated pass.
- Visually inspected 1440×900, 1920×1080, 2560×1440, 768×1024, 390×844 and 320×740 compositions. The desktop journey pins; tablet/mobile read vertically. Final narrow-width measurements show no document overflow or overflowing headings. Fixed a small hero overflow, oversized KEEP CHASING type, and the mobile helmet image extending beyond its section.
- Desktop hero, driver, all year destinations, machine, mind, helmet, archive and finale inspected. Chapter jumps align headings below the fixed navigation. Four year controls move the horizontal sequence and preserve visible source links.
- Gallery category filtering, arrow-key photo navigation, Escape, and focus return verified. One-photo category remains navigable. Menu opens as a native modal, closes on selection, and transfers focus to the chosen section.
- Motion-off pauses every background film and tears down horizontal pinning; all four years remain readable and chapter navigation works. OS reduced-motion preference follows the same app path and has CSS overrides; OS-level emulation was not available in this browser, so that signal was code-reviewed rather than separately simulated.
- Foreground fan film plays through native controls; closing pauses it. Hero and finale silently autoplay and loop; lower films are not fetched before entering view. Hidden-page and dialog gating also covered by the media-policy test.
- Helmet model loaded successfully in the browser, showing the creator's actual detailed livery. Reference mode removes the iframe; closing restores focus to Explore in 3D and leaves zero iframes. The retained timeout/direct-view fallback covers unavailable third-party delivery. Hosting and WebGL capability remain external dependencies.
- No first-party console errors or broken loaded images in the final local pass.

## Performance observations
Instrumented localhost Chromium session, warm local assets, no throttling: first contentful paint 104 ms, observed LCP 104 ms, CLS 0, DOM ready 115 ms. Approximately 588 KB transferred at the first audit sample; this is a point-in-time sample, not the eventual full film download size. A 212 ms long task occurred in the instrumented session, which also runs axe; these are diagnostic figures, not field Core Web Vitals or a Lighthouse score.

Application JavaScript stays below 50 KB; application plus the local GSAP/ScrollTrigger libraries stays below 250 KB uncompressed. Hero film is approximately 2.83 MB; secondary film approximately 0.51 MB. The new 1920px RB19 JPEG is 312 KB. No WebGL, Sketchfab API or model is loaded on first paint. Fonts and critical poster are local; only display font and hero poster are preloaded.

## Remaining practical limits
Real-device Safari/iOS, Android low-power modes, throttled mobile network and field INP have not been measured. Browser viewport tests are not a substitute for those devices. Fan-film stills are intentionally atmospheric and may not depict the historical event alongside them; this is disclosed in the journey and credits. The helmet is a credited artist reconstruction, not manufacturer-certified geometry. No award outcome is promised.

## Reproduce
Run `npm ci`, `npm run check`, `npm test`, then serve the repository via a static HTTP server. Generate `qa/preview.html` with `python qa/prepare.py` and open `/qa/preview.html` to run the local axe and PerformanceObserver instrumentation. Results are stored in the page's hidden `#qa-accessibility` and `#qa-metrics` outputs. The generated preview is ignored by Git, and the production index never loads these audit scripts or axe.
