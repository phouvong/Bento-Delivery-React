import MainApi from "../../../MainApi";
import { bogo_cart_add_api } from "../../../ApiRoutes";
import { getApiContent } from "../../../getApiContent";
import { useMutation, useQueryClient } from "react-query";

// POST /customer/cart/bogo/add — body: { bundle_id, quantity, guest_id }.
// `quantity` is the number of whole bundles; every buy/free member is
// multiplied by it. Response content: { bogo_group_id, quantity, store_id,
// data: [...], pagination } — see the BOGO API guide §6.1.
const addData = async (postData) => {
  const { data } = await MainApi.post(bogo_cart_add_api, postData);
  return getApiContent(data);
};

export default function useAddBogoToCart() {
  const queryClient = useQueryClient();
  return useMutation("add-bogo-cart", addData, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart-groups");
      queryClient.invalidateQueries("cart-itemss");
      queryClient.invalidateQueries("cart-discount-eligibility");
    },
  });
}
