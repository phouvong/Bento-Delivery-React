import { useMutation, useQueryClient } from "react-query";
import MainApi from "../../../MainApi";
import {
  reorder_api,
  rental_reorder_api,
  service_rebook_api,
} from "../../../ApiRoutes";
import { getCurrentModuleType } from "../../../../helper-functions/getCurrentModuleType";
import { getGuestId, getToken } from "../../../../helper-functions/getToken";
import toast from "react-hot-toast";
import { t } from "i18next";

const RENTAL_GET_CART_API = "/api/v1/rental/user/cart/get-cart";

const fetchRentalCart = async () => {
  const token = getToken();
  const guestId = getGuestId();
  const params = !token && guestId ? `?guest_id=${guestId}` : "";
  const { data } = await MainApi.get(`${RENTAL_GET_CART_API}${params}`);
  return data;
};

const postData = async (formData) => {
  const moduleType = getCurrentModuleType();
  const isRental = moduleType === "rental" && !formData?.noRentalModule;
  const isService = moduleType === "service" && !formData?.noServiceModule;
  const url = isRental
    ? rental_reorder_api
    : isService
    ? service_rebook_api
    : reorder_api;
  // Rental expects `trip_id`; service expects `booking_id`; others use `order_id`.

  // Rental endpoint expects `trip_id`; everything else uses `order_id`.
  const payload = isRental
    ? { trip_id: formData?.trip_id ?? formData?.order_id }
    : isService
    ? { booking_id: formData?.booking_id ?? formData?.order_id }
    : formData;
  const { data } = await MainApi.post(url, payload);
  return data;
};

export default function usePostReorder() {
  const queryClient = useQueryClient();
  return useMutation("reorder", postData, {
    onSuccess: async () => {
      const moduleType = getCurrentModuleType();
      if (moduleType === "rental") {
        // Explicitly hit /api/v1/rental/user/cart/get-cart so the rental cart
        // refreshes even when no booking-list consumer is mounted, and prime
        // the "booking-items" cache for any consumer that mounts later.
        try {
          const data = await fetchRentalCart();
          queryClient.setQueryData("booking-items", data);
        } catch {
          // Fall back to invalidation so a mounted consumer still refetches.
          queryClient.invalidateQueries("booking-items");
        }
      } else if (moduleType === "service") {
        queryClient.invalidateQueries("booking-items");
      } else {
        queryClient.invalidateQueries("cart-itemss");
        queryClient.invalidateQueries("cart-groups");
      }
    },
  });
}

export const reOrderToastMessageHandler = (apiResponse, isSuccess = true) => {
  const UNAVAILABLE_ITEM_MESSAGES = {
    item_unavailable: "is unavailable",
    out_of_stock: "is out of stock",
    vehicle_not_found: "is not available",
    store_unavailable: "is from a store that is currently unavailable",
  };
  const showUnavailableItemToasts = (unavailableItems) => {
    unavailableItems.forEach((item) => {
      const message = UNAVAILABLE_ITEM_MESSAGES[item?.code];
      if (message) toast.error(`${item?.name} ${t(message)}`);
    });
  };
  if (isSuccess) {
    const addedCount = apiResponse?.added_count || 0;
    const unavailableItems = apiResponse?.unavailable_items || [];

    if (addedCount < 1 && !unavailableItems?.length) {
      const isRental = getCurrentModuleType() === "rental";
      toast.error(
        t(isRental ? "Car is unavailable" : "Order items is unavailable")
      );
    }
    if (addedCount > 0) {
      toast.success(apiResponse?.message || t("Added to cart successfully"));
    }

    showUnavailableItemToasts(unavailableItems);
  } else {
    const error = apiResponse?.response?.data;
    const unavailableItems = error?.unavailable_items || [];
    if (!unavailableItems?.length) {
      return onErrorResponse(apiResponse);
    }

    showUnavailableItemToasts(unavailableItems);
  }
};
