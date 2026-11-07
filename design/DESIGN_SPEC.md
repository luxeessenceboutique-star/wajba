# Wajba — Design spec (v3)

Mobile food-delivery app for a **virtual Moroccan kitchen**: one central kitchen runs several virtual brands ("cuisines") and delivers everything in **one order, one delivery**. The UX follows the patterns of large delivery apps (clean white UI, round categories, store cards, option sheets, floating cart bar). The identity is Wajba's own; do not use any other company's logo, colors or mascot.

- **Language of the UI:** French, with Moroccan Darija touches (e.g. "Ahlan !", "Ma semaine", "Bla bsal"). Plan for Arabic (RTL) and English later: keep every string in a translation file from day one.
- **Currency:** dirham, written `55 DH`. Integer prices.
- **All numbers in the designs are placeholders** (prices, calories, ratings, names, addresses, reviews). Keep them in mock data, never hard-coded in components.

---

## 1. Files in this folder

| Path | What it is |
|---|---|
| `screens/png/*.png` | Pixel reference of every screen (2× scale, 390 pt wide). **Look at these first.** Rendered with a fallback font; the real font is Plus Jakarta Sans. |
| `screens/source/*.dc.html` | The design source of each screen. HTML + inline styles, using a design-tool templating syntax (`{{ value }}`, `<sc-for>`, `<sc-if>`, a `class Component` with `renderVals()`). **Not runnable as-is.** Read it for exact sizes, colors, copy and the interactive logic (the JS at the bottom of Compose, Dish, Pay, Plan, Profile). |
| `tokens.json` | Colors, type scale, radii, spacing, sizes, shadows. |
| `assets/brand/` | Logo mark (light and on-blue versions), app icon (rounded and full-bleed 1024). |
| `assets/food/*.svg` | Dish illustrations used as image placeholders (tajine, couscous, bowl, brochettes, pastilla, harira, msemen, atay). **To be replaced by real food photos** — build every image slot so a photo URL can replace the SVG. |
| `assets/patterns/` | Zellige tile patterns (brand board only in v3; optional for marketing). |

Screen order: `00-Main` (brand board) → `01-Splash` … `11-Account`.

---

## 2. Brand

- **Logo mark:** a delivery pin whose inside is a Moroccan door arch (saffron) holding a tajine and a khatam star (Majorelle blue). Files in `assets/brand/`.
- **Wordmark:** "wajba", Plus Jakarta Sans 800, lowercase, letter-spacing −0.06em. Arabic "وجبة" in Reem Kufi 700, saffron, next to it (splash and brand board only).
- **Tagline:** "Lmakla dyal dar, livrée en 30 min."
- **Colors:** Majorelle `#2B33C6` is the only action color (primary buttons, selected states, links, active tab). Saffron `#F6B52E` for small highlights (badges, "Nouveau client", selected time slot). Terracotta `#C04A22` for discounts and destructive text. Mint `#0E8A5F` for health/free/success. Everything else is white, `#F4F3F7` surfaces and ink `#17142B` text.
- **Image backgrounds:** food sits on soft tints, rotating `#FBE7DF` / `#E8EAFD` / `#E3F4EC` / `#FFF1D6`. Images are oversized and cropped by their container (looks like a photo, not an icon).

---

## 3. Components

Build these once, then compose screens from them. Sizes in points.

