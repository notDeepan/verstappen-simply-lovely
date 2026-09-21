# Redesign audit and implementation brief

Audited 21 September 2026 against the complete supplied specification and approved concept board.

## Existing architecture
Static HTML/CSS/ES modules on GitHub Pages; local GSAP 3.12.5 + ScrollTrigger. Three self-hosted font roles. No framework/build pipeline required. Previous CSS had accumulated overlapping overrides; replace with structured tokens and chapter layouts. Split media, navigation/motion and gallery behavior into modules.

## Preserve
Both silent fan-film MP4s; best real portraits and archive photographs; four source-linked 2016/2021/2023/2024 milestones and dated statistics. Keep bad_bovy’s public 2024 Imola model and matching thumbnail, deferred iframe, generation guard, timeout and static fallback. No invented helmet variants or replacement sponsor textures. Preserve credits, official destinations and independent-fan disclosure.

## Direction
Near-black #050505, warm white #f2f0e9, ash #aaa9a4, line #323330, scarlet #ed422f. Barlow Condensed display, Archivo body, JetBrains Mono labels. Oversized left-aligned MAX / VERSTAPPEN over dark moving imagery establishes the opening. Six numbered chapters resolve the specification’s five/six-navigation discrepancy by retaining the helmet as its own chapter.

The signature is a pinned horizontal four-moment photographic journey on large screens, surrounded by a speed-film entrance and a quiet eye-level portrait. Smaller screens and motion-off mode use a normal vertical sequence. Machine uses an actual licensed RB19 photograph, not invented engineering claims. Archive uses asymmetric exhibition spacing. Finale is a full-height looping film with SIMPLY / LOVELY typography.

## Motion and robustness
Native scrolling; one desktop pin; subtle image depth, masked photographs and bounded velocity displacement. Persistent chapter position and accessible year controls. All content remains present without JS. No blocking loader: small loading mark disappears on hero readiness or bounded timeout. One shared media controller pauses offscreen, hidden and modal-obscured videos; motion-off also tears down scroll choreography. Native dialogs restore focus; 3D loads only on demand and unloads when closed.

## Verification plan
Desktop 1440/1920/wide, tablet and narrow mobile; no overflow, navigation, journey controls and focus, filters/lightbox, menu, video lifecycle, motion-off, 3D static/failure handling. Check source syntax, local asset resolution and links, console, resource weight, layout shift and available paint timings. Record measured outcomes and browser-specific limitations; do not claim field Core Web Vitals or universal embedded-viewer support from local tests.
