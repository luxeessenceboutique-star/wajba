import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { metrics } from "@/theme";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Link on the end side, e.g. "Voir tout". */
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SectionHeader({ title, subtitle, actionLabel, onAction, style }: SectionHeaderProps) {
  return (
    <View style={[styles.row, style]}>
      <View style={styles.text}>
        <Text variant="sectionTitle" accessibilityRole="header">
          {title}
        </Text>
        {subtitle && (
          <Text variant="bodySmall" color="muted">
            {subtitle}
          </Text>
        )}
      </View>
      {actionLabel && (
        <Touchable onPress={onAction} accessibilityRole="link" hitSlop={metrics.gap.l} style={styles.action}>
          <Text variant="link" color="primary">
            {actionLabel}
          </Text>
        </Touchable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: metrics.gap.xl },
  text: { flex: 1, gap: metrics.gap.hair },
  action: { minHeight: metrics.sectionAction.minHeight, justifyContent: "center" },
});
