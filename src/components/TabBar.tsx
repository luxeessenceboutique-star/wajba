import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { t } from "@/i18n";
import { colors, metrics } from "@/theme";
import { Icon, type IconName } from "./Icon";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

const m = metrics.tabBar;

export type TabKey = "home" | "plan" | "orders" | "account";

export interface TabItem {
  key: TabKey;
  label: string;
  icon: IconName;
}

/** The 4 main tabs (DESIGN_SPEC §3 · TabBar). */
export const mainTabs: TabItem[] = [
  { key: "home", label: t("tabs.home"), icon: "home" },
  { key: "plan", label: t("tabs.plan"), icon: "calendar" },
  { key: "orders", label: t("tabs.orders"), icon: "receipt" },
  { key: "account", label: t("tabs.account"), icon: "user" },
];

export interface TabBarProps {
  activeKey: TabKey;
  onSelect: (key: TabKey) => void;
  tabs?: TabItem[];
}

/** Bottom tab bar, fixed to the bottom, above the home indicator. Active = Majorelle + filled icon. */
export function TabBar({ activeKey, onSelect, tabs = mainTabs }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      accessibilityRole="tablist"
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, m.minBottomPadding), minHeight: m.contentHeight + Math.max(insets.bottom, m.minBottomPadding) }]}
    >
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        const color = active ? colors.primary : colors.muted;
        return (
          <Touchable
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            aria-selected={active}
            style={styles.tab}
          >
            <Icon name={tab.icon} size={metrics.icon.tab} color={color} filled={active} />
            <Text variant={active ? "tabLabelActive" : "tabLabel"} color={color} numberOfLines={1}>
              {tab.label}
            </Text>
          </Touchable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderTopWidth: metrics.hairline,
    borderTopColor: colors.border,
    paddingHorizontal: m.paddingX,
    paddingTop: m.paddingTop,
  },
  tab: { flex: 1, alignItems: "center", justifyContent: "center", gap: m.iconLabelGap, minHeight: metrics.iconButton.size },
});
