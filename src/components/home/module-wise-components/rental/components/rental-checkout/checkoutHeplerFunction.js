import { store } from "redux/store";
import {
  getCouponDiscount,
  getProductDiscount,
  handlePurchasedAmount,
} from "utils/CustomFunctions";

export const calculateTotalDiscount = (cartList, tripCost) => {
  if (!cartList?.carts?.length) return 0;

  return cartList.carts.reduce((totalDiscount, item) => {
    const rentalType = cartList?.user_data?.rental_type;

    const itemPrice =
      rentalType === "hourly"
        ? item?.vehicle?.hourly_price
        : rentalType === "day_wise"
        ? item?.vehicle?.day_wise_price
        : item?.vehicle?.distance_price;

    const itemType =
      rentalType === "hourly"
        ? cartList?.user_data?.estimated_hours || 0
        : rentalType === "day_wise"
        ? cartList?.user_data?.estimated_hours / 24 || 0
        : cartList?.user_data?.distance || 0;

    const { vehicle, provider, quantity } = item || {};
    const { discount_type, discount_price } = vehicle || {};
    const providerDiscount = provider?.discount || {};

    let discount = 0;
    if (discount_price > 0) {
      if (discount_type === "percent") {
        discount = ((itemPrice * discount_price) / 100) * itemType;
      } else {
        discount = discount_price;
      }
    }

    discount *= quantity || 1;

    return totalDiscount + discount;
  }, 0);
};

export const calculateProviderWiseDiscount = (cartList, tripCost) => {
  if (!cartList?.carts?.length) return 0; // Return 0 if there are no carts

  return cartList.carts.reduce((totalDiscount, item) => {
    const rentalType = cartList?.user_data?.rental_type;
    const itemPrice =
      rentalType === "hourly"
        ? item?.vehicle?.hourly_price
        : item?.vehicle?.distance_price;

    const itemType =
      rentalType === "hourly"
        ? cartList?.user_data?.estimated_hours || 0
        : cartList?.user_data?.distance || 0;

    const { vehicle, provider, quantity } = item || {};
    const providerDiscount = provider?.discount || {};
    let discount = 0;
    // Only calculate provider discount if it exists and tripCost meets minimum
    if (Number.parseInt(providerDiscount.discount)) {
      if (!tripCost || providerDiscount.min_purchase <= tripCost) {
        // Apply provider's percentage discount
        discount = ((providerDiscount.discount * itemPrice) / 100) * itemType;
      }
    }

    // Apply quantity multiplier
    discount = discount * (quantity || 1);

    // Add to total, respecting provider's max discount if set
    const newTotalDiscount = totalDiscount + discount;
    return providerDiscount.max_discount
      ? Math.min(newTotalDiscount, providerDiscount.max_discount)
      : newTotalDiscount;
  }, 0);
};

export const getTotalAmount = (cartList) => {
  if (!cartList || !Array.isArray(cartList.carts)) {
    return 0;
  }

  const { rental_type, estimated_hours, estimated_days, distance } =
    cartList?.user_data || {};
  const tripCost = cartList.carts.reduce((totalCost, item) => {
    let vehicleCost = 0;
    let multiplier = 0;

    if (rental_type === "hourly") {
      vehicleCost = item?.vehicle?.hourly_price || 0;
      multiplier = estimated_hours || 1;
    } else if (rental_type === "day_wise") {
      vehicleCost = item?.vehicle?.day_wise_price || 0;
      multiplier = estimated_hours / 24 || 1;
    } else {
      // default: distance-based
      vehicleCost = item?.vehicle?.distance_price || 0;
      multiplier = distance || 0;
    }

    const quantity = item?.quantity || 0;
    return totalCost + vehicleCost * quantity * multiplier;
  }, 0);

  return tripCost;
};

