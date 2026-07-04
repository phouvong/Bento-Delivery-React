import { Box, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import useGetSearchPageData from "api-manage/hooks/react-query/search/useGetSearchPageData";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import FoodSearchFilterDrawer from "components/home/search/FoodSearchFilterDrawer";
import ModuleSearchBanner from "components/home/module-wise-components/shared/ModuleSearchBanner";
import SectionSearchBar from "components/home/module-wise-components/shared/SectionSearchBar";
import CategoryMobilePageBar from "components/home/category-page/CategoryMobilePageBar";
import TabbedSectionResult from "./TabbedSectionResult";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const TAB_ALL = "all";
const TAB_ITEMS = "items";
const TAB_STORES = "stores";

const ALL_TAB_LIMIT = 10;
const PAGE_LIMIT = 20;

// ── Section config: title + hardcoded quick_action ────────────────────────
const SECTION_CONFIG = {
  "free-delivery": { title: "Free Delivery", quickAction: "free_delivery" },
  "top-rated": { title: "Top Rated", quickAction: "top_rated" },
  nearby: { title: "Nearby", quickAction: "nearby" },
  "verified-seller": {
    title: "Verified Seller",
    quickAction: "verified_seller",
    storesOnly: true,
  },
};

const TabbedSectionPage = ({ sectionType }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const moduleType = getCurrentModuleType();

  const config = SECTION_CONFIG[sectionType];
  const sectionTitle = config?.title ?? "";
  const sectionQuickAction = config?.quickAction;
  const storesOnly = config?.storesOnly ?? false;

  const q = typeof router.query.q === "string" ? router.query.q.trim() : "";
  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;
  const activeTab = router.query.tab || TAB_ALL;

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [appliedFilterCount, setAppliedFilterCount] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    setAppliedFilters({});
    setAppliedFilterCount(0);
    setFilterAnchorEl(null);
    // also clear tab and q from URL when section changes
    const { tab: _tab, q: _q, ...rest } = router.query;
    router.replace({ query: rest }, undefined, { shallow: true });
  }, [sectionType]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: categoriesResponse } = useGetCategories();
  const categories = categoriesResponse?.data ?? [];

  const breadcrumbItems = useMemo(() => {
    const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";
    return [
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
      { key: "section", label: t(sectionTitle) },
    ];
  }, [moduleParam, sectionTitle, t]);

  const handleTabChange = (tab) => {
    setAppliedFilters({});
    setAppliedFilterCount(0);
    router.push({ query: { ...router.query, tab } }, undefined, {
      shallow: true,
    });
  };

  const handleFilterApply = (filters) => {
    const safe = { ...(filters ?? {}) };
    delete safe.quick_action; // section-level quick_action is fixed
    setAppliedFilters(safe);
    const count = [
      safe?.sort_by,
      safe?.price_min || safe?.price_max,
      safe?.rating,
      safe?.type,
      safe?.category_ids,
    ].filter(Boolean).length;
    setAppliedFilterCount(count);
  };

  const isAllTab = activeTab === TAB_ALL;
  const isItemsTab = activeTab === TAB_ITEMS;
  const isStoresTab = activeTab === TAB_STORES;
  const isReady = router.isReady && !!config;

  // Use URL module param (reactive on navigation) over localStorage-backed
  // getCurrentModuleType so the queryKey changes when user crosses modules.
  const activeModule = moduleParam || moduleType;

  const baseParams = {
    data_type: q ? "searched" : undefined,
    searchValue: q || "",
    selectedCategoriesIds: [],
    selectedBrands: [],
    offset: 0,
    module: activeModule,
    section_type: sectionType, // include in key so each section has its own cache
    ...appliedFilters,
    quick_action: sectionQuickAction, // hardcoded per section, overrides any user value
  };

  const {
    data: itemsData,
    isLoading: itemsLoading,
    isFetchingNextPage: itemsFetchingNext,
    hasNextPage: itemsHasNext,
    fetchNextPage: fetchMoreItems,
  } = useGetSearchPageData(
    {
      ...baseParams,
      currentTab: 0,
      page_limit: isAllTab ? ALL_TAB_LIMIT : PAGE_LIMIT,
    },
    () => {},
    isReady && !storesOnly && (isAllTab || isItemsTab),
  );

  const {
    data: storesData,
    isLoading: storesLoading,
    isFetchingNextPage: storesFetchingNext,
    hasNextPage: storesHasNext,
    fetchNextPage: fetchMoreStores,
  } = useGetSearchPageData(
    {
      ...baseParams,
      currentTab: 1,
      page_limit: storesOnly
        ? PAGE_LIMIT
        : isAllTab
        ? ALL_TAB_LIMIT
        : PAGE_LIMIT,
    },
    () => {},
    isReady && (storesOnly || isAllTab || isStoresTab),
  );

  const items = itemsData?.pages?.flatMap((p) => p?.products ?? []) ?? [];
  const stores = storesData?.pages?.flatMap((p) => p?.stores ?? []) ?? [];

  const itemsLabel =
    moduleType === "food"
      ? t("Foods")
      : moduleType === "pharmacy"
      ? t("Medicines")
      : moduleType === "ecommerce"
      ? t("Items")
      : t("Groceries");
  const storesLabel = moduleType === "food" ? t("Restaurants") : t("Stores");

  const searchPlaceholder = t("Search Here...");

  const TABBED_BANNER_TITLES = {
    food: {
      "free-delivery": "Find Free Delivery Food",
      "top-rated": "Search Top Rated Restaurants",
      nearby: "Search Nearby Restaurants",
    },
    pharmacy: {
      "free-delivery": "Find Free Delivery Medicine",
      "top-rated": "Search Top Rated Pharmacies",
      nearby: "Search Nearby Pharmacies",
    },
    ecommerce: {
      "free-delivery": "Find Free Delivery Products",
      "top-rated": "Search Top Rated Shops",
      "verified-seller": "Search Verified Seller Shops",
      nearby: "Search Nearby Shops",
    },
    grocery: {
      "free-delivery": "Find Free Delivery Grocery",
      "top-rated": "Search Top Rated Grocery Stores",
      nearby: "Search Nearby Grocery Stores",
    },
  };

  const moduleKey = moduleType ?? "grocery";
  const bannerTitle =
    TABBED_BANNER_TITLES[moduleKey]?.[sectionType] ??
    (moduleType === "food"
      ? "Search Delicious Food"
      : moduleType === "pharmacy"
      ? "Search for Medicine"
      : moduleType === "ecommerce"
      ? "Search for Products"
      : "Search for Grocery");

  if (!config) return null;

  return (
    <>
      <CategoryMobilePageBar
        placeholder={searchPlaceholder}
        onFilterOpen={() => setFilterAnchorEl(document.body)}
        filterCount={appliedFilterCount}
      />

      <Stack spacing={{ xs: 2, md: 0.5 }}>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
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
        </Box>

        <TabbedSectionResult
          breadcrumbItems={breadcrumbItems}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          items={items}
          stores={stores}
          itemsLabel={itemsLabel}
          storesLabel={storesLabel}
          itemsLoading={itemsLoading}
          storesLoading={storesLoading}
          itemsHasNext={itemsHasNext}
          storesHasNext={storesHasNext}
          itemsFetchingNext={itemsFetchingNext}
          storesFetchingNext={storesFetchingNext}
          fetchMoreItems={fetchMoreItems}
          fetchMoreStores={fetchMoreStores}
          appliedFilterCount={appliedFilterCount}
          storesOnly={storesOnly}
          onFilterOpen={(e) =>
            setFilterAnchorEl(e?.currentTarget ?? document.body)
          }
        />
      </Stack>

      <FoodSearchFilterDrawer
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        onApply={handleFilterApply}
        filterValue={appliedFilters}
        showFilterBy={true}
        showSortBy={!isStoresTab}
        showQuickAction={false}
        showPriceRange={!isStoresTab}
        showCategories={true}
        categories={categories}
      />
    </>
  );
};

export default TabbedSectionPage;
