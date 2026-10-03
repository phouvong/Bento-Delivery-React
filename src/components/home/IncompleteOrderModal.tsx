import React from "react";
import { Stack } from "@mui/system";
import { Button, Typography, alpha } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/styles";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { useDispatch } from "react-redux";
import { setClearCart } from "redux/slices/cart";
import { useMutation } from "react-query";
import { toast } from "react-hot-toast";
import { OrderApi } from "api-manage/another-formated-api/orderApi";
import { getApiMessage } from "api-manage/getApiContent";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import LoadingButton from "@mui/lab/LoadingButton";
import Router from "next/router";
import { getGuestId } from "helper-functions/getToken";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { cod_exceeds_message } from "utils/toasterMessages";
import { resolveFailedPayment } from "helper-functions/failedPayment";
import useMakePayment from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/details/useMakePayment";
import useCancelBooking from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/cancel-booking/useCancelBooking";

interface FailPaymentOrderData {
  order_id: string | number;
  order_amount: number;
  cash_on_delivery?: boolean;
  partially_paid_amount?: number;
  maximum_cod_order_amount?: number;
  module_type?: string;
  module?: { module_type?: string };
}

interface IncompleteOrderModalProps {
  failPaymentOrderData: FailPaymentOrderData;
  setOpenPaymentModal: (open: boolean) => void;
  setOpenIncompleteOrder: (open: boolean) => void;
  dontShowAgain: boolean;
  setDontShowAgain: (value: boolean) => void;
}

