import {
  alpha,
  Box,
  Grid,
  InputBase,
  NoSsr,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import useGetStoreCategoriesItems from "api-manage/hooks/react-query/stores-categories/useGetStoreCategoriesItems";
import useGetSearchPageData from "api-manage/hooks/react-query/search/useGetSearchPageData";
import { CardWrapper } from "components/cards/ProductCard";
import NewProductCard from "components/cards/newCard/NewProductCard";
import CustomEmptyResult from "components/custom-empty-result";
import { getModuleId } from "helper-functions/getModuleId";
import { useRouter } from "next/router";
import notFoundImage from "public/static/empty.png";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CategoryTabs from "./CategoryTabs";
import { ACTION, initialState, reducer } from "./states";

import SearchIcon from "@mui/icons-material/Search";
import DotSpin from "components/DotSpin";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import StoreFilter from "components/store-details/middle-section/StoreFilter";
import { normalizeItemsResponse } from "components/store-details/middle-section";
import { getDiscountedAmount } from "helper-functions/CardHelpers";
import { useInView } from "react-intersection-observer";
import { removeDuplicates } from "utils/CustomFunctions";

export const handleShimmerProducts = () => {
  return (
    <>
      {[...Array(3)].map((item, index) => {
        return (
          <Grid item key={index} xs={6} sm={4} md={3} lg={3}>
            <CardWrapper>
              <CustomStackFullWidth
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <Skeleton
                  variant="rectangular"
                  animation="pulse"
                  width="100%"
                  height={170}
                />
                <CustomStackFullWidth
                  padding="1rem"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={20}
                    width="80%"
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={20}
                    width="40%"
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    height={20}
                    width="30%"
                  />
                  {/*<RatingStarIcon fontSize="small" color="#808080" />*/}
                  <Stack direction="row" spacing={2}>
                    <Skeleton
                      variant="text"
                      animation="wave"
                      width={70}
                      height={20}
                    />

                    <Skeleton
                      variant="text"
                      animation="wave"
                      width={70}
                      height={20}
                    />
                  </Stack>
                </CustomStackFullWidth>
              </CustomStackFullWidth>
            </CardWrapper>
          </Grid>
        );
      })}
    </>
  );
};

export const getDiscountedPriceAmount = (item) => {
  return getDiscountedAmount(
    item?.base_price ?? item?.price,
    item?.discount,
    item?.discount_type,
    item?.store_discount,
    item?.quantity,
  );
};

export const getHighToLow = (data) => {
  if (data?.length > 0) {
    return [...data].sort(
      (a, b) => getDiscountedPriceAmount(b) - getDiscountedPriceAmount(a),
    );
  } else {
    return data;
  }
};
// Sort products by low to high value
export const getLowToHigh = (data) => {
  if (data?.length > 0) {
    return [...data].sort(
      (a, b) => getDiscountedPriceAmount(a) - getDiscountedPriceAmount(b),
    );
  } else {
    return data;
  }
};
const MiddleSection = (props) => {
  const {
    providerDetails,
    ownCategories,
    isSmall,
    storeShare,
    setExpanded,
    condensedHeaderVisible,
  } = props;
  const theme = useTheme();
  const isSmallSize = useMediaQuery(theme.breakpoints.down("sm"));
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filterData, setFilterData] = useState([]);
  const [ratingCount, setRatingCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const { t } = useTranslation();
  const { configData } = useSelector((state) => state.configData);
  const router = useRouter();
  const { id } = router.query;
  const storeId = providerDetails?.id;

  const popularSliderRef = useRef(null);
  const [popularCurrentSlide, setPopularCurrentSlide] = useState(0);
  const sectionRefs = useRef({});
  const [selectedCategoryTabId, setSelectedCategoryTabId] = useState(null);

  const stickySentinelRef = useRef(null);
  const [isToolbarStuck, setIsToolbarStuck] = useState(false);
  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsToolbarStuck(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const programmaticScrollRef = useRef(false);
  const programmaticScrollTimeoutRef = useRef(null);

  const categoryListRef = useRef([]);
  useEffect(() => {
    categoryListRef.current = categoryList;
  }, [categoryList]);

  const handleSelectCategoryTab = (categoryId) => {
    const key = categoryId == null ? "popular" : categoryId;
    setSelectedCategoryTabId(categoryId);
    const node = sectionRefs.current[key];
    if (node) {
      const offset = 190;
      const top = node.getBoundingClientRect().top + window.scrollY - offset;
      programmaticScrollRef.current = true;
      if (programmaticScrollTimeoutRef.current) {
        clearTimeout(programmaticScrollTimeoutRef.current);
      }
      window.scrollTo({ top, behavior: "smooth" });
      programmaticScrollTimeoutRef.current = setTimeout(() => {
        programmaticScrollRef.current = false;
      }, 800);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const computeActiveKey = () => {
      if (programmaticScrollRef.current) return;
      const refs = sectionRefs.current || {};
      const sorted = Object.entries(refs)
        .filter(([, el]) => el && el.isConnected)
        .map(([key, el]) => ({
          key,
          top: el.getBoundingClientRect().top,
        }))
        .sort((a, b) => a.top - b.top);
      if (sorted.length === 0) return;

      const activeLine = 220;
      let activeKey = sorted[0].key;
      for (const entry of sorted) {
        if (entry.top - activeLine <= 0) {
          activeKey = entry.key;
        } else {
          break;
        }
      }

      const scrollEl = document.scrollingElement || document.documentElement;
      const scrollY = window.scrollY ?? scrollEl.scrollTop;
      const nearBottom =
        window.innerHeight + scrollY >= scrollEl.scrollHeight - 4;
      if (nearBottom) {
        activeKey = sorted[sorted.length - 1].key;
      }

      let nextId = null;
      if (activeKey !== "popular") {
        const match = (categoryListRef.current || []).find(
          (c) => String(c?.id) === activeKey,
        );
        nextId = match?.id ?? activeKey;
      }
      setSelectedCategoryTabId((prev) => (prev === nextId ? prev : nextId));
    };

    let rafId = null;
    const onScroll = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        computeActiveKey();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", onScroll);

    computeActiveKey();
    const t1 = setTimeout(computeActiveKey, 200);
    const t2 = setTimeout(computeActiveKey, 800);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      clearTimeout(t1);
      clearTimeout(t2);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (programmaticScrollTimeoutRef.current) {
        clearTimeout(programmaticScrollTimeoutRef.current);
      }
    };
  }, []);

  const SORT_MAP = { high: "price_high_low", low: "price_low_high" };
  const hasPriceFilter = state.minMax?.[0] !== 0 || state.minMax?.[1] !== 1;
  const { data: recommendedData } = useGetSearchPageData(
    {
      offset: 1,
      currentTab: 0,
      page_limit: 50,
      quick_action: "popular",
      store_id: storeId,
      type: state.type && state.type !== "all" ? state.type : undefined,
      price_min: hasPriceFilter ? state.minMax[0] : undefined,
      price_max: hasPriceFilter ? state.minMax[1] : undefined,
      rating: ratingCount || undefined,
      sort_by:
        state.sortBy && state.sortBy !== "Default"
          ? SORT_MAP[state.sortBy] || state.sortBy
          : undefined,
      data_type: state.searchKey ? "searched" : undefined,
      searchValue: state.searchKey || undefined,
    },
    () => {},
    Boolean(storeId),
  );
  const recommendedItems = recommendedData?.pages?.[0]?.products ?? [];

  const limit = 12;
  const { ref, inView } = useInView();
  const [offset, setOffset] = useState(1);
  const pageParams = {
    storeId: storeId,
    categoryId: state.categoryId,
    offset: offset,
    minMax: state.minMax,
    type: state.type,
    limit: limit,
    filterData: filterData,
    ratingCount: ratingCount,
    sortBy: state.sortBy,
    search: state.searchKey || undefined,
    ...storeShare,
  };
  const handleLocalStorageSave = (resProducts) => {
    if (offset === 1) {
      let visitedStoresProducts = JSON.parse(
        localStorage.getItem("visitedStoresProducts"),
      );
      if (visitedStoresProducts) {
        if (visitedStoresProducts?.length > 0) {
          const isThisStoresProductExist = visitedStoresProducts?.filter(
            (item) => item?.store_id === providerDetails?.id,
          );
          if (isThisStoresProductExist?.length > 0) {
            return null;
          } else {
            resProducts
              ?.slice(0, 5)
              ?.forEach((item) => visitedStoresProducts.push(item));
          }
          localStorage.setItem(
            "visitedStoresProducts",
            JSON.stringify(visitedStoresProducts),
          );
        }
      } else {
        const products =
          resProducts?.length > 5 ? resProducts?.slice(0, 5) : resProducts;
        localStorage.setItem("visitedStoresProducts", JSON.stringify(products));
      }
    }
  };

  // Union two categoryWiseItemIds maps (bucket id -> item id[]) across pages,
  // de-duping ids within each bucket. Mirrors the `products` accumulation
  // below so the store_category -> items mapping stays correct as more
  // pages load.
  const mergeCategoryWiseItemIds = (prevMap, nextMap) => {
    if (!nextMap) return prevMap;
    const merged = { ...(prevMap || {}) };
    Object.entries(nextMap).forEach(([bucketId, ids]) => {
      const combined = new Set([...(merged[bucketId] || []), ...(ids || [])]);
      merged[bucketId] = Array.from(combined);
    });
    return merged;
  };

  const handleSuccess = (res) => {
    if (res) {
      const normalizedProducts = normalizeItemsResponse(res);
      if (normalizedProducts.length > 0) {
        handleLocalStorageSave(normalizedProducts);
      }
      const backendOrdered = normalizedProducts;

      if (offset > 1) {
        if (state?.data) {
          if (backendOrdered.length > 0) {
            const newArray = [...state?.data?.products, ...backendOrdered];
            const withoutDuplicacy = removeDuplicates(newArray, "id");
            dispatch({
              type: ACTION.setData,
              payload: {
                ...res,
                products: withoutDuplicacy,
                categoryWiseItemIds: mergeCategoryWiseItemIds(
                  state?.data?.categoryWiseItemIds,
                  res?.categoryWiseItemIds,
                ),
              },
            });
          }
        } else {
          dispatch({
            type: ACTION.setData,
            payload: { ...res, products: backendOrdered },
          });
        }
        dispatch({ type: ACTION.setIsSidebarOpen, payload: false });
      } else {
        if (state?.data) {
          if (backendOrdered.length > 0) {
            const newArray = [...backendOrdered];
            const withoutDuplicacy = removeDuplicates(newArray, "id");
            dispatch({
              type: ACTION.setData,
              payload: { ...res, products: withoutDuplicacy },
            });
          } else {
            dispatch({
              type: ACTION.setData,
              payload: { ...res, products: backendOrdered },
            });
          }
        } else {
          dispatch({
            type: ACTION.setData,
            payload: { ...res, products: backendOrdered },
          });
        }
        dispatch({ type: ACTION.setIsSidebarOpen, payload: false });
      }
    }
  };
  const {
    data,
    refetch,
    isRefetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingStoresCategories,
    isFetchingNextPage,
  } = useGetStoreCategoriesItems(pageParams);

  const categoriesLoading = isLoading;

  useEffect(() => {
    const firstPageCategories = data?.pages?.[0]?.categories;
    if (Array.isArray(firstPageCategories) && firstPageCategories.length > 0) {
      setCategoryList(firstPageCategories);
    }
  }, [data]);
  useEffect(() => {
    refetch();
  }, [
    state.categoryId,
    state.type,
    state.sortBy,
    id,
    pageParams?.filterData,
    ratingCount,
    state.searchKey,
  ]);
  useEffect(() => {
    if (data?.pages?.length > 0) {
      data?.pages?.forEach((item) => {
        handleSuccess(item);
      });
    }
  }, [data, state.categoryId]);

  useEffect(() => {
    setOffset(1);
  }, [storeId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(1);
      dispatch({ type: ACTION.setOffSet, payload: 1 });
      if (inputValue && inputValue !== "") {
        dispatch({ type: ACTION.setSearchKey, payload: inputValue });
      } else {
        dispatch({ type: ACTION.setSearchKey, payload: null });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    if (inView && limit < data?.pages[0]?.total_size) {
      if (!isLoadingStoresCategories) {
        dispatch({ type: ACTION.setOffSet, payload: 1 });
        setOffset((prev) => prev + 1);
      }
    }
  }, [inView]);

  const handleCategoryId = (id) => {
    setOffset(1);
    if (id?.checked) {
      const newIds = [...state.categoryId, id?.id];
      dispatch({
        type: ACTION.setCategoryId,
        payload: [...new Set(newIds)],
      });
    } else {
      const newIds = state.categoryId?.filter((item) => item !== id?.id);
      dispatch({
        type: ACTION.setCategoryId,
        payload: newIds,
      });
    }
    dispatch({ type: ACTION.setIsSidebarOpen, payload: false });
  };

  useEffect(() => {
    if (offset === 1) {
      refetch();
    } else {
      fetchNextPage();
    }
  }, [state.searchKey, offset]);
  useEffect(() => {
    if (JSON.stringify(state.minMax) !== JSON.stringify([0, 1])) {
      refetch();
    }
  }, [state.minMax]);

  const handleChangePrice = (value) => {
    dispatch({ type: ACTION.setMinMax, payload: value });
    setOffset(1);
  };
  const parsedQueryModuleId = parseInt(
    router.query.module || router.query.module_id,
    10,
  );
  const moduleId =
    getModuleId() ??
    (Number.isFinite(parsedQueryModuleId) ? parsedQueryModuleId : undefined);
  const handleSearchResult = (value) => {
    setInputValue(value ?? "");
    setOffset(1);
    dispatch({ type: ACTION.setOffSet, payload: 1 });
    if (value && value !== "") {
      dispatch({ type: ACTION.setSearchKey, payload: value });
      dispatch({ type: ACTION.setMinMax, payload: [0, 1] });
    } else {
      dispatch({ type: ACTION.setSearchKey, payload: null });
    }
  };

  const handleSortBy = (value) => {
    dispatch({
      type: ACTION.setSortBy,
      payload: value,
    });
    dispatch({ type: ACTION.setIsSidebarOpen, payload: false });
  };

  const handleOpenSerach = () => {
    setOpen(!open);
  };
  if (inView) {
    setExpanded(false);
  }

  const handleSetType = (value) => {
    setOffset(1);
    dispatch({ type: ACTION.setType, payload: value });
  };
  return (
    <NoSsr>
      <CustomStackFullWidth>
        {Boolean(moduleId) && (
          <Grid container gap={{ xs: 0, md: 0 }} sx={{ position: "relative" }}>
            <Box
              ref={stickySentinelRef}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                height: 1,
                width: "100%",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            />
            <Grid
              item
              xs={12}
              sx={{
                position: "sticky",
                top: { xs: condensedHeaderVisible ? 46 : 0, md: 63 },
                zIndex: "199",
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                alignItems={{ xs: "stretch", md: "center" }}
                spacing={{ xs: 1, md: 2 }}
                sx={{
                  py: { xs: 1, md: 1.25 },
                  px: { xs: 1, md: 0 },
                  mx: { xs: -1, md: 0 },
                  backgroundColor: (theme) => theme.palette.background.default,
                  boxShadow: isToolbarStuck
                    ? (theme) =>
                        `0 6px 12px ${alpha(theme.palette.text.primary, 0.08)}`
                    : "none",
                  transition: "box-shadow 200ms ease",
                }}
              >
                <Box
                  sx={{
                    order: { xs: 2, md: 1 },
                    flex: { md: 1 },
                    minWidth: 0,
                    pt: { xs: 2, md: 0 },
                    pb: { xs: 2, md: 0 },
                  }}
                >
                  <CategoryTabs
                    categories={categoryList}
                    selectedId={selectedCategoryTabId}
                    onSelect={handleSelectCategoryTab}
                    isLoading={categoriesLoading && categoryList.length === 0}
                    showAllTab={recommendedItems.length > 0}
                  />
                </Box>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    flexShrink: 0,
                    order: { xs: 1, md: 2 },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: "100%", sm: 200 },
                      flex: { xs: 1, sm: "0 0 auto" },
                      height: 40,
                      borderRadius: "8px",
                      backgroundColor: "background.paper",
                      border: (t) => `1px solid ${t.palette.divider}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 1.5,
                      transition:
                        "border-color 120ms ease, box-shadow 120ms ease",
                      "&:focus-within": {
                        borderColor: (t) => t.palette.primary.main,
                        boxShadow: (t) =>
                          `0 0 0 3px ${alpha(t.palette.primary.main, 0.12)}`,
                      },
                    }}
                  >
                    <SearchIcon
                      sx={{
                        fontSize: 16,
                        color: (t) =>
                          t.palette.neutral?.[500] || t.palette.text.secondary,
                      }}
                    />
                    <InputBase
                      placeholder={t("Search from here")}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearchResult(inputValue);
                        }
                      }}
                      sx={{
                        flex: 1,
                        fontSize: 14,
                        lineHeight: 1.3,
                        color: (t) => t.palette.text.primary,
                        "& input::placeholder": {
                          color: (t) => t.palette.neutral?.[400] || "#A3A3A3",
                          opacity: 1,
                        },
                      }}
                    />
                  </Box>
                  <StoreFilter
                    key={storeId}
                    setRatingCount={setRatingCount}
                    ratingCount={ratingCount}
                    setFilterData={setFilterData}
                    minMax={state.minMax}
                    setMinMax={handleChangePrice}
                    sortBy={state.sortBy}
                    setSortBy={handleSortBy}
                    type={state.type}
                    setType={handleSetType}
                  />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} sx={{ position: "relative" }}>
              {(isRefetching || isFetchingNextPage) &&
                state.data?.products?.length > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 5,
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      pt: { xs: "30vh", md: "20vh" },
                      backgroundColor: (theme) =>
                        alpha(theme.palette.background.default, 0.55),
                      backdropFilter: "blur(2px)",
                      borderRadius: 1,
                    }}
                  >
                    <DotSpin />
                  </Box>
                )}
              {isLoading && !state.data?.products?.length ? (
                <Grid container spacing={2}>
                  {handleShimmerProducts()}
                </Grid>
              ) : state.data?.products?.length === 0 && !isRefetching ? (
                <Stack width="100%" paddingTop={{ xs: "0px", md: "30px" }}>
                  <CustomEmptyResult
                    image={notFoundImage}
                    label={t("Nothing found")}
                    width="200px"
                    height="200px"
                  />
                </Stack>
              ) : (
                (() => {
                  const allProducts = state.data?.products ?? [];
                  const categoryWiseItemIds = state.data?.categoryWiseItemIds;

                  const productsByCategory = {};
                  if (categoryWiseItemIds) {
                    // Authoritative grouping from the backend. Required when
                    // category_source is "store_category" — a provider's own
                    // custom categories have their own id space, distinct from
                    // each item's admin category_id/category_ids, so grouping
                    // by the item's own category fields would look up the
                    // wrong bucket entirely.
                    const productsById = new Map(
                      allProducts.map((p) => [String(p?.id), p]),
                    );
                    Object.entries(categoryWiseItemIds).forEach(
                      ([bucketId, itemIds]) => {
                        productsByCategory[bucketId] = (itemIds || [])
                          .map((itemId) => productsById.get(String(itemId)))
                          .filter(Boolean);
                      },
                    );
                  } else {
                    allProducts.forEach((p) => {
                      const ids = new Set();
                      (p?.category_ids || []).forEach((c) => {
                        const id = c?.id ?? c;
                        if (id != null) ids.add(String(id));
                      });
                      if (ids.size === 0 && p?.category_id != null) {
                        ids.add(String(p.category_id));
                      }
                      ids.forEach((id) => {
                        if (!productsByCategory[id])
                          productsByCategory[id] = [];
                        productsByCategory[id].push(p);
                      });
                    });
                  }

                  const sortItems = (items) => {
                    if (state.sortBy === "high")
                      return getHighToLow([...items]);
                    if (state.sortBy === "low") return getLowToHigh([...items]);
                    return items;
                  };

                  const popularSource = recommendedItems;

                  const sections = [
                    {
                      key: "popular",
                      title: t("Most Popular"),
                      items: sortItems(popularSource),
                    },
                    ...categoryList.map((cat) => ({
                      key: String(cat?.id),
                      title: cat?.name,
                      items: sortItems(
                        productsByCategory[String(cat?.id)] || [],
                      ),
                    })),
                  ].filter((s) => s.items?.length > 0);

                  const popularSliderSettings = {
                    dots: false,
                    arrows: false,
                    infinite: false,
                    speed: 400,
                    slidesToShow: 4.5,
                    slidesToScroll: 4,
                    swipeToSlide: true,
                    responsive: [
                      {
                        breakpoint: 1200,
                        settings: { slidesToShow: 3.2, slidesToScroll: 3 },
                      },
                      {
                        breakpoint: 900,
                        settings: { slidesToShow: 2.5, slidesToScroll: 2 },
                      },
                      {
                        breakpoint: 600,
                        settings: { slidesToShow: 2.8, slidesToScroll: 2 },
                      },
                      {
                        breakpoint: 500,
                        settings: { slidesToShow: 2.8, slidesToScroll: 2 },
                      },
                      {
                        breakpoint: 450,
                        settings: { slidesToShow: 2.3, slidesToScroll: 2 },
                      },
                      {
                        breakpoint: 400,
                        settings: { slidesToShow: 2.2, slidesToScroll: 1 },
                      },
                      {
                        breakpoint: 370,
                        settings: { slidesToShow: 2, slidesToScroll: 1 },
                      },
                      {
                        breakpoint: 340,
                        settings: { slidesToShow: 1.8, slidesToScroll: 1 },
                      },
                    ],
                  };

                  return (
                    <Stack spacing={{ xs: 2, md: 4 }}>
                      {sections.map((section) => {
                        return (
                          <Stack
                            key={section.key}
                            ref={(el) => {
                              sectionRefs.current[section.key] = el;
                            }}
                          >
                            <>
                              <SliderSectionHeader
                                sliderRef={popularSliderRef}
                                currentSlide={popularCurrentSlide}
                                totalSlides={section.items.length}
                                slidesToShow={
                                  popularSliderSettings.slidesToShow
                                }
                                sx={{ mb: 2, mt: { xs: "0rem", md: "1rem" } }}
                                heading={
                                  <Typography
                                    sx={{
                                      fontSize: { xs: "16px", md: "18px" },
                                      fontWeight: 700,
                                      lineHeight: 1.2,
                                      color: theme.palette.text.primary,
                                    }}
                                  >
                                    {section.title}
                                  </Typography>
                                }
                              />
                              <Box
                                sx={{
                                  position: "relative",
                                  "& .slick-list": {
                                    py: 0.5,
                                    overflow: "hidden",
                                    maskImage:
                                      "linear-gradient(to right, black 0, black 88%, transparent 100%)",
                                    WebkitMaskImage:
                                      "linear-gradient(to right, black 0, black 88%, transparent 100%)",
                                  },
                                  "& .slick-slide": { px: 0 },
                                  "& .slick-slide > div": { px: 1 },
                                  "& .slick-track": {
                                    display: "flex",
                                    alignItems: "stretch",
                                    ml: 0,
                                  },
                                }}
                              >
                                <Slider
                                  key={`popular-${state.sortBy}`}
                                  ref={popularSliderRef}
                                  afterChange={(i) => setPopularCurrentSlide(i)}
                                  {...popularSliderSettings}
                                >
                                  {section.items.map((item) => (
                                    <Box key={`${section.key}-${item?.id}`}>
                                      <NewProductCard
                                        item={item}
                                        variant="vertical"
                                        isStore
                                      />
                                    </Box>
                                  ))}
                                </Slider>
                              </Box>
                            </>
                          </Stack>
                        );
                      })}

                      {isFetchingNextPage && (
                        <Stack sx={{ minHeight: "8vh", mt: 1 }}>
                          <DotSpin />
                        </Stack>
                      )}

                      {hasNextPage && (
                        <CustomBoxFullWidth
                          ref={ref}
                          sx={{ height: "10px", mb: "2rem" }}
                        />
                      )}
                    </Stack>
                  );
                })()
              )}
            </Grid>
          </Grid>
        )}
      </CustomStackFullWidth>
    </NoSsr>
  );
};

export default React.memo(MiddleSection);
