import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { colors, metrics } from "@/theme";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

export interface SelectCardProps {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Selectable card (Standard / Programmée). Selected: 2 pt Majorelle border on soft blue. */
export function SelectCard({ title, subtitle, selected, onPress, style }: SelectCardProps) {
  return (
    <Touchable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={[title, subtitle].filter(Boolean).join(", ")}
      aria-checked={selected}
      style={[styles.card, selected ? styles.on : styles.off, style]}
    >
      <Text variant="selectTitle">{title}</Text>
      {subtitle && (
        <Text variant="caption" color="muted" numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </Touchable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: metrics.selectCard.minHeight, borderRadius: metrics.selectCard.radius, paddingHorizontal: metrics.selectCard.paddingX, justifyContent: "center", gap: metrics.gap.hair },
  on: { borderWidth: metrics.optionGroup.borderWidth, borderColor: colors.primary, backgroundColor: colors.primaryTint },
  off: { borderWidth: metrics.button.borderWidth, borderColor: colors.border, backgroundColor: colors.background },
});
