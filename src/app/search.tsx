/** Search (not designed in v3 — built in the same style). Opened from Home and from a kitchen ("Rechercher dans le menu"). */
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api } from "@/api";
import { EmptyState, IconButton, LoadingState, MenuRow, SearchField, Text } from "@/components";
import { getKitchen } from "@/data/kitchens";
import { t } from "@/i18n";
import { useAsync } from "@/lib/useAsync";
import { colors, metrics, spacing } from "@/theme";
import type { MenuItem } from "@/types/models";

function openDish(item: MenuItem) {
  router.push({ pathname: "/dish/[id]", params: { id: item.id } });
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { kitchenId } = useLocalSearchParams<{ kitchenId?: string }>();
  const kitchen = kitchenId ? getKitchen(kitchenId) : undefined;
  const [query, setQuery] = useState("");
  const results = useAsync(`search:${kitchenId ?? ""}:${query}`, () => api.menu.search(query, kitchenId), { keepPrevious: true });

  const items = results.data ?? [];
  const heading = query.trim()
    ? items.length === 1
      ? t("search.oneResult")
      : t("search.results", { count: items.length })
    : kitchen
      ? t("search.allDishes")
      : t("search.popular");

  return (
    <View style={styles.screen}>
      <View style={[styles.top, { paddingTop: insets.top + metrics.screenHeader.paddingTop }]}>
        <IconButton icon="chevronLeft" accessibilityLabel={t("common.back")} onPress={() => router.back()} />
        <SearchField
          value={query}
          onChangeText={setQuery}
          autoFocus
          placeholder={kitchen ? t("search.inKitchen", { kitchen: kitchen.name }) : undefined}
          style={styles.field}
        />
      </View>

      {!results.data && results.loading ? (
        <LoadingState />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.sectionGap }]}
          ListHeaderComponent={
            items.length > 0 ? (
              <Text variant="eyebrow" color="muted" accessibilityLiveRegion="polite" style={styles.heading}>
                {heading}
              </Text>
            ) : undefined
          }
          ListEmptyComponent={<EmptyState icon="search" title={t("search.noResultsTitle")} text={t("search.noResultsText")} />}
          renderItem={({ item, index }) => (
            <MenuRow item={item} onPress={() => openDish(item)} onAdd={() => openDish(item)} divider={index < items.length - 1} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  top: { flexDirection: "row", alignItems: "center", gap: metrics.gap.l, paddingHorizontal: spacing.pagePadding, paddingBottom: metrics.gap.m },
  field: { flex: 1 },
  list: { paddingHorizontal: spacing.pagePadding, flexGrow: 1 },
  heading: { paddingTop: spacing.pagePadding },
});
