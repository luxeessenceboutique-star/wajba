import { StyleSheet, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from "react-native";

import { t } from "@/i18n";
import { colors, metrics, typography } from "@/theme";
import { Icon } from "./Icon";
import { Touchable } from "./Touchable";

export interface SearchFieldProps extends Pick<TextInputProps, "value" | "onChangeText" | "onSubmitEditing" | "autoFocus"> {
  placeholder?: string;
  /** When set, the field acts as a button (e.g. opens the search screen). */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SearchField({ placeholder = t("search.placeholder"), onPress, style, ...input }: SearchFieldProps) {
  const field = (
    <View style={[styles.field, style]}>
      <Icon name="search" color={colors.ink} />
      <TextInput
        {...input}
        editable={!onPress}
        pointerEvents={onPress ? "none" : "auto"}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        accessibilityLabel={t("search.label")}
        returnKeyType="search"
        maxFontSizeMultiplier={1.4}
        style={styles.input}
      />
    </View>
  );

  if (!onPress) return field;
  return (
    <Touchable onPress={onPress} accessibilityRole="search" accessibilityLabel={t("search.label")}>
      {field}
    </Touchable>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: metrics.search.height,
    borderRadius: metrics.search.radius,
    backgroundColor: colors.surface,
    paddingHorizontal: metrics.search.paddingX,
    flexDirection: "row",
    alignItems: "center",
    gap: metrics.search.gap,
  },
  input: { ...typography.input, flex: 1, minWidth: 0, color: colors.ink, paddingVertical: 0 },
});
