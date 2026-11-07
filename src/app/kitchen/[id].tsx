/** 04 · Cuisine (kitchen page) — DESIGN_SPEC §5. */
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api, type KitchenMenu } from "@/api";
import {
  EmptyState,
  ErrorState,
  FoodImage,
  IconButton,
  InfoStrip,
  KitchenAvatar,
  LoadingState,
  MenuGridCard,
  MenuRow,
  Notice,
  ScreenHeader,
  SectionTabs,
  Text,
  type InfoItem,
} from "@/components";
import { t } from "@/i18n";
import { formatCount, formatEta, formatPrice, formatRating } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { useUserStore } from "@/store/user";
import { colors, metrics, shadows, spacing } from "@/theme";
import type { Kitchen, MenuItem } from "@/types/models";

const m = metrics.kitchenPage;
const POPULAR = t("kitchen.popular");

function openDish(item: MenuItem) {
  router.push({ pathname: "/dish/[id]", params: { id: item.id } });
}

function infoItems(k: Kitchen): InfoItem[] {
  const free = k.deliveryFee === 0;
  return [
    { value: formatRating(k.rating), label: t("kitchen.reviews", { count: formatCount(k.ratingCount) }), star: true },
    { value: formatEta(k.etaMin, k.etaMax), label: t("kitchen.delivery") },
    free
      ? { value: t("kitchen.free"), label: k.freeDeliveryFrom ? t("kitchen.deliveryFrom", { amount: formatPrice(k.freeDeliveryFrom) }) : t("kitchen.delivery"), tone: "success" }
      : { value: formatPrice(k.deliveryFee), label: t("kitchen.fee") },
  ];
}

export default function KitchenScreen() {
  const { id, section } = useLocalSearchParams<{ id: string; section?: string }>();
  const menu = useAsync(`kitchen:${id}`, () => api.kitchens.getMenu(id));

  if (menu.error) {
    const notFound = menu.error instanceof Error && menu.error.name === "NotFoundError";
    return (
      <View style={styles.screen}>
        <ScreenHeader />
        {notFound ? (
          <EmptyState icon="mapPin" title={t("kitchen.notFoundTitle")} text={t("kitchen.notFoundText")} actionLabel={t("tabs.home")} onAction={() => router.replace("/home")} />
        ) : (
          <ErrorState onRetry={menu.reload} />
        )}
      </View>
    );
  }
  if (!menu.data) {
    return (
      <View style={styles.screen}>
        <ScreenHeader />
        <LoadingState />
      </View>
    );
  }
  return <KitchenPage data={menu.data} initialSection={section} />;
}

