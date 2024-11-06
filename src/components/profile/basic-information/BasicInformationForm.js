import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Grid,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import ValidationSechemaProfile from "./Validation";
import IconButton from "@mui/material/IconButton";
import toast from "react-hot-toast";
import { useDeleteProfile } from "api-manage/hooks/react-query/profile/useDeleteProfile";
import { useRouter } from "next/router";
import ImageUploaderWithPreview from "../../single-file-uploader-with-preview/ImageUploaderWithPreview";
import useUpdateProfile from "../../../api-manage/hooks/react-query/profile/useUpdateProfile";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "api-manage/api-error-response/ErrorResponses";
import { setUser } from "redux/slices/profileInfo";
import { useDispatch } from "react-redux";
import ImageAddIcon from "../../single-file-uploader-with-preview/ImageAddIcon";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CustomAlert from "../../alert/CustomAlert";
import FormSubmitButton from "../FormSubmitButton";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import VerifiedIcon from "components/profile/VerifiedIcon";
import CustomModal from "components/modal";
import OtpForm from "components/auth/sign-up/OtpForm";
import { auth } from "firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useFireBaseOtpVerify } from "api-manage/hooks/react-query/forgot-password/useFIreBaseOtpVerify";

export const BackIconButton = styled(IconButton)(({ theme }) => ({
  padding: "10px",
  borderRadius: "4px",
  justifyContent: "center",
  fontSize: "13px",
  color: theme.palette.primary.main,
}));
export const ResetButton = styled(Button)(({ theme }) => ({
  borderRadius: "5px",
  borderColor: theme.palette.neutral[400],
  color: theme.palette.neutral[400],
  marginRight: "5px",
  paddingInline: "30px",
}));

