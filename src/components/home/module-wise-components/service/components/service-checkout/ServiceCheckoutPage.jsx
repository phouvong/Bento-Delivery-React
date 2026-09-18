import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import CustomContainer from "components/container";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { useTheme } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import CheckoutBillingDetails from "./CheckoutBillingDetails";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import useGetOfflinePaymentOptions from "api-manage/hooks/react-query/offlinePayment/useGetOfflinePaymentOptions";
import useGetStoreDetails from "api-manage/hooks/react-query/store/useGetStoreDetails";
import { cartItemsTotalAmount } from "utils/CustomFunctions";
import { ProfileApi } from "api-manage/another-formated-api/profileApi";
import { GoogleApi } from "api-manage/hooks/react-query/googleApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import {
  setOfflineInfoStep,
  setOfflineMethod,
  setOrderDetailsModal,
} from "redux/slices/offlinePaymentData";
import { setCouponInfo } from "redux/slices/profileInfo";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { getToken } from "helper-functions/getToken";
import { getCurrentModuleId } from "helper-functions/getCurrentModuleType";
import useServiceBookingPayment from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/useServiceBookingPayment";
import OfflineForm from "components/checkout/item-checkout/offline-payment/OfflineForm";
import {
  checkSchedule,
  getScheduleErrorMessage,
  validateRepeatDates,
} from "components/home/module-wise-components/service/utils/providerScheduleValidation";
import CheckoutMainContent from "./CheckoutMainContent";

