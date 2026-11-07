/** Home content, profiles and plans — DESIGN_SPEC.md §5 and §7. Placeholder values. */
import { colors } from "@/theme";
import type { Category, HomeFilter, Plan, Profile, Promo } from "@/types/models";

export const categories: Category[] = [
  { id: "tajines", label: "Tajines", image: "tajine", tint: colors.tints[0], target: { kind: "kitchen", kitchenId: "dar-wajba", section: "Tajines" } },
  { id: "couscous", label: "Couscous", image: "couscous", tint: colors.tints[1], target: { kind: "kitchen", kitchenId: "dar-wajba", section: "Couscous" } },
  { id: "bowls", label: "Bowls", image: "bowl", tint: colors.tints[2], target: { kind: "compose" } },
  { id: "grillades", label: "Grillades", image: "brochettes", tint: colors.tints[3], target: { kind: "kitchen", kitchenId: "wajba-grill" } },
  { id: "pastilla", label: "Pastilla", image: "pastilla", tint: colors.tints[0], target: { kind: "kitchen", kitchenId: "dar-wajba", section: "Pastillas" } },
  { id: "soupes", label: "Soupes", image: "harira", tint: colors.tints[1], target: { kind: "kitchen", kitchenId: "dar-wajba", section: "Ftour" } },
  { id: "msemen", label: "Msemen", image: "msemen", tint: colors.tints[3], target: { kind: "kitchen", kitchenId: "dar-wajba", section: "Ftour" } },
  { id: "boissons", label: "Boissons", image: "atay", tint: colors.tints[2], target: { kind: "kitchen", kitchenId: "dar-wajba", section: "Boissons" } },
];

export const promos: Promo[] = [
  { id: "bsaha20", title: "−20 % sur ta 1re commande", badge: "Nouveau client", subtitle: "Code BSAHA20", tone: "primary", image: "tajine" },
  { id: "free-delivery", title: "Livraison offerte dès 150 DH", tone: "saffron", image: "couscous" },
  { id: "plans", title: "Ma semaine dès 189 DH", subtitle: "Sans engagement", tone: "primary", image: "bowl", target: "plan" },
];

export const homeFilters: HomeFilter[] = [
  { id: "all", label: "Tout" },
  { id: "sport", label: "Sportif" },
  { id: "job", label: "Bureau" },
  { id: "etu", label: "Étudiant" },
  { id: "fam", label: "Famille" },
  { id: "heal", label: "Healthy" },
];

// Images and tints as in screens/source/Profile.dc.html.
export const profiles: Profile[] = [
  { id: "job", name: "Employé·e", perk: "Livré au bureau, 12h–14h", image: "tajine", tint: colors.saffronTint },
  { id: "etu", name: "Étudiant·e", perk: "−15 % avec ta carte", image: "msemen", tint: colors.primarySoft },
  { id: "sport", name: "Sportif·ve", perk: "Calories et protéines", image: "bowl", tint: colors.mintTint },
  { id: "fam", name: "Famille", perk: "Plats pour 4 à 6", image: "couscous", tint: colors.terracottaTint },
  { id: "heal", name: "Healthy", perk: "Moins de 500 kcal", image: "harira", tint: colors.mintTint },
  { id: "ftour", name: "Ftour & Shour", perk: "Livré avant l'adhan", image: "atay", tint: colors.saffronTint },
];

/** Home filter chosen by default from the user's profiles (first match in chip order). */
export function defaultHomeFilter(userProfiles: readonly string[]): HomeFilter["id"] {
  const match = homeFilters.find((f) => f.id !== "all" && userProfiles.includes(f.id));
  return match ? match.id : "all";
}

export const plans: Plan[] = [
  { id: "bureau", name: "Bureau", days: 5, mealsPerDay: 1, price: 289, oldPrice: 365 },
  { id: "sport", name: "Sportif", days: 6, mealsPerDay: 2, price: 549, oldPrice: 690, popular: true },
  { id: "fac", name: "Fac", days: 5, mealsPerDay: 1, price: 189, oldPrice: 235 },
];
