import { useInfiniteQuery } from "react-query";
import MainApi from "../../../MainApi";
import { store_categories_items_api } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

// Hits /api/v1/store-categories/items?store_id=... and returns BOTH the
// category tabs (response.categories) and the paginated product list
// (response.products) for that store. Replaces the prior split calls to
// /api/v1/categories + /api/v1/items/latest.
const buildUrl = (params) => {
  const {
    storeId,
    categoryId = [],
    offset = 1,
    limit = 12,
    type,
    minMax = [0, 1],
    filterData = [],
    ratingCount,
    sortBy,
  } = params || {};

  const parts = [`store_id=${storeId}`, `offset=${offset}`, `limit=${limit}`];
  if (Array.isArray(categoryId) && categoryId.length > 0) {
    parts.push(`category_id=${categoryId.join(",")}`);
  }
  // The backend treats "halal" as a tag/filter rather than a categorical
  // type. So when the user picks halal in the UI we route it through
  // `filter_by` and keep `type=all` (otherwise the backend would receive
  // type=halal which it doesn't recognize on this endpoint). veg /
  // non_veg / all stay on the `type` param as before.
  const isHalal = type === "halal";
  parts.push(`type=${isHalal ? "all" : type || "all"}`);
  if (isHalal) {
    parts.push(`filter_by=halal`);
  }
  if (Array.isArray(filterData) && filterData.length > 0) {
    parts.push(`filter=${encodeURIComponent(JSON.stringify(filterData))}`);
  }
  if (ratingCount) {
    parts.push(`rating_count=${ratingCount}`);
  }
  if (minMax?.[0] !== 0 || minMax?.[1] !== 1) {
    parts.push(`min_price=${minMax[0]}`, `max_price=${minMax[1]}`);
  }
  if (sortBy && sortBy !== "Default") {
    // Backend expects `price_high_low` / `price_low_high` (see
    // /api/v1/offers/items?sort_by=price_high_low). Internally the UI
    // still uses the short forms "high" / "low" — map them here so the
    // call sites don't change.
    const SORT_MAP = {
      high: "price_high_low",
      low: "price_low_high",
    };
    parts.push(`sort_by=${SORT_MAP[sortBy] || sortBy}`);
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
    Object.values(data.category_wise_items).forEach((bucket) => {
      if (!Array.isArray(bucket)) return;
      bucket.forEach((item) => {
        if (item?.id != null && !seen.has(item.id)) {
          seen.add(item.id);
          flat.push(item);
        }
      });
    });
    data.products = flat;
  }
  return data;
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
