/**
 * Mock API — async functions returning the seed data from src/data, with a
 * short delay so loading states are exercised. When the backend exists, only
 * this file changes: screens keep calling the same functions.
 */
import { categories, homeFilters, promos } from "@/data/home";
import { kitchens } from "@/data/kitchens";
import { menuItems } from "@/data/menu";
import { mockUser } from "@/data/user";
import { MOCK_RIDER } from "@/data/rules";
import { handoverCode } from "@/lib/orders";
import type { Kitchen, MenuItem, Order, User } from "@/types/models";

const LATENCY_MS = 250;

function respond<T>(value: T, ms = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

class NotFoundError extends Error {
  constructor(what: string) {
    super(`${what} not found`);
    this.name = "NotFoundError";
  }
}

/** Lowercase and strip accents, so "pates" finds "Pâtes" and "oeufs" finds "œufs". */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/œ/g, "oe")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export interface KitchenMenu {
  kitchen: Kitchen;
  popular: MenuItem[];
  /** Sections in display order, each with its items. */
  sections: { title: string; items: MenuItem[] }[];
}

export const api = {
  auth: {
    /** Sends an SMS code (mock: always succeeds). */
    sendCode: (phone: string) => respond({ ok: phone.replace(/\D/g, "").length >= 9 }),
    /** Mock: any 4-digit code is accepted. */
    verifyCode: (_phone: string, code: string) => respond({ ok: /^\d{4}$/.test(code) }),
    signInWithProvider: (_provider: "google" | "apple") => respond({ ok: true }),
  },

  user: {
    get: (): Promise<User> => respond(mockUser),
  },

  home: {
    getFeed: () =>
      respond({
        categories,
        promos,
        filters: homeFilters,
        popular: menuItems.filter((m) => m.popular),
        kitchens,
      }),
  },

  kitchens: {
    list: () => respond(kitchens),
    getMenu: async (id: string): Promise<KitchenMenu> => {
      const kitchen = kitchens.find((k) => k.id === id);
      if (!kitchen) throw new NotFoundError(`Kitchen ${id}`);
      const items = menuItems.filter((m) => m.kitchenId === id);
      const extra = [...new Set(items.map((m) => m.section))].filter((s) => !kitchen.sections.includes(s));
      const sections = [...kitchen.sections, ...extra]
        .map((title) => ({ title, items: items.filter((m) => m.section === title) }))
        .filter((s) => s.items.length > 0);
      return respond({ kitchen, popular: items.filter((m) => m.popular), sections });
    },
  },

  orders: {
    /** Mock payment + order creation: always succeeds after a short wait. */
    place: (input: Omit<Order, "id" | "status" | "etaISO" | "handoverCode" | "rider" | "placedAt">): Promise<Order> => {
      const placedAt = Date.now();
      const order: Order = {
        ...input,
        id: `WJ-${String(placedAt).slice(-6)}`,
        status: "confirmed",
        placedAt,
        etaISO: new Date(placedAt + input.etaMinutes * 60_000).toISOString(),
        handoverCode: handoverCode(),
        rider: MOCK_RIDER,
      };
      return respond(order, LATENCY_MS * 4);
    },
  },

  menu: {
    getItem: async (id: string): Promise<MenuItem> => {
      const item = menuItems.find((m) => m.id === id);
      if (!item) throw new NotFoundError(`Menu item ${id}`);
      return respond(item);
    },
    /** Search dish names, descriptions, sections and kitchen names. Empty query = popular dishes. */
    search: (query: string, kitchenId?: string) => {
      const scope = kitchenId ? menuItems.filter((m) => m.kitchenId === kitchenId) : menuItems;
      const q = normalize(query.trim());
      if (!q) return respond(scope.filter((m) => m.popular || kitchenId));
      const results = scope.filter((m) => {
        const kitchenName = kitchens.find((k) => k.id === m.kitchenId)?.name ?? "";
        return [m.name, m.description, m.section, kitchenName].some((field) => normalize(field).includes(q));
      });
      return respond(results, LATENCY_MS / 2);
    },
  },
};
