import { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View, type LayoutChangeEvent, type ScrollViewInstance, type StyleProp, type ViewStyle } from "react-native";

import { t } from "@/i18n";
import { colors, metrics, spacing } from "@/theme";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

const m = metrics.sectionTabs;

export interface SectionTabsProps {
  sections: string[];
  active: string;
  onSelect: (section: string) => void;
  style?: StyleProp<ViewStyle>;
}

/** Horizontal menu-section tabs. Active: Majorelle text + 3 pt underline. Keeps the active tab in view. */
export function SectionTabs({ sections, active, onSelect, style }: SectionTabsProps) {
  const scroller = useRef<ScrollViewInstance>(null);
  const positions = useRef(new Map<string, number>());

  useEffect(() => {
    const x = positions.current.get(active);
    if (x !== undefined) scroller.current?.scrollTo({ x: Math.max(0, x - spacing.pagePadding), animated: true });
  }, [active]);

  return (
    <View style={[styles.bar, style]}>
      <ScrollView
        ref={scroller}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        accessibilityRole="tablist"
        accessibilityLabel={t("kitchen.sections")}
      >
        {sections.map((section) => {
          const on = section === active;
          return (
            <Touchable
              key={section}
              onPress={() => onSelect(section)}
              onLayout={(e: LayoutChangeEvent) => positions.current.set(section, e.nativeEvent.layout.x)}
              accessibilityRole="tab"
              accessibilityLabel={section}
              aria-selected={on}
              style={styles.tab}
            >
              <Text variant={on ? "tabActive" : "tab"} color={on ? "primary" : "muted"}>
                {section}
              </Text>
              {on && <View style={styles.underline} />}
            </Touchable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { borderBottomWidth: metrics.hairline, borderBottomColor: colors.border, backgroundColor: colors.background },
  row: { paddingHorizontal: spacing.pagePadding, gap: m.gap },
  tab: { minHeight: m.height, justifyContent: "center" },
  underline: { position: "absolute", start: 0, end: 0, bottom: 0, height: m.underline, backgroundColor: colors.primary },
});
