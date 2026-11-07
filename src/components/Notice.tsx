import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, metrics } from "@/theme";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";

export interface NoticeProps {
  text: string;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}

/** Saffron promo strip, e.g. "−15 % sur les tajines jusqu'à 15h". */
export function Notice({ text, icon = "tag", style }: NoticeProps) {
  return (
    <View style={[styles.strip, style]} accessible accessibilityLabel={text}>
      <Icon name={icon} color={colors.terracotta} />
      <Text variant="chip" style={styles.text}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    minHeight: metrics.notice.minHeight,
    borderRadius: metrics.notice.radius,
    backgroundColor: colors.saffronTint,
    paddingHorizontal: metrics.notice.paddingX,
    flexDirection: "row",
    alignItems: "center",
    gap: metrics.notice.gap,
  },
  text: { flex: 1 },
});
