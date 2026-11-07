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
/** Illustration size relative to the 140 pt image. */
const ART_SCALE = 1.45;

export interface MenuGridCardProps {
  item: MenuItem;
  onPress?: () => void;
  onAdd?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Card for the 2-column "Populaires" grid on a kitchen page. */
export function MenuGridCard({ item, onPress, onAdd, style }: MenuGridCardProps) {
  const kcal = item.kcal !== undefined ? joinDot([formatKcal(item.kcal), item.note]) : item.note;
  return (
    <Touchable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.name}
      accessibilityActions={onAdd ? [{ name: "add", label: t("menu.addShort") }] : undefined}
      onAccessibilityAction={(e) => e.nativeEvent.actionName === "add" && onAdd?.()}
      style={[styles.card, style]}
    >
      <FoodImage source={item.image} tint={item.tint ?? colors.tints[0]} height={m.imageHeight} radius={m.imageRadius} scale={ART_SCALE}>
        <IconButton
          icon="plus"
          variant="white"
          iconColor={colors.primary}
          accessibilityLabel={t("menu.add", { name: item.name })}
          onPress={onAdd}
          style={styles.add}
        />
      </FoodImage>
      <View style={styles.body}>
        <Text variant="cardTitle">{formatPrice(item.price)}</Text>
        <Text variant="cardTitle" numberOfLines={2}>
          {item.name}
        </Text>
        {kcal && (
          <Text variant="cardMeta" color="muted" numberOfLines={1}>
            {kcal}
          </Text>
        )}
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  card: { gap: metrics.gap.l },
  body: { gap: metrics.gap.xs },
  add: {
    position: "absolute",
    end: m.addInset,
    bottom: m.addInset,
    width: m.addButton,
    height: m.addButton,
    borderRadius: m.addButton / 2,
  },
});
