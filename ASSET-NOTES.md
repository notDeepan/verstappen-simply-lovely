# Image generation and media notes

Two GPT Image assets were created for the initial redesign. Both are now archived: the hero uses the supplied video and the helmet uses the attributed model preview. The invented helmet was subsequently retired after the user requested the real branding and race details. The following briefs record the creative direction for future revisions; they are not verbatim tool transcripts.

## Retired campaign portrait

Input: supplied `media/portrait-visor.jpg` (same portrait as the supplied image reference).

Brief: preserve the driver's helmet, suit and gesture. Compose a wide 16:9 editorial portrait with the driver occupying the right half and dark negative space on the left for typography. Midnight wet paddock, a thin scarlet light in the distance, a cool key light and restrained red rim light. Photographic realism; no added typography, people or cars.

Master: `media/generated/born-to-race.png`.
Web asset: `media/generated/born-to-race.webp`, 1672 × 941, 149,690 bytes.

## Retired helmet campaign render

Brief: an original premium full-face racing helmet in a left-facing three-quarter studio view. Ceramic-white shell, sweeping midnight-navy and scarlet livery, fine gold accents, a gold mirrored curved visor with visible hardware, an extended chin section and numeral 1. Dark navy studio, controlled sculptural reflections, no sponsor logos, decorative rings, particles or surrounding text.

Master: `media/generated/helmet-concept.png`.
Web asset: `media/generated/helmet-concept.webp`, 1672 × 941, 84,112 bytes.

The retired Three.js model under `original/helmet-concept-v1/` was built separately, with custom shell geometry and a procedural livery. It is not a scan or a downloadable production helmet model, and the generated campaign render does not depict its exact geometry.

## Supplied footage and archive

The redesign reuses the user's existing images, `hero.mp4` and `dutchman.mp4`. The supplied archive remains intact. No AI video or new audio was created. Story images are atmospheric illustrations rather than verified documentary frames for individual historical races. The credits dialog states this distinction.

## Design references

All four supplied reference documents were read: Apple, Nike, ThoughtLab and Active Theory. Their contributions are object presentation, athletic image scale, monumental typography and atmospheric depth. The implementation is an original composition. Graphify analyzed the original project before source replacement; its report documents extraction limitations.

## Active helmet: 2024 Imola

The helmet section now uses the public Sketchfab viewer and matching preview for bad_bovy’s Schuberth SF3 ABP model. No AI image edit, logo regeneration, texture extraction or local mesh copy is used. The old generated helmet and procedural geometry are not displayed. See `HELMET-SOURCE.md` for the source, attribution and hosting details.
