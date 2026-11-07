/**
 * Food and brand illustrations (placeholders until real photos arrive).
 *
 * Each entry tells <FoodImage> how to crop the drawing so it looks like a
 * photo, not an icon: `scale` multiplies the size the slot asks for (the
 * tajine is tall, so it's drawn a bit smaller); `align: "top"` pins the art
 * to the top of the slot so the tajine's lid and steam show and its base
 * bleeds off the bottom, as in the designs; `offsetY` is an extra shift as a
 * fraction of the slot height.
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
  align: "center" | "top";
  offsetY: number;
}

export const illustrations: Record<IllustrationKey, Illustration> = {
  tajine: { Component: Tajine, scale: 0.92, align: "top", offsetY: 0 },
  couscous: { Component: Couscous, scale: 1, align: "center", offsetY: 0 },
  bowl: { Component: Bowl, scale: 1, align: "center", offsetY: 0 },
  brochettes: { Component: Brochettes, scale: 1, align: "center", offsetY: 0 },
  pastilla: { Component: Pastilla, scale: 1, align: "center", offsetY: 0 },
  harira: { Component: Harira, scale: 1, align: "center", offsetY: 0 },
  msemen: { Component: Msemen, scale: 1, align: "center", offsetY: 0 },
  atay: { Component: Atay, scale: 0.88, align: "center", offsetY: 0 },
};

export function isIllustrationKey(value: string): value is IllustrationKey {
  return value in illustrations;
}

export function isPhotoUrl(value: string): boolean {
  return /^(https?:|file:|data:)/.test(value);
}
