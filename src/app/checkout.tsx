/** 08 · Paiement — DESIGN_SPEC §5 · 08 (mock payment). */
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View, type TextStyle } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api } from "@/api";
import {
  AddressSheet,
  BottomBar,
  EmptyState,
  FilterChip,
  Icon,
  MapSnippet,
  OptionRow,
  PrimaryButton,
  ScreenHeader,
  SelectCard,
  Sheet,
  SummaryBox,
  Text,
  Touchable,
  type IconName,
} from "@/components";
import { getKitchen } from "@/data/kitchens";
import { TIP_OPTIONS } from "@/data/rules";
import { mockUser, savedCard } from "@/data/user";
import { t } from "@/i18n";
import { formatEta, formatPrice } from "@/lib/format";
import { todaySlots } from "@/lib/orders";
import { computeOrderTotals } from "@/lib/pricing";
import { cartKitchenIds, cartSubtotal, useCartStore } from "@/store/cart";
import { useOrdersStore } from "@/store/orders";
import { useCurrentAddress } from "@/store/user";
import { colors, metrics, radius, spacing, typography } from "@/theme";
import type { PaymentMethod } from "@/types/models";

/** Apple Pay on iPhone, Google Pay elsewhere (DESIGN_SPEC §5 · 08: platform-dependent). */
const MOBILE_PAY: PaymentMethod = Platform.OS === "ios" ? "apple_pay" : "google_pay";

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const cart = useCartStore();
  const firstOrder = useOrdersStore((s) => s.orders.length === 0);
  const addOrder = useOrdersStore((s) => s.addOrder);
  const address = useCurrentAddress();

  const [when, setWhen] = useState<"asap" | "later">("asap");
  const [slot, setSlot] = useState<string | null>(null);
  const [riderNote, setRiderNote] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [tip, setTip] = useState(TIP_OPTIONS[0]);
  const [addressOpen, setAddressOpen] = useState(false);
  const [slotsOpen, setSlotsOpen] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [paying, setPaying] = useState(false);

  const kitchens = cartKitchenIds(cart.lines).map((id) => getKitchen(id)).filter((k) => k !== undefined);
  const etaMin = Math.max(0, ...kitchens.map((k) => k.etaMin));
  const etaMax = Math.max(0, ...kitchens.map((k) => k.etaMax));
  const orderTotals = computeOrderTotals({ subtotal: cartSubtotal(cart.lines), promoCode: cart.promoCode, firstOrder });
  const total = orderTotals.total + tip;
  const walletTooLow = mockUser.walletBalance < total;
  const slots = todaySlots();
  const canPay = cart.lines.length > 0 && (when === "asap" || slot !== null) && !(method === "wallet" && walletTooLow);

  if (cart.lines.length === 0 && !paying) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title={t("checkout.title")} />
        <EmptyState icon="receipt" title={t("cart.emptyTitle")} text={t("cart.emptyText")} actionLabel={t("cart.browse")} onAction={() => router.dismissTo("/home")} />
      </View>
    );
  }

  const methods: { id: PaymentMethod; icon: IconName; label: string; sub: string; disabled?: boolean }[] = [
    { id: "card", icon: "card", label: t("checkout.cardLabel", savedCard), sub: t("checkout.cardExpiry", { date: savedCard.expiry }) },
    { id: MOBILE_PAY, icon: "smartphone", label: MOBILE_PAY === "apple_pay" ? t("checkout.applePay") : t("checkout.googlePay"), sub: MOBILE_PAY === "apple_pay" ? t("checkout.biometric") : t("checkout.biometricAndroid") },
    {
      id: "wallet",
      icon: "wallet",
      label: t("checkout.wallet"),
      sub: walletTooLow ? t("checkout.walletLow", { amount: formatPrice(mockUser.walletBalance) }) : t("checkout.walletBalance", { amount: formatPrice(mockUser.walletBalance) }),
      disabled: walletTooLow,
    },
    { id: "cash", icon: "cash", label: t("checkout.cash"), sub: t("checkout.cashSub") },
  ];

  async function pay() {
    if (!canPay) return;
    setPaying(true);
    const order = await api.orders.place({
      lines: cart.lines,
      subtotal: orderTotals.subtotal,
      deliveryFee: orderTotals.deliveryFee,
      discount: orderTotals.discount,
      tip,
      total,
      payment: method,
      schedule: when === "asap" ? "asap" : (slot ?? "asap"),
      addressId: address.id,
      etaMinutes: etaMax,
      promoCode: cart.promoCode,
      cutlery: cart.cutlery,
      invoice: cart.invoice,
      riderNote: riderNote.trim() || undefined,
    });
    addOrder(order);
    cart.clear();
    // Back to the tabs, then open tracking (back from tracking returns to Home).
    if (router.canDismiss()) router.dismissAll();
    router.push({ pathname: "/order/[id]", params: { id: order.id } });
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScreenHeader
        title={t("checkout.title")}
        right={
          <View style={styles.lock} accessible accessibilityLabel={t("checkout.secure")}>
            <Icon name="lock" color={colors.mint} />
          </View>
        }
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: metrics.button.height + insets.bottom + spacing.sectionGap * 3 }]} keyboardShouldPersistTaps="handled">
        {/* Livraison */}
        <Text variant="groupTitle" accessibilityRole="header">
          {t("checkout.delivery")}
        </Text>
        <View style={styles.addressCard}>
          <MapSnippet />
          <View style={styles.addressRow}>
            <View style={styles.flex}>
              <Text variant="selectTitle">{address.label}</Text>
              <Text variant="cardMeta" color="muted" numberOfLines={1}>
                {address.line}
              </Text>
            </View>
            <Touchable onPress={() => setAddressOpen(true)} accessibilityRole="button" style={styles.link}>
              <Text variant="link" color="primary">
                {t("checkout.edit")}
              </Text>
            </Touchable>
          </View>
        </View>
        <View style={styles.whenRow} accessibilityRole="radiogroup">
          <SelectCard title={t("checkout.standard")} subtitle={formatEta(etaMin, etaMax)} selected={when === "asap"} onPress={() => setWhen("asap")} style={styles.flex} />
          <SelectCard
            title={t("checkout.scheduled")}
            subtitle={slot ? t("checkout.today", { time: slot }) : t("checkout.chooseSlot")}
            selected={when === "later"}
            onPress={() => {
              setWhen("later");
              setSlotsOpen(true);
            }}
            style={styles.flex}
          />
        </View>
        <View style={styles.noteField}>
          <Icon name="chat" color={colors.muted} />
          <TextInput
            value={riderNote}
            onChangeText={setRiderNote}
            placeholder={t("checkout.riderNote")}
            placeholderTextColor={colors.muted}
            accessibilityLabel={t("checkout.riderNote")}
            maxLength={140}
            maxFontSizeMultiplier={1.4}
            style={[styles.noteInput, webNoFocusRing]}
          />
        </View>

        {/* Moyen de paiement */}
        <Text variant="groupTitle" accessibilityRole="header" style={styles.sectionTitle}>
          {t("checkout.paymentTitle")}
        </Text>
        <View accessibilityRole="radiogroup">
          {methods.map((m) => (
            <OptionRow
              key={m.id}
              label={m.label}
              sublabel={m.sub}
              emphasis
              leading={
                <View style={styles.methodIcon}>
                  <Icon name={m.icon} color={colors.ink} />
                </View>
              }
              control="radio"
              selected={method === m.id}
              disabled={m.disabled}
              onPress={() => setMethod(m.id)}
            />
          ))}
        </View>
        <Touchable onPress={() => setAddCardOpen(true)} accessibilityRole="button" style={styles.addCard}>
          <Icon name="plus" color={colors.primary} />
          <Text variant="selectTitle" color="primary">
            {t("checkout.addCard")}
          </Text>
        </Touchable>

        {/* Pourboire */}
        <View style={styles.tipHeader}>
          <Text variant="groupTitle" accessibilityRole="header">
            {t("checkout.tipTitle")}
          </Text>
          <Text variant="caption" color="muted">
            {t("checkout.tipNote")}
          </Text>
        </View>
        <View style={styles.tips} accessibilityRole="radiogroup">
          {TIP_OPTIONS.map((v) => (
            <FilterChip key={v} label={v === 0 ? t("checkout.tipNone") : formatPrice(v)} active={tip === v} onPress={() => setTip(v)} style={styles.tipChip} />
          ))}
        </View>

        <SummaryBox
          rows={[
            { label: t("checkout.order"), value: formatPrice(orderTotals.total) },
            { label: t("checkout.tip"), value: formatPrice(tip) },
          ]}
          total={{ label: t("summary.total"), value: formatPrice(total) }}
          style={styles.summary}
        />
      </ScrollView>

      <BottomBar>
        <PrimaryButton
          label={paying ? t("checkout.paying") : method === "cash" ? t("checkout.payCash", { total: formatPrice(total) }) : t("checkout.pay", { total: formatPrice(total) })}
          onPress={pay}
          disabled={!canPay || paying}
        />
        <Text variant="caption" color="muted" align="center" style={styles.footer}>
          {t("checkout.footer")}
        </Text>
      </BottomBar>

      <AddressSheet visible={addressOpen} onClose={() => setAddressOpen(false)} />
      <Sheet visible={slotsOpen} onClose={() => setSlotsOpen(false)} title={t("checkout.slotsTitle")}>
        {slots.length === 0 ? (
          <Text variant="bodySmall" color="muted">
            {t("checkout.noSlots")}
          </Text>
        ) : (
          <ScrollView horizontal={false} style={styles.slotList} contentContainerStyle={styles.slots}>
            {slots.map((s) => {
              const on = s === slot;
              return (
                <Touchable
                  key={s}
                  onPress={() => {
                    setSlot(s);
                    setSlotsOpen(false);
                  }}
                  accessibilityRole="radio"
                  accessibilityLabel={t("checkout.today", { time: s })}
                  aria-checked={on}
                  style={[styles.slot, on && styles.slotOn]}
                >
                  <Text variant="chipActive" color={colors.ink}>
                    {s}
                  </Text>
                </Touchable>
              );
            })}
          </ScrollView>
        )}
      </Sheet>
      <Sheet visible={addCardOpen} onClose={() => setAddCardOpen(false)} title={t("checkout.addCardTitle")}>
        <Text variant="bodySmall" color="muted">
          {t("checkout.addCardText")}
        </Text>
      </Sheet>
    </KeyboardAvoidingView>
  );
}

