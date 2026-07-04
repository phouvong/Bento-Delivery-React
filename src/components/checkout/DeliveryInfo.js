import React, { useState } from "react";
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import DeliveryInstruction from "./DeliveryInstruction";
import CustomModal from "../modal";
import { getToken } from "helper-functions/getToken";
import { useSelector } from "react-redux";

import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeliveryManTip from "./DeliveryManTip";
import ChangePayBy from "./ChangePayBy";
import PaymentMethod from "./PaymentMethod";
import Image from "next/image";

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
  console.log({ walletBalance });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [customNote, setCustomNote] = useState("");
  const [selectedInstruction, setSelectedInstruction] = useState(null);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMethodImage, setPaymentMethodImage] = useState("");
  const [switchToWallet, setSwitchToWallet] = useState(false);
  const [changeAmount, setChangeAmount] = useState();
  const token = getToken();
  const { parcelInfo } = useSelector((state) => state.parcelInfoData);
  const handleClick = () => {
    setOpenModal(!openModal);
  };
  const handleRemoveInstruction = () => {
    setCustomerInstruction(null);
    setSelectedInstruction(null);
    // setCustomNote("");
  };
  const handleRemoveInstructionDes = () => {
    setCustomNote("");
  };
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

  return (
    <Stack sx={{ height: "100%", width: "100%" }} spacing={3}>
      <Card
        sx={{
          padding: { xs: "16px", md: "24px" },
          backgroundColor: theme.palette.background.paper,
          border: "none",
          borderRadius: "16px",
          boxShadow:
            "0px 4px 16px 0px rgba(17, 24, 39, 0.06), 0px 1px 2px 0px rgba(17, 24, 39, 0.04)",
        }}
      >
        <Typography
          fontWeight={700}
          fontSize={{ xs: "16px", md: "18px" }}
          color="text.primary"
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
                token ? parcelInfo?.senderPhone : `+ ${parcelInfo?.senderPhone}`
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
              phone={`+ ${parcelInfo?.receiverPhone}`}
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
                  backgroundColor:
                    theme.palette.neutral?.[300] ||
                    theme.palette.background.default,
                  borderRadius: "12px",
                  padding: { xs: "14px 16px", md: "14px 16px" },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                >
                  <Stack flex={1} minWidth={0} gap={0.5}>
                    <Typography
                      fontWeight={700}
                      fontSize={{ xs: "15px", md: "16px" }}
                      color="text.primary"
                      lineHeight={1.3}
                    >
                      {t("Create Account With Sender Information")}
                    </Typography>
                    <Typography
                      fontSize={{ xs: "12px", md: "13px" }}
                      color={
                        theme.palette.neutral?.[500] ||
                        theme.palette.text.secondary
                      }
                      lineHeight={1.45}
                    >
                      {t(
                        "An account is set up with sender’s name, phone & email to unlocking all the awesome features just for you!",
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

          <Grid item xs={12} md={6}>
            <Stack spacing={1} sx={{ height: "100%" }}>
              <Typography fontSize={{ xs: "14px", md: "15px" }}>
                <Box
                  component="span"
                  sx={{ fontWeight: 700, color: "text.primary" }}
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
              <Stack
                onClick={() => setOpenModal(true)}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  cursor: "pointer",
                  borderRadius: "10px",
                  border: `1px solid ${
                    theme.palette.neutral?.[200] || "rgba(0,0,0,0.08)"
                  }`,
                  backgroundColor: theme.palette.background.paper,
                  padding: "12px 14px",
                  minHeight: "48px",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <Typography
                  fontSize="14px"
                  color={
                    customerInstruction
                      ? theme.palette.text.primary
                      : theme.palette.neutral?.[450] ||
                        theme.palette.text.secondary
                  }
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {customerInstruction || t("Select your instruction")}
                </Typography>
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: 20,
                    color: theme.palette.text.primary,
                    flexShrink: 0,
                    ml: 1,
                  }}
                />
              </Stack>

              {/* Note card — shown below the picker row when a custom
                  note has been applied. Tinted background + bold title
                  separates it visually from the picker. */}
              {customNote ? (
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  spacing={1}
                  sx={{
                    mt: "4px",
                    p: "10px 12px",
                    borderRadius: "10px",
                    backgroundColor: alpha(theme.palette.primary.main, 0.06),
                    border: `1px solid ${alpha(
                      theme.palette.primary.main,
                      0.18,
                    )}`,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{ flexShrink: 0, mt: "1px" }}
                  >
                    <StickyNote2OutlinedIcon
                      sx={{
                        fontSize: 16,
                        color: theme.palette.primary.main,
                      }}
                    />
                    <Typography
                      fontSize="12px"
                      fontWeight={700}
                      sx={{
                        color: theme.palette.primary.main,
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      {t("Note")}:
                    </Typography>
                  </Stack>
                  <Typography
                    fontSize="13px"
                    sx={{
                      color: theme.palette.text.primary,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      lineHeight: 1.45,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {customNote}
                  </Typography>
                </Stack>
              ) : null}
            </Stack>
          </Grid>
        </Grid>
      </Card>

      <Stack spacing={3}>
        <DeliveryManTip
          parcel="true"
          deliveryTip={deliveryTip}
          setDeliveryTip={setDeliveryTip}
        />

        <Card
          sx={{
            padding: { xs: "16px", md: "24px" },
            backgroundColor: theme.palette.background.paper,
            border: "none",
            borderRadius: "16px",
            boxShadow:
              "0px 4px 16px 0px rgba(17, 24, 39, 0.06), 0px 1px 2px 0px rgba(17, 24, 39, 0.04)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap={{ xs: "wrap", md: "nowrap" }}
            gap={2}
            sx={{ py: { xs: 0.5, md: 1 } }}
          >
            <Stack flex={1} minWidth={0} gap={0.5}>
              <Typography
                fontWeight={700}
                fontSize={{ xs: "15px", md: "16px" }}
                color="text.primary"
              >
                {t("Who Will Pay?")}
              </Typography>
              <Typography
                fontSize={{ xs: "12px", md: "13px" }}
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
                backgroundColor:
                  theme.palette.background.paper ||
                  theme.palette.background.default,
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
                      px: "28px",
                      minHeight: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                      backgroundColor: active
                        ? theme.palette.primary.main
                        : "transparent",
                      color: active
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary,
                      fontWeight: active ? 700 : 500,
                      fontSize: "14px",
                      transition: "all 0.2s ease",
                      flex: 1,
                      textAlign: "center",
                      boxShadow: active
                        ? "0px 2px 6px rgba(34, 197, 94, 0.25)"
                        : "none",
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
              backgroundColor:
                theme.palette.neutral?.[200] || "rgba(0,0,0,0.06)",
              my: { xs: 2, md: 2.5 },
            }}
          />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap={{ xs: "wrap", md: "nowrap" }}
            gap={2}
            sx={{ py: { xs: 0.5, md: 1 } }}
          >
            <Stack flex={1} minWidth={0} gap={0.5}>
              <Typography
                fontWeight={700}
                fontSize={{ xs: "15px", md: "16px" }}
                color="text.primary"
              >
                {t("Payment Method")}
              </Typography>
              <Typography
                fontSize={{ xs: "12px", md: "13px" }}
                color={
                  theme.palette.neutral?.[500] || theme.palette.text.secondary
                }
              >
                {selectedPaymentMethod
                  ? t(selectedPaymentMethod?.replaceAll("_", " "))
                  : t("Add at least one option to pay your order.")}
              </Typography>
            </Stack>
            <Box
              onClick={() => setOpenPaymentModal(true)}
              sx={{
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                borderRadius: "10px",
                padding: "10px 20px",
                fontWeight: 700,
                fontSize: "14px",
                flexShrink: 0,
                width: { xs: "100%", sm: "auto" },
                justifyContent: "center",
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              {selectedPaymentMethod ? (
                <>
                  <EditIcon sx={{ fontSize: "16px" }} />
                  {t("Edit")}
                </>
              ) : (
                <>
                  <AddCircleOutlineIcon sx={{ fontSize: "18px" }} />
                  {t("Add")}
                </>
              )}
            </Box>
          </Stack>
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
              />
            </Box>
          </Modal>
        ))}
      {openModal && (
        <CustomModal
          openModal={openModal}
          handleClose={() => setOpenModal(false)}
        >
          <DeliveryInstruction
            setOpenModal={setOpenModal}
            deliveryInstruction={deliveryInstruction}
            setCustomerInstruction={setCustomerInstruction}
            customNote={customNote}
            setCustomNote={setCustomNote}
            selectedInstruction={selectedInstruction}
            setSelectedInstruction={setSelectedInstruction}
          />
        </CustomModal>
      )}
    </Stack>
  );
};

export default DeliveryInfo;
