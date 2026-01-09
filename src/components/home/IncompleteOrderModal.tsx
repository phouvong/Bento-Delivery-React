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
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import LoadingButton from "@mui/lab/LoadingButton";
import Router from "next/router";
import { getGuestId } from "helper-functions/getToken";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { cod_exceeds_message } from "utils/toasterMessages";

interface FailPaymentOrderData {
  order_id: string | number;
  order_amount: number;
  cash_on_delivery?: boolean;
  partially_paid_amount?: number;
  maximum_cod_order_amount?: number;
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

  const formData = {
    order_id: failPaymentOrderData?.order_id,
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

  const handleSuccess = (response: any) => {
    if (response?.data?.message) {
      toast.success(response.data.message);
      setOpenIncompleteOrder(false);
    }
    dispatch(setClearCart(undefined));
    Router.push("/home", undefined, { shallow: true });
  };

  const handleCancelSuccess = (response: any) => {
    if (response?.data?.message) {
      toast.success(response.data.message);
    }
    setOpenIncompleteOrder(false);
    dispatch(setClearCart(undefined));
    Router.push("/home", undefined, { shallow: true });
  };

  const handleSwitchToCOD = () => {
    if (!failPaymentOrderData?.order_id) {
      toast.error(t("Order ID is missing"));
      return;
    }
    if (failPaymentOrderData?.maximum_cod_order_amount > failPaymentOrderData?.order_amount) {
      paymentMethodUpdateMutation(formData, {
        onSuccess: handleSuccess,
        onError: onErrorResponse,
      });
    } else {
      toast.error(cod_exceeds_message);
    }
  };

  const handleCancelOrder = () => {
    if (!failPaymentOrderData?.order_id) {
      toast.error(t("Order ID is missing"));
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

  if (!failPaymentOrderData) {
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
        <Typography component="span" ml={1} fontSize="18px" fontWeight="500" color="error">
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
            {failPaymentOrderData.order_id || t("N/A")}
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
            {failPaymentOrderData.order_amount
              ? getAmountWithSign(failPaymentOrderData?.partially_paid_amount > 0 ? failPaymentOrderData.order_amount - failPaymentOrderData?.partially_paid_amount : failPaymentOrderData.order_amount)
              : t("N/A")
            }
          </Typography>
        </Stack>
      </Stack>
      <Typography
        textAlign="center"
        sx={{
          color: (theme) => theme.palette.neutral[500],
          maxWidth: "350px"
        }}
      >
        {t("Your payment was incomplete. Please choose an option below to complete your transaction.")}
      </Typography>
      <FormControlLabel
        sx={{ alignSelf: "flex-start", }}
        control={
          <Checkbox
            checked={dontShowAgain}
            onChange={(e) => {
              if (e.target.checked) {
                localStorage.setItem(
                  `incomplete_order_hidden_${failPaymentOrderData.order_id}`,
                  "true"
                );
              } else {
                localStorage.removeItem(
                  `incomplete_order_hidden_${failPaymentOrderData.order_id}`
                );
              }
              setDontShowAgain(e.target.checked);
            }}
          />
        }
        label={
          <Typography fontSize="14px" sx={{ color: theme => theme.palette.neutral[500] }}>
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
        disabled={!failPaymentOrderData.order_id}
      >
        {t("Pay Now")}
      </Button>
      {failPaymentOrderData.cash_on_delivery && (
        <LoadingButton
          loading={orderLoading}
          variant="outlined"
          fullWidth
          onClick={handleSwitchToCOD}
          disabled={!failPaymentOrderData.order_id || orderLoading}
          sx={{
            bgcolor: (theme) => alpha(theme.palette.neutral[200], 0.4),
            color: (theme) => theme.palette.neutral[800],
            borderColor: "transparent",
            // px: "30px",
            // borderRadius: "5px",
            "&:hover": {
              bgcolor: (theme) => alpha(theme.palette.neutral[200], 1),
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
        loading={cancelLoading}
        disabled={!failPaymentOrderData.order_id || cancelLoading}
      >
        {t("Cancel Order")}
      </LoadingButton>

    </Stack>
  );
};

export default IncompleteOrderModal;
