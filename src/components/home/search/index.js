import React, { useEffect, useRef, useState } from "react";
import CustomContainer from "../../container";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import TabsTypeTwo from "../../custom-tabs/TabsTypeTwo";
import SearchMenu from "../../search/SearchMenu";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import { alpha, useMediaQuery, useTheme } from "@mui/material";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { filterTypeStores } from "components/search/filterTypes";
import SideBarWithData from "components/search/SideBarWithData";
import useGetSearchPageData from "api-manage/hooks/react-query/search/useGetSearchPageData";
import MobileSideDrawer from "components/home/search/MobileSideDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterData,
  setRating_Count,
  setSelectedBrands,
  setSelectedCategories,
} from "redux/slices/categoryIds";

const SearchResult = (props) => {
  const {
    searchValue,
    configData,

    fromAllCategories,
    fromNav,
    routeTo,
    currentTab,
    setCurrentTab,
  } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const { data_type } = router.query;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const id = router.query.id;
  const brand_id = router.query.brand_id;
  const [currentView, setCurrentView] = useState(0);
  const [offset, setOffset] = useState(0);
  const [openSideDrawer, setOpenSideDrawer] = useState(false);
  const [filterValue, setFilterValue] = useState([]);
  const [minMax, setMinMax] = useState([0, 20000]);
  const [type, setType] = useState("all");
  const [category_id, setCategoryId] = useState(id);
  const [sortBy, setSortBy] = useState("");
  const [newSort, setNewSort] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const [linkRouteTo, setLinkRouteTo] = useState(routeTo);
  const { ref, inView } = useInView({
    rootMargin: "0px 0px 38% 0px",
  });

  const { selectedBrands, selectedCategories, filterData, rating_count } =
    useSelector((state) => state.categoryIds);
  useEffect(() => {
    dispatch(setSelectedBrands(data_type === "brand" ? [brand_id] : []));
    dispatch(setSelectedCategories(data_type === "category" ? [id] : []));
  }, []);

  const page_limit = 12;

  const selectedCategoriesHandler = (dataArray) => {
    if (dataArray?.length > 0) {
      setLinkRouteTo("");
      dispatch(setSelectedCategories([...new Set(dataArray)]));
    } else {
      dispatch(setSelectedCategories([]));
    }
  };

  const selectedBrandsHandler = (dataArray) => {
    if (linkRouteTo === "nav") {
      dispatch(setSelectedBrands([]));
    } else {
      const filteredArray = dataArray.filter((item) => !isNaN(item));
      if (filteredArray.length > 0) {
        dispatch(setSelectedBrands([...new Set(filteredArray)]));
      } else {
        dispatch(setSelectedBrands([]));
      }
    }
  };

  const tabs = [
    {
      name:
        getCurrentModuleType() === "food"
          ? "Foods"
          : getCurrentModuleType() === "ecommerce"
          ? "Items"
          : getCurrentModuleType() === "pharmacy"
          ? "Medicines"
          : "Groceries",
      value: "items",
    },
    {
      name: getCurrentModuleType() === "food" ? "Restaurants" : "Stores",
      value: "stores",
    },
  ];

  const selectedCategoriesIds = selectedCategories;

  const handleSuccess = (res) => {
    if (res) {
      const hasData =
        currentTab === 0
          ? res?.pages[0]?.products?.length > 0
          : res?.pages[0]?.stores?.length > 0;
      if (!hasData) {
        setIsEmpty(true);
      }

      setOffset((prev) => prev + 1);
    }
  };
  const pageParams = {
    data_type,
    searchValue,
    category_id,
    selectedCategoriesIds,
    selectedBrands,
    page_limit,
    offset,
    type,
    currentTab,
    filterValue,
    rating_count,
    minMax,
  };

  const {
    data: searchData,
    refetch: serachRefetch,
    isFetching: isFetchingSearchAPi,
    isRefetching: isRefetchingSearch,
    fetchNextPage: fetchNextPageSearch,
    isFetchingNextPage,
    isLoading: isLoadingSearch,
  } = useGetSearchPageData(pageParams, handleSuccess);

  const prevSelectedCategoriesIds = useRef(pageParams.selectedCategoriesIds);
  const prevBrands = useRef(pageParams.selectedBrands);
  const prvMinmax = useRef(pageParams.minMax);
  const prvRating = useRef(pageParams.rating_count);

  useEffect(() => {
    handleFilterSelection();
  }, []);

  useEffect(() => {
    const hasData =
      currentTab === 0
        ? searchData?.pages[0]?.products?.length > 0
        : searchData?.pages[0]?.stores?.length > 0;
    const selectedCategoriesChanged =
      prevSelectedCategoriesIds.current !== pageParams.selectedCategoriesIds;
    const selectedBrandsChanged =
      prevBrands.current !== pageParams.selectedBrands;
    prevSelectedCategoriesIds.current = pageParams.selectedCategoriesIds;
    const selectedMinMaxChanged = prvRating.current !== pageParams.minMax;
    prvMinmax.current = pageParams.minMax;

    const selectedRating = prvRating.current !== pageParams.rating_count;
    prvMinmax.current = pageParams.rating_count;
    if (
      (!hasData && selectedCategoriesChanged && isEmpty) ||
      (!hasData && selectedMinMaxChanged && isEmpty) ||
      (!hasData && selectedRating && isEmpty) ||
      (!hasData && selectedBrandsChanged && isEmpty)
    ) {
      serachRefetch();
    }
  }, [
    searchData,
    pageParams.selectedCategoriesIds,
    pageParams.selectedBrands,
    serachRefetch,
    filterData,
    pageParams?.minMax,
    rating_count,
    selectedBrands,
  ]);

  const handleFilterSelection = () => {
    const filterTypesConditionally = filterTypeStores;
    const newData = filterTypesConditionally?.map((item) => {
      if (item?.value === "discounted") {
        if (data_type === "discounted") {
          return {
            ...item,
            checked: true,
          };
        } else {
          return item;
        }
      } else {
        return item;
      }
    });
    dispatch(setFilterData(newData));
  };

  const handleSortBy = (value) => {
    setSortBy(value);
    setFilterValue((prevValues) => {
      let newFilterValues = new Set([...prevValues]);
      if (value === "low") {
        if (newFilterValues?.has("high")) {
          newFilterValues?.delete("high");
        }
      } else {
        // Assuming the only other option is "high2Low"
        if (newFilterValues?.has("low")) {
          newFilterValues?.delete("low");
        }
      }
      newFilterValues.add(value);
      return [...newFilterValues];
    });
  };
  const handleSortByNew = (value) => {
    setNewSort(value);
    setFilterValue((prevValues) => {
      let newFilterValues = new Set([...prevValues]);

      // Clear "default," "nearby," and "distance" if already present
      ["default", "fast_delivery", "nearby"].forEach((item) => {
        if (newFilterValues.has(item)) {
          newFilterValues.delete(item);
        }
      });

      // Add the new value from "default", "nearby", or "distance"
      if (["default", "fast_delivery", "nearby"].includes(value)) {
        newFilterValues.add(value);
      }

      return [...newFilterValues];
    });
  };

  const handleCheckbox = (value, e) => {
    let newData = filterData?.map((item) =>
      item?.value === value?.value
        ? { ...item, checked: e.target.checked }
        : item
    );
    dispatch(setFilterData(newData));
  };

  useEffect(() => {
    const defaultValues = ["default", "fast_delivery", "nearby", "high", "low"];
    const currentlyCheckedValues = filterData
      .filter((item) => item.checked)
      .map((item) => item.value);

    // Include default values if they exist in the current filterValue
    const updatedFilterValue = [
      ...new Set([
        ...currentlyCheckedValues,
        ...filterValue.filter((val) => defaultValues.includes(val)),
      ]),
    ];

    // Update filterValue only if there is a change
    if (
      updatedFilterValue.length !== filterValue.length ||
      !updatedFilterValue.every((val, index) => val === filterValue[index])
    ) {
      setFilterValue(updatedFilterValue);
    }
  }, [filterData]);

  const handleChangeRatings = (value) => {
    dispatch(setRating_Count(value));
  };

  const filterDataAndFunctions = {
    filterData: filterData,
    setFilterData: setFilterData,
    handleCheckbox: handleCheckbox,
    handleChangeRatings: handleChangeRatings,
    getRatingValue: rating_count,
    currentTab: currentTab,
  };

  useEffect(() => {
    if (inView) {
      fetchNextPageSearch();
    }
  }, [
    inView,
    searchValue,
    currentTab,
    filterValue,
    selectedCategories,
    rating_count,
    minMax,
    selectedBrands,
  ]);

  const handleCurrentTab = (value) => {
    setCurrentTab(value);
    setFilterValue([]);

    // Uncheck all filters and dispatch the updated data
    dispatch(
      setFilterData(filterData.map((item) => ({ ...item, checked: false })))
    );
  };

  const getRefBox = () => (
    <CustomBoxFullWidth ref={ref} sx={{ height: "10px" }}></CustomBoxFullWidth>
  );

  const refBoxHandler = () => {
    return <>{getRefBox()}</>;
  };

  return (
    <CustomContainer>
      <CustomStackFullWidth alignItems="center" justifyContent="center">
        <CustomStackFullWidth
          alignItems="center"
          justifyContent="center"
          sx={{ marginTop: "20px", marginBottom: "20px" }}
        >
          {selectedBrands?.length == 0 && (
            <TabsTypeTwo
              tabs={tabs}
              currentTab={currentTab}
              setCurrentTab={handleCurrentTab}
            />
          )}
        </CustomStackFullWidth>

        <SearchMenu
          currentView={currentView}
          setCurrentView={setCurrentView}
          handleSortBy={handleSortBy}
          sortBy={sortBy}
          totalDataCount={searchData?.pages[0]?.total_size}
          currentTab={currentTab}
          tabs={tabs}
          setOpenSideDrawer={setOpenSideDrawer}
          filterDataAndFunctions={filterDataAndFunctions}
          isFetchingNextPage={isFetchingNextPage || isLoadingSearch}
          minMax={minMax}
          setMinMax={setMinMax}
          handleSortByNew={handleSortByNew}
          newSort={newSort}
        />
        <CustomBoxFullWidth
          sx={{
            borderBottom: (theme) =>
              `1px solid ${alpha(theme.palette.neutral[400], 0.4)}`,
          }}
        ></CustomBoxFullWidth>
        <CustomBoxFullWidth>
          <SideBarWithData
            searchValue={searchValue}
            id={id}
            brand_id={brand_id}
            currentTab={currentTab}
            configData={configData}
            currentView={currentView}
            filterData={filterData}
            selectedCategoriesHandler={selectedCategoriesHandler}
            selectedBrandsHandler={selectedBrandsHandler}
            fromAllCategories={fromAllCategories}
            pageData={searchData}
            isFetchingNextPage={isFetchingNextPage || isLoadingSearch}
            fromNav={fromNav}
            linkRouteTo={linkRouteTo}
          />
          {refBoxHandler()}
        </CustomBoxFullWidth>
        {openSideDrawer && (
          <MobileSideDrawer
            open={openSideDrawer}
            onClose={() => setOpenSideDrawer(false)}
            sortBy={sortBy}
            handleSortBy={handleSortBy}
            searchValue={searchValue}
            id={id}
            brand_id={brand_id}
            selectedCategoriesHandler={selectedCategoriesHandler}
            selectedBrandsHandler={selectedBrandsHandler}
            currentTab={currentTab}
            handleChangeRatings={handleChangeRatings}
            //setFilterData={setFilterData}
            filterData={filterData}
            handleCheckbox={handleCheckbox}
            ratingValue={rating_count}
            handleSortByNew={handleSortByNew}
            newSort={newSort}
          />
        )}
      </CustomStackFullWidth>
    </CustomContainer>
  );
};

SearchResult.propTypes = {};

export default React.memo(SearchResult);
