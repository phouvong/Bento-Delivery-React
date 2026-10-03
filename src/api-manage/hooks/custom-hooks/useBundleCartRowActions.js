import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import useUpdateBundleCart from "../react-query/add-cart/useUpdateBundleCart";
import useRemoveBundleFromCart from "../react-query/add-cart/useRemoveBundleFromCart";
import useCartListSync from "./useCartListSync";
import { getGuestId } from "helper-functions/getToken";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const useBundleCartRowActions = (row) => {
  const { t } = useTranslation();
  const { removeBundleRow } = useCartListSync();
  const { mutate: updateBundleMutate, isLoading: updateLoading } =
    useUpdateBundleCart();
  const { mutate: removeBundleMutate, isLoading: removeLoading } =
    useRemoveBundleFromCart();

  const bundleGroupId = row?.bundle_details?.bundle_group_id;
  const quantity = row?.quantity ?? row?.bundle_details?.quantity ?? 1;

  const [targetQuantity, setTargetQuantity] = useState(null);
  useEffect(() => {
    if (targetQuantity != null && quantity === targetQuantity) {
      setTargetQuantity(null);
    }
  }, [quantity, targetQuantity]);

  const setQuantity = (newQuantity) => {
    if (newQuantity < 1 || newQuantity === quantity) return;
    setTargetQuantity(newQuantity);
    updateBundleMutate(
      {
        bundle_group_id: bundleGroupId,
        quantity: newQuantity,
        guest_id: getGuestId(),
      },
      {
        onError: (err) => {
          setTargetQuantity(null);
          onErrorResponse(err);
        },
      },
    );
  };

  const handleIncrement = () => setQuantity(quantity + 1);

  const handleDecrement = () => {
    if (quantity === 1) {
      removeBundleMutate(
        { bundle_group_id: bundleGroupId, guest_id: getGuestId() },
        {
          onSuccess: () => {
            removeBundleRow(bundleGroupId);
            toast.success(t("Removed from cart."));
          },
          onError: onErrorResponse,
        },
      );
    } else {
      setQuantity(quantity - 1);
    }
  };

  return {
    handleIncrement,
    handleDecrement,
    isLoading:
      updateLoading ||
      removeLoading ||
      (targetQuantity != null && targetQuantity !== quantity),
  };
};

export default useBundleCartRowActions;
