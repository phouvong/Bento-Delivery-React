import MainApi from "../../MainApi";
import { useQuery } from "react-query";
import { coupon_list_api } from "../../ApiRoutes";
import {getToken} from "helper-functions/getToken";
import { getApiList } from "../../getApiContent";

const getData = async (moduleId) => {
  if(getToken()){
    const { data } = await MainApi.get(
      coupon_list_api,
      moduleId ? { headers: { moduleId } } : undefined,
    );
    return getApiList(data);
  }

};

export default function useGetCoupons(moduleId) {
  return useQuery(["coupons-list", moduleId], () => getData(moduleId), {
    enabled: false,
  });
}
