import { useTheme } from "@emotion/react";
import { FormControlLabel, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { StyleCheckBox } from "./group-buttons/OutlinedGroupButtons";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { t } from "i18next";

const CustomCheckbox = ({ item, checkHandler, isChecked, seats }) => {
  const theme = useTheme();
  const [checked, setChecked] = useState(false);
  const checkboxRef = useRef(null);

  useEffect(() => {
    setChecked(isChecked);
    // checkHandler?.({
    //   checked: isChecked,
    //   id: item?.id,
    // });
  }, [isChecked]);

  // useEffect(() => {
  //   checkboxRef.current.focus();
  // }, [checked]);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    checkHandler?.({
      checked: event.target.checked,
      id: item?.id,
      value: item?.value,
    });
  };

  return (
    <FormControlLabel
      // ref={checkboxRef}
      control={
        <StyleCheckBox
          // ref={checkboxRef}
          module={getCurrentModuleType()}
          value={item?.value}
          checked={checked}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
      }
      label={
        <Typography color={theme.palette.text.primary} fontSize="13px" noWrap>
          {seats ? `${t(item?.name)} ${t("Seats")}` : t(item?.name)}
        </Typography>
      }
    />
  );
};

CustomCheckbox.propTypes = {};

export default CustomCheckbox;
