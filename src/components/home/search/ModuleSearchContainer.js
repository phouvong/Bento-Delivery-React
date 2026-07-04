import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import {
  setSelectedBrands,
  setSelectedCategories,
  setStoreSelectedItems,
  setStoreSelectedItems2,
} from "redux/slices/categoryIds";
import useGetSearchPageData from "api-manage/hooks/react-query/search/useGetSearchPageData";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import useGetExclusiveDealsStores from "api-manage/hooks/react-query/store/useGetExclusiveDealsStores";
import FoodSearchBanner from "components/home/module-wise-components/food/FoodSearchBanner";
import GrocerySearchBanner from "components/home/module-wise-components/grocery/GrocerySearchBanner";
import PharmacySearchBanner from "components/home/module-wise-components/pharmacy/PharmacySearchBanner";
import EcommerceSearchBanner from "components/home/module-wise-components/ecommerce/EcommerceSearchBanner";
import { getFoodSections } from "components/home/module-wise-components/food/foodSectionsConfig";
import { getGrocerySections } from "components/home/module-wise-components/grocery/grocerySectionsConfig";
import { getPharmacySections } from "components/home/module-wise-components/pharmacy/pharmacySectionsConfig";
import { getEcommerceSections } from "components/home/module-wise-components/ecommerce/ecommerceSectionsConfig";
import ModuleHomeSidebarLayout from "components/home/sidebar-layout/ModuleHomeSidebarLayout";
import FoodSearchFilterDrawer from "./FoodSearchFilterDrawer";
import ModuleSearchResult from "./ModuleSearchResult";
import MobileSearchPageBar from "components/header/new-navbar/MobileSearchPageBar";

const BANNER_MAP = {
  [ModuleTypes.FOOD]: FoodSearchBanner,
  [ModuleTypes.GROCERY]: GrocerySearchBanner,
  [ModuleTypes.PHARMACY]: PharmacySearchBanner,
  [ModuleTypes.ECOMMERCE]: EcommerceSearchBanner,
};

const SECTIONS_MAP = {
  [ModuleTypes.FOOD]: getFoodSections,
  [ModuleTypes.GROCERY]: getGrocerySections,
  [ModuleTypes.PHARMACY]: getPharmacySections,
  [ModuleTypes.ECOMMERCE]: getEcommerceSections,
};

const ALL_TAB_LIMIT = 10;
const PAGE_LIMIT = 20;

