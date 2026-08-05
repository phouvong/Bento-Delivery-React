import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { CustomTextField } from "styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";

const TripTypeSelector = ({
  value,
  setValue,
  label = "Trip Type",
  menuProps = {},
  isHourly,
  isDistence, card, update,isDayWise
}) => {
  const { t } = useTranslation();
  const handleSelectChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <FormControl sx={{ m: 1, height: "45px" }}>
      <InputLabel id="trip-type-selector-label" sx={{ top: "-3px" }}>
        {t(label)}
      </InputLabel>
      <Select
        labelId="trip-type-selector-label"
        id="trip-type-selector"
        value={value}
        onChange={handleSelectChange}
        input={<OutlinedInput label={label} />}
        MenuProps={menuProps}
        sx={{ height: "45px" }}
        placeholder={t("Select Trip Type")}
      >
        {isDistence===1 || update ? <MenuItem value="distance_wise">
          <ListItemText primary={t("Distance Wise")} />
        </MenuItem>:null }
       {isHourly===1 || update ?  (<MenuItem value="hourly">
          <ListItemText primary={t("Hourly")} />
        </MenuItem>):null}
        {isDayWise===1 || update ?  (<MenuItem value="day_wise">
          <ListItemText primary={t("Per day")} />
        </MenuItem>):null}
        
      </Select>
    </FormControl>
  );
};

export default TripTypeSelector;
