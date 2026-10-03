import MainApi from "../../../MainApi";
import { bundle_cart_remove_api } from "../../../ApiRoutes";
import { getApiContent } from "../../../getApiContent";
import { useMutation, useQueryClient } from "react-query";

// DELETE /customer/cart/bundle/remove — body: { bundle_group_id, guest_id }.
// Removes every row in the group.
const removeData = async (postData) => {
  const { data } = await MainApi.delete(bundle_cart_remove_api, {
    data: postData,
  });
  return getApiContent(data);
};

export default function useRemoveBundleFromCart() {
  const queryClient = useQueryClient();
  return useMutation("remove-bundle-cart", removeData, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart-groups");
      queryClient.invalidateQueries("cart-itemss");
      queryClient.invalidateQueries("cart-discount-eligibility");
    },
  });
}
