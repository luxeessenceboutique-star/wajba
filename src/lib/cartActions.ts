/** Turning dishes and composed bowls into cart lines. */
import { AccessibilityInfo } from "react-native";
import { router } from "expo-router";

import { COMPOSE_IMAGE, COMPOSE_KITCHEN_ID } from "@/data/compose";
import { colors } from "@/theme";
import { t } from "@/i18n";
import { computeComposeTotals, computeDishTotals, composeSummary, defaultDishSelections, dishSelectionSummary, needsOptions } from "@/lib/pricing";
import { useCartStore, type NewCartLine } from "@/store/cart";
import type { ComposeStep, MenuItem } from "@/types/models";

export function dishLine(item: MenuItem, selections: Record<string, string[]>, qty: number, note?: string): NewCartLine {
  const totals = computeDishTotals(item, selections, 1);
  return {
    itemId: item.id,
    name: item.name,
    summary: [dishSelectionSummary(item, selections), note?.trim()].filter(Boolean).join(" · "),
    unitPrice: totals.unitPrice,
    qty,
    kcal: totals.kcal,
    selections,
    note: note?.trim() || undefined,
    kitchenId: item.kitchenId,
    image: item.image,
    tint: item.tint,
  };
}

export function composeLine(selection: Record<ComposeStep, string[]>): NewCartLine {
  const totals = computeComposeTotals(selection);
  return {
    itemId: "compose",
    name: t("compose.lineName"),
    summary: composeSummary(selection),
    unitPrice: totals.price,
    qty: 1,
    kcal: totals.kcal,
    selections: { ...selection },
    kitchenId: COMPOSE_KITCHEN_ID,
    image: COMPOSE_IMAGE,
    tint: colors.mintTint,
  };
}

export function announceAdded(name: string) {
  AccessibilityInfo.announceForAccessibility(t("cart.added", { name }));
}

/** "+" on a menu row: add right away, or open the sheet when a choice is required. */
export function quickAdd(item: MenuItem) {
  if (needsOptions(item)) {
    router.push({ pathname: "/dish/[id]", params: { id: item.id } });
    return;
  }
  useCartStore.getState().add(dishLine(item, defaultDishSelections(item), 1));
  announceAdded(item.name);
}
