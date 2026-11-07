import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, metrics, shadows } from "@/theme";
import { Icon, type IconName } from "./Icon";
import { Touchable } from "./Touchable";

export interface IconButtonProps {
  icon: IconName;
  /** Required: icon-only buttons must be labelled for screen readers. */
  accessibilityLabel: string;
  onPress?: () => void;
  /** 44 pt by default; "small" is the 34 pt heart on dish cards (touch area stays 44). */
  size?: "default" | "small";
  /** surface = grey circle, white = over images, floating = white with shadow (maps), primary = blue. */
  variant?: "surface" | "white" | "floating" | "primary";
  iconColor?: string;
  iconSize?: number;
  /** Filled icon variant (liked heart). */
  filled?: boolean;
  /** Small terracotta dot, e.g. unread notifications. */
  dot?: boolean;
  disabled?: boolean;
  /** Toggle buttons (favorite) report their state. */
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
}

const backgrounds = {
  surface: colors.surface,
  white: colors.white,
  floating: colors.white,
  primary: colors.primary,
} as const;

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  size = "default",
  variant = "surface",
  iconColor,
  iconSize,
  filled,
  dot,
  disabled,
  selected,
  style,
}: IconButtonProps) {
  const diameter = size === "small" ? metrics.iconButton.small : metrics.iconButton.size;
  const slop = Math.max(0, (metrics.iconButton.size - diameter) / 2);
  const bg = backgrounds[variant];
  const fg = iconColor ?? (variant === "primary" ? colors.onPrimary : colors.ink);

  return (
    <Touchable
      onPress={onPress}
      disabled={disabled}
      hitSlop={slop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      aria-disabled={disabled}
      aria-selected={selected}
      style={[
        styles.base,
        { width: diameter, height: diameter, borderRadius: diameter / 2, backgroundColor: bg },
        variant === "floating" && { boxShadow: shadows.floatingButton },
        style,
      ]}
    >
      <Icon
        name={icon}
        size={iconSize ?? (size === "small" ? metrics.icon.medium : metrics.icon.large)}
        color={fg}
        filled={filled}
        knockoutColor={bg}
      />
      {dot && <View style={[styles.dot, { borderColor: bg }]} />}
    </Touchable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
  // The design's 9 pt dot has a 2 pt ring outside it (CSS content-box);
  // React Native sizes include the border, so add it here.
  dot: {
    position: "absolute",
    top: metrics.iconButton.dotTop - metrics.iconButton.dotBorder,
    end: metrics.iconButton.dotEnd - metrics.iconButton.dotBorder,
    width: metrics.iconButton.dot + metrics.iconButton.dotBorder * 2,
    height: metrics.iconButton.dot + metrics.iconButton.dotBorder * 2,
    borderRadius: metrics.iconButton.dot,
    borderWidth: metrics.iconButton.dotBorder,
    backgroundColor: colors.terracotta,
  },
});
