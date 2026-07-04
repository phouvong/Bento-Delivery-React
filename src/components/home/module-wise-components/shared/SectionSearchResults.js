import { Box, Grid, Skeleton, Stack, Typography } from "@mui/material";
import useGetSearchPageData from "api-manage/hooks/react-query/search/useGetSearchPageData";
import NewProductCard from "components/cards/newCard/NewProductCard";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Maps a section id to the filter params sent to useGetSearchPageData.
 * `itemFocus` true = show items first; false = show stores first.
 */
const SECTION_PARAMS = {
  offers: { filterValue: ["discounted"], itemFocus: true },
  "top-rated": { filterValue: ["top_rated"], itemFocus: true },
  "express-delivery": { filterValue: [], itemFocus: false },
  nearby: { filterValue: [], itemFocus: false },
};

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
              <NewStoreCard variant="normal" item={store} imageUrl={store?.cover_photo_full_url} />
            </Box>
          </Grid>
        ))}
  </Grid>
);

const Empty = ({ label }) => {
  const { t } = useTranslation();
  return (
    <Typography sx={{ color: "neutral.500", py: 4, px: { xs: "16px", md: 0 } }}>
      {t("No results found for")} &ldquo;{label}&rdquo;
    </Typography>
  );
};

const SectionTitle = ({ children }) => (
  <Typography
    sx={{
      fontSize: { xs: "18px", md: "22px" },
      fontWeight: 700,
      color: "neutral.1050",
      letterSpacing: "-0.8px",
      lineHeight: 1.1,
      px: { xs: "16px", md: 0 },
      pt: 1,
    }}
  >
    {children}
  </Typography>
);

/**
 * Renders API search results scoped to a specific section context.
 * Shown on /home/[sectionId] pages when ?q= is present in the URL.
 */
const SectionSearchResults = ({ sectionId, q, appliedFilters }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const moduleType = getCurrentModuleType();

  const { filterValue: sectionFilter, itemFocus } = SECTION_PARAMS[sectionId] ?? {
    filterValue: [],
    itemFocus: true,
  };

  const extraFilter = appliedFilters?.filterValue ?? [];
  const mergedFilter = [...new Set([...sectionFilter, ...extraFilter])];

  const baseParams = {
    data_type: "searched",
    searchValue: q,
    selectedCategoriesIds: ["undefined"],
    selectedBrands: ["undefined"],
    page_limit: 20,
    offset: 0,
    type: "all",
    filterValue: mergedFilter,
    rating_count: appliedFilters?.rating_count ?? 0,
    minMax: appliedFilters?.minMax ?? [0, 20000000],
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
    if (!q) return;
    refetchItems();
    refetchStores();
  }, [q, sectionId, appliedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const items = itemsData?.pages?.flatMap((p) => p?.products ?? []) ?? [];
  const stores = storesData?.pages?.flatMap((p) => p?.stores ?? []) ?? [];

  const itemsLabel =
    moduleType === "food" ? t("Foods") :
    moduleType === "pharmacy" ? t("Medicines") :
    moduleType === "ecommerce" ? t("Items") : t("Groceries");
  const storesLabel = moduleType === "food" ? t("Restaurants") : t("Stores");

  const showItems = !itemFocus ? false : true;
  const showStores = itemFocus ? false : true;
  // Show both if section focuses on items but stores also have results, or vice versa
  const hasItems = itemsLoading || items.length > 0;
  const hasStores = storesLoading || stores.length > 0;

  return (
    <Stack spacing={3} sx={{ px: { xs: "16px", md: 0 }, pt: 1 }}>
      {/* Items section */}
      {(itemFocus || hasItems) && (
        <Stack spacing={2}>
          <SectionTitle>{itemsLabel}</SectionTitle>
          {!itemsLoading && items.length === 0
            ? <Empty label={q} />
            : <ProductGrid items={items} isLoading={itemsLoading} />}
        </Stack>
      )}

      {/* Stores section */}
      {(!itemFocus || hasStores) && (
        <Stack spacing={2}>
          <SectionTitle>{storesLabel}</SectionTitle>
          {!storesLoading && stores.length === 0
            ? <Empty label={q} />
            : <StoreGrid stores={stores} isLoading={storesLoading} />}
        </Stack>
      )}
    </Stack>
  );
};

export default SectionSearchResults;
