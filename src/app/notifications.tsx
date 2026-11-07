/** Notifications (not designed in v3) — empty state for now. */
import { StyleSheet, View } from "react-native";

import { EmptyState, ScreenHeader } from "@/components";
import { t } from "@/i18n";
import { colors } from "@/theme";

export default function NotificationsScreen() {
  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("notifications.title")} />
      <EmptyState icon="bell" title={t("notifications.emptyTitle")} text={t("notifications.emptyText")} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
});
