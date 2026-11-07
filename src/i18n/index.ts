/**
 * Minimal typed i18n. French only for now; add `ar` / `en` dictionaries with
 * the same shape and switch `current` (Arabic will also need I18nManager RTL).
 */
import { fr, type Dictionary } from "./fr";

type Join<K, P> = K extends string ? (P extends string ? `${K}.${P}` : never) : never;
type Leaves<T> = T extends string ? "" : { [K in keyof T]: K extends string ? (T[K] extends string ? K : Join<K, Leaves<T[K]>>) : never }[keyof T];

export type TranslationKey = Leaves<Dictionary>;
export type Locale = "fr";

const dictionaries: Record<Locale, Dictionary> = { fr };
let current: Locale = "fr";

export function setLocale(locale: Locale) {
  current = locale;
}

export function getLocale(): Locale {
  return current;
}

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const value = key.split(".").reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], dictionaries[current]);
  if (typeof value !== "string") return key;
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
}