export const convertValuesToFormData = (values, resData, verificationId) => {
  const { name, phone, email, image, button_type, reset_token, password } =
    values;
  let formData = new FormData();
  if (values?.reset_token) {
    formData.append("name", name ?? resData?.name);
    // formData.append('l_name', l_name ?? resData?.l_name)
    formData.append(
      "phone",
      resData?.verification_on === "email"
        ? resData?.phone
        : phone ?? resData?.phone
    );
    formData.append("email", email ?? resData?.email);
    formData.append("image", image ?? resData?.image ?? resData?.image);
    formData.append("button_type", button_type ?? resData?.button_type);
    formData.append("otp", reset_token ? reset_token : null);
    formData.append(
      "verification_medium",
      reset_token ? resData?.verification_medium : null
    );
    formData.append(
      "verification_on",
      reset_token ? resData?.verification_on : null
    );
    formData.append("session_info", verificationId);
  } else {
    formData.append("name", name ?? resData?.name);
    formData.append("phone", phone ?? resData?.phone);
    formData.append("email", email ?? resData?.email);
    formData.append("image", image ?? resData?.image ?? resData?.image);
    if (button_type) {
      formData.append("button_type", button_type);
    } else if (resData?.button_type) {
      formData.append("button_type", resData.button_type);
    }

    formData.append("password", password ?? resData?.password);
  }
  return formData;
};
const BasicInformationForm = ({
  data,
  configData,
  t,
  refetch,
  setEditProfile,
  formSubmit,
  handleCloseEmail,
  handleClosePhone,
  handleClick,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openEmail, setOpenEmail] = React.useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [resData, setResData] = React.useState([]);
  const [loginValue, setLoginValue] = useState(null);
  const recaptchaWrapperRef = useRef(null);
  const imageContainerRef = useRef();
  const { f_name, l_name, phone, email, image_full_url } = data;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const customerImageUrl = configData?.base_urls?.customer_image_url;
  const dispatch = useDispatch();
  const profileFormik = useFormik({
    initialValues: {
      name: f_name ? `${f_name} ${l_name ? l_name : ""}` : "",
      email: email ? email : "",
      phone: phone ? phone : "",
      image: image_full_url ? image_full_url : "",
      password: "",
      confirm_password: "",
    },
    validationSchema: ValidationSechemaProfile(),
    onSubmit: async (values, helpers) => {
      try {
        formSubmitOnSuccess(values);
      } catch (err) {}
    },
  });
  const { mutate: fireBaseOtpMutation, isLoading: fireIsLoading } =
    useFireBaseOtpVerify();
  const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-update",
        {
          size: "invisible",
          callback: (response) => {
            console.log("Recaptcha verified", response);
          },
          "expired-callback": () => {
            window.recaptchaVerifier?.reset();
          },
        },
        auth
      );
    } else {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
      // setUpRecaptcha()
    }
  };

  useEffect(() => {
    setUpRecaptcha();
    return () => {
      if (recaptchaWrapperRef.current) {
        //recaptchaWrapperRef.current.clear(); // Clear Recaptcha when component unmounts
        recaptchaWrapperRef.current = null;
      }
    };
  }, []);
  const sendOTP = (response, values) => {
    const phoneNumber = values?.phone;
    if (!phoneNumber) {
      console.error("Invalid phone number");
      return;
    }

    if (!window.recaptchaVerifier) {
      setUpRecaptcha();
    }
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setOpen(true);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log("Error in sending OTP", error);
      });
  };
  const { mutate: profileUpdateByMutate, isLoading } = useUpdateProfile();
  const formSubmitOnSuccess = (values) => {
    const onSuccessHandler = (response) => {
      console.log("errroooorrrrr");
      if (response) {
        setResData({
          ...resData,
          ...response,
          name: values?.name,
          // l_name: l_name,
          phone: values?.phone,
          email: values?.email,
          image: values?.image,
          button_type: values?.button_type,
        });
        if (response?.otp_send) {
          if (response?.verification_on === "phone") {
            if (configData?.firebase_otp_verification === 1) {
              sendOTP(response, values);
            } else {
              setOpen(true);
            }
          } else {
            setOpenEmail(true);
          }
        } else {
          setOpenEmail(false);
          setOpen(false);
          toast.success(response?.message);
          refetch();
          handleClick();
        }
      }
    };

    const formData = convertValuesToFormData(values, resData, verificationId);
    profileUpdateByMutate(formData, {
      onSuccess: onSuccessHandler,
      onError: (error) => {
        console.log({ error });
        if (Array.isArray(error?.response?.data?.errors)) {
          return onErrorResponse(error);
        } else {
          toast.error(error?.response?.data?.message);
        }
      },
    });
  };
  const singleFileUploadHandlerForImage = (value) => {
    profileFormik.setFieldValue("image", value.currentTarget.files[0]);
  };
  const imageOnchangeHandlerForImage = (value) => {
    profileFormik.setFieldValue("image", value);
  };
  const router = useRouter();
  const onSuccessHandlerForUserDelete = (res) => {
    if (res?.errors) {
      toast.error(res?.errors?.[0]?.message);
    } else {
      localStorage.removeItem("token");
      toast.success(t("Account has been deleted"));
      dispatch(setUser(null));
      router.push("/", undefined, { shallow: true });
    }
    setOpenModal(false);
  };
  const { mutate, isLoading: isLoadingDelete } = useDeleteProfile(
    onSuccessHandlerForUserDelete
  );
  const deleteUserHandler = () => {
    mutate();
  };
  const handleReset = () => {
    profileFormik.setFieldValue("name", "");
    profileFormik.setFieldValue("l_name", "");
    profileFormik.setFieldValue("email", "");
    profileFormik.setFieldValue("password", "");
  };
  const handleVerified = (type) => {
    if (type === "email") {
      formSubmitOnSuccess({ ...profileFormik?.values, button_type: "email" });
    } else {
      formSubmitOnSuccess({ ...profileFormik?.values, button_type: "phone" });
    }
  };
  return (
    <>
      <Grid item md={12} xs={12} alignSelf="center">
        <div ref={recaptchaWrapperRef}>
          <div id="recaptcha-update"></div>
        </div>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle2" fontWeight="700">
            {t("Edit Personal Details")}
          </Typography>
          <BackIconButton onClick={() => setEditProfile(false)}>
            <ArrowBackIosNewIcon
              sx={{
                fontSize: "10px",
                color: (theme) => theme.palette.primary.main,
                fontWeight: "700",
                marginRight: "3px",
              }}
            />
            {t("Go Back")}
          </BackIconButton>

          {/*<ButtonBox onClick={() => setOpenModal(true)}>*/}
          {/*  <Button*/}
          {/*    variant="outlined"*/}
          {/*    type="submit"*/}
          {/*    startIcon={<PersonRemoveIcon />}*/}
          {/*  >*/}
          {/*    <Typography fontWeight="400" fontSize="12px">*/}
          {/*      {t("Delete My Account")}*/}
          {/*    </Typography>*/}
          {/*  </Button>*/}
          {/*</ButtonBox>*/}
        </Stack>
      </Grid>
      <form noValidate onSubmit={profileFormik.handleSubmit}>
        <Grid
          container
          md={12}
          xs={12}
          spacing={{ xs: 2, sm: 2, md: 3 }}
          paddingRight={{ xs: "0px", md: "60px" }}
          paddingLeft={{ xs: "0px", md: "60px" }}
          marginLeft="0px"
        >
          <Grid item md={12} xs={12} textAlign="-webkit-center">
            <Stack
              sx={{
                position: "relative",
                width: "140px",
                borderRadius: "50%",
              }}
            >
              <ImageUploaderWithPreview
                type="file"
                labelText={t("Upload your photo")}
                hintText="Image format - jpg, png, jpeg, gif Image Size - maximum size 2 MB Image Ratio - 1:1"
                file={profileFormik.values.image}
                onChange={singleFileUploadHandlerForImage}
                imageOnChange={imageOnchangeHandlerForImage}
                width="8.125rem"
                // imageUrl={customerImageUrl}
                borderRadius="50%"
                objectFit
                //height='140px'
              />
              {image_full_url && (
                <ImageAddIcon
                  imageChangeHandler={singleFileUploadHandlerForImage}
                />
              )}
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              sx={{ width: "100%" }}
              InputProps={{
                style: {
                  height: "45px", // Set your desired height value here
                },
              }}
              id="outlined-basic"
              variant="outlined"
              name="name"
              value={profileFormik.values.name}
              onChange={profileFormik.handleChange}
              label={t("User Name")}
              required
              error={
                profileFormik.touched.name && Boolean(profileFormik.errors.name)
              }
              helperText={
                profileFormik.touched.name && profileFormik.errors.name
              }
              touched={profileFormik.touched.name && "true"}
            />
          </Grid>
          {/*<Grid item md={6} xs={12}>*/}
          {/*  <TextField*/}
          {/*    sx={{ width: "100%" }}*/}
          {/*    InputProps={{*/}
          {/*      style: {*/}
          {/*        height: "45px", // Set your desired height value here*/}
          {/*      },*/}
          {/*    }}*/}
          {/*    id="outlined-basic"*/}
          {/*    // label="Enter Last Name"*/}
          {/*    variant="outlined"*/}
          {/*    name="l_name"*/}
          {/*    value={profileFormik.values.l_name}*/}
          {/*    onChange={profileFormik.handleChange}*/}
          {/*    label={t("Last Name")}*/}
          {/*    required*/}
          {/*    error={*/}
          {/*      profileFormik.touched.l_name &&*/}
          {/*      Boolean(profileFormik.errors.l_name)*/}
          {/*    }*/}
          {/*    helperText={*/}
          {/*      profileFormik.touched.l_name && profileFormik.errors.l_name*/}
          {/*    }*/}
          {/*    touched={profileFormik.touched.l_name && "true"}*/}
          {/*  />*/}
          {/*</Grid>*/}
          <Grid item md={6} xs={12}>
            <Stack position="relative">
              <TextField
                sx={{ width: "100%" }}
                InputProps={{
                  style: {
                    height: "45px", // Set your desired height value here
                  },
                }}
                id="outlined-basic"
                // label="Enter Email"
                variant="outlined"
                name="email"
                value={profileFormik.values.email}
                onChange={profileFormik.handleChange}
                label={t("Email")}
                required
                error={
                  profileFormik.touched.email &&
                  Boolean(profileFormik.errors.email)
                }
                helperText={
                  profileFormik.touched.email && profileFormik.errors.email
                }
                touched={profileFormik.touched.email && "true"}
              />
              <Stack
                sx={{
                  position: "absolute",
                  right: "10px",
                  top: "12px",
                }}
              >
                <>
                  {" "}
                  {email && (
                    <>
                      {data?.is_email_verified === 1 &&
                      email === profileFormik?.values.email ? (
                        <VerifiedIcon />
                      ) : (
                        <>
                          {configData?.centralize_login
                            ?.email_verification_status === 1 && (
                            <ReportProblemIcon
                              onClick={() => handleVerified("email")}
                              sx={{
                                color: (theme) => theme.palette.error.main,
                                width: "1.2rem",
                                cursor: "pointer",
                              }}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              </Stack>
            </Stack>
          </Grid>
          <Grid item md={6} xs={12}>
            <Stack position="relative">
              <TextField
                name="phone"
                disabled={data?.is_phone_verified === 1}
                label={
                  <span>
                    {t("Phone")}{" "}
                    {data?.is_phone_verified === 1 && (
                      <>
                        <span style={{ color: "red" }}>
                          ({t("Not Changeable")})
                        </span>{" "}
                      </>
                    )}
                  </span>
                }
                variant="outlined"
                sx={{ width: "100%" }}
                InputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  style: {
                    height: "45px", // Set your desired height value here
                  },
                }}
                value={profileFormik.values.phone}
                onChange={(e) => {
                  let inputValue = e.target.value;

                  // Allow + at the beginning and remove all non-numeric characters after the first position
                  if (inputValue[0] === "+") {
                    inputValue = `+${inputValue.slice(1).replace(/\D/g, "")}`;
                  } else {
                    inputValue = inputValue.replace(/\D/g, ""); // Remove all non-numeric characters
                  }

                  profileFormik.setFieldValue("phone", inputValue);
                }}
              />
              <Stack
                sx={{
                  position: "absolute",
                  right: "10px",
                  top: "12px",
                }}
              >
                {data?.is_phone_verified === 1 ? (
                  <VerifiedIcon />
                ) : (
                  <>
                    {configData?.centralize_login?.phone_verification_status ===
                      1 && (
                      <ReportProblemIcon
                        onClick={() => handleVerified("phone")}
                        sx={{
                          color: (theme) => theme.palette.error.main,
                          width: "1.2rem",
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </>
                )}
              </Stack>
            </Stack>
          </Grid>
          {configData?.centralize_login?.manual_login_status === 1 ? (
            <>
              <Grid item md={6} xs={12}>
                <TextField
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: "100%" }}
                  id="password"
                  variant="outlined"
                  placeholder={t("Password")}
                  value={profileFormik.values.password}
                  onChange={profileFormik.handleChange}
                  name="password"
                  label={t("Password")}
                  type={showPassword ? "text" : "password"}
                  error={
                    profileFormik.touched.password &&
                    Boolean(profileFormik.errors.password)
                  }
                  helperText={
                    profileFormik.touched.password &&
                    profileFormik.errors.password
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowPassword((prevState) => !prevState)
                          }
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: {
                      height: "45px", // Set your desired height value here
                    },
                  }}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  required
                  sx={{ width: "100%" }}
                  id="confirm_password"
                  label={t("Confirm Password")}
                  variant="outlined"
                  placeholder={t("Confirm Password")}
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={profileFormik.values.confirm_password}
                  onChange={profileFormik.handleChange}
                  error={
                    profileFormik.touched.confirm_password &&
                    Boolean(profileFormik.errors.confirm_password)
                  }
                  helperText={
                    profileFormik.touched.confirm_password &&
                    profileFormik.errors.confirm_password
                  }
                  touched={profileFormik.touched.confirm_password && "true"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setConfirmShowPassword((prevState) => !prevState)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                    style: {
                      height: "45px", // Set your desired height value here
                    },
                  }}
                />
              </Grid>
            </>
          ) : (
            ""
          )}

          <Grid item md={12} xs={12} align="end">
            <FormSubmitButton
              handleReset={handleReset}
              isLoading={isLoading}
              reset={t("Reset")}
              submit={t("Update Profile")}
            />
            {/*<ResetButton variant="outlined" onClick={handleReset}>*/}
            {/*  {t("Reset")}*/}
            {/*</ResetButton>*/}
            {/*<SaveButton variant="contained" type="submit" loading={isLoading}>*/}
            {/*  {t("Update Profile")}*/}
            {/*</SaveButton>*/}
          </Grid>
        </Grid>
      </form>
      {open && (
        <CustomModal
          openModal={open}
          handleClose={() => setOpen(false)}
          setModalOpen={setOpen}
        >
          <OtpForm
            data={data?.phone}
            handleClose={() => setOpen(false)}
            formSubmitHandler={formSubmitOnSuccess}
            loginValue={resData}
            reSendOtp={formSubmitOnSuccess}
          />
        </CustomModal>
      )}
      {openEmail && (
        <CustomModal
          handleClose={() => setOpenEmail(false)}
          openModal={openEmail}
          setModalOpen={setOpenEmail}
        >
          <OtpForm
            data={profileFormik?.values.email}
            handleClose={() => setOpenEmail(false)}
            formSubmitHandler={formSubmitOnSuccess}
            loginValue={resData}
            reSendOtp={formSubmitOnSuccess}
          />
        </CustomModal>
      )}
    </>
  );
};
export default BasicInformationForm;
