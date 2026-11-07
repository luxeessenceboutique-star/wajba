import { StyleSheet, View } from "react-native";

import { t } from "@/i18n";
import { formatPrice } from "@/lib/format";
import { metrics } from "@/theme";
import { Text } from "./Text";

export interface PriceProps {
  price: number;
  oldPrice?: number;
}

/** "55 DH 65 DH" with the old price struck through. */
export function Price({ price, oldPrice }: PriceProps) {
  return (
    <View style={styles.row}>
      <Text variant="price">{formatPrice(price)}</Text>
      {oldPrice !== undefined && oldPrice > price && (
        <Text variant="meta" color="mutedLight" strike accessibilityLabel={t("common.oldPrice", { price: formatPrice(oldPrice) })}>
          {formatPrice(oldPrice)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: metrics.gap.m },
});
