import AddPaymentMethod from "components/checkout/item-checkout/AddPaymentMethod";
import HaveCoupon from "components/checkout/item-checkout/HaveCoupon";
import { getToken } from "helper-functions/getToken";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import BookingType from "./BookingType";
import CheckoutHeader from "./CheckoutHeader";
import GetServiceAt from "./get-service-at/GetServiceAt";
import ScheduleService from "./single-booking/ScheduleService";

const CheckoutMainContent = ({
  setPaymentMethod,
  paymentMethod,
  zoneData,
  configData,
  orderType,
  address,
  setAddress,
  usePartialPayment,
  offlinePaymentOptions,
  setSwitchToWallet,
  isZoneDigital,
  setPaymentMethodImage,
  paymentMethodImage,
  customerData,
  payableAmount,
  handlePartialPayment,
  removePartialPayment,
  switchToWallet,
  changeAmount,
  setChangeAmount,
  isCustomService,
  scheduledAt,
  setScheduledAt,
  bookingType,
  setBookingType,
  multiBookingType,
  setMultiBookingType,
  onRepeatDatesChange,
  repeatDates,
  storeId,
  serviceLocation,
  setServiceLocation,
  couponDiscount,
  setCouponDiscount,
  providerData,
  isProviderFetching,
  onBeforeProceed,
  reqServiceDetails,
  disableRepeat,
  check,
  setCheck,
  formik,
  passwordHandler,
  confirmPasswordHandler,
  isCheckoutReady,
}) => {
  const token = getToken();
  const repeatCount =
    bookingType === "repeat" ? repeatDates?.length || 0 : 0;

  return (
    <CustomStackFullWidth spacing={{ xs: 2, md: 3 }}>
      <CheckoutHeader
        isCustomService={isCustomService}
        reqServiceDetails={reqServiceDetails}
        providerData={providerData}
      />
      {!isCustomService && (
        <BookingType
          configData={configData}
          address={address}
          setAddress={setAddress}
          scheduledAt={scheduledAt}
          setScheduledAt={setScheduledAt}
          bookingType={bookingType}
          setBookingType={setBookingType}
          multiBookingType={multiBookingType}
          setMultiBookingType={setMultiBookingType}
          onRepeatDatesChange={onRepeatDatesChange}
          providerData={providerData}
          setPaymentMethod={setPaymentMethod}
          disableRepeat={disableRepeat}
        />
      )}
      {isCustomService && (
        <ScheduleService
          isCustomService={isCustomService}
          scheduledAt={scheduledAt}
        />
      )}
      <GetServiceAt
        setAddress={setAddress}
        address={address}
        configData={configData}
        check={check}
        setCheck={setCheck}
        formik={formik}
        passwordHandler={passwordHandler}
        confirmPasswordHandler={confirmPasswordHandler}
        isCustomService={isCustomService}
        serviceLocation={serviceLocation}
        setServiceLocation={setServiceLocation}
        providerData={providerData}
        isProviderFetching={isProviderFetching}
      />
      {!isCustomService && storeId && token && (
        <HaveCoupon
          store_id={storeId}
          totalAmount={payableAmount}
          payableAmount={payableAmount}
          deliveryFee={0}
          deliveryTip={0}
          setCouponDiscount={setCouponDiscount}
          couponDiscount={couponDiscount}
          walletBalance={customerData?.data?.wallet_balance}
          min_order_amount={customerData?.data?.minimum_order}
          setSwitchToWallet={setSwitchToWallet}
        />
      )}
      <AddPaymentMethod
        setPaymentMethod={setPaymentMethod}
        paymentMethod={
          bookingType === "repeat" ? "cash_on_delivery" : paymentMethod
        }
        locked={bookingType === "repeat"}
        repeatCount={repeatCount}
        zoneData={zoneData}
        configData={configData}
        orderType={orderType}
        usePartialPayment={usePartialPayment}
        offlinePaymentOptions={offlinePaymentOptions}
        setSwitchToWallet={setSwitchToWallet}
        isZoneDigital={isZoneDigital}
        setPaymentMethodImage={setPaymentMethodImage}
        paymentMethodImage={paymentMethodImage}
        remainingBalance={
          customerData?.data?.wallet_balance - (payableAmount ?? 0)
        }
        handlePartialPayment={handlePartialPayment}
        walletBalance={customerData?.data?.wallet_balance}
        removePartialPayment={removePartialPayment}
        switchToWallet={switchToWallet}
        customerData={customerData}
        payableAmount={payableAmount}
        changeAmount={changeAmount}
        setChangeAmount={setChangeAmount}
        onBeforeProceed={onBeforeProceed}
        isAmountReady={isCheckoutReady}
      />
    </CustomStackFullWidth>
  );
};

export default CheckoutMainContent;
