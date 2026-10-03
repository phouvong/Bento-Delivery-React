import MainApi from "../../../MainApi";
import { bogo_cart_update_api } from "../../../ApiRoutes";
import { getApiContent } from "../../../getApiContent";
import { useMutation, useQueryClient } from "react-query";

// POST /customer/cart/bogo/update — body: { bogo_group_id, quantity, guest_id }.
// The group is rewritten whole from the store's enrolment rather than
// edited line by line — see the BOGO API guide §6.3.
const updateData = async (postData) => {
  const { data } = await MainApi.post(bogo_cart_update_api, postData);
  return getApiContent(data);
};

export default function useUpdateBogoCart() {
  const queryClient = useQueryClient();
  return useMutation("update-bogo-cart", updateData, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart-groups");
      queryClient.invalidateQueries("cart-itemss");
      queryClient.invalidateQueries("cart-discount-eligibility");
    },
  });
}
