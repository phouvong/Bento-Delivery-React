import React, {useEffect, useRef, useState} from "react";
import {alpha, Box, InputAdornment, Stack, Typography, useTheme} from "@mui/material";
import { useFormik } from "formik";
import { CustomStackFullWidth, CustomTextField } from "styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import LoadingButton from "@mui/lab/LoadingButton";
import * as Yup from "yup";
import toast from "react-hot-toast";
import simage from "../../../../public/static/gotosupport.png"
import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import { useForgotPassword } from "api-manage/hooks/react-query/forgot-password/useForgotPassword";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "api-manage/api-error-response/ErrorResponses";
import { forgot_password_header } from "utils/staticTexts";
import { getLanguage } from "helper-functions/getLanguage";
import { CustomOutlinedInput } from "components/wallet/WalletBoxComponent";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import AuthModal from "components/auth/AuthModal";
import {setOpenForgotPasswordModal} from "redux/slices/utils";
import CustomImageContainer from "components/CustomImageContainer";
import {PrimaryButton} from "components/Map/map.style";
import {useRouter} from "next/router";
import PhoneOrEmailIcon from "components/auth/asset/PhoneOrEmailIcon";

const ForgotPasswordNumberForm = ({
  data,
  goNext,
  handleFirstForm,
  id,
  sendOTP,
  hasVerificationMethod,
  setHasVerificationMethod,
                                    handleSubmitOtp,
  phoneOrEmail,setPhoneOrEmail
}) => {
  const theme=useTheme()
  const dispatch=useDispatch()
  const router =useRouter()
  const { t } = useTranslation();
  const { configData } = useSelector((state) => state.configData);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [modalFor, setModalFor] = useState("sign-in");

  useEffect(() => {
    const { centralize_login,is_mail_active,is_sms_active
    } = configData || {};
    if (centralize_login) {
      const { phone_verification_status, email_verification_status } =
        centralize_login;
     if(is_mail_active && is_sms_active){
       setHasVerificationMethod(true)
       setPhoneOrEmail("phone")
      }
     else if (is_sms_active) {
       setHasVerificationMethod(true)
        setPhoneOrEmail("phone");
      } else if (is_mail_active) {
        setHasVerificationMethod(true)
        setPhoneOrEmail("email");
      }else{
       setHasVerificationMethod(false)
     }
    }
  }, [configData]);

  const phoneFormik = useFormik({
    initialValues: {
      phone: phoneOrEmail==="phone"?data ? data.phone : "":"",
      email:phoneOrEmail==="email"?data? data?.email:"":"",
      verification_method:phoneOrEmail
    },
    validationSchema: Yup.object({
      phone: Yup.string().when('verification_method', {
        is: phoneOrEmail==="phone",
        then: (schema) =>
          schema
            .required(t("Please provide a phone number"))
            .matches(/^\d{10}$/, t("Phone number must be exactly 10 digits")),
        otherwise: (schema) => schema.notRequired(),
      }),
      email: Yup.string().when('verification_method', {
        is: phoneOrEmail==="email",
        then: (schema) =>
          schema
            .required(t("Please provide an email address"))
            .email(t("Please enter a valid email address")),
        otherwise: (schema) => schema.notRequired(),
      }),
    })
,
    onSubmit: async (values, helpers) => {
     
      
      try {
        formSubmitHandler({...values,verification_method:phoneOrEmail});
      } catch (err) {}
    },
  });
  const onSuccessHandler = (res) => {
    if (res) {
      if (res?.errors?.length > 0) {
        goNext();
        toast.error(res?.errors[0].message);
      } else {
        goNext();
        toast.success(res.message);
      }

      // goNext();
      //toast.success(res.message);
    }
  };

  const { mutate, isLoading } = useForgotPassword({
    onSuccessHandler,
    onError: (errors) => {
      onErrorResponse(errors);
    },
  });
  const formSubmitHandler = (values) => {
    handleSubmitOtp(values,onSuccessHandler,mutate)

  };
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const handleOnChange = (value) => {
    phoneFormik.setFieldValue("phone", `+${value}`);
  };
  const handleEmailChange=(value)=>{
    phoneFormik.setFieldValue("email",value)
  }

  const handleClose = () => {
    setModalFor("sign-in");
    setOpenSignIn(false);
  };
const handleClick=()=>{
  setOpenSignIn(true)
  setModalFor("sign-in");
  //dispatch(setOpenForgotPasswordModal(false))

}
  const handleSupport = () => {
    dispatch(setOpenForgotPasswordModal(false));
    window.open("/help-and-support", "_blank");
  };

const text1=t("Please enter the registered")
  const text2=t("where you want to sent your password recovery OTP.")
  return (
    <CustomStackFullWidth sx={{maxWidth:"330px"}}>
      {hasVerificationMethod ? (<>
        <Stack>
          <Typography fontSize="12px">{t(`${text1} ${phoneOrEmail==="phone"?"phone number":"email"} ${text2}`)}</Typography>
        </Stack>
        <form noValidate onSubmit={phoneFormik.handleSubmit}>
          <CustomStackFullWidth mt="2rem">
            {phoneOrEmail === "phone" ? (
              <CustomPhoneInput
                value={phoneFormik.values.phone}
                onHandleChange={handleOnChange}
                initCountry={configData?.country}
                touched={phoneFormik.touched.phone}
                errors={phoneFormik.errors.phone}
                lanDirection={lanDirection}
                height="45px"
                borderRadius="10px"
              />
            ):  <CustomTextFieldWithFormik
              name="email"
              label={t("Email")}
              placeholder={t("Enter email")}
              touched={phoneFormik.touched.email}
              errors={phoneFormik.errors.email}
              fieldProps={phoneFormik.getFieldProps("email")}
              onChangeHandler={handleEmailChange}
              value={phoneFormik.values.email}
              height="45px"
              borderRadius="10px"
              startIcon={
                <InputAdornment position="start">
                  <PhoneOrEmailIcon
                    sx={{
                      color:
                        alpha(theme.palette.neutral[500], 0.4)
                    }}
                  />
                </InputAdornment>
              }
            />}

            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={isLoading}
              id={id}
            >
              { t("Request OTP")}
            </LoadingButton>
          </CustomStackFullWidth>
        </form>
        <Typography paddingY="10px">{t("Or")}</Typography>
        <Typography component="span" marginBottom="10px" color={theme.palette.neutral[1000]}>
          {t(
            "Back to"
          )}
          <Typography onClick={handleClick} component="span" sx={{cursor:"pointer",paddingInlineStart:"10px",textDecoration:"underline",color:theme=>theme.palette.primary.main}}>{("Log in")}</Typography>
        </Typography>
        <AuthModal
          modalFor={modalFor}
          setModalFor={setModalFor}
          open={openSignIn}
          handleClose={handleClose}
        />
      </>):(
        <Stack width="100%" justifyContent="center" alignItems="center" spacing={2}>
          <CustomImageContainer
            src={simage.src}
            alt="logo"
            width="100px"
            height="100px"
            sx={{ borderRadius: "50%", marginBottom: "1rem" }}
          />
          <Typography fontSize="20px" fontWeight="700">{t("Sorry, Something Went Wrong")}</Typography>
          <Typography fontSize="14px" color={alpha(theme.palette.neutral[400],.7)}>{t("Please try again after some time or Contact with our support team.")}</Typography>

          <PrimaryButton onClick={handleSupport}>
            {t("Help & Support")}
          </PrimaryButton>
        </Stack>
      )}

    </CustomStackFullWidth>
  );
};
export default ForgotPasswordNumberForm;
