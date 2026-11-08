/**
 * 07 · Panier — first version: cart lines with steppers and the subtotal.
 * Phase 4 adds "Souvent pris ensemble", switches, promo codes, delivery and checkout.
 */
import { ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomBar, CartLineRow, EmptyState, KitchenAvatar, Notice, PrimaryButton, ScreenHeader, SummaryBox, Text, Touchable } from "@/components";
import { getKitchen } from "@/data/kitchens";
import { t } from "@/i18n";
import { formatPrice } from "@/lib/format";
import { cartKitchenIds, cartSubtotal, useCartStore } from "@/store/cart";
import { colors, metrics, spacing } from "@/theme";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const lines = useCartStore((s) => s.lines);
  const setQty = useCartStore((s) => s.setQty);
  const clear = useCartStore((s) => s.clear);
  const subtotal = cartSubtotal(lines);
  const kitchens = cartKitchenIds(lines).map((id) => getKitchen(id)).filter((k) => k !== undefined);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t("cart.title")}
        right={
          lines.length > 0 ? (
            <Touchable onPress={clear} accessibilityRole="button" accessibilityLabel={t("cart.clearLabel")} style={styles.clear}>
              <Text variant="link" color="terracotta">
                {t("common.clear")}
              </Text>
            </Touchable>
          ) : undefined
        }
      />

      {lines.length === 0 ? (
        <EmptyState icon="receipt" title={t("cart.emptyTitle")} text={t("cart.emptyText")} actionLabel={t("cart.browse")} onAction={() => router.dismissTo("/home")} />
      ) : (
        <>
          <ScrollView contentContainerStyle={[styles.content, { paddingBottom: metrics.button.height + insets.bottom + spacing.sectionGap * 2 }]}>
            {/* Kitchens line: stacked avatars + "Dar Wajba + Wajba Fit · une seule livraison" */}
            <View style={styles.kitchens}>
              <View style={styles.avatars}>
                {kitchens.map((k, i) => (
                  <KitchenAvatar key={k.id} kitchen={k} size={metrics.avatar.small} bordered style={i > 0 && styles.avatarOverlap} />
                ))}
              </View>
              <Text variant="bodySmall" color="muted" style={styles.flex} numberOfLines={2}>
                {t("cart.oneDelivery", { kitchens: kitchens.map((k) => k.name).join(" + ") })}
              </Text>
            </View>

            {lines.map((line, i) => (
              <CartLineRow key={line.id} line={line} onQtyChange={(qty) => setQty(line.id, qty)} divider={i < lines.length - 1} />
            ))}

            <SummaryBox rows={[]} total={{ label: t("summary.subtotal"), value: formatPrice(subtotal) }} style={styles.summary} />
            <Notice icon="clock" text={t("cart.checkoutSoon")} />
          </ScrollView>

          <BottomBar>
            <PrimaryButton label={t("cart.order", { total: formatPrice(subtotal) })} disabled />
          </BottomBar>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  clear: { minHeight: metrics.iconButton.size, justifyContent: "center" },
  content: { paddingHorizontal: spacing.pagePadding, gap: metrics.gap.xs },
  kitchens: { flexDirection: "row", alignItems: "center", gap: metrics.gap.l, paddingBottom: metrics.gap.xs },
  avatars: { flexDirection: "row" },
  avatarOverlap: { marginStart: -metrics.gap.l },
  summary: { marginTop: spacing.sectionGap, marginBottom: metrics.gap.xl },
});
