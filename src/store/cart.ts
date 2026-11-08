/**
 * Cart (Zustand). One order, one delivery, even across kitchens.
 * Adding the same dish with the same options and note increases the quantity
 * instead of adding a second line. Not persisted yet (phase 5).
 */
import { create } from "zustand";

import type { CartLine } from "@/types/models";

export type NewCartLine = Omit<CartLine, "id">;

interface CartState {
  lines: CartLine[];
  add: (line: NewCartLine) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

let nextId = 1;

/** Same dish, same options, same note → same line. */
function sameLine(a: NewCartLine, b: NewCartLine): boolean {
  if (a.itemId !== b.itemId || (a.note ?? "") !== (b.note ?? "")) return false;
  const keys = new Set([...Object.keys(a.selections), ...Object.keys(b.selections)]);
  for (const key of keys) {
    const x = [...(a.selections[key] ?? [])].sort().join("|");
    const y = [...(b.selections[key] ?? [])].sort().join("|");
    if (x !== y) return false;
  }
  return true;
}

export const useCartStore = create<CartState>()((set) => ({
  lines: [],
  add: (line) =>
    set((s) => {
      const existing = s.lines.find((l) => sameLine(l, line));
      if (existing) return { lines: s.lines.map((l) => (l === existing ? { ...l, qty: l.qty + line.qty } : l)) };
      return { lines: [...s.lines, { ...line, id: `line-${nextId++}` }] };
    }),
  setQty: (id, qty) =>
    set((s) => ({ lines: qty <= 0 ? s.lines.filter((l) => l.id !== id) : s.lines.map((l) => (l.id === id ? { ...l, qty } : l)) })),
  clear: () => set({ lines: [] }),
}));

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.qty, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
}

/** Kitchens in the cart, in the order they were added. */
export function cartKitchenIds(lines: CartLine[]): string[] {
  return [...new Set(lines.map((l) => l.kitchenId))];
}
