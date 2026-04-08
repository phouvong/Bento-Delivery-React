const normalizeModuleValue = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const blockedModuleTypes = new Set(["ridershare", "rideshare"]);

export const isRiderShareModule = (moduleItem) => {
  if (!moduleItem) return false;

  if (typeof moduleItem === "string") {
    return blockedModuleTypes.has(normalizeModuleValue(moduleItem));
  }

  return ["module_type", "module_name", "slug", "name", "value"].some(
    (key) => blockedModuleTypes.has(normalizeModuleValue(moduleItem?.[key]))
  );
};

export const filterOutRiderShareModules = (modules = []) =>
  modules?.filter((moduleItem) => !isRiderShareModule(moduleItem)) || [];
