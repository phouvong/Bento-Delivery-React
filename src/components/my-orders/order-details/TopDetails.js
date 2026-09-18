import CloseIcon from "@mui/icons-material/Close";
import {
  Drawer,
  IconButton,
  Skeleton,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { GoogleApi } from "api-manage/hooks/react-query/googleApi";
import StatusBadge from "components/common/StatusBadge";
import CustomFormatedTime from "components/date/CustomFormatedTime";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  clearOfflinePaymentInfo,
  setOrderDetailsModal,
} from "redux/slices/offlinePaymentData";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomModal from "../../modal";
import TrackSvg from "../assets/TrackSvg";
import DigitalPaymentManage from "./DigitalPaymentManage";
import OfflineOrderDetailsModal from "./offline-order/OfflineOrderDetailsModal";
import PaymentUpdate from "./other-order/PaymentUpdate";
import AddPaymentMethod from "components/checkout/item-checkout/AddPaymentMethod";
import PaymentMethod from "components/checkout/PaymentMethod";
import useGetOfflinePaymentOptions from "api-manage/hooks/react-query/offlinePayment/useGetOfflinePaymentOptions";
import {
  getDigitalMethodFromZone,
  handleFailedOrderPlace,
} from "utils/CustomFunctions";
import { useUpdatePaymentMethod } from "api-manage/hooks/react-query/payment-method/useUpdatePaymentMethod";
import { useUpdatePaymentByWallet } from "api-manage/hooks/react-query/useUpdatePaymentByWallet";
import { baseUrl } from "api-manage/MainApi";
import Router, { useRouter } from "next/router";
import { useGetFailedPayment } from "api-manage/hooks/react-query/useGetFailedPayment";
import useServiceBusinessConfig from "components/home/module-wise-components/service/service-api-manage/hooks/custom-hooks/useServiceBusinessConfig";
import RateAndReview from "components/review/RateAndReview";
import CustomDivider from "components/CustomDivider";

