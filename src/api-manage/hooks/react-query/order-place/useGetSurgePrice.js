import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { surge_price } from "api-manage/ApiRoutes";
import moment from "moment";

import { getApiContent } from "api-manage/getApiContent";

// Mutation payloads (tax, surge price, order id, redirect_link) live in
// `content` while `message` stays on the envelope and some handlers toast it.
// Expose both, payload winning. Only success responses reach here — axios
// rejects on failure, so error.response.data.message is untouched.
const unwrapPayload = (envelope) => {
  const content = getApiContent(envelope);
  const isObject =
    !!content && typeof content === "object" && !Array.isArray(content);
  return isObject ? { message: envelope?.message, ...content } : content;
};


const getSurge = async (orderData) => {
  const tempData = {
    ...orderData,
    date_time: moment().format("YYYY-MM-DD HH:mm:ss"),
  };

  const { data } = await MainApi.post(`${surge_price}`, tempData);
  return unwrapPayload(data);
};

export const useGetSurgePrice = () => {
  return useMutation("get-surge", getSurge);
};
