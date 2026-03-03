import React, { useEffect, useMemo, useState } from "react";
import { Drawer, NoSsr, styled, useMediaQuery, useTheme } from "@mui/material";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { Box } from "@mui/system";
import useGetBrandsList from "api-manage/hooks/react-query/brands/useGetBrandsList";
import BrandCheckBox from "components/multiple-checkbox-with-title/brands-checkbox";
import { useTranslation } from "react-i18next";
import MultipleCheckboxWithTitle from "../../multiple-checkbox-with-title";
import { useDispatch, useSelector } from "react-redux";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import { setCategories } from "redux/slices/storedData";
import { setBrands } from "redux/slices/brands";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { Scrollbar } from "components/srollbar";
import useScrollYThresholdValue from "api-manage/hooks/custom-hooks/useScrollYThresholdValue";
import { useRouter } from "next/router";

const CustomPaperBox = styled(Box)(({ theme }) => ({
  backgroundColor: "paper.default",
  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
  borderRadius: "10px",
  p: "1rem",
  color: theme.palette.neutral[900],
}));
const SearchFilter = (props) => {
  const {
    open,
    onClose,
    isFetching,
    searchValue,
    id,
    brand_id,
    sideDrawer,
    selectedBrandsHandler,
    selectedCategoriesHandler,
    currentTab,
    fromNav,
    linkRouteTo,
  } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    noSsr: true,
  });
  const { categories } = useSelector((state) => state.storedData);
  const { brands } = useSelector((state) => state.brands);

  const dispatch = useDispatch();
  const handleSuccess = (response) => {
    dispatch(setBrands(response));
  };
  const { data: categoriesData, refetch } = useGetCategories();
  const { data: brandsData, refetch: brandRefetch } =
    useGetBrandsList(handleSuccess);

  useEffect(() => {
    if (categories.length === 0) {
      refetch();
    }
  }, []);
  useEffect(() => {
    if (!brands) {
      brandRefetch();
    }
  }, []);

  useEffect(() => {
    if (categoriesData?.data) {
      dispatch(setCategories(categoriesData?.data));
    }
  }, [categoriesData]);
  const scrollbarMaxHeight = useScrollYThresholdValue({
    threshold: 200,
    belowValue: "45vh",
    aboveValue: "100vh",
  });

  const [animateScrollbarIn, setAnimateScrollbarIn] = useState(false);
  useEffect(() => {
    if (typeof requestAnimationFrame !== "function") {
      setAnimateScrollbarIn(true);
      return;
    }

    const frame = requestAnimationFrame(() => setAnimateScrollbarIn(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const rawCategoryIds = router?.query?.category_ids;
  const categoryIdsValue = Array.isArray(rawCategoryIds)
    ? rawCategoryIds[0]
    : rawCategoryIds;
  const urlSelectAll = categoryIdsValue === "all";
  const urlCategoryIds = useMemo(() => {
    if (typeof categoryIdsValue !== "string" || categoryIdsValue.length === 0)
      return [];
    if (categoryIdsValue === "all") return [];
    return [
      ...new Set(
        categoryIdsValue
          .split(",")
          .map((item) => Number(item))
          .filter((item) => Number.isFinite(item))
      ),
    ].sort((a, b) => a - b);
  }, [categoryIdsValue]);

  const content = (
    <CustomStackFullWidth sx={{ padding: !sideDrawer && "1rem 1rem 0rem 1rem"}} spacing={3}>
	    <CustomPaperBox >
	        <Scrollbar
	          style={{
	            maxHeight: scrollbarMaxHeight,
	            opacity: animateScrollbarIn ? 1 : 0,
	            transform: animateScrollbarIn
	              ? "translate3d(0, 0, 0)"
	              : "translate3d(0, 8px, 0)",
	            transition:
	              "max-height 300ms ease, opacity 250ms ease, transform 250ms ease",
	            willChange: "max-height, opacity, transform",
	          }}
	          scrollbarMinSize={1}
	        >
          {categories?.length > 0 && (
            <MultipleCheckboxWithTitle
              title="Categories"
              data={categories}
              searchValue={searchValue}
              id={id}
              showAll
              urlCategoryIds={urlCategoryIds}
              urlSelectAll={urlSelectAll}
              selectedCategoriesHandler={selectedCategoriesHandler}
              fromNav={fromNav}
            />
          )}
          {brands && currentTab !== 1 && getCurrentModuleType() === "ecommerce" && (
            <BrandCheckBox
              linkRouteTo={linkRouteTo}
              title="Brands"
              cId={id}
              data={brands}
              id={brand_id}
              searchValue={searchValue}
              showAll
              selectedBrandsHandler={selectedBrandsHandler}
            />
          )}
        </Scrollbar>
      </CustomPaperBox>
      {/*<MultipleCheckboxWithTitle title="Brands" data={Dummy} showAll />*/}
      {/*<TagsCheckbox title="Popular Tags" data={Dummy} showAll />*/}
    </CustomStackFullWidth>
  );
  return (
    <NoSsr>
      {lgUp || sideDrawer ? (
        <Box
          sx={{
            //backgroundColor: "paper.default",
            width: "100%",
            py: "3px",
            height: "100%",
          }}
        >
          {content}
        </Box>
      ) : (
        <Drawer
          anchor="left"
          onClose={onClose}
          open={open}
          PaperProps={{
            sx: {
              backgroundColor: "paper.default",
              width: 280,
            },
          }}
          sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
          variant="temporary"
        >
          {content}
        </Drawer>
      )}
    </NoSsr>
  );
};

SearchFilter.propTypes = {};

export default SearchFilter;
