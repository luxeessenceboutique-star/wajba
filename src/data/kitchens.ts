/** Seed data — DESIGN_SPEC.md §8. All values are placeholders. */
import { colors } from "@/theme";
import type { Kitchen } from "@/types/models";

export const kitchens: Kitchen[] = [
  {
    id: "dar-wajba",
    name: "Dar Wajba",
    initials: "DW",
    color: colors.terracotta,
    tagline: "Tajines · Couscous · Pastilla",
    description: "Tajines, couscous & plats de dar · Halal",
    tags: ["Tajines", "Couscous", "Pastilla"],
    rating: 4.8,
    ratingCount: 2100,
    etaMin: 25,
    etaMax: 35,
    deliveryFee: 0,
    freeDeliveryFrom: 150,
    promo: "−15 % sur les tajines jusqu'à 15h",
    coverImage: "tajine",
    coverTint: colors.terracottaTint,
    sections: ["Tajines", "Couscous", "Pastillas", "Ftour", "Boissons"],
  },
  {
    id: "wajba-fit",
    name: "Wajba Fit",
    initials: "WF",
    color: colors.mint,
    tagline: "Bowls · Protéines · Healthy",
    tags: ["Bowls", "Protéines", "Healthy"],
    rating: 4.7,
    ratingCount: 1400,
    etaMin: 20,
    etaMax: 30,
    deliveryFee: 9,
    coverImage: "bowl",
    coverTint: colors.mintTint,
    description: "Bowls équilibrés, protéines et calories affichées · Halal",
    sections: ["Bowls", "Protéines"],
  },
  {
    id: "wajba-grill",
    name: "Wajba Grill",
    initials: "WG",
    color: colors.ink,
    initialsColor: colors.saffron,
    tagline: "Brochettes · Kefta · Grillades",
    tags: ["Brochettes", "Kefta", "Grillades"],
    rating: 4.6,
    ratingCount: 980,
    etaMin: 30,
    etaMax: 40,
    deliveryFee: 9,
    promo: "−10 % le soir",
    coverImage: "brochettes",
    coverTint: colors.saffronTint,
    description: "Brochettes, kefta et grillades au feu de bois · Halal",
    sections: ["Grillades", "À partager"],
  },
];

/** Total number of kitchens announced on Home (three more are TBD). */
export const KITCHEN_COUNT = 6;

export function getKitchen(id: string): Kitchen | undefined {
  return kitchens.find((k) => k.id === id);
}
