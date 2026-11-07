import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, metrics, shadows, spacing } from "@/theme";

export interface BottomBarProps {
  children: ReactNode;
  /** Top hairline + white background (CTA bars). Off for the floating cart bar. */
  surface?: boolean;
  /** Add the bottom safe-area inset (off when a TabBar sits below). */
  safeArea?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Container fixed to the bottom of the screen for CTA bars
 * ("Ajouter · 55 DH", "Commander · 155 DH") and the floating cart bar.
 * Render it as the last child of a flex: 1 screen.
 */
export function BottomBar({ children, surface = true, safeArea = true, style }: BottomBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        surface && styles.surface,
        { paddingBottom: (safeArea ? insets.bottom : 0) + metrics.gap.xl },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { position: "absolute", start: 0, end: 0, bottom: 0, paddingHorizontal: spacing.pagePadding, paddingTop: metrics.gap.xl, gap: metrics.gap.xl },
  surface: { backgroundColor: colors.background, borderTopWidth: metrics.hairline, borderTopColor: colors.border, boxShadow: shadows.sheet },
});
