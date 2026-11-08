import { StyleSheet, View } from "react-native";

import { t } from "@/i18n";
import { formatKcal, formatPrice } from "@/lib/format";
import { colors, fontFamily, metrics } from "@/theme";
import type { CartLine } from "@/types/models";
import { FoodImage } from "./FoodImage";
import { Stepper } from "./Stepper";
import { Text } from "./Text";

const m = metrics.cartLine;
const ART_SCALE = 1.35;

export interface CartLineRowProps {
  line: CartLine;
  onQtyChange?: (qty: number) => void;
  /** Order details: show "2 ×" instead of the stepper. */
  readOnly?: boolean;
  divider?: boolean;
}

/** Cart line: image, name, chosen options, line price (+ kcal for composed bowls), compact stepper (0 removes). */
export function CartLineRow({ line, onQtyChange, readOnly = false, divider = true }: CartLineRowProps) {
  return (
    <View style={[styles.row, divider && styles.divider]}>
      <FoodImage source={line.image} tint={line.tint ?? colors.tints[0]} height={m.image} width={m.image} radius={m.imageRadius} scale={ART_SCALE} />
      <View style={styles.text}>
        <Text variant="cardTitle" numberOfLines={1}>
          {line.name}
        </Text>
        {line.summary ? (
          <Text variant="bodySmall" color="muted" numberOfLines={2}>
            {line.summary}
          </Text>
        ) : null}
        <Text variant="price">
          {formatPrice(line.unitPrice * line.qty)}
          {line.itemId === "compose" && line.kcal !== undefined && (
            <Text variant="caption" color="mint" style={styles.kcal}>
              {` · ${formatKcal(line.kcal)}`}
            </Text>
          )}
        </Text>
      </View>
      {readOnly || !onQtyChange ? (
        <Text variant="price" accessibilityLabel={t("cart.lineQuantity", { name: line.name, count: line.qty })}>
          {`${line.qty} ×`}
        </Text>
      ) : (
        <View accessibilityLabel={t("cart.lineQuantity", { name: line.name, count: line.qty })}>
          <Stepper value={line.qty} onChange={onQtyChange} min={0} compact />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: m.gap, paddingVertical: m.paddingY },
  divider: { borderBottomWidth: metrics.hairline, borderBottomColor: colors.border },
  text: { flex: 1, gap: metrics.gap.hair },
  kcal: { fontFamily: fontFamily[700] },
});
