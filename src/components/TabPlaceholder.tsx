import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, metrics, spacing } from "@/theme";
import { EmptyState } from "./EmptyState";
import type { IconName } from "./Icon";
import { Text } from "./Text";

/** Tab screen not built yet: large title, coming-soon state, optional extra rows. */
export function TabPlaceholder({ title, text, icon, children }: { title: string; text: string; icon: IconName; children?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + metrics.gap.xl }]}>
        <Text variant="screenTitleLarge" accessibilityRole="header">
          {title}
        </Text>
        <EmptyState icon={icon} title={title} text={text} style={styles.empty} />
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.pagePadding, paddingBottom: spacing.sectionGap, gap: metrics.gap.xl },
  empty: { flexGrow: 0 },
});
