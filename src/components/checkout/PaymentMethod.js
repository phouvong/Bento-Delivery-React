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
                         payableAmount
}) => {
  return (
    <CustomStackFullWidth
      spacing={2}

    >
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
        />
      ) : (
        <OtherModulePayment
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
        />
      )}
    </CustomStackFullWidth>
  );
};

export default PaymentMethod;
