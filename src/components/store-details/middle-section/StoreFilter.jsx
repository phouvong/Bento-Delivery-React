import React, {useEffect, useState} from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper, Stack,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useTranslation } from "react-i18next";
import { IsSmallScreen } from "utils/CommonValues";
import CustomPopover from "../../CustomPopover";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomRatings from "../../search/CustomRatings";


const Filter = ({ filterTypeItems, setFilterData ,setRatingCount,ratingCount,key}) => {

  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [filters, setFilters] = useState(filterTypeItems);
  useEffect(() => {
    const resetFilters = filterTypeItems.map(item => ({
      ...item,
      checked: false,
    }));
    setFilters(resetFilters);
    setFilterData([]);
    setRatingCount(0)
  }, [key]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCheckbox = (index) => {
    const updatedFilters = [...filters];
    updatedFilters[index].checked = !updatedFilters[index].checked;
    setFilters(updatedFilters);

    // Store checked items to setFilterData
    const checkedItems = updatedFilters
      .filter((item) => item.checked)
      .map((item) => item.value);
    setFilterData(checkedItems); // ✅ Here you update parent
  };
const handleChangeRatings=(value)=>{
  setRatingCount(value);
}
  return (
    <Stack mt={{ xs:2, md: 0 }} direction="row" alignItems="center" key={key}>
      <Button
        onClick={handleClick}
        variant="outlined"
        sx={{ color:theme=>theme.palette.neutral[600], borderColor: "text.secondary" ,borderRadius: "5px",}}
      >
        <FilterAltOutlinedIcon fontSize="small" />

          <>
            <Typography>{t("Filter")}</Typography>

          </>

      </Button>

      {open && (
        <CustomPopover
          openPopover={open}
          anchorEl={anchorEl}
          placement="bottom"
          handleClose={handleClose}
          top="10px"
          left="0px"
        >
          <Paper sx={{ p: "25px", width: "355px" }}>
            <CustomBoxFullWidth>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography fontWeight="bold">{t("Filter By")}</Typography>
                </Grid>

                <Grid item xs={12}>
                  {filters.map((item, index) => (
                    <FormControlLabel
                      key={item.value}
                      control={
                        <Checkbox
                          checked={item.checked}
                          onChange={() => handleCheckbox(index)}
                        />
                      }
                      label={t(item.label)}
                    />
                  ))}
                </Grid>

                {/* Ratings */}
                <Grid item xs={12}>
                  <Typography fontWeight="bold">{t("Ratings")}</Typography>
                  <CustomStackFullWidth alignItems="center">
                    <CustomRatings 	fontSize="20px" ratingValue={ratingCount} handleChangeRatings={handleChangeRatings}/>
                  </CustomStackFullWidth>
                </Grid>
              </Grid>
            </CustomBoxFullWidth>
          </Paper>
        </CustomPopover>
      )}
    </Stack>
  );
};

export default Filter;
