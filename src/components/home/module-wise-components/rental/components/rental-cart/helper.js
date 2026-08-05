import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { setCartList } from "redux/slices/cart";
import { getGuestId, getToken } from "helper-functions/getToken";
import cookie from "js-cookie";
import { formattedDate } from "../global/search/searchHepler";

export const updateCart = (
  cartItem,
  userData,
  dispatch,
  setCartList,
  updateQuantity,
  updateMutate
) => {
  const itemObject = {
    cart_id: cartItem?.itemId,
    quantity: updateQuantity,
    pickup_location: userData?.pickup_location,
    destination_location: userData?.destination_location,
    pickup_time: formattedDate(userData?.pickup_time),
    rental_type: userData?.rental_type,
    estimated_hours: userData?.estimated_hours,
    guest_id: getToken() ? null : getGuestId(),
  };
  updateMutate(itemObject, {
    onSuccess: (res) => {
      dispatch(setCartList(res));
    },
    onError: onErrorResponse,
  });
};
export const removeItemFromCart = (cartItem, mutate, dispatch, setCartList) => {
  mutate(cartItem?.itemId, {
    onSuccess: (res) => {
      dispatch(setCartList(res));
      // Keep the `cart-list` cookie in sync with the real length (including 0)
      // so the middleware guarding /rental/cart redirects when it empties.
      // Removing the cookie made a *known-empty* cart look *unknown*, so the
      // guard treated it like a first visit and never fired.
      cookie.set("cart-list", `${res?.carts?.length ?? 0}`);
    },
    onError: onErrorResponse,
  });
};
