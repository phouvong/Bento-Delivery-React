import MainApi from "api-manage/MainApi";

export const CouponApi = {
  applyCoupon: (code, store_id) =>
    MainApi.get(
      `/api/v1/rental/coupon/apply?code=${code}&provider_id=${store_id}`
    ),
};
