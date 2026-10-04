import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const MAX_ITEMS = 5;

const getKey = (moduleType) =>
  moduleType ? `searchedValues_${moduleType}` : "searchedValues";

export const getRecentSearches = (moduleType) => {
  if (typeof window === "undefined") return [];
  const cmodule = moduleType ?? getCurrentModuleType();
  try {
    return JSON.parse(localStorage.getItem(getKey(cmodule))) || [];
  } catch {
    return [];
  }
};

export const saveRecentSearch = (value, moduleType) => {
  if (typeof window === "undefined" || !value) return;
  const cmodule = moduleType ?? getCurrentModuleType();
  const key = getKey(cmodule);
  const items = getRecentSearches(cmodule).filter((v) => v !== value);
  items.unshift(value);
  if (items.length > MAX_ITEMS) items.pop();
  localStorage.setItem(key, JSON.stringify(items));
};

export const deleteRecentSearch = (value, moduleType) => {
  if (typeof window === "undefined") return;
  const cmodule = moduleType ?? getCurrentModuleType();
  const key = getKey(cmodule);
  const items = getRecentSearches(cmodule).filter((v) => v !== value);
  localStorage.setItem(key, JSON.stringify(items));
};

export const clearRecentSearches = (moduleType) => {
  if (typeof window === "undefined") return;
  const cmodule = moduleType ?? getCurrentModuleType();
  localStorage.removeItem(getKey(cmodule));
};
