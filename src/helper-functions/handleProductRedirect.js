import { getModuleId } from "./getModuleId";

export const getProductRedirectURL = (item, productType, currentModule) => {
  const moduleId = currentModule ?? getModuleId();
  return {
    pathname: `/product/${item?.slug ? item?.slug : item?.id}`,
    query: {
      ...(moduleId && { module: moduleId }),
      ...(productType === "campaign" && { campaign: 1 }),
    },
  };
};

export const handleProductRedirect = (item, router, productType) => {
  const currentModule = router?.query?.module;
  router
    .push(getProductRedirectURL(item, productType, currentModule), undefined, {
      shallow: false,
    })
    .then(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
};
