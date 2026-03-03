/**
 * Manages the module parameter persistence across routes
 */

/**
 * Get the module identifier (slug if available, otherwise id)
 * @param {Object} moduleItem - The module object
 * @returns {string} - The module slug or id
 */
export const getModuleIdentifier = (moduleItem) => {
  return moduleItem?.slug || moduleItem?.id;
};

/**
 * Save module ID to both localStorage and cookie
 * @param {string|number} moduleId - The module ID to save
 * @param {string} moduleSlug - The module slug (if available)
 */
export const saveModuleParam = (moduleId, moduleSlug = null) => {
  if (typeof window !== "undefined") {
    const identifier = moduleSlug || moduleId;
    
    // Save to localStorage
    localStorage.setItem("selectedModuleId", String(moduleId));
    localStorage.setItem("selectedModuleIdentifier", String(identifier));
    
    // Save to cookie (accessible by middleware)
    document.cookie = `selectedModule=${identifier}; path=/; max-age=31536000; samesite=lax`;
  }
};

/**
 * Get saved module ID from localStorage
 * @returns {string|null} - The saved module ID or null
 */
export const getSavedModuleParam = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selectedModuleId");
  }
  return null;
};

/**
 * Get saved module identifier (slug or id) from localStorage
 * @returns {string|null} - The saved module identifier or null
 */
export const getSavedModuleIdentifier = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selectedModuleIdentifier");
  }
  return null;
};

/**
 * Get module ID from current router query or saved value
 * @param {Object} router - Next.js router object
 * @returns {string|null} - The module ID
 */
export const getCurrentModuleParam = (router) => {
  // First check URL params
  const urlModule = router.query.module || router.query.module_id;
  if (urlModule) {
    // Save it for future use
    saveModuleParam(urlModule);
    return String(urlModule);
  }
  
  // Fall back to saved value
  return getSavedModuleIdentifier() || getSavedModuleParam();
};

/**
 * Ensure module parameter is in the URL
 * @param {Object} router - Next.js router object
 */
export const ensureModuleParamInUrl = (router) => {
  if (typeof window === "undefined") return;
  
  const currentModule = getCurrentModuleParam(router);
  
  if (currentModule && !router.query.module) {
    // Add module to current URL without full page reload
    const query = { ...router.query, module: currentModule };
    router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
  }
};
