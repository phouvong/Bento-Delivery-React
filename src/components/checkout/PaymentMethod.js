import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import ParcelPaymentMethod from "./item-checkout/ParcelPaymentMethod";
import OtherModulePayment from "./item-checkout/OtherModulePayment";

const PaymentMethod = ({
  paymentMethod,
  setPaymentMethod,
  paidBy,
  orderPlace,
  isLoading,
  zoneData,
  forprescription,
  configData,
  orderType,
  parcel,
  setOpenModel,
  offlinePaymentOptions,
  usePartialPayment,
  setPaymentMethodImage,
  setSwitchToWallet,
  isZoneDigital,
  getParcelPayment,
  handlePartialPayment,
  walletBalance,
  removePartialPayment,
  switchToWallet,
  customerData,
  payableAmount,
  changeAmount,
  setChangeAmount,
  failed,
  failedOrderPlace,
  setOpen,
  setSelectedPaymentMethod,
}) => {
  return (
    <CustomStackFullWidth spacing={2}>
      {parcel === "true" ? (
        <ParcelPaymentMethod
          setPaymentMethod={setPaymentMethod}
          paymentMethod={paymentMethod}
          zoneData={zoneData}
          configData={configData}
          orderType={orderType}
          parcel={parcel}
          paidBy={paidBy}
          orderPlace={orderPlace}
          isLoading={isLoading}
          offlinePaymentOptions={offlinePaymentOptions}
          setPaymentMethodImage={setPaymentMethodImage}
          getParcelPayment={getParcelPayment}
          setOpen={setOpen}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
        />
      ) : (
        <OtherModulePayment
          failed={ failed}
          changeAmount={changeAmount}
          setChangeAmount={setChangeAmount}
          setPaymentMethod={setPaymentMethod}
          paymentMethod={paymentMethod}
          zoneData={zoneData}
          configData={configData}
          orderType={orderType}
          setOpenModel={setOpenModel}
          usePartialPayment={usePartialPayment}
          forprescription={forprescription}
          offlinePaymentOptions={offlinePaymentOptions}
          setPaymentMethodImage={setPaymentMethodImage}
          setSwitchToWallet={setSwitchToWallet}
          isZoneDigital={isZoneDigital}
          handlePartialPayment={handlePartialPayment}
          walletBalance={walletBalance}
          removePartialPayment={removePartialPayment}
          switchToWallet={switchToWallet}
          customerData={customerData}
          payableAmount={payableAmount}
          failedOrderPlace={failedOrderPlace}
        />
      )}
    </CustomStackFullWidth>
  );
};

export default PaymentMethod;
