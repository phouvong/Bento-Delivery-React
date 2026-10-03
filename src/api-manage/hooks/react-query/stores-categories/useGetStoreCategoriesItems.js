import { useInfiniteQuery } from "react-query";
import MainApi from "../../../MainApi";
import { store_categories_items_api } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getApiContent } from "../../../getApiContent";
import { buildStoreItemQueryParams } from "./buildStoreItemQueryParams";

// Hits /api/v1/store-categories/items?store_id=... and returns BOTH the
// category tabs (response.categories) and the paginated product list
// (response.products) for that store. Replaces the prior split calls to
// /api/v1/categories + /api/v1/items/latest.
const buildUrl = (params) => {
  const { storeId, categoryId = [] } = params || {};

  const parts = [`store_id=${storeId}`, ...buildStoreItemQueryParams(params)];
  if (Array.isArray(categoryId) && categoryId.length > 0) {
    parts.push(`category_id=${categoryId.join(",")}`);
  }

  return `${store_categories_items_api}?${parts.join("&")}`;
};

const fetchPage = async (params) => {
  const { data } = await MainApi.get(buildUrl(params));
  // Normalize: the endpoint now returns items pre-grouped under
  // `category_wise_items: { "<categoryId>": [...] }`. Flatten into a single
  // `products` array (dedup by id) so downstream consumers that expect the
  // older `products` shape keep working.
  if (data && !Array.isArray(data?.products) && data?.category_wise_items) {
    const seen = new Set();
    const flat = [];
    // Preserve which bucket key (categories[].id — a store_category id when
    // category_source is "store_category", an admin category id otherwise)
    // each item came under. Consumers need this instead of re-deriving
    // grouping from the item's own admin category_id/category_ids, since
    // those don't match the store_category ids the chips are keyed by.
    const categoryWiseItemIds = {};
    Object.entries(data.category_wise_items).forEach(([bucketId, bucket]) => {
      if (!Array.isArray(bucket)) return;
      categoryWiseItemIds[bucketId] = bucket
        .map((item) => item?.id)
        .filter((id) => id != null);
      bucket.forEach((item) => {
        if (item?.id != null && !seen.has(item.id)) {
          seen.add(item.id);
          flat.push(item);
        }
      });
    });
    data.products = flat;
    data.categoryWiseItemIds = categoryWiseItemIds;
  }
  return getApiContent(data);
};

export default function useGetStoreCategoriesItems(pageParams) {
  return useInfiniteQuery(
    [
      "store-categories-items",
      pageParams?.storeId,
      pageParams?.offset,
      pageParams?.categoryId,
      pageParams?.type,
      pageParams?.filterData,
      pageParams?.minMax,
      pageParams?.ratingCount,
      pageParams?.sortBy,
      pageParams?.search,
    ],
    () => fetchPage(pageParams),
    {
      enabled: Boolean(pageParams?.storeId),
      retry: 1,
      cacheTime: 0,
      onError: onSingleErrorResponse,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage?.products?.length > 0 ? nextPage : undefined;
      },
    }
  );
}
