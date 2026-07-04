import { Stack, Typography, alpha, useMediaQuery, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import LoadingButton from "@mui/lab/LoadingButton";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const PlaceOrder = (props) => {
	const {
		placeOrder,
		orderLoading,
		isLoading,
		totalAmount,
		originalAmount,
	} = props;
	const { t } = useTranslation();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const showStrikethrough =
		originalAmount && Number(originalAmount) > Number(totalAmount);

	const containerSx = isMobile
		? {
				position: "fixed",
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 1100,
				px: 2,
				py: 1.5,
				backgroundColor: theme.palette.background.paper,
				borderTop: `1px solid ${theme.palette.divider}`,
				boxShadow: `0 -4px 16px ${alpha("#000", 0.08)}`,
		  }
		: {
				pt: 2,
				mt: 2,
				borderTop: `1px solid ${theme.palette.divider}`,
		  };

	return (
		<Stack
			direction="row"
			alignItems="center"
			justifyContent="space-between"
			gap={2}
			sx={containerSx}
		>
			<Stack spacing={0.25} minWidth={0}>
				<Typography
					sx={{
						fontSize: { xs: "12px", md: "13px" },
						color: theme.palette.text.secondary,
					}}
				>
					{t("Subtotal")}
				</Typography>
				<Stack direction="row" alignItems="baseline" gap={1}>
					<Typography
						sx={{
							fontWeight: 700,
							fontSize: { xs: "16px", md: "18px" },
							color: theme.palette.text.primary,
							whiteSpace: "nowrap",
						}}
					>
						{getAmountWithSign(totalAmount)}
					</Typography>
					{showStrikethrough && (
						<Typography
							sx={{
								fontSize: { xs: "12px", md: "13px" },
								color: theme.palette.text.secondary,
								textDecoration: "line-through",
								whiteSpace: "nowrap",
							}}
						>
							{getAmountWithSign(originalAmount)}
						</Typography>
					)}
				</Stack>
			</Stack>

			<LoadingButton
				onClick={placeOrder}
				loading={orderLoading}
				loadingPosition="end"
				loadingIndicator={
					<CircularProgress
						size={18}
						sx={{ color: theme.palette.whiteContainer.main }}
					/>
				}
				endIcon={<span />}
				variant="contained"
				disableElevation
				sx={{
					flexShrink: 0,
					minWidth: { xs: "140px", md: "160px" },
					px: { xs: 2.5, md: 3.5 },
					py: { xs: 1, md: 1.25 },
					borderRadius: "10px",
					textTransform: "none",
					fontWeight: 600,
					fontSize: { xs: "14px", md: "15px" },
					backgroundColor: theme.palette.primary.main,
					color: theme.palette.whiteContainer.main,
					boxShadow: "none",
					"&:hover": {
						backgroundColor: theme.palette.primary.dark,
						boxShadow: "none",
					},
					"&.MuiLoadingButton-loading": {
						backgroundColor: theme.palette.primary.main,
						opacity: 0.85,
						color: theme.palette.whiteContainer.main,
					},
					"&.MuiLoadingButton-loading .MuiButton-endIcon": {
						color: theme.palette.whiteContainer.main,
					},
					"& .MuiLoadingButton-loadingIndicatorEnd": {
						position: "relative",
						right: 0,
						ml: 1,
					},
				}}
			>
				{t("Confirm Order")}
			</LoadingButton>
		</Stack>
	);
};

PlaceOrder.propTypes = {};

export default PlaceOrder;
