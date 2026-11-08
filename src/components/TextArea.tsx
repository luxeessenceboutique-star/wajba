import { Platform, StyleSheet, TextInput, View, type TextInputProps, type TextStyle } from "react-native";

import { colors, metrics, typography } from "@/theme";
import { Text } from "./Text";

export interface TextAreaProps extends Pick<TextInputProps, "value" | "onChangeText" | "placeholder" | "maxLength"> {
  label: string;
}

/** Labelled multi-line field, e.g. "Instructions pour la cuisine". */
export function TextArea({ label, value, onChangeText, placeholder, maxLength = 200 }: TextAreaProps) {
  return (
    <View style={styles.wrap}>
      <Text variant="groupTitle">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        maxLength={maxLength}
        multiline
        textAlignVertical="top"
        accessibilityLabel={label}
        maxFontSizeMultiplier={1.4}
        style={[styles.input, webNoFocusRing]}
      />
    </View>
  );
}

// The field's own border shows focus; drop the browser's extra ring on web.
const webNoFocusRing = Platform.OS === "web" ? ({ outlineStyle: "none" } as unknown as TextStyle) : null;

const styles = StyleSheet.create({
  wrap: { gap: metrics.gap.m },
  input: {
    ...typography.textArea,
    color: colors.ink,
    minHeight: metrics.textArea.minHeight,
    borderRadius: metrics.textArea.radius,
    borderWidth: metrics.button.borderWidth,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: metrics.textArea.paddingX,
    paddingTop: metrics.textArea.paddingY,
    paddingBottom: metrics.textArea.paddingY,
  },
});
