/**
 * Phase 1 component gallery: every component from DESIGN_SPEC §3, wired to
 * the mock data so states are real (selection rules, steppers, switches).
 * Open it in Expo Go to check the library before the screens are built.
 */
import { useState, type ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Badge,
  CartBar,
  CategoryGrid,
  DishCard,
  FilterChipRow,
  GroupHeader,
  IconButton,
  KitchenCard,
  ListRow,
  Logo,
  MenuGridCard,
  MenuRow,
  OptionGroup,
  OptionRow,
  PrimaryButton,
  ProgressSegments,
  PromoCarousel,
  SearchField,
  SelectChip,
  Stepper,
  SummaryBox,
  Switch,
  TabBar,
  Text,
  toggleSelection,
  type TabKey,
} from "@/components";
import { composeDefaultSelection, composeRules, ingredientsForStep } from "@/data/compose";
import { categories, homeFilters, plans, promos } from "@/data/home";
import { getKitchen, kitchens } from "@/data/kitchens";
import { getMenuItem, menuItems } from "@/data/menu";
import { DISH_QTY_MAX, DISH_QTY_MIN } from "@/data/rules";
import { t } from "@/i18n";
import { formatKcal, formatPrice, formatPriceDelta } from "@/lib/format";
import { computeComposeTotals, computeDishTotals, computeOrderTotals, defaultDishSelections } from "@/lib/pricing";
import { colors, metrics, spacing, typography, type ColorName, type TypographyVariant } from "@/theme";
import type { HomeFilter } from "@/types/models";

const SWATCHES: ColorName[] = ["primary", "saffron", "terracotta", "mint", "ink", "surface", "primarySoft", "terracottaTint", "mintTint", "saffronTint"];
const TYPE_SAMPLES: TypographyVariant[] = ["screenTitleLarge", "productTitle", "sectionTitle", "groupTitle", "cardTitle", "body", "bodySmall", "caption", "eyebrow"];

function Section({ title, children, bleed = false }: { title: string; children: ReactNode; bleed?: boolean }) {
  return (
    <View style={styles.section}>
      <Text variant="eyebrow" color="muted" style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      <View style={bleed ? undefined : styles.padded}>{children}</View>
    </View>
  );
}

