/** All kitchens ("Voir les 6 cuisines") — not designed in v3, built in the same style. */
import { ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api } from "@/api";
import { ErrorState, KitchenCard, LoadingState, ScreenHeader, Text } from "@/components";
import { KITCHEN_COUNT } from "@/data/kitchens";
import { t } from "@/i18n";
import { useAsync } from "@/lib/useAsync";
import { colors, spacing } from "@/theme";

export default function KitchensScreen() {
  const insets = useSafeAreaInsets();
  const list = useAsync("kitchens", () => api.kitchens.list());

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("kitchens.title")} />
      {list.error ? (
        <ErrorState onRetry={list.reload} />
      ) : !list.data ? (
        <LoadingState />
      ) : (
        <ScrollView contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.sectionGap }]}>
          {list.data.map((k) => (
            <KitchenCard key={k.id} kitchen={k} onPress={() => router.push({ pathname: "/kitchen/[id]", params: { id: k.id } })} />
          ))}
          {KITCHEN_COUNT > list.data.length && (
            <Text variant="bodySmall" color="muted" align="center">
              {t("kitchens.moreSoon", { count: KITCHEN_COUNT - list.data.length })}
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.pagePadding, paddingTop: spacing.pagePadding, gap: spacing.sectionGap },
});
