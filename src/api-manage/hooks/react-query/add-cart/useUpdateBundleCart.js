import MainApi from "../../../MainApi";
import { bundle_cart_update_api } from "../../../ApiRoutes";
import { getApiContent } from "../../../getApiContent";
import { useMutation, useQueryClient } from "react-query";

// POST /customer/cart/bundle/update — body: { bundle_group_id, quantity, guest_id }.
// Response content is the same shape as add — the rows are deleted and
// re-inserted in one transaction, so the group id survives.
const updateData = async (postData) => {
  const { data } = await MainApi.post(bundle_cart_update_api, postData);
  return getApiContent(data);
};

export default function useUpdateBundleCart() {
  const queryClient = useQueryClient();
  return useMutation("update-bundle-cart", updateData, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart-groups");
      queryClient.invalidateQueries("cart-itemss");
      queryClient.invalidateQueries("cart-discount-eligibility");
    },
  });
}
