import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const Body2 = (props) => {
	const { text, fontWeight, ...rest } = props;
	const { t } = useTranslation();
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			fontWeight={fontWeight}
			{...rest}
			sx={{
				display: "-webkit-box",
				WebkitLineClamp: 2, // Limits to 2 lines
				WebkitBoxOrient: "vertical",
				overflow: "hidden",
				textOverflow: "ellipsis",
			}}
		>
			{t(text)}
		</Typography>
	);
};

Body2.propTypes = {};

export default Body2;
