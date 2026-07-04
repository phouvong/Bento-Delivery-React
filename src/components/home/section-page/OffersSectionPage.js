import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import useGetOfferItems from "api-manage/hooks/react-query/offers/useGetOfferItems";
import useGetOfferStores from "api-manage/hooks/react-query/offers/useGetOfferStores";
import SectionPageLayout from "./SectionPageLayout";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const TAB_ALL = "all";
const TAB_ITEMS = "items";
const TAB_STORES = "stores";

const OffersSectionPage = () => {
  const router = useRouter();
  const moduleType = getCurrentModuleType();

  const q = typeof router.query.q === "string" ? router.query.q.trim() : "";
  const [activeTab, setActiveTab] = useState(TAB_ALL);
  const [filters, setFilters] = useState({});

  const itemParams = { search: q, limit: 20, ...filters };
  const storeParams = { search: q, limit: 20, ...filters };

  const fetchItems =
    router.isReady && (activeTab === TAB_ALL || activeTab === TAB_ITEMS);
  const fetchStores =
    router.isReady && (activeTab === TAB_ALL || activeTab === TAB_STORES);

  const {
    data: itemsData,
    isLoading: itemsLoading,
    isFetchingNextPage: itemsFetchingNext,
    hasNextPage: itemsHasNext,
    fetchNextPage: fetchNextItems,
  } = useGetOfferItems(itemParams, fetchItems);

  const {
    data: storesData,
    isLoading: storesLoading,
    isFetchingNextPage: storesFetchingNext,
    hasNextPage: storesHasNext,
    fetchNextPage: fetchNextStores,
  } = useGetOfferStores(storeParams, fetchStores);

  // Flatten pages into a single array
  const items = useMemo(
    () =>
      (itemsData?.pages ?? []).flatMap(
        (page) =>
          page?.products ?? page?.items ?? (Array.isArray(page) ? page : []),
      ),
    [itemsData],
  );

  const stores = useMemo(
    () =>
      (storesData?.pages ?? []).flatMap(
        (page) => page?.stores ?? (Array.isArray(page) ? page : []),
      ),
    [storesData],
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const searchPlaceholder = "Search Here...";

  const bannerTitle =
    moduleType === "food"
      ? "Search Delicious Offers"
      : moduleType === "pharmacy"
      ? "Search Medicine Offers"
      : moduleType === "ecommerce"
      ? "Search Product Offers"
      : "Search Grocery Offers";

  return (
    <SectionPageLayout
      sectionLabel="Offers"
      bannerTitle={bannerTitle}
      searchPlaceholder={searchPlaceholder}
      items={Array.isArray(items) ? items : []}
      stores={Array.isArray(stores) ? stores : []}
      itemsLoading={itemsLoading}
      storesLoading={storesLoading}
      itemsFetchingNext={itemsFetchingNext}
      storesFetchingNext={storesFetchingNext}
      itemsHasNext={!!itemsHasNext}
      storesHasNext={!!storesHasNext}
      fetchNextItems={fetchNextItems}
      fetchNextStores={fetchNextStores}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onFilterChange={(f) => setFilters(f)}
    />
  );
};

export default OffersSectionPage;