const IncompleteOrderModal: React.FC<IncompleteOrderModalProps> = ({
  failPaymentOrderData,
  setOpenPaymentModal,
  setOpenIncompleteOrder,
  dontShowAgain,
  setDontShowAgain,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();

  // Mart sends `order_id`, rental `trip_id` — same endpoint, different shape.
  const failed = resolveFailedPayment(failPaymentOrderData);

  const formData = {
    order_id: failed?.id,
    _method: "put" as const,
    guest_id: getGuestId(),
  };

  const { mutate: paymentMethodUpdateMutation, isLoading: orderLoading } =
    useMutation(
      "order-payment-method-update",
      OrderApi.FailedPaymentMethodUpdate
    );

  const { mutate: cancelMutate, isLoading: cancelLoading } = useMutation(
    "order-payment-method-cancel",
    OrderApi.FailedPaymentMethodCancel
  );
  // A rental trip is not an order: `customer/order/payment-method` and
  // `customer/order/cancel` do not know it. Its equivalents are
  // `rental/user/trip/payment` (cash_payment == COD) and `.../cancel-trip`.
  const { mutate: rentalPayMutate, isLoading: rentalPayLoading } =
    useMakePayment();
  const { mutate: rentalCancelMutate, isLoading: rentalCancelLoading } =
    useCancelBooking();

  // The order mutations hand back an axios response (`data.message`), the
  // rental ones the payload or the envelope itself — reading only one shape
  // left the rental branch with no toast, and the modal open behind the
  // redirect home.
  const handleSuccess = (response: any) => {
    const message = getApiMessage(response);
    if (message) toast.success(message);
    setOpenIncompleteOrder(false);
    dispatch(setClearCart(undefined));
    Router.push("/home", undefined, { shallow: true });
  };

  const handleCancelSuccess = (response: any) => {
    const message = getApiMessage(response);
    if (message) toast.success(message);
    setOpenIncompleteOrder(false);
    dispatch(setClearCart(undefined));
    Router.push("/home", undefined, { shallow: true });
  };

  const handleSwitchToCOD = () => {
    if (!failed?.id) {
      toast.error(t("Order ID is missing"));
      return;
    }
    if (failed.maximumCodAmount <= failed.amount) {
      toast.error(cod_exceeds_message);
      return;
    }
    if (failed.isRental) {
      rentalPayMutate(
        {
          trip_id: failed.id,
          payment_method: "cash_payment",
          payment_gateway: "cash_payment",
          payment_platform: "web",
          guest_id: getGuestId(),
        },
        { onSuccess: handleSuccess, onError: onErrorResponse }
      );
      return;
    }
    paymentMethodUpdateMutation(formData, {
      onSuccess: handleSuccess,
      onError: onErrorResponse,
    });
  };

  const handleCancelOrder = () => {
    if (!failed?.id) {
      toast.error(t("Order ID is missing"));
      return;
    }
    if (failed.isRental) {
      rentalCancelMutate(
        {
          method: "PUT",
          trip_id: failed.id,
          guest_id: getGuestId(),
          cancellation_reason: "Order payment canceled",
        },
        { onSuccess: handleCancelSuccess, onError: onErrorResponse }
      );
      return;
    }
    cancelMutate(
      { ...formData, reason: "Order payment canceled" },
      {
        onSuccess: handleCancelSuccess,
        onError: onErrorResponse,
      }
    );
  };

  if (!failed) {
    return null;
  }

  return (
    <Stack
      padding="30px"
      gap="20px"
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography component="span" fontSize="18px" fontWeight="500">
        {t("Your Payment was")}
        <Typography
          component="span"
          ml={1}
          fontSize="18px"
          fontWeight="500"
          color="error"
        >
          {t("Incomplete")}
        </Typography>
      </Typography>
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"
        width="100%"
        sx={{
          backgroundColor: (theme) => theme.palette.neutral[300],
        }}
        borderRadius="5px"
        padding="10px"
      >
        <Stack justifyContent="space-between">
          <Typography
            fontSize="14px"
            sx={{
              color: (theme) => theme.palette.neutral[500],
            }}
          >
            {t("Booking ID")}
          </Typography>
          <Typography fontWeight="500">
            {failed?.id ?? t("N/A")}
          </Typography>
        </Stack>
        <Stack>
          <Typography
            fontSize="14px"
            sx={{
              color: (theme) => theme.palette.neutral[500],
            }}
          >
            {t("Amount")}
          </Typography>
          <Typography fontWeight="500">
            {failed?.amount ? getAmountWithSign(failed.dueAmount) : t("N/A")}
          </Typography>
        </Stack>
      </Stack>
      <Typography
        textAlign="center"
        sx={{
          color: (theme) => theme.palette.neutral[500],
          maxWidth: "350px",
        }}
      >
        {t(
          "Your payment was incomplete. Please choose an option below to complete your transaction."
        )}
      </Typography>
      <FormControlLabel
        sx={{ alignSelf: "flex-start" }}
        control={
          <Checkbox
            checked={dontShowAgain}
            onChange={(e) => {
              if (e.target.checked) {
                localStorage.setItem(
                  `incomplete_order_hidden_${failed?.id}`,
                  "true"
                );
              } else {
                localStorage.removeItem(
                  `incomplete_order_hidden_${failed?.id}`
                );
              }
              setDontShowAgain(e.target.checked);
            }}
          />
        }
        label={
          <Typography
            fontSize="14px"
            sx={{ color: (theme) => theme.palette.neutral[500] }}
          >
            {t("Don't show this again")}
          </Typography>
        }
      />
      <Button
        fullWidth
        variant="contained"
        onClick={() => {
          setOpenPaymentModal(true);
          setOpenIncompleteOrder(false);
        }}
        disabled={!failed?.id}
      >
        {t("Pay Now")}
      </Button>
      {failed?.cashOnDelivery && (
        <LoadingButton
          loading={orderLoading || rentalPayLoading}
          variant="outlined"
          fullWidth
          onClick={handleSwitchToCOD}
          disabled={!failed?.id || orderLoading || rentalPayLoading}
          sx={{
            backgroundColor: (theme) => alpha(theme.palette.neutral[600], 0.4),
            color: (theme) => theme.palette.neutral[1000],
            borderColor: "transparent",
            // px: "30px",
            // borderRadius: "5px",
            "&:hover": {
              backgroundColor: (theme) =>
                alpha(theme.palette.neutral[200], 0.8),
              color: (theme) => theme.palette.neutral[900],
              borderColor: "transparent",
            },
          }}
        >
          {t("Switch to COD")}
        </LoadingButton>
      )}
      <LoadingButton
        sx={{
          color: (theme) => theme.palette.error.main,
          borderColor: "transparent",
          padding: "0px",
          "&:hover": {
            borderColor: "transparent",
            backgroundColor: "transparent",
            color: (theme) => theme.palette.error.main,
          },
        }}
        variant="text"
        onClick={handleCancelOrder}
        loading={cancelLoading || rentalCancelLoading}
        disabled={!failed?.id || cancelLoading || rentalCancelLoading}
      >
        {failed?.isParcel
          ? t("Cancel Parcel")
          : failed?.isRental
          ? t("Cancel Trip")
          : t("Cancel Order")}
      </LoadingButton>
    </Stack>
  );
};

export default IncompleteOrderModal;
