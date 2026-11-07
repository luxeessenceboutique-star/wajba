# Wajba — design handoff for Claude Code

**Darija:** 7ell had l-dossier, 7ett-o f west l-projet jdid dyalek b smiya `design/`, 7ell Claude Code f dossier dyal l-projet, w copy-colli l-prompt li l-te7t.

## What's inside

```
DESIGN_SPEC.md        ← the full spec: components, every screen, data model, business rules, seed data
tokens.json           ← colors, typography, radii, spacing, sizes, shadows
screens/png/          ← one PNG per screen (00 = brand board, 01–11 = app screens)
screens/source/       ← design source of each screen (HTML reference, not runnable)
assets/brand/         ← logo mark, app icon
assets/food/          ← dish illustrations (placeholders until real photos)
assets/patterns/      ← zellige tiles (marketing / brand only)
```

## How to use it

1. Create an empty folder for the app, e.g. `wajba-app/`.
2. Copy this whole folder into it as `wajba-app/design/`.
3. Open Claude Code in `wajba-app/` and paste the prompt below.
4. Build in phases: let it finish and run phase 1 before asking for the next one.

## Prompt to paste in Claude Code

```text
You are building the mobile app "Wajba" from the design handoff in ./design.

Read first, in this order:
1. design/DESIGN_SPEC.md (source of truth for behaviour, data and copy)
2. design/tokens.json (all colors, type, radii, spacing — no magic numbers in components)
3. Every image in design/screens/png/ (visual reference; match spacing, sizes and hierarchy)
4. design/screens/source/*.dc.html when you need an exact value or the interactive logic
   (they use a design-tool templating syntax: {{ }}, <sc-for>, <sc-if>, and a JS class with renderVals();
   treat them as reference only, do not try to run them)

Stack:
- Expo (latest SDK) + React Native + TypeScript, expo-router for navigation
- Fonts: @expo-google-fonts/plus-jakarta-sans (and Reem Kufi for the Arabic logo text only)
- SVG assets with react-native-svg (+ react-native-svg-transformer)
- State: Zustand for cart, compose and user; mock data in /src/data from DESIGN_SPEC section 8
- All UI strings in a French translation file (i18n-ready for Arabic RTL and English later)
- No backend yet: a mock API layer (/src/api) with async functions returning the seed data

Work in phases and stop after each one so I can test with Expo Go:
Phase 1 — Theme from tokens.json, fonts, and the component library from DESIGN_SPEC section 3
          (with a simple /dev screen that shows every component).
Phase 2 — Navigation (section 4) and screens 01 Splash, 02 Profile picker, 03 Home, 04 Kitchen, with mock data.
Phase 3 — 05 Dish option sheet and 06 Compose with the exact rules in section 7 (required groups,
          max limits, live price/kcal/macros), wired to a real cart store.
Phase 4 — 07 Cart, 08 Payment (mock payment), 09 Tracking (mock status timer), floating cart bar.
Phase 5 — 10 Ma semaine (plans) and 11 Mon compte.

Rules:
- Match the PNGs closely: white UI, Majorelle #2B33C6 as the only action color, Plus Jakarta Sans everywhere.
- Every image slot must accept a photo URL later; use the SVGs in design/assets/food for now,
  on the tinted backgrounds, oversized and cropped like in the designs.
- Bottom bars (cart bar, tab bar, CTA bars) are fixed to the bottom with safe-area insets.
- Touch targets ≥ 44, accessibility labels on icon buttons.
- Keep prices, calories and names in mock data, never hard-coded in components.
- After each phase: run TypeScript checks and lint, then tell me how to open it in Expo Go.
```

## Notes

- All prices, calories, ratings, names and reviews in the designs are placeholders.
- Food images are illustrations; replace them with real photos of your dishes when you have them.
- Screens not designed yet (OTP, address picker, search results, order history, empty/error states) are listed at the end of DESIGN_SPEC.md — Claude Code should build them in the same style.
