import React from "react";
import useBogoCartRowActions from "api-manage/hooks/custom-hooks/useBogoCartRowActions";
import BogoCartItemCard from "./BogoCartItemCard";

const BogoCartItemConnected = ({ row, showStepper = true }) => {
  const { handleIncrement, handleDecrement, isLoading } = useBogoCartRowActions(row);

  return (
    <BogoCartItemCard
      bogoDetails={row?.bogo_details}
      quantity={row?.quantity}
      showStepper={showStepper}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
      isLoading={isLoading}
      enableDetailsModal
    />
  );
};

export default BogoCartItemConnected;
