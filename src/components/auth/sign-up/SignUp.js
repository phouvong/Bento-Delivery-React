import { Box } from "@mui/system";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import {
	CustomPaperBigCard,
	CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import AuthHeader from "../AuthHeader";
import SignUpForm from "./SignUpForm";
// import AcceptTermsAndConditions from "../../../../pages/auth/AcceptTermsAndConditions";
import LoadingButton from "@mui/lab/LoadingButton";
import { Typography, useTheme } from "@mui/material";
import {
	onErrorResponse,
	onSingleErrorResponse,
} from "api-manage/api-error-response/ErrorResponses";
import { useSignUp } from "api-manage/hooks/react-query/auth/useSignUp";
import { useFireBaseOtpVerify } from "api-manage/hooks/react-query/forgot-password/useFIreBaseOtpVerify";
import { useVerifyPhone } from "api-manage/hooks/react-query/forgot-password/useVerifyPhone";
import useGetProfile from "api-manage/hooks/react-query/profile/useGetProfile";
import { auth } from "firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useFormik } from "formik";
import { getGuestId } from "helper-functions/getToken";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "redux/slices/profileInfo";
import { setWelcomeModal } from "redux/slices/utils";
import { setDefaultLanguage } from "utils/setDefaultLanguage";
import { signup_successfull } from "utils/toasterMessages";
import { ModuleSelection } from "../../landing-page/hero-section/module-selection";
import CustomModal from "../../modal";
import AcceptTermsAndConditions from "../AcceptTermsAndConditions";
import OtpForm from "./OtpForm";
import SignUpValidation from "./SignUpValidation";

const SignUp = ({ configData }) => {
	const router = useRouter();
	//const { configData } = useSelector((state) => state.configData);
	const { profileInfo } = useSelector((state) => state.profileInfo);
	const [openModuleSelection, setOpenModuleSelection] = useState(false);
	const theme = useTheme();
	const [otpData, setOtpData] = useState({ phone: "" });
	const [mainToken, setMainToken] = useState(null);
	const [openOtpModal, setOpenOtpModal] = useState(false);
	//const [welcomeModal, setWelcomeModal] = useState(false);
	const [selectedModule, setSelectedModule] = useState(null);
	const [verificationId, setVerificationId] = useState(null);
	const guestId = getGuestId();
	// const { sendOTP, verificationId, isOtpSent } = useFirebasePhoneAuth();
	const { mutate: fireBaseOtpMutation, isLoading: fireIsLoading } =
		useFireBaseOtpVerify();
	const signUpFormik = useFormik({
		initialValues: {
			f_name: "",
			l_name: "",
			email: "",
			phone: "",
			password: "",
			confirm_password: "",
			ref_code: "",
			tandc: false,
		},
		validationSchema: SignUpValidation(),
		onSubmit: async (values, helpers) => {
			try {
				formSubmitHandler(values);
			} catch (err) {}
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
						window.recaptchaVerifier?.reset();
					},
				},
				auth
			);
		} else {
			// Only reset without re-initializing
			window.recaptchaVerifier?.reset();
		}
	};

	const sendOTP = () => {
		setUpRecaptcha();
		const phoneNumber = signUpFormik?.values?.phone;
		// country code
		const appVerifier = window.recaptchaVerifier;
		signInWithPhoneNumber(auth, phoneNumber, appVerifier)
			.then((confirmationResult) => {
				console.log({ confirmationResult });
				setVerificationId(confirmationResult.verificationId);
				setOtpData({ phone: phoneNumber });
			})
			.catch((error) => {
				console.log("Error in sending OTP", error);
			});
	};
	const handleClose = () => {
		setOpenOtpModal(false);
	};

	const fNameHandler = (value) => {
		signUpFormik.setFieldValue("f_name", value);
	};
	const lNameHandler = (value) => {
		signUpFormik.setFieldValue("l_name", value);
	};
	const emailHandler = (value) => {
		signUpFormik.setFieldValue("email", value);
	};
	const handleOnChange = (value) => {
		signUpFormik.setFieldValue("phone", `+${value}`);
	};
	const passwordHandler = (value) => {
		signUpFormik.setFieldValue("password", value);
	};
	const confirmPasswordHandler = (value) => {
		signUpFormik.setFieldValue("confirm_password", value);
	};
	const handleCheckbox = (e) => {
		signUpFormik.setFieldValue("tandc", e.target.checked);
	};
	const ReferCodeHandler = (value) => {
		signUpFormik.setFieldValue("ref_code", value);
	};

	let location = undefined;
	if (typeof window !== "undefined") {
		location = localStorage.getItem("location");
	}
	useEffect(() => {
		if (otpData?.phone !== "") {
			setOpenOtpModal(true);
		}
	}, [otpData]);
	const dispatch = useDispatch();
	const userOnSuccessHandler = (res) => {
		dispatch(setUser(res));
		//handleClose()
	};
	const { data: userData, refetch: profileRefetch } =
		useGetProfile(userOnSuccessHandler);
	const handleTokenAfterSignUp = (response) => {
		if (response) {
			localStorage.setItem("token", response?.token);
			profileRefetch();
			toast.success(t(signup_successfull));
			const zoneSelected = JSON.parse(localStorage.getItem("zoneid"));
			if (zoneSelected) {
				setOpenModuleSelection(true);
			} else {
				router.push("/home", undefined, { shallow: true });
			}
		}
	};

	const handleCloseModuleModal = (item) => {
		if (item) {
			toast.success(t("A Module has been selected."));
			if (signUpFormik.values.ref_code) {
				setSelectedModule(item);
				dispatch(setWelcomeModal(true));
			}

			if (item.module_type !== "parcel") {
				router.push("/interest", undefined, { shallow: true });
			} else {
				router.push("/home", undefined, { shallow: true });
			}
		}
		setOpenModuleSelection(false);
	};
	// const handleCloseWelcomeModal = () => {
	//   if (
	//     selectedModule.module_type === "ecommerce" ||
	//     selectedModule.module_type === "food"
	//   ) {
	//     router.push("/interest", undefined, { shallow: true });
	//   } else {
	//     router.push("/home", undefined, { shallow: true });
	//   }
	// };

	const { mutate, isLoading, error } = useSignUp();
	const formSubmitHandler = (values) => {
		const nweValues = { ...values, guest_id: guestId };
		mutate(nweValues, {
			onSuccess: async (response) => {
				setDefaultLanguage();
				if (configData?.customer_verification) {
					if (configData?.firebase_otp_verification === 1) {
						if (Number.parseInt(response?.is_phone_verified) === 1) {
							await handleTokenAfterSignUp(response);
						} else {
							//
							await sendOTP();
							setMainToken(response);
						}
					} else {
						if (Number.parseInt(response?.is_phone_verified) === 1) {
							handleTokenAfterSignUp(response);
						} else {
							setOtpData({ phone: values?.phone });
							setMainToken(response);
						}
					}
				} else {
					handleTokenAfterSignUp(response);
				}
			},
			onError: onErrorResponse,
		});
	};

	const handleClick = () => {
		window.open("/terms-and-conditions");
	};
	const { mutate: otpVerifyMutate, isLoading: isLoadingOtpVerifyApi } =
		useVerifyPhone();
	const otpFormSubmitHandler = (values) => {
		const onSuccessHandler = (res) => {
			toast.success(res?.message);
			setOpenOtpModal(false);
			handleTokenAfterSignUp(mainToken);
		};
		if (configData?.firebase_otp_verification === 1) {
			const temValue = {
				phoneNumber: values?.phone,
				sessionInfo: verificationId,
				code: values?.reset_token,
			};
			fireBaseOtpMutation(temValue, {
				onSuccess: onSuccessHandler,
				onError: onErrorResponse,
			});
		} else {
			otpVerifyMutate(values, {
				onSuccess: onSuccessHandler,
				onError: onSingleErrorResponse,
			});
		}
	};

	return (
		<>
			<CustomStackFullWidth
				justifyContent="center"
				alignItems="center"
				pb="80px"
			>
				<Box maxWidth="500px" width="100%" mt={{ xs: "0rem", md: "1rem" }}>
					<CustomPaperBigCard>
						<CustomStackFullWidth
							// justifyContent="center"
							// alignItems="center"
							spacing={2}
						>
							<AuthHeader configData={configData} title={t("Sign Up")} />
							<form noValidate onSubmit={signUpFormik.handleSubmit}>
								<CustomStackFullWidth spacing={2}>
									<SignUpForm
										configData={configData}
										handleOnChange={handleOnChange}
										passwordHandler={passwordHandler}
										fNameHandler={fNameHandler}
										lNameHandler={lNameHandler}
										emailHandler={emailHandler}
										confirmPasswordHandler={confirmPasswordHandler}
										ReferCodeHandler={ReferCodeHandler}
										signUpFormik={signUpFormik}
									/>
									<AcceptTermsAndConditions
										handleCheckbox={handleCheckbox}
										handleClick={handleClick}
										formikType={signUpFormik}
									/>
									<CustomStackFullWidth spacing={2}>
										<LoadingButton
											type="submit"
											fullWidth
											variant="contained"
											loading={isLoading}
											disabled={!signUpFormik.values.tandc}
											id="recaptcha-container"
										>
											{t("Sign Up")}
										</LoadingButton>
										<Typography
											sx={{
												a: {
													"&:hover": {
														letterSpacing: "0.03em",
													},
												},
											}}
										>
											{t("Already have an account?")}{" "}
											<Link
												href={{
													pathname: "/auth/sign-in",
													query: {
														from: "sign-up",
													},
												}}
												style={{
													color: theme.palette.primary.main,
													textDecoration: "underline",
												}}
											>
												{t("Sign In")}
											</Link>
										</Typography>
									</CustomStackFullWidth>
								</CustomStackFullWidth>
							</form>
						</CustomStackFullWidth>
					</CustomPaperBigCard>
				</Box>
				<CustomModal handleClose={handleClose} openModal={openOtpModal}>
					<OtpForm
						data={otpData}
						formSubmitHandler={otpFormSubmitHandler}
						isLoading={isLoadingOtpVerifyApi || fireIsLoading}
					/>
				</CustomModal>
			</CustomStackFullWidth>
			{openModuleSelection && (
				<ModuleSelection
					location={location}
					closeModal={handleCloseModuleModal}
					disableAutoFocus
				/>
			)}
		</>
	);
};

export default React.memo(SignUp);
