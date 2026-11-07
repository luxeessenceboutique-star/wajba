import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { colors, metrics, spacing } from "@/theme";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

export interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Default: grey with ink text. Active: ink with white text (inverted, not color-only). */
export function FilterChip({ label, active = false, onPress, style }: FilterChipProps) {
  return (
    <Touchable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      aria-selected={active}
      style={[styles.chip, { backgroundColor: active ? colors.ink : colors.surface }, style]}
    >
      <Text variant={active ? "chipActive" : "chip"} color={active ? colors.white : colors.ink} numberOfLines={1}>
        {label}
      </Text>
    </Touchable>
  );
}

export interface FilterChipRowProps<Id extends string> {
  options: { id: Id; label: string }[];
  value: Id;
  onChange: (id: Id) => void;
  style?: StyleProp<ViewStyle>;
}

/** Horizontally scrolling row of single-choice filter chips. */
export function FilterChipRow<Id extends string>({ options, value, onChange, style }: FilterChipRowProps<Id>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={style}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
    >
      {options.map((o) => (
        <FilterChip key={o.id} label={o.label} active={o.id === value} onPress={() => onChange(o.id)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: metrics.filterChip.height,
    borderRadius: metrics.filterChip.radius,
    paddingHorizontal: metrics.filterChip.paddingX,
    alignItems: "center",
    justifyContent: "center",
  },
  row: { paddingHorizontal: spacing.pagePadding, gap: metrics.filterChip.gap },
});
