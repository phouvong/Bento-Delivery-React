import React, { useEffect, useRef, useState } from "react";
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
import { useInView } from "react-intersection-observer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { useTranslation } from "react-i18next";
import NewProductCard from "components/cards/newCard/NewProductCard";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import SearchResultStoreCard from "components/cards/newCard/SearchResultStoreCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

// ─── Tab values ────────────────────────────────────────────────────────────
const TAB_ALL = "all";
const TAB_ITEMS = "items";
const TAB_STORES = "stores";

// ─── Empty state ───────────────────────────────────────────────────────────
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
          fontSize: { xs: "11px", md: "12px" },
          fontWeight: 400,
          color: "neutral.500",
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        {t(label)}
      </Typography>
    </Stack>
  );
};

// ─── Slider wrapper ────────────────────────────────────────────────────────
const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-track": { marginLeft: 0, marginRight: "auto" },
  "& .slick-slide": { paddingRight: "20px" },
  "& .slick-slide:first-child": { paddingLeft: 0 },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

// ─── Filter pill ───────────────────────────────────────────────────────────
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
      flexShrink: 0,
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

// ─── Section title ─────────────────────────────────────────────────────────
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

// ─── All-tab view (sliders only) ───────────────────────────────────────────
const AllResult = ({
  items,
  stores,
  itemsLabel,
  storesLabel,
  itemsLoading,
  storesLoading,
  showItems,
  showStores,
  theme,
  t,
}) => {
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [itemsCurrentSlide, setItemsCurrentSlide] = useState(0);
  const [storesCurrentSlide, setStoresCurrentSlide] = useState(0);
  const itemsSliderRef = useRef(null);
  const storesSliderRef = useRef(null);

  const itemsSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      { breakpoint: 1450, settings: { slidesToShow: 5, slidesToScroll: 2 , swipeToSlide: true} },
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 2 , swipeToSlide: true} },
      { breakpoint: 760, settings: { slidesToShow: 3, slidesToScroll: 2 , swipeToSlide: true} },
      { breakpoint: 480, settings: { slidesToShow: 2.6, slidesToScroll: 2 , swipeToSlide: true} },
      { breakpoint: 400, settings: { slidesToShow: 2.2, slidesToScroll: 2 , swipeToSlide: true} },
      { breakpoint: 340, settings: { slidesToShow: 2, slidesToScroll: 1 , swipeToSlide: true} },
    ],
  };

  const storesSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.8,
    slidesToScroll: 2,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 , swipeToSlide: true} },
      { breakpoint: 600, settings: { slidesToShow: 1.5, slidesToScroll: 2 , swipeToSlide: true} },
      { breakpoint: 480, settings: { slidesToShow: 1.1, slidesToScroll: 2 , swipeToSlide: true} },
      { breakpoint: 400, settings: { slidesToShow: 1, slidesToScroll: 1 , swipeToSlide: true} },
    ],
  };

  return (
    <>
      {showItems && (
        <Stack
          spacing={2}
          sx={{
            pb: { xs: "8px", md: 0 },
            pl: { xs: "20px", md: 0 },
            pr: { xs: 0, md: 0 },
          }}
        >
          <SliderSectionHeader
            sliderRef={itemsSliderRef}
            currentSlide={itemsCurrentSlide}
            totalSlides={items.length}
            slidesToShow={5}
            heading={<SectionTitle>{itemsLabel}</SectionTitle>}
          />
          <SliderWrapper>
            {itemsLoading ? (
              <Slider {...itemsSettings}>
                {[...Array(5)].map((_, i) => (
                  <ProductCardSimmer key={i} cardWidth={{ xs: "140px" }} />
                ))}
              </Slider>
            ) : items.length > 0 ? (
              <Slider
                {...itemsSettings}
                ref={itemsSliderRef}
                afterChange={(i) => setItemsCurrentSlide(i)}
              >
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
      )}

      {showStores && (
        <Stack
          spacing={2}
          sx={{
            pb: { xs: "8px", md: 0 },
            pl: { xs: "20px", md: 0 },
            pr: { xs: 0, md: 0 },
          }}
        >
          <SliderSectionHeader
            sliderRef={storesSliderRef}
            currentSlide={storesCurrentSlide}
            totalSlides={stores.length}
            slidesToShow={2.8}
            heading={<SectionTitle>{storesLabel}</SectionTitle>}
          />
          <SliderWrapper>
            {storesLoading ? (
              <Slider {...storesSettings}>
                {[...Array(3)].map((_, i) => (
                  <Box key={i} sx={{ pr: "20px" }}>
                    <NewStoreCardSkeleton />
                  </Box>
                ))}
              </Slider>
            ) : stores.length > 0 ? (
              <Slider
                {...storesSettings}
                ref={storesSliderRef}
                afterChange={(i) => setStoresCurrentSlide(i)}
              >
                {stores.map((store) => (
                  <div key={store?.id}>
                    <SearchResultStoreCard
                      store={store}
                      showAdBadge={store?.ad}
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
      )}
    </>
  );
};

// ─── Items tab (infinite scroll grid) ──────────────────────────────────────
const ItemsResult = ({
  items,
  itemsLabel,
  itemsLoading,
  itemsHasNext,
  itemsFetchingNext,
  fetchMoreItems,
  theme,
  t,
}) => {
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { ref, inView } = useInView({ rootMargin: "0px 0px 50% 0px" });

  useEffect(() => {
    if (inView && itemsHasNext && !itemsFetchingNext) {
      fetchMoreItems();
    }
  }, [inView, itemsHasNext, itemsFetchingNext, fetchMoreItems]);

  return (
    <Stack
      spacing={2}
      sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: "20px", md: 0 } }}
    >
      <SectionTitle>{itemsLabel}</SectionTitle>
      {!itemsLoading && items.length === 0 ? (
        <SearchEmptyState label="No results found" />
      ) : (
        <Box sx={{ overflow: "hidden" }}>
          <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
            {itemsLoading
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
        </Box>
      )}
      <Box ref={ref} sx={{ height: "10px" }} />
      {itemsFetchingNext && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Stack>
  );
};

// ─── Stores tab (infinite scroll grid) ─────────────────────────────────────
const StoresResult = ({
  stores,
  storesLabel,
  storesLoading,
  storesHasNext,
  storesFetchingNext,
  fetchMoreStores,
  t,
}) => {
  const { ref, inView } = useInView({ rootMargin: "0px 0px 50% 0px" });

  useEffect(() => {
    if (inView && storesHasNext && !storesFetchingNext) {
      fetchMoreStores();
    }
  }, [inView, storesHasNext, storesFetchingNext, fetchMoreStores]);

  return (
    <Stack
      spacing={2}
      sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: "20px", md: 0 } }}
    >
      <SectionTitle>{storesLabel}</SectionTitle>
      {!storesLoading && stores.length === 0 ? (
        <SearchEmptyState label="No results found" />
      ) : (
        <Box sx={{ overflow: "hidden" }}>
          <Grid container spacing={3}>
            {storesLoading
              ? [...Array(6)].map((_, i) => (
                  <Grid key={i} item xs={12} sm={6} md={4}>
                    <NewStoreCardSkeleton />
                  </Grid>
                ))
              : stores.map((store) => (
                  <Grid key={store?.id} item xs={12} sm={6} md={4}>
                    <Box sx={{ "& > *": { width: "100% !important" } }}>
                      <NewStoreCard
                        variant="normal"
                        item={store}
                        imageUrl={store?.cover_photo_full_url}
                      />
                    </Box>
                  </Grid>
                ))}
          </Grid>
        </Box>
      )}
      <Box ref={ref} sx={{ height: "10px" }} />
      {storesFetchingNext && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Stack>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────
const CategoryResult = ({
  breadcrumbItems,
  activeTab,
  onTabChange,
  items,
  stores,
  itemsLabel,
  storesLabel,
  itemsLoading,
  storesLoading,
  itemsHasNext,
  storesHasNext,
  itemsFetchingNext,
  storesFetchingNext,
  fetchMoreItems,
  fetchMoreStores,
  appliedFilterCount,
  onFilterOpen,
  storesOnly = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // storesOnly mode: no tabs, just stores grid with breadcrumb + filter
  if (storesOnly) {
    return (
      <Stack spacing={3} sx={{ pt: 0 }}>
        {/* Mobile breadcrumb + filter icon */}
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
        </Stack>
        {/* Desktop breadcrumb + filter */}
        <Stack
          direction="row"
          alignItems="center"
          gap={{ xs: "8px", md: "12px" }}
          sx={{
            display: { xs: "none", md: "flex" },
            flexWrap: "nowrap",
            py: { md: "4px" },
            position: { md: "sticky" },
            top: { md: "63px" },
            zIndex: { md: 10 },
            backgroundColor: (th) => th.palette.background.default,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CustomPageBreadCrumb items={breadcrumbItems} />
          </Box>
          <Box
            onClick={onFilterOpen}
            sx={{
              position: "relative",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "background.secondary",
              border: (th) => `1px solid ${th.palette.divider}`,
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
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {appliedFilterCount}
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
        <StoresResult
          stores={stores}
          storesLabel={storesLabel}
          storesLoading={storesLoading}
          storesHasNext={storesHasNext}
          storesFetchingNext={storesFetchingNext}
          fetchMoreStores={fetchMoreStores}
          t={t}
        />
      </Stack>
    );
  }

  const showItems = activeTab === TAB_ALL || activeTab === TAB_ITEMS;
  const showStores = activeTab === TAB_ALL || activeTab === TAB_STORES;

  const renderTab = () => {
    if (activeTab === TAB_ITEMS) {
      return (
        <ItemsResult
          items={items}
          itemsLabel={itemsLabel}
          itemsLoading={itemsLoading}
          itemsHasNext={itemsHasNext}
          itemsFetchingNext={itemsFetchingNext}
          fetchMoreItems={fetchMoreItems}
          theme={theme}
          t={t}
        />
      );
    }
    if (activeTab === TAB_STORES) {
      return (
        <StoresResult
          stores={stores}
          storesLabel={storesLabel}
          storesLoading={storesLoading}
          storesHasNext={storesHasNext}
          storesFetchingNext={storesFetchingNext}
          fetchMoreStores={fetchMoreStores}
          t={t}
        />
      );
    }
    return (
      <AllResult
        items={items}
        stores={stores}
        itemsLabel={itemsLabel}
        storesLabel={storesLabel}
        itemsLoading={itemsLoading}
        storesLoading={storesLoading}
        showItems={showItems}
        showStores={showStores}
        theme={theme}
        t={t}
      />
    );
  };

  return (
    <Stack spacing={3} sx={{ pt: 0 }}>
      {/* Mobile-only: breadcrumb + tabs on same row (filter lives in CategoryMobilePageBar) */}
      <Stack
        direction="row"
        alignItems="center"
        gap="8px"
        sx={{
          display: { xs: "flex", md: "none" },
          flexWrap: "nowrap",
          px: "16px",
          py: "8px",
          position: "sticky",
          top: "112px", // MobileNavBar(60px) + CategoryMobilePageBar(52px)
          zIndex: (theme) => theme.zIndex.appBar - 2,
          backgroundColor: "background.default",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <CustomPageBreadCrumb items={breadcrumbItems} />
        </Box>
        <Stack
          direction="row"
          gap={{ xs: "2px", md: "6px" }}
          alignItems="center"
          flexShrink={0}
          sx={{
            overflowX: "auto",
            flexWrap: "nowrap",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <FilterPill
            label={t("All")}
            active={activeTab === TAB_ALL}
            onClick={() => onTabChange(TAB_ALL)}
          />
          <FilterPill
            label={itemsLabel}
            active={activeTab === TAB_ITEMS}
            onClick={() => onTabChange(TAB_ITEMS)}
          />
          <FilterPill
            label={storesLabel}
            active={activeTab === TAB_STORES}
            onClick={() => onTabChange(TAB_STORES)}
          />
        </Stack>
      </Stack>

      {/* Desktop filter bar */}
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
          backgroundColor: (th) => th.palette.background.default,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <CustomPageBreadCrumb items={breadcrumbItems} />
        </Box>

        <Stack direction="row" gap="8px" alignItems="center" flexShrink={0}>
          <FilterPill
            label={t("All")}
            active={activeTab === TAB_ALL}
            onClick={() => onTabChange(TAB_ALL)}
          />
          <FilterPill
            label={itemsLabel}
            active={activeTab === TAB_ITEMS}
            onClick={() => onTabChange(TAB_ITEMS)}
          />
          <FilterPill
            label={storesLabel}
            active={activeTab === TAB_STORES}
            onClick={() => onTabChange(TAB_STORES)}
          />
        </Stack>

        <Box
          onClick={onFilterOpen}
          sx={{
            position: "relative",
            width: 36,
            height: 36,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "background.secondary",
            border: (th) => `1px solid ${th.palette.divider}`,
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
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {appliedFilterCount}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>

      {renderTab()}
    </Stack>
  );
};

export default CategoryResult;
