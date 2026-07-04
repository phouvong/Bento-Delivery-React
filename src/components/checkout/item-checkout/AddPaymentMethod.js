import React, { useEffect, useState } from "react";
import {
  alpha,
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { t } from "i18next";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
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
  } = props;
  const [openModal, setOpenModel] = useState(false);
  const { offlineMethod } = useSelector((state) => state.offlinePayment);
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleClick = () => setOpenModel(true);

  useEffect(() => {
    if (paymentMethod?.match("offline_payment")) {
      dispatch(setOfflineInfoStep(1));
      setPaymentMethodImage(OfflinePaymentIcon);
    } else {
      dispatch(setOfflineInfoStep(0));
    }
    if (paymentMethod === "cash_on_delivery") {
      setPaymentMethodImage(money.src);
    } else if (paymentMethod === "wallet") {
      setPaymentMethodImage(wallet.src);
    }
  }, [paymentMethod]);

  const hasPaymentMethod = Boolean(paymentMethod || usePartialPayment);

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
      setPaymentMethod={setPaymentMethod}
      paymentMethod={paymentMethod}
      zoneData={zoneData}
      configData={configData}
      orderType={orderType}
      usePartialPayment={usePartialPayment}
      setOpenModel={setOpenModel}
      forprescription={forprescription}
      offlinePaymentOptions={offlinePaymentOptions}
      paymentMethodImage={paymentMethodImage}
      setPaymentMethodImage={setPaymentMethodImage}
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
    />
  );

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: { xs: "10px", md: "14px" },
        boxShadow: `0 1px 4px ${alpha("#000", 0.06)}`,
        px: { xs: 2, md: 3 },
        py: { xs: 1.5, md: 2 },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={{ xs: 1, md: 2 }}
        width="100%"
      >
        <Stack spacing={0.5} flex={1} minWidth={0}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "14px", md: "16px" },
              color: theme.palette.text.primary,
            }}
          >
            {t("Payment Method")}
          </Typography>

          {hasPaymentMethod ? (
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              flexWrap="wrap"
              minWidth={0}
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
                  src={paymentMethodImage}
                  width="auto"
                  height="20px"
                  alt="Payment Method Image"
                  objectfit="contain"
                />
              )}
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "13px" },
                  fontWeight: 500,
                  color: theme.palette.text.primary,
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
                  : t(paymentMethod?.replaceAll("_", " "))}
                {" : "}
                <Typography
                  component="span"
                  sx={{ fontWeight: 600, fontSize: "inherit" }}
                >
                  {getAmountWithSign(
                    usePartialPayment ? walletBalance : payableAmount
                  )}
                </Typography>
              </Typography>

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
          ) : (
            <Typography
              sx={{
                fontSize: { xs: "11px", md: "12px" },
                color: theme.palette.text.secondary,
              }}
            >
              {t("Add at least one option to pay your order.")}
            </Typography>
          )}
        </Stack>

        <Button
          onClick={handleClick}
          variant="contained"
          disableElevation
          startIcon={
            <AddCircleOutlineIcon
              sx={{ fontSize: 18, color: theme.palette.whiteContainer.main }}
            />
          }
          sx={{
            flexShrink: 0,
            px: { xs: 1.75, md: 2.5 },
            py: { xs: 0.75, md: 1 },
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: { xs: "13px", md: "14px" },
            color: theme.palette.whiteContainer.main,
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: "none",
            },
          }}
        >
          {hasPaymentMethod ? t("Change") : t("Add")}
        </Button>
      </Stack>

      {openModal &&
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
