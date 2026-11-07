/** Phone number + SMS code (not designed in v3 — built in the same style; mock API accepts any 4 digits). */
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View, type TextInputInstance } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api } from "@/api";
import { IconButton, PrimaryButton, ProgressSegments, Text, Touchable } from "@/components";
import { t } from "@/i18n";
import { useUserStore } from "@/store/user";
import { colors, metrics, radius, spacing, typography } from "@/theme";

const CODE_LENGTH = 4;
/** Moroccan mobile number: 9 digits after +212, starting with 5, 6 or 7. */
const PHONE_PATTERN = /^[5-7]\d{8}$/;

function formatLocal(digits: string): string {
  // "612345678" → "6 12 34 56 78"
  return [digits.slice(0, 1), digits.slice(1, 3), digits.slice(3, 5), digits.slice(5, 7), digits.slice(7, 9)].filter(Boolean).join(" ");
}

export default function PhoneScreen() {
  const insets = useSafeAreaInsets();
  const signIn = useUserStore((s) => s.signIn);
  const [step, setStep] = useState<"number" | "code">("number");
  const [digits, setDigits] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const codeInput = useRef<TextInputInstance>(null);

  const valid = PHONE_PATTERN.test(digits);
  const fullNumber = `${t("phone.countryCode")} ${formatLocal(digits)}`;

  async function sendCode() {
    if (!valid) {
      setError(t("phone.invalidNumber"));
      return;
    }
    setBusy(true);
    setError(null);
    const { ok } = await api.auth.sendCode(digits);
    setBusy(false);
    if (ok) {
      setStep("code");
      setCode("");
    } else setError(t("phone.invalidNumber"));
  }

  async function verify(value: string) {
    setBusy(true);
    setError(null);
    const { ok } = await api.auth.verifyCode(digits, value);
    setBusy(false);
    if (ok) {
      signIn(fullNumber);
      router.push("/profile");
    } else {
      setError(t("phone.invalidCode"));
      setCode("");
    }
  }

  function onCodeChange(text: string) {
    const clean = text.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(clean);
    if (clean.length === CODE_LENGTH) verify(clean);
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={[styles.top, { paddingTop: insets.top + metrics.screenHeader.paddingTop }]}>
        <IconButton icon="chevronLeft" accessibilityLabel={t("common.back")} onPress={() => (step === "code" ? setStep("number") : router.back())} />
        <ProgressSegments segments={1} current={0} currentProgress={1 / 3} style={styles.progress} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text variant="onboardingTitle" accessibilityRole="header">
          {step === "number" ? t("phone.title") : t("phone.codeTitle")}
        </Text>
        <Text variant="body" color="muted">
          {step === "number" ? t("phone.subtitle") : t("phone.codeSubtitle", { phone: fullNumber })}
        </Text>

        {step === "number" ? (
          <View style={styles.phoneRow}>
            <View style={styles.country}>
              <Text variant="bigInput">{t("phone.countryCode")}</Text>
            </View>
            <TextInput
              value={formatLocal(digits)}
              onChangeText={(text) => {
                setDigits(text.replace(/\D/g, "").replace(/^0/, "").slice(0, 9));
                setError(null);
              }}
              onSubmitEditing={sendCode}
              placeholder={t("phone.placeholder")}
              placeholderTextColor={colors.mutedLight}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              autoFocus
              accessibilityLabel={t("phone.label")}
              maxFontSizeMultiplier={1.4}
              style={[styles.input, styles.phoneInput]}
            />
          </View>
        ) : (
          <View>
            <Touchable onPress={() => codeInput.current?.focus()} accessible={false} style={styles.codeRow}>
              {Array.from({ length: CODE_LENGTH }, (_, i) => (
                <View key={i} style={[styles.codeBox, i === code.length && styles.codeBoxActive]}>
                  <Text variant="bigInput">{code[i] ?? ""}</Text>
                </View>
              ))}
            </Touchable>
            {/* Real input over the boxes, invisible: keeps SMS autofill and screen readers working. */}
            <TextInput
              ref={codeInput}
              value={code}
              onChangeText={onCodeChange}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              maxLength={CODE_LENGTH}
              autoFocus
              editable={!busy}
              accessibilityLabel={t("phone.codeLabel")}
              style={styles.hiddenInput}
            />
            <Text variant="caption" color="muted" style={styles.hint}>
              {t("phone.codeDemo")}
            </Text>
            <Touchable onPress={() => setStep("number")} accessibilityRole="button" style={styles.link}>
              <Text variant="link" color="primary">
                {t("phone.changeNumber")}
              </Text>
            </Touchable>
          </View>
        )}

        {error && (
          <Text variant="caption" color="terracotta" accessibilityLiveRegion="polite">
            {error}
          </Text>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + metrics.gap.xl }]}>
        {step === "number" ? (
          <PrimaryButton label={t("phone.sendCode")} onPress={sendCode} disabled={!valid || busy} />
        ) : (
          <PrimaryButton label={t("phone.verify")} onPress={() => verify(code)} disabled={code.length < CODE_LENGTH || busy} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const CODE_BOX = 64;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  top: { flexDirection: "row", alignItems: "center", gap: metrics.gap.xxl, paddingHorizontal: spacing.pagePadding },
  progress: { flex: 1 },
  content: { padding: spacing.pagePadding, paddingTop: spacing.sectionGap, gap: metrics.gap.xl },
  phoneRow: { flexDirection: "row", gap: metrics.gap.m, marginTop: metrics.gap.xl },
  country: { minHeight: CODE_BOX, borderRadius: radius.input, backgroundColor: colors.surface, paddingHorizontal: metrics.gap.xxl, justifyContent: "center" },
  input: { ...typography.bigInput, color: colors.ink },
  phoneInput: { flex: 1, minWidth: 0, minHeight: CODE_BOX, borderRadius: radius.input, borderWidth: metrics.button.borderWidth, borderColor: colors.borderStrong, paddingHorizontal: metrics.gap.xxl },
  codeRow: { flexDirection: "row", gap: metrics.gap.xl, marginTop: metrics.gap.xl },
  codeBox: { width: CODE_BOX, height: CODE_BOX, borderRadius: radius.input, borderWidth: metrics.button.borderWidth, borderColor: colors.borderStrong, alignItems: "center", justifyContent: "center" },
  codeBoxActive: { borderColor: colors.primary, borderWidth: metrics.optionGroup.borderWidth },
  hiddenInput: { position: "absolute", top: metrics.gap.xl, start: 0, width: CODE_BOX * CODE_LENGTH + metrics.gap.xl * (CODE_LENGTH - 1), height: CODE_BOX, opacity: 0.01 },
  hint: { marginTop: metrics.gap.xl },
  link: { alignSelf: "flex-start", minHeight: metrics.iconButton.size, justifyContent: "center" },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: metrics.gap.xl },
});
