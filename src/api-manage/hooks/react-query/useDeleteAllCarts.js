import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";

import { getGuestId } from "helper-functions/getToken";
import { removeAllCartItems } from "api-manage/ApiRoutes";

const addData = async (params) => {
  if(params?.vehicle_id){
    const { data } = await MainApi.delete(
      `${removeAllCartItems}?guest_id=${getGuestId()}&vehicle_id=${params?.vehicle_id}&quantity=${params?.quantity}&pickup_time=${params?.pickup_time}&rental_type=${params?.rental_type} `
    );
    return data;
  }else{
    const { data } = await MainApi.delete(
      `${removeAllCartItems}?guest_id=${getGuestId()}`
    );
      return data;
  }
};

export default function useDeleteAllCarts(params) { 
  return useMutation("delete_items_all", addData, params);
}
