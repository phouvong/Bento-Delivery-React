import { useMutation } from "react-query";
import { saved_files_store_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

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


const saveFilesData = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("saved_images[]", file);
  });
  const { data } = await MainApi.post(saved_files_store_api, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrapPayload(data);
};

export const useSaveFiles = () => {
  return useMutation("save_files", saveFilesData);
};
