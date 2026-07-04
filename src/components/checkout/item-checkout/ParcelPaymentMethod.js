import InfoIcon from "@mui/icons-material/Info";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Divider,
  Grid,
  Radio,
  Stack,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/system";
import CustomImageContainer from "components/CustomImageContainer";
import { getToken } from "helper-functions/getToken";
import { t } from "i18next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setOfflineInfoStep,
  setOfflineMethod,
} from "redux/slices/offlinePaymentData";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import PaymentMethodCard from "../PaymentMethodCard";
import cashOnDelivery from "../assets/cod2.svg";
import wallet from "../assets/wallet.svg";

const OfflineButton = styled(Button)(({ theme, value, paymentMethod }) => {
  const isActive = value?.id === paymentMethod?.id;
  return {
    minHeight: "36px",
    padding: "6px 14px",
    borderRadius: "999px",
    textTransform: "none",
    fontSize: "13px",
    fontWeight: 600,
    lineHeight: 1.2,
    border: `1px solid ${
      isActive
        ? theme.palette.primary.main
        : alpha(theme.palette.neutral[400], 0.25)
    }`,
    boxShadow: "none",
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    background: isActive
      ? alpha(theme.palette.primary.main, 0.08)
      : theme.palette.background.paper,
    "&:hover": {
      background: alpha(theme.palette.primary.main, 0.12),
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      boxShadow: "none",
    },
  };
});

// Reusable card wrapper for wallet / COD rows
const PaymentCard = styled(Stack)(({ theme, selected }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  padding: "14px 12px",
  height: "100%",
  borderRadius: "10px",
  cursor: "pointer",
  border: `1px solid ${
    selected
      ? alpha(theme.palette.primary.main, 0.4)
      : alpha(theme.palette.neutral[400], 0.25)
  }`,
  backgroundColor: selected
    ? alpha(theme.palette.primary.main, 0.06)
    : theme.palette.background.paper,
  transition: "border-color 0.15s, background-color 0.15s",
  "&:hover": {
    borderColor: alpha(theme.palette.primary.main, 0.4),
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
}));

const IconCircle = styled(Stack)(({ bgcolor }) => ({
  width: 36,
  height: 36,
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
  backgroundColor: bgcolor,
}));

