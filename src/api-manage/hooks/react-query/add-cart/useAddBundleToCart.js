import MainApi from "../../../MainApi";
import { bundle_cart_add_api } from "../../../ApiRoutes";
import { getApiContent } from "../../../getApiContent";
import { useMutation, useQueryClient } from "react-query";

// POST /customer/cart/bundle/add — body: { bundle_id, quantity, guest_id }.
// Response content: { bundle_group_id, quantity, store_id, data: [...], pagination }.
const addData = async (postData) => {
  const { data } = await MainApi.post(bundle_cart_add_api, postData);
  return getApiContent(data);
};

export default function useAddBundleToCart() {
  const queryClient = useQueryClient();
  return useMutation("add-bundle-cart", addData, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart-groups");
      queryClient.invalidateQueries("cart-itemss");
      queryClient.invalidateQueries("cart-discount-eligibility");
    },
  });
}