const TopDetails = (props) => {
  const {
    data,
    trackData,
    trackDataIsLoading,
    trackDataIsFetching,
    currentTab,
    configData,
    id,
    openModal,
    setOpenModal,
    refetchOrderDetails,
    refetchTrackData,
    dataIsLoading,
    page,
    openPaymentMethod,
    setOpenPaymentMethod,
    paymentMethodUpdateMutation,
    paymentFailedData,
    setPaymentFailedData,
    isBooking,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { orderDetailsModal, offlineInfoStep } = useSelector(
    (state) => state.offlinePayment
  );
  console.log({ orderDetailsModal });
  const { profileInfo } = useSelector((state) => state.profileInfo);
  console.log({ profileInfo });
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isServiceBooking =
    isBooking === true || trackData?.module_type === "service";
  const parentBookingId = router.query?.parentBookingId;
  const isSubBooking = isServiceBooking && !!parentBookingId;
  const { otpForCompleteServiceEnabled } = useServiceBusinessConfig(
    configData,
    null
  );
  const hasServiceOtp = Boolean(data?.otp);
  const isBookingOtpEligibleStatus = ["confirmed", "ongoing"].includes(
    data?.booking_status
  );
  const [openModalForPayment, setModalOpenForPayment] = useState();
  const [cancelReason, setCancelReason] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [returnFareOpenModal, setReturnFareOpenModal] = useState(false);
  const [openModalOffline, setOpenModelOffline] = useState(false);
  const [parcelReceiveModal, setParcelReceiveModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("");
  const dispatch = useDispatch();

  console.log({ paymentFailedData });

  const currentLatLng = JSON.parse(
    window.localStorage.getItem("currentLatLng")
  );
  const { data: zoneData } = useQuery(
    ["zoneId", location],
    async () => GoogleApi.getZoneId(currentLatLng),
    {
      retry: 1,
    }
  );

  const today = moment(new Date());
  const differenceInMinutes = () => {
    const deliveryTime = trackData?.store?.delivery_time;
    const createdAt = trackData?.created_at;
    const processingTime = trackData?.processing_time;
    const scheduleAt = trackData?.schedule_at;
    let minTime = processingTime != null ? processingTime : 0;
    if (
      deliveryTime !== null &&
      deliveryTime !== "" &&
      processingTime === null
    ) {
      const timeArr = deliveryTime?.split("-");
      minTime = Number.parseInt(timeArr[0]);
    }
    const newDeliveryTime = scheduleAt ? scheduleAt : createdAt;
    const newDeliveryTimeWithAdditionalMin = moment(newDeliveryTime)
      .add(minTime, "minutes")
      .format();
    const duration = moment.duration(
      today.diff(newDeliveryTimeWithAdditionalMin)
    );
    const minutes = duration?.asMinutes();
    //here minutes give negative values for positive changes, that's why the condition given below
    if (minutes <= -1) {
      return Number.parseInt(Math.abs(minutes));
    }
  };
  const handleTime = () => {
    if (differenceInMinutes() > 5) {
      return `${differenceInMinutes() - 5} - ${differenceInMinutes()} `;
    } else {
      return `1-5`;
    }
  };

  const handleOfflineClose = () => {
    dispatch(clearOfflinePaymentInfo());
    dispatch(setOrderDetailsModal(false));
    setOpenModelOffline(false);
  };

  // Open the "order placed successfully" modal reactively from the live Redux
  // flag (set during checkout, just before navigating here). Driving it off the
  // flag — rather than a mount-time `useState(orderDetailsModal)` snapshot —
  // makes it survive the loading skeleton and the route/`key` remounts that
  // happen while the order id resolves. A throwaway first mount used to consume
  // the flag before the real one rendered, so the modal never showed. The flag
  // is cleared on close (handleOfflineClose), so it won't reopen on later visits.
  // Gate on resolved order data: the page remounts while the order id
  // resolves, and opening on a throwaway skeleton mount made the modal
  // flash (open → unmount → reopen = "shows 2 times, 1 blink").
  useEffect(() => {
    const hasOrderData = Boolean(
      trackData?.id ?? data?.id ?? data?.[0]?.order_id
    );
    if (orderDetailsModal && hasOrderData) {
      setOpenModelOffline(true);
    }
  }, [orderDetailsModal, trackData?.id, data?.id]);
  const capitalizeText = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const {
    data: offlinePaymentOptions,
    refetch: refetchOfflinePaymentOptions,
    isLoading: offlineIsLoading,
  } = useGetOfflinePaymentOptions();
  useEffect(() => {
    refetchOfflinePaymentOptions();
  }, []);
  const isZoneDigital = getDigitalMethodFromZone(
    trackData?.module_type !== "parcel"
      ? trackData?.store?.zone_id
      : trackData?.zone_id,
    zoneData?.data
  );

  const { mutate: walletPaymentMutation } = useUpdatePaymentByWallet();

  const handlePayment = (mutation) => {
    const handleSuccess = (response) => {
      toast.success(response.message);
      refetchOrderDetails();
      refetchTrackData();
      setOpenPaymentMethod(false);
    };

    const formData = {
      order_id: id,
      _method: paymentMethod === "wallet" ? "POST" : "PUT",
    };

    mutation(formData, {
      onSuccess: handleSuccess,
      onError: onErrorResponse,
    });
  };
  console.log({ data });

  // Scoped to this page (order-details / booking-details under
  // profile?page=my-orders) only — checkout and service/checkout never call
  // failedOrderPlace, so they're unaffected.
  const failedOrderPlace = () => {
    // trackData (trackOrderData) is order-only and comes back empty for a
    // booking — the booking's real payload (incl. payment_method) is `data`.
    const currentPaymentMethod = data?.payment_method ?? trackData?.payment_method;
    const isSameCashMethod =
      (paymentMethod === "cash_on_delivery" ||
        paymentMethod === "cash_after_service") &&
      (currentPaymentMethod === "cash_on_delivery" ||
        currentPaymentMethod === "cash_after_service");
    if (
      currentPaymentMethod &&
      (paymentMethod === currentPaymentMethod || isSameCashMethod)
    ) {
      toast.error(t("This is already your selected payment method"));
      return;
    }
    handleFailedOrderPlace({
      paymentMethod,
      paymentFailedData,
      handlePayment,
      paymentMethodUpdateMutation,
      walletPaymentMutation,
      profileInfo,
      orderId: trackData?.id,
      baseUrl,
      router,
    });
  };
  console.log({ orderDetailsModal });
  return (
    <CustomStackFullWidth
      alignItems="center"
      justifyContent="space-between"
      direction="row"
      padding={{
        xs: "0px 0px 12px 0px",
        sm: "30px 20px 0 25px",
        md: "30px 20px 0 25px",
      }}
      rowGap="10px"
      flexWrap="wrap"
    >
      {/* Back to order list */}
      <Stack
        direction="row"
        alignItems="center"
        gap="4px"
        onClick={() =>
          router.push({
            pathname: "/profile",
            query: isSubBooking
              ? {
                  page: "my-orders",
                  orderId: parentBookingId,
                  ...(router.query.orderTabModule
                    ? { orderTabModule: router.query.orderTabModule }
                    : {}),
                }
              : {
                  page: "my-orders",
                  ...(router.query.orderTabModule
                    ? { orderTabModule: router.query.orderTabModule }
                    : {}),
                },
          })
        }
        sx={{
          cursor: "pointer",
          width: "100%",
          display: { xs: "none", md: "flex" },
        }}
      >
        <IconButton
          size="small"
          sx={{ p: "2px", color: theme.palette.text.link }}
        >
          <i
            className="fi fi-rr-arrow-small-left"
            style={{ fontSize: "18px", lineHeight: 1, display: "flex" }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: { xs: "14px", md: "16px" },
            fontWeight: 600,
            color: theme.palette.text.link,
            lineHeight: 1.2,
          }}
        >
          {isSubBooking ? t("Back To Main Booking") : t("Back to Main Orders")}
        </Typography>
      </Stack>

      <Stack
        direction={isSmall ? "column" : "row"}
        justifyContent="space-between"
        alignItems={isSmall ? "flex-start" : "center"}
        gap="8px"
        flexWrap="wrap"
        width="100%"
      >
        <Stack
          spacing={{ xs: 1, md: 1 }}
          flexGrow="1"
          sx={{ minWidth: 0, "@media (max-width: 385px)": { width: "100%" } }}
        >
          {/* <Typography
            fontSize={{ xs: "11px", md: "12px" }}
            fontWeight="500"
            color={theme.palette.neutral[500]}
          >
            {t("Order Date:")}
            <Typography
              component="span"
              fontSize={{ xs: "11px", md: "12px" }}
              fontWeight="600"
              marginLeft="5px"
              color={theme.palette.neutral[700]}
            >
              {moment(trackData?.created_at)?.format("DD MMM, YYYY h:mm A")}
            </Typography>
          </Typography> */}

          <Stack direction="row" alignItems="center" flexWrap="wrap" gap="8px">
            <Typography fontSize={{ xs: "16px", md: "20px" }} fontWeight="700">
              {isSubBooking
                ? t("Sub Booking ID:")
                : isServiceBooking
                ? t("Booking ID:")
                : t("Order ID:")}
              <Typography
                component="span"
                fontSize={{ xs: "16px", md: "20px" }}
                fontWeight="700"
                marginLeft="5px"
              >
                {data?.display_id ??
                  data?.[0]?.order_id ??
                  data?.booking_id ??
                  data?.id}
              </Typography>
            </Typography>
            {isServiceBooking ? (
              <StatusBadge
                status={data?.booking_status}
                label={
                  data?.status_label ?? t(capitalizeText(data?.booking_status))
                }
              />
            ) : trackData?.order_status === "failed" ? (
              <StatusBadge status="failed" label={t("Payment Failed")} />
            ) : (
              <StatusBadge
                status={trackData?.order_status}
                label={t(capitalizeText(trackData?.order_status))}
              />
            )}
            {trackData?.order_type && (
              <StatusBadge
                status="completed"
                label={t(
                  capitalizeText(
                    trackData?.order_type === "delivery"
                      ? "home delivery"
                      : trackData?.order_type
                  )
                )}
              />
            )}
            {isServiceBooking &&
              otpForCompleteServiceEnabled &&
              hasServiceOtp &&
              isBookingOtpEligibleStatus && (
                <Typography
                  fontSize={{ xs: "14px", md: "16px" }}
                  fontWeight="700"
                  color={theme.palette.text.primary}
                >
                  {t("OTP")} :{" "}
                  <Typography
                    component="span"
                    fontSize={{ xs: "14px", md: "16px" }}
                    fontWeight="700"
                    color={theme.palette.primary.main}
                  >
                    {data?.otp}
                  </Typography>
                </Typography>
              )}
          </Stack>
        </Stack>
        <Stack>
          <Stack
            direction="column"
            alignItems={isSmall ? "flex-start" : "flex-end"}
            spacing={0.5}
          >
            <Typography
              fontSize={{ xs: "11px", md: "12px" }}
              fontWeight="500"
              color={theme.palette.neutral[500]}
            >
              {isServiceBooking ? t("Booking Date:") : t("Order Date:")}
              <Typography
                component="span"
                fontSize={{ xs: "11px", md: "12px" }}
                fontWeight="600"
                marginLeft="5px"
                color={theme.palette.neutral[700]}
              >
                {moment(
                  isServiceBooking
                    ? data?.created_at ?? trackData?.created_at
                    : trackData?.created_at
                )?.format("DD MMM, YYYY")}
              </Typography>
            </Typography>

            {isServiceBooking && data?.schedule_at && (
              <Stack spacing={1}>
                <Typography
                  fontSize={{ xs: "11px", md: "12px" }}
                  fontWeight="500"
                  color={theme.palette.neutral[500]}
                >
                  {t("Service Date:")}
                  <Typography
                    component="span"
                    fontSize={{ xs: "11px", md: "12px" }}
                    fontWeight="600"
                    marginLeft="5px"
                    color={theme.palette.neutral[700]}
                  >
                    <CustomFormatedTime date={data.schedule_at} />
                    {", "}
                    {moment(data.schedule_at).format("DD MMM YYYY")}
                  </Typography>
                </Typography>
              </Stack>
            )}

            {trackData?.module_type === "food" && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  borderLeft: !isSmall
                    ? (t) => `1.5px solid ${alpha(t.palette.neutral[400], 0.5)}`
                    : "none",
                  pl: !isSmall ? "12px" : 0,
                  ml: !isSmall ? "4px" : 0,
                  height: !isSmall ? "16px" : "auto",
                }}
              >
                <TrackSvg />
                <Typography
                  color={theme.palette.primary.main}
                  fontSize={{ xs: "11px", md: "12px" }}
                  fontWeight="500"
                  lineHeight={1}
                >
                  {t("Estimated delivery:")}{" "}
                  <Typography
                    fontSize={{ xs: "11px", md: "12px" }}
                    fontWeight="600"
                    component="span"
                    color={theme.palette.primary.main}
                  >
                    {handleTime()} {t("min")}
                  </Typography>
                </Typography>
              </Stack>
            )}
          </Stack>
          {configData?.order_delivery_verification ? (
            <Typography
              fontSize={{ xs: "10px", md: "14px" }}
              fontWeight="600"
              color={theme.palette.primary.main}
            >
              <Typography
                fontSize={{ xs: "10px", md: "14px" }}
                fontWeight="600"
                color={theme.palette.neutral[500]}
                component="span"
              >
                {t("Order OTP")}:{" "}
              </Typography>
              {trackData?.otp}
            </Typography>
          ) : null}
        </Stack>
      </Stack>

      <CustomModal
        openModal={openModalOffline}
        handleClose={() => handleOfflineClose()}
      >
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ position: "relative" }}
        >
          <IconButton
            onClick={() => handleOfflineClose()}
            sx={{
              zIndex: "99",
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: (theme) => theme.palette.neutral[100],
              borderRadius: "50%",
              [theme.breakpoints.down("md")]: {
                top: 10,
                right: 5,
              },
            }}
          >
            <CloseIcon sx={{ fontSize: "24px", fontWeight: "500" }} />
          </IconButton>
        </CustomStackFullWidth>
        <OfflineOrderDetailsModal
          trackData={trackData}
          trackDataIsLoading={trackDataIsLoading}
          trackDataIsFetching={trackDataIsFetching}
          handleOfflineClose={handleOfflineClose}
          page={page}
          setOpenPaymentMethod={setOpenPaymentMethod}
          setPaymentFailedData={setPaymentFailedData}
          refetchTrackData={refetchTrackData}
        />
      </CustomModal>

      <CustomModal
        openModal={openModalForPayment}
        setModalOpen={setModalOpenForPayment}
        handleClose={() => setModalOpenForPayment(false)}
      >
        <DigitalPaymentManage
          setModalOpenForPayment={setModalOpenForPayment}
          setModalOpen={setOpenModal}
          refetchOrderDetails={refetchOrderDetails}
          refetchTrackData={refetchTrackData}
          id={trackData?.id}
          moduleType={trackData?.module_type || trackData?.module?.module_type}
        />
      </CustomModal>

      <CustomModal
        openModal={openPaymentMethod}
        handleClose={() => setOpenPaymentMethod(false)}
      >
        <PaymentMethod
          setPaymentMethod={setPaymentMethod}
          paymentMethod={paymentMethod}
          zoneData={zoneData}
          configData={configData}
          orderType={trackData?.order_type}
          usePartialPayment={false}
          setOpenModel={setOpenPaymentMethod}
          forprescription={trackData?.prescription_order}
          offlinePaymentOptions={offlinePaymentOptions}
          paymentMethodImage={null}
          setPaymentMethodImage={null}
          setSwitchToWallet={null}
          isZoneDigital={isZoneDigital}
          handlePartialPayment={() => setPaymentMethod("wallet")}
          walletBalance={profileInfo?.wallet_balance}
          removePartialPayment={null}
          switchToWallet={null}
          customerData={{ data: profileInfo }}
          failed
          payableAmount={trackData?.order_amount}
          failedOrderPlace={failedOrderPlace}
        />
      </CustomModal>

      <Drawer
        anchor="right"
        open={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
        variant="temporary"
        sx={{
          zIndex: 1300,
          "& .MuiDrawer-paper": {
            width: { xs: "300px", sm: "400px", md: "450px" },
            padding: "20px",
            boxSizing: "border-box",
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ marginBottom: "10px" }}
        >
          <Typography fontSize="16px" fontWeight="700">
            {t("Give Review")}
          </Typography>
          <IconButton
            onClick={() => setOpenReviewModal(false)}
            sx={{
              backgroundColor: (theme) => theme.palette.neutral[200],
              borderRadius: "50%",
              padding: "5px",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.neutral[300],
              },
            }}
          >
            <CloseIcon sx={{ fontSize: "16px" }} />
          </IconButton>
        </Stack>
        <CustomDivider border="1px" />
        <RateAndReview
          trackData={trackData}
          onAllItemsReviewed={() => {
            setOpenReviewModal(false);
            // Refresh order + track data so `is_reviewed` reflects the new
            // review and review CTAs update immediately.
            refetchTrackData?.();
            refetchOrderDetails?.();
          }}
          data={data}
          isServiceBooking={isServiceBooking}
        />
      </Drawer>
    </CustomStackFullWidth>
    // </HeadingBox>
  );
};

export default TopDetails;
