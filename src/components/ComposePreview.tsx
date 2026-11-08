import { StyleSheet, View } from "react-native";

import { t } from "@/i18n";
import type { ComposeTotals } from "@/lib/pricing";
import { colors, metrics, typography } from "@/theme";
import { FoodImage } from "./FoodImage";
import { Text } from "./Text";

const m = metrics.composePreview;

export interface ComposePreviewProps {
  totals: ComposeTotals;
  /** Per-meal kcal goal; above it the pill turns terracotta. */
  kcalGoal: number;
  image?: string;
}

/** Live nutrition card at the top of Compose: kcal, macros, goal pill. */
export function ComposePreview({ totals, kcalGoal, image = "bowl" }: ComposePreviewProps) {
  const ok = totals.kcal <= kcalGoal;
  const macros = [
    { value: totals.protein, label: t("compose.proteinShort") },
    { value: totals.carbs, label: t("compose.carbsShort") },
    { value: totals.fat, label: t("compose.fatShort") },
  ];
  return (
    <View style={styles.card}>
      <FoodImage
        source={image}
        tint="transparent"
        height={m.height}
        scale={m.imageSize / m.height}
        placement="topStart"
        offset={{ x: m.imageOffsetStart, y: m.imageOffsetTop }}
        accessibilityLabel={t("compose.preview")}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content} accessible accessibilityLiveRegion="polite" accessibilityLabel={[`${totals.kcal} ${t("compose.kcalUnit")}`, ...macros.map((x) => `${x.value} g ${x.label}`), ok ? t("compose.goalOk") : t("compose.goalOver", { kcal: kcalGoal })].join(", ")}>
        <View style={styles.kcalRow}>
          <Text variant="stat" style={styles.kcal}>
            {totals.kcal}
          </Text>
          <Text variant="chip" color="inkSecondary">
            {t("compose.kcalUnit")}
          </Text>
        </View>
        <View style={styles.macros}>
          {macros.map((x) => (
            <View key={x.label} style={styles.macro}>
              <Text variant="infoValue">{t("compose.grams", { value: x.value })}</Text>
              <Text variant="small" color="inkSecondary">
                {x.label}
              </Text>
            </View>
          ))}
        </View>
        <View style={[styles.goal, ok ? styles.goalOk : styles.goalOver]}>
          <Text variant="badge" color={ok ? colors.mintOnTint : colors.terracottaOnTint}>
            {ok ? t("compose.goalOk") : t("compose.goalOver", { kcal: kcalGoal })}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { height: m.height, borderRadius: m.radius, backgroundColor: colors.mintTint, overflow: "hidden" },
  content: { position: "absolute", start: m.contentStart, end: m.contentEnd, top: m.contentTop, bottom: m.contentBottom, justifyContent: "space-between" },
  kcalRow: { flexDirection: "row", alignItems: "baseline", gap: metrics.gap.xs },
  kcal: { lineHeight: typography.stat.fontSize },
  macros: { flexDirection: "row", gap: metrics.gap.s },
  macro: { flex: 1 },
  goal: { alignSelf: "flex-start", minHeight: metrics.goalPill.height, borderRadius: metrics.goalPill.radius, paddingHorizontal: metrics.goalPill.paddingX, justifyContent: "center" },
  goalOk: { backgroundColor: colors.white },
  goalOver: { backgroundColor: colors.terracottaTint },
});
