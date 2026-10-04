import { Typography } from "@mui/material";
import { useState } from "react";
import { useTheme } from "@emotion/react";
import { t } from "i18next";

export const ReadMore = ({ children, limits, color, font }) => {
  const fontLimits = limits ? limits : 70;
  const theme = useTheme();
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  const fontColor = theme.palette.primary.main;
  return (
    <Typography
      fontSize={{ xs: "10px", sm: font ?? "14px", md: font ?? "14px" }}
      fontWeight="400"
      color={color ? color : theme.palette.neutral[600]}
    >
      {isReadMore ? text?.slice(0, fontLimits) : text}
      {text?.length > fontLimits && (
        <span
          onClick={toggleReadMore}
          style={{ cursor: "pointer", color: fontColor }}
        >
          {isReadMore ? t("...Read more") : t(" Show less")}
        </span>
      )}
    </Typography>
  );
};
