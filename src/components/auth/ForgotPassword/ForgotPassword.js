import { Box } from "@mui/material";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useFireBaseOtpVerify } from "api-manage/hooks/react-query/forgot-password/useFIreBaseOtpVerify";
import { useOtp } from "api-manage/hooks/react-query/forgot-password/useOtp";
import { auth } from "firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useState } from "react";
import {
	CustomPaper,
	FlexContainerCenter,
} from "styled-components/CustomStyles.style";
import ForgotPasswordNumberForm from "./ForgotPasswordNumberForm";
import NewPassword from "./NewPassword";
import OtpForm from "./OtpForm";

const ForgotPassword = ({ configData }) => {
	const [page, setPage] = useState(0);
	const { mutate: fireBaseOtpMutation } = useFireBaseOtpVerify();
	const [data, setData] = useState({
		phone: "",
		otp: "",
	});
	const [verificationId, setVerificationId] = useState(null);
	const goNext = () => {
		setPage((currPage) => currPage + 1);
	};
	const goBack = () => {
		setPage((currPage) => currPage - 1);
	};
	const handleFirstForm = (values) => {
		setData({
			phone: values.phone,
			reset_token: values.reset_token,
		});
	};

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

	const sendOTP = (phone) => {
		setUpRecaptcha();
		const phoneNumber = phone;
		// country code
		const appVerifier = window.recaptchaVerifier;
		signInWithPhoneNumber(auth, phoneNumber, appVerifier)
			.then((confirmationResult) => {
				setVerificationId(confirmationResult.verificationId);
				setData({ ...data, phone: phoneNumber });
				goNext();
			})
			.catch((error) => {
				console.log("Error in sending OTP", error);
			});
	};
	const pageShow = () => {
		if (page === 0) {
			return (
				<ForgotPasswordNumberForm
					goNext={goNext}
					handleFirstForm={handleFirstForm}
					data={data}
					id="recaptcha-container"
					sendOTP={sendOTP}
				/>
			);
		} else if (page === 1) {
			return (
				<OtpForm
					data={data}
					goBack={goBack}
					formSubmitHandler={formSubmitHandler}
					isLoading={isLoading}
				/>
			);
		} else page === 2;
		{
			return (
				<NewPassword
					data={data}
					handleFirstForm={handleFirstForm}
					goBack={goBack}
				/>
			);
		}
	};
	const onSuccessHandler = (res) => {
		if (res) {
			goNext();
		}
	};
	const { mutate, isLoading } = useOtp(onSuccessHandler);
	console.log(configData);
	const formSubmitHandler = (values) => {
		handleFirstForm(values);
		if (configData?.firebase_otp_verification === 1) {
			const tempValues = {
				phoneNumber: values?.phone,
				sessionInfo: verificationId,
				code: values?.reset_token,
				is_reset_token: 1,
			};
			fireBaseOtpMutation(tempValues, {
				onSuccess: onSuccessHandler,
				onError: onErrorResponse,
			});
		} else {
			mutate(values, {
				onSuccess: onSuccessHandler,
				onError: onErrorResponse,
			});
		}
	};
	return (
		<Box minHeight="50vh">
			<FlexContainerCenter sx={{ marginTop: "1rem" }}>
				<CustomPaper elevation={5}>{pageShow()}</CustomPaper>
			</FlexContainerCenter>
		</Box>
	);
};

export default ForgotPassword;
