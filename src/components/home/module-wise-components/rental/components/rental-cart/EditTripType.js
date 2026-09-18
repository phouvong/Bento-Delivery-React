import {
	alpha,
	Box,
	Button,
	Grid,
	Radio,
	Stack,
	Typography,
} from "@mui/material";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import { t } from "i18next";
import React, { useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import TripOption from "./TripOption";

const tripOptions = [
	{
		text: "Hourly Trip",
		amount: "345.00 ",
		unit: "hr",
		value: "hourly",
	},

	{
		text: "Distance wise",
		amount: "345.00 ",
		unit: "Km",
		value: "distance",
	},
];
const EditTripType = ({ setOpenModal }) => {
	const [tripValue, setTripValue] = useState("");
	const [duration, setDuration] = useState(0);
	const handleChangeTrip = (value) => {
		setTripValue(value);
	};
	return (
		<>
			<CustomStackFullWidth
				sx={{
					width: { xs: "auto", md: "462px" }, // Make the width responsive for different devices
					mx: "auto", // Center horizontally
					// Add padding for spacing
				}}
			>
				<Box sx={{ mb: "30px" }}>
					<Grid container spacing={2}>
						{tripOptions.map((item, index) => (
							<Grid item xs={12} sm={6} key={index}>
								<TripOption
									handleChangeTrip={handleChangeTrip}
									tripValue={tripValue}
									{...item}
								/>
							</Grid>
						))}
					</Grid>
				</Box>
				<CustomTextFieldWithFormik
					label={t("Trip Duration (hrs)")}
					type="number"
					value={duration}
					inputProps={{ min: 0 }}
					onChangeHandler={(value) => {
						// Ensure only positive or zero values are set
						const parsedValue = parseFloat(value);

						if (!isNaN(parsedValue) && parsedValue >= 0) {
							setDuration(parsedValue);
						} else if (value === "") {
							// Allow clearing the input
							setDuration("");
						}
					}}
					fullWidth // Ensure the input takes full width on smaller devices
				/>
				<Stack
					direction={{ xs: "column", md: "row" }}
					spacing={2}
					justifyContent="center"
					sx={{ mt: "40px" }}
				>
					<Button
						onClick={() => {
							setOpenModal(false);
						}}
						variant="contained"
						sx={{
							borderRadius: "10px",
							fontSize: "16px",
							py: "16px",
							width: { xs: "100%", md: "calc(50% - 8px)" }, // Adjust width for responsive button layout
							"&:hover": {
								background: (theme) =>
									alpha(theme.palette.neutral[400], 0.5),
							},
							color: "red",
							background: (theme) =>
								alpha(theme.palette.neutral[200], 0.5),
						}}
					>
						{t("Cancel")}
					</Button>
					<Button
						variant="contained"
						sx={{
							borderRadius: "10px",
							width: { xs: "100%", md: "calc(50% - 8px)" }, // Adjust width for responsive button layout
							py: "16px",
							fontSize: "16px",
						}}
					>
						{t("Update")}
					</Button>
				</Stack>
			</CustomStackFullWidth>
		</>
	);
};

export default EditTripType;
