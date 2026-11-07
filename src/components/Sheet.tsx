import { useEffect, useState, type ReactNode } from "react";
import { Animated, Easing, Modal, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { t } from "@/i18n";
import { colors, metrics, shadows } from "@/theme";
import { Text } from "./Text";

const m = metrics.sheet;

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** Bottom sheet: dimmed backdrop (tap to close), white panel sliding up, rounded top. */
export function Sheet({ visible, onClose, title, children }: SheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent navigationBarTranslucent>
      <View style={styles.root}>
        <Pressable style={styles.scrim} onPress={onClose} accessibilityRole="button" accessibilityLabel={t("common.close")} />
        <SheetPanel title={title}>{children}</SheetPanel>
      </View>
    </Modal>
  );
}

function SheetPanel({ title, children }: { title?: string; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [offset] = useState(() => new Animated.Value(height * 0.4));

  useEffect(() => {
    Animated.timing(offset, { toValue: 0, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [offset]);

  return (
    <Animated.View
      accessibilityViewIsModal
      style={[styles.panel, { maxHeight: height * m.maxHeightRatio, paddingBottom: insets.bottom + m.padding, transform: [{ translateY: offset }] }]}
    >
      <View style={styles.handle} />
      {title && (
        <Text variant="screenTitleBar" accessibilityRole="header">
          {title}
        </Text>
      )}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: colors.scrim },
  panel: {
    backgroundColor: colors.background,
    borderTopLeftRadius: m.radius,
    borderTopRightRadius: m.radius,
    paddingHorizontal: m.padding,
    paddingTop: metrics.gap.m,
    gap: metrics.gap.xl,
    boxShadow: shadows.sheet,
  },
  handle: { alignSelf: "center", width: m.handleWidth, height: m.handleHeight, borderRadius: m.handleHeight / 2, backgroundColor: colors.borderStrong, marginBottom: metrics.gap.xs },
});
