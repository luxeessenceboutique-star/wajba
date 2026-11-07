/** 05 · Fiche produit — placeholder until phase 3 (option groups, live totals, add to cart). */
import { ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api } from "@/api";
import { ErrorState, FoodImage, IconButton, LoadingState, Notice, Price, Text } from "@/components";
import { t } from "@/i18n";
import { formatKcal, formatProtein, joinDot } from "@/lib/format";
import { useAsync } from "@/lib/useAsync";
import { colors, metrics, spacing } from "@/theme";

const HERO_HEIGHT = 300;
const HERO_ART_SCALE = 1.2;

export default function DishScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const dish = useAsync(`dish:${id}`, () => api.menu.getItem(id));

  if (dish.error) return <ErrorState onRetry={dish.reload} />;
  if (!dish.data) return <LoadingState />;
  const item = dish.data;
  const facts = joinDot([item.kcal !== undefined && formatKcal(item.kcal), item.protein !== undefined && formatProtein(item.protein)]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing.sectionGap }}>
        <FoodImage source={item.image} tint={item.tint ?? colors.tints[0]} height={HERO_HEIGHT} scale={HERO_ART_SCALE} accessibilityLabel={item.name}>
          <IconButton icon="close" variant="white" accessibilityLabel={t("common.close")} onPress={() => router.back()} style={[styles.close, { top: metrics.gap.xl }]} />
        </FoodImage>
        <View style={styles.body}>
          <Text variant="productTitle" accessibilityRole="header">
            {item.name}
          </Text>
          <Text variant="body" color="muted">
            {item.description}
          </Text>
          <Price price={item.price} oldPrice={item.oldPrice} />
          {facts ? (
            <Text variant="caption" color="mint">
              {facts}
            </Text>
          ) : null}
          <Notice icon="clock" text={t("placeholder.dishText")} style={styles.notice} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  close: { position: "absolute", start: spacing.pagePadding },
  body: { padding: spacing.pagePadding, gap: metrics.gap.l },
  notice: { marginTop: metrics.gap.xl },
});
