import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { t } from "@/i18n";
import { discountPercent, formatDiscountPercent, formatEta, formatKcal, formatProtein, joinDot } from "@/lib/format";
import { colors, metrics } from "@/theme";
import type { Kitchen, MenuItem } from "@/types/models";
import { Badge } from "./Badge";
import { FoodImage } from "./FoodImage";
import { IconButton } from "./IconButton";
import { Price } from "./Price";
import { Rating } from "./Rating";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

const m = metrics.dishCard;
/** Illustration size relative to the image height (230 / 150 in the design). */
const ART_SCALE = 1.53;

export interface DishCardProps {
  item: MenuItem;
  kitchen?: Pick<Kitchen, "name" | "etaMin" | "etaMax">;
  onPress?: () => void;
  favorite?: boolean;
  /** Shows the heart button when set. */
  onToggleFavorite?: () => void;
  width?: number;
  style?: StyleProp<ViewStyle>;
}

/** Card in the horizontal "Populaires près de toi" list. */
export function DishCard({ item, kitchen, onPress, favorite = false, onToggleFavorite, width = m.width, style }: DishCardProps) {
  const discount = item.oldPrice ? discountPercent(item.price, item.oldPrice) : 0;
  const meta = kitchen ? joinDot([kitchen.name, formatEta(kitchen.etaMin, kitchen.etaMax)]) : undefined;

  const favoriteLabel = favorite ? t("common.removeFromFavorites") : t("common.addToFavorites");
  // On iOS a pressable card hides inner buttons from VoiceOver, so the heart
  // is also offered as an accessibility action on the card.
  return (
    <Touchable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={joinDot([item.name, meta])}
      accessibilityActions={onToggleFavorite ? [{ name: "favorite", label: favoriteLabel }] : undefined}
      onAccessibilityAction={(e) => e.nativeEvent.actionName === "favorite" && onToggleFavorite?.()}
      style={[styles.card, { width }, style]}
    >
      <FoodImage source={item.image} tint={item.tint ?? colors.tints[0]} height={m.imageHeight} radius={m.radius} scale={ART_SCALE}>
        {discount > 0 ? (
          <Badge label={formatDiscountPercent(discount)} tone="discount" shape="rounded" style={styles.badge} />
        ) : item.protein ? (
          <Badge label={formatProtein(item.protein)} tone="success" shape="rounded" style={styles.badge} />
        ) : null}
        {onToggleFavorite && (
          <IconButton
            icon="heart"
            size="small"
            variant="white"
            filled={favorite}
            selected={favorite}
            iconColor={favorite ? colors.terracotta : colors.ink}
            accessibilityLabel={favoriteLabel}
            onPress={onToggleFavorite}
            style={styles.heart}
          />
        )}
      </FoodImage>
      <View style={styles.body}>
        <Text variant="cardTitle" numberOfLines={1}>
          {item.name}
        </Text>
        {meta && (
          <Text variant="cardMeta" color="muted" numberOfLines={1}>
            {meta}
          </Text>
        )}
        <View style={styles.row}>
          <Price price={item.price} oldPrice={item.oldPrice} />
          {!item.oldPrice && item.kcal !== undefined && (
            <Text variant="meta" color="muted">
              {formatKcal(item.kcal)}
            </Text>
          )}
          {item.rating !== undefined && <Rating rating={item.rating} />}
        </View>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  card: { gap: m.gap },
  badge: { position: "absolute", top: m.badgeInset, start: m.badgeInset },
  heart: { position: "absolute", top: m.heartInset, end: m.heartInset },
  body: { gap: metrics.gap.tight },
  row: { flexDirection: "row", alignItems: "center", gap: m.gap },
});
