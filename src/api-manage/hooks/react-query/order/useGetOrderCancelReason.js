import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

export const getData = async (type,isPickup) => {

  
  if(type==="parcel"){
    const cancellationType = isPickup==="pending"?"before_pickup":"after_pickup";
    const { data } = await MainApi.get(
      `api/v1/get-parcel-cancellation-reasons?offset=1&limit=10&user_type=customer&cancellation_type=${cancellationType}`
    );
    return data;
  }else{
    const { data } = await MainApi.get(
      "api/v1/customer/order/cancellation-reasons?offset=1&limit=10&type=customer"
    );
    return data;
  }
};
export const useGetOrderCancelReason = (type,isPickup) => {
  return useQuery("cancel-reasons", () => getData(type,isPickup), {
    enabled: false,
    //onSuccess: onSuccessHandler,
    onError: onSingleErrorResponse,
  });
};
