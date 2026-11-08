/** 03 · Accueil — DESIGN_SPEC §5. */
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api } from "@/api";
import {
  CategoryGrid,
  ComposeCard,
  DishCard,
  EmptyState,
  ErrorState,
  FilterChipRow,
  FLOATING_CART_SPACE,
  FloatingCartBar,
  Icon,
  IconButton,
  KitchenCard,
  LoadingState,
  OptionRow,
  PrimaryButton,
  PromoCarousel,
  SearchField,
  SectionHeader,
  Sheet,
  Text,
  Touchable,
} from "@/components";
import { defaultHomeFilter } from "@/data/home";
import { getKitchen, KITCHEN_COUNT } from "@/data/kitchens";
import { menuItems } from "@/data/menu";
import { shortAddress } from "@/data/user";
import { t } from "@/i18n";
import { useAsync } from "@/lib/useAsync";
import { useCurrentAddress, useUserStore } from "@/store/user";
import { colors, metrics, spacing } from "@/theme";
import type { Category, HomeFilter, Promo } from "@/types/models";

function openCategory(category: Category) {
  const { target } = category;
  if (target.kind === "compose") router.push("/compose");
  else router.push({ pathname: "/kitchen/[id]", params: { id: target.kitchenId, ...(target.section ? { section: target.section } : null) } });
}

function openPromo(promo: Promo) {
  if (promo.target === "plan") router.push("/plan");
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const feed = useAsync("home-feed", () => api.home.getFeed());
  const userProfiles = useUserStore((s) => s.profiles);
  const favorites = useUserStore((s) => s.favoriteItems);
  const toggleFavorite = useUserStore((s) => s.toggleFavoriteItem);
  const address = useCurrentAddress();
  const [filter, setFilter] = useState<HomeFilter["id"]>(() => defaultHomeFilter(userProfiles));
  const [addressOpen, setAddressOpen] = useState(false);

  if (feed.error) return <ErrorState onRetry={feed.reload} style={{ paddingTop: insets.top }} />;
  if (!feed.data) return <LoadingState />;
  const { categories, promos, filters, popular, kitchens } = feed.data;

  // Filter chips narrow everything below them (DESIGN_SPEC §5 · 03).
  const matches = (profiles?: string[]) => filter === "all" || !!profiles?.includes(filter);
  const dishes = popular.filter((d) => matches(d.profiles));
  const shownKitchens = kitchens.filter((k) => filter === "all" || menuItems.some((m) => m.kitchenId === k.id && matches(m.profiles)));

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + metrics.gap.xs, paddingBottom: spacing.sectionGap + FLOATING_CART_SPACE }}>
        {/* Header: address + notifications, search */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Touchable
              onPress={() => setAddressOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={t("home.changeAddress", { address: shortAddress(address) })}
              style={styles.address}
            >
              <Text variant="caption" color="muted">
                {t("home.deliverTo")}
              </Text>
              <View style={styles.addressLine}>
                <Text variant="addressTitle" numberOfLines={1} style={styles.shrink}>
                  {shortAddress(address)}
                </Text>
                <Icon name="chevronDown" size={metrics.icon.medium} color={colors.primary} />
              </View>
            </Touchable>
            <IconButton icon="bell" dot accessibilityLabel={t("home.newNotifications")} onPress={() => router.push("/notifications")} />
          </View>
          <SearchField onPress={() => router.push("/search")} />
        </View>

        <CategoryGrid categories={categories} onSelect={openCategory} style={styles.categories} />

        <PromoCarousel promos={promos} onPressPromo={openPromo} style={styles.promos} />

        <FilterChipRow options={filters} value={filter} onChange={setFilter} style={styles.filters} />

        <ComposeCard onPress={() => router.push("/compose")} style={styles.compose} />

        {/* Populaires près de toi */}
        <View style={styles.section}>
          <SectionHeader title={t("home.popularTitle")} actionLabel={t("common.seeAll")} onAction={() => router.push("/search")} style={styles.padded} />
          {dishes.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dishList}>
              {dishes.map((item) => (
                <DishCard
                  key={item.id}
                  item={item}
                  kitchen={getKitchen(item.kitchenId)}
                  favorite={favorites.includes(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                  onPress={() => router.push({ pathname: "/dish/[id]", params: { id: item.id } })}
                />
              ))}
            </ScrollView>
          ) : (
            <EmptyState icon="search" title={t("home.noMatchTitle")} text={t("home.noMatchText")} style={styles.inlineEmpty} />
          )}
        </View>

        {/* Nos cuisines */}
        <View style={[styles.section, styles.padded, styles.kitchens]}>
          <SectionHeader title={t("home.kitchensTitle")} subtitle={t("home.kitchensSubtitle", { count: KITCHEN_COUNT })} />
          {shownKitchens.map((k) => (
            <KitchenCard key={k.id} kitchen={k} onPress={() => router.push({ pathname: "/kitchen/[id]", params: { id: k.id } })} />
          ))}
          <PrimaryButton label={t("home.seeAllKitchens", { count: KITCHEN_COUNT })} variant="outline" size="medium" onPress={() => router.push("/kitchens")} />
        </View>
      </ScrollView>

      <FloatingCartBar aboveTabBar />

      <Sheet visible={addressOpen} onClose={() => setAddressOpen(false)} title={t("home.addressesTitle")}>
        <AddressList onDone={() => setAddressOpen(false)} />
      </Sheet>
    </View>
  );
}

function AddressList({ onDone }: { onDone: () => void }) {
  const addresses = useUserStore((s) => s.addresses);
  const addressId = useUserStore((s) => s.addressId);
  const setAddress = useUserStore((s) => s.setAddress);
  return (
    <View accessibilityRole="radiogroup">
      {addresses.map((a, i) => (
        <OptionRow
          key={a.id}
          label={a.label}
          sublabel={`${a.line}, ${a.city}`}
          leading={
            <View style={styles.addressIcon}>
              <Icon name="mapPin" color={colors.ink} />
            </View>
          }
          control="radio"
          selected={a.id === addressId}
          divider={i < addresses.length - 1}
          onPress={() => {
            setAddress(a.id);
            onDone();
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  padded: { paddingHorizontal: spacing.pagePadding },
  header: { paddingHorizontal: spacing.pagePadding, gap: metrics.gap.xl },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: metrics.gap.xl },
  address: { flex: 1, minHeight: metrics.iconButton.size, justifyContent: "center" },
  addressLine: { flexDirection: "row", alignItems: "center", gap: metrics.gap.xs },
  shrink: { flexShrink: 1 },
  categories: { paddingHorizontal: spacing.pagePadding, paddingTop: metrics.gap.xxl + metrics.gap.s },
  promos: { paddingTop: spacing.sectionGap },
  filters: { paddingTop: metrics.gap.xxl + metrics.gap.m, flexGrow: 0 },
  compose: { marginHorizontal: spacing.pagePadding, marginTop: metrics.gap.xxl + metrics.gap.m },
  section: { paddingTop: spacing.sectionGap + metrics.gap.xs, gap: metrics.gap.xl },
  kitchens: { gap: spacing.pagePadding },
  dishList: { paddingHorizontal: spacing.pagePadding, gap: metrics.gap.xl },
  inlineEmpty: { flexGrow: 0, paddingVertical: metrics.gap.xxl },
  addressIcon: {
    width: metrics.listRow.iconCircle,
    height: metrics.listRow.iconCircle,
    borderRadius: metrics.listRow.iconCircle / 2,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
