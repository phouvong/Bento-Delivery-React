import { getAmountWithSign, getDiscountedAmount } from "helper-functions/CardHelpers";
import { getLowestVariation } from "../service-details/helperFunction";

// Service cards price off the lowest-priced variation's own discount when
// the service has variations, instead of the base service discount — kept
// separate from NewProductCard's generic price calc so other modules are
// untouched.
export const getServiceCardPricing = (item) => {
  const lowestVariation = getLowestVariation(item);
  const basePrice = lowestVariation
    ? lowestVariation.price ?? 0
    : item?.base_price ?? item?.price ?? 0;
  const discount = lowestVariation ? lowestVariation.discount : item?.discount;
  const discountType = lowestVariation
    ? lowestVariation.discount_type
    : item?.discount_type;

  const displayPrice = getDiscountedAmount(basePrice, discount, discountType);
  const discountText =
    discount > 0
      ? discountType === "percent"
        ? `-${discount}%`
        : `-${getAmountWithSign(discount)}`
      : null;

  return { displayPrice, originalPrice: basePrice, discountText };
};
