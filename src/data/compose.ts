/** "Compose ta wajba" ingredients — DESIGN_SPEC.md §7 table. Placeholder values. */
import type { ComposeIngredient, ComposeStep } from "@/types/models";

export const COMPOSE_BASE_PRICE = 45;
/** Composed bowls are cooked by Wajba Fit (cart shows "… + Wajba Fit · une seule livraison"). */
export const COMPOSE_KITCHEN_ID = "wajba-fit";
export const COMPOSE_IMAGE = "bowl";

/** Steps in screen order. */
export const composeSteps: ComposeStep[] = ["base", "protein", "veg", "sauce", "extra"];

export function emptyComposeSelection(): Record<ComposeStep, string[]> {
  return { base: [], protein: [], veg: [], sauce: [], extra: [] };
}

export const composeIngredients: ComposeIngredient[] = [
  { id: "couscous", step: "base", name: "Couscous", kcal: 360, protein: 12, carbs: 70, fat: 4, priceDelta: 0, color: "#E8C068" },
  { id: "riz-safran", step: "base", name: "Riz au safran", kcal: 330, protein: 6, carbs: 72, fat: 2, priceDelta: 0, color: "#F6B52E" },
  { id: "quinoa", step: "base", name: "Quinoa", kcal: 300, protein: 11, carbs: 54, fat: 5, priceDelta: 0, color: "#D3B67C" },
  { id: "salade-verte", step: "base", name: "Salade verte", kcal: 60, protein: 3, carbs: 10, fat: 1, priceDelta: 0, color: "#7DBB55" },
  { id: "msemen", step: "base", name: "Msemen", kcal: 320, protein: 7, carbs: 46, fat: 12, priceDelta: 4, color: "#E3A74C" },
  { id: "patate-douce", step: "base", name: "Patate douce", kcal: 240, protein: 4, carbs: 54, fat: 1, priceDelta: 4, color: "#E8762C" },

  { id: "poulet-chermoula", step: "protein", name: "Poulet chermoula", kcal: 220, protein: 32, carbs: 2, fat: 9, priceDelta: 0, color: "#E9B377" },
  { id: "kefta", step: "protein", name: "Kefta épicée", kcal: 290, protein: 24, carbs: 4, fat: 20, priceDelta: 6, color: "#8A4B2A" },
  { id: "poisson", step: "protein", name: "Poisson grillé", kcal: 210, protein: 30, carbs: 0, fat: 9, priceDelta: 10, color: "#AFC0D6" },
  { id: "falafel", step: "protein", name: "Falafel", kcal: 260, protein: 11, carbs: 28, fat: 12, priceDelta: 0, color: "#9C7A3A" },
  { id: "oeufs", step: "protein", name: "Œufs bio", kcal: 150, protein: 12, carbs: 1, fat: 10, priceDelta: 0, color: "#FFE58A" },
  { id: "double-poulet", step: "protein", name: "Double poulet", kcal: 440, protein: 64, carbs: 4, fat: 18, priceDelta: 14, color: "#D89A5E" },

  { id: "zaalouk", step: "veg", name: "Zaalouk", kcal: 70, protein: 1, carbs: 6, fat: 5, priceDelta: 0, color: "#6B2F55" },
  { id: "taktouka", step: "veg", name: "Taktouka", kcal: 60, protein: 1, carbs: 7, fat: 3, priceDelta: 0, color: "#D23A24" },
  { id: "carottes", step: "veg", name: "Carottes au cumin", kcal: 50, protein: 1, carbs: 10, fat: 1, priceDelta: 0, color: "#E8762C" },
  { id: "tomate-concombre", step: "veg", name: "Tomate-concombre", kcal: 25, protein: 1, carbs: 5, fat: 0, priceDelta: 0, color: "#6FAE4A" },
  { id: "avocat", step: "veg", name: "Avocat", kcal: 120, protein: 1, carbs: 6, fat: 11, priceDelta: 8, color: "#9DC65A" },
  { id: "pois-chiches", step: "veg", name: "Pois chiches", kcal: 110, protein: 6, carbs: 18, fat: 2, priceDelta: 0, color: "#EDCF95" },
  { id: "olives", step: "veg", name: "Olives", kcal: 60, protein: 0, carbs: 2, fat: 6, priceDelta: 0, color: "#4A4A2A" },
  { id: "betterave", step: "veg", name: "Betterave", kcal: 40, protein: 1, carbs: 9, fat: 0, priceDelta: 0, color: "#9A1F4A" },

  { id: "harissa", step: "sauce", name: "Harissa", kcal: 20, protein: 1, carbs: 3, fat: 1, priceDelta: 0, color: "#B8281A" },
  { id: "chermoula", step: "sauce", name: "Chermoula", kcal: 60, protein: 0, carbs: 2, fat: 6, priceDelta: 0, color: "#2F7A3A" },
  { id: "tahini", step: "sauce", name: "Tahini", kcal: 90, protein: 3, carbs: 3, fat: 8, priceDelta: 0, color: "#E8D6B0" },
  { id: "yaourt-menthe", step: "sauce", name: "Yaourt menthe", kcal: 35, protein: 2, carbs: 3, fat: 2, priceDelta: 0, color: "#DDEFE3" },
  { id: "sans-sauce", step: "sauce", name: "Sans sauce", kcal: 0, protein: 0, carbs: 0, fat: 0, priceDelta: 0, color: "#FFFFFF" },

  { id: "atay", step: "extra", name: "Atay na3na3", kcal: 80, protein: 0, carbs: 20, fat: 0, priceDelta: 12, color: "#0E8A5F" },
  { id: "jus-orange", step: "extra", name: "Jus d'orange", kcal: 110, protein: 2, carbs: 26, fat: 0, priceDelta: 15, color: "#F59A2C" },
  { id: "chebakia", step: "extra", name: "Chebakia", kcal: 180, protein: 2, carbs: 24, fat: 9, priceDelta: 10, color: "#B8681E" },
  { id: "amlou", step: "extra", name: "Amlou & pain", kcal: 210, protein: 5, carbs: 14, fat: 15, priceDelta: 9, color: "#8A4B2A" },
];

/** Selection rules per step (DESIGN_SPEC §7). */
export const composeRules: Record<ComposeStep, { required: boolean; max: number }> = {
  base: { required: true, max: 1 },
  protein: { required: true, max: 1 },
  veg: { required: false, max: 4 },
  sauce: { required: true, max: 1 },
  extra: { required: false, max: Infinity },
};

/** Default selection shown in the design → 880 kcal, 53 DH. */
export const composeDefaultSelection: Record<ComposeStep, string[]> = {
  base: ["quinoa"],
  protein: ["poulet-chermoula"],
  veg: ["zaalouk", "avocat", "pois-chiches"],
  sauce: ["chermoula"],
  extra: [],
};

export function ingredientsForStep(step: ComposeStep): ComposeIngredient[] {
  return composeIngredients.filter((i) => i.step === step);
}
