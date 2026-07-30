# Design QA

## Comparison target

- Source visual truth:
  - `references/heritage-envelope.png`
  - `references/heritage-hero.png`
- Rendered implementation:
  - `qa/implementation-envelope-1280x720-v2.png`
  - `qa/implementation-hero-1280x720.png`
  - `qa/implementation-envelope-mobile.png`
  - `qa/implementation-hero-mobile.png`
  - `qa/mobile-320-envelope.png`
  - `qa/mobile-320-hero.png`
  - `qa/mobile-390-rsvp.png`
  - `qa/mobile-landscape-844x390.png`
  - `qa/desktop-1280-after-mobile.png`
- Comparison boards:
  - `qa/compare-envelope-final.png`
  - `qa/compare-hero.png`
  - `qa/compare-hero-mobile-pass.png`
- Focused interaction evidence:
  - `qa/implementation-map-modal-mobile.png`
  - `qa/implementation-rsvp-mobile.png`

## Normalization

- Desktop source and implementation were captured at 1280 x 720 CSS pixels with device scale factor 1.
- Desktop source and implementation files are both 1280 x 720 pixels.
- Mobile implementation was captured at 390 x 844 CSS pixels with device scale factor 1.
- Source and implementation were compared in the same states: closed envelope and opened invitation hero.
- The source language controls and the implementation music control are product-level differences outside the core composition comparison.

## Full-view comparison

### Closed envelope

The final implementation preserves the selected source anatomy: full-screen embossed olive paper, clear flap seams, centered terracotta wax seal, initials inside the seal, and one small opening instruction. The generated botanical paper and slightly deeper olive tone follow the user's chosen natural palette.

### Opened hero

The implementation keeps the source hierarchy and proportions: centered invitation line, large calligraphic names, separated date, location line, and restrained downward navigation. The garden was intentionally changed to the requested peach sky, sun rays, classical columns, white flowers, trees, and marble bust.

## Focused-region comparison

- Typography: Cormorant Garamond, Great Vibes, and Manrope reproduce the source's calligraphic display, editorial serif, and compact uppercase labels. Cyrillic wrapping and optical weight were checked on mobile and desktop.
- Spacing: the envelope, hero copy, date row, timeline, venue cards, dress-code reference, and RSVP fields keep consistent vertical rhythm at 390 px and 1280 px widths.
- Colors: olive, terracotta, warm ivory, peach, chocolate, beige, and pale blue are mapped to reusable CSS tokens or dress-code data.
- Images: all hero, envelope, sculpture, couple, venue, and dress-code visuals use real raster assets. No decorative image was replaced with CSS or handcrafted SVG artwork.
- Copy: names, date, venue, welcome time, ceremony time, RSVP deadline, gift request, alcohol choices, contacts, maps, and calendar details match the brief.
- Controls: the seal opens the invitation; music toggles; the map modal exposes 2GIS and Google Maps; the RSVP name, guest count, and drink choices accept input; personal `guest` links prefill the guest name.

## Comparison history

### Iteration 1

- Finding [P2]: desktop envelope used the vertical mobile asset inside a centered column, leaving dark side bars and reducing fidelity to the full-screen Heritage cover.
- Finding [P2]: the seal monogram was too faint and too small.
- Fix: generated a dedicated 16:9 envelope asset, switched desktop breakpoints to it, increased the monogram size, and strengthened its color.
- Post-fix evidence: `qa/compare-envelope-final.png` shows a full-screen envelope with centered seal and readable initials.

### Iteration 2

- No actionable P0, P1, or P2 differences remained.
- Residual P3: the source uses a larger close-cropped seal. The implementation keeps more embossed paper visible to support the botanical wedding direction.

### Iteration 3: mobile-first pass

- Finding [P2]: the opened hero was 19 px taller than the viewport in 844 x 390 landscape, so the first screen did not fit cleanly without a small scroll.
- Finding [P2]: portrait tablets at 760–819 px received the landscape envelope asset and desktop two-column layouts.
- Finding [P3]: all below-fold photography loaded eagerly on first visit.
- Fix: added a compact landscape composition, separated the envelope orientation breakpoint from the layout breakpoint, moved desktop grids to 820 px, added safe-area spacing, widened mobile content slightly, and lazy-loaded below-fold images.
- Post-fix evidence: the landscape hero is exactly 390 px tall at 844 x 390; 320, 360, 390, and 430 px portrait widths have no horizontal overflow; the 1280 x 720 desktop hero remains unchanged in hierarchy and balance.

## Browser verification

- Viewports checked: 320 x 740, 360 x 800, 390 x 844, 430 x 932, 844 x 390, 1280 x 720, and 1280 x 800.
- Primary interactions checked: envelope opening, personalized guest copy, music toggle rendering, map modal, map link targets, RSVP text field, guest-count select, drink checkbox, and contact link presence.
- Browser console warnings and errors checked: none.

## Implementation checklist

- [x] Closed-envelope state matches the selected source direction.
- [x] Opened hero preserves source hierarchy and uses requested imagery.
- [x] Mobile and desktop layouts stay readable and balanced.
- [x] Core invitation interactions work.
- [x] All P0, P1, and P2 findings are resolved.

final result: passed
