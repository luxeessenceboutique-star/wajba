# Wajba — mobile app

Food delivery for a virtual Moroccan kitchen: several cuisines, one order, one delivery.
Built from the design handoff in [`design/`](design/) (spec: [`design/DESIGN_SPEC.md`](design/DESIGN_SPEC.md)).

**Stack:** Expo SDK 58 · React Native 0.88 · TypeScript · Expo Router · react-native-svg · Zustand (from phase 3)

## Run it on your phone (Expo Go)

1. Install [Node.js LTS](https://nodejs.org) on your computer.
2. Install **Expo Go** on your phone (Play Store / App Store), latest version — it must support SDK 58.
3. In this folder:

   ```bash
   npm install
   npx expo start
   ```

4. Scan the QR code shown in the terminal: with the Expo Go app on Android, with the Camera app on iPhone.
   Phone and computer must be on the same Wi-Fi. If they can't see each other, use `npx expo start --tunnel`.

The app opens on the Splash / Login screen. Everything is mocked: "Continuer avec mon numéro"
accepts any Moroccan mobile number and **any 4-digit code**; Google and Apple sign in instantly.
The component gallery is still available from **Compte → Galerie des composants** (`/dev`).

## Checks

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint (eslint-config-expo)
```

## Project layout

```
design/                 Design handoff (source of truth): spec, tokens.json, screen PNGs, sources
assets/                 App icon, splash, food and brand SVGs
src/app/                Screens (Expo Router: every file is a route)
  _layout.tsx           Fonts + splash screen + navigation stack
  index.tsx             01 Splash / Login
  phone.tsx             Phone number + SMS code (mock)
  profile.tsx           02 Profile picker (also "Modifier mes profils")
  (tabs)/               Tab bar: home (03 Accueil), plan, orders, account
  kitchen/[id].tsx      04 Kitchen page (sticky section tabs)
  search.tsx, kitchens.tsx, notifications.tsx
  dish/[id].tsx         05 Dish option sheet (modal)
  compose.tsx           06 Compose ta wajba
  cart.tsx              07 Cart (lines + subtotal; checkout in phase 4)
  dev.tsx               Component gallery
src/api/                Mock API: async functions over src/data (swap for the real backend later)
src/store/              Zustand stores: user (auth, profiles, address, favorites, kcal goal), cart
src/components/         Component library (DESIGN_SPEC §3) — import from "@/components"
src/theme/              tokens.ts reads design/tokens.json; metrics.ts holds component sizes
src/i18n/               UI strings (fr.ts) — every visible string lives here (Arabic/English later)
src/data/               Mock data (DESIGN_SPEC §7–8): kitchens, menu, compose, home, rules
src/lib/                format.ts (55 DH, 4,8, 2,1k…), pricing.ts (dish, compose and order totals),
                        cartActions.ts (dish / bowl → cart line, quick add)
src/assets/             Illustration registry (keys like "tajine" → SVG)
src/types/              Data model (DESIGN_SPEC §6)
```

### Rules the code follows

- **No magic numbers in components.** Colors, type, radii, spacing come from `design/tokens.json`
  (via `src/theme`); component sizes from `src/theme/metrics.ts`.
- **Prices, calories and names live in `src/data`**, never in components.
- **Every image slot accepts a photo URL.** `image: "tajine"` draws the placeholder illustration;
  `image: "https://…/tajine.jpg"` shows the photo on the same tinted background.
- **i18n-ready:** strings in `src/i18n/fr.ts`; layout uses `start`/`end`, not left/right, for future RTL.
- **Accessibility:** touch targets ≥ 44 pt, labels on icon buttons, selected states never color-only.

## Phases

| Phase | Scope | Status |
|---|---|---|
| 1 | Theme from tokens, fonts, component library, `/dev` gallery | ✅ done |
| 2 | Navigation; screens 01 Splash, 02 Profile picker, 03 Home, 04 Kitchen (+ phone login, search, address sheet) | ✅ done |
| 3 | 05 Dish option sheet, 06 Compose (rules §7), cart store, floating cart bar | ✅ done |
| 4 | 07 Cart (full), 08 Payment (mock), 09 Tracking (mock timer) | next |
| 5 | 10 Ma semaine (plans), 11 Mon compte | |

All prices, calories, ratings, names and reviews are placeholders from the designs.
