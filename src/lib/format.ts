/**
 * Number formatting shared by every screen.
 * A no-break space keeps "55 DH" and "−15 %" on one line.
 */
import { t } from "@/i18n";

const NBSP = " ";
const MINUS = "−";
const EN_DASH = "–";

/** 55 → "55 DH" */
export function formatPrice(amount: number): string {
  return `${Math.round(amount)}${NBSP}${t("common.currency")}`;
}

/** 38 → "+38 DH", 0 → "inclus", -15 → "−15 DH" */
export function formatPriceDelta(delta: number, zeroLabel: string = t("common.included")): string {
  if (delta === 0) return zeroLabel;
  const sign = delta > 0 ? "+" : MINUS;
  return `${sign}${formatPrice(Math.abs(delta))}`;
}

/** 15 → "−15 %" */
export function formatDiscountPercent(percent: number): string {
  return `${MINUS}${Math.round(percent)}${NBSP}%`;
}

/** Discount percent between an old and a new price (65 → 55 gives 15). */
export function discountPercent(price: number, oldPrice: number): number {
  return oldPrice > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
}

// Decimals are formatted by hand (not Intl) so output is identical on every
// device — Hermes' Intl support depends on the platform.
function decimal(value: number, digits: number): string {
  return value.toFixed(digits).replace(".", t("common.decimalSeparator"));
}

/** 4.8 → "4,8" */
export function formatRating(rating: number): string {
  return decimal(rating, 1);
}

/** 2100 → "2,1k", 1000 → "1k", 980 → "980" */
export function formatCount(count: number): string {
  if (count < 1000) return String(count);
  const thousands = Math.round(count / 100) / 10;
  return `${Number.isInteger(thousands) ? thousands : decimal(thousands, 1)}k`;
}

/** (25, 35) → "25–35 min" */
export function formatEta(min: number, max: number): string {
  return `${min}${EN_DASH}${max}${NBSP}${t("common.minutes")}`;
}

/** 640 → "640 kcal" */
export function formatKcal(kcal: number): string {
  return `${Math.round(kcal)}${NBSP}${t("common.kcal")}`;
}

/** 42 → "42 g prot." */
export function formatProtein(grams: number): string {
  return `${Math.round(grams)}${NBSP}${t("common.proteinShort")}`;
}

/** Join parts with the middle dot used across the designs. */
export function joinDot(parts: (string | undefined | false)[]): string {
  return parts.filter(Boolean).join(" · ");
}
