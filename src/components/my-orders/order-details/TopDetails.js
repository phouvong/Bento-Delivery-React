import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  IconButton,
  Skeleton,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import { Stack } from "@mui/system";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { GoogleApi } from "api-manage/hooks/react-query/googleApi";
import { useGetOrderCancelReason } from "api-manage/hooks/react-query/order/useGetOrderCancelReason";
import { hasChatAndReview } from "components/my-orders/order-details/other-order/StoreDetails";
import { getGuestId, getToken } from "helper-functions/getToken";
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
import usePostOrderCancel from "../../../api-manage/hooks/react-query/order/usePostOrderCancel";
import CustomModal from "../../modal";
import TrackSvg from "../assets/TrackSvg";
import { OrderStatusButton } from "../myorders.style";
import CancelOrder from "./CenacelOrder";
import DigitalPaymentManage from "./DigitalPaymentManage";
import OfflineOrderDetailsModal from "./offline-order/OfflineOrderDetailsModal";
import PaymentUpdate from "./other-order/PaymentUpdate";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import usePostParcelReturn from "api-manage/hooks/react-query/order/usePostParcelReturn";
import LoadingButton from "@mui/lab/LoadingButton";

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
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();

  const { orderDetailsModal, offlineInfoStep } = useSelector(
    (state) => state.offlinePayment
  );
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [cancelOpenModal, setCancelOpenModal] = useState(false);
  const [openModalForPayment, setModalOpenForPayment] = useState();
  const [cancelReason, setCancelReason] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [returnFareOpenModal, setReturnFareOpenModal] = useState(false);
  const [openModalOffline, setOpenModelOffline] = useState(orderDetailsModal);
  const [parcelReceiveModal, setParcelReceiveModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const dispatch = useDispatch();
  const { mutate: postParcelReturnMutation, isLoading: postParcelReturnLoading } = usePostParcelReturn();

   const handlePostParcelReturn = () => {
    const formData = {
      guest_id: getGuestId(),
      order_id: id,
      order_status: "returned",
      return_otp: trackData?.parcel_cancellation?.return_otp,
    };
    postParcelReturnMutation(formData, {
      onSuccess: (res) => {
        toast.success(res?.message);
        setParcelReceiveModal(false);
        refetchOrderDetails();
        refetchTrackData();
      },
      onError: onErrorResponse,
    });
  };



  const buttonBackgroundColor = () => {
    if (trackData?.order_status === "pending") {
      return theme.palette.info.main;
    }
    if (trackData?.order_status === "confirmed") {
      return theme.palette.footer.inputButtonHover;
    }
    if (
      trackData?.order_status === "processing" ||
      trackData?.order_status === "handover" ||
      trackData?.order_status === "picked_up" ||
      trackData?.order_status === "accepted"
    ) {
      return theme.palette.warning.dark;
    }
    if (trackData?.order_status === "delivered") {
      return theme.palette.primary.main;
    }
    if (trackData?.order_status === "canceled") {
      return theme.palette.error.main;
    }
    if (
      trackData?.order_status === "refund_requested" ||
      trackData?.order_status === "refund_request_canceled"
    ) {
      return theme.palette.error.main;
    }
    if (trackData?.order_status === "refunded") {
      return theme.palette.primary.main;
    }
    if (trackData?.order_status === "failed") {
      return theme.palette.error.main;
    }
    if (trackData?.order_status === "returned") {
      return theme.palette.primary.main;
    }
  };
  const fontColor = () => {
    if (trackData?.order_status === "pending") {
      return theme.palette.info.main;
    }
    if (trackData?.order_status === "processing") {
      return theme.palette.warning.dark;
    }
    if (trackData?.order_status === "delivered") {
      return theme.palette.primary.main;
    }
    if (trackData?.order_status === "canceled") {
      return theme.palette.error.main;
    }
  };
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


  const { data: cancelReasonsData, refetch } = useGetOrderCancelReason(trackData?.module_type, trackData?.order_status);
  useEffect(() => {
    refetch().then();
  }, [trackData?.order_status]);

  const { mutate: orderCancelMutation, isLoading: orderLoading } =
    usePostOrderCancel();
  const handleOnSuccess = () => {
      const handleSuccess = (response) => {
        refetchOrderDetails();
        refetchTrackData();
        setCancelOpenModal(false);
        setReturnFareOpenModal(false)
        toast.success(response.message);
      };
      const formData = {
        guest_id: getGuestId(),
        order_id: id,
        reason: cancelReason,
        note: additionalInfo,
        _method: "put",
      };
      orderCancelMutation(formData, {
        onSuccess: handleSuccess,
        onError: onErrorResponse,
      });

  };

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
  const capitalizeText = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const getReturnFee = () => {
  const totalFee = trackData?.order_amount - trackData?.dm_tips;
  const returnFeePercent = Number(configData?.parcel_cancellation_basic_setup?.return_fee || 0);
  return (totalFee * returnFeePercent) / 100;
};
  return (
    // <HeadingBox>
    <CustomStackFullWidth
      alignItems="center"
      justifyContent="space-between"
      direction="row"
      padding={{
        xs: "0px 0px 5px 0px",
        sm: "30px 20px 20px 25px",
        md: "30px 20px 20px 25px",
      }}
      rowGap="10px"
      flexWrap="wrap"
    >
      <Stack spacing={{ xs: 1, md: 1 }} flexGrow="1">
        {dataIsLoading ? (
          <Skeleton variant="text" width="150px" />
        ) : (
          <Typography fontSize={{ xs: "12px", md: "16px" }} fontWeight="600">
            {t("Order ID:")}
            <Typography
              component="span"
              fontSize={{ xs: "12px", md: "16px" }}
              fontWeight="600"
              marginLeft="5px"
            >
              {data?.[0]?.order_id ? data?.[0]?.order_id : data?.id}
            </Typography>
            <Typography
              component="span"
              fontSize="12px"
              sx={{
                textTransform: "capitalize",
                padding: "4px",
                marginLeft: "15px",
                borderRadius: "3px",
                backgroundColor: buttonBackgroundColor(),
                color: (theme) => theme.palette.whiteContainer.main,
                fontWeight: "600",
              }}
            >
              {t(capitalizeText(trackData?.order_status))}
            </Typography>
            <Typography
              component="span"
              fontSize="12px"
              sx={{
                textTransform: "capitalize",
                padding: "4px",
                marginLeft: "15px",
                borderRadius: "3px",
                backgroundColor: (theme) => theme.palette.neutral[400],
                color: (theme) => theme.palette.whiteContainer.main,
                fontWeight: "600",
              }}
            >
              {t(capitalizeText(trackData?.order_type))}
            </Typography>
          </Typography>
        )}

        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={0.5}
        >
          <Typography
            fontSize={{ xs: "10px", md: "12px" }}
            fontWeight="600"
            color={theme.palette.neutral[500]}
            marginRight="1rem"
          >
            {t("Order date:")}
            <Typography
              component="span"
              fontSize={{ xs: "10px", md: "12px" }}
              fontWeight="500"
              marginLeft="5px"
              color={theme.palette.neutral[600]}
            >
              {moment(trackData?.created_at)?.format("DD MMM, YYYY")}
            </Typography>
          </Typography>

          {trackData?.module_type === "food" && (
            <Stack
              direction="row"
              borderLeft={!isSmall && `2px solid ${theme.palette.neutral[400]}`}
              paddingLeft={!isSmall && "1rem"}
              alignItems="center"
              spacing={1}
            >
              {" "}
              <TrackSvg />
              <Typography
                color={theme.palette.primary.main}
                fontSize={{ xs: "10px", md: "12px" }}
                fontWeight="500"
              >
                {t("Estimated delivery:")}{" "}
                <Typography
                  fontSize={{ xs: "10px", md: "12px" }}
                  fontWeight="500"
                  component="span"
                >
                  {handleTime()}
                </Typography>
                <Typography
                  color="primary"
                  fontSize={{ xs: "10px", md: "12px" }}
                  fontWeight="500"
                >
                  {t("min")}
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

      {trackData?.order_status === "refund_requested" && trackData?.refund && (
        <Stack>
          <OrderStatusButton
            background={
              trackData?.refund?.refund_status === "pending"
                ? theme.palette.info.main
                : theme.palette.error.main
            }

            // color={theme.palette.whiteContainer}
          >
            {`Refund ${trackData?.refund?.refund_status}`}
          </OrderStatusButton>
        </Stack>
      )}
      {trackData?.order_status === "refund_requested" &&
        trackData?.refund_cancellation_note && (
          <Stack>
            <OrderStatusButton
              background={alpha(theme.palette.error.light, 0.3)}
              onClick={() => setOpenModal(true)}
              // color={theme.palette.whiteContainer}
            >
              {trackData?.refund_cancellation_note}
            </OrderStatusButton>
          </Stack>
        )}

      {data &&
        !data?.[0]?.item_campaign_id &&
        trackData &&
        (trackData?.order_status === "delivered" ||
          trackData?.order_status === "returned") &&
        getToken() &&
        data?.length > 0 &&
        hasChatAndReview(trackData?.store)?.isReview === 1 && (
          <Stack direction="row" spacing={0.5}>
            <Link href={`/rate-and-review/${id}`}>
              <Button
                variant="outlined"
                background={theme.palette.error.light}
                // color={theme.palette.whiteContainer}
                sx={{
                  [theme.breakpoints.down("md")]: {
                    padding: "5px 5px",
                    fontSize: "10px",
                  },
                }}
              >
                {" "}
                {isSmall ? t("Review") : t("Give a review")}
                {/*{t("Give a review")}*/}
              </Button>
            </Link>
            {configData?.refund_active_status && getToken() && (
              <OrderStatusButton
                background={theme.palette.error.light}
                onClick={() => setOpenModal(true)}
                // color={theme.palette.whiteContainer}
              >
                {isSmall ? t("Refund") : t("Refund Request")}
              </OrderStatusButton>
            )}
          </Stack>
        )}
      {trackData &&
      trackData?.payment_method === "digital_payment" &&
      trackData?.payment_status === "unpaid" &&
      zoneData?.data?.zone_data?.[0]?.cash_on_delivery ? (
        <OrderStatusButton
          background={theme.palette.primary.main}
          onClick={() => setModalOpenForPayment(true)}
          // color={theme.palette.whiteContainer}
        >
          {isSmall ? t("Switch to COD") : t("Switch to cash on delivery")}
        </OrderStatusButton>
      ) : (
        <>
          {trackData && trackData?.order_status === "failed" ? (
            <PaymentUpdate
              id={id}
              refetchOrderDetails={refetch}
              refetchTrackData={refetchTrackData}
              trackData={trackData}
              isSmall={isSmall}
            />
          ) : (
            <>
              {trackData?.module_type === "parcel" &&
              trackData.order_status === "canceled" ? (
                <>
                  {trackData?.order_status === "canceled" &&
                  trackData?.charge_payer === "sender" &&
                  trackData?.parcel_cancellation?.before_pickup === 0 ? (
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap={4}
                      padding="10px 10px"
                      backgroundColor={theme.palette.neutral[300]}
                      borderRadius="10px"
                    >
                      <Stack direction="row" alignItems="center" gap={2}>
                        <Typography>{t("Parcel Returned OTP")}</Typography>
                        <Typography fontSize="20px" fontWeight="700">
                          {trackData?.parcel_cancellation?.return_otp}
                        </Typography>
                      </Stack>
                      <Button
                        sx={{ padding: "8px 10px", fontSize: "12px" }}
                        variant="contained"
                        onClick={() => setParcelReceiveModal(true)}
                      >
                        {"Parcel Received"}
                      </Button>
                    </Stack>
                  ) : (
                    <>
                      {configData?.parcel_cancellation_status === 1 &&
                        trackData?.order_status !== "canceled" &&
                        trackData?.order_status !== "delivered" && (
                          <OrderStatusButton
                            background={theme.palette.error.deepLight}
                            onClick={() => setCancelOpenModal(true)}
                          >
                            {t("Cancel Order")}
                          </OrderStatusButton>
                        )}
                    </>
                  )}
                </>
              ) : (
                (getToken() && trackData?.module_type === "parcel"
                  ? ["pending", "confirmed", "picked_up"].includes(
                      trackData?.order_status
                    )
                  : trackData?.order_status === "pending") && (
                  <OrderStatusButton
                    background={theme.palette.error.deepLight}
                    onClick={() => setCancelOpenModal(true)}
                  >
                    {t("Cancel Order")}
                  </OrderStatusButton>
                )
              )}
            </>
          )}
        </>
      )}
      <CustomModal
        openModal={orderDetailsModal}
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
        />
      </CustomModal>

      <CustomModal
        openModal={cancelOpenModal}
        setModalOpen={setCancelOpenModal}
        handleClose={() => setCancelOpenModal(false)}
      >
        <CancelOrder
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
          cancelReasonsData={cancelReasonsData}
          setModalOpen={setCancelOpenModal}
          handleOnSuccess={handleOnSuccess}
          orderLoading={orderLoading}
          additionalInfo={additionalInfo}
          setAdditionalInfo={setAdditionalInfo}
          isParcel={trackData?.module_type === "parcel"}
          orderStatus={trackData?.order_status}
          setReturnFareOpenModal={setReturnFareOpenModal}
          configData={configData}
          loading={orderLoading}
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
        />
      </CustomModal>
      <CustomModal
        openModal={returnFareOpenModal}
        setModalOpen={setReturnFareOpenModal}
        handleClose={() => setReturnFareOpenModal(false)}
      >
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          p={4}
          maxWidth="400px"
          width="100%"
          backgroundColor={theme.palette.neutral[100]}
        >
          {trackData?.charge_payer === "sender" ? (
            <>
              <Typography fontSize="12px" align="center">
                {t(
                  "If you cancel, your parcel will be back to you when rider will be available. You will have to pay a return fee to your delivery man."
                )}
              </Typography>
              <Stack alignItems="center">
                <Typography fontSize="32px" fontWeight={"bold"}>
                  {getAmountWithSign(getReturnFee())}
                </Typography>
                <Typography fontSize="12px">{t("Return Fare")}</Typography>
              </Stack>
              <Button
                loading={orderLoading}
                variant="contained"
                onClick={handleOnSuccess}
              >
                {t("Yes,Cancel")}
              </Button>
              <Typography
                onClick={() => setReturnFareOpenModal(false)}
                fontWeight="600"
                sx={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "#000",
                }}
                variant="body2"
              >
                {t("Continue Delivery")}
              </Typography>
            </>
          ) : (
            <>
              <Typography fontSize="12px" align="center">
                {t(
                  "If you cancel, your parcel will be back to you when rider will be available. You will have to pay a return fee to your delivery man."
                )}
              </Typography>
              <Stack alignItems="center">
                <Typography fontSize="32px" fontWeight={"bold"}>
                  {getAmountWithSign(
                    Number(getReturnFee()) + Number(data?.order_amount)
                  )}
                </Typography>
                <Typography fontSize="12px">
                  {t("Parcel Delivery Charge + Return Fare")}
                </Typography>
              </Stack>
              <LoadingButton
                loading={orderLoading}
                variant="contained"
                onClick={handleOnSuccess}
              >
                {t("Yes,Cancel")}
              </LoadingButton>
              <Typography
                onClick={() => setReturnFareOpenModal(false)}
                fontWeight="600"
                sx={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "#000",
                }}
                variant="body2"
              >
                {t("Continue Delivery")}
              </Typography>
            </>
          )}
        </Stack>
      </CustomModal>
      <CustomModal
        openModal={parcelReceiveModal}
        setModalOpen={setParcelReceiveModal}
        handleClose={() => setParcelReceiveModal(false)}
      >
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          p={4}
          maxWidth="400px"
          width="100%"
          backgroundColor={theme.palette.neutral[100]}
        >
          <InfoIcon
            sx={{
              fontSize: "3rem",
            }}
            color="error"
          />
          <Typography fontSize="1rem" fontWeight="700">
            {t("Have you received your parcel?")}
          </Typography>
          <Typography align="center">
            {t(
              "Please confirm only if the parcel has arrived and everything is in order"
            )}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handlePostParcelReturn}>
              {t("Yes,Received")}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => setParcelReceiveModal(false)}
            >
              {t("No,Cancel")}
            </Button>
          </Stack>
        </Stack>
      </CustomModal>
      <CustomModal
        openModal={openReviewModal}
        handleClose={() => setOpenReviewModal(false)}
      ></CustomModal>
    </CustomStackFullWidth>
    // </HeadingBox>
  );
};

export default TopDetails;
