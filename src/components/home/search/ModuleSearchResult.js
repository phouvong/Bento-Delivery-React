import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Skeleton,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";
import { CircularProgress } from "@mui/material";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import NewProductCard from "components/cards/newCard/NewProductCard";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import SearchResultStoreCard from "components/cards/newCard/SearchResultStoreCard";

// ─── Search empty state ─────────────────────────────────────────────────────

const SearchEmptyState = ({ label }) => {
  const { t } = useTranslation();
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={1}
      sx={{ py: { xs: "14px", md: "18px" }, width: "100%" }}
    >
      <Box
        component="img"
        src="/static/nodata.png"
        alt=""
        sx={{
          width: { xs: 52, md: 60 },
          height: { xs: 52, md: 60 },
          objectFit: "contain",
          opacity: 0.6,
        }}
      />
      <Typography
        sx={{
          fontSize: { xs: "13px", md: "13px" },
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

// ─── Tab values ────────────────────────────────────────────────────────────

const TAB_ALL = "all";
const TAB_FOODS = "items";
const TAB_RESTAURANTS = "restaurants";

// ─── Slider wrapper (same as LoveItem) ────────────────────────────────────

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-track": { marginLeft: 0, marginRight: "auto" },
  "& .slick-slide": { paddingRight: "20px" },
  "& .slick-slide:first-child": { paddingLeft: 0 },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

// ─── Filter pill button ────────────────────────────────────────────────────

const FilterPill = ({ label, active, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      height: { xs: "26px", md: "36px" },
      px: active ? { xs: "12px", md: "16px" } : { xs: "8px", md: "16px" },
      py: "8px",
      borderRadius: "8px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: active
        ? "primary.main"
        : { xs: "transparent", md: "background.secondary" },
      border: active ? "1px solid" : "none",
      borderColor: active ? "primary.main" : "transparent",
      transition: "background-color 0.15s",
      userSelect: "none",
      "&:hover": { opacity: 0.85 },
    }}
  >
    <Typography
      sx={{
        fontSize: { xs: "12px", md: "14px" },
        fontWeight: 600,
        color: active ? "common.white" : "neutral.1050",
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

// ─── Main ──────────────────────────────────────────────────────────────────

const ModuleSearchResult = ({
  searchValue,
  activeTab,
  onTabChange,
  items,
  stores,
  itemsTotal,
  storesTotal,
  itemsLoading,
  storesLoading,
  itemsHasNext,
  storesHasNext,
  itemsFetchingNext,
  storesFetchingNext,
  fetchMoreItems,
  fetchMoreStores,
  exclusiveStores,
  appliedFilterCount,
  onFilterOpen,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  const moduleType = getCurrentModuleType();
  const itemsLabel =
    moduleType === "food"
      ? t("Foods")
      : moduleType === "ecommerce"
      ? t("Items")
      : moduleType === "pharmacy"
      ? t("Medicines")
      : t("Groceries");
  const storesLabel = moduleType === "food" ? t("Restaurants") : t("Stores");

  const totalCount =
    activeTab === TAB_FOODS
      ? itemsTotal
      : activeTab === TAB_RESTAURANTS
      ? storesTotal
      : itemsTotal + storesTotal;

  const showItems = activeTab === TAB_ALL || activeTab === TAB_FOODS;
  const showStores = activeTab === TAB_ALL || activeTab === TAB_RESTAURANTS;

  const sharedProps = {
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
    exclusiveStores,
    t,
  };

  const showTabWiseView = (tab) => {
    switch (tab) {
      case TAB_ALL:
        return (
          <AllResult
            {...sharedProps}
            showItems={showItems}
            showStores={showStores}
            theme={theme}
          />
        );
      case TAB_FOODS:
        return <FoodsResult {...sharedProps} theme={theme} />;
      case TAB_RESTAURANTS:
        return <StoresResult {...sharedProps} />;
    }
  };

  return (
    <Stack spacing={3} sx={{ pt: { xs: 0, md: 1 } }}>
      {/* ── Filter bar ── */}
      <Stack
        direction="row"
        alignItems="center"
        gap={{ xs: "8px", md: "16px" }}
        sx={{
          flexWrap: "nowrap",
          "@media (max-width: 360px)": { flexWrap: "wrap", rowGap: "10px" },
          backgroundColor: (theme) => theme.palette.background.default,
          py: { xs: "8px", md: "12px" },
          position: { xs: "static", md: "sticky" },
          top: { md: "63px" },
          zIndex: { md: 10 },
          px: { xs: "20px", md: 0 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "18px" },
              fontWeight: 400,
              color: "#757575",
              letterSpacing: "-0.36px",
              lineHeight: 1.3,
            }}
          >
            {searchValue
              ? `${totalCount} ${t("Result For")} “${searchValue}”`
              : `${totalCount} ${t("Results Found")}`}
          </Typography>
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          gap={{ xs: "2px", md: "8px" }}
          sx={{ "@media (max-width: 340px)": { flexBasis: "100%" } }}
        >
          <FilterPill
            label={t("All")}
            active={activeTab === TAB_ALL}
            onClick={() => onTabChange(TAB_ALL)}
          />
          <FilterPill
            label={itemsLabel}
            active={activeTab === TAB_FOODS}
            onClick={() => onTabChange(TAB_FOODS)}
          />
          <FilterPill
            label={storesLabel}
            active={activeTab === TAB_RESTAURANTS}
            onClick={() => onTabChange(TAB_RESTAURANTS)}
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
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: "8px",
            cursor: "pointer",
            flexShrink: 0,
            "&:hover": { opacity: 0.7 },
          }}
        >
          <i
            className="fi fi-ss-sliders-v"
            style={{
              fontSize: "16px",
              lineHeight: 1,
              display: "flex",
              color: "inherit",
            }}
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
                  color: "common.white",
                  lineHeight: 1,
                }}
              >
                {appliedFilterCount}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>

      {showTabWiseView(activeTab)}
    </Stack>
  );
};

const AllResult = ({
  showItems,
  showStores,
  items,
  stores,
  itemsLabel,
  storesLabel,
  itemsLoading,
  storesLoading,
  exclusiveStores,
  t,
  theme,
}) => {
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const [itemsCurrentSlide, setItemsCurrentSlide] = useState(0);
  const [dealsCurrentSlide, setDealsCurrentSlide] = useState(0);
  const [storesCurrentSlide, setStoresCurrentSlide] = useState(0);
  const itemsSliderRef = useRef(null);
  const dealsSliderRef = useRef(null);

  const storesSliderRef = useRef(null);
  // ── Slider settings ─────────────────────────────────────────────────────

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
      { breakpoint: 340, settings: { slidesToShow: 2, slidesToScroll: 2 , swipeToSlide: true} },
    ],
  };

  const storesSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.8,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 , swipeToSlide: true} },
      { breakpoint: 600, settings: { slidesToShow: 1.5, slidesToScroll: 1 , swipeToSlide: true} },
      { breakpoint: 480, settings: { slidesToShow: 1.1, slidesToScroll: 1 , swipeToSlide: true} },
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
              <SearchEmptyState label={`No ${itemsLabel} found`} />
            )}
          </SliderWrapper>
        </Stack>
      )}

      {exclusiveStores.length > 0 && (
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.background.paper
                : "#FFFBEB",
            borderRadius: { sm: 0, md: "16px" },
            pt: "20px",
            pb: "20px",
            pl: "20px",
            pr: { xs: 0, md: "20px" },
          }}
        >
          <Stack spacing={2}>
            <SliderSectionHeader
              sliderRef={dealsSliderRef}
              currentSlide={dealsCurrentSlide}
              totalSlides={exclusiveStores.length}
              slidesToShow={3.2}
              heading={<SectionTitle>{t("Exclusive Deals")}</SectionTitle>}
            />
            <Box
              sx={{
                overflow: "hidden",
                "& .slick-track": { marginLeft: 0 },
                "& .slick-slide": { paddingRight: "20px" },
                "& .slick-slide:first-child": { paddingLeft: 0 },
                "& .slick-slide > div > *": { width: "100% !important" },
              }}
            >
              <Slider
                ref={dealsSliderRef}
                afterChange={(i) => setDealsCurrentSlide(i)}
                dots={false}
                infinite={false}
                speed={500}
                slidesToShow={3.2}
                slidesToScroll={1}
                arrows={false}
                responsive={[
                  {
                    breakpoint: 1024,
                    settings: { slidesToShow: 2.2, slidesToScroll: 1 , swipeToSlide: true},
                  },
                  {
                    breakpoint: 600,
                    settings: { slidesToShow: 1.27, slidesToScroll: 1 , swipeToSlide: true},
                  },
                  {
                    breakpoint: 400,
                    settings: { slidesToShow: 1.1, slidesToScroll: 1 , swipeToSlide: true},
                  },
                  {
                    breakpoint: 350,
                    settings: { slidesToShow: 1, slidesToScroll: 1 , swipeToSlide: true},
                  },
                ]}
              >
                {exclusiveStores.map((store) => (
                  <div key={store?.id}>
                    <NewStoreCard
                      variant="normal"
                      item={store}
                      imageUrl={store?.cover_photo_full_url}
                    />
                  </div>
                ))}
              </Slider>
            </Box>
          </Stack>
        </Box>
      )}

      {/* ── Restaurants section ── */}
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
                      showAdBadge={store?.ad}
                      store={store}
                      items={store?.top_items}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <SearchEmptyState label={`No ${storesLabel} found`} />
            )}
          </SliderWrapper>
        </Stack>
      )}
    </>
  );
};

