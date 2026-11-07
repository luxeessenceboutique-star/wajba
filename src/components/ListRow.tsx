import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, metrics } from "@/theme";
import { Badge } from "./Badge";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

const m = metrics.listRow;

export interface ListRowProps {
  icon: IconName;
  label: string;
  /** Muted value on the end side, e.g. "Français". */
  value?: string;
  /** Soft-blue pill on the end side, e.g. "30 DH chacun" (replaces the chevron). */
  badge?: string;
  /** Custom end element (a Switch…). */
  trailing?: ReactNode;
  onPress?: () => void;
  /** primary = blue icon circle (highlighted row). */
  tone?: "default" | "primary";
  divider?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Settings row: 36 pt icon circle, label, optional value, chevron. */
export function ListRow({ icon, label, value, badge, trailing, onPress, tone = "default", divider = true, style }: ListRowProps) {
  const highlighted = tone === "primary";
  const showChevron = !!onPress && !badge && !trailing;
  return (
    <Touchable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={[label, value, badge].filter(Boolean).join(", ")}
      style={[styles.row, divider && styles.divider, style]}
    >
      <View style={[styles.iconCircle, { backgroundColor: highlighted ? colors.primarySoft : colors.surface }]}>
        <Icon name={icon} size={metrics.icon.size} color={highlighted ? colors.primary : colors.ink} />
      </View>
      <Text variant="rowLabel" style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      {value && (
        <Text variant="bodySmall" color="muted" numberOfLines={1}>
          {value}
        </Text>
      )}
      {badge && <Badge label={badge} tone="info" />}
      {trailing}
      {showChevron && <Icon name="chevronRight" size={metrics.icon.medium} color={colors.muted} />}
    </Touchable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: m.minHeight, flexDirection: "row", alignItems: "center", gap: m.gap, paddingVertical: metrics.gap.m },
  divider: { borderBottomWidth: metrics.hairline, borderBottomColor: colors.border },
  iconCircle: { width: m.iconCircle, height: m.iconCircle, borderRadius: m.iconCircle / 2, alignItems: "center", justifyContent: "center" },
  label: { flex: 1 },
});
