import LoadingButton from "@mui/lab/LoadingButton";
import { Paper } from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { onErrorResponse } from "../../../../api-manage/api-error-response/ErrorResponses";
import { usePostRegisterInfo } from "../../../../api-manage/hooks/react-query/auth/usePostRegisterInfo";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import CustomAlert from "../../../alert/CustomAlert";
import CustomPhoneInput from "../../../custom-component/CustomPhoneInput";

const PhoneInputForm = (props) => {
	const {
		userInfo,
		jwtToken,
		medium,
		handleRegistrationOnSuccess,
		configData,
		lanDirection,
	} = props;
	const { t } = useTranslation();
	const { mutate, isLoading } = usePostRegisterInfo();
	const formik = useFormik({
		initialValues: {
			phone: "",
		},
		validationSchema: Yup.object({
			phone: Yup.string()
				.required(t("Please give a phone number"))
				.min(10, "number must be 10 digits"),
		}),
		onSubmit: async (values, helpers) => {
			try {
				handleOnSubmitFormik(values);
			} catch (err) {}
		},
	});
	const handleOnSubmitFormik = (values) => {
		const info = {
			email: userInfo?.email,
			token: jwtToken?.credential,
			unique_id: jwtToken?.clientId,
			medium: medium,
			phone: values.phone,
			id_token: true,
		};
		mutate(info, {
			onSuccess: (response) => {
				handleRegistrationOnSuccess(
					response?.token,
					response?.is_phone_verified,
					values.phone
				);
			},
			onError: onErrorResponse,
		});
	};
	const handleOnChange = (value) => {
		formik.setFieldValue("phone", `+${value}`);
	};
	return (
		<Paper sx={{ padding: "1rem", position: "relative" }}>
			<form onSubmit={formik.handleSubmit} noValidate>
				<CustomStackFullWidth spacing={2} sx={{ position: "relative" }}>
					<CustomAlert
						type="info"
						text={t("Give a valid phone number to continue sign-in")}
					/>
					<CustomPhoneInput
						value={formik.values.phone}
						onHandleChange={handleOnChange}
						initCountry={configData?.country}
						touched={formik.touched.phone}
						errors={formik.errors.phone}
						lanDirection={lanDirection}
					/>
					<LoadingButton
						type="submit"
						fullWidth
						variant="contained"
						loading={isLoading}
					>
						{t("Continue")}
					</LoadingButton>
				</CustomStackFullWidth>
			</form>
		</Paper>
	);
};

PhoneInputForm.propTypes = {};

export default PhoneInputForm;
