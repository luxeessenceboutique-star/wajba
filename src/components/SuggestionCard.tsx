import { StyleSheet, View } from "react-native";

import { t } from "@/i18n";
import { formatPrice } from "@/lib/format";
import { colors, metrics } from "@/theme";
import type { MenuItem } from "@/types/models";
import { FoodImage } from "./FoodImage";
import { IconButton } from "./IconButton";
import { Text } from "./Text";

const m = metrics.suggestionCard;
const ART_SCALE = 1.5;

/** Small card in the cart's "Souvent pris ensemble" row. */
export function SuggestionCard({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  return (
    <View style={styles.card}>
      <View>
        <FoodImage source={item.image} tint={item.tint ?? colors.tints[0]} height={m.imageHeight} width={m.width} radius={m.radius} scale={ART_SCALE} />
        <IconButton icon="plus" variant="white" iconColor={colors.primary} accessibilityLabel={t("menu.add", { name: item.name })} onPress={onAdd} style={styles.add} />
      </View>
      <Text variant="suggestionName" numberOfLines={1}>
        {item.name}
      </Text>
      <Text variant="suggestionPrice">{formatPrice(item.price)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: m.width, gap: metrics.gap.xs },
  add: { position: "absolute", end: m.addInset, bottom: m.addInset, width: m.addButton, height: m.addButton, borderRadius: m.addButton / 2 },
});
