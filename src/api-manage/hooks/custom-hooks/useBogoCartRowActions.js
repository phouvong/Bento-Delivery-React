import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import useUpdateBogoCart from "../react-query/add-cart/useUpdateBogoCart";
import useRemoveBogoFromCart from "../react-query/add-cart/useRemoveBogoFromCart";
import useCartListSync from "./useCartListSync";
import { getGuestId, getToken } from "helper-functions/getToken";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const useBogoCartRowActions = (row) => {
  const { t } = useTranslation();
  const { removeBogoRow } = useCartListSync();
  const { mutate: updateBogoMutate, isLoading: updateLoading } = useUpdateBogoCart();
  const { mutate: removeBogoMutate, isLoading: removeLoading } = useRemoveBogoFromCart();

  const bogoGroupId = row?.bogo_details?.bogo_group_id;
  const quantity = row?.quantity ?? row?.bogo_details?.quantity ?? 1;
  const guestParam = !getToken() && getGuestId() ? { guest_id: getGuestId() } : {};

  const [targetQuantity, setTargetQuantity] = useState(null);
  useEffect(() => {
    if (targetQuantity != null && quantity === targetQuantity) {
      setTargetQuantity(null);
    }
  }, [quantity, targetQuantity]);

  const setQuantity = (newQuantity) => {
    if (newQuantity < 1 || newQuantity === quantity) return;
    setTargetQuantity(newQuantity);
    updateBogoMutate(
      { ...guestParam, bogo_group_id: bogoGroupId, quantity: newQuantity },
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
      removeBogoMutate(
        { ...guestParam, bogo_group_id: bogoGroupId },
        {
          onSuccess: () => {
            removeBogoRow(bogoGroupId);
            toast.success(t("Cart item remove successfully"));
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

export default useBogoCartRowActions;
