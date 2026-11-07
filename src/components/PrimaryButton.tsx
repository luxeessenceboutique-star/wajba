import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, metrics } from "@/theme";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

export type ButtonVariant = "primary" | "outline" | "dark";

export interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  /** primary = Majorelle (the only action color), outline = bordered, dark = ink. */
  variant?: ButtonVariant;
  /** "large" = 54 pt CTA, "medium" = 48 pt secondary button. */
  size?: "large" | "medium";
  disabled?: boolean;
  icon?: IconName;
  /** Custom leading element, e.g. a brand logo. */
  leading?: ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

const palette: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.primary, fg: colors.onPrimary },
  outline: { bg: colors.background, fg: colors.ink, border: colors.borderStrong },
  dark: { bg: colors.ink, fg: colors.white },
};

export function PrimaryButton({
  label,
  onPress,
  variant = "primary",
  size = "large",
  disabled = false,
  icon,
  leading,
  accessibilityLabel,
  accessibilityHint,
  style,
}: PrimaryButtonProps) {
  const p = palette[variant];
  const large = size === "large";
  const height = large ? metrics.button.height : metrics.button.heightSmall;
  const bg = disabled ? colors.borderStrong : p.bg;
  const fg = disabled ? colors.muted : p.fg;

  return (
    <Touchable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      aria-disabled={disabled}
      style={[
        styles.base,
        { minHeight: height, borderRadius: height / 2, backgroundColor: bg },
        p.border && !disabled && { borderWidth: metrics.button.borderWidth, borderColor: p.border },
        style,
      ]}
    >
      {(leading || icon) && (
        <View style={styles.leading}>{leading ?? (icon && <Icon name={icon} color={fg} />)}</View>
      )}
      <Text variant={large ? "button" : "buttonSmall"} color={fg} numberOfLines={1}>
        {label}
      </Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  base: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: metrics.button.paddingX, gap: metrics.button.gap },
  leading: { alignItems: "center", justifyContent: "center" },
});
