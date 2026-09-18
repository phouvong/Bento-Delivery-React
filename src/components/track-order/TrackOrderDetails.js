import { useTheme } from "@emotion/react";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import PlaceIcon from "@mui/icons-material/Place";
import { alpha, Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { t } from "i18next";
import { useRouter } from "next/router";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import { getToken } from "../../helper-functions/getToken";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CustomDivider from "../CustomDivider";
import TrackOrder from "./index";
import { useDispatch, useSelector } from "react-redux";
import { setOrderDetailsModal } from "redux/slices/offlinePaymentData";
import useGetServiceBookingLog from "../home/module-wise-components/service/service-api-manage/hooks/react-query/booking/useGetServiceBookingLog";
import useServiceBusinessConfig from "../home/module-wise-components/service/service-api-manage/hooks/custom-hooks/useServiceBusinessConfig";
import { ORDER_TAB_MODULE_KEY } from "../user-information/ProfileOrdersPage";

const BOOKING_OTP_ELIGIBLE_STATUSES = ["confirmed", "ongoing"];

const TrackOrderDetails = ({
	showOrderDetails,
	trackOrderFormik,
	trackOrderData,
	configData,
}) => {
	const dispatch = useDispatch();
	const theme = useTheme();
	const router = useRouter();
	const { modules } = useSelector((state) => state.configData);
	const isBooking = trackOrderData?.module_type === "service";
	const orderModule = modules?.find(
		(m) => m.module_type === trackOrderData?.module_type
	);
	const { data: serviceBookingLog } = useGetServiceBookingLog(
		{ id: trackOrderData?.id },
		isBooking
	);
	const { otpForCompleteServiceEnabled } = useServiceBusinessConfig(
		configData,
		null
	);
	const showBookingOtp =
		isBooking &&
		otpForCompleteServiceEnabled &&
		Boolean(trackOrderData?.otp) &&
		BOOKING_OTP_ELIGIBLE_STATUSES.includes(trackOrderData?.booking_status);
	const handleClick = () => {
		dispatch(setOrderDetailsModal(false));
		router.push(
			{
				pathname: "/profile",
				query: {
					orderId: trackOrderData?.id,
					page: "my-orders",
					...(isBooking && { [ORDER_TAB_MODULE_KEY]: orderModule?.id }),
				},
			},
			undefined,
			{ shallow: true }
		);
	};
	return (
		<CustomStackFullWidth paddingTop="30px" spacing={2}>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				flexWrap="wrap"
				rowGap={1}
				px="1rem"
			>
				<Stack direction="row" alignItems="center" flexWrap="wrap" rowGap={1}>
					<Typography fontSize="18px" fontWeight="600">
						{t(isBooking ? "Booking" : "order")}{" "}
						<Typography
							component="span"
							fontSize="18px"
							fontWeight="600"
							marginInlineStart="3px"
						>
							#{trackOrderData?.id}
						</Typography>
					</Typography>
					{showBookingOtp && (
						<Stack
							direction="row"
							alignItems="center"
							spacing={0.75}
							marginInlineStart="8px"
							sx={{
								paddingInline: "12px",
								paddingBlock: "4px",
								borderRadius: "8px",
								backgroundColor: alpha(theme.palette.primary.main, 0.1),
							}}
						>
							<Typography
								fontSize={{xs: "14px", md: "16px"}}
								fontWeight="700"
								color="text.primary"
								letterSpacing="0.5px"
							>
								{t("OTP")}
							</Typography>
							<Typography
								fontSize={{xs: "14px", md: "16px"}}
								fontWeight="700"
								color="primary.main"
								letterSpacing="3px"
							>
								{trackOrderData?.otp}
							</Typography>
						</Stack>
					)}
				</Stack>
				<Typography fontSize="18px" fontWeight="600">
					{getAmountWithSign(trackOrderData?.order_amount)}
				</Typography>
			</Stack>
			<CustomDivider border="2px" width="100%" />
			<CustomStackFullWidth
				direction={{ xs: "column", lg: "row" }}
				gap={{ xs: "10px", md: "24px" }}
				//paddingX={{ xs: "10px", md: "90px" }}
				paddingTop="20px"
				justifyContent="space-between"
				paddingX="20px"
			>
				<Stack
					direction="row"
					spacing={1}
					alignItems="center"
					padding="1rem"
					minWidth={{ xs: "200px", lg: "320px" }}
					backgroundColor={alpha(theme.palette.primary.main, 0.1)}
					borderRadius="8px"
				>
					<AddBusinessIcon color="primary" />
					<Typography fontSize="12px">
						{trackOrderData?.module_type !== "parcel"
							? trackOrderData?.store?.name
							: trackOrderData?.receiver_details?.address}
					</Typography>
				</Stack>
				<Stack
					direction="row"
					spacing={1}
					alignItems="center"
					padding="1rem"
					backgroundColor={alpha(theme.palette.primary.main, 0.1)}
					minWidth={{ xs: "200px", lg: "320px" }}
					borderRadius="8px"
				>
					<PlaceIcon color="primary" />
					<Typography fontSize="12px">
						{trackOrderData?.delivery_address?.address}
					</Typography>
				</Stack>
				{getToken() && (
					<Button
						onClick={handleClick}
						variant="outlined"
						sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
					>
						{t(isBooking ? "View Booking Details" : "View Order Details")}
					</Button>
				)}
			</CustomStackFullWidth>
			<CustomStackFullWidth sx={{ paddingTop: { xs: "10px", md: "40px" } }}>
				<TrackOrder
					trackOrderData={trackOrderData}
					isBooking={isBooking}
					serviceBookingLog={serviceBookingLog}
				/>
			</CustomStackFullWidth>
		</CustomStackFullWidth>
	);
};

export default TrackOrderDetails;
