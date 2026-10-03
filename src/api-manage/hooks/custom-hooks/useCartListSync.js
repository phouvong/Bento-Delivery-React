import { useDispatch, useSelector } from "react-redux";
import { setCartList, setStoreCartList } from "redux/slices/cart";

const useCartListSync = () => {
  const dispatch = useDispatch();
  const { cartList, storeCartList } = useSelector((s) => s.cart);

  const withoutGroup = (list, groupId) =>
    (list || []).filter((c) => c?.bundle_details?.bundle_group_id !== groupId);

  const mergeBundleRow = (row) => {
    if (!row) return;
    const groupId = row?.bundle_details?.bundle_group_id;
    dispatch(setCartList([...withoutGroup(cartList, groupId), row]));
    dispatch(setStoreCartList([...withoutGroup(storeCartList, groupId), row]));
  };

  const removeBundleRow = (groupId) => {
    dispatch(setCartList(withoutGroup(cartList, groupId)));
    dispatch(setStoreCartList(withoutGroup(storeCartList, groupId)));
  };

  const withoutBogoGroup = (list, groupId) =>
    (list || []).filter((c) => c?.bogo_details?.bogo_group_id !== groupId);

  const mergeBogoRow = (row) => {
    if (!row) return;
    const groupId = row?.bogo_details?.bogo_group_id;
    dispatch(setCartList([...withoutBogoGroup(cartList, groupId), row]));
    dispatch(setStoreCartList([...withoutBogoGroup(storeCartList, groupId), row]));
  };

  const removeBogoRow = (groupId) => {
    dispatch(setCartList(withoutBogoGroup(cartList, groupId)));
    dispatch(setStoreCartList(withoutBogoGroup(storeCartList, groupId)));
  };

  return { mergeBundleRow, removeBundleRow, mergeBogoRow, removeBogoRow };
};

export default useCartListSync;
