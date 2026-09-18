import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import MainApi from "../../../MainApi";
import { cart_get_all } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getGuestId, getToken } from "helper-functions/getToken";
import { setCartGroups, setCartList } from "redux/slices/cart";
import {
  normalizeCartGroups,
  flattenNormalizedGroups,
} from "helper-functions/normalizeCartGroups";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const fetchGroupedCart = async () => {
  const token = getToken();
  const guestId = getGuestId();
  const params = !token && guestId ? `?guest_id=${guestId}` : "";
  const { data } = await MainApi.get(`${cart_get_all}${params}`);
  return data;
};

const getModuleId = () => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem("module"))?.id ?? null;
  } catch {
    return null;
  }
};

export default function useGetGroupedCart(options = {}) {
  const dispatch = useDispatch();
  const token = getToken();
  const guestId = getGuestId();
  const moduleId = getModuleId();
  const currentModuleType = getCurrentModuleType();

  return useQuery(["cart-groups", moduleId], fetchGroupedCart, {
    enabled: Boolean((token || guestId) && moduleId),
    refetchOnWindowFocus: false,
    onError: onSingleErrorResponse,
    onSuccess: (data) => {
      const raw = Array.isArray(data) ? data : data?.data ?? [];
      const groups = normalizeCartGroups(raw);
      dispatch(setCartGroups(groups));
      dispatch(setCartList(flattenNormalizedGroups(groups, currentModuleType)));
      options?.onSuccess?.(groups);
    },
    ...options,
  });
}
