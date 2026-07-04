import MainApi from "../../../MainApi";
import { item_add_to_cart } from "../../../ApiRoutes";
import { useMutation, useQueryClient } from "react-query";

const addData = async ({ postData, store_id }) => {
  const url = store_id
    ? `${item_add_to_cart}?store_id=${store_id}`
    : item_add_to_cart;
  const { data } = await MainApi.post(url, postData);
  return data;
};

export default function useAddCartItem() {
  const queryClient = useQueryClient();
  return useMutation("add-cart-item", addData, {
    onSuccess: () => {
      queryClient.invalidateQueries("cart-groups");
      queryClient.invalidateQueries("cart-itemss");
    },
  });
}
