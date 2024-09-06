import {
	Checkbox,
	FormControlLabel,
	NoSsr,
	styled,
	Typography,
	useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import {
	CustomPaperBigCard,
	CustomStackFullWidth,
	CustomTypographyGray,
} from "styled-components/CustomStyles.style";

import { t } from "i18next";
import { CustomTypography } from "../../landing-page/hero-section/HeroSection.style";
import SignInForm from "./SignInForm";
// import AcceptTermsAndConditions from "../../../../pages/auth/AcceptTermsAndConditions";
import LoadingButton from "@mui/lab/LoadingButton";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useSignIn } from "api-manage/hooks/react-query/auth/useSignIn";
import { useFireBaseOtpVerify } from "api-manage/hooks/react-query/forgot-password/useFIreBaseOtpVerify";
import { useVerifyPhone } from "api-manage/hooks/react-query/forgot-password/useVerifyPhone";
import { useWishListGet } from "api-manage/hooks/react-query/wish-list/useWishListGet";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useFormik } from "formik";
import { getGuestId } from "helper-functions/getToken";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCartList } from "redux/slices/cart";
import { setUser } from "redux/slices/profileInfo";
import { setWishList } from "redux/slices/wishList";
import { handleProductValueWithOutDiscount } from "utils/CustomFunctions";
import {
	loginSuccessFull,
	moduleSelected,
	SigninSuccessFull,
} from "utils/toasterMessages";
import useGetAllCartList from "../../../api-manage/hooks/react-query/add-cart/useGetAllCartList";
import useGetProfile from "../../../api-manage/hooks/react-query/profile/useGetProfile";
import { auth } from "../../../firebase"; // Import the Firebase auth instance
import { getSelectedVariations } from "../../header/second-navbar/SecondNavbar";
import { ModuleSelection } from "../../landing-page/hero-section/module-selection";
import CustomModal from "../../modal";
import AuthHeader from "../AuthHeader";
import OtpForm from "../sign-up/OtpForm";
import SignUpValidation from "./SignInValidation";
import SocialLogins from "./social-login/SocialLogins";

const CustomLink = styled(Link)(({ theme }) => ({
	"&:hover": {
		color: theme.palette.primary.main,
	},
}));

