/** 05 · Fiche produit — option sheet with live price / kcal / protein (DESIGN_SPEC §5 · 05 and §7). */
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api } from "@/api";
import {
  Badge,
  BottomBar,
  ErrorState,
  FoodImage,
  IconButton,
  InfoChip,
  LoadingState,
  OptionGroup,
  PrimaryButton,
  Stepper,
  Text,
  TextArea,
} from "@/components";
import { DISH_QTY_MAX, DISH_QTY_MIN } from "@/data/rules";
import { t } from "@/i18n";
import { announceAdded, dishLine } from "@/lib/cartActions";
import { discountPercent, formatCount, formatDiscountPercent, formatKcal, formatPrice, formatRating } from "@/lib/format";
import { computeDishTotals, defaultDishSelections, missingRequiredGroups } from "@/lib/pricing";
import { useAsync } from "@/lib/useAsync";
import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { colors, metrics, spacing } from "@/theme";
import type { MenuItem } from "@/types/models";

const m = metrics.dishSheet;

export default function DishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dish = useAsync(`dish:${id}`, () => api.menu.getItem(id));

  if (dish.error) return <ErrorState onRetry={dish.reload} />;
  if (!dish.data) return <LoadingState />;
  return <DishSheet item={dish.data} />;
}

function DishSheet({ item }: { item: MenuItem }) {
  const insets = useSafeAreaInsets();
  const addToCart = useCartStore((s) => s.add);
  const favorite = useUserStore((s) => s.favoriteItems.includes(item.id));
  const toggleFavorite = useUserStore((s) => s.toggleFavoriteItem);

  const [selections, setSelections] = useState(() => defaultDishSelections(item));
  const [qty, setQty] = useState(DISH_QTY_MIN);
  const [note, setNote] = useState("");

  const totals = computeDishTotals(item, selections, qty);
  const missing = missingRequiredGroups(item, selections);
  const discount = item.oldPrice ? discountPercent(item.price, item.oldPrice) : 0;
  // iOS shows this as a card under the status bar; elsewhere the sheet is full screen.
  const buttonTop = Platform.OS === "ios" ? m.buttonInset : insets.top + metrics.gap.m;

  function add() {
    if (!totals.complete) return;
    addToCart(dishLine(item, selections, qty, note));
    announceAdded(item.name);
    router.back();
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ paddingBottom: metrics.button.height + insets.bottom + spacing.sectionGap * 2 }} keyboardShouldPersistTaps="handled">
        <FoodImage source={item.image} tint={item.tint ?? colors.tints[0]} height={m.heroHeight} scale={m.heroArtScale} accessibilityLabel={item.name}>
          <View style={[styles.heroButtons, { top: buttonTop }]}>
            <IconButton icon="close" variant="white" accessibilityLabel={t("common.close")} onPress={() => router.back()} />
            <IconButton
              icon="heart"
              variant="white"
              filled={favorite}
              selected={favorite}
              iconColor={colors.terracotta}
              accessibilityLabel={favorite ? t("common.removeFromFavorites") : t("common.addToFavorites")}
              onPress={() => toggleFavorite(item.id)}
            />
          </View>
        </FoodImage>

        <View style={styles.info}>
          <Text variant="productTitle" accessibilityRole="header">
            {item.name}
          </Text>
          <Text variant="description" color="muted">
            {item.longDescription ?? item.description}
          </Text>
          <View style={styles.priceRow}>
            <Text variant="priceHero">{formatPrice(item.price)}</Text>
            {item.oldPrice !== undefined && item.oldPrice > item.price && (
              <Text variant="priceHeroOld" color="mutedLight" strike accessibilityLabel={t("common.oldPrice", { price: formatPrice(item.oldPrice) })}>
                {formatPrice(item.oldPrice)}
              </Text>
            )}
            {discount > 0 && <Badge label={formatDiscountPercent(discount)} tone="discount" shape="rounded" size="small" />}
          </View>
          {(totals.kcal !== undefined || totals.protein !== undefined || item.rating !== undefined) && (
            <View style={styles.chips} accessibilityLiveRegion="polite">
              {totals.kcal !== undefined && <InfoChip label={formatKcal(totals.kcal)} tone="mint" />}
              {totals.protein !== undefined && <InfoChip label={t("dish.proteinChip", { grams: totals.protein })} tone="blue" />}
              {item.rating !== undefined && (
                <InfoChip
                  star
                  label={item.ratingCount ? `${formatRating(item.rating)} (${formatCount(item.ratingCount)})` : formatRating(item.rating)}
                  accessibilityLabel={item.ratingCount ? t("common.ratingWithCount", { rating: formatRating(item.rating), count: formatCount(item.ratingCount) }) : t("common.rating", { rating: formatRating(item.rating) })}
                />
              )}
            </View>
          )}
        </View>

        <View style={styles.options}>
          {(item.optionGroups ?? []).map((group) => (
            <OptionGroup key={group.id} group={group} selected={selections[group.id] ?? []} onChange={(next) => setSelections((s) => ({ ...s, [group.id]: next }))} />
          ))}
          <View style={styles.note}>
            <TextArea label={t("dish.instructionsTitle")} placeholder={t("dish.instructionsPlaceholder")} value={note} onChangeText={setNote} />
          </View>
        </View>
      </ScrollView>

      <BottomBar>
        <View style={styles.cta}>
          <Stepper value={qty} onChange={setQty} min={DISH_QTY_MIN} max={DISH_QTY_MAX} />
          <PrimaryButton
            label={t("menu.addWithTotal", { total: formatPrice(totals.total) })}
            onPress={add}
            disabled={!totals.complete}
            accessibilityHint={missing.length ? t("dish.missing", { groups: missing.join(", ") }) : undefined}
            style={styles.ctaButton}
          />
        </View>
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  heroButtons: { position: "absolute", start: spacing.pagePadding, end: spacing.pagePadding, flexDirection: "row", justifyContent: "space-between" },
  info: { paddingHorizontal: spacing.pagePadding, paddingTop: metrics.gap.xxl + metrics.gap.s, gap: metrics.gap.l },
  priceRow: { flexDirection: "row", alignItems: "center", gap: metrics.gap.m },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: metrics.gap.s },
  options: { paddingHorizontal: spacing.pagePadding },
  note: { paddingTop: spacing.sectionGap },
  cta: { flexDirection: "row", alignItems: "center", gap: metrics.gap.xl },
  ctaButton: { flex: 1, width: undefined },
});
