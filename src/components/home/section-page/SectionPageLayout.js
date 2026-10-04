import {
  Box,
  CircularProgress,
  Grid,
  Skeleton,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import NewProductCard from "components/cards/newCard/NewProductCard";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import SearchResultStoreCard from "components/cards/newCard/SearchResultStoreCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import FoodSearchFilterDrawer from "components/home/search/FoodSearchFilterDrawer";
import ModuleSearchBanner from "components/home/module-wise-components/shared/ModuleSearchBanner";
import SectionSearchBar from "components/home/module-wise-components/shared/SectionSearchBar";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import SectionMobileActionBar from "./SectionMobileActionBar";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { useInView } from "react-intersection-observer";

const TAB_ALL = "all";
const TAB_ITEMS = "items";
const TAB_STORES = "stores";

// ─── Empty state (matches category page) ────────────────────────────────────
const SearchEmptyState = ({ label }) => {
  const { t } = useTranslation();
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={0.5}
      sx={{ py: { xs: 1.5, md: 2.5 }, width: "100%" }}
    >
      <Box
        component="img"
        src="/static/nodata.png"
        alt=""
        sx={{
          width: { xs: 32, md: 44 },
          height: { xs: 32, md: 44 },
          objectFit: "contain",
          opacity: 0.5,
        }}
      />
      <Typography
        sx={{
          fontSize: { xs: "13px", md: "14px" },
          fontWeight: 500,
          color: "neutral.500",
          textAlign: "center",
        }}
      >
        {t(label ?? "No results found")}
      </Typography>
    </Stack>
  );
};

// ─── Filter pill ──────────────────────────────────────────────────────────────

