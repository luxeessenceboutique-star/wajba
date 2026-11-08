import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cartCount, cartSubtotal, useCartStore } from "@/store/cart";
import { metrics, spacing } from "@/theme";
import { CartBar } from "./CartBar";

/** Height to reserve at the bottom of a scroll view when the cart bar may show. */
export const FLOATING_CART_SPACE = metrics.cartBar.height + metrics.gap.xl * 2;

/**
 * "Voir le panier" bar fixed to the bottom of Home and Kitchen, shown only when
 * the cart isn't empty. `aboveTabBar`: the screen already ends at the tab bar,
 * so no safe-area inset is needed.
 */
export function FloatingCartBar({ aboveTabBar = false }: { aboveTabBar?: boolean }) {
  const insets = useSafeAreaInsets();
  const lines = useCartStore((s) => s.lines);
  if (lines.length === 0) return null;
  return (
    <View style={[styles.wrap, { bottom: (aboveTabBar ? 0 : insets.bottom) + metrics.gap.xl }]} pointerEvents="box-none">
      <CartBar count={cartCount(lines)} total={cartSubtotal(lines)} onPress={() => router.push("/cart")} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", start: spacing.pagePadding, end: spacing.pagePadding },
});
