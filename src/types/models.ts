/**
 * Data model — DESIGN_SPEC.md §6.
 *
 * Image fields (`image`, `coverImage`) take either an illustration key from
 * src/assets/illustrations.ts (e.g. "tajine") or a photo URL ("https://…").
 * When real food photos arrive, only the data changes.
 */

export type ProfileId = "job" | "etu" | "sport" | "fam" | "heal" | "ftour";

export interface Profile {
  id: ProfileId;
  name: string;
  perk: string;
  image: string;
  tint: string;
}

export interface Kitchen {
  id: string;
  name: string;
  initials: string;
  /** Avatar background. */
  color: string;
  /** Avatar initials color (white unless set, e.g. saffron on ink for Wajba Grill). */
  initialsColor?: string;
  tagline: string;
  description?: string;
  tags: string[];
  rating: number;
  ratingCount: number;
  etaMin: number;
  etaMax: number;
  deliveryFee: number;
  freeDeliveryFrom?: number;
  promo?: string;
  coverImage: string;
  coverTint: string;
  /** Menu sections in display order (tabs on the kitchen page, after "Populaires"). */
  sections: string[];
}

export interface Option {
  id: string;
  label: string;
  priceDelta: number;
  /** Shows "inclus" instead of a price (e.g. Khobz dar). */
  included?: boolean;
  kcalDelta?: number;
  proteinDelta?: number;
}

export interface OptionGroup {
  id: string;
  title: string;
  subtitle?: string;
  required: boolean;
  min: number;
  max: number;
  options: Option[];
  /** Options selected when the sheet opens (e.g. "Khobz dar" included). */
  defaultSelected?: string[];
}

export interface MenuItem {
  id: string;
  kitchenId: string;
  section: string;
  name: string;
  description: string;
  /** Longer text for the dish sheet (falls back to `description`). */
  longDescription?: string;
  price: number;
  oldPrice?: number;
  kcal?: number;
  protein?: number;
  /** Extra line after kcal, e.g. "le vendredi". */
  note?: string;
  image?: string;
  tint?: string;
  rating?: number;
  ratingCount?: number;
  popular?: boolean;
  allergens?: string[];
  profiles?: ProfileId[];
  optionGroups?: OptionGroup[];
}

export type ComposeStep = "base" | "protein" | "veg" | "sauce" | "extra";

export interface ComposeIngredient {
  id: string;
  step: ComposeStep;
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  priceDelta: number;
  color: string;
}

export interface CartLine {
  id: string;
  itemId: string | "compose";
  name: string;
  summary: string;
  unitPrice: number;
  qty: number;
  kcal?: number;
  selections: Record<string, string[]>;
  note?: string;
  /** For display and the "one delivery" kitchens line. */
  kitchenId: string;
  image?: string;
  tint?: string;
}

export type OrderStatus = "confirmed" | "preparing" | "on_the_way" | "delivered" | "cancelled";

export type PaymentMethod = "card" | "apple_pay" | "google_pay" | "wallet" | "cash";

export interface Rider {
  name: string;
  rating: number;
  vehicle: string;
  phone: string;
}

export interface Order {
  id: string;
  lines: CartLine[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tip: number;
  total: number;
  payment: PaymentMethod;
  /** "asap" or a time slot label, e.g. "13:00". */
  schedule: "asap" | string;
  addressId: string;
  /** Status at creation; the live status is derived from `placedAt` (see lib/orders.ts). */
  status: OrderStatus;
  etaISO: string;
  handoverCode: string;
  rider?: Rider;
  /** Epoch ms when the order was placed. */
  placedAt: number;
  /** Delivery time promised at checkout, in minutes. */
  etaMinutes: number;
  promoCode?: string;
  cutlery: boolean;
  invoice: boolean;
  riderNote?: string;
}

export interface Plan {
  id: "bureau" | "sport" | "fac";
  name: string;
  days: number;
  mealsPerDay: 1 | 2;
  price: number;
  oldPrice: number;
  popular?: boolean;
}

export interface Address {
  id: string;
  label: string;
  line: string;
  city: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  profiles: ProfileId[];
  walletBalance: number;
  nojoum: number;
  level: "Fidda" | "Dheb";
  dailyKcalGoal: number;
  dailyProteinGoal: number;
  preferences: { glutenFree: boolean; vegetarian: boolean; lactoseFree: boolean; allergies: string[] };
  addresses: Address[];
}

/** Where a Home category bubble leads. */
export type CategoryTarget = { kind: "kitchen"; kitchenId: string; section?: string } | { kind: "compose" };

export interface Category {
  id: string;
  label: string;
  image: string;
  tint: string;
  target: CategoryTarget;
}

export interface Promo {
  id: string;
  title: string;
  badge?: string;
  subtitle?: string;
  tone: "primary" | "saffron";
  image: string;
  /** Screen opened by the banner, if any (e.g. the weekly plans tab). */
  target?: "plan";
}

export interface HomeFilter {
  id: "all" | ProfileId;
  label: string;
}
