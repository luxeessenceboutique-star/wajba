import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { t } from "@/i18n";
import { formatKcal, formatPrice, joinDot } from "@/lib/format";
import { colors, metrics } from "@/theme";
import type { MenuItem } from "@/types/models";
import { FoodImage } from "./FoodImage";
import { IconButton } from "./IconButton";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

const m = metrics.menuGridCard;
/** Illustration size relative to the 140 pt image (200 / 140 in the design). */
const ART_SCALE = 1.43;

export interface MenuGridCardProps {
  item: MenuItem;
  onPress?: () => void;
  onAdd?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Card for the 2-column "Populaires" grid on a kitchen page. */
export function MenuGridCard({ item, onPress, onAdd, style }: MenuGridCardProps) {
  const kcal = item.kcal !== undefined ? joinDot([formatKcal(item.kcal), item.note]) : item.note;
  // "+" is a sibling of the pressable areas (never nested), so it stays reachable for screen readers.
  return (
    <View style={[styles.card, style]}>
      <View>
        <Touchable onPress={onPress} accessible={false}>
          <FoodImage source={item.image} tint={item.tint ?? colors.tints[0]} height={m.imageHeight} radius={m.imageRadius} scale={ART_SCALE} />
        </Touchable>
        <IconButton
          icon="plus"
          variant="floating"
          iconColor={colors.primary}
          accessibilityLabel={t("menu.add", { name: item.name })}
          onPress={onAdd}
          style={styles.add}
        />
      </View>
      <Touchable onPress={onPress} accessibilityRole="button" accessibilityLabel={item.name} style={styles.body}>
        <View style={styles.priceRow}>
          <Text variant="priceLarge">{formatPrice(item.price)}</Text>
          {item.oldPrice !== undefined && item.oldPrice > item.price && (
            <Text variant="cardMeta" color="mutedLight" strike>
              {formatPrice(item.oldPrice)}
            </Text>
          )}
        </View>
        <Text variant="gridName" numberOfLines={2}>
          {item.name}
        </Text>
        {kcal && (
          <Text variant="caption" color="muted" numberOfLines={1}>
            {kcal}
          </Text>
        )}
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: metrics.gap.s },
  body: { gap: metrics.gap.s },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: metrics.gap.s },
  add: {
    position: "absolute",
    end: m.addInset,
    bottom: m.addInset,
    width: m.addButton,
    height: m.addButton,
    borderRadius: m.addButton / 2,
  },
});
