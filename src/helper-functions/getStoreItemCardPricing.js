import { getServiceCardPricing } from "components/home/module-wise-components/service/components/common/ServiceCardPricing";

// item.price/item.discount calc untouched.
export const getStoreItemCardPricing = (item) => {
  if (item?.module_type === "service") {
    const { displayPrice, originalPrice } = getServiceCardPricing(item);
    return {
      displayPrice,
      originalPrice,
      showStrike: originalPrice > displayPrice,
    };
  }

  const displayPrice =
    item?.discount > 0
      ? item.price -
        (item.discount_type === "percent"
          ? (item.price * item.discount) / 100
          : item.discount)
      : item?.price;

  return {
    displayPrice,
    originalPrice: item?.price,
    showStrike: item?.discount > 0 && item?.price > displayPrice,
  };
};
