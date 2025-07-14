import InfoIcon from "@mui/icons-material/Info";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  FormControl,
  Grid,
  Radio,
  RadioGroup,
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
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setOfflineInfoStep,
  setOfflineMethod,
} from "redux/slices/offlinePaymentData";
import SimpleBar from "simplebar-react";
import {
  CustomFormControlLabel,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { CustomButtonStack, DeliveryCaption } from "../CheckOut.style";
import PaymentMethodCard from "../PaymentMethodCard";
import OfflinePaymentIcon from "../assets/OfflinePaymentIcon";
import cashOnDelivery from "../assets/cod2.svg";
import wallet from "../assets/wallet.svg";

const OfflineButton = styled(Button)(({ theme, value, paymentMethod }) => ({
  padding: "15px 15px",
  border: "1px solid #E4F4FF",
  filter: `drop-shadow(-1px 1px 0px ${alpha(theme.palette.info.light, 0.2)})`,
  gap: "5px",
  color:
    value?.id === paymentMethod?.id
      ? theme.palette.whiteContainer.main
      : theme.palette.neutral[1000],
  background:
    value?.id === paymentMethod?.id
      ? theme.palette.primary.main
      : theme.palette.neutral[100],
  "&:hover": {
    color: theme.palette.whiteContainer.main,
    background: theme.palette.primary.main,
  },
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
  } = props;
  const token = getToken();
  const router = useRouter();
  const theme = useTheme();
  const divRef = useRef(null);
  const dispatch = useDispatch();
  const { offlineMethod, offlineInfoStep } = useSelector(
    (state) => state.offlinePayment
  );
  const [isCheckedOffline, setIsCheckedOffline] = useState(
    offlineMethod !== "" ? true : false
  );
  const [openOfflineOptions, setOpenOfflineOptions] = useState(false);

  const handleClickOffline = () => {
    setOpenOfflineOptions(!openOfflineOptions);
    // Scroll to the endpoint of the div
    divRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };
  const handleClickOfflineItem = (item) => {
    dispatch(setOfflineMethod(item));
    dispatch(setOfflineInfoStep(1));
    setIsCheckedOffline(true);
    setPaymentMethod(`offline_payment`);
  };

  const handleOffline = (e) => {
    // dispatch(setOfflineInfoStep(2));
    //  router.push("/checkout?page=offline", undefined, { shallow: true });
    router.push(
      {
        pathname: "/checkout",
        query: { page: "parcel", method: "offline" },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <CustomStackFullWidth justifyContent="space-between" spacing={1}>
      <Stack alignItems="center" gap="10px" flexWrap="wrap">
        <DeliveryCaption parcel={parcel}>{t("Payment Method")}</DeliveryCaption>
        <Typography color={theme.palette.neutral[400]}>
          {t("Select a Payment Method to Proceed")}
        </Typography>
      </Stack>
      <Box sx={{ maxHeight: "270px", overflowY: "auto" }}>
        <SimpleBar style={{ maxHeight: "270px" }}>
          <CustomStackFullWidth
            ref={divRef}
            direction={parcel === "true" ? "column" : "row"}
            sx={{
              flexWrap: "wrap",
              paddingBottom: "10px",
              gap: {
                xs: parcel === "true" ? "16px" : "0px",
                sm: parcel === "true" ? "16px" : "0px",
                md: "16px",
              },
            }}
          >
            <>
              <Grid container spacing={2}>
                <Grid item spacing={3} xs={12} sm={6}>
                  {configData?.cash_on_delivery &&
                    getParcelPayment()[0]?.cash_on_delivery && (
                      <CustomStackFullWidth
                        flexDirection="row"
                        alignItems="center"
                        padding="14px 9px"
                        gap="10px"
                        sx={{
                          backgroundColor:
                            paymentMethod === "cash_on_delivery" &&
                            alpha(theme.palette.primary.main, 0.1),
                          border:
                            paymentMethod === "cash_on_delivery"
                              ? `1px solid ${alpha(
                                  theme.palette.secondary.light,
                                  0.3
                                )}`
                              : `1px solid ${alpha(
                                  theme.palette.neutral[400],
                                  0.3
                                )}`,
                          borderRadius: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => setPaymentMethod("cash_on_delivery")}
                      >
                        <Stack
                          width="32px"
                          height="32px"
                          justifyContent="center"
                          alignItems="center"
                          backgroundColor={theme.palette.primary.main}
                          borderRadius="50%"
                        >
                          <CustomImageContainer
                            width="22px"
                            height="22px"
                            objectfit="contain"
                            src={cashOnDelivery.src}
                          />
                        </Stack>
                        <Typography color="neutral[400]">
                          {t("Cash on delivery")}
                        </Typography>
                      </CustomStackFullWidth>
                    )}
                </Grid>
                <Grid item spacing={3} xs={12} sm={6}>
                  {configData?.customer_wallet_status === 1 &&
                    token &&
                    paidBy !== "receiver" &&
                    forprescription !== "true" && (
                      <CustomStackFullWidth
                        flexDirection="row"
                        alignItems="center"
                        padding="14px 9px"
                        gap="10px"
                        sx={{
                          backgroundColor:
                            paymentMethod === "wallet" &&
                            alpha(theme.palette.primary.main, 0.1),
                          border:
                            paymentMethod === "wallet"
                              ? `1px solid ${alpha(
                                  theme.palette.secondary.light,
                                  0.3
                                )}`
                              : `1px solid ${alpha(
                                  theme.palette.neutral[400],
                                  0.3
                                )}`,
                          borderRadius: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => setPaymentMethod("wallet")}
                      >
                        <Stack
                          width="32px"
                          height="32px"
                          justifyContent="center"
                          alignItems="center"
                          backgroundColor={
                            theme.palette.customColor.parcelWallet
                          }
                          borderRadius="50%"
                        >
                          <CustomImageContainer
                            width="20px"
                            height="20px"
                            objectfit="contain"
                            src={wallet.src}
                          />
                        </Stack>
                        <Typography color="neutral[400]">
                          {t("Pay via Wallet")}
                        </Typography>
                      </CustomStackFullWidth>
                    )}
                </Grid>
              </Grid>
              <Stack>
                {paidBy !== "receiver" && (
                  <Stack p="10px 0" flexDirection="row" gap="10px">
                    <Typography fontSize="16px" fontWeight={500}>
                      {t("Pay Via Online")}
                    </Typography>
                    <Typography color={theme.palette.neutral[400]}>
                      {t("Faster & secure way to pay bill")}
                    </Typography>
                  </Stack>
                )}

                {paidBy !== "receiver" &&
                  forprescription !== "true" &&
                  configData?.digital_payment_info?.digital_payment &&
                  getParcelPayment()[0]?.digital_payment && (
                    <>
                      {configData?.active_payment_method_list?.map(
                        (item, index) => {
                          return (
                            <PaymentMethodCard
                              key={index}
                              parcel={parcel}
                              paymentType={item?.gateway_title}
                              image={item?.gateway_image_full_url}
                              paymentMethod={paymentMethod}
                              setPaymentMethod={setPaymentMethod}
                              setIsCheckedOffline={setIsCheckedOffline}
                              paidBy={paidBy}
                              type={item?.gateway}
                              digitalPaymentMethodActive={
                                configData?.digital_payment_info
                                  ?.digital_payment
                              }
                              imageUrl={
                                configData?.base_urls?.gateway_image_url
                              }
                            />
                          );
                        }
                      )}
                    </>
                  )}
              </Stack>
            </>
            <Stack pb="20px">
              {getParcelPayment()[0]?.offline_payment &&
              typeof offlinePaymentOptions !== "undefined" &&
              Object?.keys(offlinePaymentOptions)?.length !== 0 &&
              configData?.offline_payment_status === 1 &&
              paidBy !== "receiver" ? (
                <CustomStackFullWidth
                  padding="10px"
                  borderRadius="10px"
                  backgroundColor={alpha(theme.palette.primary.main, 0.1)}
                  onClick={handleClickOffline}
                  sx={{ cursor: "pointer" }}
                >
                  <CustomStackFullWidth gap="10px">
                    <CustomStackFullWidth
                      flexDirection="row"
                      justifyContent="space-between"
                    >
                      <FormControl
                        sx={{
                          marginRight: { xs: "0px" },
                          // marginLeft: { xs: "5px" },
                        }}
                      >
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="radio-buttons-group"
                          fontWeight="600"
                        >
                          <CustomFormControlLabel
                            value="Pay Offline"
                            control={
                              <Radio
                                sx={{
                                  padding: {
                                    xs: "2px",
                                    md: "10px",
                                  },
                                }}
                                checked={isCheckedOffline}
                                onClick={handleClickOffline}
                              />
                            }
                            label={
                              <Stack
                                flexDirection="row"
                                gap="16px"
                                paddingLeft={{
                                  xs: "5px",
                                  sm: "5px",
                                  md: "10px",
                                }}
                              >
                                <OfflinePaymentIcon />
                                <Typography fontSize="14px" fontWeight="500">
                                  {t("Pay Offline")}
                                  <Typography
                                    component="span"
                                    fontSize="10px"
                                    ml="5px"
                                  >
                                    ( {t("Select option from below")} )
                                  </Typography>
                                </Typography>
                              </Stack>
                            }
                          />
                        </RadioGroup>
                      </FormControl>
                      <Tooltip
                        placement="left"
                        title="Offline Payment! Now, with just a click of a button, you can make secure transactions. It's simple, convenient, and reliable."
                      >
                        <InfoIcon
                          fontSize="16px"
                          sx={{
                            color: theme.palette.primary.main,
                          }}
                        />
                      </Tooltip>
                    </CustomStackFullWidth>
                    {openOfflineOptions && (
                      <CustomStackFullWidth>
                        <CustomStackFullWidth flexDirection="row" gap="20px">
                          {offlinePaymentOptions?.map((item, index) => {
                            return (
                              <OfflineButton
                                key={index}
                                value={item}
                                paymentMethod={offlineMethod}
                                onClick={() => handleClickOfflineItem(item)}
                              >
                                <Typography
                                  fontSize="12px"
                                  textTransform="capitalize"
                                >
                                  {item.method_name}
                                </Typography>
                              </OfflineButton>
                            );
                          })}
                        </CustomStackFullWidth>
                      </CustomStackFullWidth>
                    )}
                  </CustomStackFullWidth>
                </CustomStackFullWidth>
              ) : null}
            </Stack>
          </CustomStackFullWidth>
        </SimpleBar>
      </Box>
      <CustomButtonStack>
        {paidBy && offlineInfoStep === 0 ? (
          <CustomStackFullWidth>
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              onClick={orderPlace}
              loading={isLoading}
            >
              {t("Confirm Parcel Request")}
            </LoadingButton>
          </CustomStackFullWidth>
        ) : (
          <CustomStackFullWidth>
            <LoadingButton
              // type="submit"
              fullWidth
              variant="contained"
              onClick={handleOffline}
            >
              {t("Confirm Order")}
            </LoadingButton>
          </CustomStackFullWidth>
        )}
      </CustomButtonStack>
    </CustomStackFullWidth>
  );
};
export default ParcelPaymentMethod;
