import { alpha, Box, Typography } from "@mui/material";
import CustomSlider from "components/search/CustomSlider";
import React from "react";
import { CustomTextField } from "styled-components/CustomStyles.style";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const RentalPriceRange = ({ minMax, setMinMax, rentalPriceFilterRange }) => {
	const handleMinMax = (value) => {
		setMinMax(value);
	};
	console.log({rentalPriceFilterRange,minMax});
	

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					mb: "7px",
				}}
			>
				<Typography
					sx={{
						fontSize: "12px",
						color: (theme) => theme.palette.neutral[400],
					}}
				>
					{getAmountWithSign(minMax[0]||rentalPriceFilterRange?.[0])}
				</Typography>
				<Typography
					sx={{
						fontSize: "12px",
						color: (theme) => theme.palette.neutral[400],
					}}
				>
					{getAmountWithSign(minMax[1]||rentalPriceFilterRange?.[1])}
				</Typography>
			</Box>
			<CustomSlider
				handleChangePrice={handleMinMax}
				minMax={minMax}
				//priceFilterRange={priceFilterRange}	
				rentalPriceFilterRange={rentalPriceFilterRange}
			/>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "9px",
				}}
			>
				<CustomTextField
					type="number"
					disabled={true}
					value={minMax[0]||rentalPriceFilterRange[0]}
					sx={{
						textAlign: "center",
						"& .MuiOutlinedInput-notchedOutline": {
							border: "none !important",
						},
						"& .MuiInputBase-input": {
							padding: "10px 10px",
							borderRadius: "5px",
							textAlign: "center",
							background: (theme) =>
								alpha(theme.palette.neutral[200], 0.3),

							"& .MuiOutlinedInput-input": {
								padding: "4px 10px",
							},
						},
					}}
				/>
				<Typography>-</Typography>
				<CustomTextField
					type="number"
					disabled={true}
					value={minMax[1]||rentalPriceFilterRange[1]}
					sx={{
						textAlign: "center",
						"& .MuiOutlinedInput-notchedOutline": {
							border: "none !important",
						},
						"& .MuiInputBase-input": {
							padding: "10px 10px",
							borderRadius: "5px",
							textAlign: "center",
							background: (theme) =>
								alpha(theme.palette.neutral[200], 0.3),

							"& .MuiOutlinedInput-input": {
								padding: "4px 10px",
								color: `#000 !important`,
							},
						},
					}}
				/>
			</Box>
		</>
	);
};

export default RentalPriceRange;
