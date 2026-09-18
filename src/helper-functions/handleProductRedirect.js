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

export const handleServiceRedirect = (item, router, productType) => {
  const moduleId = router?.query?.module ?? getModuleId();
  // No scrollTo here — the service-details page itself scrolls to top on
  // mount, and resolving this promise early on a slow network would snap
  // the still-visible previous page to the top before navigation completes.
  router.push(
    {
      pathname: `/service/service-details/${
        item?.slug ? item?.slug : item?.id
      }`,
      query: {
        ...(moduleId && { module: moduleId }),
        ...(productType === "campaign" && { campaign: 1 }),
      },
    },
    undefined,
    { shallow: false },
  );
};
