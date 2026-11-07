/**
 * Every food image slot. Takes either an illustration key ("tajine") or a
 * photo URL. Photos fill and crop the slot; illustrations are drawn oversized
 * and cropped by the container so they read like a photo, on a soft tint.
 * The tint also serves as the loading placeholder for photos.
 */
import type { ReactNode } from "react";
import { StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from "react-native";
import { Image } from "expo-image";

import { illustrations, isIllustrationKey, isPhotoUrl } from "@/assets/illustrations";
import { colors } from "@/theme";

export interface FoodImageProps {
  /** Illustration key or photo URL. Leave empty to show only the tint. */
  source?: string;
  tint?: string;
  height: number;
  width?: DimensionValue;
  radius?: number;
  /** Illustration size as a multiple of the slot height. */
  scale?: number;
  /** Where the illustration sits: centered, or anchored to a corner and bleeding off it. */
  placement?: "center" | "bottomEnd" | "topEnd";
  /** Extra shift in points (for corner placements: distance from the edge, negative = bleed). */
  offset?: { x?: number; y?: number };
  /** Describe the photo for screen readers; omit for decorative images. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  /** Overlays: badges, favorite button, "+" button. */
  children?: ReactNode;
}

export function FoodImage({
  source,
  tint = colors.surface,
  height,
  width = "100%",
  radius = 0,
  scale = 1,
  placement = "center",
  offset,
  accessibilityLabel,
  style,
  children,
}: FoodImageProps) {
  const containerStyle = [styles.container, { height, width, borderRadius: radius, backgroundColor: tint }, style];
  const a11y = accessibilityLabel
    ? { accessible: true, accessibilityRole: "image" as const, accessibilityLabel }
    : { accessible: false, importantForAccessibility: "no-hide-descendants" as const };

  let art: ReactNode = null;
  let topAligned = false;
  if (source && isPhotoUrl(source)) {
    art = <Image source={{ uri: source }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />;
  } else if (source && isIllustrationKey(source)) {
    const { Component, scale: artScale, offsetY, align } = illustrations[source];
    const size = Math.round(height * scale * artScale);
    if (placement === "center") {
      topAligned = align === "top";
      const translateY = height * offsetY + (offset?.y ?? 0);
      art = <Component width={size} height={size} style={[styles.noShrink, { transform: [{ translateX: offset?.x ?? 0 }, { translateY }] }]} />;
    } else {
      const edge = placement === "bottomEnd" ? { bottom: offset?.y ?? 0 } : { top: offset?.y ?? 0 };
      art = <Component width={size} height={size} style={[styles.corner, { end: offset?.x ?? 0 }, edge]} />;
    }
  }

  // Accessibility flags go on the artwork layer only, so overlay buttons
  // (heart, "+") stay reachable by screen readers.
  return (
    <View style={containerStyle}>
      <View style={[styles.art, topAligned && styles.artTop]} pointerEvents="none" {...a11y}>
        {art}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: "hidden", alignItems: "center", justifyContent: "center" },
  art: { position: "absolute", top: 0, bottom: 0, start: 0, end: 0, alignItems: "center", justifyContent: "center" },
  artTop: { justifyContent: "flex-start" },
  corner: { position: "absolute" },
  // Oversized art must overflow (and be cropped), never shrink to fit — web flexbox shrinks by default.
  noShrink: { flexShrink: 0 },
});
