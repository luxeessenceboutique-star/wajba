/** 06 · Compose ta wajba — placeholder until phase 3. */
import { StyleSheet, View } from "react-native";

import { EmptyState, ScreenHeader } from "@/components";
import { t } from "@/i18n";
import { colors } from "@/theme";

export default function ComposeScreen() {
  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("home.composeTitle")} />
      <EmptyState icon="leaf" title={t("common.comingSoon")} text={t("placeholder.composeText")} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
});