const ModuleSearchContainer = ({
  searchValue,
  configData,
  zoneid,
  searchQuery,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const moduleType = getCurrentModuleType();

  const { data_type } = router.query;
  const rawId = router.query.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const rawBrandId = router.query.brand_id;
  const brand_id = Array.isArray(rawBrandId) ? rawBrandId[0] : rawBrandId;

  const activeTab = router.query.data_type_tab || "all";

  const { selectedBrands } = useSelector((state) => state.categoryIds);

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  // URL is the single source of truth for filters.
  const FILTER_KEYS = [
    "quick_action",
    "sort_by",
    "price_min",
    "price_max",
    "rating",
    "type",
    "category_ids",
  ];

  const appliedFilters = useMemo(() => {
    const obj = {};
    FILTER_KEYS.forEach((k) => {
      if (router.query[k] != null && router.query[k] !== "") {
        obj[k] = router.query[k];
      }
    });
    return obj;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const appliedFilterCount = useMemo(
    () =>
      [
        appliedFilters.sort_by,
        appliedFilters.price_min || appliedFilters.price_max,
        appliedFilters.rating,
        appliedFilters.type,
        appliedFilters.category_ids,
        appliedFilters.quick_action,
      ].filter(Boolean).length,
    [appliedFilters],
  );

  const { data: categoriesResponse } = useGetCategories(searchValue);

  // Init redux from URL params — only for sidebar filter UI sync.
  // API params use activeBrandIds (derived from URL directly) to avoid re-renders.
  useEffect(() => {
    if (!router.isReady) return;
    dispatch(setSelectedCategories([]));
    dispatch(setStoreSelectedItems([]));
    const parsedBrandId = Number(brand_id);
    const nextBrandIds = Number.isFinite(parsedBrandId) ? [parsedBrandId] : [];
    dispatch(setSelectedBrands(nextBrandIds));
    dispatch(setStoreSelectedItems2(nextBrandIds));
  }, [router.isReady, brand_id, dispatch]);

  const isReady =
    router.isReady &&
    (!!searchValue || (data_type === "brand" && !!brand_id));
  const isAllTab = activeTab === "all";
  const isItemsTab = activeTab === "items";
  const isStoresTab = activeTab === "restaurants";

  // Always derive brand ids from URL — stable across renders, no Redux race.
  const parsedBrandIdDirect = Number(brand_id);
  const activeBrandIds = useMemo(
    () => (Number.isFinite(parsedBrandIdDirect) ? [parsedBrandIdDirect] : []),
    [parsedBrandIdDirect],
  );

  const baseParams = {
    data_type,
    searchValue,
    category_id: id,
    selectedBrands: activeBrandIds,
    offset: 0,
    module: moduleType,
    ...appliedFilters,
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
    isReady && (isAllTab || isItemsTab),
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
      page_limit: isAllTab ? ALL_TAB_LIMIT : PAGE_LIMIT,
    },
    () => {},
    isReady && (isAllTab || isStoresTab),
  );

  const { data: exclusiveDealsData } = useGetExclusiveDealsStores(
    { search: searchValue, ...appliedFilters },
    isReady && isAllTab,
  );
  const exclusiveStores = exclusiveDealsData?.stores ?? [];

  const handleFilterApply = (filters) => {
    const safe = filters ?? {};
    const nextQuery = { ...router.query };
    FILTER_KEYS.forEach((k) => {
      delete nextQuery[k];
    });
    FILTER_KEYS.forEach((k) => {
      if (safe[k] != null && safe[k] !== "") nextQuery[k] = safe[k];
    });
    router.replace({ pathname: router.pathname, query: nextQuery }, undefined, {
      shallow: true,
    });
  };

  const handleTabChange = (tab) => {
    const nextQuery = { ...router.query, data_type_tab: tab };
    FILTER_KEYS.forEach((k) => delete nextQuery[k]);
    router.push({ query: nextQuery }, undefined, { shallow: true });
  };

  const items = itemsData?.pages?.flatMap((p) => p?.products ?? []) ?? [];
  const stores = storesData?.pages?.flatMap((p) => p?.stores ?? []) ?? [];
  const itemsTotal =
    itemsData?.pages?.[0]?.total_count_item ??
    itemsData?.pages?.[0]?.total_size ?? 0;
  const storesTotal =
    storesData?.pages?.[0]?.total_count_store ??
    storesData?.pages?.[0]?.total_size ?? 0;

  const SearchBanner = BANNER_MAP[moduleType] ?? FoodSearchBanner;
  const getSections = SECTIONS_MAP[moduleType] ?? (() => []);

  return (
    <>
      <ModuleHomeSidebarLayout
        overviewContent={
          <>
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <MobileSearchPageBar
                searchQuery={searchQuery}
                query={router.query}
                onFilterOpen={(e) => setFilterAnchorEl(e.currentTarget)}
                appliedFilterCount={appliedFilterCount}
              />
            </Box>
            <SearchBanner zoneid={zoneid} searchQuery={searchQuery} />
            <ModuleSearchResult
              searchValue={searchValue}
              configData={configData}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              items={items}
              stores={stores}
              itemsTotal={itemsTotal}
              storesTotal={storesTotal}
              itemsLoading={itemsLoading}
              storesLoading={storesLoading}
              itemsHasNext={itemsHasNext}
              storesHasNext={storesHasNext}
              itemsFetchingNext={itemsFetchingNext}
              storesFetchingNext={storesFetchingNext}
              fetchMoreItems={fetchMoreItems}
              fetchMoreStores={fetchMoreStores}
              exclusiveStores={exclusiveStores}
              appliedFilterCount={appliedFilterCount}
              onFilterOpen={(e) => setFilterAnchorEl(e.currentTarget)}
            />
          </>
        }
        sections={getSections()}
      />

      <FoodSearchFilterDrawer
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        onApply={handleFilterApply}
        filterValue={appliedFilters}
        showFilterBy={false}
        showSortBy={!isStoresTab}
        showPriceRange={!isStoresTab}
        categories={categoriesResponse?.data ?? []}
      />
    </>
  );
};

export default ModuleSearchContainer;
