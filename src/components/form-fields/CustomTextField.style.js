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
    labelColor,
    inputBackgroundColor
  }) => ({
    border: borderColor && `1px solid ${borderColor}`,
    borderRadius: "8px",
    backgroundColor: "transparent !important",
    "& .MuiInputLabel-root": {
      color:
        (labelColor ? labelColor : theme.palette.customColor.textNeutral) +
        " !important",
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "110%",
      letterSpacing: "-0.03em",
      textTransform: "capitalize",
      position: "static",
      transform: "none",
      marginBottom: "6px",
    },
    "& .MuiInputBase-input::placeholder": {
      fontSize: fontSize ? fontSize : "16px",
      fontWeight: 400,
      lineHeight: "130%",
      color: theme.palette.neutral[450],
      opacity: 1,
    },
    "& .MuiOutlinedInput-root": {
      height: height ? height : "44px",
      backgroundColor:
        (inputBackgroundColor
          ? inputBackgroundColor
          : theme.palette.background.paper) + " !important",
      flexDirection:
        language_direction && language_direction === "rtl"
          ? "row-reverse"
          : "row",
      "& .MuiOutlinedInput-notchedOutline": {
        borderRadius: "8px",
      },
      "&:not(.Mui-error):not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.customColor.tagBg,
      },
      "&:hover:not(.Mui-error):not(.Mui-focused) .MuiOutlinedInput-notchedOutline":
        {
          borderColor: theme.palette.customColor.tagBg,
        },
      "& input[type=number]": {
        MozAppearance: "text-field",
      },
      "& input[type=number]::-webkit-outer-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
      },
      "& input[type=number]::-webkit-inner-spin-button": {
        WebkitAppearance: "none",
        margin: 0,
      },
    },
    "& .MuiFormHelperText-root": {
      marginLeft: "0px",
      marginTop: "5px",
      whiteSpace: "pre-line",
    },
    "& .MuiOutlinedInput-input": {
      fontSize: fontSize ? fontSize : "16px",
      fontWeight: 400,
      lineHeight: "130%",
      padding: "0px 16px",
      height: !multiline ? "100%" : undefined,
      boxSizing: "border-box",
      "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus":
      {
        filter: "none",
        WebkitTextFillColor: theme.palette.neutral[1000],
        WebkitBoxShadow:
          "0 0 0px 40rem " + theme.palette.neutral[200] + " inset",
      },
    },
    "& .MuiOutlinedInput-notchedOutline legend > span": {
      display: "none",
    },
  })
);
