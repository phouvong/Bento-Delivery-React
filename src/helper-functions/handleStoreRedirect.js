import { getCurrentModuleType } from "./getCurrentModuleType";

export const getStoreRedirectURL = (item, moduleId, query) => {
    const currentModuleType = getCurrentModuleType();
    const basePath =
        currentModuleType === "rental"
            ? `/rental/provider/${item?.slug || item?.id}`
            : `/store/${item?.slug || item?.id}`;
    const hasModuleInQuery = Boolean(query?.module || query?.module_id);
    return hasModuleInQuery ? basePath : `${basePath}?module=${currentModuleType}`;
};

export const handleStoreRedirect = (item, router, moduleId) => {
    const currentModuleType = getCurrentModuleType();
    const hasModuleInQuery = Boolean(router?.query?.module);
    const nextQuery = hasModuleInQuery
        ? router.query
        : { ...(router?.query || {}), module: currentModuleType };

    router.push({
        pathname: getStoreRedirectURL(item, moduleId, router?.query),
        query: nextQuery,
    });
};