| Component | Spec |
|---|---|
| **PrimaryButton** | Height 54, radius 27, bg primary, white 16/700 text, full width. Variants: `outline` (1.5 border `#DDDAE5`, ink text), `dark` (bg ink). |
| **IconButton** | 44×44 circle, bg surface (or white over images, with `floatingButton` shadow on maps). Always has an accessibility label. |
| **SearchField** | Height 50, radius 25, bg surface, search icon 20, placeholder "Tajine, bowl, harira…". |
| **CategoryBubble** | 74 circle with tint bg, cropped illustration ~80, label 13/600 below. Grid of 4 columns × 2 rows. |
| **FilterChip** | Height 40, radius 20, padding 16. Default bg surface/ink text; active bg ink/white text. Horizontal scroll row. |
| **PromoBanner** | 318×150, radius 22, bg primary or saffron, title 23/800, small badge, illustration bottom-right overflowing and cropped. Horizontal carousel with dot indicator (active dot 18×6 primary, others 6×6 `#DDDAE5`). |
| **DishCard** (horizontal list) | Width 240. Image 240×150 radius 18 on tint; optional discount badge top-left (terracotta, radius 8, 12/800) and heart IconButton top-right (34). Below: name 15.5/700, "Kitchen · 25–35 min" 13 muted, row: price bold, struck old price, ★ rating. |
| **KitchenCard** | Cover 358×156 radius 18 on tint, optional badge ("Livraison offerte" white pill with mint text, or discount). Kitchen avatar 48 circle overlapping the bottom-left edge (white 3 border, initials). Below: name 17/800, tags 13 muted, meta row "★ 4,8 (2,1k) · 25–35 min · 9 DH" (fee "0 DH" in mint when free). |
| **MenuRow** | Text left (name 15.5/700, 2-line description 13.5 muted, price + kcal), image 96×96 radius 16 right with a 30 "+" button on it. Divider `#ECEAF1`. |
| **MenuGridCard** | 2-column grid, image 140 tall radius 16 with 36 "+" button bottom-right, then price, name, kcal. |
| **OptionGroup** | Header: title 17/800 + subtitle ("Choisis 1", "Jusqu'à 2") + badge right: **Obligatoire** (bg ink, white) or **Optionnel** (bg surface). Rows min 54: label, price delta right ("+38 DH", "inclus"), then control. Single choice = radio 24 (selected: filled primary with white 10 dot). Multi choice = checkbox 24 radius 7 (selected: filled primary with white check). |
| **SelectChip** (compose) | Height 44, radius 22, leading color dot 24, label (+ price delta). Selected: bg primary, white text. |
| **Stepper** | Pill bg surface, two 46 white circle buttons (−/+), count 16/700. Compact version in cart: 36 tall, 1.5 border. |
| **CartBar** (floating) | Height 56, radius 28, bg primary, `cartBar` shadow. Left: white 36 circle with item count; "Voir le panier" 16/700; right: translucent pill with total. Shown on Home and Kitchen whenever the cart is not empty. |
| **TabBar** | Height 84 (incl. safe area), top border, 4 tabs: **Accueil**, **Ma semaine**, **Commandes**, **Compte**. Icon 24 + label 11.5. Active = primary + filled icon. |
| **Switch** | 50×30, knob 24. On = primary, off = `#DDDAE5`. |
| **SummaryBox** | Radius 18, bg surface, rows 14.5 (label muted, value right), divider, Total row 18/700. |
| **ListRow** (settings) | Min 56, 36 icon circle (surface), label 15/600, optional value 13.5 muted, chevron. |
| **ProgressSegments** | 4 segments, height 6, radius 3, gap 6; done = primary, current partially filled, todo `#ECEAF1`. |

Icons: simple 2 pt stroke, rounded caps (Lucide-style). Never emoji.

---

## 4. Navigation

```
Splash/Login ─► Profile picker ─► Home (tabs)
Tabs: Accueil (Home) · Ma semaine (Plan) · Commandes (Track / order history) · Compte (Account)

Home ─► Kitchen ─► Dish (option sheet) ─► Cart ─► Payment ─► Tracking
Home ─► Compose ─► Cart
Home ─► Plan (banner/tab) ─► Payment
Account ─► Profile picker (Modifier), Payment methods, Plan
```

Dish is presented as a full-height modal sheet (close "×" top-left). Cart and Payment are pushed screens with a back button.

---

## 5. Screens

Each screen is 390 pt wide in the designs; the PNG shows the full scroll length. Sticky elements (bottom bars, tab bar) appear at the end of the long PNG but must be **fixed to the bottom** in the app.

### 01 · Splash / Login
- Full Majorelle background, three dish illustrations bleeding off the edges, centered logo mark (white pin), wordmark + Arabic, tagline.
- White bottom sheet (radius 28 top): title "Ahlan ! On te livre quoi aujourd'hui ?", buttons: **Continuer avec mon numéro** (primary, phone OTP), **Continuer avec Google** (outline), **Continuer avec Apple** (dark). Legal line with links to Conditions and Politique de confidentialité.

