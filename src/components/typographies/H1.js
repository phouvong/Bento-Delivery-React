import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { IsSmallScreen } from "../../utils/CommonValues";

const H1 = (props) => {
	const { text, textAlign, textTransform, fontWeight, ...rest } = props;

	const { t } = useTranslation();
	return (
		<Typography
			textAlign={textAlign ? textAlign : "center"}
			fontWeight={fontWeight ? fontWeight : "700"}
			lineHeight={IsSmallScreen() ? "10px" : "30px"}
			sx={{ fontSize: { xs: "15px", md: "22px" } }}
			textTransform={textTransform}
			{...rest}
		>
			{t(text)}
		</Typography>
	);
};

H1.propTypes = {
	text: PropTypes.string.isRequired,
};

export default H1;
