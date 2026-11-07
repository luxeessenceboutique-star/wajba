import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { t } from "@/i18n";
import { formatPrice } from "@/lib/format";
import { colors, metrics, shadows } from "@/theme";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

const m = metrics.cartBar;

export interface CartBarProps {
  count: number;
  total: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Floating "Voir le panier" bar, shown on Home and Kitchen while the cart isn't empty. */
export function CartBar({ count, total, onPress, style }: CartBarProps) {
  return (
    <Touchable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t("cart.seeCartLabel", { count, total: formatPrice(total) })}
      style={[styles.bar, style]}
    >
      <View style={styles.count}>
        <Text variant="cartCount" color="primary">
          {count}
        </Text>
      </View>
      <Text variant="button" color="onPrimary" style={styles.label} numberOfLines={1}>
        {t("cart.seeCart")}
      </Text>
      <View style={styles.total}>
        <Text variant="cartCount" color="onPrimary">
          {formatPrice(total)}
        </Text>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: m.height,
    borderRadius: m.radius,
    backgroundColor: colors.primary,
    paddingStart: m.paddingStart,
    paddingEnd: m.paddingEnd,
    flexDirection: "row",
    alignItems: "center",
    gap: m.gap,
    boxShadow: shadows.cartBar,
  },
  count: {
    width: m.countSize,
    height: m.countSize,
    borderRadius: m.countSize / 2,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { flex: 1 },
  total: {
    minHeight: m.totalHeight,
    borderRadius: m.totalHeight / 2,
    paddingHorizontal: m.totalPaddingX,
    backgroundColor: colors.onPrimaryTranslucent,
    justifyContent: "center",
  },
});
