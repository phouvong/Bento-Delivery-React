import { getDiscountedAmount } from "helper-functions/CardHelpers";
import { ACTION } from "./states";

export const getLowestVariation = (productDetailsData) => {
  const variations = productDetailsData?.variations;
  if (!Array.isArray(variations) || variations.length === 0) return null;
  return variations.reduce((lowest, variation) =>
    (variation?.price ?? Infinity) < (lowest?.price ?? Infinity)
      ? variation
      : lowest,
  );
};

export const handleInitialTotalPriceVarPriceQuantitySet = (
  productDetailsData,
  dispatch,
  cartList,
  handleChoices
) => {
  if (!productDetailsData) return;

  const normalizedPrice = productDetailsData?.base_price ?? productDetailsData?.price;

  const cartItems = Array.isArray(cartList)
    ? cartList.filter((item) => item?.id === productDetailsData?.id)
    : [];

  if (cartItems.length > 0) {
    // Each cart item is a separate variant row from backend.
    // Build [[{ variation, quantity }, ...]] — the shape handleChoices produces.
    const selectedVariants = cartItems
      .filter((item) => item?.selectedOption != null)
      .map((item) => ({ variation: item.selectedOption, quantity: item.quantity ?? 1 }));

    const selectedOption = selectedVariants.length > 0 ? [selectedVariants] : [];

    // Each variation carries its own discount, independent of the service's
    // base discount, so sum each variation's own discounted price.
    const computedPrice = selectedVariants.reduce(
      (sum, { variation, quantity }) =>
        sum +
        getDiscountedAmount(
          variation?.price ?? 0,
          variation?.discount,
          variation?.discount_type,
        ) *
          (quantity ?? 1),
      0,
    );

    // For no-variation services selectedVariants is empty (backend variation is null).
    // Use the actual cart quantity and compute totalPrice from it.
    // For variation services quantity stays at 1 — each variant carries its own qty.
    const isNoVariation = selectedVariants.length === 0;
    const actualQty = isNoVariation ? (cartItems[0]?.quantity ?? 1) : 1;
    const actualTotalPrice = isNoVariation
      ? normalizedPrice * actualQty
      : (computedPrice || normalizedPrice);

    dispatch({
      type: ACTION.setModalData,
      payload: {
        ...productDetailsData,
        price: normalizedPrice,
        selectedOption,
        quantity: actualQty,
        totalPrice: actualTotalPrice,
        cartItemId: cartItems[0]?.cartItemId,
        // computedPrice already reflects each variation's own discount —
        // don't let the base service discount apply again downstream.
        ...(!isNoVariation && { discount: 0, discount_type: null }),
      },
    });
    return;
  }

  if (productDetailsData?.selectedOption?.length > 0) {
    dispatch({
      type: ACTION.setModalData,
      payload: {
        ...productDetailsData,
        price: normalizedPrice,
        quantity: productDetailsData?.quantity ?? 1,
        totalPrice: productDetailsData?.totalPrice ?? productDetailsData?.selectedOption[0]?.price,
      },
    });
  } else {
    // Before the user picks a variation, default the total to the cheapest
    // variation's own discounted price — matching the "Start From" preview.
    const lowestVariation = getLowestVariation(productDetailsData);
    const initialTotalPrice = lowestVariation
      ? getDiscountedAmount(
          lowestVariation.price ?? 0,
          lowestVariation.discount,
          lowestVariation.discount_type,
        )
      : productDetailsData?.totalPrice ?? normalizedPrice;

    dispatch({
      type: ACTION.setModalData,
      payload: {
        ...productDetailsData,
        price: normalizedPrice,
        selectedOption: [],
        quantity: productDetailsData?.quantity ?? 1,
        totalPrice: initialTotalPrice,
        // initialTotalPrice already reflects the lowest variation's own
        // discount — don't let the base service discount apply again.
        ...(lowestVariation && { discount: 0, discount_type: null }),
      },
    });
  }
};
export const handleValuesFromCartItems = (variationValues) => {
  let value = [];
  if (variationValues?.length > 0) {
    variationValues?.forEach((item) => {
      if (item?.isSelected) {
        value.push(item.label);
      }
    });
  } else if (variationValues?.length > 0) {
    value.push(variationValues[0].label);
  }
  return value;
};
export const getVariationsForCartData = (newVariation) => {
  return newVariation?.length > 0
    ? newVariation?.map((variation) => {
        return {
          name: variation.name,
          values: {
            label: handleValuesFromCartItems(variation.values),
          },
        };
      })
    : [];
};
export const getItemDataForAddToCart = (
  values,
  updateQuantity,
  mainPrice,
  guest_id
) => {
  return {
    guest_id: guest_id,
    cart_id: values?.cartItemId,
    store_id: values?.store_id ?? values?.store?.id,
    model: values?.available_date_starts ? "ItemCampaign" : "Item",
    add_on_ids:
      values?.add_ons?.length > 0
        ? values?.add_ons?.map((add) => {
            return add.id;
          })
        : [],
    add_on_qtys:
      values?.add_ons?.length > 0
        ? values?.add_ons?.map((add) => add.quantity)
        : [],
    item_id: values?.id,
    price: mainPrice,
    quantity: updateQuantity,
    variation:
      values?.selectedOption?.length > 0
        ? values?.selectedOption
        : [],
  };
};
export const getPriceAfterQuantityChange = (cart, Quantity) => {
  const mainPrice =
    (cart?.selectedOption?.length > 0
      ? cart?.selectedOption?.[0]?.price
      : cart?.price) * Quantity;
  return mainPrice;
};
export const isVariationAvailable = (productDetailsData) => {
  if (productDetailsData?.selectedOption?.length > 0) {
    if (productDetailsData?.selectedOption?.[0]?.stock === 0) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};

export const getAvailableStock = (productDetailsData) => {
  const selectedVariation = productDetailsData?.selectedOption?.[0];
  if (selectedVariation && typeof selectedVariation.stock === "number") {
    return selectedVariation.stock;
  }
  return productDetailsData?.stock ?? null;
};
