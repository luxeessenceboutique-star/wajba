import { StyleSheet, View } from "react-native";

import { t } from "@/i18n";
import { useUserStore } from "@/store/user";
import { colors, metrics } from "@/theme";
import { Icon } from "./Icon";
import { OptionRow } from "./OptionGroup";
import { Sheet } from "./Sheet";

/** "Livrer à" sheet: pick one of the saved addresses (Home and checkout). */
export function AddressSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const addresses = useUserStore((s) => s.addresses);
  const addressId = useUserStore((s) => s.addressId);
  const setAddress = useUserStore((s) => s.setAddress);
  return (
    <Sheet visible={visible} onClose={onClose} title={t("home.addressesTitle")}>
      <View accessibilityRole="radiogroup">
        {addresses.map((a, i) => (
          <OptionRow
            key={a.id}
            label={a.label}
            sublabel={`${a.line}, ${a.city}`}
            leading={
              <View style={styles.icon}>
                <Icon name="mapPin" color={colors.ink} />
              </View>
            }
            control="radio"
            selected={a.id === addressId}
            divider={i < addresses.length - 1}
            onPress={() => {
              setAddress(a.id);
              onClose();
            }}
          />
        ))}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: metrics.listRow.iconCircle,
    height: metrics.listRow.iconCircle,
    borderRadius: metrics.listRow.iconCircle / 2,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});
