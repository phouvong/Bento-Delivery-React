import { alpha, Paper, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CustomButtonPrimary } from "../../../styled-components/CustomButtons.style";
import Box from "@mui/material/Box";

export const CustomSearchField = styled(Paper)(({ theme }) => ({
  width: "100%",
  border: "none",
}));
export const SearchLocationTextField = styled(TextField)(
  ({
    theme,
    language_direction,
    frommap,
    fromparcel,
    margin_top,
    isLanding,
    isXSmall,
    searchHeight,
    showCurrentLocation
  }) => ({
    width: "100%",
    backgroundColor: theme.palette.neutral[300],
    // height: searchHeight??"44px",
    borderRadius: isXSmall && isLanding ? "4px" : "0 0 4px 4px",
    border: "none",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiOutlinedInput-root": {
      //color: theme.palette.primary.main,
      fontSize: fromparcel === "true" ? "12px" : { xs: "14px", sm: "16px" },
      padding: fromparcel === "true" && "5px",
      height: fromparcel === "true" && "45px",

      paddingRight: "0px",
      borderTopRightRadius:
        frommap === "true" ? "0px" : fromparcel === "false" ? "0px" : "5px",
      borderBottomRightRadius:
        frommap === "true" ? "0px" : fromparcel === "false" ? "0px" : "5px",
      borderTopLeftRadius: frommap === "true" && "0px",
      borderBottomLeftRadius: frommap === "true" && "0px",
      border: "1px solid",
      borderColor:
        fromparcel === "true"
          ? alpha(theme.palette.neutral[400], 0.4)
          : alpha(theme.palette.neutral[400], 0.4),
      "& fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
      [theme.breakpoints.down("sm")]: {
        // borderRadius: "4px",
      },
      "& .MuiAutocomplete-input": {
        padding: "2.5px 4px 2.5px 6px",
      },
      "& .MuiInputBase-input": {
        padding: showCurrentLocation && "11.5px 14px",
      },
      "& .MuiInputBase-input::placeholder": {
        opacity: theme.palette.mode === "dark" ? ".8" : ".9",
      },
    },
  })
);
export const StyledButton = styled(CustomButtonPrimary)(
  ({ theme, radiuschange, language_direction }) => ({
    color: theme.palette.whiteContainer.main,
    width: "500px",
    padding: "9px 7px 10.5px 7px",
    // paddingTop: "10px",
    // paddingBottom: "9px",
    marginLeft: language_direction === "rtl" && "15px",
    borderTopLeftRadius:
      (language_direction === "ltr" || !language_direction) &&
      radiuschange === "true" &&
      "0px",
    borderBottomLeftRadius:
      (language_direction === "ltr" || !language_direction) &&
      radiuschange === "true" &&
      "0px",
    borderTopRightRadius:
      language_direction === "rtl" && radiuschange === "true" && "0px",
    borderBottomRightRadius:
      language_direction === "rtl" && radiuschange === "true" && "0px",
  })
);
export const CustomBox = styled(Box)(({ theme }) => ({
  maxWidth: "825px",
  width: "100%",
  // backgroundColor:{alpha(theme.palette.primary.main, 0.3)},
  padding: "2.625rem",
  borderRadius: "1.25rem",
  height: "132px",
  // maxWidth: '825px',
  // marginLeft: 'auto',
  // marginRight: 'auto',
  // marginTop: '34px',
  // [theme.breakpoints.down('sm')]: {
  //     marginTop: '10px',
}));
export const CustomTypography = styled(Typography)(
  ({ theme, fontWeight, align }) => ({
    color: theme.palette.neutral[1000],
    fontWeight: fontWeight ? fontWeight : "inherit",
    textAlign: align ? align : "",
  })
);
export const HeroFormInputWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  position: "relative",
}));
export const HeroFormItem = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  position: "absolute",
  marginRight: "5px",
  top: "0",
  right: "0",
}));
