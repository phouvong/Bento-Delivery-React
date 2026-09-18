import { CouponsCard } from "components/home/module-wise-components/rental/components/Rental.style";
import { Box, Stack } from "@mui/system";
import { Button, Typography, useTheme } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import toast from "react-hot-toast";
import React from "react";
import { t } from "i18next";
import CouponIcon from "./icon/CouponIcon";

export const CouponShape = (props) => {
	const theme = useTheme();

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="335"
			height="101"
			fill="none"
			viewBox="0 0 335 101"
			preserveAspectRatio="none"
		>
			<path
				fill={theme.palette.background.paper}
				fillRule="evenodd"
				d="M10 .464h211.593a12.5 12.5 0 0 0 9.802 8.517v2.9a1.605 1.605 0 1 0 3.21 0v-2.77A12.5 12.5 0 0 0 245.407.464H325c5.523 0 10 4.478 10 10v80c0 5.523-4.477 10-10 10h-79.594a12.5 12.5 0 0 0-10.801-8.642v-2.779a1.605 1.605 0 1 0-3.21 0v2.908a12.5 12.5 0 0 0-9.801 8.513H10c-5.523 0-10-4.477-10-10v-80c0-5.522 4.477-10 10-10m224.605 21.482a1.605 1.605 0 1 0-3.21 0v6.71a1.605 1.605 0 1 0 3.21 0zm0 16.774a1.605 1.605 0 1 0-3.21 0v6.71a1.605 1.605 0 1 0 3.21 0zm0 16.775a1.605 1.605 0 1 0-3.21 0v6.71a1.605 1.605 0 1 0 3.21 0zm0 16.774a1.605 1.605 0 1 0-3.21 0v6.71a1.605 1.605 0 1 0 3.21 0z"
				clipRule="evenodd"
			></path>
		</svg>
	);
};

const CouponItems = ({ data }) => {
	const theme = useTheme();

	const handleCopy = (coupon_code) => {
		navigator.clipboard
			.writeText(coupon_code)
			.then(() => {
				toast(() => (
					<span>
						{t("Code")}
						<b style={{ marginLeft: "4px", marginRight: "4px" }}>
							{coupon_code}
						</b>
						{t("has been copied")}
					</span>
				));
			})
			.catch((error) => {
				console.error("Failed to copy code:", error);
			});
	};

	return (
		<CouponsCard>
			<CouponShape />
			<Box sx={{ display: "flex", justifyContent: "space-between" }}>
				<Stack alignItems="flex-start" gap={1}>
					<Stack direction="row" alignItems="center" gap={1}>
						<Typography
							variant="body1"
							fontSize={18}
							color={theme.palette.neutral[500]}
						>
							{t("Code")}:
						</Typography>
						<Typography
							variant="body2"
							component="div"
							fontSize={{ xs: 13, sm: 18 }}
							fontWeight={600}
							lineHeight={1}
							sx={{ whiteSpace: "wrap" }}
						>
							{data?.code.length > 14
								? data?.code.slice(0, 14) + "..."
								: data?.code}
						</Typography>
					</Stack>
					<Typography variant="body2" component="div">
						{data?.discount} % discount
					</Typography>
				</Stack>
				<Button
					sx={{ ml: { xs: -2, sm: 0 } }}
					variant="text"
					onClick={() => handleCopy(data?.code)}
				>
					<CouponIcon />
				</Button>
			</Box>
		</CouponsCard>
	);
};

export default CouponItems;
