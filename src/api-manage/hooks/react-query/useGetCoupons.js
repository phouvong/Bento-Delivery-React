import MainApi from "../../MainApi";
import { useQuery } from "react-query";
import { coupon_list_api } from "../../ApiRoutes";
import {getToken} from "helper-functions/getToken";

const getData = async () => {
  if(getToken()){
    const { data } = await MainApi.get(coupon_list_api);
    return data;
  }

};

export default function useGetCoupons() {
  return useQuery("coupons-list", getData, {
    enabled: false,
  });
}
