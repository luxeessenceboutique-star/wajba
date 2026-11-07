import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { t } from "@/i18n";
import { colors, metrics } from "@/theme";
import { Icon, type IconName } from "./Icon";
import { PrimaryButton } from "./PrimaryButton";
import { Text } from "./Text";

const m = metrics.emptyState;

export interface EmptyStateProps {
  icon: IconName;
  title: string;
  text?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Empty, not-found and coming-soon states, in the app's style. */
export function EmptyState({ icon, title, text, actionLabel, onAction, style }: EmptyStateProps) {
  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.icon}>
        <Icon name={icon} size={metrics.icon.large} color={colors.primary} />
      </View>
      <Text variant="groupTitle" align="center">
        {title}
      </Text>
      {text && (
        <Text variant="bodySmall" color="muted" align="center">
          {text}
        </Text>
      )}
      {actionLabel && onAction && <PrimaryButton label={actionLabel} onPress={onAction} variant="outline" size="medium" style={styles.action} />}
    </View>
  );
}

/** Error state with a retry button. */
export function ErrorState({ onRetry, style }: { onRetry: () => void; style?: StyleProp<ViewStyle> }) {
  return <EmptyState icon="help" title={t("common.errorTitle")} text={t("common.errorText")} actionLabel={t("common.retry")} onAction={onRetry} style={style} />;
}

export function LoadingState({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.wrap, style]} accessible accessibilityLabel={t("common.loading")} accessibilityRole="progressbar">
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1, alignItems: "center", justifyContent: "center", gap: m.gap, paddingVertical: m.paddingY, paddingHorizontal: metrics.gap.xxl * 2 },
  icon: { width: m.icon, height: m.icon, borderRadius: m.icon / 2, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", marginBottom: metrics.gap.xs },
  action: { alignSelf: "center", width: "auto", marginTop: metrics.gap.m },
});
