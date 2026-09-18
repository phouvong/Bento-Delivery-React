export const checkoutInitialState = {
  additionalNotes: "",
  rental_coupon_code: "",
  couponDiscount: 0,
  schedule_at: 0,
  id: null,
  updateCartObject: null,

};

export const rentalCheckoutReducer = (state, action) => {
  switch (action.type) {
    case "setAdditionalNotes":
      return {
        ...state,
        additionalNotes: action.payload,
      };
    case "setRentalCouponCode":
      return {
        ...state,
        rental_coupon_code: action.payload,
      };
    case "setCouponDiscount":
      return {
        ...state,
        couponDiscount: action.payload,
      };
    case "setScheduleAt":
      return {
        ...state,
        couponDiscount: action.payload,
      };
    case "setId":
      return {
        ...state,
        id: action.payload,
      };
    case "setUpdateCartObject":
      return {
        ...state,
        updateCartObject: action.payload,
      };
    default:
      return state;
  }
};

export const ACTIONS = {
  setAdditionalNotes: "setAdditionalNotes",
  setRentalCouponCode: "setRentalCouponCode",
  setCouponDiscount: "setCouponDiscount",
  setScheduleAt: "setScheduleAt",
  setId: "setId",
  setUpdateCartObject: "setUpdateCartObject",
};
