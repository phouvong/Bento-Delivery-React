import { useQuery } from "react-query";
import MainApi from "../../MainApi";
import {
  data_limit,
  refund_policy_api,
  wallet_transactions_list_api,
} from "../../ApiRoutes";
import { getApiContent } from "../../getApiContent";

const getData = async (apiLink) => {
  const { data } = await MainApi.get(apiLink);
  return getApiContent(data);
};
export default function useGetPolicyPage(apiLink) {
  return useQuery("refund-policy", () => getData(apiLink), {
    // enabled: false,
    cacheTime: 100000,
    staleTime: 100000,
  });
}
