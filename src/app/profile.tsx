/** 02 · Pour qui on cuisine ? — multi-select profile picker. Also opened from the account ("Modifier mes profils"). */
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomBar, IconButton, PrimaryButton, ProfileCard, ProgressSegments, Text, Touchable } from "@/components";
import { profiles } from "@/data/home";
import { t } from "@/i18n";
import { useUserStore } from "@/store/user";
import { colors, metrics, spacing } from "@/theme";
import type { ProfileId } from "@/types/models";

/** Leave onboarding: clear Splash / phone from history, then open Home. */
function goHome() {
  if (router.canDismiss()) router.dismissAll();
  router.replace("/home");
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const editing = from === "account";
  const saved = useUserStore((s) => s.profiles);
  const setProfiles = useUserStore((s) => s.setProfiles);
  const [picked, setPicked] = useState<ProfileId[]>(saved);

  function toggle(id: ProfileId) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  function confirm() {
    setProfiles(picked);
    if (editing) router.back();
    else goHome();
  }

  const cta = editing ? t("profile.save") : picked.length ? t("profile.continueCount", { count: picked.length }) : t("common.continue");

  return (
    <View style={styles.screen}>
      <View style={[styles.top, { paddingTop: insets.top + metrics.screenHeader.paddingTop }]}>
        <IconButton icon="chevronLeft" accessibilityLabel={t("common.back")} onPress={() => router.back()} />
        {!editing && (
          <>
            <ProgressSegments segments={1} current={0} currentProgress={2 / 3} style={styles.progress} />
            <Touchable onPress={goHome} accessibilityRole="button" style={styles.skip}>
              <Text variant="buttonSmall" color="primary">
                {t("common.skip")}
              </Text>
            </Touchable>
          </>
        )}
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: metrics.button.height + insets.bottom + spacing.sectionGap * 2 }]}>
        <View style={styles.intro}>
          <Text variant="onboardingTitle" accessibilityRole="header">
            {t("profile.title")}
          </Text>
          <Text variant="body" color="muted">
            {t("profile.subtitle")}
          </Text>
        </View>
        <View style={styles.grid}>
          {profiles.map((p) => (
            <ProfileCard key={p.id} profile={p} selected={picked.includes(p.id)} onPress={() => toggle(p.id)} style={styles.cell} />
          ))}
        </View>
      </ScrollView>

      <BottomBar>
        <PrimaryButton label={cta} onPress={confirm} />
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  top: { flexDirection: "row", alignItems: "center", gap: metrics.gap.xxl, paddingHorizontal: spacing.pagePadding },
  progress: { flex: 1 },
  skip: { minHeight: metrics.iconButton.size, justifyContent: "center" },
  content: { paddingHorizontal: spacing.pagePadding, paddingTop: metrics.gap.xxl + metrics.gap.s, gap: metrics.gap.xxl + metrics.gap.s },
  intro: { gap: metrics.gap.m },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: metrics.gap.l },
  cell: { width: "48.5%", flexGrow: 1, flexBasis: "45%" },
});
