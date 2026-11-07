import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import LogoMark from "@assets/brand/logo-mark.svg";
import LogoMarkOnBlue from "@assets/brand/logo-mark-on-blue.svg";
import { t } from "@/i18n";
import { colors, fontFamily, metrics } from "@/theme";
import { Text } from "./Text";

/** Logo mark proportions (viewBox 120 × 150). */
const MARK_RATIO = 150 / 120;
/** Wordmark: Plus Jakarta Sans 800, lowercase, letter-spacing −0.06em. */
const WORDMARK_TRACKING = -0.06;
/** Mark width, Arabic text size and line height relative to the wordmark size (brand board). */
const MARK_SCALE = 0.9;
const ARABIC_SCALE = 0.62;
const LINE_HEIGHT = 1.1;

export interface LogoProps {
  /** Height of the wordmark text in points. */
  size?: number;
  /** White pin and white wordmark, for the Majorelle splash. */
  onBlue?: boolean;
  /** Arabic "وجبة" next to the wordmark (splash and brand board only). */
  showArabic?: boolean;
  /** Show the pin mark before the wordmark. */
  showMark?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Logo({ size = 40, onBlue = false, showArabic = false, showMark = true, style }: LogoProps) {
  const Mark = onBlue ? LogoMarkOnBlue : LogoMark;
  const markWidth = size * MARK_SCALE;
  return (
    <View style={[styles.row, style]} accessible accessibilityRole="image" accessibilityLabel="Wajba">
      {showMark && <Mark width={markWidth} height={markWidth * MARK_RATIO} />}
      <Text
        style={{
          fontFamily: fontFamily[800],
          fontSize: size,
          lineHeight: size * LINE_HEIGHT,
          letterSpacing: size * WORDMARK_TRACKING,
          color: onBlue ? colors.white : colors.ink,
        }}
      >
        {t("brand.name")}
      </Text>
      {showArabic && (
        <Text style={{ fontFamily: fontFamily.arabicLogo, fontSize: size * ARABIC_SCALE, color: colors.saffron }}>{t("brand.arabic")}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", gap: metrics.gap.m },
});
