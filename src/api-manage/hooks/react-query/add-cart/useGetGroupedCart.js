import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import MainApi from "../../../MainApi";
import { cart_get_all } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiList } from "../../../getApiContent";
import { getGuestId, getToken } from "helper-functions/getToken";
import { setCartGroups, setCartList } from "redux/slices/cart";
import {
  normalizeCartGroups,
  flattenNormalizedGroups,
} from "helper-functions/normalizeCartGroups";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";

const fetchGroupedCart = async () => {
  const guestId = getGuestId();
  // This endpoint is `customer_or_guest`: with neither a bearer token nor a
  // guest_id it answers 401, and a guest cart is only addressable by its id.
  // Send guest_id whenever we hold one — the backend prefers the token when
  // both are present, and every other cart call in the app does the same.
  const params = guestId ? `?guest_id=${guestId}` : "";
  const { data } = await MainApi.get(`${cart_get_all}${params}`);
  // v4.2 wraps the group array in the standard envelope.
  return getApiList(data) ?? [];
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

  return useQuery(["cart-groups", moduleId, token ?? null, guestId ?? null], fetchGroupedCart, {
    enabled: Boolean((token || guestId) && moduleId),
    refetchOnWindowFocus: false,
    onError: onSingleErrorResponse,
    onSuccess: (data) => {
      const raw = Array.isArray(data) ? data : data?.data ?? [];
      const groups = normalizeCartGroups(raw);
      dispatch(setCartGroups(groups));
      // `cartList` is a shared slot: rental stores its cart there as
      // `{ carts, user_data }` while this flattens the mart cart into an array.
      // `cart/get-all` answers `[]` under the rental module, so dispatching
      // regardless raced the rental booking list and wiped it out from under
      // /rental/cart and /rental/checkout — the vehicle list and trip details
      // then rendered empty. Re-read the module here: it can change in flight.
      const moduleTypeNow = getCurrentModuleType();
      if (moduleTypeNow !== ModuleTypes.RENTAL) {
        dispatch(setCartList(flattenNormalizedGroups(groups, moduleTypeNow)));
      }
      options?.onSuccess?.(groups);
    },
    ...options,
  });
}
