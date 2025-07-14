import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";

import { useTheme } from "@emotion/react";
import LoadingButton from "@mui/lab/LoadingButton";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setOfflineInfoStep } from "../../../redux/slices/offlinePaymentData";
import { CustomTypography } from "../../landing-page/hero-section/HeroSection.style";

const PlaceOrder = (props) => {
	const {
		placeOrder,
		orderLoading,
		zoneData,
		isStoreOpenOrNot,
		storeData,
		isSchedules,
		page,
		storeCloseToast,
		isLoading,
	} = props;

	const [disabled, setDisabled] = useState(true);

	const { offlineInfoStep } = useSelector((state) => state.offlinePayment);
	const { t } = useTranslation();
	const theme = useTheme();
	const router = useRouter();
	const dispatch = useDispatch();
	const [checked, setChecked] = useState(false);
	const handleChange = (e) => {
		setChecked(e.target.checked);
	};
	const handleOffline = (e) => {
		if (storeData?.active) {
			//checking restaurant or shop open or not
			if (isSchedules()) {
				setChecked(e.target.checked);
				dispatch(setOfflineInfoStep(2));
				router.push(
					{
						pathname: "/checkout",
						query: { page: page, method: "offline" },
					},
					undefined,
					{ shallow: true }
				);
			} else {
				storeCloseToast();
			}
		} else {
			storeCloseToast();
		}
	};

	const primaryColor = theme.palette.primary.main;
	return (
		<CustomStackFullWidth alignItems="center" spacing={2} mt=".5rem">
			<FormGroup>
				<FormControlLabel
					control={
						<Checkbox checked={checked} onChange={handleChange} />
					}
					label={
						<CustomTypography fontSize="12px">
							{t(
								`I agree that placing the order places me under`
							)}{" "}
							<Link
								href="/terms-and-conditions"
								style={{ color: primaryColor }}
							>
								{t("Terms and Conditions")}
							</Link>{" "}
							{t("&")}
							<Link
								href="/privacy-policy"
								style={{ color: primaryColor }}
							>
								{" "}
								{t("Privacy Policy")}
							</Link>
						</CustomTypography>
					}
				/>
			</FormGroup>
			{offlineInfoStep === 0 ? (
				<LoadingButton
					type="submit"
					fullWidth
					variant="contained"
					onClick={placeOrder}
					loading={orderLoading || isLoading}
					disabled={!checked}
				>
					{t("Place Order")}
				</LoadingButton>
			) : (
				<LoadingButton
					// type="submit"
					fullWidth
					variant="contained"
					onClick={handleOffline}
					loading={orderLoading || isLoading}
					disabled={!checked}
				>
					{t("Confirm Order")}
				</LoadingButton>
			)}
		</CustomStackFullWidth>
	);
};

PlaceOrder.propTypes = {};

export default PlaceOrder;
