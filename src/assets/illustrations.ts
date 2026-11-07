/**
 * Food and brand illustrations (placeholders until real photos arrive).
 *
 * Each entry tells <FoodImage> how to crop the drawing so it looks like a
 * photo, not an icon: `scale` multiplies the size the slot asks for (the
 * tajine is tall, so it's drawn a bit smaller) and `offsetY` pushes the art
 * down as a fraction of the slot height (so the tajine base bleeds off the
 * bottom edge like in the designs).
 */
import type { FC } from "react";
import type { SvgProps } from "react-native-svg";

import Atay from "@assets/food/atay.svg";
import Bowl from "@assets/food/bowl.svg";
import Brochettes from "@assets/food/brochettes.svg";
import Couscous from "@assets/food/couscous.svg";
import Harira from "@assets/food/harira.svg";
import Msemen from "@assets/food/msemen.svg";
import Pastilla from "@assets/food/pastilla.svg";
import Tajine from "@assets/food/tajine.svg";

export type IllustrationKey = "tajine" | "couscous" | "bowl" | "brochettes" | "pastilla" | "harira" | "msemen" | "atay";

export interface Illustration {
  Component: FC<SvgProps>;
  scale: number;
  offsetY: number;
}

export const illustrations: Record<IllustrationKey, Illustration> = {
  tajine: { Component: Tajine, scale: 0.92, offsetY: 0.14 },
  couscous: { Component: Couscous, scale: 1, offsetY: 0 },
  bowl: { Component: Bowl, scale: 1, offsetY: 0 },
  brochettes: { Component: Brochettes, scale: 1, offsetY: 0 },
  pastilla: { Component: Pastilla, scale: 1, offsetY: 0 },
  harira: { Component: Harira, scale: 1, offsetY: 0 },
  msemen: { Component: Msemen, scale: 1, offsetY: 0 },
  atay: { Component: Atay, scale: 0.88, offsetY: 0 },
};

export function isIllustrationKey(value: string): value is IllustrationKey {
  return value in illustrations;
}

export function isPhotoUrl(value: string): boolean {
  return /^(https?:|file:|data:)/.test(value);
}
