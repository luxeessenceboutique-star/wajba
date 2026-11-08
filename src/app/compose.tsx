/** 06 · Compose ta wajba — build a bowl with live kcal / macros (DESIGN_SPEC §5 · 06 and §7). */
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomBar, ComposePreview, GroupHeader, OptionRow, PrimaryButton, ScreenHeader, SelectChip, Text, Touchable, toggleSelection } from "@/components";
import { composeDefaultSelection, composeRules, emptyComposeSelection, ingredientsForStep } from "@/data/compose";
import { t, type TranslationKey } from "@/i18n";
import { announceAdded, composeLine } from "@/lib/cartActions";
import { formatKcal, formatPrice, formatPriceDelta } from "@/lib/format";
import { composeChosenNames, computeComposeTotals, mealKcalGoal } from "@/lib/pricing";
import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { colors, metrics, spacing } from "@/theme";
import type { ComposeStep } from "@/types/models";

const STEP_TITLES: Record<ComposeStep, TranslationKey> = {
  base: "compose.base",
  protein: "compose.protein",
  veg: "compose.veg",
  sauce: "compose.sauce",
  extra: "compose.extra",
};

/** Base and protein are lists of rows; vegetables, sauce and extras are chips. */
const LIST_STEPS: ComposeStep[] = ["base", "protein"];
const CHIP_STEPS: ComposeStep[] = ["veg", "sauce", "extra"];

function stepSubtitle(step: ComposeStep, count: number): string {
  const { max } = composeRules[step];
  if (step === "extra") return t("compose.extraSubtitle");
  if (max === 1) return t("options.chooseOne");
  return t("options.countOf", { count, max });
}

function stepBadge(step: ComposeStep): { label: string; tone: "dark" | "neutral" } {
  const { required, max } = composeRules[step];
  if (required) return { label: t("options.required"), tone: "dark" };
  if (Number.isFinite(max)) return { label: t("options.upTo", { max }), tone: "neutral" };
  return { label: t("options.optional"), tone: "neutral" };
}

export default function ComposeScreen() {
  const insets = useSafeAreaInsets();
  const addToCart = useCartStore((s) => s.add);
  const dailyKcalGoal = useUserStore((s) => s.dailyKcalGoal);
  const mealsPerDay = useUserStore((s) => s.mealsPerDay);
  const [selection, setSelection] = useState<Record<ComposeStep, string[]>>(() => ({ ...composeDefaultSelection }));

  const totals = computeComposeTotals(selection);
  const kcalGoal = mealKcalGoal(dailyKcalGoal, mealsPerDay);
  const chosen = composeChosenNames(selection);
  const missing = (Object.keys(composeRules) as ComposeStep[]).filter((s) => composeRules[s].required && selection[s].length === 0).map((s) => t(STEP_TITLES[s]));

  function toggle(step: ComposeStep, id: string) {
    const { max, required } = composeRules[step];
    setSelection((s) => ({ ...s, [step]: toggleSelection(s[step], id, max, required) }));
  }

  function add() {
    if (!totals.complete) return;
    addToCart(composeLine(selection));
    announceAdded(t("compose.lineName"));
    // Home → Compose → Cart (DESIGN_SPEC §4).
    router.replace("/cart");
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t("compose.title")}
        right={
          <Touchable onPress={() => setSelection(emptyComposeSelection())} accessibilityRole="button" style={styles.clear}>
            <Text variant="link" color="primary">
              {t("common.clear")}
            </Text>
          </Touchable>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: metrics.button.height + insets.bottom + spacing.sectionGap * 2 }}>
        <View style={styles.padded}>
          <ComposePreview totals={totals} kcalGoal={kcalGoal} />
          <Text variant="summaryLine" color="muted" style={styles.summary}>
            {chosen.length ? chosen.join(" · ") : t("compose.summaryEmpty")}
          </Text>

          {LIST_STEPS.map((step) => (
            <View key={step} accessibilityRole="radiogroup">
              <GroupHeader title={t(STEP_TITLES[step])} subtitle={stepSubtitle(step, selection[step].length)} badge={stepBadge(step)} />
              {ingredientsForStep(step).map((ing) => (
                <OptionRow
                  key={ing.id}
                  label={ing.name}
                  sublabel={formatKcal(ing.kcal)}
                  emphasis
                  leading={<View style={[styles.dot, { backgroundColor: ing.color }]} />}
                  trailingText={ing.priceDelta ? formatPriceDelta(ing.priceDelta) : undefined}
                  control="radio"
                  selected={selection[step].includes(ing.id)}
                  onPress={() => toggle(step, ing.id)}
                />
              ))}
            </View>
          ))}

          {CHIP_STEPS.map((step) => {
            const { max } = composeRules[step];
            const full = selection[step].length >= max;
            return (
              <View key={step}>
                <GroupHeader title={t(STEP_TITLES[step])} subtitle={stepSubtitle(step, selection[step].length)} badge={stepBadge(step)} />
                <View style={styles.chips} accessibilityRole={max === 1 ? "radiogroup" : undefined}>
                  {ingredientsForStep(step).map((ing) => {
                    const on = selection[step].includes(ing.id);
                    return (
                      <SelectChip
                        key={ing.id}
                        label={ing.name}
                        color={ing.color}
                        priceDelta={ing.priceDelta}
                        selected={on}
                        disabled={max > 1 && full && !on}
                        role={max === 1 ? "radio" : "checkbox"}
                        onPress={() => toggle(step, ing.id)}
                      />
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <BottomBar>
        <View style={styles.cta}>
          <View accessible accessibilityLabel={`${t("compose.total")} ${formatPrice(totals.price)}`}>
            <Text variant="caption" color="muted">
              {t("compose.total")}
            </Text>
            <Text variant="totalBig">{formatPrice(totals.price)}</Text>
          </View>
          <PrimaryButton
            label={t("compose.addToCart")}
            onPress={add}
            disabled={!totals.complete}
            accessibilityHint={missing.length ? t("compose.missing", { steps: missing.join(", ") }) : undefined}
            style={styles.ctaButton}
          />
        </View>
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  padded: { paddingHorizontal: spacing.pagePadding, paddingTop: metrics.gap.s },
  clear: { minHeight: metrics.iconButton.size, justifyContent: "center" },
  summary: { marginTop: metrics.gap.l },
  dot: {
    width: metrics.selectChip.listDot,
    height: metrics.selectChip.listDot,
    borderRadius: metrics.selectChip.listDot / 2,
    borderWidth: metrics.hairline,
    borderColor: colors.dotOutline,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: metrics.gap.l, paddingTop: metrics.gap.m },
  cta: { flexDirection: "row", alignItems: "center", gap: spacing.pagePadding + metrics.gap.xs },
  ctaButton: { flex: 1, width: undefined },
});
