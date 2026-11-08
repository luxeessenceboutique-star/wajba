/** 09 · Suivi — order tracking with the mock status timeline (DESIGN_SPEC §5 · 09). */
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState, Icon, IconButton, PrimaryButton, ProgressSegments, ScreenHeader, Sheet, Text, Touchable, TrackingMap, CartLineRow, type IconName } from "@/components";
import { getKitchen } from "@/data/kitchens";
import { savedCard } from "@/data/user";
import { t } from "@/i18n";
import { formatPrice } from "@/lib/format";
import { formatClock, orderProgress } from "@/lib/orders";
import { ORDER_DEMO_TIMELINE } from "@/data/rules";
import { useNow } from "@/lib/useNow";
import { useOrder } from "@/store/orders";
import { useUserStore } from "@/store/user";
import { colors, metrics, shadows, spacing } from "@/theme";
import type { Order, PaymentMethod } from "@/types/models";

const STEP_LABELS = [t("tracking.confirmed"), t("tracking.preparing"), t("tracking.onTheWay"), t("tracking.delivered")];

function paymentLabel(method: PaymentMethod): string {
  switch (method) {
    case "card":
      return t("checkout.cardSaved", savedCard);
    case "apple_pay":
      return t("checkout.applePay");
    case "google_pay":
      return t("checkout.googlePay");
    case "wallet":
      return t("checkout.wallet");
    case "cash":
      return t("checkout.cash");
  }
}

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrder(id);
  if (!order) {
    return (
      <View style={styles.screen}>
        <ScreenHeader />
        <EmptyState icon="receipt" title={t("tracking.notFoundTitle")} text={t("tracking.notFoundText")} actionLabel={t("tracking.backHome")} onAction={() => router.replace("/home")} />
      </View>
    );
  }
  return <Tracking order={order} />;
}

