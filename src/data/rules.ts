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

/** "Souvent pris ensemble" in the cart (items already in the cart are skipped). */
export const CART_SUGGESTION_IDS = ["msemen-miel", "harira", "mini-pastilla", "atay", "jus-orange"];
export const CART_SUGGESTION_COUNT = 3;

/** Scheduled delivery: slots every 30 min, from 45 min from now until 22:00. */
export const SLOT_STEP_MINUTES = 30;
export const SLOT_LEAD_MINUTES = 45;
export const SLOT_LAST_HOUR = 22;

/**
 * Mock tracking timeline, sped up for the demo: seconds after payment when
 * each status starts. Delivered at the end.
 */
export const ORDER_DEMO_TIMELINE = { preparing: 5, onTheWay: 17, delivered: 40 };

/** Mock rider assigned to every order. */
export const MOCK_RIDER = { name: "Youssef", rating: 4.9, vehicle: "Scooter", phone: "+212 6 00 00 00 00" };
