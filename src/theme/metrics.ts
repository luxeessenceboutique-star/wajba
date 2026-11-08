/**
 * Component sizes from DESIGN_SPEC.md §3 (and the screen sources) that are
 * not in tokens.json. Kept in one place so components hold no magic numbers.
 * All values are points.
 */
import { radius, size, spacing } from "./tokens";

export const metrics = {
  /** Small gaps inside components (text stacks, icon + label). */
  gap: { hair: 2, tight: 3, xs: 4, s: 6, m: 8, l: 10, xl: 12, xxl: 14 },
  button: { height: size.buttonHeight, radius: radius.button, heightSmall: 48, borderWidth: 1.5, paddingX: 20, gap: 10 },
  iconButton: { size: size.iconButton, small: 34, dot: 9, dotBorder: 2, dotTop: 10, dotEnd: 11 },
  icon: { size: size.icon, stroke: size.iconStroke, small: 14, medium: 18, large: 22, tab: 24 },
  search: { height: 50, radius: 25, paddingX: 18, gap: 10 },
  categoryBubble: { size: size.categoryBubble, gap: 6, columns: 4, rowGap: 16, columnGap: 8 },
  filterChip: { height: size.chipHeight, radius: 20, paddingX: 16, gap: 8 },
  promoBanner: {
    width: 318, height: 150, radius: radius.card, padding: 18, gap: 6, titleMaxWidth: 180,
    badgeHeight: 24, badgePaddingX: 9, imageSize: 190, imageOffsetEnd: -34, imageOffsetBottom: -40,
    carouselGap: 12, dot: 6, dotActiveWidth: 18,
  },
  composeCard: { height: 116, radius: radius.card, padding: 16, imageSize: 152, imageOffsetEnd: -26, imageOffsetTop: -18, textMaxWidth: 200 },
  dishCard: { width: 240, imageHeight: 150, radius: radius.image, gap: 8, badgeInset: 10, heartInset: 8 },
  kitchenCard: { coverHeight: 156, radius: radius.image, avatar: 48, avatarBorder: 3, avatarInset: 12, avatarOverlap: 20, badgeInset: 10 },
  menuRow: { image: 96, imageRadius: 16, addButton: 30, addInset: 6, gap: 14, paddingY: 14 },
  menuGridCard: { imageHeight: 140, imageRadius: 16, addButton: 36, addInset: 8, gap: 12, columns: 2 },
  badge: { height: 26, radius: 8, pillRadius: 13, paddingX: 8, pillPaddingX: 10, tagHeight: 28, tagRadius: 14 },
  optionGroup: { rowMinHeight: spacing.rowMinHeight, control: size.radio, checkboxRadius: radius.checkbox, radioDot: 10, borderWidth: 2, headerGap: 2 },
  selectChip: { height: size.selectChipHeight, radius: 22, dot: 24, paddingStart: 8, paddingEnd: 14, gap: 8, listDot: 30 },
  stepper: { button: 46, padding: 4, compactHeight: 36, compactButton: 32, borderWidth: 1.5, minCountWidth: 28 },
  cartBar: { height: size.cartBarHeight, radius: 28, countSize: 36, totalHeight: 40, totalPaddingX: 14, paddingStart: 10, paddingEnd: 8, gap: 12 },
  tabBar: { height: size.tabBarHeight, contentHeight: 62, paddingX: 8, paddingTop: 8, minBottomPadding: 8, iconLabelGap: 3 },
  switch: { ...size.switch, padding: 3 },
  summaryBox: { radius: radius.image, padding: 16, rowGap: 8 },
  listRow: { minHeight: spacing.listRowMinHeight, iconCircle: 36, gap: 14 },
  progress: { height: 6, radius: 3, gap: 6, segments: 4 },
  avatar: { small: 30, medium: 48, large: 64, borderLarge: 4 },
  screenHeader: { minHeight: 44, paddingTop: 8, gap: 12 },
  emptyState: { icon: 64, maxWidth: 300, gap: 10, paddingY: 40 },
  sheet: { radius: 28, padding: 20, handleWidth: 36, handleHeight: 4, maxHeightRatio: 0.85 },
  sectionTabs: { height: 48, gap: 22, underline: 3 },
  infoStrip: { radius: 16, paddingY: 10, paddingX: 4 },
  notice: { minHeight: 48, radius: 14, paddingX: 14, gap: 10 },
  kitchenPage: { coverHeight: 220, coverArtScale: 1.48, compactHeaderHeight: 56, avatarOverlap: 32 },
  splash: { markWidth: 84, wordmarkSize: 58, arabicSize: 26, sheetPaddingTop: 28, sheetPaddingX: 20, sheetGap: 18, buttonGap: 10 },
  infoChip: { height: 30, radius: 15, paddingX: 10, gap: 6 },
  textArea: { minHeight: 92, radius: 14, paddingX: 14, paddingY: 12 },
  composePreview: { height: 156, radius: 22, imageSize: 200, imageOffsetStart: -44, imageOffsetTop: -22, contentStart: 168, contentEnd: 14, contentTop: 16, contentBottom: 14 },
  goalPill: { height: 24, radius: 12, paddingX: 9 },
  cartLine: { image: 64, imageRadius: 16, gap: 14, paddingY: 14 },
  dishSheet: { heroHeight: 300, heroArtScale: 1.2, buttonInset: 16 },
  profileCard: { minHeight: 150, radius: 20, padding: 14, circle: 72, art: 66, check: 24, checkInset: 12, gap: 10 },
  hairline: 1,
  /** Opacity of inert rows/chips (group max reached) and disabled stepper buttons. */
  opacity: { inert: 0.45, disabled: 0.35, pressed: 0.72 },
  sectionAction: { minHeight: 32 },
} as const;
