import React from "react";
import { alpha, Button, Typography, useTheme } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css"; // Import simplebar CSS

const CustomMessageReasonBox = ({
  handleClick,
  automateMessageData,
  selected,
}) => {
  const theme = useTheme();

  return (
    <SimpleBar
      style={{ maxHeight: 300, overflowX: "hidden", paddingInlineEnd: "10px" }}
    >
      {" "}
      {/* Set a max height for the scrollable container */}
      <div>
        {" "}
        {/* Ensure padding or margin for spacing */}
        {automateMessageData?.map((data, index) => (
          <Button
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              border: "1px solid",
              borderColor:
                selected === data?.id
                  ? alpha(theme.palette.primary.main, 0.5)
                  : alpha(theme.palette.neutral[400], 0.3),
              padding: "9px 16px",
              boxShadow:
                selected === data?.id
                  ? `0px 4px 12px ${alpha(theme.palette.neutral[1000], 0.1)}`
                  : "none",
              marginBottom: "8px", // Add some spacing between buttons
            }}
            onClick={() => handleClick(data)}
          >
            <Typography
              fontSize="12px"
              fontWeight={selected === data?.id ? "500" : "400"}
              color={
                selected === data?.id
                  ? theme.palette.neutral[1000]
                  : theme.palette.neutral[400]
              }
              textAlign="left"
            >
              {data?.message}
            </Typography>
            {selected === data?.id ? (
              <RadioButtonCheckedIcon />
            ) : (
              <RadioButtonUncheckedIcon
                sx={{ color: theme.palette.neutral[400] }}
              />
            )}
          </Button>
        ))}
      </div>
    </SimpleBar>
  );
};

export default CustomMessageReasonBox;
