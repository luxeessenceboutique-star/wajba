import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { t } from "@/i18n";
import { colors, metrics } from "@/theme";
import { Icon } from "./Icon";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

const m = metrics.stepper;

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Compact bordered version used in cart lines (36 pt tall). */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Stepper({ value, onChange, min = 1, max = 99, compact = false, style }: StepperProps) {
  const canDec = value > min;
  const canInc = value < max;
  const buttonSize = compact ? m.compactButton : m.button;
  const slop = Math.max(0, (metrics.iconButton.size - buttonSize) / 2);

  const button = (kind: "minus" | "plus", enabled: boolean, next: number) => (
    <Touchable
      onPress={() => onChange(next)}
      disabled={!enabled}
      hitSlop={slop}
      accessibilityRole="button"
      accessibilityLabel={kind === "minus" ? t("stepper.decrease") : t("stepper.increase")}
      aria-disabled={!enabled}
      style={[
        styles.button,
        { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
        !compact && styles.buttonFilled,
        !enabled && styles.disabled,
      ]}
    >
      <Icon
        name={kind}
        size={compact ? metrics.icon.medium : metrics.icon.size}
        color={compact && kind === "plus" ? colors.primary : colors.ink}
      />
    </Touchable>
  );

  return (
    <View
      style={[styles.base, compact ? styles.compact : styles.full, style]}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={t("stepper.quantity", { count: value })}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === "increment" && canInc) onChange(value + 1);
        if (e.nativeEvent.actionName === "decrement" && canDec) onChange(value - 1);
      }}
    >
      {button("minus", canDec, value - 1)}
      <Text variant="count" align="center" style={styles.count}>
        {value}
      </Text>
      {button("plus", canInc, value + 1)}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start" },
  full: { backgroundColor: colors.surface, borderRadius: (m.button + m.padding * 2) / 2, padding: m.padding, gap: metrics.gap.xs },
  compact: {
    height: m.compactHeight,
    borderRadius: m.compactHeight / 2,
    borderWidth: m.borderWidth,
    borderColor: colors.borderStrong,
    paddingHorizontal: metrics.gap.hair,
  },
  button: { alignItems: "center", justifyContent: "center" },
  buttonFilled: { backgroundColor: colors.white },
  disabled: { opacity: metrics.opacity.disabled },
  count: { minWidth: m.minCountWidth },
});
