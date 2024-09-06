import CloseIcon from "@mui/icons-material/Close";
import {
  Checkbox,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import HighToLow from "../../../sort/HighToLow";
import CustomRatings from "../../search/CustomRatings";
import SearchFilter from "../../search/search-filter";

const MobileSideDrawer = (props) => {
  const {
    open,
    onClose,
    handleSortBy,
    sortBy,
    searchValue,
    id,
    brand_id,
    setPageData,
    selectedCategoriesHandler,
    selectedBrandsHandler,
    currentTab,
    handleChangeRatings,
    filterData,
    setFilterData,
    handleCheckbox,
    ratingValue,
  } = props;
  // const [filterData, setFilterData] = useState(filterTypes);
  const [minMax, setMinMax] = useState([0, 0]);
  //const priceFilterRange = [{ min_price: 0, max_price: 100 }];
  const { t } = useTranslation();
  // const handleCheckbox = (value, e) => {
  //   // setSelectedFilterValues((prev) => [...prev, value]);
  //   let newData = filterData.map((item) =>
  //     item?.value === value?.value
  //       ? { ...item, checked: e.target.checked }
  //       : item
  //   );
  //   setFilterData(newData);
  // };
  const handleMinMax = (value) => {
    if (value[0] === 0) {
      value[0] = priceFilterRange?.[0]?.min_price;
    }
    setMinMax(value);
  };
  const content = (
    <CustomStackFullWidth sx={{ mt: "42px" }}>
      <Grid container>
        <Grid item xs={12}>
          <CustomStackFullWidth spacing={1.5}>
            <Typography fontWeight="bold">{t("Filter By")}</Typography>
            <Stack width="100%" justifyContent="center" alignItems="center">
              {currentTab !== 1 && (
                <HighToLow handleSortBy={handleSortBy} sortBy={sortBy} />
              )}
            </Stack>
            <CustomBoxFullWidth>
              <Grid container>
                <Grid item xs={6}>
                  {currentTab === 0 ? (
                    <>
                      {filterData?.length > 0 &&
                        filterData?.slice(2, 4)?.map?.((item, index) => {
                          return (
                            <FormControlLabel
                              sx={{
                                "& .MuiFormControlLabel-label": {
                                  fontSize: "13px",
                                  fontWeight: item?.checked && "450",
                                },
                              }}
                              key={index}
                              control={
                                <Checkbox
                                  checked={item?.checked}
                                  onChange={(e) => handleCheckbox(item, e)}
                                  name={item?.label}
                                />
                              }
                              label={item?.label}
                            />
                          );
                        })}
                    </>
                  ) : (
                    <>
                      {filterData?.length > 0 &&
                        filterData?.map((item, index) => {
                          if (index >= 0 && index <= 3) {
                            return (
                              <FormControlLabel
                                sx={{
                                  "& .MuiFormControlLabel-label": {
                                    fontSize: "13px",
                                    fontWeight: item?.checked && "450",
                                  },
                                }}
                                key={index}
                                control={
                                  <Checkbox
                                    checked={item?.checked}
                                    onChange={(e) => handleCheckbox(item, e)}
                                    name={item?.label}
                                  />
                                }
                                label={item?.label}
                              />
                            );
                          }
                        })}
                    </>
                  )}
                </Grid>
                <Grid item xs={6}>
                  {filterData?.length > 0 &&
                    filterData?.map((item, index) => {
                      if (index >= 4 && index <= 7) {
                        return (
                          <FormControlLabel
                            sx={{
                              "& .MuiFormControlLabel-label": {
                                fontSize: "13px",
                                fontWeight: item?.checked && "420",
                              },
                            }}
                            key={index}
                            control={
                              <Checkbox
                                checked={item?.checked}
                                onChange={(e) => handleCheckbox(item, e)}
                                name={item?.label}
                              />
                            }
                            label={item?.label}
                          />
                        );
                      }
                    })}
                </Grid>
              </Grid>
            </CustomBoxFullWidth>
          </CustomStackFullWidth>
        </Grid>
        {/*<Grid item xs={12}>*/}
        {/*  <CustomStackFullWidth spacing={1}>*/}
        {/*    <Typography fontWeight="bold">{t("Price")}</Typography>*/}
        {/*    <CustomSlider*/}
        {/*      handleChangePrice={handleMinMax}*/}
        {/*      minMax={minMax}*/}
        {/*      priceFilterRange={*/}
        {/*        priceFilterRange?.length > 0 && priceFilterRange[0]*/}
        {/*      }*/}
        {/*    />*/}
        {/*  </CustomStackFullWidth>*/}
        {/*</Grid>*/}
        <Grid item xs={12}>
          <CustomStackFullWidth
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <Typography fontWeight="bold">{t("Ratings")}</Typography>
            <CustomRatings
              ratingValue={ratingValue}
              fontSize="20px"
              handleChangeRatings={handleChangeRatings}
              // readOnly
            />
          </CustomStackFullWidth>
        </Grid>
        <Grid item xs={12}>
          <SearchFilter
            searchValue={searchValue}
            id={id}
            brand_id={brand_id}
            sideDrawer
            selectedBrandsHandler={selectedBrandsHandler}
            selectedCategoriesHandler={selectedCategoriesHandler}
            currentTab={currentTab}
          />
        </Grid>
      </Grid>
    </CustomStackFullWidth>
  );
  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "paper.default",
          width: "100%",
          padding: "15px",
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      <IconButton
        onClick={() => onClose()}
        sx={{ position: "absolute", top: 5, right: 8 }}
      >
        <CloseIcon sx={{ fontSize: { xs: "18px", md: "24px" } }} />
      </IconButton>
      {content}
    </Drawer>
  );
};

MobileSideDrawer.propTypes = {};

export default MobileSideDrawer;
