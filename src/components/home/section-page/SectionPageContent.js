import { Box, Grid, Skeleton, Stack, Typography } from "@mui/material";
import useGetSearchPageData from "api-manage/hooks/react-query/search/useGetSearchPageData";
import NewProductCard from "components/cards/newCard/NewProductCard";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import FoodSearchFilterDrawer from "components/home/search/FoodSearchFilterDrawer";
import ModuleSearchBanner from "components/home/module-wise-components/shared/ModuleSearchBanner";
import SectionSearchBar from "components/home/module-wise-components/shared/SectionSearchBar";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// ── Section → API config ─────────────────────────────────────────────────────
const SECTION_CONFIG = {
  offers: { label: "Offers", filterValue: ["discounted"], itemFocus: true },
  "top-rated": {
    label: "Top Rated",
    filterValue: ["top_rated"],
    itemFocus: true,
  },
  "express-delivery": {
    label: "Express Delivery",
    filterValue: [],
    itemFocus: false,
  },
  nearby: { label: "Nearby", filterValue: [], itemFocus: false },
};

// ── Tab values ────────────────────────────────────────────────────────────────
const TAB_ALL = "all";
const TAB_ITEMS = "items";
const TAB_STORES = "stores";

// ── Filter pill ───────────────────────────────────────────────────────────────
const FilterPill = ({ label, active, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      height: { xs: "26px", md: "36px" },
      px: active ? { xs: "12px", md: "16px" } : { xs: "8px", md: "16px" },
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      backgroundColor: active
        ? "primary.main"
        : { xs: "transparent", md: "background.secondary" },
      userSelect: "none",
      transition: "background-color 0.15s",
    }}
  >
    <Typography
      sx={{
        fontSize: { xs: "12px", md: "14px" },
        fontWeight: 600,
        color: active ? "#fff" : "neutral.1050",
        letterSpacing: "-0.42px",
        lineHeight: 1.2,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Typography>
  </Box>
);

// ── Product grid ──────────────────────────────────────────────────────────────
const ProductGrid = ({ items, isLoading }) => (
  <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
    {isLoading
      ? [...Array(10)].map((_, i) => (
          <Grid key={i} item xs={6} sm={4} md={3} lg={2.4}>
            <ProductCardSimmer cardWidth="100%" />
          </Grid>
        ))
      : items.map((item) => (
          <Grid key={item?.id} item xs={6} sm={4} md={3} lg={2.4}>
            <NewProductCard variant="vertical" item={item} cardWidth="100%" />
          </Grid>
        ))}
  </Grid>
);

// ── Store grid ────────────────────────────────────────────────────────────────
const StoreGrid = ({ stores, isLoading }) => (
  <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
    {isLoading
      ? [...Array(6)].map((_, i) => (
          <Grid key={i} item xs={12} sm={6} md={4}>
            <NewStoreCardSkeleton />
          </Grid>
        ))
      : stores.map((store) => (
          <Grid key={store?.id} item xs={12} sm={6} md={4}>
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
);

// ── Section title ─────────────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
  <Typography
    sx={{
      fontSize: { xs: "18px", md: "22px" },
      fontWeight: 700,
      color: "neutral.1050",
      letterSpacing: "-0.8px",
      lineHeight: 1.1,
    }}
  >
    {children}
  </Typography>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const SectionPageContent = ({ sectionId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const moduleType = getCurrentModuleType();

  const config = SECTION_CONFIG[sectionId] ?? {
    label: sectionId,
    filterValue: [],
    itemFocus: true,
  };

  const q = typeof router.query.q === "string" ? router.query.q.trim() : "";
  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;
  const activeTab = router.query.tab || TAB_ALL;

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [appliedFilterCount, setAppliedFilterCount] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState({
    filterValue: config.filterValue,
    rating_count: 0,
    minMax: [0, 20000000],
  });

  // Reset applied filters when section changes
  useEffect(() => {
    setAppliedFilters({
      filterValue: config.filterValue,
      rating_count: 0,
      minMax: [0, 20000000],
    });
    setAppliedFilterCount(0);
  }, [sectionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterApply = (filters) => {
    const sortMap = { price_low: ["low"], price_high: ["high"] };
    const sortPart = sortMap[filters.sortBy] ?? [];
    const filterByPart = Array.isArray(filters.filterBy)
      ? filters.filterBy
      : [];
    const filterValue = [...config.filterValue, ...sortPart, ...filterByPart];
    const rating_count = filters.selectedRatings.length
      ? Math.min(...filters.selectedRatings.map(Number))
      : 0;
    const minMax =
      filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000
        ? [filters.priceRange[0], filters.priceRange[1]]
        : [0, 20000000];
    setAppliedFilters({ filterValue, rating_count, minMax });
    const count =
      (filters.sortBy ? 1 : 0) +
      (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000 ? 1 : 0) +
      filters.selectedRatings.length +
      filterByPart.length;
    setAppliedFilterCount(count);
  };

  const handleTabChange = (tab) => {
    setAppliedFilters({
      filterValue: config.filterValue,
      rating_count: 0,
      minMax: [0, 20000000],
    });
    setAppliedFilterCount(0);
    router.push({ query: { ...router.query, tab } }, undefined, {
      shallow: true,
    });
  };

  // Breadcrumb
  const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";
  const breadcrumbItems = [
    {
      key: "home",
      label: t("Home"),
      icon: (
        <i
          className="fi fi-rr-home"
          style={{ fontSize: 12, display: "flex", lineHeight: 1 }}
        />
      ),
      onRedirect: homeHref,
    },
    { key: "section", label: t(config.label) },
  ];

  // Labels
  const itemsLabel =
    moduleType === "food"
      ? t("Foods")
      : moduleType === "pharmacy"
      ? t("Medicines")
      : moduleType === "ecommerce"
      ? t("Items")
      : t("Groceries");
  const storesLabel = moduleType === "food" ? t("Restaurants") : t("Stores");

  // Search placeholder
  const searchPlaceholder = t("Search Here...");

  // API params
  const baseParams = {
    data_type: "searched",
    searchValue: q || "",
    selectedCategoriesIds: ["undefined"],
    selectedBrands: ["undefined"],
    page_limit: 20,
    offset: 0,
    type: "all",
    filterValue: appliedFilters.filterValue,
    rating_count: appliedFilters.rating_count,
    minMax: appliedFilters.minMax,
    module: moduleType,
  };

  const {
    data: itemsData,
    isLoading: itemsLoading,
    refetch: refetchItems,
  } = useGetSearchPageData({ ...baseParams, currentTab: 0 }, () => {});

  const {
    data: storesData,
    isLoading: storesLoading,
    refetch: refetchStores,
  } = useGetSearchPageData({ ...baseParams, currentTab: 1 }, () => {});

  useEffect(() => {
    if (!router.isReady) return;
    refetchItems();
    refetchStores();
  }, [router.isReady, sectionId, q, appliedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const items = itemsData?.pages?.flatMap((p) => p?.products ?? []) ?? [];
  const stores = storesData?.pages?.flatMap((p) => p?.stores ?? []) ?? [];

  const showItems = activeTab === TAB_ALL || activeTab === TAB_ITEMS;
  const showStores = activeTab === TAB_ALL || activeTab === TAB_STORES;

  // Banner title per module
  const bannerTitle =
    moduleType === "food"
      ? "Search Delicious Food"
      : moduleType === "pharmacy"
      ? "Search for Medicine"
      : moduleType === "ecommerce"
      ? "Search for Products"
      : "Search for Grocery";

  return (
    <Stack spacing={2}>
      {/* Banner with search */}
      <ModuleSearchBanner
        zoneid={
          typeof window !== "undefined"
            ? localStorage.getItem("zoneid")
            : undefined
        }
        title={bannerTitle}
        subtitle="Easy search to easy order & get fast delivery for your need."
        component={<SectionSearchBar placeholder={searchPlaceholder} />}
      />

      {/* Filter bar */}
      <Stack
        direction="row"
        alignItems="center"
        gap={{ xs: "8px", md: "12px" }}
        sx={{
          flexWrap: "nowrap",
          py: { xs: "8px", md: "12px" },
          position: { xs: "static", md: "sticky" },
          top: { md: "63px" },
          zIndex: { md: 10 },
          backgroundColor: (theme) => theme.palette.background.default,
          px: { xs: "16px", md: 0 },
        }}
      >
        {/* Breadcrumb */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <CustomPageBreadCrumb items={breadcrumbItems} />
        </Box>

        {/* Tabs */}
        <Stack
          direction="row"
          gap={{ xs: "2px", md: "8px" }}
          alignItems="center"
          flexShrink={0}
        >
          <FilterPill
            label={t("All")}
            active={activeTab === TAB_ALL}
            onClick={() => handleTabChange(TAB_ALL)}
          />
          <FilterPill
            label={itemsLabel}
            active={activeTab === TAB_ITEMS}
            onClick={() => handleTabChange(TAB_ITEMS)}
          />
          <FilterPill
            label={storesLabel}
            active={activeTab === TAB_STORES}
            onClick={() => handleTabChange(TAB_STORES)}
          />
        </Stack>

        {/* Filter button */}
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
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: "8px",
            cursor: "pointer",
            flexShrink: 0,
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
      </Stack>

      {/* Results */}
      <Stack spacing={3} sx={{ px: { xs: "16px", md: 0 }, pb: 4 }}>
        {showItems && (
          <Stack spacing={2}>
            <SectionTitle>{itemsLabel}</SectionTitle>
            {!itemsLoading && items.length === 0 ? (
              <Typography sx={{ color: "neutral.500", py: 2 }}>
                {t("No results found")}
              </Typography>
            ) : (
              <ProductGrid items={items} isLoading={itemsLoading} />
            )}
          </Stack>
        )}

        {showStores && (
          <Stack spacing={2}>
            <SectionTitle>{storesLabel}</SectionTitle>
            {!storesLoading && stores.length === 0 ? (
              <Typography sx={{ color: "neutral.500", py: 2 }}>
                {t("No results found")}
              </Typography>
            ) : (
              <StoreGrid stores={stores} isLoading={storesLoading} />
            )}
          </Stack>
        )}
      </Stack>

      <FoodSearchFilterDrawer
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        onApply={handleFilterApply}
        showFilterBy={false}
        showSortBy={activeTab !== TAB_STORES}
        showPriceRange={activeTab !== TAB_STORES}
        categories={[]}
      />
    </Stack>
  );
};

export default SectionPageContent;
