import { useInfiniteQuery } from "react-query";
import MainApi from "../../../MainApi";
import { get_search_page_data } from "api-manage/ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getGuestId } from "helper-functions/getToken";
import {
  MOCK_SERVICES,
  MOCK_VERIFIED_PROVIDERS,
} from "components/home/module-wise-components/service/components/global/serviceStoreModel";

const getSearch = async (pageParams) => {
  const {
    data_type,
    currentTab,
    searchValue,
    offset,
    page_limit,
    selectedCategoriesIds,
    selectedBrands,
    pageParam,
    sort_by,
    price_min,
    price_max,
    rating,
    category_ids,
    category_id,
    type,
    quick_action,
  } = pageParams;

  const moduleType = getCurrentModuleType();

  if (moduleType === "service") {
    // Try real API first
    try {
      const selectedCategoriesId =
        selectedCategoriesIds?.[0] !== "undefined" && selectedCategoriesIds?.length
          ? JSON.stringify(selectedCategoriesIds)
          : [];
      const selectedBrandId =
        selectedBrands?.[0] !== "undefined" && selectedBrands?.length
          ? JSON.stringify(selectedBrands)
          : [];

      const raw = {
        name: data_type === "searched" ? searchValue : "",
        offset: pageParam ?? offset ?? 0,
        data_type,
        list_type: currentTab === 0 ? "item" : "store",
        limit: page_limit ?? 12,
        category_ids:
          category_ids ??
          (selectedCategoriesId.length ? selectedCategoriesId : undefined),
        brand_ids: selectedBrandId.length ? selectedBrandId : undefined,
        sort_by,
        min_price: price_min,
        max_price: price_max,
        rating_count: rating,
        type,
        quick_action,
      };

      const query = new URLSearchParams(
        Object.fromEntries(
          Object.entries(raw).filter(
            ([, v]) => v !== undefined && v !== null && v !== "",
          ),
        ),
      );
      const guestId = getGuestId();

      const { data } = await MainApi.get(
        `${get_search_page_data}?${query.toString()}`,
        {
          headers: guestId ? { guestId: guestId } : {},
        },
      );

      // If backend returns valid results, use them
      if (data && (
        (currentTab === 0 && data.products && data.products.length > 0) ||
        (currentTab === 1 && data.stores && data.stores.length > 0)
      )) {
        return data;
      }
    } catch (error) {
      console.warn("Backend search API failed or not found, using fallback:", error);
    }

    // Fallback to mock data for service module
    const list_type = currentTab === 0 ? "item" : "store";
    const action = quick_action || type || "all";

    // Verified providers: return pre-shaped store objects directly
    if (list_type === "store" && action === "verified_seller") {
      return {
        stores: MOCK_VERIFIED_PROVIDERS,
        total_size: MOCK_VERIFIED_PROVIDERS.length,
        offset: 0,
        limit: page_limit || 20,
      };
    }

    let dataList = MOCK_SERVICES[action] || MOCK_SERVICES.all || [];

    // Filter by category if specified
    const activeCatId = category_id || selectedCategoriesIds?.[0];
    if (activeCatId) {
      const activeCatStr = String(activeCatId);
      if (activeCatStr.includes("cat-1") || activeCatStr.includes("ac-repair")) {
        dataList = dataList.filter(item => item.name.toLowerCase().includes("ac"));
      } else if (activeCatStr.includes("cat-2") || activeCatStr.includes("appliance")) {
        dataList = dataList.filter(item => item.name.toLowerCase().includes("appliance") || item.name.toLowerCase().includes("ac"));
      } else if (activeCatStr.includes("cat-4") || activeCatStr.includes("plumbing")) {
        dataList = dataList.filter(item => item.name.toLowerCase().includes("plumb"));
      } else if (activeCatStr.includes("cat-5") || activeCatStr.includes("painting")) {
        dataList = dataList.filter(item => item.name.toLowerCase().includes("paint"));
      } else if (activeCatStr.includes("cat-6") || activeCatStr.includes("cleaning") || activeCatStr.includes("house")) {
        dataList = dataList.filter(item => item.name.toLowerCase().includes("clean") || item.name.toLowerCase().includes("wash"));
      } else if (activeCatStr.includes("cat-7") || activeCatStr.includes("gadget")) {
        dataList = dataList.filter(item => item.name.toLowerCase().includes("appliance") || item.name.toLowerCase().includes("electr"));
      } else if (activeCatStr.includes("cat-8") || activeCatStr.includes("emergency")) {
        dataList = dataList.filter(item => item.name.toLowerCase().includes("emergency") || item.name.toLowerCase().includes("plumb"));
      }
      if (dataList.length === 0) {
        dataList = MOCK_SERVICES.all || [];
      }
    }

    // Filter by search query if specified
    if (searchValue && searchValue !== "") {
      dataList = dataList.filter(item =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.store_name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (list_type === "item") {
      return {
        products: dataList,
        total_size: dataList.length,
        offset: 0,
        limit: page_limit || 12,
      };
    } else {
      const uniqueStoresMap = {};
      dataList.forEach(item => {
        const storeName = item.store_name || "Premium Service Provider";
        const storeId = (item.id || "service") + "-store";
        if (!uniqueStoresMap[storeName]) {
          uniqueStoresMap[storeName] = {
            id: storeId,
            name: storeName,
            logo: item.store?.logo_full_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120",
            logo_full_url: item.store?.logo_full_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120",
            cover_photo: item.image_full_url || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
            cover_photo_full_url: item.image_full_url || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
            avg_rating: item.avg_rating || 4.7,
            rating_count: 24,
            free_delivery: item.store?.free_delivery || false,
            active: true,
            module_type: "service",
            address: "123 Expert Way, Nearby City",
          };
        }
      });
      const stores = Object.values(uniqueStoresMap);
      return {
        stores: stores,
        total_size: stores.length,
        offset: 0,
        limit: page_limit || 12,
      };
    }
  }

  // Original behavior for all other modules
  const selectedCategoriesId =
    selectedCategoriesIds?.[0] !== "undefined" && selectedCategoriesIds?.length
      ? JSON.stringify(selectedCategoriesIds)
      : [];
  const selectedBrandId =
    selectedBrands?.[0] !== "undefined" && selectedBrands?.length
      ? JSON.stringify(selectedBrands)
      : [];

  const raw = {
    name: data_type === "searched" ? searchValue : "",
    offset: pageParam ?? offset ?? 0,
    data_type,
    list_type: currentTab === 0 ? "item" : "store",
    limit: page_limit ?? 12,
    category_ids:
      category_ids ??
      (selectedCategoriesId.length ? selectedCategoriesId : undefined),
    brand_ids: selectedBrandId.length ? selectedBrandId : undefined,
    sort_by,
    min_price: price_min,
    max_price: price_max,
    rating_count: rating,
    type,
    quick_action,
  };

  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(raw).filter(
        ([, v]) => v !== undefined && v !== null && v !== "",
      ),
    ),
  );
  const guestId = getGuestId();

  const { data } = await MainApi.get(
    `${get_search_page_data}?${query.toString()}`,
    {
      headers: guestId ? { guestId: guestId } : {},
    },
  );
  return data;
};

export default function useGetSearchPageData(
  pageParams,
  handleSuccess,
  enabled = false,
) {
  return useInfiniteQuery(
    ["search-products", getCurrentModuleType(), pageParams],
    ({ pageParam = 1 }) => getSearch({ ...pageParams, pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return (pageParams?.currentTab === 1
          ? lastPage?.stores?.length
          : lastPage?.products?.length) > 0
          ? nextPage
          : undefined;
      },
      getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
      retry: 1,
      enabled,
      onError: onSingleErrorResponse,
      onSuccess: handleSuccess,
    },
  );
}
