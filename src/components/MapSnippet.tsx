import { View } from "react-native";
import Svg, { Circle, G, Rect } from "react-native-svg";

import { t } from "@/i18n";
import { colors, metrics } from "@/theme";

/** Small mock map with the delivery pin (checkout). A real map provider comes later. */
export function MapSnippet() {
  const h = metrics.mapSnippet.height;
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={t("checkout.mapLabel")} style={{ height: h }}>
      <Svg width="100%" height={h} viewBox="0 0 358 92" preserveAspectRatio="xMidYMid slice">
        <Rect width="358" height="92" fill={colors.mapBackground} />
        <G fill={colors.mapBlock}>
          <Rect x="0" y="0" width="110" height="34" rx="8" />
          <Rect x="126" y="0" width="106" height="34" rx="8" />
          <Rect x="248" y="0" width="110" height="34" rx="8" />
          <Rect x="0" y="50" width="110" height="42" rx="8" />
          <Rect x="248" y="50" width="110" height="42" rx="8" />
        </G>
        <Rect x="126" y="50" width="106" height="42" rx="8" fill={colors.mapPark} />
        <G transform="translate(179 42)">
          <Circle r="16" fill={colors.primary} fillOpacity={0.18} />
          <Circle r="9" fill={colors.white} />
          <Circle r="6" fill={colors.primary} />
        </G>
      </Svg>
    </View>
  );
}
