import MainApi from "../MainApi";
import { getToken } from "helper-functions/getToken";
import { getApiContent } from "../getApiContent";

// Callers read payload fields straight off the axios response — e.g.
// `response.data.order_id` after placing an order — and some also read
// `response.data.message` for the success toast. v4.2 moved the payload into
// `content` while leaving `message` on the envelope, so expose both: the
// envelope message first, then the payload spread over it so real fields win.
// Only success responses pass through here; axios rejects on failure, so
// `error.response.data.message` in the error handlers is unaffected.
const unwrap = (request) =>
  request.then((response) => {
    const content = getApiContent(response?.data);
    const isObject =
      !!content && typeof content === "object" && !Array.isArray(content);
    return {
      ...response,
      data: isObject
        ? { message: response?.data?.message, ...content }
        : content,
    };
  });

export const OrderApi = {
  placeOrder: (formData) => {
    return unwrap(MainApi.post("/api/v1/customer/order/place", formData));
  },
  prescriptionPlaceOrder: (orderData) => {
    const {
      store_id,
      distance,
      address,
      longitude,
      latitude,
      prescriptionImages,
      order_note,
      guest_id,
      contact_person_name,
      contact_person_number,
      dm_tips,
      order_type,
      payment_method,
    } = orderData;
    let formData = new FormData();
    formData.append("store_id", store_id);
    formData.append("distance", distance);
    formData.append("address", address);
    formData.append("longitude", longitude);
    formData.append("latitude", latitude);

    // prescriptionImages.forEach((image) => {
    //   formData.append("order_attachment[]", image);
    // });
    const filterBinaryImages = prescriptionImages.filter((img) => !img.name);
    const filterUrlImages = prescriptionImages.filter((img) => img.name);

    filterBinaryImages?.length &&
      filterBinaryImages.forEach((image) => {
        formData.append("order_attachment[]", image?.file);
      });
    filterUrlImages?.length &&
      filterUrlImages.forEach((image) => {
        formData.append("saved_images[]", image?.name);
      });

    formData.append("order_note", order_note);
    formData.append("guest_id", guest_id);

    if (!getToken()) {
      formData.append("contact_person_number", contact_person_number);
      formData.append("contact_person_name", contact_person_name);
    }

    formData.append("dm_tips", dm_tips);
    formData.append("order_type", order_type);
    formData.append("payment_method", payment_method);
    return unwrap(MainApi.post("/api/v1/customer/order/prescription/place", formData));
  },
  orderHistory: (orderType, limit, offset) => {
    return unwrap(MainApi.get(
      `/api/v1/customer/order/${orderType}?limit=${limit}&offset=${offset}`,
    ));
  },
  orderDetails: (order_id) => {
    return unwrap(MainApi.get(`/api/v1/customer/order/details?order_id=${order_id}`));
  },
  orderTracking: (order_id) => {
    return unwrap(MainApi.get(`/api/v1/customer/order/track?order_id=${order_id}`));
  },
  CancelOrder: (formData) => {
    return unwrap(MainApi.post("/api/v1/customer/order/cancel", formData));
  },
  FailedPaymentMethodUpdate: (formData) => {
    return unwrap(MainApi.post("/api/v1/customer/order/payment-method", formData));
  },
  FailedPaymentMethodCancel: (formData) => {
    return unwrap(MainApi.post("/api/v1/customer/order/cancel", formData));
  },
};
