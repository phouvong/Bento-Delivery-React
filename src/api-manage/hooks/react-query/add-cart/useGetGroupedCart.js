import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import MainApi from "../../../MainApi";
import { cart_get_all } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getGuestId, getToken } from "helper-functions/getToken";
import { setCartGroups, setCartList } from "redux/slices/cart";

const fetchGroupedCart = async () => {
  const token = getToken();
  const guestId = getGuestId();
  const params = !token && guestId ? `?guest_id=${guestId}` : "";
  const { data } = await MainApi.get(`${cart_get_all}${params}`);
  return data;
};

// Flatten server-grouped cart payload into the same row shape the local
// cartList uses elsewhere in the app (id = product id, cartItemId = server
// cart-row id, totalPrice, quantity, module_type, store_id, ...). This
// keeps existing cartList-driven UI (badges, counters, module filters)
// working now that cart/list is only called on the store-details page.
const flattenGroupsToCartList = (groups = []) => {
  if (!Array.isArray(groups)) return [];
  return groups.flatMap((g) => {
    const carts = Array.isArray(g?.carts)
      ? g.carts
      : Array.isArray(g?.items)
      ? g.items
      : [];
    const storeId = g?.store?.id ?? g?.restaurant?.id;
    return carts.map((row) => {
      const product = row?.item ?? {};
      const quantity = row?.quantity ?? 1;
      const totalPrice = row?.price ?? (product?.price ?? 0) * quantity;
      return {
        ...product,
        cartItemId: row?.id,
        quantity,
        totalPrice,
        itemBasePrice: product?.price,
        selectedAddons: product?.addons,
        food_variations: product?.food_variations,
        selectedOption: row?.variation,
        store_id: row?.store_id ?? product?.store_id ?? storeId,
        module_type: row?.module_type ?? product?.module_type,
      };
    });
  });
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

  return useQuery(["cart-groups", moduleId], fetchGroupedCart, {
    // Skip until a module is selected — MainApi sends `moduleId` as a
    // header, and the backend scopes the cart to it. Without it the call
    // either 4xxs or returns the wrong module's cart.
    enabled: Boolean((token || guestId) && moduleId),
    refetchOnWindowFocus: false,
    onError: onSingleErrorResponse,
    onSuccess: (data) => {
      const groups = Array.isArray(data) ? data : data?.data ?? [];
      dispatch(setCartGroups(groups));
      dispatch(setCartList(flattenGroupsToCartList(groups)));
      options?.onSuccess?.(groups);
    },
    ...options,
  });
}
