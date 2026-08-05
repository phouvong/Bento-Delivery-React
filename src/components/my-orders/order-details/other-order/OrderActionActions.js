import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import useBookingRelation from "api-manage/hooks/custom-hooks/useBookingRelation";
import { GoogleApi } from "api-manage/hooks/react-query/googleApi";
import { useGetOrderCancelReason } from "api-manage/hooks/react-query/order/useGetOrderCancelReason";
import usePostOrderCancel from "api-manage/hooks/react-query/order/usePostOrderCancel";
import usePostParcelReturn from "api-manage/hooks/react-query/order/usePostParcelReturn";
import CustomDivider from "components/CustomDivider";
import useDownloadServiceInvoice from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/useDownloadServiceInvoice";
import CustomModal from "components/modal";
import { OrderStatusButton } from "components/my-orders/myorders.style";
import { hasChatAndReview } from "components/my-orders/order-details/other-order/StoreDetails";
import RateAndReview from "components/review/RateAndReview";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getGuestId, getToken } from "helper-functions/getToken";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import CancelOrder from "../CenacelOrder";

const OrderActionActions = ({
  trackData,
  data,
  configData,
  id,
  refetchOrderDetails,
  refetchTrackData,
  setOpenModal,
  isBooking,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { isParentRepeatBooking } = useBookingRelation({ isBooking, data });
  // Matches TopDetails.js's isServiceBooking: route-level isBooking doesn't
  // catch every service-module order (e.g. trackData surfaced through the
  // generic orders flow), so also check the actual module_type.
  const isServiceBooking =
    isBooking === true || trackData?.module_type === "service";

  const [cancelOpenModal, setCancelOpenModal] = useState(false);
  const [cancelReason, setCancelReason] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const [returnFareOpenModal, setReturnFareOpenModal] = useState(false);
  const [parcelReceiveModal, setParcelReceiveModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);

  const { mutate: downloadInvoice, isLoading: isDownloading } =
    useDownloadServiceInvoice();

  const handleDownload = () => {
    if (!id || isDownloading) return;
    downloadInvoice(id);
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

  const { data: cancelReasonsData, refetch: refetchCancelReasons } =
    useGetOrderCancelReason(trackData?.module_type, trackData?.order_status);
  useEffect(() => {
    if (isBooking) return;
    refetchCancelReasons().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackData?.order_status, isBooking]);

  const { mutate: orderCancelMutation, isLoading: orderLoading } =
    usePostOrderCancel();
  const { mutate: postParcelReturnMutation } = usePostParcelReturn();

  const handleOnSuccess = () => {
    const handleSuccess = (response) => {
      refetchOrderDetails();
      refetchTrackData();
      setCancelOpenModal(false);
      setReturnFareOpenModal(false);
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
  const getReturnFee = () => {
    const totalFee = trackData?.order_amount - trackData?.dm_tips;
    const returnFeePercent = Number(
      configData?.parcel_cancellation_basic_setup?.return_fee || 0
    );
    return (totalFee * returnFeePercent) / 100;
  };

  const cancelLabel =
    trackData?.module_type === "parcel" ||
    trackData?.module?.module_type === "parcel"
      ? t("Cancel Parcel")
      : t("Cancel Order");

  const CancelPillButton = () => (
    <Box
      onClick={() => setCancelOpenModal(true)}
      sx={{
        width: "100%",
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "12px",
        padding: "14px",
        backgroundColor: alpha(theme.palette.error.main, 0.1),
      }}
    >
      <Typography fontWeight="700" color={theme.palette.error.main}>
        {cancelLabel}
      </Typography>
    </Box>
  );

  return (
    <>
      <Stack spacing={{ xs: 1.25, md: 1.5 }}>
        {isBooking &&
          !isParentRepeatBooking &&
          (trackData?.order_status ?? "").toLowerCase() !== "pending" && (
            <Stack sx={{ width: "100%", pt: "10px" }}>
              <OrderStatusButton
                fullWidth
                onClick={handleDownload}
                disabled={isDownloading}
                background={theme.palette.primary.main}
                startIcon={
                  isDownloading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <ReceiptLongOutlinedIcon fontSize="small" />
                  )
                }
              >
                {t("Download Invoice")}
              </OrderStatusButton>
            </Stack>
          )}
        {trackData?.order_status === "refund_requested" &&
          trackData?.refund && (
            <Stack>
              <OrderStatusButton
                background={
                  trackData?.refund?.refund_status === "pending"
                    ? theme.palette.info.main
                    : theme.palette.error.main
                }
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
              >
                {trackData?.refund_cancellation_note}
              </OrderStatusButton>
            </Stack>
          )}
        {isBooking &&
          !isParentRepeatBooking &&
          (data?.booking_status ?? "").toLowerCase() === "completed" &&
          !data?.is_reviewed &&
          !data?.is_custom &&
          !data?.is_campaign && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="stretch"
              sx={{ width: "100%", pt: "10px" }}
            >
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setOpenReviewModal(true)}
                sx={{
                  flex: 1,
                  [theme.breakpoints.down("md")]: {
                    padding: "5px 10px",
                    fontSize: "12px",
                  },
                }}
              >
                {isSmall ? t("Review") : t("Give a review")}
              </Button>
            </Stack>
          )}
        {!isServiceBooking &&
          data &&
          !data?.[0]?.item_campaign_id &&
          trackData &&
          (trackData?.order_status === "delivered" ||
            trackData?.order_status === "returned") &&
          getToken() &&
          data?.length > 0 &&
          hasChatAndReview(trackData?.store)?.isReview === 1 && (
            <Stack direction="column" spacing={1}>
              {/* Hide once the order has been reviewed — the refund button
                  below must stay available regardless. */}
              {!trackData?.is_reviewed && (
                <Button
                  variant="outlined"
                  background={theme.palette.error.light}
                  sx={{
                    [theme.breakpoints.down("md")]: {
                      padding: "5px 5px",
                      fontSize: "10px",
                    },
                  }}
                  onClick={() => setOpenReviewModal(true)}
                >
                  {" "}
                  {isSmall ? t("Review") : t("Give a review")}
                </Button>
              )}

              {configData?.refund_active_status && getToken() && (
                <OrderStatusButton
                  background={theme.palette.error.light}
                  onClick={() => setOpenModal(true)}
                >
                  {isSmall ? t("Refund") : t("Refund Request")}
                </OrderStatusButton>
              )}
            </Stack>
          )}

        {!isBooking &&
          (trackData &&
          trackData?.payment_method === "digital_payment" &&
          trackData?.payment_status === "unpaid" &&
          zoneData?.data?.zone_data?.[0]?.cash_on_delivery ? null : (
            <Box>
              {trackData &&
              trackData?.order_status === "failed" &&
              !getToken() ? (
                <CancelPillButton />
              ) : (
                <>
                  {trackData?.module_type === "parcel" &&
                  (trackData.order_status === "canceled" ||
                    trackData.order_status === "failed") ? (
                    <>
                      {trackData?.order_status === "canceled" &&
                      trackData?.charge_payer === "sender" &&
                      trackData?.parcel_cancellation?.before_pickup === 0 ? (
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
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
                            {t("Parcel Received")}
                          </Button>
                        </Stack>
                      ) : (
                        <>
                          {configData?.parcel_cancellation_status === 1 &&
                            trackData?.order_status !== "canceled" &&
                            trackData?.order_status !== "delivered" && (
                              <CancelPillButton />
                            )}
                        </>
                      )}
                    </>
                  ) : (
                    (trackData?.module_type === "parcel"
                      ? ["pending", "confirmed", "picked_up"].includes(
                          trackData?.order_status
                        )
                      : trackData?.order_status === "pending" ||
                        trackData?.order_status === "failed") && (
                      <CancelPillButton />
                    )
                  )}
                </>
              )}
            </Box>
          ))}
      </Stack>

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
                  color: theme.palette.neutral[1000],
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
                  color: theme.palette.neutral[1000],
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
            // review and the "Give a review" button disappears immediately.
            refetchTrackData?.();
            refetchOrderDetails?.();
          }}
          data={data}
          isServiceBooking={isBooking}
        />
      </Drawer>
    </>
  );
};

export default OrderActionActions;
