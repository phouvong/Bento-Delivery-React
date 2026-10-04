import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Drawer,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ProfileApi } from "api-manage/another-formated-api/profileApi";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "api-manage/api-error-response/ErrorResponses";
import { baseUrl } from "api-manage/MainApi";
import { GoogleApi } from "api-manage/hooks/react-query/googleApi";
import useGetOfflinePaymentOptions from "api-manage/hooks/react-query/offlinePayment/useGetOfflinePaymentOptions";
import { useUpdatePaymentByWallet } from "api-manage/hooks/react-query/useUpdatePaymentByWallet";
import PaymentMethod from "components/checkout/PaymentMethod";
import StatusBadge from "components/common/StatusBadge";
import useServiceBookingPayment from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/booking/useServiceBookingPayment";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getGuestId, getToken } from "helper-functions/getToken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery } from "react-query";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { getDigitalMethodFromZone } from "utils/CustomFunctions";
import CustomModal from "../../../modal";
import CashSvg from "../../assets/CashSvg";
import OfflineOrderDenied from "../offline-order/OfflineOrderDenied";
import OfflineOrderDetails from "../offline-order/OfflineOrderDetails";
import OfflinePaymentEdit from "../offline-order/OfflinePaymentEdit";

const PaymentSummaryCard = ({
  t,
  summaryData,
  data,
  isBooking,
  isPaymentFailed,
  setOpenPaymentMethod,
  handlePayment,
  repayOrderLoading,
  refetchTrackOrder,
  configData,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const [openOfflineDetails, setOpenOfflineDetails] = useState(false);
  const [openOfflineModal, setOpenOfflineModal] = useState(false);
  const [partialWithOffline, setPartialWithOffline] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethodImage, setPaymentMethodImage] = useState(null);
  const [changeAmount, setChangeAmount] = useState("");
  const token = getToken();
  const guestId = getGuestId();

  useEffect(() => {
    if (summaryData?.offline_payment !== null) {
      setPartialWithOffline(true);
    }
  }, []);


  const currentLatLng =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("currentLatLng"))
      : null;
  const { data: zoneData } = useQuery(
    ["zoneId", currentLatLng],
    () => GoogleApi.getZoneId(currentLatLng),
    {
      retry: 1,
      enabled: openPaymentModal && Boolean(currentLatLng?.lat && currentLatLng?.lng),
    }
  );
  const {
    data: offlinePaymentOptions,
    refetch: refetchOfflinePaymentOptions,
  } = useGetOfflinePaymentOptions();
  const { data: customerData } = useQuery(
    ["profile-info"],
    ProfileApi.profileInfo,
    { enabled: openPaymentModal, onError: onSingleErrorResponse }
  );

  useEffect(() => {
    if (openPaymentModal) {
      refetchOfflinePaymentOptions();
    }
  }, [openPaymentModal, refetchOfflinePaymentOptions]);


  const isZoneDigital = isBooking
    ? (zoneData?.data?.zone_data?.[0] ?? {
        cash_on_delivery: Boolean(configData?.cash_on_delivery),
        digital_payment: Boolean(configData?.digital_payment_info?.digital_payment),
        offline_payment: Boolean(configData?.offline_payment_status === 1),
      })
    : getDigitalMethodFromZone(summaryData?.store?.zone_id, zoneData?.data);
  const walletBalance = customerData?.data?.wallet_balance;

  const { mutate: walletPaymentMutation } = useUpdatePaymentByWallet();
  const { mutate: bookingPaymentMutation, isLoading: isSwitchingToCash } =
    useServiceBookingPayment();

  const handleRetrySuccess = (response) => {
    toast.success(response?.message ?? response?.data?.message);
    refetchTrackOrder?.();
  };

  const canSwitchToCashAfterService =
    isBooking &&
    summaryData?.payment_status === "unpaid" &&
    (summaryData?.payment_method === "digital_payment" ||
      summaryData?.payment_method === "offline_payment");

  const handleSwitchToCashAfterService = () => {
    bookingPaymentMutation(
      {
        booking_id: data?.id,
        payment_method: "cash_after_service",
        ...(!token && guestId ? { guest_id: guestId } : {}),
      },
      { onSuccess: handleRetrySuccess, onError: onErrorResponse },
    );
  };

  const failedOrderPlace = () => {
    setOpenPaymentModal(false);

    if (isBooking) {
      if (paymentMethod === "cash_on_delivery" || paymentMethod === "wallet") {
        const resolvedMethod =
          paymentMethod === "cash_on_delivery" ? "cash_after_service" : "wallet";
        // Re-selecting the booking's current payment method is a no-op —
        // don't hit the API again.
        if (resolvedMethod === summaryData?.payment_method) {
          toast.error(t("This is already your selected payment method"));
          return;
        }
        bookingPaymentMutation(
          {
            booking_id: data?.id,
            payment_method: resolvedMethod,
            ...(!token && guestId ? { guest_id: guestId } : {}),
          },
          { onSuccess: handleRetrySuccess, onError: onErrorResponse }
        );
      } else if (paymentMethod === "offline_payment") {
        // Collect the transaction proof via the same OfflineForm used at
        // checkout, instead of registering just the method_id directly.
        router.push(
          {
            pathname: "/service/checkout",
            query: {
              method: "offline",
              booking_id: data?.id,
              amount: summaryData?.order_amount,
            },
          },
          undefined,
          { shallow: true }
        );
      } else if (paymentMethod) {
        const callbackUrl = `${window.location.origin}${router.asPath}`;
        bookingPaymentMutation(
          {
            booking_id: data?.id,
            payment_method: "digital_payment",
            payment_gateway: paymentMethod,
            payment_platform: "web",
            callback: callbackUrl,
            ...(!token && guestId ? { guest_id: guestId } : {}),
          },
          {
            onSuccess: (payRes) => {
              const redirectLink =
                payRes?.data?.redirect_link ?? payRes?.redirect_link;
              if (redirectLink) {
                router.push(redirectLink);
              } else {
                handleRetrySuccess(payRes);
              }
            },
            onError: onErrorResponse,
          }
        );
      }
      return;
    }

    if (paymentMethod === "cash_on_delivery") {
      handlePayment();
    } else if (paymentMethod === "wallet") {
      walletPaymentMutation(
        { order_id: summaryData?.id, _method: "POST" },
        { onSuccess: handleRetrySuccess, onError: onErrorResponse }
      );
    } else if (paymentMethod === "offline_payment") {
      router.push(
        {
          pathname: "/checkout",
          query: {
            page: "cart",
            method: "offline",
            incomplete_payment: true,
            order_id: summaryData?.id,
          },
        },
        undefined,
        { shallow: true }
      );
    } else if (paymentMethod) {
      const callbackUrl = `${window.location.origin}/profile?page=my-orders`;
      const url = `${baseUrl}/payment-mobile?order_id=${summaryData?.id}&customer_id=${customerData?.data?.id}&payment_platform=web&callback=${encodeURIComponent(
        callbackUrl
      )}&payment_method=${paymentMethod}`;
      router.push(url, undefined, { shallow: true });
    }
  };

  const handleClickOffline = () => {
    setOpenOfflineDetails((prev) => !prev);
  };

  const buttonBackgroundColor = () => {
    if (summaryData?.offline_payment?.data?.status === "denied") {
      return `${alpha(theme.palette.error.deepLight, 0.9)}`;
    } else if (summaryData?.offline_payment?.data?.status === "unpaid") {
      return theme.palette.info.main;
    } else if (summaryData?.offline_payment?.data?.status === "verified") {
      return theme.palette.success.main;
    } else {
      return theme.palette.warning.lite;
    }
  };

  const closePaymentModalButton = (
    <IconButton
      onClick={() => setOpenPaymentModal(false)}
      sx={{
        zIndex: 99,
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
      <CloseIcon sx={{ fontSize: "16px", fontWeight: "500" }} />
    </IconButton>
  );

  const paymentMethodNode = (
    <PaymentMethod
      setPaymentMethod={setPaymentMethod}
      paymentMethod={paymentMethod}
      zoneData={zoneData}
      configData={configData}
      orderType={isBooking ? "delivery" : summaryData?.order_type}
      usePartialPayment={false}
      setOpenModel={setOpenPaymentModal}
      forprescription={data?.prescription_order}
      offlinePaymentOptions={offlinePaymentOptions}
      paymentMethodImage={paymentMethodImage}
      setPaymentMethodImage={setPaymentMethodImage}
      setSwitchToWallet={null}
      isZoneDigital={isZoneDigital}
      handlePartialPayment={() => setPaymentMethod("wallet")}
      walletBalance={walletBalance}
      removePartialPayment={null}
      switchToWallet={null}
      customerData={customerData}
      payableAmount={summaryData?.order_amount}
      changeAmount={changeAmount}
      setChangeAmount={setChangeAmount}
      failed
      failedOrderPlace={failedOrderPlace}
    />
  );

  return (
    <Stack>
      <Stack direction="row" alignItems="center" justifyContent="start" gap={1}>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            textTransform: "capitalize",
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          {t("Payment")}
        </Typography>
        <Stack direction="row" alignItems="center" gap="6px">
          <StatusBadge
            status={summaryData?.payment_status}
            label={(() => {
              const s = summaryData?.payment_status?.replace(/_/g, " ") ?? "";
              return s.charAt(0).toUpperCase() + s.slice(1);
            })()}
          />
          {summaryData?.payment_method === "offline_payment" &&
            summaryData?.offline_payment && (
              <Stack
                direction="row"
                alignItems="center"
                gap={0.5}
                onClick={handleClickOffline}
                sx={{ cursor: "pointer" }}
              >
                <Typography
                  component="span"
                  fontSize="11px"
                  sx={{
                    textTransform: "capitalize",
                    px: "8px",
                    py: "2px",
                    borderRadius: "999px",
                    backgroundColor: alpha(buttonBackgroundColor(), 0.14),
                    color: buttonBackgroundColor(),
                    fontWeight: 700,
                    border: `1px solid ${alpha(buttonBackgroundColor(), 0.3)}`,
                  }}
                >
                  {summaryData?.offline_payment?.data?.status}
                </Typography>
                <ExpandMoreIcon
                  sx={{
                    fontSize: "20px",
                    color: theme.palette.neutral[500],
                    transform: openOfflineDetails ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s ease",
                  }}
                />
              </Stack>
            )}
        </Stack>
      </Stack>

      {summaryData?.payment_method ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap="12px"
        >
          <Stack direction="row" alignItems="center" gap="8px">
            <CashSvg />
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: theme.palette.text.primary,
                textTransform: "capitalize",
                lineHeight: 1.4,
              }}
            >
              {t(summaryData?.payment_method.replaceAll("_", " "))}
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              color: theme.palette.text.primary,
            }}
          >
            {getAmountWithSign(summaryData?.order_amount)}
          </Typography>
        </Stack>
      ) : (
        <Skeleton width="100px" variant="text" />
      )}

      {summaryData?.payment_method === "partial_payment" &&
        summaryData?.payments?.length > 0 && (
          <Stack spacing={0.75} sx={{ mt: 1, pl: "28px" }}>
            {summaryData.payments.map((installment, index) => (
              <Stack
                key={installment?.id ?? index}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap="8px"
              >
                <Stack direction="row" alignItems="center" gap="6px">
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: theme.palette.text.secondary,
                      textTransform: "capitalize",
                    }}
                  >
                    {t((installment?.payment_method || "").replaceAll("_", " "))}
                  </Typography>
                  <StatusBadge
                    status={installment?.payment_status}
                    label={(() => {
                      const s =
                        installment?.payment_status?.replace(/_/g, " ") ?? "";
                      return s.charAt(0).toUpperCase() + s.slice(1);
                    })()}
                  />
                </Stack>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  {getAmountWithSign(installment?.amount)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}

      {canSwitchToCashAfterService && (
        <Stack direction="row" width="100%" sx={{ marginTop: "12px" }}>
          <LoadingButton
            variant="outlined"
            fullWidth
            loading={isSwitchingToCash}
            loadingPosition="start"
            startIcon={<span />}
            disabled={isSwitchingToCash}
            onClick={handleSwitchToCashAfterService}
            sx={{
              fontSize: { xs: "12px", md: "14px" },
              px: { xs: 1, md: 2 },
              lineHeight: 1.3,
              "& .MuiLoadingButton-startIconPendingStart": {
                marginRight: { xs: "6px", md: "8px" },
              },
            }}
          >
            {t("Switch to Cash After Service")}
          </LoadingButton>
        </Stack>
      )}

      {isPaymentFailed() && (
        <Typography
          fontSize={{ xs: "12px", md: "13px" }}
          fontWeight="400"
          color={theme.palette.neutral[500]}
        >
          {t(
            "Your payment was incomplete. Please choose an option below to complete your transaction.",
          )}
        </Typography>
      )}
      {isPaymentFailed() && (
        <Stack direction="row" spacing={1} width="100%" sx={{ marginTop: "12px" }}>
          {getToken() && (
            <Button
              variant="contained"
              fullWidth
              onClick={() => setOpenPaymentModal(true)}
            >
              {t("Pay Now")}
            </Button>
          )}
          {!isBooking && (
            <LoadingButton
              variant="outlined"
              loading={repayOrderLoading}
              fullWidth
              onClick={handlePayment}
            >
              {t("Switch to COD")}
            </LoadingButton>
          )}
        </Stack>
      )}

      {openOfflineDetails &&
        (summaryData?.payment_method === "offline_payment" ||
          partialWithOffline) && (
          <OfflineOrderDetails
            trackOrderData={summaryData}
            setOpenOfflineModal={setOpenOfflineModal}
            setOpenPaymentMethod={setOpenPaymentMethod}
            refetchTrackOrder={refetchTrackOrder}
          />
        )}

      {summaryData?.offline_payment?.data?.status === "denied" &&
        summaryData?.payment_method == "offline_payment" && (
          <OfflineOrderDenied trackOrderData={summaryData} />
        )}
      {summaryData?.offline_payment?.data?.status === "denied" &&
        summaryData?.payment_method === "offline_payment" &&
        getToken() && (
          <Stack direction="row" spacing={1} width="100%" marginTop="8px">
            {!isBooking && (
              <LoadingButton
                variant="outlined"
                fullWidth
                loading={repayOrderLoading}
                onClick={handlePayment}
              >
                {t("Switch to COD")}
              </LoadingButton>
            )}
            <Button variant="contained" fullWidth onClick={() => setOpenPaymentModal(true)}>
              {t("Update Payment")}
            </Button>
          </Stack>
        )}

      {openOfflineModal && (
        <CustomModal
          openModal={openOfflineModal}
          handleClose={() => setOpenOfflineModal(false)}
        >
          <CustomStackFullWidth
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            sx={{ position: "relative" }}
          >
            <IconButton
              onClick={() => setOpenOfflineModal(false)}
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
          <OfflinePaymentEdit
            trackOrderData={summaryData}
            refetchTrackOrder={refetchTrackOrder}
            data={data}
            setOpenOfflineModal={setOpenOfflineModal}
            isBooking={isBooking}
          />
        </CustomModal>
      )}

      {openPaymentModal &&
        (isMobile ? (
          <Drawer
            anchor="bottom"
            open={openPaymentModal}
            onClose={() => setOpenPaymentModal(false)}
            sx={{ zIndex: (theme) => theme.zIndex.modal + 50 }}
            PaperProps={{
              sx: {
                borderRadius: "16px 16px 0 0",
                maxHeight: "92vh",
                p: 1.5,
                pt: 3.5,
                overflowY: "auto",
              },
            }}
          >
            {closePaymentModalButton}
            {paymentMethodNode}
          </Drawer>
        ) : (
          <CustomModal
            openModal={openPaymentModal}
            handleClose={() => setOpenPaymentModal(false)}
            minWidth="300px"
            maxWidth="660px"
          >
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              sx={{ position: "relative" }}
            >
              {closePaymentModalButton}
            </CustomStackFullWidth>
            {paymentMethodNode}
          </CustomModal>
        ))}
    </Stack>
  );
};

export default PaymentSummaryCard;
