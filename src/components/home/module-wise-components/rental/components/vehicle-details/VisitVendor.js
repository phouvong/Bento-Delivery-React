import React, { useEffect, useState } from "react";
import RentalCardWrapper from "../global/RentalCardWrapper";
import { alpha, Button, Typography } from "@mui/material";
import { t } from "i18next";
import VendorProfile from "../global/VendorProfile";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StarIcon from "@mui/icons-material/Star";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { Box } from "@mui/system";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import { useRouter } from "next/router";

const VisitVendor = ({ vehicleDetails }) => {
	const router = useRouter();

	const handleVisitVendorClick = () => {
		const moduleId = router?.query?.module || router?.query?.module_id;
		router.push({
			pathname: `/rental/provider/${vehicleDetails?.provider?.slug || vehicleDetails?.provider?.id}`,
			query: moduleId ? { module: moduleId } : {},
		});
	};

	return (
		<>
			<RentalCardWrapper borderRadius="10px" padding="16px">
				<VendorProfile vehicleDetails={vehicleDetails} />
				<RentalCardWrapper
					borderRadius="5px"
					padding="12px"
					sx={{
						boxShadow: "none",
						my: "16px",
						background: (theme) =>
							alpha(theme.palette.neutral[200], 0.2),
					}}
				>
					<CustomBoxFullWidth
						sx={{
							display: "flex",
							justifyContent: "center",
							gap: "30px",
							flexWrap: { xs: "wrap", md: "nowrap" },
						}}
					>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<DirectionsCarIcon
								sx={{
									color: (theme) =>
										theme.palette.primary.main,
								}}
							/>

							<Typography
								sx={{
									fontSize: "12px",
									fontWeight: "400",
									textAlign: "center",
									mt: "15px",
								}}
							>
								{t("Vehicle")}{" "}
								<b>{vehicleDetails?.provider?.provider_total_vehicle_count}</b>
							</Typography>
						</Box>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								borderLeft: (theme) =>
									`1px solid ${alpha(
										theme.palette.neutral[100],
										0.4
									)}`,
							}}
						>
							<StarIcon
								sx={{
									color: (theme) =>
										theme.palette.primary.main,
								}}
							/>

							<Typography
								sx={{
									fontSize: "12px",
									fontWeight: "400",
									textAlign: "center",
									mt: "12px",
								}}
							>
								<b>{vehicleDetails?.provider?.avg_rating?.toFixed(1)}</b>
								<Typography
									component={"span"}
									fontSize="11px"
									sx={{
										color: (theme) =>
											theme.palette.neutral[500],
									}}
								>
									{" "}
									(
									{Number(vehicleDetails?.provider?.rating_count).toFixed(1
									)}
									)
								</Typography>
							</Typography>
						</Box>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<DepartureBoardIcon
								sx={{
									color: (theme) =>
										theme.palette.primary.main,
								}}
							/>

							<Typography
								sx={{
									fontSize: "12px",
									fontWeight: "400",
									textAlign: "center",
									mt: "15px",
								}}
							>
								<b>{vehicleDetails?.provider?.delivery_time}</b>{" "}
							
							</Typography>
						</Box>
					</CustomBoxFullWidth>
				</RentalCardWrapper>
				<Button
					onClick={handleVisitVendorClick}
					variant="outline"
					sx={{
						color: (theme) => theme.palette.primary.main,
						fontSize: "14px",
						fontWeight: "700",
						background: (theme) =>
							alpha(theme.palette.neutral[200], 0.2),
						border: (theme) =>
							`1px solid ${alpha(
								theme.palette.primary.main,
								0.5
							)}`,
					}}
				>
					{t("Visit Vendor")}
				</Button>
			</RentalCardWrapper>
		</>
	);
};

export default VisitVendor;
