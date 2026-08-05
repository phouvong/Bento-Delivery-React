import React from "react";
import RentalCardWrapper from "./RentalCardWrapper";
import H3 from "components/typographies/H3";
import { CustomTextArea } from "styled-components/CustomStyles.style";
import { Typography } from "@mui/material";
import { t } from "i18next";

const RentalAdditionalNote = ({
	handleAdditionalNotes,
	text = "Please provide good conditioned vehicle",
	isShowTextArea = true,
	value,
}) => {
	return (
		<RentalCardWrapper sx={{ mt: "20px" }}>
			<H3 text="Additional Notes" />
			{isShowTextArea ? (
				<CustomTextArea
					value={value}
					aria-label="empty textarea"
					placeholder={t(
						"Ex: Please provide good conditioned vehicle"
					)}
					sx={{
						width: "100%",
						minHeight: "90px",
						marginTop: "20px",
						"&:focus": {
							borderColor: (theme) => theme.palette.primary.main, // Change focus border color to white
							outline: "none", // Remove default focus outline
						},
						resize: "none", // Prevent resizing by the user
					}}
					onChange={(e) => handleAdditionalNotes(e.target.value)}
				/>
			) : (
				<>
					<Typography
						sx={{ fontSize: "14px", fontWeight: "400", mt: "10px" }}
					>
						{t(text)}
					</Typography>
				</>
			)}
		</RentalCardWrapper>
	);
};

export default RentalAdditionalNote;
