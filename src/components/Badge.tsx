import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, metrics, type TypographyVariant } from "@/theme";
import { Text } from "./Text";

/**
 * - discount: terracotta, white text ("−15 %", "−10 % le soir")
 * - success:  white, mint text ("Livraison offerte", "42 g prot.")
 * - accent:   saffron, ink text ("Nouveau client", "Populaire")
 * - dark:     ink, white text ("Obligatoire")
 * - neutral:  surface, ink text ("Optionnel", "Jusqu'à 4")
 * - info:     soft blue, deep blue text ("30 DH chacun")
 */
export type BadgeTone = "discount" | "success" | "accent" | "dark" | "neutral" | "info";

const tones: Record<BadgeTone, { bg: string; fg: string }> = {
  discount: { bg: colors.terracotta, fg: colors.white },
  success: { bg: colors.white, fg: colors.mint },
  accent: { bg: colors.saffron, fg: colors.ink },
  dark: { bg: colors.ink, fg: colors.white },
  neutral: { bg: colors.surface, fg: colors.inkSecondary },
  info: { bg: colors.primarySoft, fg: colors.primaryOnSoft },
};

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  /** "rounded" = 8 pt corners (discounts on images), "pill" = fully round. */
  shape?: "rounded" | "pill";
  /** "small" is the 24 pt pill used on promo banners. */
  size?: "default" | "small";
  style?: StyleProp<ViewStyle>;
}

export function Badge({ label, tone = "neutral", shape = "pill", size = "default", style }: BadgeProps) {
  const { bg, fg } = tones[tone];
  const small = size === "small";
  const variant: TypographyVariant = small ? "badgeSmall" : "badge";
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: bg,
          minHeight: small ? metrics.promoBanner.badgeHeight : metrics.badge.height,
          borderRadius: shape === "rounded" ? metrics.badge.radius : metrics.badge.pillRadius,
          paddingHorizontal: small ? metrics.promoBanner.badgePaddingX : shape === "rounded" ? metrics.badge.paddingX : metrics.badge.pillPaddingX,
        },
        style,
      ]}
    >
      <Text variant={variant} color={fg} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", justifyContent: "center" },
});
