/** Live order status from the mock timeline, delivery slots and time helpers. */
import { ORDER_DEMO_TIMELINE, SLOT_LAST_HOUR, SLOT_LEAD_MINUTES, SLOT_STEP_MINUTES } from "@/data/rules";
import type { Order, OrderStatus } from "@/types/models";

export const ORDER_STEPS: OrderStatus[] = ["confirmed", "preparing", "on_the_way", "delivered"];

export interface OrderProgress {
  status: OrderStatus;
  /** Index in ORDER_STEPS. */
  step: number;
  /** Progress inside the current step (0–1). */
  stepProgress: number;
  /** Progress of the whole delivery (0–1), drives the rider on the map. */
  rideProgress: number;
  minutesLeft: number;
}

/** Status of an ASAP order `now`: the demo timeline maps seconds to the promised minutes. */
export function orderProgress(order: Order, now: number): OrderProgress {
  if (order.schedule !== "asap") {
    return { status: "confirmed", step: 0, stepProgress: 0, rideProgress: 0, minutesLeft: order.etaMinutes };
  }
  const elapsed = Math.max(0, (now - order.placedAt) / 1000);
  const { preparing, onTheWay, delivered } = ORDER_DEMO_TIMELINE;
  const overall = Math.min(1, elapsed / delivered);
  const minutesLeft = Math.ceil(order.etaMinutes * (1 - overall));
  const span = (from: number, to: number) => Math.min(1, Math.max(0, (elapsed - from) / (to - from)));
  if (elapsed >= delivered) return { status: "delivered", step: 3, stepProgress: 1, rideProgress: 1, minutesLeft: 0 };
  if (elapsed >= onTheWay) return { status: "on_the_way", step: 2, stepProgress: span(onTheWay, delivered), rideProgress: span(onTheWay, delivered), minutesLeft };
  if (elapsed >= preparing) return { status: "preparing", step: 1, stepProgress: span(preparing, onTheWay), rideProgress: 0, minutesLeft };
  return { status: "confirmed", step: 0, stepProgress: span(0, preparing), rideProgress: 0, minutesLeft };
}

/** "13:02" */
export function formatClock(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

/** Delivery slots for today: every 30 min from now + 45 min, until 22:00. */
export function todaySlots(now = new Date()): string[] {
  const start = new Date(now.getTime() + SLOT_LEAD_MINUTES * 60_000);
  const minutes = Math.ceil((start.getHours() * 60 + start.getMinutes()) / SLOT_STEP_MINUTES) * SLOT_STEP_MINUTES;
  const slots: string[] = [];
  for (let m = minutes; m <= SLOT_LAST_HOUR * 60; m += SLOT_STEP_MINUTES) {
    slots.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return slots;
}

/** Random 4-digit handover code. */
export function handoverCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}
