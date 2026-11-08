/** Placed orders (Zustand). Not persisted yet (phase 5). */
import { create } from "zustand";

import type { Order } from "@/types/models";

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
}

export const useOrdersStore = create<OrdersState>()((set) => ({
  orders: [],
  addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
}));

export function useOrder(id: string | undefined): Order | undefined {
  return useOrdersStore((s) => s.orders.find((o) => o.id === id));
}