const ServiceCheckoutPage = (props) => {
  useScrollToTop();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [rerender] = useState(false);
  const router = useRouter();
  const {
    method,
    booking_id: retryBookingId,
    amount: retryAmount,
  } = router.query;
  const token = getToken();
  const { configData: reduxConfigData } = useSelector(
    (state) => state.configData,
  );
  const {
    configData: propConfigData,
    page,
    cartList,
    campaignItemList,
    totalAmount,
    slug,
    reqServiceDetails,
  } = props;
  const configData = propConfigData ?? reduxConfigData;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  console.log({ reduxConfigData });

  // "Create account with existing info" — guest checkout only. Mirrors
  // checkout/item-checkout/index.js's formik/check wiring so the booking
  // payload can flag create_new_user + submit the chosen password.
  const [check, setCheck] = useState(false);
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required(t("Password is required"))
        .min(6, t("Password is too short - should be 6 chars minimum.")),
      confirm_password: Yup.string()
        .required(t("Confirm Password"))
        .oneOf([Yup.ref("password"), null], t("Passwords must match")),
    }),
  });
  const passwordHandler = (value) => {
    formik.setFieldValue("password", value);
  };
  const confirmPasswordHandler = (value) => {
    formik.setFieldValue("confirm_password", value);
  };
  const { cartList: aliasCartList, buyNowItemList } = useSelector(
    (state) => state.cart,
  );
  const persistRehydrated = useSelector((state) => state._persist?.rehydrated);
  const { couponInfo } = useSelector((state) => state.profileInfo);
  const isCustomService = slug === "custom-service";
  const isBuyNow = page === "buy_now";
  const buyNowStoreId =
    buyNowItemList?.[0]?.store_id ?? buyNowItemList?.[0]?.store?.id ?? null;
  const isCampaignBuyNow =
    isBuyNow && Boolean(buyNowItemList?.[0]?.isCampaignService);

  // Custom service: provider comes from the selected bid, not the URL.
  // Book Now: provider comes from the single buy-now item (no store_id in the URL).
  // Normal service: URL param store_id is the only reliable source (cart oscillates).
  const providerId = isCustomService
    ? reqServiceDetails?.data?.selected_offer?.provider?.id
      ? String(reqServiceDetails.data.selected_offer.provider.id)
      : null
    : isBuyNow
    ? buyNowStoreId != null
      ? String(buyNowStoreId)
      : null
    : router?.query?.store_id ?? null;
  const {
    data: providerData,
    isFetching: isProviderFetching,
    refetch: providerRefetch,
  } = useGetStoreDetails(providerId);

  const isCheckoutReady =
    persistRehydrated && !isProviderFetching && !!providerData;

  const [bookingType, setBookingType] = useState("regular");
  const [serviceLocation, setServiceLocation] = useState("my_location");
  const [scheduledAt, setScheduledAt] = useState(null);
  const [address, setAddress] = useState(undefined);
  const [couponDiscount, setCouponDiscount] = useState(null);

  // couponInfo (redux, persisted) survives a hard reload and keeps the "Add
  // Coupon" card showing the coupon as applied, but couponDiscount here is
  // plain local state that resets to null on every fresh mount — leaving the
  // Billing summary's "Coupon" line stuck at 0 even though the UI still says
  // it's applied. Re-seed it once persist has actually rehydrated so this
  // doesn't fire on a stale/default couponInfo before rehydration finishes.
  useEffect(() => {
    if (persistRehydrated && couponInfo && !couponDiscount) {
      setCouponDiscount(couponInfo);
    }
  }, [persistRehydrated, couponInfo]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentLatLng = JSON.parse(
      localStorage.getItem("currentLatLng") || "null",
    );
    const location = localStorage.getItem("location");
    if (currentLatLng?.lat && currentLatLng?.lng) {
      setAddress({
        ...currentLatLng,
        latitude: currentLatLng.lat,
        longitude: currentLatLng.lng,
        address: location,
        address_type: "Selected Address",
      });
    }
  }, []);

  useEffect(() => {
    if (providerId) {
      providerRefetch();
    }
  }, [providerId]);

  // Pre-fill scheduledAt from custom service request booking_date + booking_time
  useEffect(() => {
    if (!isCustomService || !reqServiceDetails?.data) return;
    const { booking_date, booking_time } = reqServiceDetails.data;
    if (!booking_date || !booking_time) return;
    const dt = dayjs(`${booking_date} ${booking_time}`, "YYYY-MM-DD HH:mm:ss");
    if (!dt.isValid()) return;
    setScheduledAt({ timestamp: dt.toDate(), time: dt.format("hh:mm A") });
  }, [reqServiceDetails, isCustomService]);

  // Default to Cash After Service (UI key "cash_on_delivery" is normalized to
  // "cash_after_service" in the booking-place payload — see CheckoutBillingDetails).
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [orderType, setOrderType] = useState("delivery");
  const [usePartialPayment, setUsePartialPayment] = useState(false);
  const [multiBookingType, setMultiBookingType] = useState("daily");
  const [repeatDates, setRepeatDates] = useState([]);
  const [switchToWallet, setSwitchToWallet] = useState(false);
  const [paymentMethodImage, setPaymentMethodImage] = useState("");
  const [changeAmount, setChangeAmount] = useState();
  const [computedTotal, setComputedTotal] = useState(null);
  // Booking created with offline_payment — held here (survives the shallow
  // route change to ?method=offline since this component stays mounted)
  // until the OfflineForm collects the transaction proof to submit.
  const [offlineBookingId, setOfflineBookingId] = useState(null);
  const { mutate: payOfflineBooking, isLoading: isOfflinePaying } =
    useServiceBookingPayment();

  // A coupon validated today may not be valid for a later booking date, so drop
  // any applied coupon when the booking type, multi-booking type, schedule or
  // repeat dates change and prompt the user to re-apply. Custom service is
  // excluded — its schedule is fixed/prefilled from the accepted bid.
  const couponRef = useRef(couponDiscount);
  useEffect(() => {
    couponRef.current = couponDiscount;
  }, [couponDiscount]);
  const bookingSignature = JSON.stringify({
    bookingType,
    multiBookingType,
    scheduledAt,
    repeatDates,
  });
  const prevBookingSignatureRef = useRef(bookingSignature);
  useEffect(() => {
    if (isCustomService) return;
    if (prevBookingSignatureRef.current === bookingSignature) return;
    prevBookingSignatureRef.current = bookingSignature;
    if (!couponRef.current) return;
    setCouponDiscount(null);
    dispatch(setCouponInfo(null));
    if (typeof window !== "undefined") localStorage.removeItem("coupon");
    setSwitchToWallet(false);
    toast.error(
      t("Coupon removed. Please re-apply after updating your booking."),
    );
  }, [bookingSignature, isCustomService]);

  const displayCartList = useMemo(() => {
    if (isBuyNow) return getCartListModuleWise(buyNowItemList ?? []);
    return getCartListModuleWise(aliasCartList).filter(
      (item) => !providerId || String(item?.store_id) === String(providerId),
    );
  }, [isBuyNow, buyNowItemList, aliasCartList, providerId]);
  const payableAmount = useMemo(
    () => cartItemsTotalAmount(displayCartList),
    [displayCartList],
  );

  const currentLatLng = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(window.localStorage.getItem("currentLatLng") || "null");
    } catch {
      return null;
    }
  }, []);

  const { data: zoneData } = useQuery(
    ["zoneId", currentLatLng],
    async () => GoogleApi.getZoneId(currentLatLng),
    {
      retry: 1,
      enabled: Boolean(currentLatLng?.lat && currentLatLng?.lng),
    },
  );

  const isZoneDigital = zoneData?.data?.zone_data?.[0] ?? {
    cash_on_delivery: Boolean(configData?.cash_on_delivery),
    digital_payment: Boolean(configData?.digital_payment_info?.digital_payment),
    offline_payment: Boolean(configData?.offline_payment_status === 1),
  };

  // ["offline-payments"] query key, which vanishes on a hard reload.
  const { data: offlinePaymentOptions, refetch: refetchOfflinePaymentOptions } =
    useGetOfflinePaymentOptions();
  useEffect(() => {
    refetchOfflinePaymentOptions();
  }, []);

  const userOnSuccessHandler = () => {};
  const { data: customerData } = useQuery(
    ["profile-info"],
    ProfileApi.profileInfo,
    {
      onSuccess: userOnSuccessHandler,
      onError: onSingleErrorResponse,
    },
  );

  const handlePartialPayment = () => {
    const orderTotal = computedTotal ?? payableAmount;
    if (
      orderTotal > customerData?.data?.wallet_balance &&
      configData?.partial_payment_status === 1
    ) {
      setUsePartialPayment(true);
      setPaymentMethod("");
      dispatch(setOfflineMethod(""));
    } else {
      if (customerData?.data?.wallet_balance > orderTotal) {
        setPaymentMethod("wallet");
        setSwitchToWallet(true);
        dispatch(setOfflineMethod(""));
      } else {
        toast.error(t("Your wallet balance is insufficient for payment."));
      }
    }
  };

  // Validate provider schedule — called on Payment modal "Proceed" click (middle gate).
  // Custom service: provider confirmed availability at the agreed booking time — skip entirely.
  const handleScheduleValidation = () => {
    if (isCustomService) return true;
    if (!providerData) return true;
    const schedules = providerData.schedules;
    if (!schedules || schedules.length === 0) {
      toast.error(t("This provider has no available schedule"), {
        id: "provider-not-available",
      });
      return false;
    }
    if (bookingType === "regular") {
      const dtToCheck = scheduledAt ? dayjs(scheduledAt.timestamp) : dayjs();
      const check = checkSchedule(dtToCheck, schedules);
      if (!check.available) {
        toast.error(t(getScheduleErrorMessage(check.reason)), {
          id: "provider-not-available",
        });
        return false;
      }
    }
    if (bookingType === "repeat" && repeatDates?.length > 0) {
      const { valid, reason } = validateRepeatDates(repeatDates, schedules);
      if (!valid) {
        toast.error(t(getScheduleErrorMessage(reason)), {
          id: "provider-not-available",
        });
        return false;
      }
    }
    return true;
  };

  const removePartialPayment = () => {
    if ((computedTotal ?? payableAmount) > customerData?.data?.wallet_balance) {
      setUsePartialPayment(false);
      setPaymentMethod("");
      dispatch(setOfflineMethod(""));
    } else {
      setPaymentMethod("");
      setSwitchToWallet(false);
      dispatch(setOfflineMethod(""));
    }
  };

  const navigateToOrders = (bookingId) => {
    if (!token) {
      router.push("/home");
      return;
    }
    const moduleParam = router?.query?.module;
    const moduleId = getCurrentModuleId();
    router.push({
      pathname: "/profile",
      query: {
        page: "my-orders",
        ...(bookingId && { orderId: bookingId }),
        ...(moduleId != null && { orderTabModule: moduleId }),
        ...(moduleParam && { module: moduleParam }),
      },
    });
  };

  // Booking placed with offline_payment — switch the page into "collect
  // transaction proof" mode instead of registering payment immediately.
  const handleOfflineBookingPlaced = (bookingId) => {
    setOfflineBookingId(bookingId);
    dispatch(setOfflineInfoStep(2));
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, method: "offline" },
      },
      undefined,
      { shallow: true },
    );
  };

  // OfflineForm submit — register the collected transaction proof against
  // the booking. `offlineBookingId` is set when this page placed the booking
  // itself; `retryBookingId` covers landing here directly via ?method=offline
  // &booking_id=... (the "Pay Now" retry link from an existing booking's
  // details page, which has no local state to carry it).
  const handleOffineOrder = (data) => {
    const resolvedBookingId = offlineBookingId ?? retryBookingId;
    const guestId =
      typeof window !== "undefined" ? localStorage.getItem("guest_id") : null;
    payOfflineBooking(
      {
        booking_id: resolvedBookingId,
        ...data,
        payment_method: "offline_payment",
        ...(!token && guestId ? { guest_id: guestId } : {}),
      },
      {
        onSuccess: () => {
          toast.success(t("Booking placed successfully"));
          dispatch(setOrderDetailsModal(true));
          navigateToOrders(resolvedBookingId);
        },
      },
    );
  };

  const layoutHandler = () => {
    return (
      <CustomContainer>
        <Box
          sx={{
            mt: { md: "45px" },
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
          }}
        >
          <Box sx={{ flex: { xs: "1 1 auto", md: 8.5 }, minWidth: 0 }}>
            <CheckoutMainContent
              setPaymentMethod={setPaymentMethod}
              paymentMethod={paymentMethod}
              zoneData={zoneData}
              configData={configData}
              orderType={orderType}
              address={address}
              setAddress={setAddress}
              usePartialPayment={usePartialPayment}
              offlinePaymentOptions={offlinePaymentOptions}
              setSwitchToWallet={setSwitchToWallet}
              isZoneDigital={isZoneDigital}
              setPaymentMethodImage={setPaymentMethodImage}
              paymentMethodImage={paymentMethodImage}
              customerData={customerData}
              payableAmount={computedTotal ?? payableAmount}
              isCheckoutReady={isCheckoutReady}
              handlePartialPayment={handlePartialPayment}
              removePartialPayment={removePartialPayment}
              switchToWallet={switchToWallet}
              changeAmount={changeAmount}
              setChangeAmount={setChangeAmount}
              isCustomService={isCustomService}
              reqServiceDetails={reqServiceDetails}
              scheduledAt={scheduledAt}
              setScheduledAt={setScheduledAt}
              bookingType={bookingType}
              setBookingType={setBookingType}
              multiBookingType={multiBookingType}
              setMultiBookingType={setMultiBookingType}
              onRepeatDatesChange={setRepeatDates}
              repeatDates={repeatDates}
              onBeforeProceed={handleScheduleValidation}
              storeId={providerId}
              serviceLocation={serviceLocation}
              setServiceLocation={setServiceLocation}
              couponDiscount={couponDiscount}
              setCouponDiscount={setCouponDiscount}
              providerData={providerData}
              isProviderFetching={isProviderFetching}
              disableRepeat={isCampaignBuyNow}
              check={check}
              setCheck={setCheck}
              formik={formik}
              passwordHandler={passwordHandler}
              confirmPasswordHandler={confirmPasswordHandler}
            />
          </Box>
          <Box
            sx={{
              flex: { md: 3.5 },
              minWidth: 0,
              alignSelf: "flex-start",
              position: { xs: "static", md: "sticky" },
              width: { xs: "100%", md: "auto" },
              top: "70px",
            }}
          >
            <CheckoutBillingDetails
              isCustomService={isCustomService}
              reqServiceDetails={reqServiceDetails}
              service={{}}
              providerId={providerId}
              overrideCartList={isBuyNow ? displayCartList : undefined}
              isBuyNow={isBuyNow}
              check={check}
              formik={formik}
              address={address}
              scheduledAt={scheduledAt}
              paymentMethod={paymentMethod}
              bookingType={bookingType}
              serviceLocation={serviceLocation}
              couponDiscount={couponDiscount}
              usePartialPayment={usePartialPayment}
              multiBookingType={multiBookingType}
              repeatDates={repeatDates}
              providerData={providerData}
              onTotalAmountChange={setComputedTotal}
              onOfflineBookingPlaced={handleOfflineBookingPlaced}
              isCheckoutReady={isCheckoutReady}
            />
          </Box>
        </Box>
      </CustomContainer>
    );
  };

  const offlinePaymentHandler = () => (
    <CustomContainer>
      <Grid container mb="2rem" paddingTop={{ xs: "1.5rem", md: "2.5rem" }}>
        <Grid item xs={12} md={12}>
          <Typography variant="h5" fontWeight="600">
            {t("Offline Payment Information")}
          </Typography>
          <CustomStackFullWidth
            marginTop={{ xs: "1.5rem", md: "2.5rem" }}
            alignItems="center"
          >
            <CustomPaperBigCard
              sx={{
                width: { xs: "100%", sm: "90%", md: "80%" },
                padding: { xs: "1rem", md: "1.8rem" },
              }}
            >
              <OfflineForm
                offlinePaymentOptions={offlinePaymentOptions}
                total_order_amount={
                  // Retry flow (empty cart, nothing to compute from) — use the
                  // amount carried in the URL instead of the checkout total.
                  retryAmount != null
                    ? Number(retryAmount)
                    : computedTotal ?? payableAmount
                }
                offlinePaymentLoading={isOfflinePaying}
                usePartialPayment={usePartialPayment}
                handleOffineOrder={handleOffineOrder}
                setOfflineCheck={() => {}}
              />
            </CustomPaperBigCard>
          </CustomStackFullWidth>
        </Grid>
      </Grid>
    </CustomContainer>
  );

  return (
    <>
      <CustomStackFullWidth
        key={rerender}
        sx={{ minHeight: "100vh" }}
        spacing={3}
      >
        {method === "offline" ? offlinePaymentHandler() : layoutHandler()}
      </CustomStackFullWidth>
    </>
  );
};

export default ServiceCheckoutPage;
