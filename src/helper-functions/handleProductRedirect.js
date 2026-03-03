import { getModuleId } from "./getModuleId";

export const getProductRedirectURL = (item, productType) => {
    return {
        pathname: `/product/${item?.slug ? item?.slug : item?.id}`,
        query: {
            //id: `${item?.slug ? item?.slug : item?.id}`,
            //module: `${getModuleId()}`,
            ...(productType === "campaign" && { campaign: 1 }),
        },
    };
};

export const handleProductRedirect = (item, router, productType) => {
    console.log({item});
    
    router.push(getProductRedirectURL(item, productType), undefined, { shallow: false }).then(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
};