function KitchenPage({ data, initialSection }: { data: KitchenMenu; initialSection?: string }) {
  const { kitchen, popular, sections } = data;
  const insets = useSafeAreaInsets();
  const favorite = useUserStore((s) => s.favoriteKitchens.includes(kitchen.id));
  const toggleFavorite = useUserStore((s) => s.toggleFavoriteKitchen);

  const titles = [...(popular.length ? [POPULAR] : []), ...sections.map((s) => s.title)];
  const scroller = useRef<ScrollViewInstance>(null);
  const offsets = useRef(new Map<string, number>());
  const jumped = useRef(false);
  const [tabsY, setTabsY] = useState(0);
  const [active, setActive] = useState(titles[0]);
  const [stuck, setStuck] = useState(false);

  // Height of the compact header that pins under the status bar (header row + tabs).
  const pinnedHeight = insets.top + m.compactHeaderHeight + metrics.sectionTabs.height;

  function scrollToSection(title: string, animated = true) {
    const y = offsets.current.get(title);
    if (y === undefined) return;
    scroller.current?.scrollTo({ y: Math.max(0, y - pinnedHeight + metrics.hairline), animated });
    setActive(title);
  }

  function onSectionLayout(title: string, y: number) {
    offsets.current.set(title, y);
    // Category bubbles on Home can open the page on a given section.
    if (!jumped.current && initialSection && offsets.current.size === titles.length && titles.includes(initialSection)) {
      jumped.current = true;
      requestAnimationFrame(() => scrollToSection(initialSection, false));
    }
  }

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const y = e.nativeEvent.contentOffset.y;
    const nowStuck = tabsY > 0 && y >= tabsY - (insets.top + m.compactHeaderHeight);
    if (nowStuck !== stuck) setStuck(nowStuck);
    // Active tab = last section whose top has passed under the pinned header.
    let current = titles[0];
    for (const title of titles) {
      const top = offsets.current.get(title);
      if (top !== undefined && top <= y + pinnedHeight + 1) current = title;
    }
    if (current !== active) setActive(current);
  }

  useEffect(() => {
    jumped.current = false;
  }, [kitchen.id]);

  const searchMenu = () => router.push({ pathname: "/search", params: { kitchenId: kitchen.id } });

  return (
    <View style={styles.screen}>
      <ScrollView ref={scroller} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: insets.bottom + spacing.sectionGap * 2 }}>
        {/* Cover with floating buttons */}
        <FoodImage source={kitchen.coverImage} tint={kitchen.coverTint} height={m.coverHeight} scale={m.coverArtScale} accessibilityLabel={kitchen.name}>
          <View style={[styles.coverButtons, { top: insets.top + metrics.gap.m }]}>
            <IconButton icon="chevronLeft" variant="white" accessibilityLabel={t("common.back")} onPress={() => router.back()} />
            <View style={styles.coverRight}>
              <IconButton icon="search" variant="white" accessibilityLabel={t("kitchen.searchMenu")} onPress={searchMenu} />
              <IconButton
                icon="heart"
                variant="white"
                filled={favorite}
                selected={favorite}
                iconColor={favorite ? colors.terracotta : colors.ink}
                accessibilityLabel={favorite ? t("common.removeFromFavorites") : t("common.addToFavorites")}
                onPress={() => toggleFavorite(kitchen.id)}
              />
            </View>
          </View>
        </FoodImage>

        {/* Identity, info strip, promo */}
        <View style={styles.info}>
          <View style={styles.identity}>
            <KitchenAvatar kitchen={kitchen} size={metrics.avatar.large} bordered style={styles.avatar} />
            <Text variant="kitchenTitle" accessibilityRole="header">
              {kitchen.name}
            </Text>
            {(kitchen.description ?? kitchen.tagline) && (
              <Text variant="meta" color="muted">
                {kitchen.description ?? kitchen.tagline}
              </Text>
            )}
          </View>
          <InfoStrip items={infoItems(kitchen)} />
          {kitchen.promo && <Notice text={kitchen.promo} />}
        </View>

        <View onLayout={(e) => setTabsY(e.nativeEvent.layout.y)} style={styles.tabs}>
          <SectionTabs sections={titles} active={active} onSelect={(s) => scrollToSection(s)} />
        </View>

        {popular.length > 0 && (
          <View onLayout={(e) => onSectionLayout(POPULAR, e.nativeEvent.layout.y)} style={styles.popular}>
            <Text variant="sectionTitle" accessibilityRole="header">
              {POPULAR}
            </Text>
            <View style={styles.grid}>
              {popular.map((item) => (
                <MenuGridCard key={item.id} item={item} onPress={() => openDish(item)} onAdd={() => openDish(item)} style={styles.gridCell} />
              ))}
            </View>
          </View>
        )}

        {sections.map((s) => (
          <View key={s.title} onLayout={(e) => onSectionLayout(s.title, e.nativeEvent.layout.y)} style={styles.section}>
            <Text variant="sectionTitle" accessibilityRole="header" style={styles.sectionTitle}>
              {s.title}
            </Text>
            {s.items.map((item) => (
              <MenuRow key={item.id} item={item} onPress={() => openDish(item)} onAdd={() => openDish(item)} />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Compact header + tabs, pinned under the status bar once the inline tabs scroll away. */}
      {stuck && (
        <View style={[styles.pinned, { paddingTop: insets.top }]}>
          <View style={styles.pinnedRow}>
            <IconButton icon="chevronLeft" accessibilityLabel={t("common.back")} onPress={() => router.back()} />
            <Text variant="kitchenName" numberOfLines={1} style={styles.pinnedTitle}>
              {kitchen.name}
            </Text>
            <IconButton icon="search" accessibilityLabel={t("kitchen.searchMenu")} onPress={searchMenu} />
          </View>
          <SectionTabs sections={titles} active={active} onSelect={(s) => scrollToSection(s)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  coverButtons: { position: "absolute", start: spacing.pagePadding, end: spacing.pagePadding, flexDirection: "row", justifyContent: "space-between" },
  coverRight: { flexDirection: "row", gap: metrics.gap.m },
  info: { paddingHorizontal: spacing.pagePadding, gap: spacing.pagePadding },
  identity: { gap: metrics.gap.s },
  avatar: { marginTop: -m.avatarOverlap, marginBottom: metrics.gap.xs },
  tabs: { marginTop: metrics.gap.xxl },
  popular: { paddingTop: metrics.gap.xxl + metrics.gap.s, paddingHorizontal: spacing.pagePadding, gap: metrics.gap.xl },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: spacing.pagePadding + metrics.gap.xs },
  gridCell: { width: "48.3%" },
  section: { paddingTop: spacing.sectionGap, paddingHorizontal: spacing.pagePadding },
  sectionTitle: { marginBottom: metrics.gap.xs },
  pinned: { position: "absolute", top: 0, start: 0, end: 0, backgroundColor: colors.background, boxShadow: shadows.pinnedHeader },
  pinnedRow: { height: m.compactHeaderHeight, flexDirection: "row", alignItems: "center", gap: metrics.gap.xl, paddingHorizontal: spacing.pagePadding },
  pinnedTitle: { flex: 1 },
});
