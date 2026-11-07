import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { t } from "@/i18n";
import { metrics, spacing } from "@/theme";
import { IconButton } from "./IconButton";
import { Text } from "./Text";

export interface ScreenHeaderProps {
  title?: string;
  /** Defaults to going back; pass null to hide the back button. */
  onBack?: (() => void) | null;
  /** End-side element, e.g. a "Vider" link or a lock badge. */
  right?: ReactNode;
  /** Add the top safe-area inset (on by default). */
  safeArea?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Title bar: back button, centered title (18/800), optional action. */
export function ScreenHeader({ title, onBack, right, safeArea = true, style }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const back = onBack === undefined ? () => router.back() : onBack;
  const side = metrics.iconButton.size;
  return (
    <View style={[styles.bar, { paddingTop: (safeArea ? insets.top : 0) + metrics.screenHeader.paddingTop }, style]}>
      <View style={{ minWidth: side }}>{back && <IconButton icon="chevronLeft" accessibilityLabel={t("common.back")} onPress={back} />}</View>
      <Text variant="screenTitleBar" align="center" numberOfLines={1} style={styles.title} accessibilityRole="header">
        {title ?? ""}
      </Text>
      <View style={[styles.right, { minWidth: side }]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: metrics.screenHeader.gap,
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: metrics.gap.m,
    minHeight: metrics.screenHeader.minHeight,
  },
  title: { flex: 1 },
  right: { alignItems: "flex-end" },
});
