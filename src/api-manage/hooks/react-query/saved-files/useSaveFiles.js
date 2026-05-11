import { useMutation } from "react-query";
import { saved_files_store_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

const saveFilesData = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("saved_images[]", file);
  });
  const { data } = await MainApi.post(saved_files_store_api, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const useSaveFiles = () => {
  return useMutation("save_files", saveFilesData);
};
