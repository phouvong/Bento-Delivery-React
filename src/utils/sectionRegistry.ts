/**
 * Source-of-truth for which section ids exist per module.
 *
 * IMPORTANT — design intent:
 * - The `id` is a stable internal identifier used by the URL (`/home/<id>?module=...`)
 *   and by the in-component lookup. It must NEVER change and is NOT a display label.
 * - The `defaultLabel` is an English fallback used ONLY for SEO when both the
 *   backend `get-page-meta-data` endpoint and the translation file return nothing.
 */

export type ModuleKey = "pharmacy" | "grocery" | "food" | "ecommerce" | "shop";

export type SectionEntry = {
  id: string;
  defaultLabel: string;
  sidebarLabel?: string;
  group?: string;
  requiresToken?: boolean;
  hiddenFromSidebar?: boolean;
};

const COMMON_SECTIONS: SectionEntry[] = [
  { id: "discounted", defaultLabel: "Discounted Items", hiddenFromSidebar: true },
  { id: "offers", defaultLabel: "Offers", sidebarLabel: "Offers" },
  { id: "free-delivery", defaultLabel: "Free Delivery", sidebarLabel: "Free Delivery" },
  { id: "top-rated", defaultLabel: "Top Rated", sidebarLabel: "Top Rated" },
  { id: "nearby", defaultLabel: "Nearby", sidebarLabel: "Nearby" },
];

const ECOMMERCE_SECTIONS: SectionEntry[] = [
  ...COMMON_SECTIONS,
  { id: "verified-seller", defaultLabel: "Verified Seller", sidebarLabel: "Verified Seller" },
];

export const SECTION_REGISTRY: Record<ModuleKey, SectionEntry[]> = {
  food: COMMON_SECTIONS,
  grocery: COMMON_SECTIONS,
  pharmacy: COMMON_SECTIONS,
  ecommerce: ECOMMERCE_SECTIONS,
  shop: ECOMMERCE_SECTIONS,
};

export const SECTION_BACKEND_KEY_MAP: Record<string, string> = {
  discounted: "discounted_page",
  offers: "offers_page",
  "top-rated": "top_rated_page",
  nearby: "nearby_page",
};

export const isValidModuleKey = (value: string | undefined): value is ModuleKey =>
  !!value && Object.prototype.hasOwnProperty.call(SECTION_REGISTRY, value);

export const isValidSectionId = (
  moduleKey: string | undefined,
  sectionId: string | undefined,
): boolean => {
  if (!isValidModuleKey(moduleKey) || !sectionId) return false;
  return SECTION_REGISTRY[moduleKey].some((entry) => entry.id === sectionId);
};

export const getSectionDefaultLabel = (
  moduleKey: string | undefined,
  sectionId: string | undefined,
): string | null => {
  if (!isValidModuleKey(moduleKey) || !sectionId) return null;
  return SECTION_REGISTRY[moduleKey].find((entry) => entry.id === sectionId)?.defaultLabel ?? null;
};

export const getVisibleSidebarSections = (
  moduleKey: string | undefined,
  hasToken: boolean,
): SectionEntry[] => {
  if (!isValidModuleKey(moduleKey)) return [];
  return SECTION_REGISTRY[moduleKey].filter((entry) => {
    if (entry.hiddenFromSidebar) return false;
    if (entry.requiresToken && !hasToken) return false;
    return true;
  });
};