// export const rentalCouponDiscount = (couponDiscount) => {
//   return 30;
// };
export const rentalCouponDiscount = (couponDiscount, storeData, cartList) => {
  if (couponDiscount) {
    let purchasedAmount = getTotalAmount(cartList);
    if (purchasedAmount >= couponDiscount.min_purchase) {
      switch (couponDiscount.coupon_type) {
        case "zone_wise":
          let zoneId = JSON.parse(localStorage.getItem("zoneid"));
          if (couponDiscount && couponDiscount.discount_type === "amount") {
            if (couponDiscount.max_discount === 0) {
              return couponDiscount.discount;
            } else {
              return couponDiscount.discount;
            }
          } else {
            let percentageWiseDis =
              (purchasedAmount - calculateTotalDiscount(cartList, storeData)) *
              (couponDiscount.discount / 100);
            if (couponDiscount.max_discount === 0) {
              return percentageWiseDis;
            } else {
              if (percentageWiseDis >= couponDiscount.max_discount) {
                return couponDiscount.max_discount;
              } else {
                return percentageWiseDis;
              }
            }
          }
          break;
        case "store_wise":
          let storeId = JSON.parse(couponDiscount.data);
          if (Number.parseInt(storeId[0]) === storeData?.id) {
            if (couponDiscount && couponDiscount.discount_type === "amount") {
              if (couponDiscount.max_discount === 0) {
                return couponDiscount.discount;
              } else {
              }
            } else {
              let percentageWiseDis =
                (purchasedAmount -
                  calculateTotalDiscount(cartList, storeData)) *
                (couponDiscount.discount / 100);
              if (couponDiscount.max_discount === 0) {
                return percentageWiseDis;
              } else {
                if (percentageWiseDis >= couponDiscount.max_discount) {
                  return couponDiscount.max_discount;
                } else {
                  return percentageWiseDis;
                }
              }
            }
          } else {
            return 0;
          }
          break;
        case "pro_customer":
        case "default":
          if (couponDiscount && couponDiscount.discount_type === "amount") {
            if (couponDiscount.max_discount === 0) {
              return couponDiscount.discount;
            } else {
              return couponDiscount.discount;
            }
          } else if ("percent") {
            let percentageWiseDis =
              (purchasedAmount - calculateTotalDiscount(cartList, storeData)) *
              (couponDiscount.discount / 100);
            if (couponDiscount.max_discount === 0) {
              return percentageWiseDis;
            } else {
              if (percentageWiseDis >= couponDiscount.max_discount) {
                return couponDiscount.max_discount;
              } else {
                return percentageWiseDis;
              }
            }
          }
      }
    } else {
      return 0;
    }
  }
};
export const getRentalSubTotalPrice = (
  cartList,
  rentalCoupon,
  tripCost,
  tripDiscount
) => {
  return tripCost - tripDiscount - rentalCoupon;
};
export const getVat = (items, storeData, referDiscount, rentalCoupon) => {
  let tax = storeData?.tax || 0;

  let total =
    getTotalAmount(items) -
    calculateTotalDiscount(items, storeData) -
    (rentalCoupon || 0) -
    (referDiscount ? referDiscount : 0);

  if (store?.getState?.()?.configData?.configData?.tax_included === 1) {
    return (total * tax) / (100 + tax);
  } else {
    return (total * tax) / 100;
  }
};
export const getTotalPrice = (
  cartList,
  isIncluded,
  rentalCoupon,
  additional_charge,
  tripCost,
  tripDiscount
) => {
  return (
    getRentalSubTotalPrice(cartList, rentalCoupon, tripCost, tripDiscount) +
    isIncluded +
    additional_charge
  );
};

export const cartItemPrice = (item, rental_type, estimated_hours, distance) => {
  const vehicleCost =
    rental_type === "hourly"
      ? item?.vehicle?.hourly_price
      : rental_type === "day_wise"
      ? item?.vehicle?.day_wise_price
      : item?.vehicle?.distance_price;

  const quantity = item?.quantity || 0;

  const multiplier =
    rental_type === "hourly"
      ? estimated_hours || 1
      : rental_type === "day_wise"
      ? estimated_hours / 24 || 1
      : distance || 0;

  return vehicleCost * quantity * multiplier;
};

export const cartItemDiscount = (
  item,
  rental_type,
  estimated_hours,
  distance,
  estimated_days
) => {
  let itemPrice =
    rental_type === "hourly"
      ? item?.vehicle?.hourly_price
      : rental_type === "day_wise"
      ? item?.vehicle?.day_wise_price
      : item?.vehicle?.distance_price;

  let itemType =
    rental_type === "hourly"
      ? estimated_hours
      : rental_type === "day_wise"
      ? estimated_hours / 24
      : distance;

  const { vehicle } = item;
  const { discount_type, discount_price } = vehicle;
  let discount = 0;

  if (discount_price > 0) {
    if (discount_type === "amount") {
      discount = discount_price * (item?.quantity || 1);
    } else if (discount_type === "percent") {
      discount =
        ((itemPrice * discount_price) / 100) * itemType * (item?.quantity || 1);
    }
  }
  return discount;
};

export const isCurrentTime = (cartList) => {
  if (cartList?.user_data?.pickup_time) {
    const pickupTime = new Date(cartList.user_data.pickup_time).getTime();
    const currentTime = new Date().getTime();
    return pickupTime > currentTime;
  }
};
