import MainApi from "../MainApi";
import { getApiContent, getApiList } from "../getApiContent";

// Callers read `response.data`. v4.2 nests the payload under `content`:
// coupon/list is a paginated list, coupon/apply is a single discount object.
export const CouponApi = {
  couponList: () =>
    MainApi.get("/api/v1/coupon/list").then((r) => ({
      ...r,
      data: getApiList(r?.data) ?? [],
    })),
  applyCoupon: (code, store_id) =>
    MainApi.get(
      `/api/v1/coupon/apply?code=${code}&store_id=${store_id}`
    ).then((r) => ({ ...r, data: getApiContent(r?.data) })),
};
