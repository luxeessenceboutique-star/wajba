import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { formatPriceDelta } from "@/lib/format";
import { colors, metrics } from "@/theme";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

const m = metrics.selectChip;

export interface SelectChipProps {
  label: string;
  /** Leading color dot (ingredient color). */
  color?: string;
  /** Shown after the label when > 0, e.g. "+8 DH". */
  priceDelta?: number;
  selected: boolean;
  /** Inert (group max reached). */
  disabled?: boolean;
  onPress: () => void;
  /** "checkbox" for multi-choice steps, "radio" for single choice. */
  role?: "checkbox" | "radio";
  style?: StyleProp<ViewStyle>;
}

/** Compose chips. Selected: filled Majorelle with white text (not color-only: fill inverts). */
export function SelectChip({ label, color, priceDelta = 0, selected, disabled = false, onPress, role = "checkbox", style }: SelectChipProps) {
  const text = priceDelta > 0 ? `${label} ${formatPriceDelta(priceDelta)}` : label;
  return (
    <Touchable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={role}
      accessibilityLabel={text}
      aria-checked={selected}
      aria-disabled={disabled}
      style={[styles.chip, selected ? styles.on : styles.off, disabled && styles.inert, style]}
    >
      {color && <View style={[styles.dot, { backgroundColor: color }]} />}
      <Text variant="chip" color={selected ? colors.onPrimary : colors.ink} numberOfLines={1}>
        {text}
      </Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    minHeight: m.height,
    borderRadius: m.radius,
    paddingStart: m.paddingStart,
    paddingEnd: m.paddingEnd,
    flexDirection: "row",
    alignItems: "center",
    gap: m.gap,
  },
  off: { backgroundColor: colors.background, borderWidth: metrics.button.borderWidth, borderColor: colors.borderStrong },
  on: { backgroundColor: colors.primary, borderWidth: metrics.button.borderWidth, borderColor: colors.primary },
  inert: { opacity: metrics.opacity.inert },
  dot: { width: m.dot, height: m.dot, borderRadius: m.dot / 2, borderWidth: metrics.hairline, borderColor: colors.dotOutline },
});