const SignIn = ({ configData }) => {
	const router = useRouter();
	const previousRouteName = router.query.from;
	const guestId = getGuestId();
	const dispatch = useDispatch();
	const [openModuleSelection, setOpenModuleSelection] = useState(false);
	const [openOtpModal, setOpenOtpModal] = useState(false);
	const [otpData, setOtpData] = useState({ phone: "" });
	const [mainToken, setMainToken] = useState(null);
	const [isApiCalling, setIsApiCalling] = useState(false);
	const [isRemember, setIsRemember] = useState(false);
	const theme = useTheme();
	const [verificationId, setVerificationId] = useState(null);

	const textColor = theme.palette.whiteContainer.main;
	let userDatafor = undefined;
	if (typeof window !== "undefined") {
		userDatafor = JSON.parse(localStorage.getItem("userDatafor"));
	}
	const getModule = () => {
		return JSON.parse(window.localStorage.getItem("module"));
	};
	const loginFormik = useFormik({
		initialValues: {
			phone: userDatafor ? userDatafor.phone : "",
			password: userDatafor ? userDatafor.password : "",
			tandc: false,
		},
		validationSchema: SignUpValidation(),
		onSubmit: async (values, helpers) => {
			try {
				if (isRemember) {
					localStorage.setItem("userDatafor", JSON.stringify(values));
				}
				formSubmitHandler(values);
			} catch (err) {
				console.log(err);
			}
		},
	});

	const setUpRecaptcha = () => {
		// Check if reCAPTCHA is already initialized
		if (!window.recaptchaVerifier) {
			window.recaptchaVerifier = new RecaptchaVerifier(
				"recaptcha-container",
				{
					size: "invisible",
					callback: (response) => {
						console.log("Recaptcha verified", response);
					},
					"expired-callback": () => {
						window.recaptchaVerifier?.reset?.();
					},
				},
				auth
			);
		} else {
			// Only reset without re-initializing
			window.recaptchaVerifier?.reset?.();
		}
	};

	const sendOTP = (response) => {
		setUpRecaptcha();
		const phoneNumber = loginFormik?.values?.phone;
		// country code
		const appVerifier = window.recaptchaVerifier;
		signInWithPhoneNumber(auth, phoneNumber, appVerifier)
			.then((confirmationResult) => {
				console.log({ confirmationResult });
				setVerificationId(confirmationResult.verificationId);
				setOtpData({ phone: phoneNumber });
				setMainToken(response);
			})
			.catch((error) => {
				console.log("Error in sending OTP", error);
			});
	};
	const cartListSuccessHandler = (res) => {
		if (res) {
			const tempCartLists = res?.map((item) => ({
				...item?.item,
				cartItemId: item?.id,
				totalPrice:
					handleProductValueWithOutDiscount(item?.item) * item?.quantity,
				selectedAddons: item?.item?.addons,
				quantity: item?.quantity,
				food_variations: item?.item?.food_variations,
				itemBasePrice: item?.item?.price,
				selectedOption:
					getModule()?.module_type !== "food"
						? item?.variation
						: getSelectedVariations(item?.item?.food_variations),
			}));
			dispatch(setCartList(tempCartLists));
		}
	};

	const {
		data,
		refetch: cartListRefetch,
		isLoading,
	} = useGetAllCartList(cartListSuccessHandler);
	const userOnSuccessHandler = (res) => {
		dispatch(setUser(res));
		//handleClose()
	};

	let location = undefined;
	let isModuleSelected = undefined;
	let lanDirection = undefined;
	let languageSetting;
	if (typeof window !== "undefined") {
		location = localStorage.getItem("location");
		isModuleSelected = JSON.parse(localStorage.getItem("module"));
		lanDirection = JSON.parse(localStorage.getItem("settings"));
		languageSetting = JSON.parse(localStorage.getItem("language-setting"));
	}

	const handleOnChange = (value) => {
		loginFormik.setFieldValue("phone", `+${value}`);
	};
	const passwordHandler = (value) => {
		loginFormik.setFieldValue("password", value);
	};
	const handleCheckbox = (e) => {
		loginFormik.setFieldValue("tandc", e.target.checked);
	};
	useEffect(() => {
		if (otpData?.phone !== "") {
			setOpenOtpModal(true);
		}
	}, [otpData]);

	const onSuccessHandler = (response) => {
		dispatch(setWishList(response));
		setIsApiCalling(false);
	};

	const { data: userData, refetch: profileRefetch } =
		useGetProfile(userOnSuccessHandler);
	const { refetch: wishlistRefetch, isLoading: isLoadingWishlist } =
		useWishListGet(onSuccessHandler);
	const handleTokenAfterSignIn = async (response) => {
		if (response) {
			localStorage.setItem("token", response?.token);
			await wishlistRefetch();
			await profileRefetch();
			await cartListRefetch();
			toast.success(t(loginSuccessFull));
			if (previousRouteName) {
				router.push("/home");
			} else if (previousRouteName === "/order") {
				router.push("/home");
			} else if (previousRouteName === "/forgot-password") {
				router.push("/home");
			} else {
				await router.back();
			}
		}
	};

	const handleTokenAfterSignUp = async (response) => {
		if (response) {
			if (typeof window !== "undefined") {
				localStorage.setItem("token", response?.token);
				await profileRefetch();
				await wishlistRefetch();
			}
			toast.success(t(SigninSuccessFull));
			if (location && !isModuleSelected) {
				setOpenModuleSelection(true);
			} else {
				if (previousRouteName) {
					router.push("/home");
				} else if (previousRouteName === "/order") {
					router.push("/home");
				} else if (previousRouteName === "/forgot-password") {
					router.push("/home");
				} else {
					await router.back();
				}
			}
		}
	};
	const handleCloseModuleModal = (item) => {
		if (item) {
			toast.success(t(moduleSelected));
			if (previousRouteName) {
				router.push("/home");
			} else {
				router.back();
			}
		}
		setOpenModuleSelection(false);
	};

	const handleError = () => {
		setIsApiCalling(false);
	};
	const { mutate } = useSignIn(handleError);
	const formSubmitHandler = (values) => {
		setIsApiCalling(true);
		const newValues = { ...values, guest_id: guestId };
		mutate(newValues, {
			onSuccess: async (response) => {
				//setDefaultLanguage();
				if (configData?.customer_verification) {
					if (Number.parseInt(response?.is_phone_verified) === 1) {
						await handleTokenAfterSignUp(response);
					} else {
						if (configData?.firebase_otp_verification === 1) {
							await sendOTP(response);
						} else {
							//
							setOtpData({ phone: values?.phone });
							setMainToken(response);
						}
					}
				} else {
					await handleTokenAfterSignUp(response);
				}
			},
			onError: onErrorResponse,
		});
	};

	const { mutate: otpVerifyMutate, isLoading: isLoadingOtpVerifyApi } =
		useVerifyPhone();
	const { mutate: fireBaseOtpMutation, isLoading: fireIsLoading } =
		useFireBaseOtpVerify();

	const onSuccessHandlerOtp = async (res) => {
		toast.success(res?.message);
		setOpenOtpModal(false);
		await handleTokenAfterSignIn(mainToken);
	};

	const otpFormSubmitHandler = (values) => {
		if (configData?.firebase_otp_verification === 1) {
			const temValue = {
				phoneNumber: values?.phone,
				sessionInfo: verificationId,
				code: values?.reset_token,
			};
			fireBaseOtpMutation(temValue, {
				onSuccess: onSuccessHandlerOtp,
				onError: onErrorResponse,
			});
		} else {
			otpVerifyMutate(values, {
				onSuccess: onSuccessHandlerOtp,
				onError: onErrorResponse,
			});
		}
	};

	const handleFormBasedOnDirection = () => (
		<SignInForm
			configData={configData}
			handleOnChange={handleOnChange}
			passwordHandler={passwordHandler}
			loginFormik={loginFormik}
			lanDirection={lanDirection?.direction}
		/>
	);
	const rememberMeHandleChange = (e) => {
		if (e.target.checked) {
			setIsRemember(true);
		} else {
			localStorage.removeItem("userDatafor");
		}
	};
	return (
		<>
			<NoSsr>
				<CustomStackFullWidth
					justifyContent="center"
					alignItems="center"
					// mt="10rem"
					pb="80px"
					mt="1rem"
				>
					<Box maxWidth="500px" width="100%">
						<CustomPaperBigCard>
							<CustomStackFullWidth
								// justifyContent="center"
								// alignItems="center"
								spacing={2}
							>
								<AuthHeader
									configData={configData}
									title={t("Sign In")}
								/>
								<form noValidate onSubmit={loginFormik.handleSubmit}>
									<CustomStackFullWidth spacing={2}>
										{handleFormBasedOnDirection()}
										<CustomStackFullWidth
											justifyContent="space-between"
											alignItems="center"
											direction="row"
										>
											<FormControlLabel
												control={
													<Checkbox
														value="remember"
														color="primary"
														onChange={rememberMeHandleChange}
													/>
												}
												label={
													<CustomTypography fontSize="14px">
														{t("Remember me")}
													</CustomTypography>
												}
											/>
											<CustomLink href="/forgot-password">
												{t("Forgot password?")}
											</CustomLink>
										</CustomStackFullWidth>
										{/*<AcceptTermsAndConditions*/}
										{/*  handleCheckbox={handleCheckbox}*/}
										{/*  formikType={loginFormik}*/}
										{/*/>*/}
										<CustomStackFullWidth spacing={2}>
											<LoadingButton
												type="submit"
												fullWidth
												variant="contained"
												loading={isApiCalling}
												sx={{ color: textColor }}
												id="recaptcha-container"
											>
												{t("Sign In")}
											</LoadingButton>
											{configData?.social_login?.length > 0 &&
												configData?.social_login?.some(
													(item) => item.status === true
												) && (
													<CustomStackFullWidth
														alignItems="center"
														justifyContent="center"
														spacing={1}
													>
														<CustomTypographyGray nodefaultfont="true">
															{t("Or")}
														</CustomTypographyGray>
														<CustomTypography>
															{t("Login with")}
														</CustomTypography>
														<SocialLogins
															socialLogin={
																configData?.social_login
															}
															configData={configData}
														/>
													</CustomStackFullWidth>
												)}

											<Typography
												sx={{
													a: {
														"&:hover": {
															letterSpacing: "0.03em",
														},
													},
												}}
											>
												{t("Don't have an account?")}{" "}
												<Link
													href="/auth/sign-up"
													style={{
														color: theme.palette.primary.main,
														textDecoration: "underline",
													}}
												>
													{t("Sign Up")}
												</Link>
											</Typography>
										</CustomStackFullWidth>
									</CustomStackFullWidth>
								</form>
							</CustomStackFullWidth>
						</CustomPaperBigCard>
					</Box>
				</CustomStackFullWidth>
			</NoSsr>
			{openModuleSelection && (
				<ModuleSelection
					location={location}
					closeModal={handleCloseModuleModal}
					disableAutoFocus
				/>
			)}
			<CustomModal
				handleClose={() => setOpenOtpModal(false)}
				openModal={openOtpModal}
			>
				<OtpForm
					data={otpData ? otpData : loginFormik?.values?.phone}
					formSubmitHandler={otpFormSubmitHandler}
					isLoading={isLoadingOtpVerifyApi || fireIsLoading}
					recaptcha="recaptcha-container"
				/>
			</CustomModal>
		</>
	);
};

export default SignIn;
