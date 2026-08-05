import { Box } from "@mui/material";
import CustomCheckbox from "components/CustomCheckbox";
import { Scrollbar } from "components/srollbar";
import { t } from "i18next";
import React from "react";

const RentalCooling = ({ setAirCondition, setNoAirCondition }) => {
	const handleCheckChange = ({ checked, id, name }) => {
		if (id == 1) {
			setAirCondition(checked);
		} else if (id == 2) {
			setNoAirCondition(checked);
		}
	};

	return (
		<Scrollbar style={{ maxHeight: "330px" }} scrollbarMinSize={1}>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					mx: 1,
				}}
			>
				<CustomCheckbox
					item={{ name: t("Air Conditioned"), id: "1" }}
					checkHandler={handleCheckChange}
				/>
				<CustomCheckbox
					item={{ name: t("Non Air Conditioned"), id: "2" }}
					checkHandler={handleCheckChange}
				/>
			</Box>
		</Scrollbar>
	);
};

export default RentalCooling;
