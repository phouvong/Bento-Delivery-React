import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useFireBaseOtpVerify } from "api-manage/hooks/react-query/forgot-password/useFIreBaseOtpVerify";
import { useVerifyPhone } from "api-manage/hooks/react-query/forgot-password/useVerifyPhone";
import { usePostEmail } from "api-manage/hooks/react-query/social-login/useEmailPost";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getLanguage } from "helper-functions/getLanguage";
import { toast } from "react-hot-toast";
import { google_client_id } from "utils/staticCredential";
import { auth } from "../../../../firebase";
import CustomModal from "../../../modal";
import OtpForm from "../../sign-up/OtpForm";
import ModalCustom from "./ModalCustom";
import PhoneInputForm from "./PhoneInputForm";

const GoogleLoginComp = (props) => {
	const { handleSuccess, configData } = props;
	const [userInfo, setUserInfo] = useState(null);
	const [jwtToken, setJwtToken] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [openOtpModal, setOpenOtpModal] = useState(false);
	const [otpData, setOtpData] = useState({ phone: "" });
	const [mainToken, setMainToken] = useState(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [verificationId, setVerificationId] = useState(null);
	const [phone, setPhone] = useState("");
	const buttonDiv = useRef(null);
	const router = useRouter();

	const { mutate } = usePostEmail();
	const clientId = google_client_id;
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
					setOtpData({ phone: phone });
					setMainToken(response?.token);
					setOpenModal(true);
				}
			}
		} else {
			handleToken(response?.token);
		}
	};
	const handleCallBackResponse = (res) => {
		const userObj = jwt_decode(res.credential);
		setJwtToken(res);
		setUserInfo(userObj);
		mutate(
			{
				email: userObj.email,
				token: res.credential,
				unique_id: res?.clientId,
				medium: "google",
				id_token: true,
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
	};

	useEffect(() => {
		const initializeGoogleSignIn = () => {
			window?.google?.accounts?.id?.initialize({
				client_id: clientId,
				callback: handleCallBackResponse,
			});
			setIsInitialized(true);
		};
		if (!isInitialized) {
			initializeGoogleSignIn();
		}
	}, [clientId, isInitialized]);
	useEffect(() => {
		if (isInitialized && buttonDiv.current) {
			window?.google?.accounts?.id?.renderButton(buttonDiv.current, {
				theme: "outline",
				size: "large",
				width: "215px",
			});
		}
	}, [isInitialized]);
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
	const lanDirection = getLanguage() ? getLanguage() : "ltr";
	return (
		<>
			<div
				ref={buttonDiv}
				style={{
					display: "flex",
					justifyContent: "center",
					width: "100%",
					margin: "auto",
				}}
			></div>
			<ModalCustom
				openModal={openModal}
				setModalOpen={setOpenModal}
				handleClose={() => setOpenModal(false)}
			>
				{userInfo && jwtToken && (
					<PhoneInputForm
						userInfo={userInfo}
						jwtToken={jwtToken}
						medium="google"
						handleRegistrationOnSuccess={handleRegistrationOnSuccess}
						configData={configData}
						lanDirection={lanDirection}
					/>
				)}
			</ModalCustom>
			<CustomModal
				openModal={openOtpModal}
				handleClose={() => setOpenOtpModal(false)}
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

GoogleLoginComp.propTypes = {};

export default GoogleLoginComp;
