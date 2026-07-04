import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  alpha,
  Button,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { t } from "i18next";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import PaymentMethodCard from "../PaymentMethodCard";
import { setOfflineMethod } from "../../../redux/slices/offlinePaymentData";
import { getToken } from "../../../helper-functions/getToken";
import wallet from "../assets/wallet.png";
import money from "../assets/money.png";
import OfflinePaymentIcon from "../assets/OfflinePaymentIcon";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import PartialPayment from "components/checkout/item-checkout/PartialPayment";

// ── Shared styled components ─────────────────────────────────────────────────

// Card wrapper for wallet / COD rows — exported so PartialPayment can reuse it
export const PaymentCard = styled(Stack)(({ theme, selected }) => ({
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

// Backward-compat alias — PartialPayment imports PayButton from this file
export const PayButton = PaymentCard;

const IconCircle = styled(Stack)(({ bgcolor }) => ({
  width: 36,
  height: 36,
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
  backgroundColor: bgcolor,
}));

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

// ── Bring Change Amount ──────────────────────────────────────────────────────

export const BringChangeAmount = ({
  changeAmount,
  setChangeAmount,
  theme,
  expanded,
  setExpanded,
  paymentMethod,
}) => {
  return (
    <Box
      sx={{
        borderRadius: "10px",
        backgroundColor: theme.palette.customColor.ten,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Collapse in={expanded}>
        <Box
          sx={{
            padding: "16px",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "#46494DB3"
                : alpha(theme.palette.neutral[300], 0.7),
            opacity: paymentMethod === "cash_on_delivery" ? 1 : 0.55,
            pointerEvents:
              paymentMethod === "cash_on_delivery" ? "auto" : "none",
          }}
        >
          <Stack
            width="100%"
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            gap="10px"
          >
            <Stack>
              <Typography
                fontSize="12px"
                color={theme.palette.neutral[1000]}
                fontWeight="500"
              >
                {t("Bring Change Instruction")}
              </Typography>
              <Typography
                fontSize="12px"
                color={theme.palette.neutral[600]}
                fontWeight="400"
              >
                {t("Insert amount if you need deliveryman to bring")}
              </Typography>
            </Stack>
            <Stack>
              <Typography
                marginBottom="5px"
                fontSize="12px"
                color={theme.palette.neutral[1000]}
                fontWeight="500"
              >
                {t("Change Amount ($)")}
              </Typography>
              <TextField
                sx={{
                  width: "100%",
                  height: "33px",
                  backgroundColor: theme.palette.neutral[100],
                  borderRadius: "5px",
                  "& .MuiInputBase-input.MuiOutlinedInput-input": {
                    padding: "5.5px 14px",
                  },
                }}
                value={changeAmount}
                onChange={(e) => setChangeAmount(e.target.value)}
              />
            </Stack>
          </Stack>
        </Box>
      </Collapse>

      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          cursor: "pointer",
          textAlign: "center",
          py: 1,
          backgroundColor: theme.palette.customColor.ten,
        }}
      >
        <Typography
          component="span"
          sx={{
            fontSize: "12px",
            color: theme.palette.primary.main,
            fontWeight: "600",
          }}
        >
          {expanded ? t("See less") : t("See more")}
        </Typography>
      </Box>
    </Box>
  );
};

// ── Main component ───────────────────────────────────────────────────────────

const OtherModulePayment = (props) => {
  const {
    paymentMethod,
    setPaymentMethod,
    paidBy,
    forprescription,
    configData,
    orderType,
    parcel,
    setOpenModel,
    usePartialPayment,
    offlinePaymentOptions,
    setPaymentMethodImage,
    isZoneDigital,
    handlePartialPayment,
    walletBalance,
    removePartialPayment,
    switchToWallet,
    customerData,
    payableAmount,
    changeAmount,
    setChangeAmount,
    failed,
    failedOrderPlace,
  } = props;

  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const token = getToken();
  const [openOfflineOptions, setOpenOfflineOptions] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { offlineMethod } = useSelector((state) => state.offlinePayment);
  const [isCheckedOffline, setIsCheckedOffline] = useState(
    offlineMethod !== "",
  );
  const offlineSectionRef = useRef(null);
  const isPartialPaymentActive =
    usePartialPayment && configData?.partial_payment_status === 1;
  const allowCodForPartialPayment =
    (isZoneDigital?.cash_on_delivery &&
      configData?.cash_on_delivery &&
      configData?.partial_payment_method === "both") ||
    configData?.partial_payment_method === "cod";
  const allowDigitalForPartialPayment =
    configData?.partial_payment_method === "digital_payment" ||
    configData?.partial_payment_method === "both" ||
    configData?.partial_payment_method === null ||
    configData?.partial_payment_method === "";

  // ── Derived layout flags ──────────────────────────────────────────────────
  const showWalletCard =
    configData?.customer_wallet_status === 1 &&
    token && customerData?.data?.wallet_balance > 0 

  // COD takes full width when wallet card is absent
  const codFlexBasis = showWalletCard ? "calc(50% - 5px)" : "100%";

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleClickOffline = () => {
    const nextOpen = !openOfflineOptions;
    setOpenOfflineOptions(nextOpen);
    if (nextOpen) {
      setChangeAmount("");
      const firstOption = offlinePaymentOptions?.[0];
      if (firstOption && !offlineMethod) {
        dispatch(setOfflineMethod(firstOption));
        setIsCheckedOffline(true);
        setPaymentMethod("offline_payment");
      }
      requestAnimationFrame(() => {
        offlineSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  };
  const handleClick = (item) => {
    setPaymentMethod(item);
    dispatch(setOfflineMethod(""));
    setIsCheckedOffline(false);
    if (item !== "cash_on_delivery") {
      setChangeAmount("");
    }
  };

  const handleClickOfflineItem = (item) => {
    dispatch(setOfflineMethod(item));
    setIsCheckedOffline(true);
    setPaymentMethod(`offline_payment`);
  };

  const handleSubmit = () => {
    if (failed) {
      failedOrderPlace?.();
    } else {
      setOpenModel(false);
    }
  };

  // Sync expanded with COD selection
  useEffect(() => {
    setExpanded(paymentMethod === "cash_on_delivery");
    if (paymentMethod !== "cash_on_delivery") {
      setChangeAmount("");
    }
  }, [paymentMethod]);

  // Reset offline state on navigation
  useEffect(() => {
    dispatch(setOfflineMethod(""));
    setIsCheckedOffline(false);
  }, [router.pathname]);

  // Fix double-click: reset openOfflineOptions when user switches away from offline
  useEffect(() => {
    if (!isCheckedOffline) {
      setOpenOfflineOptions(false);
    }
  }, [isCheckedOffline]);

  return (
    <CustomStackFullWidth spacing={1} position="relative">
      {/* ── Scrollable body ────────────────────────────────────────────── */}
      <CustomStackFullWidth
        p={{ xs: "0 0 8px", md: "45px 45px 10px 45px" }}
        sx={{
          maxHeight: { xs: "calc(80vh - 100px)", md: "450px" },
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          gap={1}
          mb={2.5}
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
          <Stack alignItems="flex-end" sx={{ pr: { xs: "36px", md: 0 } }}>
            <Typography
              pb="5px"
              fontSize={{ xs: "11px", md: "14px" }}
              fontWeight="500"
            >
              {t("Total Bill")}
            </Typography>
            <Typography
              fontSize={{ xs: "16px", md: "20px" }}
              fontWeight={700}
              color="primary.main"
            >
              {getAmountWithSign(payableAmount)}
            </Typography>
          </Stack>
        </Stack>

        {/* ── Wallet + COD cards ──────────────────────────────────────── */}
        <Stack direction="row" flexWrap="wrap" gap="10px" mb={2}>
          {/* Wallet card */}
          {showWalletCard && (
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 5px)" } }}>
              <PartialPayment
                remainingBalance={
                  customerData?.data?.wallet_balance - payableAmount
                }
                handlePartialPayment={handlePartialPayment}
                usePartialPayment={isPartialPaymentActive}
                walletBalance={customerData?.data?.wallet_balance}
                paymentMethod={paymentMethod}
                switchToWallet={switchToWallet}
                removePartialPayment={removePartialPayment}
                payableAmount={payableAmount}
                failed={failed}
              />
            </Box>
          )}

          {/* Wallet breakdown when partial payment active */}
          {(isPartialPaymentActive || switchToWallet) && (
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 5px)" } }}>
              <PaymentCard
                selected={0}
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "6px",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  gap="10px"
                  width="100%"
                >
                  <Typography
                    fontSize="12px"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    {t("Paid By Wallet")}
                  </Typography>
                  <Typography
                    fontSize="18px"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {getAmountWithSign(
                      paymentMethod === "wallet"
                        ? payableAmount
                        : walletBalance,
                    )}
                  </Typography>
                </Stack>
                {isPartialPaymentActive && (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap="10px"
                    width="100%"
                  >
                    <Typography
                      fontSize="12px"
                      textTransform="capitalize"
                      color="text.primary"
                      fontWeight={600}
                    >
                      {t("Remaining Bill")}
                    </Typography>
                    <Typography
                      fontSize="18px"
                      color="text.primary"
                      fontWeight={500}
                    >
                      {getAmountWithSign(payableAmount - walletBalance)}
                    </Typography>
                  </Stack>
                )}
              </PaymentCard>
            </Box>
          )}

          {/* Partial payment hint */}
          {isPartialPaymentActive && (
            <Box
              sx={{
                flex: "1 1 100%",
                display: "flex",
                justifyContent: "center",
                py: "6px",
              }}
            >
              <Typography fontSize="10px" color="error.main" fontWeight="400">
                {t("* Please select an option to pay the rest of the amount")}
              </Typography>
            </Box>
          )}

          {/* COD card */}
          {isPartialPaymentActive
            ? allowCodForPartialPayment && (
                <Box
                  sx={{ flex: { xs: "1 1 100%", sm: `1 1 ${codFlexBasis}` } }}
                >
                  <PaymentCard
                    selected={paymentMethod === "cash_on_delivery" ? 1 : 0}
                    onClick={() => handleClick("cash_on_delivery")}
                  >
                    <Stack direction="row" alignItems="center" gap={1.25}>
                      <IconCircle bgcolor={theme.palette.primary.main}>
                        <CustomImageContainer
                          src={money.src}
                          width="20px"
                          height="20px"
                          alt="cod"
                          objectfit="contain"
                        />
                      </IconCircle>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        color="text.primary"
                      >
                        {t("Cash On Delivery")}
                      </Typography>
                    </Stack>
                    <Radio
                      sx={{ color: "neutral.400", p: 0 }}
                      checked={paymentMethod === "cash_on_delivery"}
                      onChange={() => handleClick("cash_on_delivery")}
                    />
                  </PaymentCard>
                </Box>
              )
            : isZoneDigital?.cash_on_delivery &&
              configData?.cash_on_delivery && (
                <Box
                  sx={{ flex: { xs: "1 1 100%", sm: `1 1 ${codFlexBasis}` } }}
                >
                  <PaymentCard
                    selected={paymentMethod === "cash_on_delivery" ? 1 : 0}
                    onClick={() => handleClick("cash_on_delivery")}
                  >
                    <Stack direction="row" alignItems="center" gap={1.25}>
                      <IconCircle bgcolor={theme.palette.primary.main}>
                        <CustomImageContainer
                          src={money.src}
                          width="20px"
                          height="20px"
                          alt="cod"
                          objectfit="contain"
                        />
                      </IconCircle>
                      <Typography
                        fontSize="14px"
                        fontWeight={600}
                        color="text.primary"
                      >
                        {t("Cash On Delivery")}
                      </Typography>
                    </Stack>
                    <Radio
                      sx={{ color: "neutral.400", p: 0 }}
                      checked={paymentMethod === "cash_on_delivery"}
                      onChange={() => handleClick("cash_on_delivery")}
                    />
                  </PaymentCard>
                </Box>
              )}

          {/* Bring Change */}
          {isZoneDigital?.cash_on_delivery && !failed && (
            <Box sx={{ flex: "1 1 100%" }}>
              <BringChangeAmount
                changeAmount={changeAmount}
                setChangeAmount={setChangeAmount}
                theme={theme}
                expanded={expanded}
                setExpanded={setExpanded}
                paymentMethod={paymentMethod}
              />
            </Box>
          )}
        </Stack>

        {/* ── Online payment methods ──────────────────────────────────── */}
        {isZoneDigital?.digital_payment &&
          paidBy !== "receiver" &&
          forprescription !== "true" &&
          configData?.digital_payment_info?.digital_payment &&
          (!isPartialPaymentActive || allowDigitalForPartialPayment) && (
            <Stack spacing={1.25} mb={2}>
              <Stack direction="row" alignItems="baseline" gap={0.75}>
                <Typography
                  fontSize={{ xs: "13px", md: "14px" }}
                  fontWeight={700}
                  color="text.primary"
                >
                  {t("Payment Methods")}
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
                      "& .MuiFormControlLabel-root": { marginInlineStart: 0 },
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
                      imageUrl={configData?.base_urls?.gateway_image_url}
                      digitalPaymentMethodActive={
                        configData?.digital_payment_info?.digital_payment
                      }
                      setPaymentMethodImage={setPaymentMethodImage}
                      storage={item?.storge}
                      configData={configData}
                    />
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}

        {/* ── Pay Offline ─────────────────────────────────────────────── */}
        {!isPartialPaymentActive &&
          configData?.offline_payment_status === 1 &&
          isZoneDigital?.offline_payment &&
          forprescription !== "true" &&
          typeof offlinePaymentOptions !== "undefined" &&
          Object?.keys(offlinePaymentOptions)?.length !== 0 && (
            <Stack mb={2.5}>
              <Stack
                sx={{
                  padding: "12px 14px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  gap: "12px",
                  border: `1px solid ${
                    isCheckedOffline
                      ? alpha(theme.palette.primary.main, 0.4)
                      : alpha(theme.palette.neutral[400], 0.25)
                  }`,
                  backgroundColor: isCheckedOffline
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
                    title={t(
                      "Offline Payment now, with just a click of a button, you can make secure transactions. It's simple, convenient, and reliable.",
                    )}
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
      </CustomStackFullWidth>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <Divider sx={{ mx: { md: "16px" } }} />
      <Stack
        px={{ xs: 0, md: "16px" }}
        pb={{ xs: "8px", md: "20px" }}
        pt={{ xs: "4px", md: 0 }}
      >
        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={handleSubmit}
          disabled={!paymentMethod && !isCheckedOffline}
          sx={{
            borderRadius: "8px",
            py: 1.25,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "15px",
          }}
        >
          {t("Proceed")}
        </Button>
      </Stack>
    </CustomStackFullWidth>
  );
};

export default OtherModulePayment;
