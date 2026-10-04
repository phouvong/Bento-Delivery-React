import { Box, Grid, Skeleton, Stack } from "@mui/material";
import useGetHomeCategoryStores from "api-manage/hooks/react-query/categories-details/useGetHomeCategoryStores";
import useGetFeatureCategoriesProducts from "api-manage/hooks/react-query/useGetFeatureCategories";
import DotSpin from "components/DotSpin";
import EmptySearchResults from "components/EmptySearchResults";
import ProductCardImport, { CardWrapper } from "components/cards/ProductCard";
import StoreCardImport from "components/cards/StoreCard";
import TabsTypeTwoImport from "components/custom-tabs/TabsTypeTwo";
import { getItemsOrFoods } from "helper-functions/getItemsOrFoods";
import { getStoresOrRestaurants } from "helper-functions/getStoresOrRestaurants";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

const ProductCard: any = ProductCardImport;
const StoreCard: any = StoreCardImport;
const TabsTypeTwo: any = TabsTypeTwoImport;

type Props = {
  categoryId: string;
};

const PAGE_LIMIT = 20;

const dedupeById = (existing: any[], incoming: any[]) => {
  if (existing.length === 0) return incoming;
  const seen = new Set(existing.map((item) => item?.id));
  return [...existing, ...incoming.filter((item) => !seen.has(item?.id))];
};

const ShimmerItem = () => (
  <Grid item xs={6} sm={4} md={3}>
    <CardWrapper sx={{ height: "250px" }}>
      <Stack spacing={1}>
        <Skeleton variant="rectangular" animation="pulse" height={150} />
        <Stack alignItems="center" justifyContent="center" padding="1rem">
          <Skeleton variant="text" animation="wave" height={20} width="80%" />
          <Skeleton variant="text" animation="wave" height={20} />
          <Skeleton variant="text" animation="wave" height={20} width="80%" />
        </Stack>
      </Stack>
    </CardWrapper>
  </Grid>
);

const HomeCategoryBrowser = ({ categoryId }: Props) => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [itemsOffset, setItemsOffset] = useState<number>(1);
  const [storesOffset, setStoresOffset] = useState<number>(1);
  const [accumulatedItems, setAccumulatedItems] = useState<any[]>([]);
  const [accumulatedStores, setAccumulatedStores] = useState<any[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);
  const [hasMoreStores, setHasMoreStores] = useState<boolean>(true);
  const [type] = useState<string>("all");

  useEffect(() => {
    setItemsOffset(1);
    setStoresOffset(1);
    setAccumulatedItems([]);
    setAccumulatedStores([]);
    setHasMoreItems(true);
    setHasMoreStores(true);
  }, [categoryId]);

  const { data: categoryItems, isLoading: itemsLoading, isFetching: itemsFetching } =
    useGetFeatureCategoriesProducts({ categoryId, page_limit: PAGE_LIMIT, offset: itemsOffset, type, sortBy: "" });

  const { data: categoryStores, isLoading: storesLoading, isFetching: storesFetching } =
    useGetHomeCategoryStores({ categoryId, pageLimit: PAGE_LIMIT, offset: storesOffset, type });

  useEffect(() => {
    if (!categoryItems) return;
    const fetched: any[] = Array.isArray(categoryItems?.products) ? categoryItems.products : [];
    setAccumulatedItems((prev) => (itemsOffset === 1 ? fetched : dedupeById(prev, fetched)));
    setHasMoreItems(fetched.length >= PAGE_LIMIT);
  }, [categoryItems, itemsOffset]);

  useEffect(() => {
    if (!categoryStores) return;
    const fetched: any[] = Array.isArray(categoryStores?.stores) ? categoryStores.stores : [];
    setAccumulatedStores((prev) => (storesOffset === 1 ? fetched : dedupeById(prev, fetched)));
    setHasMoreStores(fetched.length >= PAGE_LIMIT);
  }, [categoryStores, storesOffset]);

  const { ref: loadMoreRef, inView } = useInView({ rootMargin: "0px 0px 200px 0px" });

  useEffect(() => {
    if (!inView) return;
    if (currentTab === 0) {
      if (itemsLoading || itemsFetching || !hasMoreItems || accumulatedItems.length === 0) return;
      setItemsOffset((prev) => prev + 1);
    } else {
      if (storesLoading || storesFetching || !hasMoreStores || accumulatedStores.length === 0) return;
      setStoresOffset((prev) => prev + 1);
    }
  }, [inView, currentTab, itemsLoading, itemsFetching, storesLoading, storesFetching, hasMoreItems, hasMoreStores, accumulatedItems.length, accumulatedStores.length]);

  const itemsLabel = getItemsOrFoods();
  const storesLabel = getStoresOrRestaurants();

  const tabs = [
    { name: itemsLabel, value: "items", totalCount: categoryItems?.total_size ?? accumulatedItems.length },
    { name: storesLabel, value: "stores", totalCount: categoryStores?.total_size ?? accumulatedStores.length },
  ];

  const productIsInitialLoading = (itemsLoading || itemsFetching) && accumulatedItems.length === 0;
  const storeIsInitialLoading = (storesLoading || storesFetching) && accumulatedStores.length === 0;
  const isFetchingNextPage = currentTab === 0
    ? (itemsFetching || itemsLoading) && accumulatedItems.length > 0
    : (storesFetching || storesLoading) && accumulatedStores.length > 0;

  const renderItems = () => {
    if (productIsInitialLoading) return <>{Array.from({ length: 8 }).map((_, i) => <ShimmerItem key={i} />)}</>;
    if (!productIsInitialLoading && accumulatedItems.length === 0) return <EmptySearchResults text="Items not found!" />;
    return accumulatedItems.map((product: any, i: number) => (
      <Grid key={product?.id ?? i} item xs={6} sm={4} md={3}>
        <ProductCard item={product} cardheight="318px" cardFor="vertical" cardType="vertical-type" />
      </Grid>
    ));
  };

  const renderStores = () => {
    if (storeIsInitialLoading) return <>{Array.from({ length: 6 }).map((_, i) => <ShimmerItem key={i} />)}</>;
    if (!storeIsInitialLoading && accumulatedStores.length === 0) return <EmptySearchResults text="Stores not found!" />;
    return accumulatedStores.map((item: any, i: number) => (
      <Grid key={item?.id ?? i} item xs={12} sm={4} md={4}>
        <StoreCard item={item} imageUrl={item?.cover_photo_full_url} />
      </Grid>
    ));
  };

  return (
    <Stack spacing={2} sx={{ minHeight: "70vh" }}>
      <TabsTypeTwo tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <Box sx={{ minHeight: "80vh", width: "100%" }}>
        <Grid container spacing={2}>
          {currentTab === 0 ? renderItems() : renderStores()}
          {isFetchingNextPage && (
            <Grid item xs={12} sx={{ py: 3 }}>
              <Stack alignItems="center"><DotSpin /></Stack>
            </Grid>
          )}
        </Grid>
        <Box ref={loadMoreRef as any} sx={{ height: "10px", width: "100%" }} />
      </Box>
    </Stack>
  );
};

export default HomeCategoryBrowser;
