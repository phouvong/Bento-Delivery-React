import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { Stack, styled } from "@mui/system";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {alpha, IconButton, Tooltip, Typography, Zoom} from "@mui/material";
import { t } from "i18next";
import InfoIcon from "@mui/icons-material/Info";
import { DeliveryCaption } from "../CheckOut.style";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useTheme } from "@emotion/react";
import CustomModal from "../../modal";
import PaymentMethod from "../PaymentMethod";
import { useDispatch, useSelector } from "react-redux";
import { setOfflineInfoStep } from "../../../redux/slices/offlinePaymentData";
import CloseIcon from "@mui/icons-material/Close";
import CustomImageContainer from "../../CustomImageContainer";
import wallet from "../assets/wallet.png";
import money from "../assets/money.png";
import OfflinePaymentIcon from "../assets/OfflinePaymentIcon";
import PaymentIcon from '@mui/icons-material/Payment';
import {getAmountWithSign} from "helper-functions/CardHelpers";

const PaymentMethodBox = styled(CustomStackFullWidth)(({ theme }) => ({
  borderRadius: "5px",
  border: "1px solid",
  borderColor: alpha(theme.palette.primary.main, 0.5),
  boxShadow: "px 3px 20px -5px rgba(3, 157, 85, 0.10)",
  padding: "15px",
  alignItems: "center",
  background: theme.palette.neutral[100],
  cursor: "pointer",
}));

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
    payableAmount
  } = props;
  const [openModal, setOpenModel] = useState(false);
  const { offlineMethod } = useSelector((state) => state.offlinePayment);

  const theme = useTheme();
  const dispatch = useDispatch();
  const handleClick = () => {
    setOpenModel(true);
  };
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

  return (
    <CustomStackFullWidth spacing={2}>
      <DeliveryCaption const id="demo-row-radio-buttons-group-label">
        {t("Payment Method")}
      </DeliveryCaption>
      <PaymentMethodBox
        direction="row"
        justifyContent="space-between"
        onClick={handleClick}
        sx={{justifyContent:"space-between"}}
      >
        {(paymentMethod || usePartialPayment) ? (
          <Stack direction="row" gap={1} alignItems="center" >
            {paymentMethod?.match("offline_payment") ? (
              <OfflinePaymentIcon />
            ) : (
              <>
                {usePartialPayment?(<PaymentIcon
                  style={{ width: "20px", height: "20px" }}

                />):( <CustomImageContainer
                  src={paymentMethodImage}
                  width="auto"
                  height="20px"
                  alt="Payment Method Image"
                  objectfit="contain"
                />)}
              </>

            )}
            <Typography
              fontSize="12px"
               fontWeight="500"
               component="span"
              textTransform="capitalize"
            >
              {usePartialPayment ? t("Paid By Wallet"):paymentMethod === "offline_payment"
                ? `${paymentMethod?.replaceAll("_", " ")} (${
                    offlineMethod?.method_name
                  })`
                : t(paymentMethod?.replaceAll("_", " "))}{" "}:{" "}
                <Typography component="span" fontWeight="500" fontSize="12px">{getAmountWithSign(usePartialPayment?walletBalance:payableAmount)}</Typography>
            </Typography>
            {usePartialPayment && paymentMethod && (
              <Typography   fontSize="12px"
                            fontWeight="500"
                            component="span"
                            textTransform="capitalize"
                            paddingInlineStart={{xs:"0xp",md:"50px"}}
              >
                {paymentMethod === "offline_payment"
                  ? `${t("offline payment")} (${offlineMethod?.method_name})`
                  : t(paymentMethod.replaceAll("_", " "))} {t("(Due)")} {" "}:{" "}
                <Typography component="span" fontWeight="500" fontSize="12px">{getAmountWithSign(payableAmount-walletBalance)}</Typography>
              </Typography>
            )}

          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" spacing={1}>
            <PaymentIcon
              style={{ width: "20px", height: "20px" }}

            />
            <Typography
              fontSize="12px"
              fontWeight="500"

            >
              {t("Select Payment Method")}
            </Typography>
            <Stack sx={{ cursor: "pointer" }}>
              <Tooltip
                arrow
                placement="top"
                TransitionComponent={Zoom}
                title={t("Please select a payment method")}
              >
                <InfoIcon style={{ width: "16px", height: "16px" }} />
              </Tooltip>
            </Stack>
          </Stack>
        )}

        <BorderColorIcon
          style={{ width: "20px", height: "20px" }}
          color="primary"
        />
      </PaymentMethodBox>
      {openModal && (
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
            <IconButton
              onClick={() => setOpenModel(false)}
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
              <CloseIcon sx={{ fontSize: "16px", fontWeight: "500" }} />
            </IconButton>
          </CustomStackFullWidth>
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
          />
        </CustomModal>
      )}
    </CustomStackFullWidth>
  );
};

export default AddPaymentMethod;
