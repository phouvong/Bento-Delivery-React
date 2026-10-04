import { Rating, Stack } from "@mui/material";
import { useEffect, useState } from "react";

const CustomRatings = ({
	handleChangeRatings,
	ratingValue,
	readOnly,
	fontSize,
	color,
}) => {
	const [value, setValue] = useState(0);
	const handleChange = (event, newValue) => {
		if (!readOnly) {
			setValue(newValue);
			handleChangeRatings?.(newValue);
		}
	};
	useEffect(() => {
		setValue(ratingValue);
	}, [ratingValue]);

	return (
		<Stack direction="row" alignItems="center" justifyContent="flex-start">
			<Rating
				precision={0.5}
				readOnly={readOnly}
				value={value}
				onChange={(event, newValue) => handleChange(event, newValue)}
				sx={{
					fontSize: fontSize ? fontSize : "inherit",
					color: color ? color : (theme) => theme.palette.primary.main,
					borderColor: color
						? color
						: (theme) => theme.palette.primary.main,
					"& .MuiSvgIcon-root": {
						fill: color ? color : (theme) => theme.palette.primary.main,
					},
				}}
			/>
			{/*{readOnly && (*/}
			{/*  <CustomColouredTypography>({ratingValue})</CustomColouredTypography>*/}
			{/*)}*/}
		</Stack>
	);
};

CustomRatings.propTypes = {};

export default CustomRatings;
