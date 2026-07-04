import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  Pagination,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { useTranslation } from "react-i18next";
import { useGetStoresWithoutInfiniteScroll } from "api-manage/hooks/react-query/store/useGetStoresByFiltering";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import NewStoreCard from "../cards/newCard/NewStoreCard";
import NewStoreCardSkeleton from "../Shimmer/NewStoreCardSkeleton";
import CustomEmptyResult from "../custom-empty-result";
import notFoundImage from "../../../public/static/empty.png";
import FoodSearchFilterDrawer from "../home/search/FoodSearchFilterDrawer";
import ModuleHomeSidebarLayout from "../home/sidebar-layout/ModuleHomeSidebarLayout";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import { getFoodSections } from "../home/module-wise-components/food/foodSectionsConfig";
import { getGrocerySections } from "../home/module-wise-components/grocery/grocerySectionsConfig";
import { getPharmacySections } from "../home/module-wise-components/pharmacy/pharmacySectionsConfig";
import { getEcommerceSections } from "../home/module-wise-components/ecommerce/ecommerceSectionsConfig";

const SECTIONS_MAP = {
  [ModuleTypes.FOOD]: getFoodSections,
  [ModuleTypes.GROCERY]: getGrocerySections,
  [ModuleTypes.PHARMACY]: getPharmacySections,
  [ModuleTypes.ECOMMERCE]: getEcommerceSections,
};

const PAGE_LIMIT = 9;

// Pull "5_plus" -> 5 etc.; FoodSearchFilterDrawer emits "<n>_plus"
const ratingDrawerToNumber = (val) => {
  if (!val) return "";
  const match = String(val).match(/^(\d+)/);
  return match ? match[1] : "";
};

const AllStores = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [page, setPage] = useState(1);

  const sortBy = appliedFilters.sort_by || "";
  const ratingNum = ratingDrawerToNumber(appliedFilters.rating);
  const categoryIds = appliedFilters.category_ids || "";

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setPage(1);
  }, [sortBy, ratingNum, categoryIds]);

  const { data: categoriesRes } = useGetCategories("");
  const categories = categoriesRes?.data ?? [];

  const { data, isFetching, isLoading } = useGetStoresWithoutInfiniteScroll({
    type: "all",
    offset: page,
    limit: PAGE_LIMIT,
    filteredData: "all",
    sortBy,
    rating: ratingNum,
    categoryIds,
    enabled: true,
  });

  const stores = data?.stores ?? [];
  const totalSize = data?.total_size ?? 0;
  const pageCount = Math.max(1, Math.ceil(totalSize / PAGE_LIMIT));

  const appliedFilterCount = [
    appliedFilters.sort_by,
    appliedFilters.rating,
    appliedFilters.category_ids,
  ].filter(Boolean).length;

  const handlePageChange = (_, value) => {
    setPage(value);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const moduleType = getCurrentModuleType();
  const getSections = SECTIONS_MAP[moduleType] ?? (() => []);

  const pageContent = (
    <Box sx={{ width: "100%", pt: { xs: "16px", md: 0 } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: { xs: 2, md: 3 }, display: { xs: "none", md: "flex" } }}
      >
        <Typography
          sx={{
            fontSize: { xs: "18px", md: "22px" },
            fontWeight: 700,
            color: "neutral.1050",
            letterSpacing: "-0.44px",
          }}
        >
          {t("All Stores")}
        </Typography>
        <Tooltip title={t("Filter")} arrow>
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            <IconButton
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
              aria-label={t("Filter")}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "8px",
                backgroundColor: "background.paper",
                border: `1px solid ${
                  appliedFilterCount > 0
                    ? theme.palette.primary.main
                    : theme.palette.divider
                }`,
                color:
                  appliedFilterCount > 0
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                transition: "all 120ms ease",
                "&:hover": {
                  backgroundColor: "background.paper",
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                },
              }}
            >
              <TuneIcon sx={{ fontSize: 20 }} />
            </IconButton>
            {appliedFilterCount > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  minWidth: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: "neutral.1050",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: "4px",
                  pointerEvents: "none",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "common.white",
                    lineHeight: 1,
                  }}
                >
                  {appliedFilterCount}
                </Typography>
              </Box>
            )}
          </Box>
        </Tooltip>
      </Stack>

      {isLoading || isFetching ? (
        <Grid container spacing={3} alignItems="stretch">
          {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={i}>
              <NewStoreCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : stores.length === 0 ? (
        <Stack alignItems="center" sx={{ py: 6 }}>
          <CustomEmptyResult
            image={notFoundImage}
            label="No stores found"
            width="220px"
            height="220px"
          />
        </Stack>
      ) : (
        <>
          <Grid container spacing={3} alignItems="stretch">
            {stores.map((store) => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={store.id}>
                <Box sx={{ "& > *": { width: "100% !important" } }}>
                  <NewStoreCard
                    variant="normal"
                    item={store}
                    imageUrl={store?.cover_photo_full_url}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          {pageCount > 1 && (
            <Stack alignItems="center" sx={{ mt: 4 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                disabled={isFetching}
              />
            </Stack>
          )}
        </>
      )}

      <FoodSearchFilterDrawer
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        onApply={(next) => setAppliedFilters(next ?? {})}
        filterValue={appliedFilters}
        showFilterBy={false}
        showQuickAction={false}
        showSortBy={false}
        showType={false}
        showPriceRange={false}
        showCategories={true}
        categories={categories}
      />
    </Box>
  );

  return (
    <>
      <SimpleMobileHeader
        title="All Stores"
        sx={{ mx: { xs: "-10px" } }}
        action={
          <Tooltip title={t("Filter")} arrow>
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <IconButton
                onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                aria-label={t("Filter")}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "8px",
                  backgroundColor: "background.paper",
                  border: `1px solid ${
                    appliedFilterCount > 0
                      ? theme.palette.primary.main
                      : theme.palette.divider
                  }`,
                  color:
                    appliedFilterCount > 0
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  transition: "all 120ms ease",
                  "&:hover": {
                    backgroundColor: "background.paper",
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <TuneIcon sx={{ fontSize: 20 }} />
              </IconButton>
              {appliedFilterCount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    minWidth: 18,
                    height: 18,
                    borderRadius: "50%",
                    backgroundColor: "neutral.1050",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: "4px",
                    pointerEvents: "none",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "common.white",
                      lineHeight: 1,
                    }}
                  >
                    {appliedFilterCount}
                  </Typography>
                </Box>
              )}
            </Box>
          </Tooltip>
        }
      />
      <ModuleHomeSidebarLayout
        overviewContent={pageContent}
        sections={getSections()}
      />
    </>
  );
};

export default AllStores;
