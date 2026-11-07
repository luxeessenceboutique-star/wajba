/**
 * Signed-in user state (Zustand): auth, chosen profiles, delivery address,
 * favorites. Not persisted yet — every app launch starts at the Splash screen,
 * which keeps onboarding easy to test. Persistence comes with "Se déconnecter" (phase 5).
 */
import { create } from "zustand";

import { mockUser } from "@/data/user";
import type { Address, ProfileId } from "@/types/models";

interface UserState {
  signedIn: boolean;
  phone?: string;
  name: string;
  profiles: ProfileId[];
  addresses: Address[];
  addressId: string;
  favoriteItems: string[];
  favoriteKitchens: string[];

  signIn: (phone?: string) => void;
  signOut: () => void;
  setProfiles: (profiles: ProfileId[]) => void;
  setAddress: (id: string) => void;
  toggleFavoriteItem: (id: string) => void;
  toggleFavoriteKitchen: (id: string) => void;
}

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

const initial = {
  signedIn: false,
  phone: undefined,
  name: mockUser.name,
  profiles: [] as ProfileId[],
  addresses: mockUser.addresses,
  addressId: mockUser.addresses[0].id,
  favoriteItems: [] as string[],
  favoriteKitchens: [] as string[],
};

export const useUserStore = create<UserState>()((set) => ({
  ...initial,
  signIn: (phone) => set({ signedIn: true, phone }),
  signOut: () => set(initial),
  setProfiles: (profiles) => set({ profiles }),
  setAddress: (addressId) => set({ addressId }),
  toggleFavoriteItem: (id) => set((s) => ({ favoriteItems: toggle(s.favoriteItems, id) })),
  toggleFavoriteKitchen: (id) => set((s) => ({ favoriteKitchens: toggle(s.favoriteKitchens, id) })),
}));

/** The address currently selected for delivery. */
export function useCurrentAddress(): Address {
  return useUserStore((s) => s.addresses.find((a) => a.id === s.addressId) ?? s.addresses[0]);
}
