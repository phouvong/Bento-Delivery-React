import { useMutation } from "react-query";
import { store_business_plan } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

const postData = async (businessData) => {
  const { data: responseData } = await MainApi.post(
    `${store_business_plan}`,
    businessData
  );
  return responseData;
};

export const usePostBusiness = () => {
  return useMutation("store-business", postData);
};
