/**
 * Design tokens, read straight from design/tokens.json (the designer's file),
 * then converted to React Native units:
 *  - letterSpacing "-0.03em" → points (em × font size)
 *  - lineHeight 1.2          → points (multiplier × font size)
 *  - font weight             → the matching Plus Jakarta Sans font file
 *
 * Components must take every color, size, radius and spacing from here
 * (or from ./metrics.ts for component-specific sizes) — no magic numbers.
 */
import raw from "@design/tokens.json";
import type { TextStyle } from "react-native";

export const colors = {
  ...raw.color,
  /** Rotating soft backgrounds behind food images. */
  tints: raw.categoryTints,
  /** Star icon in ratings. */
  star: raw.color.saffron,
  /** Translucent pill on the blue cart bar ("155 DH"). */
  onPrimaryTranslucent: "rgba(255,255,255,0.18)",
  /** Thin outline so light ingredient dots (white "Sans sauce") stay visible. */
  dotOutline: "rgba(23,20,43,0.15)",
  /** Dimmed overlay behind sheets and modals. */
  scrim: "rgba(23,20,43,0.4)",
  white: "#FFFFFF",
} as const;

/** Names of the single-color entries (excludes the `tints` array). */
export type ColorName = { [K in keyof typeof colors]: (typeof colors)[K] extends string ? K : never }[keyof typeof colors];

export const radius = raw.radius;
export const spacing = raw.spacing;
export const size = raw.size;
export const shadows = {
  ...raw.shadow,
  /** Header pinned over scrolling content (kitchen page). */
  pinnedHeader: "0 4px 12px rgba(23,20,43,0.06)",
  /** Switch knob (not in tokens.json; subtle lift so the knob reads on grey). */
  knob: "0 1px 3px rgba(23,20,43,0.2)",
};

/** One font file per weight: Android can't synthesize weights for custom fonts. */
export const fontFamily = {
  400: "PlusJakartaSans_400Regular",
  500: "PlusJakartaSans_500Medium",
  600: "PlusJakartaSans_600SemiBold",
  700: "PlusJakartaSans_700Bold",
  800: "PlusJakartaSans_800ExtraBold",
  arabicLogo: "ReemKufi_700Bold",
} as const;

export type FontWeight = 400 | 500 | 600 | 700 | 800;

type RawTypeStyle = {
  size: number;
  weight: number;
  lineHeight?: number;
  letterSpacing?: string;
  transform?: string;
};

function em(value: string | undefined, fontSize: number): number | undefined {
  if (!value) return undefined;
  const n = parseFloat(value);
  return Number.isFinite(n) ? Math.round(n * fontSize * 100) / 100 : undefined;
}

export function toTextStyle(t: RawTypeStyle): TextStyle {
  const weight = t.weight as FontWeight;
  return {
    fontFamily: fontFamily[weight],
    fontSize: t.size,
    ...(t.lineHeight ? { lineHeight: Math.round(t.size * t.lineHeight) } : null),
    ...(t.letterSpacing ? { letterSpacing: em(t.letterSpacing, t.size) } : null),
    ...(t.transform === "uppercase" ? { textTransform: "uppercase" } : null),
  };
}

/**
 * Type scale. The first block comes from tokens.json; the second block holds
 * the few extra sizes DESIGN_SPEC §3 uses (category labels, chips, promo
 * titles…) so components never invent their own.
 */
const fromTokens = {
  displayLogin: toTextStyle(raw.type.displayLogin),
  screenTitleLarge: toTextStyle(raw.type.screenTitleLarge),
  screenTitleBar: toTextStyle(raw.type.screenTitleBar),
  sectionTitle: toTextStyle(raw.type.sectionTitle),
  groupTitle: toTextStyle(raw.type.groupTitle),
  productTitle: toTextStyle(raw.type.productTitle),
  cardTitle: toTextStyle(raw.type.cardTitle),
  body: toTextStyle(raw.type.body),
  bodySmall: toTextStyle(raw.type.bodySmall),
  caption: toTextStyle(raw.type.caption),
  badge: toTextStyle(raw.type.badge),
  tabLabel: toTextStyle(raw.type.tabLabel),
  tabLabelActive: toTextStyle({ ...raw.type.tabLabel, weight: raw.type.tabLabel.activeWeight }),
  button: toTextStyle(raw.type.button),
  eyebrow: toTextStyle(raw.type.eyebrow),
};

