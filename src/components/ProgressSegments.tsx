import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { t } from "@/i18n";
import { colors, metrics } from "@/theme";
import { Text } from "./Text";

const m = metrics.progress;

export interface ProgressSegmentsProps {
  /** Index of the current step (0-based). Steps before it are done. */
  current: number;
  /** How far the current step is (0–1). */
  currentProgress?: number;
  /** Optional labels under the segments (Confirmée · En cuisine · En route · Livrée). */
  labels?: string[];
  segments?: number;
  style?: StyleProp<ViewStyle>;
}

export function ProgressSegments({ current, currentProgress = 0.5, labels, segments = labels?.length ?? m.segments, style }: ProgressSegmentsProps) {
  const label = labels?.[current];
  return (
    <View
      style={[styles.wrap, style]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label ? t("tracking.progress", { step: current + 1, total: segments, label }) : undefined}
      accessibilityValue={{ min: 0, max: segments, now: current + currentProgress }}
    >
      <View style={styles.track}>
        {Array.from({ length: segments }, (_, i) => {
          const fill = i < current ? 1 : i === current ? Math.max(0, Math.min(1, currentProgress)) : 0;
          return (
            <View key={i} style={styles.segment}>
              {fill > 0 && <View style={[styles.fill, { width: `${fill * 100}%` }]} />}
            </View>
          );
        })}
      </View>
      {labels && (
        <View style={styles.labels}>
          {labels.map((l, i) => (
            <Text key={l} variant="caption" color={i <= current ? "ink" : "muted"} style={[styles.label, i === current && styles.labelCurrent]} numberOfLines={1}>
              {l}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: metrics.gap.m },
  track: { flexDirection: "row", gap: m.gap },
  segment: { flex: 1, height: m.height, borderRadius: m.radius, backgroundColor: colors.border, overflow: "hidden" },
  fill: { height: "100%", borderRadius: m.radius, backgroundColor: colors.primary },
  labels: { flexDirection: "row", gap: m.gap },
  label: { flex: 1 },
  labelCurrent: { color: colors.primary },
});