export default function DevScreen() {
  const insets = useSafeAreaInsets();

  // Demo data, all from src/data.
  const tajine = getMenuItem("tajine-kefta")!;
  const popularDishes = [tajine, getMenuItem("bowl-chermoula")!];
  const gridItems = ["tajine-kefta", "couscous-7", "pastilla-poulet", "harira-dattes"].map((id) => getMenuItem(id)!);
  const rowItems = menuItems.filter((m) => m.kitchenId === "dar-wajba" && (m.section === "Tajines" || m.id === "jus-orange"));
  const vegIngredients = ingredientsForStep("veg");
  const proteinIngredients = ingredientsForStep("protein").slice(0, 3);

  // Interactive state.
  const [filter, setFilter] = useState<HomeFilter["id"]>("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dishSelections, setDishSelections] = useState(() => defaultDishSelections(tajine));
  const [qty, setQty] = useState(1);
  const [veg, setVeg] = useState<string[]>(composeDefaultSelection.veg);
  const [protein, setProtein] = useState<string[]>(composeDefaultSelection.protein);
  const [cartQty, setCartQty] = useState(1);
  const [cutlery, setCutlery] = useState(false);
  const [invoice, setInvoice] = useState(true);
  const [tab, setTab] = useState<TabKey>("home");

  const dish = computeDishTotals(tajine, dishSelections, qty);

  // Sample cart from the design: Tajine Duo + composed bowl + 2 × atay, code BUREAU15.
  const tajineDuo = computeDishTotals(tajine, { ...defaultDishSelections(tajine), size: ["duo"] }, 1).total;
  const bowl = computeComposeTotals(composeDefaultSelection).price;
  const atay = getMenuItem("atay")!.price * 2;
  const cart = { count: 2, ...computeOrderTotals({ subtotal: tajineDuo + bowl + atay, promoCode: "BUREAU15" }) };

  const sportPlan = plans.find((p) => p.popular);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + metrics.gap.xl, paddingBottom: metrics.tabBar.height + metrics.cartBar.height + insets.bottom + spacing.sectionGap * 2 }}>
        {/* Header */}
        <View style={[styles.padded, styles.header]}>
          <Logo size={34} showArabic />
          <Text variant="screenTitleLarge">{t("dev.title")}</Text>
          <Text variant="bodySmall" color="muted">
            {t("dev.subtitle")}
          </Text>
        </View>

        <Section title={t("dev.colors")}>
          <View style={styles.wrap}>
            {SWATCHES.map((name) => (
              <View key={name} style={styles.swatchItem}>
                <View style={[styles.swatch, { backgroundColor: colors[name] }]} />
                <Text variant="caption" color="muted" numberOfLines={1}>
                  {name}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title={t("dev.typography")}>
          <View style={styles.stack}>
            {TYPE_SAMPLES.map((v) => (
              <View key={v} style={styles.typeRow}>
                <Text variant={v} numberOfLines={1} style={styles.flex}>
                  {t("dev.typeSample")}
                </Text>
                <Text variant="caption" color="muted">
                  {`${v} · ${typography[v].fontSize}`}
                </Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title={t("dev.buttons")}>
          <View style={styles.stack}>
            <PrimaryButton label={t("dev.continueWithPhone")} icon="smartphone" />
            <PrimaryButton label={t("dev.continueWithGoogle")} variant="outline" />
            <PrimaryButton label={t("dev.continueWithApple")} variant="dark" icon="apple" />
            <PrimaryButton label={t("dev.seeKitchens")} variant="outline" size="medium" />
            <PrimaryButton label={t("dev.disabled")} disabled />
          </View>
        </Section>

        <Section title={t("dev.iconButtons")}>
          <View style={styles.inline}>
            <IconButton icon="bell" accessibilityLabel={t("home.newNotifications")} dot />
            <IconButton icon="chevronLeft" accessibilityLabel={t("common.back")} />
            <IconButton icon="close" variant="floating" accessibilityLabel={t("common.close")} />
            <IconButton icon="heart" variant="floating" filled iconColor={colors.terracotta} accessibilityLabel={t("common.favorite")} />
            <IconButton icon="plus" variant="primary" accessibilityLabel={t("menu.addShort")} />
            <View style={styles.darkTile}>
              <IconButton icon="heart" size="small" variant="white" accessibilityLabel={t("common.addToFavorites")} />
            </View>
          </View>
        </Section>

        <Section title={t("dev.badges")}>
          <View style={styles.wrap}>
            <Badge label="−15 %" tone="discount" shape="rounded" />
            <Badge label={t("kitchen.freeDelivery")} tone="success" style={styles.outlined} />
            <Badge label={promos[0].badge ?? ""} tone="accent" size="small" />
            <Badge label={t("options.required")} tone="dark" />
            <Badge label={t("options.optional")} tone="neutral" />
            <Badge label={t("account.inviteReward", { amount: formatPrice(30) })} tone="info" />
          </View>
        </Section>

        <Section title={t("dev.search")}>
          <SearchField />
        </Section>

        <Section title={t("dev.categories")}>
          <CategoryGrid categories={categories} />
        </Section>

        <Section title={t("dev.promos")} bleed>
          <PromoCarousel promos={promos} />
        </Section>

        <Section title={t("dev.filters")} bleed>
          <FilterChipRow options={homeFilters} value={filter} onChange={setFilter} />
        </Section>

        <Section title={t("dev.dishCards")} bleed>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hList}>
            {popularDishes.map((item) => (
              <DishCard
                key={item.id}
                item={item}
                kitchen={getKitchen(item.kitchenId)}
                favorite={favorites.includes(item.id)}
                onToggleFavorite={() => setFavorites((f) => (f.includes(item.id) ? f.filter((x) => x !== item.id) : [...f, item.id]))}
              />
            ))}
          </ScrollView>
        </Section>

        <Section title={t("dev.kitchenCards")}>
          <View style={styles.stackLarge}>
            {kitchens.map((k) => (
              <KitchenCard key={k.id} kitchen={k} />
            ))}
          </View>
        </Section>

        <Section title={t("dev.menuGrid")}>
          <View style={styles.grid}>
            {gridItems.map((item) => (
              <MenuGridCard key={item.id} item={item} style={styles.gridCell} />
            ))}
          </View>
        </Section>

        <Section title={t("dev.menuRows")}>
          {rowItems.map((item, i) => (
            <MenuRow key={item.id} item={item} divider={i < rowItems.length - 1} />
          ))}
        </Section>

        <Section title={t("dev.optionGroups")}>
          {tajine.optionGroups!.map((group) => (
            <OptionGroup
              key={group.id}
              group={group}
              selected={dishSelections[group.id] ?? []}
              onChange={(next) => setDishSelections((s) => ({ ...s, [group.id]: next }))}
            />
          ))}
          <View style={[styles.inline, styles.ctaRow]}>
            <Stepper value={qty} onChange={setQty} min={DISH_QTY_MIN} max={DISH_QTY_MAX} />
            <PrimaryButton label={t("menu.addWithTotal", { total: formatPrice(dish.total) })} disabled={!dish.complete} style={styles.flex} />
          </View>
          {dish.kcal !== undefined && (
            <Text variant="caption" color="muted">
              {formatKcal(dish.kcal)}
            </Text>
          )}
        </Section>

        <Section title={t("dev.selectChips")}>
          <GroupHeader
            title={t("compose.veg")}
            subtitle={t("options.countOf", { count: veg.length, max: composeRules.veg.max })}
            badge={{ label: t("options.upTo", { max: composeRules.veg.max }), tone: "neutral" }}
          />
          <View style={[styles.wrap, styles.chips]}>
            {vegIngredients.map((ing) => {
              const on = veg.includes(ing.id);
              return (
                <SelectChip
                  key={ing.id}
                  label={ing.name}
                  color={ing.color}
                  priceDelta={ing.priceDelta}
                  selected={on}
                  disabled={!on && veg.length >= composeRules.veg.max}
                  onPress={() => setVeg((v) => toggleSelection(v, ing.id, composeRules.veg.max, composeRules.veg.required))}
                />
              );
            })}
          </View>
        </Section>

        <Section title={t("dev.optionRows")}>
          {proteinIngredients.map((ing) => (
            <OptionRow
              key={ing.id}
              label={ing.name}
              sublabel={formatKcal(ing.kcal)}
              leading={<View style={[styles.ingredientDot, { backgroundColor: ing.color }]} />}
              trailingText={ing.priceDelta ? formatPriceDelta(ing.priceDelta) : undefined}
              control="radio"
              selected={protein.includes(ing.id)}
              onPress={() => setProtein((p) => toggleSelection(p, ing.id, composeRules.protein.max, composeRules.protein.required))}
            />
          ))}
        </Section>

        <Section title={t("dev.stepper")}>
          <View style={styles.inline}>
            <Stepper value={qty} onChange={setQty} min={DISH_QTY_MIN} max={DISH_QTY_MAX} />
            <Stepper value={cartQty} onChange={setCartQty} min={0} compact />
          </View>
        </Section>

        <Section title={t("dev.switches")}>
          <View style={styles.switchRow}>
            <View style={styles.flex}>
              <Text variant="cardTitle">{t("cart.cutlery")}</Text>
              <Text variant="cardMeta" color="muted">
                {t("cart.cutleryNote")}
              </Text>
            </View>
            <Switch value={cutlery} onValueChange={setCutlery} accessibilityLabel={t("cart.cutlery")} />
          </View>
          <View style={styles.switchRow}>
            <View style={styles.flex}>
              <Text variant="cardTitle">{t("cart.invoice")}</Text>
              <Text variant="cardMeta" color="muted">
                {t("cart.invoiceNote")}
              </Text>
            </View>
            <Switch value={invoice} onValueChange={setInvoice} accessibilityLabel={t("cart.invoice")} />
          </View>
        </Section>

        <Section title={t("dev.summary")}>
          <SummaryBox
            rows={[
              { label: t("summary.subtotal"), value: formatPrice(cart.subtotal) },
              cart.freeDelivery
                ? { label: t("summary.delivery"), value: t("summary.free"), strikeValue: formatPrice(cart.baseDeliveryFee), tone: "success" }
                : { label: t("summary.delivery"), value: formatPrice(cart.deliveryFee) },
              { label: t("summary.discount"), value: formatPriceDelta(-cart.discount), tone: "success" },
            ]}
            total={{ label: t("summary.total"), value: formatPrice(cart.total) }}
            footnote={t("summary.nojoum", { count: cart.nojoum })}
          />
        </Section>

        <Section title={t("dev.listRows")}>
          <ListRow icon="gift" label={t("account.invite")} badge={t("account.inviteReward", { amount: formatPrice(30) })} tone="primary" onPress={() => {}} />
          <ListRow icon="calendar" label={t("account.subscription")} value={sportPlan?.name} onPress={() => {}} />
          <ListRow icon="globe" label={t("account.language")} value={t("account.languageValue")} onPress={() => {}} />
          <ListRow icon="help" label={t("account.help")} onPress={() => {}} />
        </Section>

        <Section title={t("dev.progress")}>
          <ProgressSegments
            current={2}
            currentProgress={0.55}
            labels={[t("tracking.confirmed"), t("tracking.preparing"), t("tracking.onTheWay"), t("tracking.delivered")]}
          />
        </Section>

        <Section title={t("dev.bars")}>
          <Text variant="bodySmall" color="muted">
            ↓
          </Text>
        </Section>
      </ScrollView>

      {/* Fixed bottom: floating cart bar above the tab bar. */}
      <View style={styles.bottom} pointerEvents="box-none">
        <CartBar count={cart.count} total={cart.total} style={styles.cartBar} />
        <TabBar activeKey={tab} onSelect={setTab} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  padded: { paddingHorizontal: spacing.pagePadding },
  header: { gap: metrics.gap.m, paddingBottom: metrics.gap.m },
  section: { paddingTop: spacing.sectionGap, gap: metrics.gap.xl },
  sectionTitle: { paddingHorizontal: spacing.pagePadding },
  stack: { gap: metrics.gap.xl },
  stackLarge: { gap: spacing.sectionGap },
  inline: { flexDirection: "row", alignItems: "center", gap: metrics.gap.xl, flexWrap: "wrap" },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: metrics.gap.m },
  chips: { paddingTop: metrics.gap.xl },
  hList: { paddingHorizontal: spacing.pagePadding, gap: metrics.gap.xl },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: spacing.sectionGap },
  gridCell: { width: "48%" },
  ctaRow: { flexWrap: "nowrap", paddingTop: metrics.gap.xl },
  swatchItem: { width: "18%", gap: metrics.gap.xs },
  swatch: { height: 44, borderRadius: metrics.gap.xl, borderWidth: metrics.hairline, borderColor: colors.border },
  typeRow: { flexDirection: "row", alignItems: "baseline", gap: metrics.gap.m },
  darkTile: { padding: metrics.gap.s, borderRadius: metrics.gap.xl, backgroundColor: colors.terracottaTint },
  outlined: { borderWidth: metrics.hairline, borderColor: colors.border },
  ingredientDot: {
    width: metrics.selectChip.listDot,
    height: metrics.selectChip.listDot,
    borderRadius: metrics.selectChip.listDot / 2,
    borderWidth: metrics.hairline,
    borderColor: colors.dotOutline,
  },
  switchRow: { flexDirection: "row", alignItems: "center", gap: metrics.gap.xl, minHeight: metrics.listRow.minHeight },
  bottom: { position: "absolute", start: 0, end: 0, bottom: 0, gap: metrics.gap.xl },
  cartBar: { marginHorizontal: spacing.pagePadding },
});
