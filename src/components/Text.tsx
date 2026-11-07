import { StyleSheet, Text as RNText, type TextProps as RNTextProps } from "react-native";

import { colors, typography, type ColorName, type TypographyVariant } from "@/theme";

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  /** A theme color name ("muted") or any color value. */
  color?: ColorName | (string & {});
  align?: "auto" | "left" | "right" | "center" | "justify";
  /** Strike-through, used for old prices. */
  strike?: boolean;
}

function resolveColor(color: TextProps["color"]): string {
  if (!color) return colors.ink;
  return color in colors ? (colors[color as ColorName] as string) : color;
}

/** Every piece of text in the app goes through this, so fonts stay consistent. */
export function Text({ variant = "body", color, align, strike, style, maxFontSizeMultiplier = 1.4, ...rest }: TextProps) {
  return (
    <RNText
      {...rest}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[typography[variant], { color: resolveColor(color) }, align && { textAlign: align }, strike && styles.strike, style]}
    />
  );
}

const styles = StyleSheet.create({
  strike: { textDecorationLine: "line-through" },
});
