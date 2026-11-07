import { useState } from "react";
import { ScrollView, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent, type StyleProp, type ViewStyle } from "react-native";

import { colors, metrics, spacing } from "@/theme";
import type { Promo } from "@/types/models";
import { Badge } from "./Badge";
import { FoodImage } from "./FoodImage";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

const m = metrics.promoBanner;

export interface PromoBannerProps {
  promo: Promo;
  onPress?: () => void;
  width?: number;
  style?: StyleProp<ViewStyle>;
}

export function PromoBanner({ promo, onPress, width = m.width, style }: PromoBannerProps) {
  const onBlue = promo.tone === "primary";
  const bg = onBlue ? colors.primary : colors.saffron;
  const fg = onBlue ? colors.onPrimary : colors.ink;
  const label = [promo.badge, promo.title, promo.subtitle].filter(Boolean).join(". ");

  return (
    <Touchable
      onPress={onPress}
      disabled={!onPress}
      accessible
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={label}
      style={[styles.card, { width, backgroundColor: bg }, style]}
    >
      <FoodImage
        source={promo.image}
        tint="transparent"
        height={m.height}
        width={width}
        scale={m.imageSize / m.height}
        placement="bottomEnd"
        offset={{ x: m.imageOffsetEnd, y: m.imageOffsetBottom }}
        style={StyleSheet.absoluteFill}
      />
      {promo.badge && <Badge label={promo.badge} tone={onBlue ? "accent" : "dark"} size="small" />}
      <Text variant="promoTitle" color={fg} style={styles.title}>
        {promo.title}
      </Text>
      {promo.subtitle && (
        <Text variant="cardMeta" color={fg} style={styles.subtitle}>
          {promo.subtitle}
        </Text>
      )}
    </Touchable>
  );
}

export interface PromoCarouselProps {
  promos: Promo[];
  onPressPromo?: (promo: Promo) => void;
  style?: StyleProp<ViewStyle>;
}

/** Snapping carousel with the dot indicator (active dot is a wider pill). */
export function PromoCarousel({ promos, onPressPromo, style }: PromoCarouselProps) {
  const [index, setIndex] = useState(0);
  const interval = m.width + m.carouselGap;

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = Math.round(e.nativeEvent.contentOffset.x / interval);
    if (next !== index) setIndex(Math.max(0, Math.min(promos.length - 1, next)));
  }

  return (
    <View style={[styles.carousel, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={interval}
        decelerationRate="fast"
        onScroll={onScroll}
        scrollEventThrottle={32}
        contentContainerStyle={styles.track}
      >
        {promos.map((p) => (
          <PromoBanner key={p.id} promo={p} onPress={onPressPromo ? () => onPressPromo(p) : undefined} />
        ))}
      </ScrollView>
      <View style={styles.dots} accessible accessibilityLabel={`${index + 1} / ${promos.length}`}>
        {promos.map((p, i) => (
          <View key={p.id} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: m.height,
    borderRadius: m.radius,
    padding: m.padding,
    overflow: "hidden",
    alignItems: "flex-start",
    gap: m.gap,
  },
  title: { maxWidth: m.titleMaxWidth },
  subtitle: { opacity: 0.9 },
  carousel: { gap: m.carouselGap },
  track: { paddingHorizontal: spacing.pagePadding, gap: m.carouselGap },
  dots: { flexDirection: "row", justifyContent: "center", gap: m.dot },
  dot: { width: m.dot, height: m.dot, borderRadius: m.dot / 2, backgroundColor: colors.borderStrong },
  dotActive: { width: m.dotActiveWidth, backgroundColor: colors.primary },
});
