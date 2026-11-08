import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, metrics } from "@/theme";
import type { Kitchen } from "@/types/models";
import { Text } from "./Text";

export interface KitchenAvatarProps {
  kitchen: Pick<Kitchen, "initials" | "color" | "initialsColor" | "name">;
  size?: number;
  /** White ring, used when the avatar overlaps a cover image. */
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function KitchenAvatar({ kitchen, size = metrics.avatar.medium, bordered = false, style }: KitchenAvatarProps) {
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={kitchen.name}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: kitchen.color },
        bordered && styles.bordered,
        bordered && size >= metrics.avatar.large && { borderWidth: metrics.avatar.borderLarge },
        style,
      ]}
    >
      <Text
        variant={size >= metrics.avatar.large ? "initialsLarge" : size <= metrics.avatar.small ? "initialsSmall" : "initials"}
        color={kitchen.initialsColor ?? colors.white}
      >
        {kitchen.initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
  bordered: { borderWidth: metrics.kitchenCard.avatarBorder, borderColor: colors.white },
});
