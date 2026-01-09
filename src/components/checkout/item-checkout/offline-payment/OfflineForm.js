import React from "react";
import {
  alpha,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FormHelperText from "@mui/material/FormHelperText";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import { t } from "i18next";
import { useFormik } from "formik";

import { useDispatch, useSelector } from "react-redux";
import {
  setOfflineMethod,
  setOfflinePaymentInfo,
} from "../../../../redux/slices/offlinePaymentData";

import Subtitle1 from "../../../typographies/Subtitle1";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import CustomImageContainer from "../../../CustomImageContainer";
import OfflinePaymentImage from "../../assets/offlinePayments.svg";
import { getAmountWithSign } from "../../../../helper-functions/CardHelpers";
import { useRouter } from "next/router";
import { setOrderInformation } from "../../../../redux/slices/utils";
import { CustomButtonStack } from "components/checkout/CheckOut.style";
import { setClearCart } from "redux/slices/cart";

const OfflineForm = ({
  offlinePaymentOptions,
  placeOrder,
  total_order_amount,
  offlinePaymentLoading,
  usePartialPayment,
  handleOffineOrder,
  setOfflineCheck
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const borderColor = theme.palette.neutral[400];
  const { offlineMethod } = useSelector((state) => state.offlinePayment);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const router = useRouter();
  const { orderInformation } = useSelector((state) => state.utilsData);

  // Create a validation schema using Yup.
  const validationSchema = Yup.object().shape({
    // Define validation rules for each field dynamically.
    ...offlinePaymentOptions
      ?.filter((item) => item.method_name === offlineMethod?.method_name)[0]
      ?.method_informations?.reduce((acc, item) => {
        if (item?.is_required === 1) {
          acc[item.customer_input] = Yup.string().required(
            "This field is required"
          );
        }
        return acc;
      }, {}),
  });

  const initialValues = {
    customer_note: "",
    payment_method: offlineMethod ? offlineMethod.method_name : "",
  };
  offlinePaymentOptions
    ?.filter((item) => item.method_name === offlineMethod?.method_name)[0]
    ?.method_informations?.forEach((item) => {
      initialValues[item.customer_input] = "";
    });
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        let newData = {
          ...values,
          method_id: offlineMethod.id,
        };
        if (values) {
          dispatch(setOfflinePaymentInfo(newData));
          dispatch(setOrderInformation({ ...orderInformation, ...newData }));
          handleOffineOrder(newData);
        }
      } catch (err) {
        // console.log(error);
      }
    },
  });

  const paymentMethodHandler = (e) => {
    formik.setFieldValue("payment_method", e.target.value);
    const newMethod = offlinePaymentOptions?.filter(
      (item) => item.method_name === e.target.value
    )[0];
    dispatch(setOfflineMethod(newMethod));
  };
  const handleCancel = () => {
    dispatch(setClearCart());
    router.push("/home");
  };

  return (
    <CustomStackFullWidth
      justifyContent="center"
      alignItems="center"
    // padding={{ xs: ".75rem", sm: "1.25rem" }}
    // gap={1}
    >
      <CustomImageContainer width="120px" src={OfflinePaymentImage.src} />
      <Typography variant="body1" color={theme.palette.neutral[600]} mb={1}>{t("Pay your bill using any of the payment method below and input the required information in the form")}</Typography>
      <Stack direction="row" alignItems="center" gap="10px">
        <Typography variant="subtitle1">Total order price: </Typography>
        <Typography variant="subtitle1" color={theme.palette.primary.main}>{getAmountWithSign(total_order_amount)}</Typography>
      </Stack>
      <CustomStackFullWidth mt={4}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="center" flexWrap="wrap" gap={2} sx={{ marginBottom: "20px" }}>
              {offlinePaymentOptions?.length > 0 &&
                offlinePaymentOptions?.map((item, index) => {
                  const isSelected =
                    offlineMethod?.method_name === item.method_name;
                  return (
                    <Stack flexGrow={1} maxWidth="340px" key={index}>
                      <Stack
                        flexGrow={1}
                        onClick={() => {
                          formik.setFieldValue(
                            "payment_method",
                            item.method_name
                          );
                          const newMethod = offlinePaymentOptions?.filter(
                            (method) => method.method_name === item.method_name
                          )[0];
                          dispatch(setOfflineMethod(newMethod));
                        }}
                        sx={{
                          border: isSelected
                            ? `1px solid ${theme.palette.primary.main}`
                            : `1px solid ${theme.palette.neutral[200]}`,
                          borderRadius: "10px",
                          padding: "15px",
                          cursor: "pointer",
                          position: "relative",
                          height: "100%",
                          // backgroundColor: isSelected
                          //   ? alpha(theme.palette.primary.main, 0.05)
                          //   : theme.palette.neutral[100],
                          transition: "all 0.3s ease-in-out",
                          backgroundColor: theme.palette.neutral[100],
                          boxShadow: isSelected ? "0px 10px 20px rgba(0, 0, 0, 0.10)" : "0px 10px 20px rgba(0, 0, 0, 0.0)",
                          "&:hover": {
                            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.10)",
                            // borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        {isSelected && (
                          <Stack
                            direction="row"
                            alignItems="center"
                            gap="5px"
                            sx={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              backgroundColor: alpha(
                                theme.palette.primary.main,
                                0.1
                              ),
                              padding: "2px 8px",
                              borderRadius: "5px",
                            }}
                          >
                            <Typography
                              fontSize="10px"
                              color="primary.main"
                              fontWeight="600"
                            >
                              {t("Pay on this account")}
                            </Typography>
                            <CheckCircleIcon
                              sx={{
                                fontSize: 16,
                                color: theme.palette.primary.main,
                              }}
                            />
                          </Stack>
                        )}

                        <Typography
                          fontWeight={700}
                          fontSize="14px"
                          textTransform="capitalize"
                          color={theme.palette.neutral[1000]}
                          mb={2}
                        >
                          {item.method_name}{" "}
                          {t("Info")}
                        </Typography>

                        <Stack gap="5px">
                          {item.method_fields?.map((field, i) => (
                            <Grid container key={i}>
                              <Grid item xs={4}>
                                <Typography
                                  fontSize="12px"
                                  color={theme.palette.neutral[500]}
                                >
                                  {field.input_name.replaceAll("_", " ")}
                                </Typography>
                              </Grid>
                              <Grid item xs={1}>
                                <Typography
                                  fontSize="12px"
                                  color={theme.palette.neutral[1000]}
                                >
                                  :
                                </Typography>
                              </Grid>
                              <Grid item xs={7}>
                                <Typography
                                  fontSize="12px"
                                  fontWeight={600}
                                  color={theme.palette.neutral[1000]}
                                  sx={{ wordBreak: "break-all" }}
                                >
                                  {field.input_data}
                                </Typography>
                              </Grid>
                            </Grid>
                          ))}
                        </Stack>
                      </Stack>
                    </Stack>
                  );
                })}
            </Stack>
            {formik.touched.payment_method &&
              formik.errors.payment_method &&
              !offlineMethod && (
                <FormHelperText
                  sx={{ color: (theme) => theme.palette.error.main }}
                >
                  {t("Please select an option.")}
                </FormHelperText>
              )}
            <Typography
              fontWeight={700}
              fontSize="16px"
              color={theme.palette.neutral[1000]}
              mt="3rem !important"
              mb="1rem !important"
            >
              {t("Payment Info")}
            </Typography>
            <Grid container spacing={3} sx={{ marginTop: "-24px !important", marginLeft: "-24px !important" }}>
              {offlinePaymentOptions
                ?.filter(
                  (item) => item.method_name === offlineMethod?.method_name
                )[0]
                ?.method_informations?.map((item, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <TextField
                      required
                      fullWidth
                      label={item?.customer_input
                        .replaceAll("_", " ")
                        .toLowerCase()
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                      id={item.customer_input}
                      name={item.customer_input}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={item.customer_placeholder
                        .replaceAll("_", " ")
                        .toLowerCase()
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                      value={formik.values[item.customer_input]}
                      error={
                        formik.touched[item.customer_input] &&
                        Boolean(formik.errors[item.customer_input])
                      }
                      helperText={
                        formik.touched[item.customer_input] &&
                        formik.errors[item.customer_input]
                      }
                    />
                  </Grid>
                ))}
              <Grid item xs={12} md={12}>
                <TextField
                  rows={4}
                  multiline
                  fullWidth
                  id="customer_note"
                  label="Payment Note"
                  name="customer_note"
                  value={formik.values["customer_note"]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                // defaultValue="Default Value"
                />
              </Grid>
            </Grid>
          </Stack>
          <CustomButtonStack>
            <Stack
              direction="row"
              width="100%"
              spacing={1}
              justifyContent={{ xs: "center", sm: "flex-end" }}
              gap={{ xs: "10px", sm: "20px" }}
              paddingTop={{ xs: "15px", sm: "20px", md: "25px" }}
            >
              <Button
                onClick={() => handleCancel()}
                sx={{
                  border: `1px solid ${borderColor}`,
                  borderRadius: "5px",
                  color: borderColor,
                  padding: "8px 16px",
                  width: "100%",
                }}
              >
                {t("Cancel")}
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={offlinePaymentLoading}
                sx={{
                  width: "100%",
                }}
              >
                {t("Complete Order")}
              </LoadingButton>
            </Stack>
          </CustomButtonStack>
        </form>
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};

export default OfflineForm;
