/** Commandes — order history (not designed in v3, built in the same style). Opens tracking. */
import { ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge, EmptyState, Icon, KitchenAvatar, Text, Touchable } from "@/components";
import { getKitchen } from "@/data/kitchens";
import { t } from "@/i18n";
import { formatPrice } from "@/lib/format";
import { formatClock, orderProgress } from "@/lib/orders";
import { useNow } from "@/lib/useNow";
import { useOrdersStore } from "@/store/orders";
import { colors, metrics, spacing } from "@/theme";

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const orders = useOrdersStore((s) => s.orders);
  const now = useNow(5000, orders.length > 0);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + metrics.gap.xl }]}>
        <Text variant="screenTitleLarge" accessibilityRole="header">
          {t("orders.title")}
        </Text>
        {orders.length === 0 ? (
          <EmptyState icon="receipt" title={t("orders.emptyTitle")} text={t("orders.emptyText")} actionLabel={t("orders.browse")} onAction={() => router.navigate("/home")} style={styles.empty} />
        ) : (
          orders.map((order, i) => {
            const progress = orderProgress(order, now);
            const kitchens = [...new Set(order.lines.map((l) => l.kitchenId))].map((id) => getKitchen(id)).filter((k) => k !== undefined);
            const count = order.lines.reduce((n, l) => n + l.qty, 0);
            const status =
              order.schedule !== "asap"
                ? { label: t("orders.scheduled"), tone: "info" as const }
                : progress.status === "delivered"
                  ? { label: t("orders.delivered"), tone: "neutral" as const }
                  : { label: t("orders.inProgress"), tone: "accent" as const };
            const summary = count === 1 ? t("orders.lineOne", { total: formatPrice(order.total) }) : t("orders.line", { count, total: formatPrice(order.total) });
            return (
              <Touchable
                key={order.id}
                onPress={() => router.push({ pathname: "/order/[id]", params: { id: order.id } })}
                accessibilityRole="button"
                accessibilityLabel={`${kitchens.map((k) => k.name).join(" + ")}, ${summary}, ${status.label}`}
                style={[styles.row, i < orders.length - 1 && styles.divider]}
              >
                <View style={styles.avatars}>
                  {kitchens.map((k, j) => (
                    <KitchenAvatar key={k.id} kitchen={k} size={metrics.avatar.small} bordered style={j > 0 && styles.overlap} />
                  ))}
                </View>
                <View style={styles.text}>
                  <Text variant="cardTitle" numberOfLines={1}>
                    {kitchens.map((k) => k.name).join(" + ")}
                  </Text>
                  <Text variant="caption" color="muted">
                    {`${t("orders.placedAt", { time: formatClock(new Date(order.placedAt)) })} · ${summary}`}
                  </Text>
                </View>
                <Badge label={status.label} tone={status.tone} />
                <Icon name="chevronRight" size={metrics.icon.medium} color={colors.muted} />
              </Touchable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.pagePadding, paddingBottom: spacing.sectionGap, gap: metrics.gap.xs },
  empty: { flexGrow: 0, marginTop: spacing.sectionGap },
  row: { minHeight: metrics.listRow.minHeight + metrics.gap.xl, flexDirection: "row", alignItems: "center", gap: metrics.gap.xl },
  divider: { borderBottomWidth: metrics.hairline, borderBottomColor: colors.border },
  avatars: { flexDirection: "row" },
  overlap: { marginStart: -metrics.gap.l },
  text: { flex: 1, gap: metrics.gap.hair },
});
