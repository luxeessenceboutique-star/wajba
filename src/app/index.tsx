/** 01 · Splash / Login — DESIGN_SPEC §5. */
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import LogoMarkOnBlue from "@assets/brand/logo-mark-on-blue.svg";
import { api } from "@/api";
import { FoodImage, Logo, PrimaryButton, Text } from "@/components";
import { t } from "@/i18n";
import { useUserStore } from "@/store/user";
import { colors, fontFamily, metrics } from "@/theme";

const m = metrics.splash;
/** Logo mark proportions (viewBox 120 × 150). */
const MARK_RATIO = 150 / 120;
/** Dishes bleeding off the edges, positions from screens/source/Splash.dc.html. */
const DECOR = [
  { image: "couscous", size: 170, style: { end: -56, top: 58 } },
  { image: "bowl", size: 190, style: { start: -62, top: 292 } },
  { image: "msemen", size: 120, style: { end: -30, top: 330 } },
] as const;

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const signIn = useUserStore((s) => s.signIn);
  const [pending, setPending] = useState<"google" | "apple" | null>(null);

  async function withProvider(provider: "google" | "apple") {
    setPending(provider);
    try {
      const { ok } = await api.auth.signInWithProvider(provider);
      if (ok) {
        signIn();
        router.push("/profile");
      }
    } finally {
      setPending(null);
    }
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      {DECOR.map((d) => (
        <FoodImage key={d.image} source={d.image} tint="transparent" height={d.size} width={d.size} style={[styles.decor, d.style]} />
      ))}

      <View style={styles.brand}>
        <LogoMarkOnBlue width={m.markWidth} height={m.markWidth * MARK_RATIO} accessibilityLabel="Wajba" />
        <Logo size={m.wordmarkSize} onBlue showArabic showMark={false} arabicScale={m.arabicSize / m.wordmarkSize} />
        <Text variant="tagline" color="white" align="center" style={styles.tagline}>
          {t("brand.tagline")}
        </Text>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + m.sheetPaddingTop }]}>
        <Text variant="displayLogin" accessibilityRole="header" style={styles.title}>
          {t("login.title")}
        </Text>
        <View style={styles.buttons}>
          <PrimaryButton label={t("login.phone")} icon="smartphone" onPress={() => router.push("/phone")} disabled={pending !== null} />
          <PrimaryButton label={t("login.google")} icon="google" variant="outline" onPress={() => withProvider("google")} disabled={pending !== null} />
          <PrimaryButton label={t("login.apple")} icon="apple" variant="dark" onPress={() => withProvider("apple")} disabled={pending !== null} />
        </View>
        {/* Legal links: the Conditions / Privacy pages don't exist yet. */}
        <Text variant="legal" color="muted" align="center">
          {t("login.legalStart")}
          <Text variant="legal" style={styles.legalLink}>
            {t("login.terms")}
          </Text>
          {t("login.legalMiddle")}
          <Text variant="legal" style={styles.legalLink}>
            {t("login.privacy")}
          </Text>
          {t("login.legalEnd")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primary, overflow: "hidden" },
  decor: { position: "absolute" },
  brand: { position: "absolute", start: 0, end: 0, top: 130, alignItems: "center", gap: metrics.gap.xxl + 2 },
  tagline: { opacity: 0.92, paddingHorizontal: metrics.gap.xxl },
  sheet: {
    position: "absolute",
    start: 0,
    end: 0,
    bottom: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: metrics.sheet.radius,
    borderTopRightRadius: metrics.sheet.radius,
    paddingTop: m.sheetPaddingTop,
    paddingHorizontal: m.sheetPaddingX,
    gap: m.sheetGap,
  },
  title: { maxWidth: 300 },
  buttons: { gap: m.buttonGap },
  legalLink: { color: colors.ink, fontFamily: fontFamily[700], textDecorationLine: "underline" },
});
