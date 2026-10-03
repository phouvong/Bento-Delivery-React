import { useMutation } from "react-query";
import { store_business_plan } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { getApiContent } from "../../../getApiContent";

const postData = async (businessData) => {
  const { data: responseData } = await MainApi.post(
    `${store_business_plan}`,
    businessData
  );
  // `redirect_link`/`insufficient_balance`/etc. live under `content` — the
  // caller reads them off the resolved value directly.
  return getApiContent(responseData);
};

export const usePostBusiness = () => {
  return useMutation("store-business", postData);
};
