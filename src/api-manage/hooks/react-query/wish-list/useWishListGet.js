import { useQuery } from "react-query";
import { get_wish_list_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { getCurrentModuleId } from "helper-functions/getCurrentModuleType";

const getData = async (params = {}) => {
  const { search = "", sort_by, price_min, price_max, rating, type, quick_action } = params;

  const raw = { search, sort_by, price_min, price_max, rating, type, quick_action };
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(raw).filter(([, v]) => v !== undefined && v !== null && v !== ""),
    ),
  );

  const qs = query.toString();
  const { data } = await MainApi.get(`${get_wish_list_api}${qs ? `?${qs}` : ""}`);
  return data;
};

/**
 * params: query params { search, sort_by, price_min, price_max, rating, type }
 * enabled: whether to auto-run
 * onSuccess: optional callback (legacy Redux-fill callers)
 */
export const useWishListGet = (params = {}, enabled = false, onSuccess) => {
  const moduleId = typeof window !== "undefined" ? getCurrentModuleId() : null;
  return useQuery(["wishlist", moduleId, params], () => getData(params), {
    enabled,
    retry: false,
    onSuccess,
  });
};
