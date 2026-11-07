import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, metrics } from "@/theme";
import { Text } from "./Text";

export interface SummaryRow {
  label: string;
  value: string;
  /** success = mint bold (free delivery, discounts). */
  tone?: "default" | "success";
  /** Struck-through value shown before `value`, e.g. "12 DH" before "Gratuite". */
  strikeValue?: string;
}

export interface SummaryBoxProps {
  rows: SummaryRow[];
  total?: { label: string; value: string };
  /** Small line under the total, e.g. "Tu gagnes 155 nojoum…". */
  footnote?: string;
  style?: StyleProp<ViewStyle>;
}

export function SummaryBox({ rows, total, footnote, style }: SummaryBoxProps) {
  return (
    <View style={[styles.box, style]}>
      {rows.map((row) => (
        <View key={row.label} style={styles.row} accessible accessibilityLabel={`${row.label}, ${row.strikeValue ? `${row.strikeValue}, ` : ""}${row.value}`}>
          <Text variant="summaryRow" color="muted">
            {row.label}
          </Text>
          <View style={styles.value}>
            {row.strikeValue && (
              <Text variant="summaryRow" color="mutedLight" strike>
                {row.strikeValue}
              </Text>
            )}
            <Text variant={row.tone === "success" ? "summaryRowBold" : "summaryRow"} color={row.tone === "success" ? "mint" : "ink"}>
              {row.value}
            </Text>
          </View>
        </View>
      ))}
      {total && (
        <>
          <View style={styles.divider} />
          <View style={styles.row} accessible accessibilityLabel={`${total.label}, ${total.value}`}>
            <Text variant="total">{total.label}</Text>
            <Text variant="total">{total.value}</Text>
          </View>
        </>
      )}
      {footnote && (
        <Text variant="caption" color="muted">
          {footnote}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: metrics.summaryBox.radius, backgroundColor: colors.surface, padding: metrics.summaryBox.padding, gap: metrics.summaryBox.rowGap },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: metrics.gap.xl },
  value: { flexDirection: "row", alignItems: "center", gap: metrics.gap.s },
  divider: { height: metrics.hairline, backgroundColor: colors.borderStrong, marginVertical: metrics.gap.xs },
});
