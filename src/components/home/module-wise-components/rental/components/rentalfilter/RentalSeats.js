import { Box } from "@mui/material";
import CustomCheckbox from "components/CustomCheckbox";
import { Scrollbar } from "components/srollbar";

const seats = [
	{ name: "1-4", value: "1-4", id: 1 },
	{ name: "5-8", value: "5-8", id: 2 },
	{ name: "9-13", value: "9-13", id: 3 },
	{ name: "14+", value: "14-1000", id: 4 },
];

const RentalSeats = ({ setSelectedSeats }) => {
	const handleCheckChange = ({ checked, id, value }) => {
		setSelectedSeats((prev) =>
			checked
				? [...prev, value]
				: prev.filter((selectedName) => selectedName !== value)
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
					{seats.map((item, index) => (
						<CustomCheckbox
							key={item?.id}
							item={item}
							seats={true}
							checkHandler={handleCheckChange}
						/>
					))}
				</Box>
			</Scrollbar>
		</>
	);
};

export default RentalSeats;
