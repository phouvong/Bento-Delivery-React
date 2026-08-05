import { Box } from "@mui/material";
import CustomCheckbox from "components/CustomCheckbox";
import { Scrollbar } from "components/srollbar";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";

const RentalCategories = ({ setSelectedCategoryIds }) => {
	const router = useRouter();
	const categoryId = router?.query?.categoryId;
	const allCategory = router?.query?.all_category;
	const { rentalCategories } = useSelector(
		(state) => state?.rentalCategoriesLists
	);

	const handleCheckChange = ({ checked, id }) => {
		setSelectedCategoryIds((prev) =>
			checked
				? prev.includes(id)
					? prev
					: [...prev, id]
				: prev.filter((selectedId) => selectedId !== id)
		);
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
				{rentalCategories.map((item) => (
					<CustomCheckbox
						key={item?.id}
						item={item}
						checkHandler={handleCheckChange}
						isChecked={allCategory ? true : item?.id == categoryId}
					/>
				))}
			</Box>
		</Scrollbar>
	);
};

export default RentalCategories;
