import React from "react";
import PropTypes from "prop-types";
import { CustomBoxFullWidth } from "../../styled-components/CustomStyles.style";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
} from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import WorkIcon from "@mui/icons-material/Work"; // Example icon

const CustomSelectWithFormik = (props) => {
  const {
    inputLabel,
    selectFieldData,
    passSelectedValue,
    touched,
    errors,
    fieldProps,
    required,
    value,
    startIcon, // Adding startIcon prop
    placeholder, // Adding placeholder prop
  } = props;
  const [age, setAge] = React.useState(value);
  const theme = useTheme();
  const { t } = useTranslation();

  const handleChange = (event) => {
    passSelectedValue(event.target.value);
    setAge(event.target.value);
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel
        required={required}
        id="demo-simple-select-label"
        sx={{
          color: theme.palette.neutral[500],
          display: "flex",
          alignItems: "start !important",
          fontSize: "13px",
          fontWeight: "500",
        }}
      >
        {/*{startIcon && (*/}
        {/*  <InputAdornment position="start" sx={{ mr: 1 }}>*/}
        {/*    {startIcon}*/}
        {/*  </InputAdornment>*/}
        {/*)}*/}
        {inputLabel}
      </InputLabel>
      <Select
        variant="outlined"
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label={inputLabel}
        onChange={handleChange}
        error={Boolean(touched && errors)}
        helperText={touched && errors}
        placeholder={placeholder}
        displayEmpty
        renderValue={value !== "" ? undefined : () => placeholder}
        {...fieldProps}
        sx={{
          height: "45px",
          "& .MuiSelect-select": {
            height: "45px",
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        {/* Dynamic options */}
        {selectFieldData?.length > 0 &&
          selectFieldData.map((item, index) => (
            <MenuItem
              key={index}
              value={item.value}
              sx={{
                "&:not(.Mui-selected):hover": {
                  backgroundColor: "primary.main",
                  color: "#fff",
                },
              }}
            >
              {t(item.label)}
            </MenuItem>
          ))}
      </Select>
      {touched && errors && (
        <FormHelperText sx={{ color: theme.palette.error.main }}>
          {t(errors)}
        </FormHelperText>
      )}
    </FormControl>
  );
};

CustomSelectWithFormik.propTypes = {
  inputLabel: PropTypes.string.isRequired,
  selectFieldData: PropTypes.array.isRequired,
  passSelectedValue: PropTypes.func.isRequired,
  startIcon: PropTypes.node, // Adding propType for startIcon
  placeholder: PropTypes.string, // Adding propType for placeholder
};

export default CustomSelectWithFormik;