const ParcelPaymentMethod = (props) => {
  const {
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
    offlinePaymentOptions,
    setPaymentMethodImage,
    getParcelPayment,
    setOpen,
    setSelectedPaymentMethod,
    payableAmount,
    walletBalance,
  } = props;

  const token = getToken();
  const router = useRouter();
  const theme = useTheme();
  const divRef = useRef(null);
  const dispatch = useDispatch();
  const { offlineMethod, offlineInfoStep } = useSelector(
    (state) => state.offlinePayment,
  );
  const [isCheckedOffline, setIsCheckedOffline] = useState(
    offlineMethod !== "" ? true : false,
  );
  const [openOfflineOptions, setOpenOfflineOptions] = useState(false);

  // When user switches away from offline payment, collapse the nested options
  // so the next click on "Pay Offline" opens + selects in one tap.
  useEffect(() => {
    if (!isCheckedOffline) {
      setOpenOfflineOptions(false);
    }
  }, [isCheckedOffline]);

  // ── Derived visibility flags ────────────────────────────────────────────
  const showWallet =
    configData?.customer_wallet_status === 1 &&
    token &&
    paidBy !== "receiver" &&
    forprescription !== "true" &&
    walletBalance > 0;

  const showCOD =
    configData?.cash_on_delivery && getParcelPayment()[0]?.cash_on_delivery;

  // Full-width when the sibling card is absent
  const walletGridSm = showCOD ? 6 : 12;
  const codGridSm = showWallet ? 6 : 12;

  // ── Handlers (unchanged) ────────────────────────────────────────────────
  const handleClickOfflineItem = (item) => {
    dispatch(setOfflineMethod(item));
    dispatch(setOfflineInfoStep(1));
    setIsCheckedOffline(true);
    setPaymentMethod(`offline_payment`);
  };

  const handleClickOffline = () => {
    const next = !openOfflineOptions;
    setOpenOfflineOptions(next);
    if (next) {
      const firstOption = Array.isArray(offlinePaymentOptions)
        ? offlinePaymentOptions?.[0]
        : Object.values(offlinePaymentOptions || {})?.[0];
      if (firstOption && (!offlineMethod || !offlineMethod?.id)) {
        handleClickOfflineItem(firstOption);
      } else if (firstOption) {
        setIsCheckedOffline(true);
        setPaymentMethod("offline_payment");
      }
    }
    divRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const handleOffline = (e) => {
    router.push(
      { pathname: "/checkout", query: { page: "parcel", method: "offline" } },
      undefined,
      { shallow: true },
    );
  };

  return (
    <Stack spacing={0} ref={divRef}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        gap={1}
        pb={2.5}
      >
        <Stack spacing={0.4} sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            fontSize={{ xs: "17px", md: "19px" }}
            fontWeight={700}
            color="text.primary"
            lineHeight={1.2}
          >
            {t("Payment Method")}
          </Typography>
          <Typography fontSize="13px" color="text.secondary">
            {t("Select a payment method to proceed.")}
          </Typography>
        </Stack>

        {payableAmount != null && (
          <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
            <Typography
              fontSize="11px"
              fontWeight={600}
              color="text.secondary"
              sx={{ textTransform: "uppercase", letterSpacing: "0.6px" }}
            >
              {t("Total")}
            </Typography>
            <Typography
              fontSize={{ xs: "17px", md: "19px" }}
              fontWeight={700}
              color="primary.main"
            >
              {getAmountWithSign(payableAmount)}
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* ── Wallet + COD ───────────────────────────────────────────────── */}
      {(showWallet || showCOD) && (
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {/* Wallet */}
          {showWallet && (
            <Grid item xs={12} sm={walletGridSm}>
              <PaymentCard
                selected={paymentMethod === "wallet" ? 1 : 0}
                onClick={() => setPaymentMethod("wallet")}
              >
                <Stack direction="row" alignItems="center" gap={1.25}>
                  <IconCircle
                    bgcolor={
                      theme.palette.customColor?.parcelWallet ||
                      theme.palette.primary.light
                    }
                  >
                    <CustomImageContainer
                      width="20px"
                      height="20px"
                      objectfit="contain"
                      src={wallet.src}
                    />
                  </IconCircle>
                  <Stack spacing={0.25}>
                    <Typography
                      fontSize="14px"
                      fontWeight={600}
                      color="text.primary"
                    >
                      {t("Pay via Wallet")}
                    </Typography>
                    {walletBalance != null && (
                      <Typography
                        fontSize="12px"
                        fontWeight={600}
                        color="primary.main"
                      >
                        {t("Balance")}: {getAmountWithSign(walletBalance)}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
                <Radio
                  sx={{ color: "neutral.400", p: 0 }}
                  checked={paymentMethod === "wallet"}
                  onChange={() => setPaymentMethod("wallet")}
                />
              </PaymentCard>
            </Grid>
          )}

          {/* Cash on delivery */}
          {showCOD && (
            <Grid item xs={12} sm={codGridSm}>
              <PaymentCard
                selected={paymentMethod === "cash_on_delivery" ? 1 : 0}
                onClick={() => setPaymentMethod("cash_on_delivery")}
              >
                <Stack direction="row" alignItems="center" gap={1.25}>
                  <IconCircle bgcolor={theme.palette.primary.main}>
                    <CustomImageContainer
                      width="22px"
                      height="22px"
                      objectfit="contain"
                      src={cashOnDelivery.src}
                    />
                  </IconCircle>
                  <Typography
                    fontSize="14px"
                    fontWeight={600}
                    color="text.primary"
                  >
                    {t("Cash on delivery")}
                  </Typography>
                </Stack>
                <Radio
                  sx={{ color: "neutral.400", p: 0 }}
                  checked={paymentMethod === "cash_on_delivery"}
                  onChange={() => setPaymentMethod("cash_on_delivery")}
                />
              </PaymentCard>
            </Grid>
          )}
        </Grid>
      )}

      {/* ── Pay Via Online ─────────────────────────────────────────────── */}
      {paidBy !== "receiver" &&
        forprescription !== "true" &&
        configData?.digital_payment_info?.digital_payment &&
        getParcelPayment()[0]?.digital_payment && (
          <Stack spacing={1.25} mb={2}>
            <Stack direction="row" alignItems="baseline" gap={0.75}>
              <Typography
                fontSize={{ xs: "13px", md: "14px" }}
                fontWeight={700}
                color="text.primary"
              >
                {t("Pay Via Online")}
              </Typography>
              <Typography fontSize="12px" color="text.secondary">
                ({t("Faster & secure way to pay bill")})
              </Typography>
            </Stack>

            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {configData?.active_payment_method_list?.map((item, index) => (
                <Stack
                  key={index}
                  sx={{
                    flex: "1 1 calc(50% - 6px)",
                    minWidth: "140px",
                    borderRadius: "10px",
                    border: `1px solid ${
                      paymentMethod === item?.gateway
                        ? alpha(theme.palette.primary.main, 0.4)
                        : alpha(theme.palette.neutral[400], 0.25)
                    }`,
                    backgroundColor:
                      paymentMethod === item?.gateway
                        ? alpha(theme.palette.primary.main, 0.06)
                        : theme.palette.background.paper,
                    transition: "border-color 0.15s, background-color 0.15s",
                    px: 1,
                    // neutralise the negative margin inside PaymentMethodCard
                    "& .MuiFormControlLabel-root": {
                      marginInlineStart: 0,
                    },
                  }}
                >
                  <PaymentMethodCard
                    parcel={parcel}
                    paymentType={item?.gateway_title}
                    image={item?.gateway_image_full_url}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    setIsCheckedOffline={setIsCheckedOffline}
                    paidBy={paidBy}
                    type={item?.gateway}
                    digitalPaymentMethodActive={
                      configData?.digital_payment_info?.digital_payment
                    }
                    imageUrl={configData?.base_urls?.gateway_image_url}
                  />
                </Stack>
              ))}
            </Stack>
          </Stack>
        )}

      {/* ── Pay Offline ────────────────────────────────────────────────── */}
      {getParcelPayment()[0]?.offline_payment &&
        typeof offlinePaymentOptions !== "undefined" &&
        Object?.keys(offlinePaymentOptions)?.length !== 0 &&
        configData?.offline_payment_status === 1 &&
        paidBy !== "receiver" && (
          <Stack mb={2.5}>
            <Stack
              sx={{
                padding: "12px 14px",
                borderRadius: "12px",
                cursor: "pointer",
                gap: "12px",
                border: `1px solid ${
                  paymentMethod === "offline_payment"
                    ? alpha(theme.palette.primary.main, 0.4)
                    : alpha(theme.palette.neutral[400], 0.25)
                }`,
                backgroundColor:
                  paymentMethod === "offline_payment"
                    ? alpha(theme.palette.primary.main, 0.06)
                    : theme.palette.background.paper,
                transition: "border-color 0.15s, background-color 0.15s",
              }}
              onClick={handleClickOffline}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={1.25}
                  sx={{ minWidth: 0, flex: 1 }}
                >
                  <Radio
                    sx={{ p: 0, color: "neutral.400" }}
                    checked={isCheckedOffline}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickOffline();
                    }}
                  />
                  <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                    <Typography
                      fontSize="14px"
                      fontWeight={600}
                      color="text.primary"
                    >
                      {t("Pay Offline")}
                    </Typography>
                    <Typography fontSize="12px" color="text.secondary">
                      {t("Select an option from below.")}
                    </Typography>
                  </Stack>
                </Stack>
                <Tooltip
                  placement="left"
                  title="Offline Payment! Now, with just a click of a button, you can make secure transactions. It's simple, convenient, and reliable."
                >
                  <InfoIcon
                    sx={{
                      fontSize: 18,
                      color: "primary.main",
                      flexShrink: 0,
                    }}
                  />
                </Tooltip>
              </Stack>

              {openOfflineOptions && (
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {offlinePaymentOptions?.map((item, index) => (
                    <OfflineButton
                      key={index}
                      value={item}
                      paymentMethod={offlineMethod}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClickOfflineItem(item);
                      }}
                    >
                      <Typography fontSize="12px" textTransform="capitalize">
                        {item.method_name}
                      </Typography>
                    </OfflineButton>
                  ))}
                </Stack>
              )}
            </Stack>
          </Stack>
        )}

      {/* ── Footer buttons ─────────────────────────────────────────────── */}
      <Divider sx={{ mb: 2 }} />
      <Stack direction="row" gap={1.5} justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={() => setOpen(false)}
          sx={{
            minWidth: 90,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            borderColor: theme.palette.divider,
            color: "text.secondary",
            "&:hover": { borderColor: "text.secondary" },
          }}
        >
          {t("Cancel")}
        </Button>

        {paidBy && (
          <LoadingButton
            variant="contained"
            disableElevation
            onClick={() => {
              setSelectedPaymentMethod(paymentMethod);
              setOpen(false);
            }}
            loading={isLoading}
            sx={{
              minWidth: 90,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {t("Update")}
          </LoadingButton>
        )}
      </Stack>
    </Stack>
  );
};

export default ParcelPaymentMethod;
