import React from "react";
import useBundleCartRowActions from "api-manage/hooks/custom-hooks/useBundleCartRowActions";
import CartBundleItem from "./CartBundleItem";

const CartBundleItemConnected = ({ row, showStepper = true }) => {
  const { handleIncrement, handleDecrement, isLoading } =
    useBundleCartRowActions(row);

  return (
    <CartBundleItem
      bundleDetails={row?.bundle_details}
      quantity={row?.quantity}
      showStepper={showStepper}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      isLoading={isLoading}
    />
  );
};

export default CartBundleItemConnected;
