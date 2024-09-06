import { useEffect, useState } from "react";

import { Stack, Typography } from "@mui/material";
import { useFireBaseOtpVerify } from "api-manage/hooks/react-query/forgot-password/useFIreBaseOtpVerify";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { onErrorResponse } from "../../../../api-manage/api-error-response/ErrorResponses";
import { useVerifyPhone } from "../../../../api-manage/hooks/react-query/forgot-password/useVerifyPhone";
import { usePostEmail } from "../../../../api-manage/hooks/react-query/social-login/useEmailPost";
import { getLanguage } from "../../../../helper-functions/getLanguage";
import {
	setJwtTokenByDispatch,
	setUserInfoByDispatch,
} from "../../../../redux/slices/fbCredentials";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import { fb_app_id } from "../../../../utils/staticCredential";
import CustomImageContainer from "../../../CustomImageContainer";
import CustomModal from "../../../modal";
import OtpForm from "../../sign-up/OtpForm";
import facebookLatest from ".././../../../../public/static/facebookLatest.png";
import ModalCustom from "./ModalCustom";
import PhoneInputForm from "./PhoneInputForm";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../../firebase";

const FbLoginComp = (props) => {
	const { handleSuccess, configData } = props;
	const { userInfo, jwtToken } = useSelector(
		(state) => state.fbCredentialsStore
	);
	const [openModal, setOpenModal] = useState(false);
	const [openOtpModal, setOpenOtpModal] = useState(false);
	const [otpData, setOtpData] = useState({ phone: "" });
	const [mainToken, setMainToken] = useState(null);
	const [verificationId, setVerificationId] = useState(null);
	const [phone, setPhone] = useState("");
	const dispatch = useDispatch();
	const appId = fb_app_id;
	const { mutate } = usePostEmail();
	const handleToken = (token) => {
		if (token) {
			handleSuccess(token);
		} else {
			setOpenModal(true);
		}
	};
	useEffect(() => {
		if (otpData?.phone !== "") {
			setOpenOtpModal(true);
		}
	}, [otpData]);

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
			if (window.recaptchaVerifier) {
				window.recaptchaVerifier?.reset?.();
			}
		}
	};

	const sendOTP = (token, phone) => {
		setUpRecaptcha();
		const appVerifier = window.recaptchaVerifier;
		signInWithPhoneNumber(auth, phone, appVerifier)
			.then((confirmationResult) => {
				console.log({ confirmationResult });
				setVerificationId(confirmationResult.verificationId);
				setOtpData({ phone: phone });
				setMainToken(token);
			})
			.catch((error) => {
				console.log("Error in sending OTP", error);
			});
	};

	const handlePostRequestOnSuccess = async (response) => {
		if (configData?.customer_verification) {
			if (configData?.firebase_otp_verification === 1) {
				if (Number.parseInt(response?.is_phone_verified) === 1) {
					await handleToken(response?.token);
				} else {
					setOpenModal(true);
				}
			} else {
				if (Number.parseInt(response?.is_phone_verified) === 1) {
					await handleToken(response?.token);
				} else {
					setOtpData({ phone: response?.phone });
					setMainToken(response?.token);
					setOpenModal(true);
				}
			}
		} else {
			handleToken(response?.token);
		}
	};
	const responseFacebook = async (res) => {
		dispatch(setUserInfoByDispatch(res));
		dispatch(setJwtTokenByDispatch(res));
		if (res?.status !== "unknown") {
			await mutate(
				{
					email: res?.email,
					token: res?.accessToken,
					unique_id: res?.id,
					medium: "facebook",
					phone: res?.phone,
				},
				{
					onSuccess: handlePostRequestOnSuccess,
					onError: (error) => {
						error?.response?.data?.errors?.forEach((item) =>
							item.code === "email"
								? handleToken()
								: toast.error(item.message)
						);
					},
				}
			);
		}
	};

	const handleRegistrationOnSuccess = async (
		token,
		is_phone_verified,
		phone
	) => {
		setPhone(phone);
		setOpenModal(false);
		setMainToken(token);

		if (configData?.customer_verification) {
			if (configData?.firebase_otp_verification === 1) {
				if (Number.parseInt(is_phone_verified) === 1) {
					handleSuccess(token);
				} else {
					await sendOTP(token, phone);
				}
			} else {
				if (Number.parseInt(is_phone_verified) === 1) {
					handleSuccess(token);
				} else {
					setOtpData({ phone: phone });
				}
			}
		} else {
			handleSuccess(token);
		}
	};
	const { mutate: signInMutate, isLoading } = useVerifyPhone();
	const { mutate: fireBaseOtpMutation, isLoading: fireIsLoading } =
		useFireBaseOtpVerify();

	const onSuccessHandlerOtp = async (res) => {
		toast.success(res?.message);
		setOpenOtpModal(false);
		setOpenModal(false);
		await handleSuccess(mainToken);
	};

	const formSubmitHandler = (values) => {
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
			signInMutate(values, {
				onSuccess: onSuccessHandlerOtp,
				onError: onErrorResponse,
			});
		}
	};
	const { t } = useTranslation();
	const lanDirection = getLanguage() ? getLanguage() : "ltr";
	return (
		<>
			<FacebookLogin
				appId={appId}
				autoLoad={false}
				fields="name,email,picture"
				callback={responseFacebook}
				render={(renderProps) => (
					<div
						style={{ cursor: "pointer", width: "100%" }}
						onClick={renderProps.onClick}
					>
						<Stack
							alignItems="center"
							sx={{
								backgroundColor: (theme) => theme.palette.info.dark,
								height: "45px",
								width: "100%",
								borderRadius: "4px",
								padding: "10px",
								textAlign: "center",
							}}
						>
							<CustomStackFullWidth
								direction="row"
								alignItems="center"
								spacing={1}
							>
								<CustomImageContainer
									src={facebookLatest.src}
									alt="facebook"
									height="25px"
									width="25px"
									objectFit="cover"
								/>
								<Typography
									fontSize="14px"
									fontWeight="600"
									sx={{
										color: (theme) =>
											theme.palette.whiteContainer.main,
									}}
								>
									{t("Continue with facebook")}
								</Typography>
							</CustomStackFullWidth>
						</Stack>
					</div>
				)}
			/>
			<ModalCustom
				openModal={openModal}
				setModalOpen={setOpenModal}
				handleClose={() => setOpenModal(false)}
			>
				{userInfo && jwtToken && (
					<PhoneInputForm
						configData={configData}
						userInfo={userInfo}
						jwtToken={jwtToken}
						medium="facebook"
						handleRegistrationOnSuccess={handleRegistrationOnSuccess}
						lanDirection={lanDirection}
					/>
				)}
			</ModalCustom>
			<CustomModal
				openModal={openOtpModal}
				setModalOpen={setOpenOtpModal}
				handleClose={() => setOpenModal(false)}
			>
				<OtpForm
					data={otpData}
					formSubmitHandler={formSubmitHandler}
					isLoading={isLoading}
				/>
			</CustomModal>
		</>
	);
};

FbLoginComp.propTypes = {};

export default FbLoginComp;
