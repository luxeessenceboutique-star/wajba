import { StyleSheet, View } from "react-native";

import { t } from "@/i18n";
import { formatCount, formatRating } from "@/lib/format";
import { colors, fontFamily, metrics, type TypographyVariant } from "@/theme";
import { Icon } from "./Icon";
import { Text } from "./Text";

export interface RatingProps {
  rating: number;
  count?: number;
  /** Text size: "price" (14) in dish cards, "cardMeta" (13) in kitchen cards. */
  variant?: Extract<TypographyVariant, "price" | "cardMeta">;
}

/** ★ 4,8 (2,1k) */
export function Rating({ rating, count, variant = "price" }: RatingProps) {
  const label = count !== undefined
    ? t("common.ratingWithCount", { rating: formatRating(rating), count: formatCount(count) })
    : t("common.rating", { rating: formatRating(rating) });
  return (
    <View style={styles.row} accessible accessibilityLabel={label}>
      <Icon name="star" size={metrics.icon.small} color={colors.star} />
      <Text variant={variant} style={styles.value}>
        {formatRating(rating)}
      </Text>
      {count !== undefined && (
        <Text variant={variant === "price" ? "meta" : "cardMeta"} color="inkSecondary">
          ({formatCount(count)})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: metrics.gap.tight },
  value: { fontFamily: fontFamily[700] },
});
