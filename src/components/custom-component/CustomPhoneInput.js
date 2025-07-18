import React from "react";

import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { CustomTypography } from "../landing-page/hero-section/HeroSection.style";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import {alpha, NoSsr} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";

const CustomPhoneNumberInputStyled = styled(PhoneInput)(
  ({ theme, languageDirection, borderRadius,background }) => ({
    "&.react-tel-input .special-label": {
      fontSize: "12px !important",
      fontWeight: "500 !important",
      color: alpha(theme.palette.neutral[1000],.7),
      left: languageDirection === "rtl" ? "80%" : "10px",
      backgroundColor:background|| theme.palette.background.paper,
      zIndex: "999",
      display: "inline-block",
    },
    "&.react-tel-input .flag-dropdown": {
      backgroundColor: theme.palette.background.custom2,
      border: `1px solid ${theme.palette.neutral[200]}`,
      borderRadius: borderRadius,
    },
    "&.react-tel-input .selected-flag .flag": {
      right: languageDirection === "rtl" && "11px",
    },
    "&.react-tel-input .flag-dropdown.open .selected-flag": {
      backgroundColor: theme.palette.neutral[100],
    },
    "&.react-tel-input .country-list .search-box": {
      backgroundColor: theme.palette.background.custom2,
      color: theme.palette.neutral[600],
    },
    "&.react-tel-input .country-list .search ": {
      backgroundColor: theme.palette.background.custom2,
    },
    "&.react-tel-input .country-list .search .search-box": {
      height: "36px !important",
    },
    "&.react-tel-input .country-list .search .search-emoji": {
      display: "none",
    },
    "&.react-tel-input .selected-flag": {
      backgroundColor: theme.palette.neutral[100],
      borderRadius: "10px 0px 0px 10px !important",
      "&:hover": {
        backgroundColor: theme.palette.background.custom2,
      },
    },
    "&.react-tel-input .country-list .country": {
      textAlign: "start",
      padding: "7px 18px",
      "&:hover": {
        backgroundColor: theme.palette.background.custom2,
      },
    },
    "&.react-tel-input .country-list .search-emoji": {
      marginInlineEnd: "10px",
    },
    "&.react-tel-input .country-list": {
      backgroundColor: theme.palette.background.custom2,
      width: "300px",

      [theme.breakpoints.down("sm")]: {
        width: "300px",
      },
    },
    "&.react-tel-input .country-list .country.highlight": {
      backgroundColor: theme.palette.background.default,
    },
    "&.react-tel-input .country-list .country-name": {
      color: theme.palette.neutral[1000],
    },
    "&.react-tel-input .country-list .country .dial-code": {
      color: theme.palette.neutral[400],
    },
    "&.react-tel-input .selected-flag .arrow": {
      right: languageDirection === "rtl" ? "-20px" : "25px",
    },
    "&.react-tel-input .form-control": {
      border: `1px solid ${theme.palette.neutral[200]}`,
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.neutral[1000],
      paddingLeft: languageDirection === "rtl" ? "48px" : "48px",
      ...(languageDirection === "rtl" && {
        textAlign: "left",
        direction: "ltr",
        unicodeBidi: "plaintext",
      }),
      "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus":
        {
          filter: "none",
          WebkitTextFillColor: theme.palette.neutral[1000],
          WebkitBoxShadow:
            "0 0 0px 40rem " + theme.palette.neutral[200] + " inset",
        },
    },
    "&.react-tel-input .iti__flag-container": {
      left: languageDirection === "rtl" ? "unset" : 0,
      right: languageDirection === "rtl" ? 0 : "unset",
    },
    "&.react-tel-input .iti__selected-flag": {
      left: languageDirection === "rtl" ? 0 : "unset",
      right: languageDirection === "rtl" ? "unset" : 0,
    },
    "&.react-tel-input .iti__selected-flag .iti__arrow": {
      transform:
        languageDirection === "rtl" ? "rotate(180deg)" : "rotate(0deg)",
    },
  })
);
const CustomPhoneInput = ({
  value,
  onHandleChange,
  initCountry,
  touched,
  errors,
  lanDirection,
  height,
  borderRadius,
                            background,
                            removeLabel
}) => {
  const changeHandler = (e) => {
    onHandleChange(e);
  };
  const { configData } = useSelector((state) => state.configData);
  const { t } = useTranslation();
  const defaultCountry = initCountry?.toLowerCase();
  return (
    <NoSsr>
      <CustomStackFullWidth alignItems="flex-start" spacing={0.8}>
        {lanDirection && (
          <CustomPhoneNumberInputStyled
            background={background}
            borderRadius={borderRadius}
            autoFormat={false}
            placeholder={t("Enter phone number")}
            value={value}
            enableSearchField
            enableSearch
            onChange={changeHandler}
            inputProps={{
              required: true,
              autoFocus: false,
            }}
            specialLabel={t("Phone")}
            country={defaultCountry}
            searchStyle={{ margin: "0", width: "95%", height: "50px" }}
            inputStyle={{
              width: "100%",
              height: height ? height : "56px",
              borderRadius: borderRadius ? borderRadius : "5px",
            }}
            languageDirection={lanDirection}
            buttonClass={{ "background-color": "red" }}
            {...(configData?.country_picker_status !== 1 && {
              disableDropdown: true,
            })}
          />
        )}
        {touched && errors && (
          <CustomTypography
            variant="caption"
            sx={{
              ml: "10px",
              fontWeight: "inherit",
              color: (theme) => theme.palette.error.main,
            }}
          >
            {errors}
          </CustomTypography>
        )}
      </CustomStackFullWidth>
    </NoSsr>
  );
};
export default CustomPhoneInput;
