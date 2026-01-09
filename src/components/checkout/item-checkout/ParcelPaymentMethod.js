import InfoIcon from "@mui/icons-material/Info";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
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
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";

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
    setOpen,
    setSelectedPaymentMethod,
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
      <Stack pb={2}>
        <DeliveryCaption>{t("Payment Method")}</DeliveryCaption>
        <Typography color={theme.palette.neutral[400]}>
          {t("Select a Payment Method to Proceed")}
        </Typography>
      </Stack>
      <Box>
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
              {configData?.customer_wallet_status === 1 &&
                token &&
                paidBy !== "receiver" &&
                forprescription !== "true" && (
                  <Grid item spacing={3} xs={12} sm={getParcelPayment()[0]?.cash_on_delivery ? 6 : 12}>
                    <CustomStackFullWidth
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                      padding="10px 9px"
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
                      <Stack flexDirection="row" alignItems="center" gap="10px">
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
                      </Stack>
                      {paymentMethod === "wallet" ? (
                        <Button variant="outlined" size="small">
                          {t("Applied")}
                        </Button>
                      ) : (
                        <Button variant="outlined" size="small">
                          {t("Apply")}
                        </Button>
                      )}
                    </CustomStackFullWidth>
                  </Grid>
                )}
              {configData?.cash_on_delivery &&
                getParcelPayment()[0]?.cash_on_delivery && (
                  <Grid item spacing={3} xs={12} sm={6}>
                    <CustomStackFullWidth
                      flexDirection="row"
                      alignItems="center"
                      padding="14px 9px"
                      justifyContent="space-between"
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
                      <Stack flexDirection="row" alignItems="center" gap="10px">
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
                      </Stack>
                      <Radio
                        sx={{ color: theme.palette.neutral[400], padding: "0px" }}
                        checked={paymentMethod === "cash_on_delivery"}
                        onChange={() => setPaymentMethod("cash_on_delivery")}
                      />
                    </CustomStackFullWidth>
                  </Grid>
                )}
            </Grid>
            <Stack>
              {paidBy !== "receiver" && (
                <Stack p="10px 0" flexDirection="row" alignItems="baseline" gap=".25rem">
                  <Typography fontSize="16px" fontWeight={500}>
                    {t("Pay Via Online")}
                  </Typography>
                  <Typography color={theme.palette.neutral[400]} fontSize="12px">
                    ({t("Faster & secure way to pay bill")})
                  </Typography>
                </Stack>
              )}

              <Stack direction="row" flexWrap="wrap" columnGap={2} rowGap={1} flexGrow={1}>
                {paidBy !== "receiver" &&
                  forprescription !== "true" &&
                  configData?.digital_payment_info?.digital_payment &&
                  getParcelPayment()[0]?.digital_payment && (
                    <>
                      {configData?.active_payment_method_list?.map(
                        (item, index) => {
                          return (
                            <Stack flexGrow={1} flexBasis={"48%"}>
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
                            </Stack>
                          );
                        }
                      )}
                    </>
                  )}
              </Stack>
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
                backgroundColor={theme.palette.neutral[300]}
                border={`1px solid ${alpha(theme.palette.primary.main, 0.2)}`}
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
                              gap=".5rem"
                            >
                              {/* <OfflinePaymentIcon /> */}
                              <Typography fontSize="14px" fontWeight="500">
                                {t("Pay Offline")}
                                <Typography
                                  component="span"
                                  fontSize="10px"
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
      </Box>
      <Stack direction="row" gap="1rem" justifyContent="flex-end">
        <CustomButtonPrimary
          sx={{ width: "100px", bgcolor: theme.palette.neutral[300], color: theme.palette.text.primary, "&:hover": { bgcolor: theme.palette.neutral[400] } }}
          onClick={() => setOpen(false)}
        >
          {t("Cancel")}
        </CustomButtonPrimary>

        {paidBy && (
          <LoadingButton
            type="submit"
            variant="contained"
            onClick={() => {
              setSelectedPaymentMethod(paymentMethod)
              setOpen(false)
            }}
            loading={isLoading}
          >
            {t("Update")}
          </LoadingButton>
        )}
      </Stack>
    </CustomStackFullWidth>
  );
};
export default ParcelPaymentMethod;
