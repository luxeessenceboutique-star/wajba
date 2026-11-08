/**
 * Option groups of the dish sheet (DESIGN_SPEC §3 and §7):
 * - single choice (max 1) → radios; multi choice → checkboxes
 * - when `max` is reached, the other rows are inert
 * - required groups show "Obligatoire", optional ones "Optionnel"
 */
import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { t } from "@/i18n";
import { formatPriceDelta } from "@/lib/format";
import { colors, metrics, spacing } from "@/theme";
import type { OptionGroup as OptionGroupModel } from "@/types/models";
import { Badge } from "./Badge";
import { Icon } from "./Icon";
import { Text } from "./Text";
import { Touchable } from "./Touchable";

const m = metrics.optionGroup;

// ── Controls ─────────────────────────────────────────────────────────

export function Radio({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.control, styles.radio, selected ? styles.controlOn : styles.controlOff]}>
      {selected && <View style={styles.radioDot} />}
    </View>
  );
}

export function Checkbox({ selected }: { selected: boolean }) {
  return (
    <View style={[styles.control, styles.checkbox, selected ? styles.controlOn : styles.controlOff]}>
      {selected && <Icon name="check" size={metrics.icon.small} color={colors.onPrimary} strokeWidth={3} />}
    </View>
  );
}

// ── Header ───────────────────────────────────────────────────────────

export interface GroupHeaderProps {
  title: string;
  subtitle?: string;
  /** Right-side badge: "Obligatoire" (dark) / "Optionnel" or "Jusqu'à 4" (neutral). */
  badge?: { label: string; tone: "dark" | "neutral" };
}

export function GroupHeader({ title, subtitle, badge }: GroupHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <Text variant="groupTitle" accessibilityRole="header">
          {title}
        </Text>
        {subtitle && (
          <Text variant="cardMeta" color="muted">
            {subtitle}
          </Text>
        )}
      </View>
      {badge && <Badge label={badge.label} tone={badge.tone} />}
    </View>
  );
}

// ── Row ──────────────────────────────────────────────────────────────

export interface OptionRowProps {
  label: string;
  /** Second line, e.g. "220 kcal" in Compose. */
  sublabel?: string;
  /** Leading element, e.g. the ingredient color dot. */
  leading?: ReactNode;
  /** End text: "+38 DH", "inclus". */
  trailingText?: string;
  control: "radio" | "checkbox";
  selected: boolean;
  /** Inert (max reached). */
  disabled?: boolean;
  onPress: () => void;
  divider?: boolean;
  /** Bolder label (15/600), used for Compose ingredient rows. */
  emphasis?: boolean;
}

export function OptionRow({ label, sublabel, leading, trailingText, control, selected, disabled = false, onPress, divider = true, emphasis = false }: OptionRowProps) {
  return (
    <Touchable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={control}
      accessibilityLabel={[label, sublabel, trailingText].filter(Boolean).join(", ")}
      aria-checked={selected}
      aria-disabled={disabled}
      style={[styles.row, divider && styles.divider]}
    >
      {leading}
      <View style={styles.rowText}>
        <Text variant={emphasis ? "rowLabel" : "optionLabel"} color={disabled ? "mutedLight" : "ink"}>
          {label}
        </Text>
        {sublabel && (
          <Text variant="caption" color="muted">
            {sublabel}
          </Text>
        )}
      </View>
      {trailingText && (
        <Text variant="meta" color={disabled ? "mutedLight" : "muted"}>
          {trailingText}
        </Text>
      )}
      <View style={disabled && styles.inert}>{control === "radio" ? <Radio selected={selected} /> : <Checkbox selected={selected} />}</View>
    </Touchable>
  );
}

// ── Selection logic (shared with Compose) ───────────────────────────

/**
 * Next selection after tapping `id`:
 * - single choice: select it (tapping again keeps it if required, clears it if optional)
 * - multi choice: toggle, but ignore taps beyond `max`
 */
export function toggleSelection(selected: string[], id: string, max: number, required: boolean): string[] {
  const isOn = selected.includes(id);
  if (max === 1) {
    if (isOn) return required ? selected : [];
    return [id];
  }
  if (isOn) return selected.filter((s) => s !== id);
  if (selected.length >= max) return selected;
  return [...selected, id];
}

export function groupSubtitle(group: Pick<OptionGroupModel, "subtitle" | "max">): string {
  if (group.subtitle) return group.subtitle;
  return group.max === 1 ? t("options.chooseOne") : t("options.upTo", { max: group.max });
}

// ── Group ────────────────────────────────────────────────────────────

export interface OptionGroupProps {
  group: OptionGroupModel;
  selected: string[];
  onChange: (selected: string[]) => void;
  style?: StyleProp<ViewStyle>;
}

export function OptionGroup({ group, selected, onChange, style }: OptionGroupProps) {
  const single = group.max === 1;
  const full = !single && selected.length >= group.max;

  return (
    <View style={style} accessibilityRole={single ? "radiogroup" : undefined}>
      <GroupHeader
        title={group.title}
        subtitle={groupSubtitle(group)}
        badge={group.required ? { label: t("options.required"), tone: "dark" } : { label: t("options.optional"), tone: "neutral" }}
      />
      {group.options.map((option) => {
        const isOn = selected.includes(option.id);
        const trailing = option.included ? t("common.included") : option.priceDelta !== 0 ? formatPriceDelta(option.priceDelta) : undefined;
        return (
          <OptionRow
            key={option.id}
            label={option.label}
            trailingText={trailing}
            control={single ? "radio" : "checkbox"}
            selected={isOn}
            disabled={full && !isOn}
            onPress={() => onChange(toggleSelection(selected, option.id, group.max, group.required))}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: metrics.gap.xl, paddingTop: spacing.sectionGap, paddingBottom: metrics.gap.xs },
  headerText: { flex: 1, gap: m.headerGap },
  row: { minHeight: m.rowMinHeight, flexDirection: "row", alignItems: "center", gap: metrics.gap.xl, paddingVertical: metrics.gap.m },
  divider: { borderBottomWidth: metrics.hairline, borderBottomColor: colors.border },
  rowText: { flex: 1, gap: metrics.gap.hair },
  inert: { opacity: metrics.opacity.inert },
  control: { width: m.control, height: m.control, alignItems: "center", justifyContent: "center" },
  controlOff: { borderWidth: m.borderWidth, borderColor: colors.controlBorder, backgroundColor: colors.background },
  controlOn: { backgroundColor: colors.primary },
  radio: { borderRadius: m.control / 2 },
  radioDot: { width: m.radioDot, height: m.radioDot, borderRadius: m.radioDot / 2, backgroundColor: colors.onPrimary },
  checkbox: { borderRadius: m.checkboxRadius },
});