const fromSpec = {
  /** Kitchen page name (27/800). */
  kitchenTitle: toTextStyle({ size: 27, weight: 800, letterSpacing: "-0.04em" }),
  /** Promo banner title (23/800). */
  promoTitle: toTextStyle({ size: 23, weight: 800, lineHeight: 1.1, letterSpacing: "-0.03em" }),
  /** Compose card title (18/800). */
  cardHeadline: toTextStyle({ size: 18, weight: 800, letterSpacing: "-0.02em" }),
  /** Kitchen card name (17/800). */
  kitchenName: toTextStyle({ size: 17, weight: 800, letterSpacing: "-0.01em" }),
  /** Address on Home (17/800). */
  addressTitle: toTextStyle({ size: 17, weight: 800, letterSpacing: "-0.01em" }),
  /** Big stat numbers, e.g. compose kcal (36/800). */
  stat: toTextStyle({ size: 36, weight: 800, letterSpacing: "-0.03em" }),
  /** Summary row value in bold (14.5/700), e.g. "Gratuite", "−15 DH". */
  summaryRowBold: toTextStyle({ size: 14.5, weight: 700 }),
  /** Summary "Total" row (18/700). */
  total: toTextStyle({ size: 18, weight: 700 }),
  /** Stepper count (16/700). */
  count: toTextStyle({ size: 16, weight: 700 }),
  /** Secondary button / outline link (15/700). */
  buttonSmall: toTextStyle({ size: 15, weight: 700 }),
  /** List row label (15/600). */
  rowLabel: toTextStyle({ size: 15, weight: 600 }),
  /** Option row label (15.5/500). */
  optionLabel: toTextStyle({ size: 15.5, weight: 500 }),
  /** Search input text (15.5/500). */
  input: toTextStyle({ size: 15.5, weight: 500 }),
  /** Summary rows (14.5/500). */
  summaryRow: toTextStyle({ size: 14.5, weight: 500 }),
  /** Price and meta lines (14/700, 14/500). */
  price: toTextStyle({ size: 14, weight: 700 }),
  meta: toTextStyle({ size: 14, weight: 500 }),
  /** Filter chips (14/600, active 14/700) and links like "Voir tout". */
  chip: toTextStyle({ size: 14, weight: 600 }),
  chipActive: toTextStyle({ size: 14, weight: 700 }),
  link: toTextStyle({ size: 14, weight: 700 }),
  /** Category bubble label (13/600). */
  label: toTextStyle({ size: 13, weight: 600 }),
  /** Card meta: "Dar Wajba · 25–35 min" (13/500). */
  cardMeta: toTextStyle({ size: 13, weight: 500 }),
  /** Avatar initials (14/800). */
  initials: toTextStyle({ size: 14, weight: 800 }),
  /** Initials in the large 64 pt kitchen avatar (18/800). */
  initialsLarge: toTextStyle({ size: 18, weight: 800 }),
  /** Kitchen section tabs (15/600, active 15/800). */
  tab: toTextStyle({ size: 15, weight: 600 }),
  tabActive: toTextStyle({ size: 15, weight: 800 }),
  /** Info strip value (15/700) and small label (12/500). */
  infoValue: toTextStyle({ size: 15, weight: 700 }),
  small: toTextStyle({ size: 12, weight: 500 }),
  /** Grid card price (15/700) and name (14/600, line-height 1.3). */
  priceLarge: toTextStyle({ size: 15, weight: 700 }),
  gridName: toTextStyle({ size: 14, weight: 600, lineHeight: 1.3 }),
  /** Profile card name (16/800). */
  profileName: toTextStyle({ size: 16, weight: 700 }),
  /** Profile card perk (12.5/500, line-height 1.35). */
  perk: toTextStyle({ size: 12.5, weight: 500, lineHeight: 1.35 }),
  /** Legal line under login buttons (12.5/500, line-height 1.5). */
  legal: toTextStyle({ size: 12.5, weight: 500, lineHeight: 1.5 }),
  /** Big onboarding titles (30/800). */
  onboardingTitle: toTextStyle({ size: 30, weight: 800, lineHeight: 1.1, letterSpacing: "-0.04em" }),
  /** Splash tagline (17/600) and wordmark size. */
  tagline: toTextStyle({ size: 17, weight: 600 }),
  /** Phone number / code input (22/700). */
  bigInput: toTextStyle({ size: 22, weight: 700, letterSpacing: "0.02em" }),
  /** Cart bar count and total (15/800). */
  cartCount: toTextStyle({ size: 15, weight: 800 }),
  /** Small pill badge on promo banners (11.5/800). */
  badgeSmall: toTextStyle({ size: 11.5, weight: 800 }),
  /** Arabic logo text, Reem Kufi (logo only). */
  arabicLogo: { fontFamily: fontFamily.arabicLogo, fontSize: 28 } as TextStyle,
};

export const typography = { ...fromTokens, ...fromSpec };
export type TypographyVariant = keyof typeof typography;
