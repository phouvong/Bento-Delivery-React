import React, { useMemo, useState } from "react";
import {
  alpha,
  Checkbox,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  Modal,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import DeliveryInfoCard from "./DeliveryInfoCard";
import CloseIcon from "@mui/icons-material/Close";
import SearchableSelect from "components/common/SearchableSelect";
import { getToken } from "helper-functions/getToken";
import { useSelector } from "react-redux";

import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import DeliveryManTip from "./DeliveryManTip";
import useGetMostTrips from "api-manage/hooks/react-query/useGetMostTrips";
import ChangePayBy from "./ChangePayBy";
import PaymentMethod from "./PaymentMethod";
import Image from "next/image";
import CustomImageContainer from "../CustomImageContainer";
import PaymentIcon from "@mui/icons-material/Payment";
import OfflinePaymentIcon from "./assets/OfflinePaymentIcon";
import money from "./assets/money.png";
import wallet from "./assets/wallet.png";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const DeliveryInfo = ({
  configData,
  deliveryInstruction,
  customerInstruction,
  setCustomerInstruction,
  setCheck,
  check,
  formik,
  confirmPasswordHandler,
  passwordHandler,
  data,
  parcelDeliveryFree,
  senderLocation,
  receiverLocation,
  extraChargeLoading,
  deliveryTip,
  setDeliveryTip,
  paidBy,
  setPaidBy,
  zoneData,
  setPaymentMethod,
  paymentMethod,
  isLoading,
  orderPlace,
  storeZoneId,
  currentZoneId,
  offlinePaymentOptions,
  getParcelPayment,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  walletBalance,
  payableAmount,
}) => {

  const { data: tripsData } = useGetMostTrips();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMethodImage, setPaymentMethodImage] = useState("");
  React.useEffect(() => {
    if (paymentMethod === "cash_on_delivery") {
      setPaymentMethodImage(money.src);
    } else if (paymentMethod === "wallet") {
      setPaymentMethodImage(wallet.src);
    } else if (paymentMethod?.match("offline_payment")) {
      setPaymentMethodImage(OfflinePaymentIcon);
    }
  }, [paymentMethod]);
  // Derived from `selectedPaymentMethod` (only updated when the picker
  // modal's "Update" button is pressed) rather than the live `paymentMethod`/
  // `paymentMethodImage` state the modal mutates while the user is still
  // browsing radios — otherwise the icon in the summary row would flip
  // before the choice is confirmed, while the text label (already driven by
  // `selectedPaymentMethod`) stayed put.
  const confirmedPaymentMethodImage = useMemo(() => {
    if (selectedPaymentMethod === "cash_on_delivery") return money.src;
    if (selectedPaymentMethod === "wallet") return wallet.src;
    if (selectedPaymentMethod?.match("offline_payment")) return null;
    return configData?.active_payment_method_list?.find(
      (item) => item?.gateway === selectedPaymentMethod,
    )?.gateway_image_full_url;
  }, [selectedPaymentMethod, configData]);
  const [switchToWallet, setSwitchToWallet] = useState(false);
  const [changeAmount, setChangeAmount] = useState();
  const token = getToken();
  const { parcelInfo } = useSelector((state) => state.parcelInfoData);
  const handleCheckbox = (e) => {
    setCheck(e.target.checked);
  };
  console.log({ zoneData });
  const handlePartialPayment = () => {
    return;
    // if (payableAmount > customerData?.data?.wallet_balance) {
    // 	setUsePartialPayment(true);
    // 	setPaymentMethod("");
    // 	dispatch(setOfflineMethod(""));
    // } else {
    // 	setPaymentMethod("wallet");
    // 	setSwitchToWallet(true);
    // 	dispatch(setOfflineMethod(""));
    // }
  };

  const removePartialPayment = () => {
    return;
    // if (payableAmount > customerData?.data?.wallet_balance) {
    // 	setUsePartialPayment(false);
    // 	setPaymentMethod("");
    // 	dispatch(setOfflineMethod(""));
    // } else {
    // 	setPaymentMethod("");
    // 	setSwitchToWallet(false);
    // 	dispatch(setOfflineMethod(""));
    // }
  };

  const modalStyle = {
    position: "absolute",
    top: { xs: "20px", md: "50%" },
    left: "50%",
    transform: {
      xs: "translateX(-50%) translateY(0)",
      md: "translateX(-50%) translateY(-50%)",
    },
    maxWidth: "650px",
    width: { xs: "95%", md: "70%" },
    bgcolor: "background.paper",
    border: "1px solid #fff",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
    maxHeight: { xs: "80vh", md: "90vh" },
    overflowY: "auto",
    outline: "none",
  };

  // A bare `+ ${phone}` template renders the literal string "+ undefined"
  // before the parcel form is filled in, which is what shows on first load.
  const withDialPrefix = (phone) => (phone ? `+ ${phone}` : "");
  return (
    <Stack sx={{ height: "100%", width: "100%" }} spacing={3}>
      <Card
        sx={{
          padding: { xs: "16px", md: "20px" },
          backgroundColor: theme.palette.background.paper,
          border: "none",
          borderRadius: "16px",
          boxShadow: "none",
        }}
      >
        <Typography
          fontWeight={700}
          fontSize={{ xs: "16px", md: "18px" }}
          letterSpacing="-0.54px"
          color="neutral.1050"
          mb={2}
        >
          {t("Delivery Information")}
        </Typography>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={6}>
            <DeliveryInfoCard
              title={t("Sender Information")}
              variant="sender"
              phone={
                token
                  ? parcelInfo?.senderPhone ?? ""
                  : withDialPrefix(parcelInfo?.senderPhone)
              }
              name={parcelInfo?.senderName}
              address={parcelInfo?.senderAddress}
              houseNumber={parcelInfo?.senderFloor}
              floor={parcelInfo?.senderFloor}
              roadNumber={parcelInfo?.senderRoad}
              email={parcelInfo?.senderEmail}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DeliveryInfoCard
              title={t("Receiver Information")}
              variant="receiver"
              phone={withDialPrefix(parcelInfo?.receiverPhone)}
              name={parcelInfo?.receiverName}
              address={parcelInfo?.receiverAddress}
              houseNumber={parcelInfo?.house}
              floor={parcelInfo?.floor}
              roadNumber={parcelInfo?.road}
              email={parcelInfo?.receiverEmail}
            />
          </Grid>

          {!getToken() && (
            <Grid item xs={12} md={6}>
              <Stack
                sx={{
                  height: "100%",
                  backgroundColor: theme.palette.background.default,
                  borderRadius: "8px",
                  padding: { xs: "8px 12px", md: "8px 20px 8px 12px" },
                  justifyContent: "center",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                >
                  <Stack flex={1} minWidth={0} gap={0.75}>
                    <Typography
                      fontWeight={500}
                      fontSize="16px"
                      color="neutral.1050"
                      lineHeight={1.1}
                    >
                      {t("Create Account With Sender Information")}
                    </Typography>
                    <Typography
                      fontSize="12px"
                      color={
                        theme.palette.neutral?.[500] ||
                        theme.palette.text.secondary
                      }
                      lineHeight={1.2}
                    >
                      {t(
                        "An account is set up with sender’s name, phone & email to unlocking all the awesome features just for you!"
                      )}
                    </Typography>
                  </Stack>
                  <Checkbox
                    checked={!!check}
                    onChange={handleCheckbox}
                    sx={{
                      p: 0,
                      flexShrink: 0,
                      "& .MuiSvgIcon-root": { fontSize: 24 },
                    }}
                  />
                </Stack>
                {check && (
                  <Grid container spacing={2} pt={2.5}>
                    <Grid item xs={12} sm={12}>
                      <CustomTextFieldWithFormik
                        required="true"
                        type="password"
                        label={t("Password")}
                        placeholder={t("Password")}
                        touched={formik.touched.password}
                        errors={formik.errors.password}
                        fieldProps={formik.getFieldProps("password")}
                        onChangeHandler={passwordHandler}
                        value={formik.values.password}
                        startIcon={
                          <InputAdornment position="start">
                            <LockIcon
                              sx={{
                                color: (theme) => theme.palette.neutral[400],
                              }}
                            />
                          </InputAdornment>
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <CustomTextFieldWithFormik
                        label={t("Confirm Password")}
                        required="true"
                        type="password"
                        placeholder={t("Confirm Password")}
                        touched={formik.touched.confirm_password}
                        errors={formik.errors.confirm_password}
                        fieldProps={formik.getFieldProps("confirm_password")}
                        onChangeHandler={confirmPasswordHandler}
                        value={formik.values.confirm_password}
                        startIcon={
                          <InputAdornment position="start">
                            <LockIcon
                              sx={{
                                color: (theme) => theme.palette.neutral[400],
                              }}
                            />
                          </InputAdornment>
                        }
                      />
                    </Grid>
                  </Grid>
                )}
              </Stack>
            </Grid>
          )}

          <Grid item xs={12} md={getToken() ? 12 : 6}>
            <Stack spacing={1} sx={{ height: "100%" }}>
              <Typography fontSize="16px" letterSpacing="-0.48px">
                <Box
                  component="span"
                  sx={{ fontWeight: 400, color: "neutral.700" }}
                >
                  {t("Delivery Instruction")}
                </Box>{" "}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 400,
                    color:
                      theme.palette.neutral?.[450] ||
                      theme.palette.text.secondary,
                  }}
                >
                  ({t("Optional")})
                </Box>
              </Typography>
              <SearchableSelect
                value={
                  deliveryInstruction?.find(
                    (i) => i?.instruction === customerInstruction,
                  )?.id ?? ""
                }
                onChange={(id) => {
                  const selected = deliveryInstruction?.find(
                    (i) => i?.id === id,
                  );
                  setCustomerInstruction(selected?.instruction ?? "");
                }}
                options={(deliveryInstruction ?? []).map((i) => ({
                  id: i?.id,
                  name: i?.instruction,
                }))}
                placeholder={t("Select your instruction")}
                searchPlaceholder={t("Search instructions...")}
                emptyText={t("No instructions found")}
              />
            </Stack>
          </Grid>
        </Grid>
      </Card>

      <Stack spacing={3}>
        <DeliveryManTip
          parcel="true"
          deliveryTip={deliveryTip}
          setDeliveryTip={setDeliveryTip}
          tripsData={tripsData}
        />

        <Card
          sx={{
            padding: { xs: "16px", md: "20px" },
            backgroundColor: theme.palette.background.paper,
            border: "none",
            borderRadius: "16px",
            boxShadow: "none",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap={{ xs: "wrap", md: "nowrap" }}
            gap={2}
          >
            <Stack flex={1} minWidth={0} gap={0.5}>
              <Typography
                fontWeight={700}
                fontSize={{ xs: "16px", md: "18px" }}
                letterSpacing="-0.54px"
                color="neutral.1050"
              >
                {t("Who Will Pay?")}
              </Typography>
              <Typography
                fontSize="14px"
                letterSpacing="-0.42px"
                color={
                  theme.palette.neutral?.[500] || theme.palette.text.secondary
                }
              >
                {t("Choose which person will pay for the charges")}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                backgroundColor: theme.palette.background.default,
                border: `1px solid ${
                  theme.palette.neutral?.[200] ||
                  alpha(theme.palette.divider, 0.6)
                }`,
                borderRadius: "12px",
                padding: "4px",
                flexShrink: 0,
                width: { xs: "100%", sm: "auto" },
                minWidth: { sm: 320 },
              }}
            >
              {[
                { value: "sender", label: t("Sender") },
                { value: "receiver", label: t("Receiver") },
              ].map((option) => {
                const active = paidBy === option.value;
                const disabled =
                  option.value === "receiver" &&
                  !zoneData?.zone_data?.[0]?.cash_on_delivery;
                return (
                  <Box
                    key={option.value}
                    onClick={() => {
                      if (disabled) return;
                      setPaidBy(option.value);
                      setPaymentMethod("cash_on_delivery");
                      setSelectedPaymentMethod("cash_on_delivery");
                    }}
                    sx={{
                      cursor: disabled ? "not-allowed" : "pointer",
                      opacity: disabled ? 0.4 : 1,
                      borderRadius: "8px",
                      px: "16px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                      backgroundColor: active
                        ? theme.palette.primary.main
                        : "transparent",
                      color: active
                        ? theme.palette.primary.contrastText
                        : theme.palette.neutral[1050],
                      fontWeight: 600,
                      fontSize: "14px",
                      letterSpacing: "-0.42px",
                      transition: "all 0.2s ease",
                      flex: 1,
                      textAlign: "center",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: active
                          ? theme.palette.primary.main
                          : alpha(theme.palette.primary.main, 0.06),
                      },
                    }}
                  >
                    {option.label}
                  </Box>
                );
              })}
            </Stack>
          </Stack>

          <Box
            sx={{
              height: "1px",
              backgroundColor: theme.palette.background.secondary,
              my: { xs: 2, md: 2.5 },
            }}
          />

          <Stack direction="row" alignItems="center" gap={0.5}>
            <Stack flex={1} minWidth={0} gap={0.25}>
              <Typography
                fontWeight={700}
                fontSize={{ xs: "16px", md: "18px" }}
                letterSpacing="-0.54px"
                color="neutral.1050"
              >
                {t("Payment Method")}
              </Typography>
              <Typography
                fontSize="14px"
                letterSpacing="-0.42px"
                color={
                  theme.palette.neutral?.[500] || theme.palette.text.secondary
                }
              >
                {t("Add at least one option to pay your order.")}
              </Typography>
            </Stack>
            <IconButton
              onClick={() => setOpenPaymentModal(true)}
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
          </Stack>

          {selectedPaymentMethod && (
            <Stack
              direction="row"
              alignItems="center"
              gap="12px"
              onClick={() => setOpenPaymentModal(true)}
              sx={{
                mt: 2,
                cursor: "pointer",
                backgroundColor: theme.palette.background.default,
                borderRadius: "8px",
                padding: "12px",
              }}
            >
              {selectedPaymentMethod?.match("offline_payment") ? (
                <OfflinePaymentIcon />
              ) : (
                <CustomImageContainer
                  src={confirmedPaymentMethodImage}
                  width="20px"
                  height="20px"
                  alt="Payment Method"
                  objectfit="contain"
                />
              )}
              <Typography
                fontWeight={500}
                fontSize="16px"
                letterSpacing="-0.48px"
                color="neutral.1050"
                sx={{ flex: 1, minWidth: 0, textTransform: "capitalize" }}
              >
                {t(selectedPaymentMethod?.replaceAll("_", " "))}
              </Typography>
              <Typography
                fontSize="18px"
                letterSpacing="-0.54px"
                color="neutral.1050"
              >
                {getAmountWithSign(payableAmount)}
              </Typography>
            </Stack>
          )}
        </Card>
      </Stack>
      {openPaymentModal &&
        (isMobile ? (
          <Drawer
            anchor="bottom"
            open={openPaymentModal}
            onClose={() => setOpenPaymentModal(false)}
            PaperProps={{
              sx: {
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
                maxHeight: "90vh",
                padding: "20px 16px",
                display: "flex",
                flexDirection: "column",
              },
            }}
          >
            <Box
              sx={{
                width: "44px",
                height: "4px",
                borderRadius: "9999px",
                backgroundColor:
                  theme.palette.neutral?.[300] || "rgba(0,0,0,0.12)",
                mx: "auto",
                mb: 1.5,
                flexShrink: 0,
              }}
            />
            <IconButton
              onClick={() => setOpenPaymentModal(false)}
              sx={{
                backgroundColor: theme.palette.neutral[300],
                borderRadius: "50%",
                padding: ".315rem",
                position: "absolute",
                top: "10px",
                right: "10px",
                svg: { fontSize: "1.2rem !important" },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ overflowY: "auto", flex: 1 }}>
              <PaymentMethod
                setPaymentMethod={setPaymentMethod}
                paymentMethod={paymentMethod}
                paidBy={paidBy}
                isLoading={isLoading}
                orderPlace={orderPlace}
                zoneData={{ data: zoneData }}
                configData={configData}
                storeZoneId={currentZoneId}
                parcel="true"
                offlinePaymentOptions={offlinePaymentOptions}
                getParcelPayment={getParcelPayment}
                setOpen={setOpenPaymentModal}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                walletBalance={walletBalance}
                payableAmount={payableAmount}
                paymentMethodImage={paymentMethodImage}
                setPaymentMethodImage={setPaymentMethodImage}
              />
            </Box>
          </Drawer>
        ) : (
          <Modal
            open={openPaymentModal}
            onClose={() => setOpenPaymentModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <IconButton
                onClick={() => setOpenPaymentModal(false)}
                sx={{
                  backgroundColor: theme.palette.neutral[300],
                  borderRadius: "50%",
                  padding: ".315rem",
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  svg: { fontSize: "1.2rem !important" },
                }}
              >
                <CloseIcon />
              </IconButton>

              <PaymentMethod
                setPaymentMethod={setPaymentMethod}
                paymentMethod={paymentMethod}
                paidBy={paidBy}
                isLoading={isLoading}
                orderPlace={orderPlace}
                zoneData={{ data: zoneData }}
                configData={configData}
                storeZoneId={currentZoneId}
                parcel="true"
                offlinePaymentOptions={offlinePaymentOptions}
                getParcelPayment={getParcelPayment}
                setOpen={setOpenPaymentModal}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                walletBalance={walletBalance}
                payableAmount={payableAmount}
                paymentMethodImage={paymentMethodImage}
                setPaymentMethodImage={setPaymentMethodImage}
              />
            </Box>
          </Modal>
        ))}
    </Stack>
  );
};

export default DeliveryInfo;
