import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, metrics } from "@/theme";
import { Icon } from "./Icon";
import { Text } from "./Text";

export interface InfoItem {
  value: string;
  label: string;
  /** success = mint value (free delivery). */
  tone?: "default" | "success";
  /** Star before the value (rating). */
  star?: boolean;
}

/** Bordered strip of equal columns: "★ 4,8 / 2,1k avis · 25–35 min / Livraison · Gratuite / dès 150 DH". */
export function InfoStrip({ items, style }: { items: InfoItem[]; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.strip, style]}>
      {items.map((item, i) => (
        <View key={item.label} style={[styles.cell, i < items.length - 1 && styles.divider]} accessible accessibilityLabel={`${item.value}, ${item.label}`}>
          <View style={styles.valueRow}>
            {item.star && <Icon name="star" size={metrics.icon.small} color={colors.star} />}
            <Text variant="infoValue" color={item.tone === "success" ? "mint" : "ink"} numberOfLines={1}>
              {item.value}
            </Text>
          </View>
          <Text variant="small" color="muted" numberOfLines={1}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: "row", borderWidth: metrics.hairline, borderColor: colors.border, borderRadius: metrics.infoStrip.radius },
  cell: { flex: 1, alignItems: "center", paddingVertical: metrics.infoStrip.paddingY, paddingHorizontal: metrics.infoStrip.paddingX, gap: metrics.hairline },
  divider: { borderRightWidth: metrics.hairline, borderRightColor: colors.border },
  valueRow: { flexDirection: "row", alignItems: "center", gap: metrics.gap.xs },
});
