import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import {
  getCurrentModuleId,
  getCurrentModuleType,
} from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { setSearchPlaceholderCategories } from "redux/slices/storedData";
import useIsRehydrated from "hooks/useIsRehydrated";

type ModuleType =
  | "grocery"
  | "pharmacy"
  | "ecommerce"
  | "food"
  | "parcel"
  | "rental"
  | "ride-share"
  | "service";

interface PlaceholderCache {
  moduleId?: number | string | null;
  names?: string[];
}

interface StateWithPlaceholderCache {
  storedData?: { searchPlaceholderCategories?: PlaceholderCache };
}

interface AnimatedSearchPlaceholder {
  /** The word currently shown after "Search for" — already length-clamped. */
  currentNoun: string;
  /** Drives the fade transition between words. */
  visible: boolean;
}

const MODULE_NOUN_KEY: Partial<Record<ModuleType, string>> = {
  [ModuleTypes.FOOD]: "Food",
  [ModuleTypes.GROCERY]: "Grocery",
  [ModuleTypes.PHARMACY]: "Medicine",
  [ModuleTypes.ECOMMERCE]: "Products",
  [ModuleTypes.PARCEL]: "Parcel",
  [ModuleTypes.SERVICE]: "Services",
};

const MAX_CATEGORIES = 15;
const MAX_NOUN_LENGTH = 22;
const CYCLE_MS = 2600;
const FADE_MS = 280;

/**
 * Cycling "Search for <noun>" placeholder shared by the desktop and mobile
 * navbars.
 *
 * The category names are cosmetic, so this deliberately refuses to pay for them
 * more than once: the names live in a persisted, module-tagged redux cache and
 * the network is only touched when that cache misses. Both navbars used to call
 * `useGetCategories()` unconditionally, which meant an `/api/v1/categories`
 * request on every page that renders the layout — checkout included — purely to
 * animate a placeholder.
 */
export const useAnimatedSearchPlaceholder = (): AnimatedSearchPlaceholder => {
  const dispatch = useDispatch();
  const isRehydrated = useIsRehydrated();
  const cache = useSelector(
    (state: StateWithPlaceholderCache) =>
      state.storedData?.searchPlaceholderCategories,
  );

  const moduleId = getCurrentModuleId();
  // A cache from another module is a miss, not a fallback — otherwise the
  // grocery navbar would animate leftover food category names.
  const cachedNames =
    moduleId != null &&
    cache?.moduleId != null &&
    String(cache.moduleId) === String(moduleId)
      ? cache.names
      : undefined;
  const hasCachedNames = !!cachedNames?.length;

  const { data: categoriesResponse } = useGetCategories(
    undefined,
    undefined,
    undefined,
    // Wait for rehydration: on a reload the store still holds initialState for
    // one render, and deciding then would refetch despite a persisted copy.
    { enabled: isRehydrated && !hasCachedNames },
  );

  const fetchedNames = useMemo(() => {
    const categories: { name?: string }[] = categoriesResponse?.data ?? [];
    return categories
      .map((category) => category?.name)
      .filter((name): name is string => !!name)
      .slice(0, MAX_CATEGORIES);
  }, [categoriesResponse]);

  // Seed the persisted cache so later page loads never refetch for this.
  useEffect(() => {
    if (hasCachedNames || moduleId == null || !fetchedNames.length) return;
    dispatch(setSearchPlaceholderCategories({ moduleId, names: fetchedNames }));
  }, [dispatch, hasCachedNames, moduleId, fetchedNames]);

  const moduleType = getCurrentModuleType() as ModuleType | undefined;
  const moduleNoun = t(
    (moduleType && MODULE_NOUN_KEY[moduleType]) || "Items",
  ) as string;

  const animatedItems = useMemo(
    () => [moduleNoun, ...(cachedNames ?? fetchedNames)],
    [moduleNoun, cachedNames, fetchedNames],
  );

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  // Ref so the interval always reads the latest items without restarting.
  const animatedItemsRef = useRef(animatedItems);
  animatedItemsRef.current = animatedItems;

  useEffect(() => {
    const id = setInterval(() => {
      const items = animatedItemsRef.current;
      if (!items || items.length <= 1) return;
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % items.length);
        setVisible(true);
      }, FADE_MS);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const rawNoun = animatedItems[index] ?? moduleNoun;
  // Keep long category names from breaking the placeholder UI.
  const currentNoun =
    rawNoun.length > MAX_NOUN_LENGTH
      ? `${rawNoun.slice(0, MAX_NOUN_LENGTH).trimEnd()}…`
      : rawNoun;

  return { currentNoun, visible };
};

export default useAnimatedSearchPlaceholder;
