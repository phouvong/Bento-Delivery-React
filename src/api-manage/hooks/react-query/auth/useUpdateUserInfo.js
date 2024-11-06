import MainApi from "api-manage/MainApi";
import { useMutation } from "react-query";

const postHandler = async (userData) => {
  const { data } = await MainApi.post("/api/v1/auth/update-info", userData);
  return data;
};
export const useUpdateUserInfo = () => {
  return useMutation("update_user", postHandler);
};
