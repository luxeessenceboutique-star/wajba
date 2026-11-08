import { StyleSheet, View } from "react-native";

import { colors, metrics } from "@/theme";
import { Icon } from "./Icon";
import { Text } from "./Text";

const tones = {
  mint: { bg: colors.mintTint, fg: colors.mintOnTint },
  blue: { bg: colors.primarySoft, fg: colors.primaryOnSoft },
  neutral: { bg: colors.surface, fg: colors.ink },
} as const;

export interface InfoChipProps {
  label: string;
  /** mint = calories, blue = protein, neutral = rating. */
  tone?: keyof typeof tones;
  star?: boolean;
  accessibilityLabel?: string;
}

/** Small fact pill on the dish sheet: "880 kcal", "46 g protéines", "★ 4,8 (1,2k)". */
export function InfoChip({ label, tone = "neutral", star, accessibilityLabel }: InfoChipProps) {
  const { bg, fg } = tones[tone];
  return (
    <View style={[styles.chip, { backgroundColor: bg }]} accessible accessibilityLabel={accessibilityLabel ?? label}>
      {star && <Icon name="star" size={metrics.icon.small} color={colors.star} />}
      <Text variant="infoChip" color={fg}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: metrics.infoChip.height,
    borderRadius: metrics.infoChip.radius,
    paddingHorizontal: metrics.infoChip.paddingX,
    flexDirection: "row",
    alignItems: "center",
    gap: metrics.gap.xs,
  },
});
