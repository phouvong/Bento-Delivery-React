import React, { useState } from "react";
import {
  alpha,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  styled,
  Tooltip,
  Typography,
  Box, IconButton
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { t } from "i18next";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import CustomImageContainer from "../../CustomImageContainer";
import PaymentMethodCard from "../PaymentMethodCard";
import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { DeliveryCaption } from "../CheckOut.style";
import { setOfflineMethod } from "../../../redux/slices/offlinePaymentData";
import { getToken } from "../../../helper-functions/getToken";
import wallet from "../assets/wallet.png";
import money from "../assets/money.png";
import OfflinePaymentIcon from "../assets/OfflinePaymentIcon";
import {getAmountWithSign} from "helper-functions/CardHelpers";
import CloseIcon from '@mui/icons-material/Close';
import PartialPayment from "components/checkout/item-checkout/PartialPayment";

export const PayButton = styled(Stack)(({ theme, value, paymentMethod }) => ({
  padding: "10px 10px",
  width:"100%",
  gap: "5px",
  border: "1px solid",
  borderColor: alpha(theme.palette.neutral[400], 0.4),
  borderRadius:"10px",
  flexDirection:"row",
  justifyContent:"space-between",
  alignItems:"center",
  color:theme.palette.neutral[1000],
  cursor:"pointer",
  height:"100%",
  // background: value === paymentMethod && theme.palette.primary.main,
  // "&:hover": {
  //   // color: theme.palette.neutral[1000],
  //   background: value === paymentMethod && theme.palette.primary.main,
  // },
}));

const OfflineButton = styled(Button)(({ theme, value, paymentMethod }) => ({
  padding: "13px 20px",
  border: "1px solid #E4F4FF",
  //filter: `drop-shadow(-1px 1px 0px ${alpha(theme.palette.info.light, 0.2)})`,
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
    payableAmount
  } = props;

  const theme = useTheme();
  const dispatch = useDispatch();
  const token = getToken();
  const borderColor = theme.palette.neutral[400];
  const [openOfflineOptions, setOpenOfflineOptions] = useState(false);

  const { offlineMethod } = useSelector((state) => state.offlinePayment);
  const [isCheckedOffline, setIsCheckedOffline] = useState(
    offlineMethod !== ""
  );

  const handleClickOffline = () => {
    setOpenOfflineOptions(!openOfflineOptions);
  };
  const handleClick = (item) => {
    setPaymentMethod(item);
    dispatch(setOfflineMethod(""));
    setIsCheckedOffline(false);
  };
  const handleClickOfflineItem = (item) => {
    dispatch(setOfflineMethod(item));
    setIsCheckedOffline(true);
    setPaymentMethod(`offline_payment`);
  };
  const handleSubmit = () => {
    setOpenModel(false);
  };
  const handleCancel = () => {
    setOpenModel(false);
  };
  return (
    <CustomStackFullWidth spacing={1}  >
      <CustomStackFullWidth p={ { xs: "20px", md: "45px 45px 10px 45px" }}
        sx={{maxHeight:"450px",overflowY:"auto",overflowX:"hidden"}}
      >
        <Stack width="100%" justifyContent="space-between" direction="row" mb="1rem" gap='20px'>
          <Stack>
            <DeliveryCaption>{t("Payment Method")}</DeliveryCaption>
            <Typography pt="5px" fontSize="12px" >{t("Select a Payment Method to Proceed ")}</Typography>
          </Stack>
          <Stack>
            <Typography pb="5px" fontSize="14px" fontWeight="500">{t("Total Bill")}</Typography>
            <Typography fontSize="20px" fontWeight="700">{getAmountWithSign(payableAmount)}</Typography>
          </Stack>
        </Stack>
        <CustomStackFullWidth spacing={1}>
          <CustomStackFullWidth
            direction="row"
            sx={{ flexWrap: "wrap", gap: "10px" }}
          >

            {configData?.customer_wallet_status === 1 &&
              customerData?.data?.wallet_balance > 0 &&
              configData?.partial_payment_status === 1 && (
                <Box sx={{ flex: "1 1 calc(50% - 5px)" }}>
                  <PartialPayment
                    remainingBalance={
                      customerData?.data?.wallet_balance - payableAmount
                    }
                    handlePartialPayment={handlePartialPayment}
                    usePartialPayment={usePartialPayment}
                    walletBalance={customerData?.data?.wallet_balance}
                    paymentMethod={paymentMethod}
                    switchToWallet={switchToWallet}
                    removePartialPayment={removePartialPayment}
                    payableAmount={payableAmount}
                  />
                </Box>
              )}
             {(usePartialPayment  || switchToWallet) && (
               <Box sx={{
                  flex: "1 1 calc(50% - 5px)",

               }}>
                 <Stack
                   backgroundColor={alpha(theme.palette.neutral[500], 0.1)}
                   borderRadius="10px"
                   width="100%"
                   height="100%"
                   alignItems="center"
                   justifyContent="center"
                   padding="10px"
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
                       color={theme.palette.neutral[600]}
                       fontWeight="600"
                     >
                       {t('Paid By Wallet')}
                     </Typography>
                     <Typography
                       fontSize="20px"
                       color={theme.palette.neutral[600]}
                       fontWeight="500"
                     >
                       {getAmountWithSign(
                         paymentMethod === 'wallet' ? payableAmount : walletBalance,
                       )}
                     </Typography>
                   </Stack>
                   {!usePartialPayment? null : (
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
                         color={theme.palette.neutral[1000]}
                         fontWeight="600"
                       >
                         {t('Remaining Bill')}
                       </Typography>
                       <Typography
                         fontSize="18px"
                         color={theme.palette.neutral[1000]}
                         fontWeight="700"
                       >
                         {getAmountWithSign(
                           payableAmount - walletBalance,

                         )}
                       </Typography>
                     </Stack>
                   )}
                 </Stack>
               </Box>
             )}

            {!usePartialPayment ? null : (
              <Box sx={{ flex: "1 1 calc(100% - 5px)" ,display:"flex",justifyContent:'center',py:"10px"}}>
              <Typography
                fontSize="10px"
                color={theme.palette.error.main}
                fontWeight="400"
              >
                {t("* Please select an option to pay the rest of the amount")}
              </Typography>
              </Box>
            )}
            {usePartialPayment
              ? ((isZoneDigital?.cash_on_delivery &&
                  configData?.cash_on_delivery &&
                  configData?.partial_payment_method === "both") ||
                  configData?.partial_payment_method === "cod") && (
              <Box sx={{ flex: "1 1 calc(50% - 5px)"}} minHeight="67px">

                <PayButton
                  value="cash_on_delivery"
                  paymentMethod={paymentMethod}
                  onClick={() => handleClick("cash_on_delivery")}
                >
                  <Stack direction="row" gap="5px" alignItems="center">
                    <CustomImageContainer
                      src={money.src}
                      width="20px"
                      height="20px"
                      alt="cod"
                    />
                    <Typography fontSize="12px" fontWeight="600" >
                      {t("Cash On Delivery")}
                    </Typography>
                  </Stack>
                  {paymentMethod==="cash_on_delivery" ? <CheckCircleIcon sx={{color:theme=>theme.palette.primary.main}}/>:<RadioButtonUncheckedIcon sx={{color:theme=>theme.palette.neutral[400]}}/>}
                  {/*<CheckCircleIcon*/}

                  {/*/>*/}

                </PayButton>
              </Box>

                )
              : isZoneDigital?.cash_on_delivery &&
                configData?.cash_on_delivery && (
                <Box sx={{ flex: "1 1 calc(50% - 5px)" }} minHeight="67px">

                  <PayButton
                    value="cash_on_delivery"
                    paymentMethod={paymentMethod}
                    onClick={() => handleClick("cash_on_delivery")}
                  >
                   <Stack direction="row" gap="5px" alignItems="center" >
                     <CustomImageContainer
                       src={money.src}
                       width="20px"
                       height="20px"
                       alt="cod"
                     />
                     <Typography fontSize="12px" fontWeight="600" >
                       {t("Cash On Delivery")}
                     </Typography>
                   </Stack>
                    {paymentMethod==="cash_on_delivery" ? <CheckCircleIcon sx={{color:theme=>theme.palette.primary.main}}/>:<RadioButtonUncheckedIcon sx={{color:theme=>theme.palette.neutral[400]}}/>}
                    {/*<CheckCircleIcon*/}

                    {/*/>*/}

                  </PayButton>
                </Box>
                )}


          </CustomStackFullWidth>
          {isZoneDigital?.digital_payment &&
            paidBy !== "receiver" &&
            forprescription !== "true" &&
            configData?.digital_payment_info?.digital_payment &&
            (configData?.partial_payment_method === "digital_payment" ||
              configData?.partial_payment_method === "both" ||
              configData?.partial_payment_method === null) && (
              <CustomStackFullWidth paddingY="10px">
                <Typography fontSize="14px" fontWeight="500">
                  {t("Payment Methods")}
                  <Typography component="span" fontSize="10px" ml="5px">
                    {t("(Faster & secure way to pay bill)")}
                  </Typography>
                </Typography>
                <CustomStackFullWidth spacing={1}>
                  <Grid container >
                    {configData?.active_payment_method_list?.map(
                      (item, index) => {
                        return (
                          <Grid
                            item
                            xs={
                              configData?.active_payment_method_list?.length > 1
                                ? 6
                                : 12
                            }
                            key={index}
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
                              imageUrl={
                                configData?.base_urls?.gateway_image_url
                              }
                              digitalPaymentMethodActive={
                                configData?.digital_payment_info
                                  ?.digital_payment
                              }
                              setPaymentMethodImage={setPaymentMethodImage}
                              storage={item?.storge}
                              configData={configData}
                            />
                          </Grid>
                        );
                      }
                    )}
                  </Grid>
                </CustomStackFullWidth>
              </CustomStackFullWidth>
            )}
        </CustomStackFullWidth>
        <Stack onClick={handleClickOffline} sx={{ cursor: "pointer" }}>
          {configData?.offline_payment_status === 1 &&
          isZoneDigital?.offline_payment &&
          forprescription !== "true" &&
          typeof offlinePaymentOptions !== "undefined" &&
          Object?.keys(offlinePaymentOptions)?.length !== 0 ? (
            <Stack
              padding="10px 10px 10px 10px"
              borderRadius="10px"
              backgroundColor={alpha(theme.palette.primary.main, 0.1)}
              border={`1px solid ${alpha(theme.palette.primary.main, 0.3)}`}
            >
              <CustomStackFullWidth gap="10px">
                <CustomStackFullWidth
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <FormControl
                    sx={{
                      marginRight: { xs: "0px" },
                      marginLeft: { xs: "5px" },
                    }}
                  >
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="radio-buttons-group"
                      fontWeight="600"
                    >
                      <FormControlLabel
                        value={t("Pay Offline")}
                        control={
                          <Radio
                            sx={{ padding: { xs: "2px", md: "5px" } }}
                            checked={isCheckedOffline}
                            onClick={handleClickOffline}
                          />
                        }
                        label={
                          <Stack
                            flexDirection="row"
                            gap="5px"
                            paddingLeft="5px"
                          >
                            <OfflinePaymentIcon />
                            <Typography
                              fontSize="12px"
                              fontWeight="500"
                              // paddingLeft="10px"
                            >
                              {t("Pay Offline")}
                              <Tooltip
                                placement="left"
                                title={t(
                                  "Offline Payment! Now, with just a click of a button, you can make secure transactions. It's simple, convenient, and reliable."
                                )}
                              >
                                <InfoIcon
                                  fontSize="16px"
                                  sx={{ color: theme.palette.primary.main }}
                                />
                              </Tooltip>
                            </Typography>
                          </Stack>
                        }
                      />
                    </RadioGroup>
                  </FormControl>

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
                            <Typography fontSize="12px">
                              {item.method_name}
                            </Typography>
                          </OfflineButton>
                        );
                      })}
                    </CustomStackFullWidth>
                  </CustomStackFullWidth>
                )}
              </CustomStackFullWidth>
            </Stack>
          ) : null}
        </Stack>

      </CustomStackFullWidth>
      <Stack
        direction="row"
        width="100%"
        spacing={1}

        paddingBottom="20px"
        px="16px"
        position="sticky"
        bottom={0}
        bgcolor="#fff" // Add background to prevent overlap
        zIndex={10}
      >

        <Button
          fullWidth
          variant="contained"
          onClick={() => handleSubmit()}
          disabled={paymentMethod || isCheckedOffline ? false : true}
          style={{
            borderRadius: "5px",
            padding: "8px 22px",
          }}
        >
          {t("Proceed")}
        </Button>
      </Stack>
    </CustomStackFullWidth>
  );
};

export default OtherModulePayment;
