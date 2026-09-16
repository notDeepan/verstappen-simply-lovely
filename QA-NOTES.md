# Driver layout and transition revision

- Replaced the tilted scarlet banner with a level navy transition, pale text and small red separators.
- Marquee now has two identical nonshrinking groups, each at least one viewport wide, with no track gap. The animation travels exactly one group width (-50% of the two-group track), keeping the reset continuous.
- Browser geometry verified at 2560px: 2560px + 2560px groups; 1440px: 1520.046875px + 1520.046875px; 390px: 885.53125px + 885.53125px. Groups have identical text. No horizontal document overflow at those widths. Multiple animation phases observed without the former empty tail.
- Driver spread capped at 1540px, columns brought closer, portrait height controlled, and career records moved beneath the biography. Mobile has a single-column reading order with the records before the portrait.
- Visual checks at 2560×1240, 1440×900 and 390×844. Node syntax, HTML nesting and unique IDs passed. Existing global pause and reduced-motion rules apply to the replacement track.
- Broader scrolling choreography was intentionally deferred as requested.

# Current revision — 16 September 2026

- Hero changed to SIMPLY LOVELY over supplied hero.mp4: autoplay, muted, loop, playsinline. Removed the hero film-launch button and generated portrait request.
- Actual video playing events observed in the browser; pause and resume controls exercised. Hero and ambient playback suspend offscreen, on hidden tabs and during dialogs.
- Hero composition checked on the desktop viewport and at 390×844 and 320×740; no horizontal document overflow at the narrow widths (375/375 and 305/305 client/scroll widths, accounting for scrollbars). The tall mobile hero intentionally scrolls.
- Branded helmet uses bad_bovy’s 2024 Imola model with visible creator attribution. Standalone 3D rendered and rotation was exercised; front and side sponsor markings visually inspected, including Red Bull, Oracle, Mobil 1, Player 0.0, TAG Heuer, EA Sports, Viaplay and Bybit.
- Important unresolved limit: local cross-origin iframe remained about:blank in the in-app browser, including a minimal isolated embed and the official Viewer API integration. No captured console error established the cause. Embedded rendering has NOT passed verification.
- Matching preview remains visible until viewerready. A 15-second timeout displays a direct interactive-view link; that link opened the working standalone model. Reference mode removes the iframe (count verified zero); dialog close also removes it. Desktop and mobile preview/dialog layouts checked.
- Node syntax and local HTML asset/anchor integrity checked after the final changes. No automated whole-site regression suite was added for this visual revision.
- OS reduced-motion and real-device cross-browser performance were not exhaustively tested. No claim of manufacturer-certified model accuracy or measured field performance.

The older acceptance record below refers to the initial build. Its procedural-helmet and generated-hero checks do not certify the replacement implementation.

---

# Verification notes — 15 September 2026

## Completed

- `npm run check`: both JavaScript modules pass Node syntax checks.
- Static HTML validation: local media/script/font/style references and fragment targets exist; IDs are unique; images have alt attributes.
- In-app Chromium preview: desktop 1440×900, mobile 390×844, and narrow 320×740 layouts inspected.
- Narrow navigation now keeps chapter names on one line. Page content has no horizontal overflow at checked widths.
- Year tabs, next/previous buttons, and keyboard year selection exercised.
- Gallery filtering and lightbox navigation exercised.
- Both the video dialog and native controls render; the hero film visibly plays.
- Helmet: 3D initialization, Heritage/Midnight livery, visor opening, exploded assembly, reset and keyboard rotation exercised. Latest assembled and exploded states visually inspected with no clipped geometry.
- Latest desktop page image check: no failed image loads; document scroll width equals client width.
- Latest studio console check: no captured errors or warnings.

## Scope

This is a local browser acceptance pass, not a cross-browser or real-device certification. Reduced-motion, lazy loading and rendering lifecycle behavior are implemented; OS reduced-motion emulation and WebGL context-loss recovery were not exhaustively tested. No Lighthouse run, field Core Web Vitals, assistive-technology audit or external award evaluation was performed.

Campaign hero WebP: 149,690 bytes. Helmet WebP: 84,112 bytes. The Three.js module is loaded on demand after the studio is opened. Film files and stills come from the supplied archive. The code-built 3D study is intentionally separate from the generated campaign render.
