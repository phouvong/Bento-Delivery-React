import { Box, Stack, Typography } from "@mui/material";
import useGetSearchPageData from "api-manage/hooks/react-query/search/useGetSearchPageData";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import FoodSearchFilterDrawer from "components/home/search/FoodSearchFilterDrawer";
import ModuleSearchBanner from "components/home/module-wise-components/shared/ModuleSearchBanner";
import SectionSearchBar from "components/home/module-wise-components/shared/SectionSearchBar";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setSelectedCategories,
  setStoreSelectedItems,
} from "redux/slices/categoryIds";
import CategoryMobilePageBar from "./CategoryMobilePageBar";
import TabbedSectionResult from "components/home/section-page/TabbedSectionResult";

const TAB_ALL = "all";
const TAB_ITEMS = "items";
const TAB_STORES = "stores";

const ALL_TAB_LIMIT = 10;
const PAGE_LIMIT = 20;

// ── Sub-category chips (mobile only) ────────────────────────────────────────
const SubCategoryChips = ({ subCategories, activeSubCatId, onSelect }) => {
  if (!subCategories.length) return null;
  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        gap: "8px",
        overflowX: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        px: { xs: "16px", md: 0 },
        mt: { xs: "45px !important", md: 0 },
      }}
    >
      {subCategories.map((sub) => {
        const isActive = activeSubCatId === sub?.id;
        return (
          <Box
            key={sub?.id}
            onClick={() => onSelect(sub?.id)}
            sx={{
              flexShrink: 0,
              height: "32px",
              px: "14px",
              display: "flex",
              alignItems: "center",
              borderRadius: "9999px",
              cursor: "pointer",
              userSelect: "none",
              backgroundColor: isActive
                ? "primary.main"
                : { xs: "transparent", md: "background.secondary" },
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: isActive ? "#fff" : "neutral.1050",
                whiteSpace: "nowrap",
                letterSpacing: "-0.36px",
                lineHeight: 1.2,
              }}
            >
              {sub?.name}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

// ── Main ────────────────────────────────────────────────────────────────────
const CategoryPageContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const moduleType = getCurrentModuleType();

  const rawId = router.query.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const q = typeof router.query.q === "string" ? router.query.q.trim() : "";
  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;
  const activeTab = router.query.tab || TAB_ALL;

  const [activeSubCatId, setActiveSubCatId] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [appliedFilterCount, setAppliedFilterCount] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState({});

  // Fetch all categories to build breadcrumb + sub-category chips
  const { data: categoriesResponse } = useGetCategories();

  const subCategories = useMemo(() => {
    const cats = categoriesResponse?.data ?? [];
    const currentCat = cats.find((c) => String(c?.id) === String(id));
    return Array.isArray(currentCat?.childes) ? currentCat.childes : [];
  }, [categoriesResponse, id]);

  const currentCategoryName = useMemo(() => {
    const cats = categoriesResponse?.data ?? [];
    const allCats = cats.flatMap((c) => [c, ...(c?.childes ?? [])]);
    const currentCat = allCats.find((c) => String(c?.id) === String(id));
    return currentCat?.name || "";
  }, [categoriesResponse, id]);

  const breadcrumbItems = useMemo(() => {
    const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";
    const items = [
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
    ];
    const cats = categoriesResponse?.data ?? [];
    let parent = null;
    for (const cat of cats) {
      if (Array.isArray(cat?.childes)) {
        if (cat.childes.some((child) => String(child?.id) === String(id))) {
          parent = cat;
          break;
        }
      }
    }
    if (parent) {
      items.push({
        key: "parent-category",
        label: parent?.name,
        onRedirect: `/home/category/${parent?.slug || parent?.id}?id=${
          parent?.id
        }${moduleParam ? `&module=${moduleParam}` : ""}`,
      });
    }
    if (currentCategoryName) {
      items.push({ key: "current-category", label: currentCategoryName });
    }
    return items;
  }, [categoriesResponse, id, moduleParam, currentCategoryName, t]);

  // Init Redux with category id
  useEffect(() => {
    if (!router.isReady || !id) return;
    const parsedId = Number(id);
    const ids = Number.isFinite(parsedId) ? [parsedId] : [];
    dispatch(setSelectedCategories(ids));
    dispatch(setStoreSelectedItems(ids));
  }, [router.isReady, id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubCatClick = (subId) => {
    const next = activeSubCatId === subId ? null : subId;
    setActiveSubCatId(next);
    dispatch(setSelectedCategories(next ? [next] : [Number(id)]));
    dispatch(setStoreSelectedItems(next ? [next] : [Number(id)]));
  };

  const handleTabChange = (tab) => {
    setAppliedFilters({});
    setAppliedFilterCount(0);
    router.push({ query: { ...router.query, tab } }, undefined, {
      shallow: true,
    });
  };

  const handleFilterApply = (filters) => {
    setAppliedFilters(filters ?? {});
    const count = [
      filters?.sort_by,
      filters?.price_min || filters?.price_max,
      filters?.rating,
      filters?.type,
      filters?.quick_action,
    ].filter(Boolean).length;
    setAppliedFilterCount(count);
  };

  const isAllTab = activeTab === TAB_ALL;
  const isItemsTab = activeTab === TAB_ITEMS;
  const isStoresTab = activeTab === TAB_STORES;
  const isReady = router.isReady && !!id;

  const selectedCategoriesIds = activeSubCatId
    ? [activeSubCatId]
    : id
    ? [Number(id)]
    : [];

  const baseParams = {
    data_type: q ? "searched" : "category",
    searchValue: q || "",
    category_id: id,
    selectedCategoriesIds,
    selectedBrands: [],
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

  const bannerTitle = currentCategoryName
    ? t("Search in {{name}}", { name: currentCategoryName })
    : moduleType === "food"
    ? "Search Delicious Food"
    : moduleType === "pharmacy"
    ? "Search for Medicine"
    : moduleType === "ecommerce"
    ? "Search for Products"
    : "Search for Grocery";

  return (
    <>
      {/* Mobile sticky search + filter row (title bar comes from MobileNavBar) */}
      <CategoryMobilePageBar
        placeholder={searchPlaceholder}
        onFilterOpen={() => setFilterAnchorEl(document.body)}
        filterCount={appliedFilterCount}
      />

      <Stack spacing={{ xs: 2, md: 0.5 }}>
        {/* Desktop search banner */}
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

        {/* Mobile sub-category chips */}
        <SubCategoryChips
          subCategories={subCategories}
          activeSubCatId={activeSubCatId}
          onSelect={handleSubCatClick}
        />

        {/* Result section (includes desktop filter bar + tabbed content) */}
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
        showPriceRange={!isStoresTab}
        showCategories={false}
        categories={[]}
      />
    </>
  );
};

export default CategoryPageContent;
