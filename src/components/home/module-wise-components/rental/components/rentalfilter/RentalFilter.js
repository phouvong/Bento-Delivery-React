import React from "react";
import RentalFilterWrapper from "./RentalFilterWrapper";
import RentalPriceRange from "./RentalPriceRange";
import RentalCategories from "./RentalCategories";
import RentalBrands from "./RentalBrands";
import RentalSeats from "./RentalSeats";
import RentalCooling from "./RentalCooling";
import { FILTER_TITLES } from "./constants";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import { useGetBrandLists } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/brands/useGetBrandLists";

const RentalFilter = ({
  minMax,
  setMinMax,
  setSelectedCategoryIds,
  setSelectedBrandIds,
  setSelectedSeats,
  setAirCondition,
  setNoAirCondition,
  rentalPriceFilterRange,

}) => {
  const { rentalCategories } = useSelector(
    (state) => state?.rentalCategoriesLists
  );

  const { data: brands } = useGetBrandLists();

  return (
    <>
      <RentalFilterWrapper
        title={FILTER_TITLES.PRICE_RANGE}
        content={<RentalPriceRange minMax={minMax} setMinMax={setMinMax} rentalPriceFilterRange={rentalPriceFilterRange}  />}
      />
      {rentalCategories && rentalCategories.length > 0 && (
        <RentalFilterWrapper
          title={FILTER_TITLES.CATEGORIES}  
          content={
            <RentalCategories setSelectedCategoryIds={setSelectedCategoryIds} />
          }
        />
      )}
      {brands && brands?.brands.length > 0 && (
        <RentalFilterWrapper
          title={FILTER_TITLES.BRANDS}
          content={
            <RentalBrands
              brands={brands}
              setSelectedBrandIds={setSelectedBrandIds}
            />
          }
        />
      )}
      <RentalFilterWrapper
        title={FILTER_TITLES.SEATS}
        content={<RentalSeats setSelectedSeats={setSelectedSeats} />}
      />
      <RentalFilterWrapper
        title={FILTER_TITLES.COOLING}
        content={
          <RentalCooling
            setNoAirCondition={setNoAirCondition}
            setAirCondition={setAirCondition}
          />
        }
      />
    </>
  );
};

export default RentalFilter;
