import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { textWithEllipsis } from "../../styled-components/TextWithEllipsis";
import { IsSmallScreen } from "../../utils/CommonValues";

const H4 = (props) => {
	const { text, ...rest } = props;
	const { t } = useTranslation();
	const classes = textWithEllipsis();
	return (
		<Typography
			variant={IsSmallScreen() ? "h8" : "subtitle2"}
			className={classes.singleLineEllipsis}
			maxHeight="20px"
			{...rest}
		>
			{t(text)}
		</Typography>
	);
};

H4.propTypes = {};

export default H4;
