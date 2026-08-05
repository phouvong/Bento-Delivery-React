import { Box } from "@mui/material";
import CustomCheckbox from "components/CustomCheckbox";
import { Scrollbar } from "components/srollbar";
import React from "react";
import { useGetBrandLists } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/brands/useGetBrandLists";

const RentalBrands = ({ brands, setSelectedBrandIds }) => {
	const handleCheckChange = ({ checked, id }) => {
		setSelectedBrandIds((prev) =>
			checked
				? [...prev, id]
				: prev.filter((selectedId) => selectedId !== id)
		);
	};

	return (
		<>
			<Scrollbar style={{ maxHeight: "330px" }} scrollbarMinSize={1}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						mx: 1,
					}}
				>
					{brands?.brands?.map((item, index) => (
						<CustomCheckbox
							key={index}
							item={item}
							checkHandler={handleCheckChange}
						/>
					))}
				</Box>
			</Scrollbar>
		</>
	);
};

export default RentalBrands;