const StoresResult = ({
  stores,
  storesLabel,
  storesLoading,
  storesHasNext,
  storesFetchingNext,
  fetchMoreStores,
}) => {
  const { ref, inView } = useInView({ rootMargin: "0px 0px 50% 0px" });

  useEffect(() => {
    if (inView && storesHasNext && !storesFetchingNext) {
      fetchMoreStores();
    }
  }, [inView, storesHasNext, storesFetchingNext, fetchMoreStores]);

  return (
    // Grid + card sizing mirrors `src/components/home/stores/AllStores.js` so
    // the search/category Restaurants tab matches the home overview's grid.
    // The inner Box `width: 100% !important` is what forces the card to fill
    // its grid item — without it cards render at a smaller intrinsic width.
    <Stack
      spacing={2}
      sx={{
        pl: { xs: "20px", md: 0 },
        pr: { xs: "20px", md: 0 },
      }}
    >
      <SectionTitle>{storesLabel}</SectionTitle>
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
      {!storesLoading && stores.length === 0 && (
        <SearchEmptyState label={`No ${storesLabel} found`} />
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

const FoodsResult = ({
  items,
  itemsLabel,
  itemsLoading,
  itemsHasNext,
  itemsFetchingNext,
  fetchMoreItems,
  theme,
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
      sx={{
        pl: { xs: "20px", md: 0 },
        pr: { xs: "20px", md: 0 },
      }}
    >
      <SectionTitle>{itemsLabel}</SectionTitle>
      <Box sx={{ overflow: "hidden" }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
          {itemsLoading
            ? [...Array(10)].map((_, i) => (
                <Grid key={i} item xs={6} sm={4} md={3} lg={2.4}>
                  <ProductCardSimmer cardWidth="100%" />
                </Grid>
              ))
            : items.length === 0
            ? null
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
      {!itemsLoading && items.length === 0 && (
        <SearchEmptyState label={`No ${itemsLabel} found`} />
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

export default ModuleSearchResult;
