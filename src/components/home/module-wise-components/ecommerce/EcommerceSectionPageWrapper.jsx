import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import FoodSearchFilterDrawer from "components/home/search/FoodSearchFilterDrawer";
import ModuleSectionPageWrapper from "../shared/ModuleSectionPageWrapper";
import SectionSearchBar from "../shared/SectionSearchBar";
import SectionSearchResults from "../shared/SectionSearchResults";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import SectionMobileActionBar from "components/home/section-page/SectionMobileActionBar";

const ECOMMERCE_BANNER_TITLES = {
  Offers: "Search Product Offers",
  "Free Delivery": "Find Free Delivery Products",
  "Top Rated": "Search Top Rated Shops",
  Nearby: "Search Nearby Shops",
  "Express Delivery": "Search Express Delivery Products",
};

const EcommerceSectionPageWrapper = ({
  sectionLabel,
  enableSearch = true,
  childHandlesSearch = false,
  children,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  const q =
    enableSearch && typeof router.query.q === "string"
      ? router.query.q.trim()
      : "";
  const sectionId = Array.isArray(router.query.slug)
    ? router.query.slug[0]
    : typeof router.query.slug === "string"
    ? router.query.slug
    : null;

  const { data: categoriesResponse } = useGetCategories();
  const categories = categoriesResponse?.data ?? [];

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterParams, setFilterParams] = useState({});
  const [appliedFilterCount, setAppliedFilterCount] = useState(0);
  const [mobileSearch, setMobileSearch] = useState(
    typeof router.query.q === "string" ? router.query.q : ""
  );

  const commitMobileSearch = (val) => {
    const trimmed = val.trim();
    const { q: _removed, ...rest } = router.query;
    const nextQuery = trimmed ? { ...rest, q: trimmed } : rest;
    router.push({ pathname: router.pathname, query: nextQuery }, undefined, { shallow: true });
  };

  const handleFilterApply = (filters) => {
    setFilterParams(filters);
    setAppliedFilterCount(Object.keys(filters).length);
  };

  const filterButton = enableSearch ? (
    <Box
      onClick={(e) => setFilterAnchorEl(e.currentTarget)}
      sx={{
        position: "relative",
        width: 36,
        height: 36,
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.secondary",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: "8px",
        cursor: "pointer",
        "&:hover": { opacity: 0.7 },
      }}
    >
      <i
        className="fi fi-ss-sliders-v"
        style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
      />
      {appliedFilterCount > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
            minWidth: 18,
            height: 18,
            borderRadius: "50%",
            backgroundColor: "neutral.1050",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: "4px",
          }}
        >
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1,
            }}
          >
            {appliedFilterCount}
          </Typography>
        </Box>
      )}
    </Box>
  ) : undefined;
  return (
    <>
      <SectionMobileActionBar
        searchValue={mobileSearch}
        onSearchChange={setMobileSearch}
        onSearchCommit={commitMobileSearch}
        onFilterOpen={() => setFilterAnchorEl(document.body)}
        filterCount={appliedFilterCount}
      />
      <ModuleSectionPageWrapper
        sectionLabel={sectionLabel}
        bannerTitle={ECOMMERCE_BANNER_TITLES[sectionLabel] ?? "Search Products"}
        bannerSubtitle="Easy search to easy order & get fast delivery for your need."
        searchComponent={
          enableSearch ? (
            <SectionSearchBar
              placeholder={t("Search Here...")}
            />
          ) : undefined
        }
        filterComponent={filterButton}
      >
        {enableSearch && q && sectionId && !childHandlesSearch ? (
          <SectionSearchResults sectionId={sectionId} q={q} appliedFilters={filterParams} />
        ) : (
          childHandlesSearch && React.isValidElement(children)
            ? React.cloneElement(children, { filterParams })
            : children
        )}
      </ModuleSectionPageWrapper>
      {enableSearch && (
        <FoodSearchFilterDrawer
          anchorEl={filterAnchorEl}
          onClose={() => setFilterAnchorEl(null)}
          onApply={handleFilterApply}
          filterValue={filterParams}
          showFilterBy={true}
          categories={categories}
        />
      )}
    </>
  );
};

export default EcommerceSectionPageWrapper;
