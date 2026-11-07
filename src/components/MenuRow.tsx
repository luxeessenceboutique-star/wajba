import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { t } from "@/i18n";
import { formatKcal, joinDot } from "@/lib/format";
import { colors, metrics } from "@/theme";
import type { MenuItem } from "@/types/models";
import { FoodImage } from "./FoodImage";
import { IconButton } from "./IconButton";
import { Price } from "./Price";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

const m = metrics.menuRow;
/** Illustration size relative to the 96 pt image. */
const ART_SCALE = 1.35;

export interface MenuRowProps {
  item: MenuItem;
  onPress?: () => void;
  onAdd?: () => void;
  /** Bottom divider (off for the last row of a section). */
  divider?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Text on the start side, square image with a "+" on the end side. */
export function MenuRow({ item, onPress, onAdd, divider = true, style }: MenuRowProps) {
  const addLabel = t("menu.add", { name: item.name });
  const kcal = item.kcal !== undefined ? joinDot([formatKcal(item.kcal), item.note]) : item.note;

  // The "+" button is a sibling of the pressable areas (never nested inside),
  // so it stays a separate, reachable button for screen readers.
  return (
    <View style={[styles.row, divider && styles.divider, style]}>
      <Touchable onPress={onPress} accessibilityRole="button" accessibilityLabel={item.name} style={styles.text}>
        <Text variant="cardTitle" numberOfLines={2}>
          {item.name}
        </Text>
        <Text variant="bodySmall" color="muted" numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceRow}>
          <Price price={item.price} oldPrice={item.oldPrice} />
          {kcal && (
            <Text variant="meta" color="muted">
              {kcal}
            </Text>
          )}
        </View>
      </Touchable>
      {item.image ? (
        <View>
          <Touchable onPress={onPress} accessible={false}>
            <FoodImage source={item.image} tint={item.tint ?? colors.tints[0]} height={m.image} width={m.image} radius={m.imageRadius} scale={ART_SCALE} />
          </Touchable>
          <IconButton icon="plus" variant="white" iconColor={colors.primary} accessibilityLabel={addLabel} onPress={onAdd} style={styles.add} />
        </View>
      ) : (
        <IconButton icon="plus" variant="surface" iconColor={colors.primary} accessibilityLabel={addLabel} onPress={onAdd} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: m.gap, paddingVertical: m.paddingY },
  divider: { borderBottomWidth: metrics.hairline, borderBottomColor: colors.border },
  text: { flex: 1, gap: metrics.gap.xs },
  priceRow: { flexDirection: "row", alignItems: "center", gap: metrics.gap.m, marginTop: metrics.gap.hair },
  add: {
    position: "absolute",
    end: m.addInset,
    bottom: m.addInset,
    width: m.addButton,
    height: m.addButton,
    borderRadius: m.addButton / 2,
  },
});
