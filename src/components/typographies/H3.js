import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { textWithEllipsis } from "styled-components/TextWithEllipsis";

const H3 = (props) => {
  const { text, ...rest } = props;
  const { t } = useTranslation();
  const classes = textWithEllipsis();
  return (
    <Typography
      variant="subtitle1"
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: "1",
        WebkitBoxOrient: "vertical",
      }}
      // className={classes.singleLineEllipsis}
      maxHeight="20px"
      {...rest}
    >
      {t(text)}
    </Typography>
  );
};

H3.propTypes = {};

export default H3;
