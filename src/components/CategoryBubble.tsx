import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { metrics } from "@/theme";
import type { Category } from "@/types/models";
import { FoodImage } from "./FoodImage";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

/** Illustration size inside the 74 pt bubble (80 / 74 in the design). */
const BUBBLE_ART_SCALE = 1.08;

export interface CategoryBubbleProps {
  label: string;
  image: string;
  tint: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function CategoryBubble({ label, image, tint, onPress, style }: CategoryBubbleProps) {
  const size = metrics.categoryBubble.size;
  return (
    <Touchable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={[styles.item, style]}>
      <FoodImage source={image} tint={tint} height={size} width={size} radius={size / 2} scale={BUBBLE_ART_SCALE} />
      <Text variant="label" numberOfLines={1} align="center">
        {label}
      </Text>
    </Touchable>
  );
}

export interface CategoryGridProps {
  categories: Category[];
  onSelect?: (category: Category) => void;
  style?: StyleProp<ViewStyle>;
}

/** 4 columns × 2 rows of category bubbles. */
export function CategoryGrid({ categories, onSelect, style }: CategoryGridProps) {
  const { columns, rowGap } = metrics.categoryBubble;
  // Each cell takes an exact 1/columns of the width; the bubble is centered
  // in it, which gives the design's column spacing without overflow.
  return (
    <View style={[styles.grid, { rowGap }, style]}>
      {categories.map((c) => (
        <CategoryBubble
          key={c.id}
          label={c.label}
          image={c.image}
          tint={c.tint}
          onPress={onSelect ? () => onSelect(c) : undefined}
          style={{ width: `${100 / columns}%` }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { alignItems: "center", gap: metrics.categoryBubble.gap },
  grid: { flexDirection: "row", flexWrap: "wrap" },
});
