/**
 * Price, calorie and total calculations — DESIGN_SPEC.md §7.
 * Pure functions so screens and stores share one source of truth.
 */
import { COMPOSE_BASE_PRICE, composeIngredients, composeRules } from "@/data/compose";
import { DELIVERY_FEE, FREE_DELIVERY_FROM, NOJOUM_PER_DH, PROMO_CODES } from "@/data/rules";
import type { ComposeStep, MenuItem } from "@/types/models";

// ── Dish sheet ──────────────────────────────────────────────────────

export interface DishTotals {
  unitPrice: number;
  total: number;
  kcal?: number;
  protein?: number;
  /** Every required group has a selection → "Ajouter" can be enabled. */
  complete: boolean;
}

/** total = (base + size delta + selected option deltas) × qty; kcal/protein follow the options. */
export function computeDishTotals(item: MenuItem, selections: Record<string, string[]>, qty: number): DishTotals {
  let unitPrice = item.price;
  let kcal = item.kcal;
  let protein = item.protein;
  let complete = true;

  for (const group of item.optionGroups ?? []) {
    const chosen = selections[group.id] ?? [];
    if (group.required && chosen.length < Math.max(1, group.min)) complete = false;
    for (const option of group.options) {
      if (!chosen.includes(option.id)) continue;
      unitPrice += option.priceDelta;
      if (kcal !== undefined && option.kcalDelta) kcal += option.kcalDelta;
      if (protein !== undefined && option.proteinDelta) protein += option.proteinDelta;
    }
  }

  return { unitPrice, total: unitPrice * qty, kcal, protein, complete };
}

export function defaultDishSelections(item: MenuItem): Record<string, string[]> {
  return Object.fromEntries((item.optionGroups ?? []).map((g) => [g.id, g.defaultSelected ?? []]));
}

// ── Compose ta wajba ───────────────────────────────────────────────

export interface ComposeTotals {
  price: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  complete: boolean;
}

/** Base price 45 DH + each ingredient's priceDelta; macros are sums. */
export function computeComposeTotals(selection: Record<ComposeStep, string[]>): ComposeTotals {
  const chosen = composeIngredients.filter((i) => selection[i.step]?.includes(i.id));
  const sum = (key: "kcal" | "protein" | "carbs" | "fat" | "priceDelta") => chosen.reduce((acc, i) => acc + i[key], 0);
  const complete = (Object.keys(composeRules) as ComposeStep[]).every((step) => !composeRules[step].required || (selection[step]?.length ?? 0) > 0);
  return {
    price: chosen.length ? COMPOSE_BASE_PRICE + sum("priceDelta") : 0,
    kcal: sum("kcal"),
    protein: sum("protein"),
    carbs: sum("carbs"),
    fat: sum("fat"),
    complete,
  };
}

/** Per-meal kcal goal: daily goal ÷ meals (DESIGN_SPEC §7 — not a hard-coded 900). */
export function mealKcalGoal(dailyKcalGoal: number, mealsPerDay: number): number {
  return Math.round(dailyKcalGoal / Math.max(1, mealsPerDay));
}

// ── Cart / checkout ────────────────────────────────────────────────

export interface OrderTotals {
  subtotal: number;
  deliveryFee: number;
  /** Fee before the free-delivery rule, to show it struck through. */
  baseDeliveryFee: number;
  freeDelivery: boolean;
  discount: number;
  tip: number;
  total: number;
  nojoum: number;
}

/** One delivery fee per order (even with several kitchens), free from 150 DH. Tip added after discounts. */
export function computeOrderTotals({ subtotal, promoCode, tip = 0, firstOrder = false }: { subtotal: number; promoCode?: string; tip?: number; firstOrder?: boolean }): OrderTotals {
  const freeDelivery = subtotal >= FREE_DELIVERY_FROM;
  const deliveryFee = subtotal > 0 && !freeDelivery ? DELIVERY_FEE : 0;
  const promo = PROMO_CODES.find((p) => p.code === promoCode?.trim().toUpperCase());
  let discount = 0;
  if (promo && (!promo.firstOrderOnly || firstOrder)) {
    discount = promo.kind === "percent" ? Math.round((subtotal * promo.value) / 100) : promo.value;
  }
  discount = Math.min(discount, subtotal);
  const total = subtotal + deliveryFee - discount + tip;
  return { subtotal, deliveryFee, baseDeliveryFee: DELIVERY_FEE, freeDelivery, discount, tip, total, nojoum: Math.round(total * NOJOUM_PER_DH) };
}

// ── Cart line summaries ────────────────────────────────────────────

/** Short label for an option: "Duo · 2 pers." → "Duo". */
function shortLabel(label: string): string {
  return label.split(" · ")[0];
}

/** "Duo · Har · Khobz dar · Sans oignons" — chosen options in group order. */
export function dishSelectionSummary(item: MenuItem, selections: Record<string, string[]>): string {
  const parts: string[] = [];
  for (const group of item.optionGroups ?? []) {
    const chosen = selections[group.id] ?? [];
    for (const option of group.options) if (chosen.includes(option.id)) parts.push(shortLabel(option.label));
  }
  return parts.join(" · ");
}

/** "Quinoa · Poulet chermoula · Zaalouk, avocat, pois chiches · Chermoula" (as on the cart line). */
export function composeSummary(selection: Record<ComposeStep, string[]>): string {
  const names = (step: ComposeStep) => composeIngredients.filter((i) => i.step === step && selection[step]?.includes(i.id)).map((i) => i.name);
  const veg = names("veg").map((name, i) => (i === 0 ? name : name.toLowerCase())).join(", ");
  return [...names("base"), ...names("protein"), veg, ...names("sauce"), ...names("extra")].filter(Boolean).join(" · ");
}

/** Every chosen ingredient name, in screen order (Compose summary line). */
export function composeChosenNames(selection: Record<ComposeStep, string[]>): string[] {
  return composeIngredients.filter((i) => selection[i.step]?.includes(i.id)).map((i) => i.name);
}

/** Required option groups still missing a choice (dish sheet). */
export function missingRequiredGroups(item: MenuItem, selections: Record<string, string[]>): string[] {
  return (item.optionGroups ?? []).filter((g) => g.required && (selections[g.id]?.length ?? 0) < Math.max(1, g.min)).map((g) => g.title);
}

/** True when the dish can't be added without opening its sheet. */
export function needsOptions(item: MenuItem): boolean {
  return (item.optionGroups ?? []).some((g) => g.required && !(g.defaultSelected?.length));
}
