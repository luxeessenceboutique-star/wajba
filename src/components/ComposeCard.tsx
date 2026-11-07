import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

import { t } from "@/i18n";
import { colors, metrics } from "@/theme";
import { FoodImage } from "./FoodImage";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

const m = metrics.composeCard;

export interface ComposeCardProps {
  onPress?: () => void;
  image?: string;
  style?: StyleProp<ViewStyle>;
}

/** Home card leading to "Compose ta wajba" (mint tint, bowl bleeding off the top-end corner). */
export function ComposeCard({ onPress, image = "bowl", style }: ComposeCardProps) {
  return (
    <Touchable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${t("home.composeTitle")}. ${t("home.composeText")}`}
      style={[styles.card, style]}
    >
      <FoodImage
        source={image}
        tint="transparent"
        height={m.height}
        scale={m.imageSize / m.height}
        placement="topEnd"
        offset={{ x: m.imageOffsetEnd, y: m.imageOffsetTop }}
        style={StyleSheet.absoluteFill}
      />
      <Text variant="cardHeadline">{t("home.composeTitle")}</Text>
      <Text variant="bodySmall" color="inkSecondary" style={styles.text}>
        {t("home.composeText")}
      </Text>
      <Text variant="link" color="primary">
        {t("home.composeCta")}
      </Text>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: m.height,
    borderRadius: m.radius,
    backgroundColor: colors.mintTint,
    padding: m.padding,
    overflow: "hidden",
    justifyContent: "center",
    gap: metrics.gap.xs,
  },
  text: { maxWidth: m.textMaxWidth },
});
