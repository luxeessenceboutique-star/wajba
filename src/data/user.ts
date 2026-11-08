/** Mock signed-in user — names and numbers from screens/source/Account.dc.html and Pay.dc.html. */
import type { User } from "@/types/models";

export const mockUser: User = {
  id: "u-1",
  name: "Amine Mansouri",
  phone: "+212 6 •• •• 12 34",
  profiles: [],
  walletBalance: 120,
  nojoum: 1450,
  level: "Fidda",
  dailyKcalGoal: 2700,
  dailyProteinGoal: 140,
  preferences: { glutenFree: false, vegetarian: false, lactoseFree: false, allergies: [] },
  addresses: [
    { id: "office", label: "Bureau", line: "Bd Zerktouni, 3e étage, bureau 302", city: "Casablanca" },
    { id: "home", label: "Maison", line: "Rue Ibnou Mounir, Maârif", city: "Casablanca" },
  ],
};

/** Saved payment card (mock). */
export const savedCard = { brand: "Visa", last4: "4821", expiry: "09/28" };

/** Short form shown on Home: "Bureau · Bd Zerktouni". */
export function shortAddress(address: { label: string; line: string }): string {
  return `${address.label} · ${address.line.split(",")[0]}`;
}
