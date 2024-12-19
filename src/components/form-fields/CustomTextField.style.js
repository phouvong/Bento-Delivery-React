import { alpha, styled, TextField } from "@mui/material";

export const CustomTextFieldStyle = styled(TextField)(
  ({
    theme,
    borderColor,
    language_direction,
    height,
    multiline,
    fontSize,
    backgroundColor,
  }) => ({
    border: borderColor && `1px solid ${borderColor}`,
    borderRadius: borderColor && "10px",
    backgroundColor: backgroundColor ? theme.palette.neutral[100] : "none",
    "& .MuiInputLabel-root": {
      color: theme.palette.neutral[400], // Default or custom label color
      fontWeight: "500",
    },
    "& .MuiInputBase-input::placeholder": {
      fontSize: fontSize, // Customizing the font size for the placeholder
      color: alpha(theme.palette.neutral[500], 0.5),
    },
    "& .MuiOutlinedInput-root": {
      height: height ? height : "100%",
      flexDirection:
        language_direction && language_direction === "rtl"
          ? "row-reverse"
          : "row",
      "& input[type=number]": {
        "-moz-appearance": "text-field",
      },
      "& input[type=number]::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "& input[type=number]::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
    },
    "& .MuiFormHelperText-root": {
      marginLeft: "0px",
      marginTop: "5px",
    },
    "& .MuiOutlinedInput-input": {
      fontSize: "14px",
      fontWeight: 400,
      height: !multiline && ".8em !important",
      "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus":
        {
          filter: "none",
          WebkitTextFillColor: theme.palette.neutral[1000],
          WebkitBoxShadow:
            "0 0 0px 40rem " + theme.palette.neutral[200] + " inset",
        },
    },
  })
);