// The field's grey pill shows focus; drop the browser ring on web ("none" isn't in RN's type).
const webNoFocusRing = Platform.OS === "web" ? ({ outlineStyle: "none" } as unknown as TextStyle) : null;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.pagePadding, paddingTop: metrics.gap.l, gap: metrics.gap.l },
  lock: { width: metrics.iconButton.size, height: metrics.iconButton.size, borderRadius: metrics.iconButton.size / 2, backgroundColor: colors.mintTint, alignItems: "center", justifyContent: "center" },
  addressCard: { borderRadius: metrics.mapSnippet.radius, borderWidth: metrics.hairline, borderColor: colors.border, overflow: "hidden" },
  addressRow: { flexDirection: "row", alignItems: "center", gap: metrics.gap.xl, paddingHorizontal: metrics.gap.xxl, paddingVertical: metrics.gap.xl },
  link: { minHeight: metrics.iconButton.size, justifyContent: "center" },
  whenRow: { flexDirection: "row", gap: metrics.gap.m },
  noteField: { minHeight: metrics.search.height, borderRadius: radius.input, backgroundColor: colors.surface, flexDirection: "row", alignItems: "center", gap: metrics.gap.l, paddingHorizontal: metrics.gap.xxl },
  noteInput: { ...typography.input, flex: 1, minWidth: 0, color: colors.ink, paddingVertical: 0 },
  sectionTitle: { marginTop: metrics.gap.xl },
  methodIcon: { width: metrics.methodIcon.size, height: metrics.methodIcon.size, borderRadius: metrics.methodIcon.radius, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  addCard: { minHeight: metrics.button.heightSmall, flexDirection: "row", alignItems: "center", gap: metrics.gap.l },
  tipHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: metrics.gap.xl },
  tips: { flexDirection: "row", gap: metrics.gap.m },
  tipChip: { flex: 1, minHeight: metrics.iconButton.size, borderRadius: metrics.iconButton.size / 2 },
  summary: { marginTop: metrics.gap.m },
  footer: { marginTop: -metrics.gap.s },
  slotList: { maxHeight: metrics.slots.listMaxHeight },
  slots: { flexDirection: "row", flexWrap: "wrap", gap: metrics.gap.m },
  slot: { minWidth: metrics.slots.minWidth, minHeight: metrics.iconButton.size, borderRadius: metrics.iconButton.size / 2, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", paddingHorizontal: metrics.gap.xl },
  slotOn: { backgroundColor: colors.saffron },
});
