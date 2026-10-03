import MainApi from "../../../MainApi";
import { bogo_cart_remove_api } from "../../../ApiRoutes";
import { getApiContent } from "../../../getApiContent";
import { useMutation, useQueryClient } from "react-query";

// DELETE /customer/cart/bogo/remove — body: { bogo_group_id, guest_id }.
// Removes the whole group; individual members are never removable — see
// the BOGO API guide §6.4.
const removeData = async (postData) => {
  const { data } = await MainApi.delete(bogo_cart_remove_api, {
    data: postData,
  });
  return getApiContent(data);
};

export default function useRemoveBogoFromCart() {
  const queryClient = useQueryClient();
  return useMutation("remove-bogo-cart", removeData, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart-groups");
      queryClient.invalidateQueries("cart-itemss");
      queryClient.invalidateQueries("cart-discount-eligibility");
    },
  });
}
