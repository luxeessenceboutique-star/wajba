import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { t } from "@/i18n";
import { formatCount, formatEta, formatPrice, formatRating } from "@/lib/format";
import { colors, fontFamily, metrics } from "@/theme";
import type { Kitchen } from "@/types/models";
import { Badge } from "./Badge";
import { FoodImage } from "./FoodImage";
import { Icon } from "./Icon";
import { KitchenAvatar } from "./KitchenAvatar";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

const m = metrics.kitchenCard;
/** Illustration size relative to the cover height (250 / 156 in the design). */
const ART_SCALE = 1.6;

export interface KitchenCardProps {
  kitchen: Kitchen;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function KitchenCard({ kitchen, onPress, style }: KitchenCardProps) {
  const free = kitchen.deliveryFee === 0;
  const fee = formatPrice(kitchen.deliveryFee);
  const a11y = [
    kitchen.name,
    kitchen.tagline,
    t("common.ratingWithCount", { rating: formatRating(kitchen.rating), count: formatCount(kitchen.ratingCount) }),
    formatEta(kitchen.etaMin, kitchen.etaMax),
    free ? t("kitchen.freeDelivery") : `${t("kitchen.delivery")} ${fee}`,
  ].join(", ");

  return (
    <Touchable onPress={onPress} accessibilityRole="button" accessibilityLabel={a11y} style={[styles.card, style]}>
      <View>
        <FoodImage source={kitchen.coverImage} tint={kitchen.coverTint} height={m.coverHeight} radius={m.radius} scale={ART_SCALE}>
          {free ? (
            <Badge label={t("kitchen.freeDelivery")} tone="success" style={styles.badge} />
          ) : kitchen.promo ? (
            <Badge label={kitchen.promo} tone="discount" shape="rounded" style={styles.badge} />
          ) : null}
        </FoodImage>
        <KitchenAvatar kitchen={kitchen} bordered style={styles.avatar} />
      </View>
      <View style={styles.body}>
        <Text variant="kitchenName" numberOfLines={1}>
          {kitchen.name}
        </Text>
        <Text variant="cardMeta" color="muted" numberOfLines={1}>
          {kitchen.tagline}
        </Text>
        <View style={styles.meta}>
          <Icon name="star" size={metrics.icon.small} color={colors.star} />
          <Text variant="cardMeta" color="inkSecondary" numberOfLines={1} style={styles.metaText}>
            <Text variant="cardMeta" color="inkSecondary" style={styles.bold}>
              {formatRating(kitchen.rating)}
            </Text>
            {` (${formatCount(kitchen.ratingCount)}) · ${formatEta(kitchen.etaMin, kitchen.etaMax)} · `}
            <Text variant="cardMeta" color={free ? colors.mint : colors.inkSecondary} style={free && styles.bold}>
              {fee}
            </Text>
          </Text>
        </View>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  card: { gap: metrics.dishCard.gap },
  badge: { position: "absolute", top: m.badgeInset, start: m.badgeInset },
  avatar: { position: "absolute", start: m.avatarInset, bottom: -m.avatarOverlap },
  body: { paddingTop: m.avatarOverlap, gap: metrics.gap.tight },
  meta: { flexDirection: "row", alignItems: "center", gap: metrics.gap.s },
  metaText: { flexShrink: 1 },
  bold: { fontFamily: fontFamily[700] },
});
