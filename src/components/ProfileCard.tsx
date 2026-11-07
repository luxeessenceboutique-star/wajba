import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { colors, metrics } from "@/theme";
import type { Profile } from "@/types/models";
import { FoodImage } from "./FoodImage";
import { Icon } from "./Icon";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

const m = metrics.profileCard;

export interface ProfileCardProps {
  profile: Profile;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Selectable profile card (multi-select). Selected: 2 pt Majorelle border, soft blue fill, filled check. */
export function ProfileCard({ profile, selected, onPress, style }: ProfileCardProps) {
  return (
    <Touchable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityLabel={`${profile.name}, ${profile.perk}`}
      aria-checked={selected}
      style={[styles.card, selected ? styles.on : styles.off, style]}
    >
      <FoodImage source={profile.image} tint={profile.tint} height={m.circle} width={m.circle} radius={m.circle / 2} scale={m.art / m.circle} />
      <View style={styles.text}>
        <Text variant="profileName">{profile.name}</Text>
        <Text variant="perk" color="muted">
          {profile.perk}
        </Text>
      </View>
      <View style={[styles.check, selected ? styles.checkOn : styles.checkOff]}>
        {selected && <Icon name="check" size={metrics.icon.small} color={colors.onPrimary} strokeWidth={3} />}
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: m.minHeight, borderRadius: m.radius, padding: m.padding, gap: m.gap },
  on: { backgroundColor: colors.primaryTint, borderWidth: metrics.optionGroup.borderWidth, borderColor: colors.primary },
  off: { backgroundColor: colors.background, borderWidth: metrics.button.borderWidth, borderColor: colors.border },
  text: { gap: metrics.gap.hair },
  check: { position: "absolute", top: m.checkInset, end: m.checkInset, width: m.check, height: m.check, borderRadius: m.check / 2, alignItems: "center", justifyContent: "center" },
  checkOn: { backgroundColor: colors.primary },
  checkOff: { borderWidth: metrics.optionGroup.borderWidth, borderColor: colors.borderStrong },
});
