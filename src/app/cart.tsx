/** 07 · Panier — DESIGN_SPEC §5 · 07. */
import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BottomBar,
  CartLineRow,
  EmptyState,
  Icon,
  KitchenAvatar,
  PrimaryButton,
  ScreenHeader,
  Sheet,
  SuggestionCard,
  SummaryBox,
  Switch,
  Text,
  Touchable,
  type SummaryRow,
} from "@/components";
import { getKitchen } from "@/data/kitchens";
import { getMenuItem } from "@/data/menu";
import { CART_SUGGESTION_COUNT, CART_SUGGESTION_IDS } from "@/data/rules";
import { t } from "@/i18n";
import { quickAdd } from "@/lib/cartActions";
import { formatPrice, formatPriceDelta } from "@/lib/format";
import { checkPromo, computeOrderTotals } from "@/lib/pricing";
import { cartKitchenIds, cartSubtotal, useCartStore } from "@/store/cart";
import { useOrdersStore } from "@/store/orders";
import { colors, metrics, radius, spacing, typography } from "@/theme";
import type { MenuItem } from "@/types/models";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { lines, setQty, clear, promoCode, setPromoCode, cutlery, setCutlery, invoice, setInvoice } = useCartStore();
  const firstOrder = useOrdersStore((s) => s.orders.length === 0);
  const [promoOpen, setPromoOpen] = useState(false);

  const subtotal = cartSubtotal(lines);
  const totals = computeOrderTotals({ subtotal, promoCode, firstOrder });
  const kitchens = cartKitchenIds(lines).map((id) => getKitchen(id)).filter((k) => k !== undefined);
  const inCart = new Set(lines.map((l) => l.itemId));
  const suggestions = CART_SUGGESTION_IDS.filter((id) => !inCart.has(id))
    .map((id) => getMenuItem(id))
    .filter((m): m is MenuItem => m !== undefined)
    .slice(0, CART_SUGGESTION_COUNT);

  const rows: SummaryRow[] = [
    { label: t("summary.subtotal"), value: formatPrice(totals.subtotal) },
    totals.freeDelivery
      ? { label: t("summary.delivery"), value: t("summary.free"), strikeValue: formatPrice(totals.baseDeliveryFee), tone: "success" }
      : { label: t("summary.delivery"), value: formatPrice(totals.deliveryFee) },
    ...(totals.discount > 0 ? [{ label: t("summary.discount"), value: formatPriceDelta(-totals.discount), tone: "success" as const }] : []),
  ];

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t("cart.title")}
        right={
          lines.length > 0 ? (
            <Touchable onPress={clear} accessibilityRole="button" accessibilityLabel={t("cart.clearLabel")} style={styles.headerLink}>
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
          <ScrollView contentContainerStyle={{ paddingBottom: metrics.button.height + insets.bottom + spacing.sectionGap * 2 }}>
            <View style={styles.padded}>
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
            </View>

            {suggestions.length > 0 && (
              <View style={styles.section}>
                <Text variant="groupTitle" accessibilityRole="header" style={styles.padded}>
                  {t("cart.suggestions")}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestions}>
                  {suggestions.map((item) => (
                    <SuggestionCard key={item.id} item={item} onAdd={() => quickAdd(item)} />
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={[styles.padded, styles.section]}>
              <SwitchRow title={t("cart.cutlery")} note={t("cart.cutleryNote")} value={cutlery} onChange={setCutlery} />
              <SwitchRow title={t("cart.invoice")} note={t("cart.invoiceNote")} value={invoice} onChange={setInvoice} />
              <Touchable onPress={() => setPromoOpen(true)} accessibilityRole="button" accessibilityLabel={promoCode ? `${promoCode}, ${t("cart.promoApplied")}` : t("cart.promoAdd")} style={styles.promoRow}>
                <View style={styles.promoIcon}>
                  <Icon name="tag" color={colors.mint} />
                </View>
                {promoCode ? (
                  <>
                    <View style={styles.flex}>
                      <Text variant="cardTitle">{promoCode}</Text>
                      <Text variant="caption" color="mintOnTint">
                        {t("cart.promoApplied")}
                      </Text>
                    </View>
                    {totals.discount > 0 && (
                      <Text variant="summaryRowBold" color="mintOnTint">
                        {formatPriceDelta(-totals.discount)}
                      </Text>
                    )}
                  </>
                ) : (
                  <>
                    <Text variant="cardTitle" color="primary" style={styles.flex}>
                      {t("cart.promoAdd")}
                    </Text>
                    <Icon name="chevronRight" size={metrics.icon.medium} color={colors.muted} />
                  </>
                )}
              </Touchable>

              <SummaryBox
                rows={rows}
                total={{ label: t("summary.total"), value: formatPrice(totals.total) }}
                footnote={t("summary.nojoum", { count: totals.nojoum })}
                style={styles.summary}
              />
            </View>
          </ScrollView>

          <BottomBar>
            <PrimaryButton label={t("cart.order", { total: formatPrice(totals.total) })} onPress={() => router.push("/checkout")} />
          </BottomBar>
        </>
      )}

      <PromoSheet visible={promoOpen} onClose={() => setPromoOpen(false)} firstOrder={firstOrder} current={promoCode} onApply={setPromoCode} />
    </View>
  );
}

function SwitchRow({ title, note, value, onChange }: { title: string; note: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.switchRow}>
      <View style={styles.flex}>
        <Text variant="cardTitle">{title}</Text>
        <Text variant="caption" color="muted">
          {note}
        </Text>
      </View>
      <Switch value={value} onValueChange={onChange} accessibilityLabel={title} />
    </View>
  );
}

function PromoSheet({ visible, onClose, firstOrder, current, onApply }: { visible: boolean; onClose: () => void; firstOrder: boolean; current?: string; onApply: (code?: string) => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function apply() {
    const result = checkPromo(code, { firstOrder });
    if (!result.ok) {
      setError(result.reason === "firstOrderOnly" ? t("cart.promoFirstOrderOnly") : t("cart.promoUnknown"));
      return;
    }
    onApply(result.promo.code);
    setCode("");
    setError(null);
    onClose();
  }

  return (
    <Sheet visible={visible} onClose={onClose} title={t("cart.promoTitle")}>
      <TextInput
        value={code}
        onChangeText={(text) => {
          setCode(text.toUpperCase());
          setError(null);
        }}
        onSubmitEditing={apply}
        placeholder={t("cart.promoPlaceholder")}
        placeholderTextColor={colors.muted}
        autoCapitalize="characters"
        autoCorrect={false}
        accessibilityLabel={t("cart.promoTitle")}
        maxFontSizeMultiplier={1.4}
        style={styles.promoInput}
      />
      {error ? (
        <Text variant="caption" color="terracotta" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : (
        <Text variant="caption" color="muted">
          {t("cart.promoHint")}
        </Text>
      )}
      <PrimaryButton label={t("cart.promoApply")} onPress={apply} disabled={!code.trim()} />
      {current && (
        <PrimaryButton
          label={t("cart.promoRemove")}
          variant="outline"
          onPress={() => {
            onApply(undefined);
            onClose();
          }}
        />
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  padded: { paddingHorizontal: spacing.pagePadding },
  headerLink: { minHeight: metrics.iconButton.size, justifyContent: "center" },
  kitchens: { flexDirection: "row", alignItems: "center", gap: metrics.gap.l, paddingBottom: metrics.gap.xs },
  avatars: { flexDirection: "row" },
  avatarOverlap: { marginStart: -metrics.gap.l },
  section: { paddingTop: spacing.sectionGap, gap: metrics.gap.xl },
  suggestions: { paddingHorizontal: spacing.pagePadding, gap: metrics.gap.xl },
  switchRow: { minHeight: metrics.listRow.minHeight, flexDirection: "row", alignItems: "center", gap: metrics.gap.xl, borderBottomWidth: metrics.hairline, borderBottomColor: colors.border },
  promoRow: { minHeight: metrics.listRow.minHeight, flexDirection: "row", alignItems: "center", gap: metrics.gap.xl },
  promoIcon: { width: metrics.methodIcon.size, height: metrics.methodIcon.size, borderRadius: metrics.methodIcon.size / 2, backgroundColor: colors.mintTint, alignItems: "center", justifyContent: "center" },
  summary: { marginTop: metrics.gap.m },
  promoInput: {
    ...typography.bigInput,
    color: colors.ink,
    minHeight: metrics.button.height,
    borderRadius: radius.input,
    borderWidth: metrics.button.borderWidth,
    borderColor: colors.borderStrong,
    paddingHorizontal: metrics.gap.xxl,
  },
});