const FilterPill = ({ label, active, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      height: { xs: "26px", md: "36px" },
      px: active ? { xs: "12px", md: "16px" } : { xs: "8px", md: "16px" },
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      backgroundColor: active
        ? "primary.main"
        : { xs: "transparent", md: "background.secondary" },
      userSelect: "none",
      transition: "background-color 0.15s",
    }}
  >
    <Typography
      sx={{
        fontSize: { xs: "12px", md: "14px" },
        fontWeight: 600,
        color: active ? "#fff" : "neutral.1050",
        letterSpacing: "-0.42px",
        lineHeight: 1.2,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Typography>
  </Box>
);

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-track": { marginLeft: 0, marginRight: "auto" },
  "& .slick-slide": { paddingRight: "20px" },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

const SectionTitle = ({ children }) => (
  <Typography
    sx={{
      fontSize: { xs: "18px", md: "24px" },
      fontWeight: 700,
      color: "neutral.1050",
      letterSpacing: "-1.2px",
      lineHeight: 1.1,
    }}
  >
    {children}
  </Typography>
);

// ── Items slider (All tab) ────────────────────────────────────────────────────
const ItemsSlider = ({ items, isLoading, label, t }) => {
  const isSmall = useMediaQuery("(max-width:900px)");
  const sliderRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1450, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 760, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2.6 } },
      { breakpoint: 400, settings: { slidesToShow: 2.2 } },
      { breakpoint: 340, settings: { slidesToShow: 2 } },
    ],
  };
  return (
    <Stack spacing={2} sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: 0, md: 0 } }}>
      <SliderSectionHeader
        sliderRef={sliderRef}
        currentSlide={current}
        totalSlides={items.length}
        slidesToShow={5}
        heading={<SectionTitle>{label}</SectionTitle>}
      />
      <SliderWrapper>
        {isLoading ? (
          <Slider {...settings}>
            {[...Array(5)].map((_, i) => (
              <ProductCardSimmer key={i} cardWidth={{ xs: "140px" }} />
            ))}
          </Slider>
        ) : items.length > 0 ? (
          <Slider {...settings} ref={sliderRef} afterChange={setCurrent}>
            {items.map((item) => (
              <div key={item?.id}>
                <NewProductCard
                  variant="vertical"
                  item={item}
                  cardWidth={isSmall ? "140px" : undefined}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <SearchEmptyState label="No results found" />
        )}
      </SliderWrapper>
    </Stack>
  );
};

// ── Stores slider (All tab) ───────────────────────────────────────────────────
const StoresSlider = ({ stores, isLoading, label, t }) => {
  const sliderRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.8,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1.5 } },
      { breakpoint: 480, settings: { slidesToShow: 1.1 } },
      { breakpoint: 400, settings: { slidesToShow: 1 } },
    ],
  };
  return (
    <Stack spacing={2} sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: 0, md: 0 } }}>
      <SliderSectionHeader
        sliderRef={sliderRef}
        currentSlide={current}
        totalSlides={stores.length}
        slidesToShow={2.8}
        heading={<SectionTitle>{label}</SectionTitle>}
      />
      <SliderWrapper>
        {isLoading ? (
          <Slider {...settings}>
            {[...Array(3)].map((_, i) => (
              <Box key={i} sx={{ pr: "20px" }}>
                <NewStoreCardSkeleton />
              </Box>
            ))}
          </Slider>
        ) : stores.length > 0 ? (
          <Slider {...settings} ref={sliderRef} afterChange={setCurrent}>
            {stores.map((store) => (
              <div key={store?.id}>
                <SearchResultStoreCard
                  showAdBadge={store?.ad}
                  store={store}
                  items={store?.top_items}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <SearchEmptyState label="No results found" />
        )}
      </SliderWrapper>
    </Stack>
  );
};

// ── Items grid (Items tab) ────────────────────────────────────────────────────
const ItemsGrid = ({
  items,
  isLoading,
  label,
  t,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}) => {
  const isSmall = useMediaQuery("(max-width:900px)");
  const { ref, inView } = useInView({ rootMargin: "0px 0px 200px 0px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage?.();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Stack
      spacing={2}
      sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: "20px", md: 0 } }}
    >
      <SectionTitle>{label}</SectionTitle>
      <Box sx={{ overflow: "hidden" }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
          {isLoading
            ? [...Array(10)].map((_, i) => (
                <Grid key={i} item xs={6} sm={4} md={3} lg={2.4}>
                  <ProductCardSimmer cardWidth="100%" />
                </Grid>
              ))
            : items.map((item) => (
                <Grid key={item?.id} item xs={6} sm={4} md={3} lg={2.4}>
                  <NewProductCard
                    variant="vertical"
                    item={item}
                    cardWidth={isSmall ? "100%" : undefined}
                  />
                </Grid>
              ))}
        </Grid>
        {!isLoading && items.length === 0 && (
          <SearchEmptyState label="No results found" />
        )}
      </Box>
      {/* Sentinel — triggers next page fetch when scrolled into view */}
      <Box ref={ref} sx={{ height: "10px" }} />
      {isFetchingNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Stack>
  );
};

// ── Stores grid (Stores tab) ──────────────────────────────────────────────────
const StoresGrid = ({
  stores,
  isLoading,
  label,
  t,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}) => {
  const { ref, inView } = useInView({ rootMargin: "0px 0px 200px 0px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage?.();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Stack
      spacing={2}
      sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: "20px", md: 0 } }}
    >
      <SectionTitle>{label}</SectionTitle>
      <Box sx={{ overflow: "hidden" }}>
        <Grid container spacing={3}>
          {isLoading
            ? [...Array(6)].map((_, i) => (
                <Grid key={i} item xs={12} sm={6} md={4}>
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height={200}
                    sx={{ borderRadius: "12px" }}
                  />
                </Grid>
              ))
            : stores.map((store) => (
                <Grid key={store?.id} item xs={12} sm={6} md={4}>
                  <Box sx={{ "& > *": { width: "100% !important" } }}>
                    <NewStoreCard
                      variant="normal"
                      item={store}
                      imageUrl={
                        store?.cover_photo_full_url || store?.logo_full_url
                      }
                    />
                  </Box>
                </Grid>
              ))}
        </Grid>
        {!isLoading && stores.length === 0 && (
          <SearchEmptyState label="No results found" />
        )}
      </Box>
      {/* Sentinel — triggers next page fetch when scrolled into view */}
      <Box ref={ref} sx={{ height: "10px" }} />
      {isFetchingNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Stack>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

/**
 * Shared layout for all section pages (offers, express-delivery, nearby, top-rated, …).
 *
 * @param {Object} props
 * @param {string}   props.sectionLabel        - Breadcrumb label e.g. "Offers"
 * @param {string}   props.bannerTitle         - Search banner heading
 * @param {string}   props.searchPlaceholder
 * @param {Array}    props.items               - Flat item array (all pages merged)
 * @param {Array}    props.stores              - Flat store array (all pages merged)
 * @param {boolean}  props.itemsLoading
 * @param {boolean}  props.storesLoading
 * @param {boolean}  props.itemsFetchingNext
 * @param {boolean}  props.storesFetchingNext
 * @param {boolean}  props.itemsHasNext
 * @param {boolean}  props.storesHasNext
 * @param {Function} props.fetchNextItems
 * @param {Function} props.fetchNextStores
 * @param {Function} props.onFilterChange      - Called with { search, sort_by, price_min, price_max, rating }
 * @param {Function} props.onTabChange         - Called with "all" | "items" | "stores"
 * @param {string}   props.activeTab
 */
const SectionPageLayout = ({
  sectionLabel,
  bannerTitle,
  searchPlaceholder,
  items = [],
  stores = [],
  itemsLoading = false,
  storesLoading = false,
  itemsFetchingNext = false,
  storesFetchingNext = false,
  itemsHasNext = false,
  storesHasNext = false,
  fetchNextItems,
  fetchNextStores,
  onFilterChange,
  onTabChange,
  activeTab = TAB_ALL,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const moduleType = getCurrentModuleType();
  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [appliedFilterCount, setAppliedFilterCount] = useState(0);
  const [filterParams, setFilterParams] = useState({});
  const [mobileSearch, setMobileSearch] = useState(
    typeof router.query.q === "string" ? router.query.q : "",
  );

  const commitMobileSearch = (val) => {
    const trimmed = val.trim();
    const { q: _removed, ...rest } = router.query;
    const nextQuery = trimmed ? { ...rest, q: trimmed } : rest;
    router.push({ pathname: router.pathname, query: nextQuery }, undefined, {
      shallow: true,
    });
  };

  const { data: categoriesResponse } = useGetCategories();
  const categories = categoriesResponse?.data ?? [];

  const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";
  const breadcrumbItems = [
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
    { key: "section", label: t(sectionLabel) },
  ];

  const itemsLabel =
    moduleType === "food"
      ? t("Foods")
      : moduleType === "pharmacy"
      ? t("Medicines")
      : moduleType === "ecommerce"
      ? t("Items")
      : t("Groceries");
  const storesLabel = moduleType === "food" ? t("Restaurants") : t("Stores");

  const handleTabChange = (tab) => {
    onTabChange?.(tab);
  };

  const handleFilterApply = (filters) => {
    const count = Object.keys(filters).length;
    setFilterParams(filters);
    setAppliedFilterCount(count);
    onFilterChange?.(filters);
  };

  const showItems = activeTab === TAB_ALL || activeTab === TAB_ITEMS;
  const showStores = activeTab === TAB_ALL || activeTab === TAB_STORES;

  return (
    <Stack spacing={2}>
      {/* Mobile search + filter bar */}
      <SectionMobileActionBar
        searchValue={mobileSearch}
        onSearchChange={setMobileSearch}
        onSearchCommit={commitMobileSearch}
        onFilterOpen={() => setFilterAnchorEl(document.body)}
        filterCount={appliedFilterCount}
      />

      {/* Mobile-only: breadcrumb + tabs on same row */}
      <Stack
        direction="row"
        alignItems="center"
        gap="8px"
        sx={{
          display: { xs: "flex", md: "none" },
          flexWrap: "nowrap",
          px: "16px",
          py: "8px",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <CustomPageBreadCrumb items={breadcrumbItems} />
        </Box>
        <Stack
          direction="row"
          gap="2px"
          alignItems="center"
          flexShrink={0}
          sx={{ flexWrap: "nowrap" }}
        >
          <FilterPill
            label={t("All")}
            active={activeTab === TAB_ALL}
            onClick={() => handleTabChange(TAB_ALL)}
          />
          <FilterPill
            label={itemsLabel}
            active={activeTab === TAB_ITEMS}
            onClick={() => handleTabChange(TAB_ITEMS)}
          />
          <FilterPill
            label={storesLabel}
            active={activeTab === TAB_STORES}
            onClick={() => handleTabChange(TAB_STORES)}
          />
        </Stack>
      </Stack>

      {/* Search banner — desktop only */}
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

      {/* Filter bar — desktop only */}
      <Stack
        direction="row"
        alignItems="center"
        gap={{ xs: "8px", md: "12px" }}
        sx={{
          flexWrap: "nowrap",
          display: { xs: "none", md: "flex" },
          py: { md: "12px" },
          position: { md: "sticky" },
          top: { md: "63px" },
          zIndex: { md: 10 },
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <CustomPageBreadCrumb items={breadcrumbItems} />
        </Box>

        <Stack direction="row" gap="8px" alignItems="center" flexShrink={0}>
          <FilterPill
            label={t("All")}
            active={activeTab === TAB_ALL}
            onClick={() => handleTabChange(TAB_ALL)}
          />
          <FilterPill
            label={itemsLabel}
            active={activeTab === TAB_ITEMS}
            onClick={() => handleTabChange(TAB_ITEMS)}
          />
          <FilterPill
            label={storesLabel}
            active={activeTab === TAB_STORES}
            onClick={() => handleTabChange(TAB_STORES)}
          />
        </Stack>

        <Box
          onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          sx={{
            position: "relative",
            width: 36,
            height: 36,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.secondary",
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: "8px",
            cursor: "pointer",
            flexShrink: 0,
            "&:hover": { opacity: 0.7 },
          }}
        >
          <i
            className="fi fi-ss-sliders-v"
            style={{ fontSize: "16px", lineHeight: 1, display: "flex" }}
          />
          {appliedFilterCount > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                minWidth: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: "neutral.1050",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: "4px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1,
                }}
              >
                {appliedFilterCount}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>

      {/* Results */}
      <Stack spacing={3} sx={{ pb: 4 }}>
        {activeTab === TAB_ALL && (
          <>
            <ItemsSlider
              items={items}
              isLoading={itemsLoading}
              label={itemsLabel}
              t={t}
            />
            <StoresSlider
              stores={stores}
              isLoading={storesLoading}
              label={storesLabel}
              t={t}
            />
          </>
        )}
        {activeTab === TAB_ITEMS && (
          <ItemsGrid
            items={items}
            isLoading={itemsLoading}
            label={itemsLabel}
            t={t}
            fetchNextPage={fetchNextItems}
            isFetchingNextPage={itemsFetchingNext}
            hasNextPage={itemsHasNext}
          />
        )}
        {activeTab === TAB_STORES && (
          <StoresGrid
            stores={stores}
            isLoading={storesLoading}
            label={storesLabel}
            t={t}
            fetchNextPage={fetchNextStores}
            isFetchingNextPage={storesFetchingNext}
            hasNextPage={storesHasNext}
          />
        )}
      </Stack>

      <FoodSearchFilterDrawer
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        onApply={handleFilterApply}
        filterValue={filterParams}
        showFilterBy={true}
        showQuickAction={false}
        categories={categories}
      />
    </Stack>
  );
};

export default SectionPageLayout;
