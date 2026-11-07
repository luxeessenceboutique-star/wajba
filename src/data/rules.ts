/** Business rules — DESIGN_SPEC.md §7. Mock values: confirm with the business. */

export const DELIVERY_FEE = 12;
export const FREE_DELIVERY_FROM = 150;

export type PromoCode = { code: string; kind: "percent" | "amount"; value: number; firstOrderOnly?: boolean };

export const PROMO_CODES: PromoCode[] = [
  { code: "BSAHA20", kind: "percent", value: 20, firstOrderOnly: true },
  { code: "BUREAU15", kind: "amount", value: 15 },
];

export const TIP_OPTIONS = [0, 5, 10, 15];

/** Loyalty points earned per dirham paid. */
export const NOJOUM_PER_DH = 1;
/** Fidda → Dheb level threshold. */
export const DHEB_THRESHOLD = 2000;

/** Dish sheet quantity limits (design: 1–9). */
export const DISH_QTY_MIN = 1;
export const DISH_QTY_MAX = 9;