function Tracking({ order }: { order: Order }) {
  const insets = useSafeAreaInsets();
  const addresses = useUserStore((s) => s.addresses);
  const address = addresses.find((a) => a.id === order.addressId) ?? addresses[0];
  const [helpOpen, setHelpOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const asap = order.schedule === "asap";
  const now = useNow(1000, asap);
  const progress = orderProgress(order, now);
  const delivered = progress.status === "delivered";
  const rider = order.rider;
  const kitchenNames = [...new Set(order.lines.map((l) => l.kitchenId))].map((k) => getKitchen(k)?.name).filter(Boolean).join(" + ");
  const itemCount = order.lines.reduce((n, l) => n + l.qty, 0);

  const heading = !asap
    ? t("tracking.scheduledTitle")
    : delivered
      ? t("tracking.deliveredTitle")
      : t("tracking.in", { minutes: progress.minutesLeft });
  // The promised arrival time stays fixed (the demo timeline is sped up, the clock isn't).
  const eyebrow = !asap
    ? t("tracking.scheduledEta", { time: order.schedule })
    : delivered
      ? t("tracking.deliveredAt", { time: formatClock(new Date(order.placedAt + ORDER_DEMO_TIMELINE.delivered * 1000)) })
      : t("tracking.eta", { time: formatClock(new Date(order.etaISO)) });
  const sentence = !asap
    ? t("tracking.scheduledText", { time: order.schedule })
    : {
        confirmed: t("tracking.confirmedText"),
        preparing: t("tracking.preparingText", { kitchens: kitchenNames }),
        on_the_way: t("tracking.onTheWayText", { rider: rider?.name ?? "" }),
        delivered: t("tracking.deliveredText"),
        cancelled: "",
      }[progress.status];

  const rows: { icon: IconName; label: string; onPress?: () => void }[] = [
    { icon: "mapPin", label: `${address.label} · ${address.line.split(",").slice(0, 2).join(",")}` },
    {
      icon: "receipt",
      label:
        itemCount === 1
          ? t("tracking.summaryLineOne", { total: formatPrice(order.total), payment: paymentLabel(order.payment) })
          : t("tracking.summaryLine", { count: itemCount, total: formatPrice(order.total), payment: paymentLabel(order.payment) }),
      onPress: () => setDetailsOpen(true),
    },
    { icon: "help", label: t("tracking.problem"), onPress: () => setHelpOpen(true) },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.sectionGap }}>
        <View>
          <TrackingMap progress={progress.rideProgress} streetName={address.line.split(",")[0]} accessibilityLabel={t("tracking.mapLabel")} />
          <View style={[styles.mapButtons, { top: insets.top + metrics.gap.m }]}>
            <IconButton icon="chevronLeft" variant="floating" accessibilityLabel={t("common.back")} onPress={() => router.back()} />
            <Touchable onPress={() => setHelpOpen(true)} accessibilityRole="button" style={styles.helpPill}>
              <Text variant="link">{t("tracking.help")}</Text>
            </Touchable>
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.status} accessible accessibilityLiveRegion="polite" accessibilityLabel={`${eyebrow}. ${heading}. ${sentence}`}>
            <Text variant="meta" color="muted">
              {eyebrow}
            </Text>
            <Text variant="countdown">{heading}</Text>
            <Text variant="rowLabel" color={delivered ? "mint" : "primary"}>
              {sentence}
            </Text>
          </View>
          <ProgressSegments current={progress.step} currentProgress={progress.stepProgress} labels={STEP_LABELS} />

          {rider && asap && !delivered && (
            <View style={styles.riderCard}>
              <View style={styles.riderAvatar}>
                <Text variant="initialsLarge" color={colors.ink}>
                  {rider.name.slice(0, 1)}
                </Text>
              </View>
              <View style={styles.flex}>
                <Text variant="kitchenName">{rider.name}</Text>
                <Text variant="bodySmall" color="muted">
                  {t("tracking.riderVehicle", { vehicle: rider.vehicle, rating: rider.rating.toFixed(1).replace(".", t("common.decimalSeparator")) })}
                </Text>
              </View>
              <IconButton icon="chat" accessibilityLabel={t("tracking.chatRider")} onPress={() => setHelpOpen(true)} />
              <IconButton icon="phone" variant="primary" accessibilityLabel={t("tracking.callRider")} onPress={() => setHelpOpen(true)} />
            </View>
          )}

          {progress.status === "on_the_way" && (
            <View style={styles.handover} accessible accessibilityLabel={t("tracking.handoverLabel", { code: order.handoverCode.split("").join(" ") })}>
              <View>
                <Text variant="selectTitle">{t("tracking.handoverTitle")}</Text>
                <Text variant="caption" color="muted">
                  {t("tracking.handoverText")}
                </Text>
              </View>
              <Text variant="handoverCode">{order.handoverCode}</Text>
            </View>
          )}

          <View>
            {rows.map((row, i) => (
              <Touchable
                key={row.icon}
                onPress={row.onPress}
                disabled={!row.onPress}
                accessibilityRole={row.onPress ? "button" : undefined}
                style={[styles.row, i < rows.length - 1 && styles.rowDivider]}
              >
                <Icon name={row.icon} color={colors.ink} />
                <Text variant="rowText" style={styles.flex} numberOfLines={1}>
                  {row.label}
                </Text>
                {row.onPress && <Icon name="chevronRight" size={metrics.icon.medium} color={colors.muted} />}
              </Touchable>
            ))}
          </View>

          {delivered && <PrimaryButton label={t("tracking.backHome")} variant="outline" onPress={() => router.back()} />}
        </View>
      </ScrollView>

      <Sheet visible={helpOpen} onClose={() => setHelpOpen(false)} title={t("tracking.helpTitle")}>
        <Text variant="bodySmall" color="muted">
          {t("tracking.helpText")}
        </Text>
        <PrimaryButton label={t("tracking.chatSupport")} icon="chat" onPress={() => setHelpOpen(false)} />
        <PrimaryButton label={t("tracking.callSupport")} icon="phone" variant="outline" onPress={() => setHelpOpen(false)} />
      </Sheet>
      <Sheet visible={detailsOpen} onClose={() => setDetailsOpen(false)} title={t("tracking.detailsTitle")}>
        <ScrollView style={styles.details}>
          {order.lines.map((line, i) => (
            <CartLineRow key={line.id} line={line} readOnly divider={i < order.lines.length - 1} />
          ))}
        </ScrollView>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  mapButtons: { position: "absolute", start: spacing.pagePadding, end: spacing.pagePadding, flexDirection: "row", justifyContent: "space-between" },
  helpPill: { minHeight: metrics.iconButton.size, paddingHorizontal: spacing.pagePadding, borderRadius: metrics.iconButton.size / 2, backgroundColor: colors.white, justifyContent: "center", boxShadow: shadows.mapButton },
  sheet: {
    marginTop: -metrics.trackingMap.sheetOverlap,
    borderTopLeftRadius: metrics.sheet.radius,
    borderTopRightRadius: metrics.sheet.radius,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.pagePadding,
    paddingTop: metrics.gap.xl,
    gap: metrics.gap.xxl + metrics.gap.xs,
    boxShadow: shadows.sheet,
  },
  handle: { alignSelf: "center", width: metrics.sheet.handleWidth + metrics.gap.xs, height: metrics.sheet.handleHeight + 1, borderRadius: metrics.sheet.handleHeight, backgroundColor: colors.borderStrong },
  status: { gap: metrics.gap.xs },
  riderCard: { flexDirection: "row", alignItems: "center", gap: metrics.gap.xl, padding: metrics.gap.xl, borderRadius: metrics.handover.radius, borderWidth: metrics.hairline, borderColor: colors.border },
  riderAvatar: { width: metrics.avatar.medium, height: metrics.avatar.medium, borderRadius: metrics.avatar.medium / 2, backgroundColor: colors.saffronTint, alignItems: "center", justifyContent: "center" },
  handover: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: metrics.handover.padding, borderRadius: metrics.handover.radius, backgroundColor: colors.surface },
  row: { minHeight: metrics.listRow.minHeight, flexDirection: "row", alignItems: "center", gap: metrics.gap.xl },
  rowDivider: { borderBottomWidth: metrics.hairline, borderBottomColor: colors.border },
  details: { maxHeight: metrics.orderDetails.maxHeight },
});
