import React, { useEffect } from "react";
import { Drawer, styled, useMediaQuery, useTheme } from "@mui/material";
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

  const content = (
    <CustomStackFullWidth sx={{ padding: !sideDrawer && "1rem" }} spacing={3}>
      {categories?.length > 0 && (
        <MultipleCheckboxWithTitle
          title="Categories"
          data={categories}
          searchValue={searchValue}
          id={id}
          showAll
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

      {/*<MultipleCheckboxWithTitle title="Brands" data={Dummy} showAll />*/}
      {/*<TagsCheckbox title="Popular Tags" data={Dummy} showAll />*/}
    </CustomStackFullWidth>
  );
  if (lgUp) {
    return (
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
    );
  }
  if (sideDrawer) {
    return (
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
    );
  }
  return (
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
  );
};

SearchFilter.propTypes = {};

export default SearchFilter;
