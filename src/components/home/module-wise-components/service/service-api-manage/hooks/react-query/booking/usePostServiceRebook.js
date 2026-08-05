import { useMutation, useQueryClient } from "react-query";
import MainApi from "api-manage/MainApi";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getGuestId, getToken } from "helper-functions/getToken";
import { service_booking_rebook_api } from "components/home/module-wise-components/service/service-api-manage/ApiRoutes";
import toast from "react-hot-toast";
import { t } from "i18next";

// Maps rebook unavailable-item codes to user-facing messages.
const UNAVAILABLE_CODE_MESSAGES = {
  custom_service: "cannot be rebooked",
  service_unavailable: "is unavailable",
  variant_unavailable: "variant is no longer available",
};

const postRebook = async ({ booking_id }) => {
  const token = getToken();
  const guestId = getGuestId();
  const payload = {
    booking_id,
    ...(!token && guestId ? { guest_id: guestId } : {}),
  };
  const { data } = await MainApi.post(service_booking_rebook_api, payload);
  return data;
};

/**
 * Call after a successful or failed rebook mutation to show appropriate toasts.
 *
 * @param {object} apiResponse  - The resolved value (success) or the axios error (failure)
 * @param {boolean} isSuccess   - true = success path, false = error path
 */
export const rebookToastMessageHandler = (apiResponse, isSuccess = true) => {
  const showUnavailableToasts = (unavailableItems = []) => {
    unavailableItems.forEach((item) => {
      const msg = UNAVAILABLE_CODE_MESSAGES[item?.code];
      if (msg) toast.error(`${item?.service_name ?? item?.name} ${t(msg)}`);
    });
  };

  if (isSuccess) {
    const addedCount = apiResponse?.added_count ?? 0;
    const unavailableItems = apiResponse?.unavailable_items ?? [];

    if (addedCount > 0) {
      toast.success(apiResponse?.message ?? t("Services added to cart"));
    } else if (!unavailableItems.length) {
      toast.error(t("No service could be added to cart"));
    }

    showUnavailableToasts(unavailableItems);
  } else {
    // Error path — 403 may still carry unavailable_items
    const errorBody = apiResponse?.response?.data;
    const unavailableItems = errorBody?.unavailable_items ?? [];

    if (unavailableItems.length) {
      showUnavailableToasts(unavailableItems);
    } else {
      onErrorResponse(apiResponse);
    }
  }
};

const usePostServiceRebook = () => {
  const queryClient = useQueryClient();

  return useMutation(postRebook, {
    onSuccess: () => {
      // Refresh the service cart so the updated cart reflects the rebooked services
      queryClient.invalidateQueries("cart-groups");
      queryClient.invalidateQueries("cart-itemss");
    },
  });
};

export default usePostServiceRebook;
