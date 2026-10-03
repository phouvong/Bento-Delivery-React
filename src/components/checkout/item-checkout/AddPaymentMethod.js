import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { t } from "i18next";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import PaymentIcon from "@mui/icons-material/Payment";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { setOfflineInfoStep } from "../../../redux/slices/offlinePaymentData";
import CustomModal from "../../modal";
import PaymentMethod from "../PaymentMethod";
import CustomImageContainer from "../../CustomImageContainer";
import wallet from "../assets/wallet.png";
import money from "../assets/money.png";
import OfflinePaymentIcon from "../assets/OfflinePaymentIcon";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const AddPaymentMethod = (props) => {
  const {
    setPaymentMethod,
    paymentMethod,
    zoneData,
    configData,
    orderType,
    usePartialPayment,
    forprescription,
    offlinePaymentOptions,
    setSwitchToWallet,
    isZoneDigital,
    setPaymentMethodImage,
    paymentMethodImage,
    handlePartialPayment,
    walletBalance,
    removePartialPayment,
    switchToWallet,
    customerData,
    payableAmount,
    changeAmount,
    setChangeAmount,
    onBeforeProceed,
    locked,
    repeatCount = 0,
    isAmountReady = true,
  } = props;
  // Repeat series shows the whole-series total; expose the per-booking figure.
  const isRepeatSeries = repeatCount > 1;
  const perBookingAmount = isRepeatSeries
    ? (Number(payableAmount) || 0) / repeatCount
    : 0;
  const [openModal, setOpenModel] = useState(false);
  const { offlineMethod } = useSelector((state) => state.offlinePayment);
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // The modal mutates these DRAFT copies while the user is still browsing
  // radios — the summary row below keeps showing the last CONFIRMED choice
  // (`paymentMethod`/`paymentMethodImage`, the real lifted state) until
  // "Proceed" is pressed, which commits draft → real via `handleProceed`.
  const [draftPaymentMethod, setDraftPaymentMethod] = useState(paymentMethod);
  const [draftPaymentMethodImage, setDraftPaymentMethodImage] =
    useState(paymentMethodImage);

  const handleClick = () => {
    setDraftPaymentMethod(paymentMethod);
    setDraftPaymentMethodImage(paymentMethodImage);
    setOpenModel(true);
  };

  const handleProceed = () => {
    setPaymentMethod(draftPaymentMethod);
    setPaymentMethodImage(draftPaymentMethodImage);
  };

  useEffect(() => {
    if (draftPaymentMethod?.match("offline_payment")) {
      dispatch(setOfflineInfoStep(1));
      setDraftPaymentMethodImage(OfflinePaymentIcon);
    } else {
      dispatch(setOfflineInfoStep(0));
    }
    if (draftPaymentMethod === "cash_on_delivery") {
      setDraftPaymentMethodImage(money.src);
    } else if (draftPaymentMethod === "wallet") {
      setDraftPaymentMethodImage(wallet.src);
    }
  }, [draftPaymentMethod]);

  const hasPaymentMethod = locked || Boolean(paymentMethod || usePartialPayment);

  // The summary row shows the last CONFIRMED method. For the bundled local
  // methods (COD / wallet) the parent may set `paymentMethod` without ever
  // setting `paymentMethodImage` — e.g. COD auto-selected on first load — which
  // left the icon broken until the modal was opened and "Proceed" pressed.
  // Fall back to the bundled asset so the icon always renders.
  const resolvedPaymentMethodImage =
    paymentMethodImage ||
    (paymentMethod === "cash_on_delivery"
      ? money.src
      : paymentMethod === "wallet"
      ? wallet.src
      : paymentMethodImage);

  const closeButton = (
    <IconButton
      onClick={() => setOpenModel(false)}
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
      setPaymentMethod={setDraftPaymentMethod}
      paymentMethod={draftPaymentMethod}
      zoneData={zoneData}
      configData={configData}
      orderType={orderType}
      usePartialPayment={usePartialPayment}
      setOpenModel={setOpenModel}
      forprescription={forprescription}
      offlinePaymentOptions={offlinePaymentOptions}
      paymentMethodImage={draftPaymentMethodImage}
      setPaymentMethodImage={setDraftPaymentMethodImage}
      setSwitchToWallet={setSwitchToWallet}
      isZoneDigital={isZoneDigital}
      handlePartialPayment={handlePartialPayment}
      walletBalance={walletBalance}
      removePartialPayment={removePartialPayment}
      switchToWallet={switchToWallet}
      customerData={customerData}
      payableAmount={payableAmount}
      changeAmount={changeAmount}
      setChangeAmount={setChangeAmount}
      onBeforeProceed={onBeforeProceed}
      onProceed={handleProceed}
    />
  );

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "16px",
        boxShadow: "none",
        padding: { xs: "16px", md: "20px" },
      }}
    >
      <Stack direction="row" alignItems="center" gap={0.5}>
        <Stack flex={1} minWidth={0} gap={0.25}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "16px", md: "18px" },
              letterSpacing: "-0.54px",
              color: "neutral.1050",
            }}
          >
            {t("Payment Method")}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              letterSpacing: "-0.42px",
              color: theme.palette.neutral?.[500] || theme.palette.text.secondary,
            }}
          >
            {t("Add at least one option to pay your order.")}
          </Typography>
        </Stack>

        {!locked && (
          <IconButton
            onClick={handleClick}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              backgroundColor: theme.palette.background.secondary,
              color: theme.palette.primary.main,
              flexShrink: 0,
            }}
          >
            <EditIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        )}
      </Stack>

      {hasPaymentMethod && (
        <Stack
          direction="row"
          alignItems="center"
          gap="12px"
          flexWrap="wrap"
          onClick={handleClick}
          sx={{
            mt: 2,
            cursor: locked ? "default" : "pointer",
            backgroundColor: theme.palette.background.default,
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          {paymentMethod?.match("offline_payment") ? (
            <OfflinePaymentIcon />
          ) : usePartialPayment ? (
            <PaymentIcon
              sx={{
                width: 20,
                height: 20,
                color: theme.palette.primary.main,
              }}
            />
          ) : (
            <CustomImageContainer
              src={resolvedPaymentMethodImage}
              width="20px"
              height="20px"
              alt="Payment Method"
              objectfit="contain"
            />
          )}
          <Stack sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "16px",
                letterSpacing: "-0.48px",
                color: "neutral.1050",
                textTransform: "capitalize",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {usePartialPayment
                ? t("Paid By Wallet")
                : paymentMethod === "offline_payment"
                ? `${paymentMethod?.replaceAll("_", " ")} (${
                    offlineMethod?.method_name
                  })`
                : paymentMethod === "cash_on_delivery" &&
                  getCurrentModuleType() === "service"
                ? t("Cash After Service")
                : t(paymentMethod?.replaceAll("_", " "))}
            </Typography>

            {isRepeatSeries && isAmountReady && (
              <Typography
                sx={{
                  fontSize: { xs: "11px", md: "12px" },
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                }}
              >
                {t("Single booking")}
                {" : "}
                <Typography
                  component="span"
                  sx={{ fontWeight: 600, fontSize: "inherit" }}
                >
                  {getAmountWithSign(perBookingAmount)}
                </Typography>{" "}
                {`× ${repeatCount} ${t("bookings")}`}
              </Typography>
            )}

            {usePartialPayment && paymentMethod && (
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "13px" },
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  textTransform: "capitalize",
                }}
              >
                {paymentMethod === "offline_payment"
                  ? `${t("offline payment")} (${offlineMethod?.method_name})`
                  : paymentMethod === "cash_on_delivery" &&
                    getCurrentModuleType() === "service"
                  ? t("Cash After Service")
                  : t(paymentMethod.replaceAll("_", " "))}{" "}
                {t("(Due)")}
                {" : "}
                <Typography
                  component="span"
                  sx={{ fontWeight: 600, fontSize: "inherit" }}
                >
                  {getAmountWithSign(payableAmount - walletBalance)}
                </Typography>
              </Typography>
            )}
          </Stack>

          {isAmountReady ? (
            <Typography
              sx={{
                fontSize: "18px",
                letterSpacing: "-0.54px",
                color: "neutral.1050",
              }}
            >
              {getAmountWithSign(
                usePartialPayment ? walletBalance : payableAmount
              )}
            </Typography>
          ) : (
            <Skeleton variant="text" width={60} />
          )}
        </Stack>
      )}

      {!locked && openModal &&
        (isMobile ? (
          <Drawer
            anchor="bottom"
            open={openModal}
            onClose={() => setOpenModel(false)}
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
            {closeButton}
            {paymentMethodNode}
          </Drawer>
        ) : (
          <CustomModal
            openModal={openModal}
            handleClose={() => setOpenModel(false)}
            minWidth="300px"
            maxWidth="660px"
          >
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              sx={{ position: "relative" }}
            >
              {closeButton}
            </CustomStackFullWidth>
            {paymentMethodNode}
          </CustomModal>
        ))}
    </Box>
  );
};

export default AddPaymentMethod;
