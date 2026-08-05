import { Radio, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { t } from "i18next";
import React from "react";

const TripOption = ({
	handleChangeTrip,
	tripValue,
	value,
	text,
	amount = "$20.5",
	unit = "hrs",
}) => {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				flex: 1,
				p: "16px",
				borderRadius: "10px",
				"&:hover": {
					boxShadow: (theme) => theme.shadows[10], // Adds a shadow effect on hover
				},
				border: (theme) => `1px solid ${theme.palette.neutral[200]}`,
			}}
		>
			<Box>
				<Typography sx={{ fontWeight: "500", fontSize: "12px" }}>
					{t(text)}
				</Typography>
				<Typography
					sx={{
						fontWeight: "700",
						fontSize: "16px",
						display: "flex",
						gap: "2px",
					}}
				>
					<Typography
						component={"span"}
						sx={{
							color: (theme) => theme.palette.neutral[400],
						}}
					>
						${" "}
					</Typography>
					{amount}{" "}
					<Typography
						component={"span"}
						sx={{
							color: (theme) => theme.palette.neutral[400],
						}}
					>
						/{unit}
					</Typography>
				</Typography>
			</Box>
			<Box>
				<Radio
					size="small"
					value={value}
					name="radio-buttons"
					inputProps={{ "aria-label": "A" }}
					checked={tripValue === value}
					onChange={(e) => handleChangeTrip(e.target.value)} // Triggering the passed handler
				/>
			</Box>
		</Box>
	);
};

export default TripOption;