### 02 · Pour qui on cuisine ? (profile picker)
- Back, progress bar (step 2/3), "Passer".
- 2×3 grid of selectable cards (min 150): tinted circle with illustration, name, one-line perk, check circle top-right. **Multi-select.** Selected: 2 border primary, bg `#F3F4FE`.
- Profiles: Employé·e (Livré au bureau, 12h–14h) · Étudiant·e (−15 % avec ta carte) · Sportif·ve (Calories et protéines) · Famille (Plats pour 4 à 6) · Healthy (Moins de 500 kcal) · Ftour & Shour (Livré avant l'adhan).
- CTA "Continuer (n)". Profiles drive: Home filter default, recommended sections, Plan suggestions, student discount, Ramadan timing.

### 03 · Accueil (Home)
Top to bottom:
1. "Livrer à" + address selector "Bureau · Bd Zerktouni ⌄" (opens address sheet), notification IconButton with dot.
2. SearchField.
3. 8 CategoryBubbles: Tajines, Couscous, Bowls, Grillades, Pastilla, Soupes, Msemen, Boissons.
4. PromoBanner carousel: "−20 % sur ta 1re commande · Code BSAHA20" (primary), "Livraison offerte dès 150 DH" (saffron).
5. FilterChips: Tout, Sportif, Bureau, Étudiant, Famille, Healthy (filters everything below).
6. "Compose ta wajba" card (mint tint, bowl image right) → Compose.
7. "Populaires près de toi" + "Voir tout": horizontal DishCards.
8. "Nos cuisines" + subtitle "6 cuisines, une seule livraison": KitchenCards (Dar Wajba, Wajba Fit, Wajba Grill) + outline button "Voir les 6 cuisines".
9. CartBar (fixed), TabBar (fixed).

### 04 · Cuisine (Kitchen page, e.g. Dar Wajba)
- Cover 220 on tint with cropped dish; back, search-in-menu, favorite buttons.
- Avatar 64 overlapping the cover, name 27/800, description "Tajines, couscous & plats de dar · Halal".
- 3-column info strip (bordered, radius 16): ★ 4,8 / 2,1k avis · 25–35 min / Livraison · Gratuite / dès 150 DH.
- Promo strip (saffron tint): "−15 % sur les tajines jusqu'à 15h".
- **Sticky** section tabs: Populaires · Tajines · Couscous · Pastillas · Boissons (active: primary text + 3 pt underline). Tapping scrolls to the section; scrolling updates the active tab.
- Populaires = MenuGridCards; other sections = MenuRows. Items without a photo show a "+" circle instead of an image.
- CartBar fixed at the bottom.

### 05 · Fiche produit (Dish sheet) — interactive
- Image 300 on tint, close and favorite buttons.
- Name, description, price row (price, struck old price, discount badge), info chips: kcal (mint), protein (blue), rating.
- OptionGroups (example tajine): **Taille** required single (Solo · Duo +38 DH · Lmida 4 pers. +110 DH) · **Piquant** required single (Doux, Moyen, Har, Har bzzaf) · **Accompagnements** optional multi, **max 2** (Khobz dar inclus, Frites maison +10, Salade marocaine +12, Atay na3na3 +12) · **Retirer** optional multi (Sans oignons, Sans persil, Sans œufs).
- "Instructions pour la cuisine" textarea.
- Fixed bottom bar: Stepper + "Ajouter · {total} DH".
- Live values: total = (base + size delta + selected side deltas) × qty; kcal/protein update with sides and "Sans œufs" (see `screens/source/Dish.dc.html` → `renderVals()`).
- Disable "Ajouter" until every required group has a choice. When a max is reached, unselected rows in that group are inert.

### 06 · Compose ta wajba — interactive
- Title bar with back and "Vider" (clears everything).
- Preview card (mint tint, bowl image left): live **kcal** (36/800), protein / carbs / fat in g, goal pill ("Dans ton objectif" white/mint or "Au-dessus de 900 kcal" terracotta tint).
- Summary line of chosen items.
- 1. **La base** (required single, list rows with color dot + kcal + price delta).
- 2. **La protéine** (required single, list rows).
- 3. **Les légumes** (SelectChips, **max 4**, counter "n sur 4").
- 4. **La sauce** (SelectChips, single).
- 5. **Le petit plus** (SelectChips, optional multi).
- Fixed bottom bar: Total + "Ajouter au panier".
- Rules and full ingredient table: section 7.

### 07 · Panier (Cart)
- Title bar: back, "Panier", "Vider" (terracotta).
- Kitchens line: stacked kitchen avatars + "Dar Wajba + Wajba Fit · une seule livraison".
- Cart lines: image 64, name, options summary, price (composed bowls also show kcal), compact Stepper.
- "Souvent pris ensemble": horizontal small cards with "+".
- Rows: Couverts & serviettes (switch, default off, eco note) · Facture pro (ICE) (switch) · applied promo code row (mint, "−15 DH").
- SummaryBox: Sous-total, Livraison (struck "12 DH" + "Gratuite" when ≥ 150 DH), Réduction, **Total**, "Tu gagnes N nojoum".
- Fixed: "Commander · {total} DH".

### 08 · Paiement (Checkout) — interactive
- Title bar with back, "Paiement", lock badge.
- **Livraison**: map snippet + address row ("Modifier"), two selectable cards **Standard 25–35 min** / **Programmée Aujourd'hui 13:00** (opens time-slot picker), note-for-rider field.
- **Moyen de paiement** (radio list): saved card "Visa •• 4821", Apple Pay / Google Pay (platform-dependent), Wajba Wallet (balance), Espèces à la livraison; "+ Ajouter une carte".
- **Pourboire**: Non / 5 / 10 / 15 DH (100 % to the rider).
- SummaryBox: Commande, Pourboire, Total.
- Fixed CTA: "Payer {total} DH", or "Confirmer · {total} DH à la livraison" for cash. Caption "Paiement sécurisé · 3D Secure · CMI".

### 09 · Suivi (Tracking)
- Map (top 440) with route: kitchen marker, rider marker (scooter) and destination; back and "Aide".
- Bottom sheet: "Arrivée prévue à 13:02", **"Dans 18 min"**, status sentence, ProgressSegments with labels Confirmée · En cuisine · En route · Livrée.
- Rider card: avatar, name, vehicle + rating, chat and call buttons.
- **Code de remise** (4 digits) the customer gives the rider.
- Rows: delivery address, order summary (→ order detail), "Un problème avec ta commande ?".

### 10 · Ma semaine (weekly plan) — interactive, tab
- Title + subtitle.
- 3 plan cards: **Bureau** (5 j · 1 repas, 289 DH/sem.), **Sportif** (6 j · 2 repas, 549 DH, badge "Populaire"), **Fac** (5 j · 1 repas, 189 DH).
- Week strip (7 days, Mon–Sun) with delivered-day dots; days beyond the plan are "off" (dashed).
- Selected day: meal rows (Déjeuner 12:30 / Dîner 19:30 for Sportif), each with "Changer" (opens Compose/menu), day total kcal + protein. Off day: card "Jour off — ajoute-le pour 59 DH".
- Delivery rows: Déjeuner au bureau 12:15–12:45, Dîner à la maison 19:15–19:45 (Sportif only), "Mettre un jour en pause" (until 20:00 the day before).
- SummaryBox with struck original price; "Sans engagement · −20 % inclus". CTA "S'abonner · {price} DH / sem." above the TabBar.

### 11 · Mon compte
- Avatar 64, name, phone, "Modifier".
- 3 stat tiles: Wallet, Nojoum, Favoris.
- Loyalty card (saffron tint): "Plus que 550 nojoum pour un tajine offert", progress bar, level "Fidda · 1 450 / 2 000".
- "Mes profils" chips.
- Sections of ListRows: **Mon compte** (Mes commandes, Adresses, Paiement, Objectifs nutrition, Préférences) and **Plus** (Invite un ami — 30 DH chacun, Mon abonnement, Langue, Aide), then "Se déconnecter" (terracotta).
- TabBar.

---

## 6. Data model (TypeScript sketch)

```ts
type ProfileId = 'job' | 'etu' | 'sport' | 'fam' | 'heal' | 'ftour';

interface Kitchen { id: string; name: string; initials: string; color: string; tagline: string;
  tags: string[]; rating: number; ratingCount: number; etaMin: number; etaMax: number;
  deliveryFee: number; freeDeliveryFrom?: number; promo?: string; coverImage: string; }

interface MenuItem { id: string; kitchenId: string; section: string; name: string; description: string;
  price: number; oldPrice?: number; kcal?: number; protein?: number; image?: string;
  allergens?: string[]; profiles?: ProfileId[]; optionGroups?: OptionGroup[]; }

interface OptionGroup { id: string; title: string; subtitle?: string; required: boolean;
  min: number; max: number; options: Option[]; }

interface Option { id: string; label: string; priceDelta: number; kcalDelta?: number; proteinDelta?: number; }

interface ComposeIngredient { id: string; step: 'base' | 'protein' | 'veg' | 'sauce' | 'extra';
  name: string; kcal: number; protein: number; carbs: number; fat: number; priceDelta: number; color: string; }

interface CartLine { id: string; itemId: string | 'compose'; name: string; summary: string;
  unitPrice: number; qty: number; kcal?: number; selections: Record<string, string[]>; note?: string; }

type OrderStatus = 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

interface Order { id: string; lines: CartLine[]; subtotal: number; deliveryFee: number; discount: number;
  tip: number; total: number; payment: 'card' | 'apple_pay' | 'google_pay' | 'wallet' | 'cash';
  schedule: 'asap' | string; addressId: string; status: OrderStatus; etaISO: string;
  handoverCode: string; rider?: { name: string; rating: number; vehicle: string; phone: string }; }

interface Plan { id: 'bureau' | 'sport' | 'fac'; name: string; days: number; mealsPerDay: 1 | 2;
  price: number; oldPrice: number; }

interface User { id: string; name: string; phone: string; profiles: ProfileId[]; walletBalance: number;
  nojoum: number; level: 'Fidda' | 'Dheb'; dailyKcalGoal: number; dailyProteinGoal: number;
  preferences: { glutenFree: boolean; vegetarian: boolean; lactoseFree: boolean; allergies: string[] };
  addresses: { id: string; label: string; line: string; city: string }[]; }
```

---

## 7. Business rules (mock values — confirm with the business)

**Pricing and cart**
- Delivery fee 12 DH, free when subtotal ≥ 150 DH. One delivery fee per order even with several kitchens.
- Promo codes: `BSAHA20` = −20 % on first order; `BUREAU15` = −15 DH.
- Tip options 0 / 5 / 10 / 15 DH, added after discounts.
- Nojoum: 1 per DH paid. Fidda → Dheb at 2 000. Reward example: free tajine.
- Student profile: −15 % with a verified student card (flow TBD).

**Option groups**
- Required single-choice groups need exactly one selection before "Ajouter" is enabled.
- `max` caps multi-select (tajine sides: 2). Taps beyond the cap do nothing.

**Compose ta wajba**
- Base price **45 DH** + each ingredient's `priceDelta`.
- kcal / protein / carbs / fat = sum of chosen ingredients.
- Goal pill: ≤ 900 kcal → "Dans ton objectif" (mint); above → "Au-dessus de 900 kcal" (terracotta). The 900 kcal threshold should come from the user's goal (daily goal ÷ meals), not be hard-coded.
- Base 1 (required), protein 1 (required), vegetables 0–4, sauce 1, extras 0–n.
- Default selection in the design: Quinoa, Poulet chermoula, Zaalouk + Avocat + Pois chiches, Chermoula → 880 kcal, 53 DH.

| Step | Name | kcal | P | C | F | +DH | Dot color |
|---|---|---|---|---|---|---|---|
| base | Couscous | 360 | 12 | 70 | 4 | 0 | #E8C068 |
| base | Riz au safran | 330 | 6 | 72 | 2 | 0 | #F6B52E |
| base | Quinoa | 300 | 11 | 54 | 5 | 0 | #D3B67C |
| base | Salade verte | 60 | 3 | 10 | 1 | 0 | #7DBB55 |
| base | Msemen | 320 | 7 | 46 | 12 | 4 | #E3A74C |
| base | Patate douce | 240 | 4 | 54 | 1 | 4 | #E8762C |
| protein | Poulet chermoula | 220 | 32 | 2 | 9 | 0 | #E9B377 |
| protein | Kefta épicée | 290 | 24 | 4 | 20 | 6 | #8A4B2A |
| protein | Poisson grillé | 210 | 30 | 0 | 9 | 10 | #AFC0D6 |
| protein | Falafel | 260 | 11 | 28 | 12 | 0 | #9C7A3A |
| protein | Œufs bio | 150 | 12 | 1 | 10 | 0 | #FFE58A |
| protein | Double poulet | 440 | 64 | 4 | 18 | 14 | #D89A5E |
| veg | Zaalouk | 70 | 1 | 6 | 5 | 0 | #6B2F55 |
| veg | Taktouka | 60 | 1 | 7 | 3 | 0 | #D23A24 |
| veg | Carottes au cumin | 50 | 1 | 10 | 1 | 0 | #E8762C |
| veg | Tomate-concombre | 25 | 1 | 5 | 0 | 0 | #6FAE4A |
| veg | Avocat | 120 | 1 | 6 | 11 | 8 | #9DC65A |
| veg | Pois chiches | 110 | 6 | 18 | 2 | 0 | #EDCF95 |
| veg | Olives | 60 | 0 | 2 | 6 | 0 | #4A4A2A |
| veg | Betterave | 40 | 1 | 9 | 0 | 0 | #9A1F4A |
| sauce | Harissa | 20 | 1 | 3 | 1 | 0 | #B8281A |
| sauce | Chermoula | 60 | 0 | 2 | 6 | 0 | #2F7A3A |
| sauce | Tahini | 90 | 3 | 3 | 8 | 0 | #E8D6B0 |
| sauce | Yaourt menthe | 35 | 2 | 3 | 2 | 0 | #DDEFE3 |
| sauce | Sans sauce | 0 | 0 | 0 | 0 | 0 | #FFFFFF |
| extra | Atay na3na3 | 80 | 0 | 20 | 0 | 12 | #0E8A5F |
| extra | Jus d'orange | 110 | 2 | 26 | 0 | 15 | #F59A2C |
| extra | Chebakia | 180 | 2 | 24 | 9 | 10 | #B8681E |
| extra | Amlou & pain | 210 | 5 | 14 | 15 | 9 | #8A4B2A |

**Tajine kefta & œufs (Dish example)** — base 55 DH (old 65, −15 %), 640 kcal, 38 g protein. Sizes: Solo +0, Duo +38, Lmida +110. Sides: Khobz dar +0 (+240 kcal, +8 g P, default on), Frites maison +10 (+320 kcal), Salade marocaine +12 (+60 kcal), Atay na3na3 +12 (+80 kcal); max 2. "Sans œufs": −140 kcal, −12 g P.

**Plans** — Bureau 289 DH (was 365), Sportif 549 DH (was 690), Fac 189 DH (was 235). Lunch window 12:15–12:45 to the office, dinner 19:15–19:45 at home. Pause a day until 20:00 the previous evening. Extra day 59 DH.

**Orders** — statuses: confirmed → preparing → on_the_way → delivered. Show a 4-digit handover code while on_the_way.

---

## 8. Seed data (from the designs)

**Kitchens:** Dar Wajba (DW, #C04A22, "Tajines · Couscous · Pastilla", ★4,8 (2,1k), 25–35 min, free delivery) · Wajba Fit (WF, #0E8A5F, "Bowls · Protéines · Healthy", ★4,7 (1,4k), 20–30 min, 9 DH) · Wajba Grill (WG, #17142B with saffron initials, "Brochettes · Kefta · Grillades", ★4,6 (980), 30–40 min, 9 DH, "−10 % le soir"). Three more kitchens TBD.

**Dar Wajba menu:** Tajine kefta & œufs 55 DH (640 kcal) · Tajine poulet citron confit 62 DH (580) · Tajine de poisson chermoula 70 DH (470) · Couscous 7 khodar 65 DH (690, Friday dish) · Couscous tfaya 75 DH (820) · Pastilla au poulet 72 DH (580) · Harira & dattes 18 DH (340) · Atay na3na3 12 DH · Jus d'orange pressé 15 DH.

**Other:** Bowl poulet chermoula 68 DH (520 kcal, 42 g P) · Brochettes mixtes 79 DH (610 kcal, 48 g P) · Msemen & miel 14 DH · Mini pastilla 22 DH · Harira 18 DH. Weekly menus: see `screens/source/Plan.dc.html` (`MENU`).

---

## 9. Accessibility and quality bar

- Touch targets ≥ 44 pt. Every icon-only button has an accessibility label.
- Text contrast ≥ 4.5:1 (muted text is `#6B6880` on white; don't go lighter for body text).
- Selected states never rely on color alone: radios/checkboxes fill, chips invert.
- Respect safe areas; bottom bars sit above the home indicator.
- Prepare for RTL (Arabic): use start/end, not left/right.
- The mockups leave the top ~52 pt empty for the system status bar; use the real safe-area inset instead.

## 10. Not designed yet / to decide

- **Real food photography** (replace every SVG illustration; keep the tinted backgrounds as loading placeholders).
- Phone OTP screen, address picker sheet, time-slot picker, search results, order history list, order detail, empty/error/loading states, notifications.
- Payment provider (CMI for Moroccan cards; Apple Pay / Google Pay), maps provider, backend and admin/kitchen tools.
