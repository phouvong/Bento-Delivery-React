// Shared query-string builder for the two store item listing endpoints —
// /store-categories/items and /stores/popular-items/{id}. Both accept the
// same filter/sort surface (see StoreItemFiltersTrait on the backend), so
// this is the single place that maps our UI state to those params. Callers
// prepend their own store identifier (store_id=... or the {id} path segment).
export const buildStoreItemQueryParams = (params) => {
  const {
    offset = 1,
    limit = 12,
    type,
    minMax = [0, 1],
    filterData = [],
    ratingCount,
    sortBy,
    search,
  } = params || {};

  const parts = [`offset=${offset}`, `limit=${limit}`];
  if (search) {
    parts.push(`search=${encodeURIComponent(search)}`);
  }
  // The backend treats "halal" as a tag/filter rather than a categorical
  // type, so route it through `filter_by` and keep `type=all`. veg /
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
    // Backend expects `price_high_low` / `price_low_high`. Internally the UI
    // still uses the short forms "high" / "low" — map them here so call
    // sites don't change.
    const SORT_MAP = {
      high: "price_high_low",
      low: "price_low_high",
    };
    parts.push(`sort_by=${SORT_MAP[sortBy] || sortBy}`);
  }

  return parts;
};
