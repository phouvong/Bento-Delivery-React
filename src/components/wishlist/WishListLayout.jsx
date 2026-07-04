import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
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
import { useWishListGet } from "api-manage/hooks/react-query/wish-list/useWishListGet";
import { getToken } from "helper-functions/getToken";
import ModuleSearchBanner from "components/home/module-wise-components/shared/ModuleSearchBanner";
import SectionSearchBar from "components/home/module-wise-components/shared/SectionSearchBar";
import FoodSearchFilterDrawer from "components/home/search/FoodSearchFilterDrawer";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import SectionMobileActionBar from "components/home/section-page/SectionMobileActionBar";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import { getItemsOrFoods } from "helper-functions/getItemsOrFoods";
import { getStoresOrRestaurants } from "helper-functions/getStoresOrRestaurants";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setWishList } from "redux/slices/wishList";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

const TAB_ALL = "all";

const StoreCardSkeleton = () => (
  <Stack spacing={1}>
    <Skeleton
      variant="rounded"
      width="100%"
      sx={{
        height: { xs: "110px", sm: "130px", md: "150px" },
        borderRadius: "12px",
      }}
    />
    <Skeleton
      variant="text"
      width="55%"
      sx={{ fontSize: { xs: "13px", md: "14px" } }}
    />
    <Skeleton variant="text" width="38%" sx={{ fontSize: "12px" }} />
  </Stack>
);

const WishlistSkeletonSection = () => (
  <Stack spacing={{ xs: 3, md: 4 }}>
    {/* Items section */}
    <Stack spacing={{ xs: 1.5, md: 2 }} sx={{ pl: { xs: "20px", md: 0 } }}>
      <Skeleton
        variant="rounded"
        sx={{
          width: { xs: 90, md: 120 },
          height: { xs: 22, md: 28 },
          borderRadius: "6px",
        }}
      />
      {/* Mobile: horizontal scroll row — Desktop: grid */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          gap: "12px",
          overflowX: "auto",
          pr: "20px",
          pb: "4px",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Box
            key={i}
            sx={{ minWidth: { xs: "38vw", sm: "28vw" }, flexShrink: 0 }}
          >
            <ProductCardSimmer cardWidth="100%" />
          </Box>
        ))}
      </Box>
      <Box sx={{ display: { xs: "none", md: "block" }, pr: 0 }}>
        <Grid container spacing={3}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Grid key={i} item md={3} lg={2.4}>
              <ProductCardSimmer cardWidth="100%" />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>

    {/* Stores section */}
    <Stack spacing={{ xs: 1.5, md: 2 }} sx={{ pl: { xs: "20px", md: 0 } }}>
      <Skeleton
        variant="rounded"
        sx={{
          width: { xs: 75, md: 100 },
          height: { xs: 22, md: 28 },
          borderRadius: "6px",
        }}
      />
      {/* Mobile: horizontal scroll row — Desktop: grid */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          gap: "12px",
          overflowX: "auto",
          pr: "20px",
          pb: "4px",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Box
            key={i}
            sx={{ minWidth: { xs: "75vw", sm: "55vw" }, flexShrink: 0 }}
          >
            <StoreCardSkeleton />
          </Box>
        ))}
      </Box>
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Grid key={i} item md={4}>
              <StoreCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  </Stack>
);

const EmptyWishlist = ({ label, t }) => (
  <Stack
    alignItems="center"
    justifyContent="center"
    spacing={2}
    sx={{ py: { xs: "60px", md: "80px" } }}
  >
    <Box
      sx={{
        width: { xs: "80px", md: "100px" },
        height: { xs: "80px", md: "100px" },
        borderRadius: "50%",
        backgroundColor: "primary.light",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <i
        className="fi fi-rr-heart"
        style={{
          fontSize: "36px",
          color: "var(--mui-palette-primary-main, #FC6B0E)",
          display: "flex",
          lineHeight: 1,
        }}
      />
    </Box>
    <Stack alignItems="center" spacing={0.5}>
      <Typography
        sx={{
          fontSize: { xs: "16px", md: "18px" },
          fontWeight: 700,
          color: "neutral.1050",
          letterSpacing: "-0.5px",
        }}
      >
        {t(label)}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "13px", md: "14px" },
          color: "neutral.500",
          textAlign: "center",
          maxWidth: "260px",
        }}
      >
        {t("Save your favourite items and stores here")}
      </Typography>
    </Stack>
  </Stack>
);
const TAB_FOODS = "foods";
const TAB_RESTAURANTS = "restaurants";

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-track": { marginLeft: 0, marginRight: "auto" },
  "& .slick-slide": { paddingRight: "20px" },
  "& .slick-slide:first-child": { paddingLeft: 0 },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

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
      transition: "background-color 0.15s",
      userSelect: "none",
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

// ── All tab ───────────────────────────────────────────────────────────────────

const AllResult = ({ items, stores, itemsLabel, storesLabel, t, theme }) => {
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [itemsSlide, setItemsSlide] = useState(0);
  const [storesSlide, setStoresSlide] = useState(0);
  const itemsRef = useRef(null);
  const storesRef = useRef(null);

  const itemsSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 1450, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 760, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2.6 } },
      { breakpoint: 400, settings: { slidesToShow: 2.2 } },
      { breakpoint: 360, settings: { slidesToShow: 2 } },
    ],
  };

  const storesSettings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3.3,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1.5 } },
      { breakpoint: 480, settings: { slidesToShow: 1.27 } },
      { breakpoint: 400, settings: { slidesToShow: 1.1 } },
      { breakpoint: 350, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Stack spacing={4}>
      {items.length > 0 && (
        <Stack
          spacing={2}
          sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: 0, md: 0 } }}
        >
          <SliderSectionHeader
            sliderRef={itemsRef}
            currentSlide={itemsSlide}
            totalSlides={items.length}
            slidesToShow={5}
            heading={<SectionTitle>{itemsLabel}</SectionTitle>}
          />
          <SliderWrapper>
            <Slider
              ref={itemsRef}
              afterChange={setItemsSlide}
              {...itemsSettings}
            >
              {items.map((item) => (
                <div key={item?.id}>
                  <NewProductCard
                    variant="vertical"
                    item={item}
                    cardWidth="100%"
                  />
                </div>
              ))}
            </Slider>
          </SliderWrapper>
        </Stack>
      )}

      {stores.length > 0 && (
        <Stack
          spacing={2}
          sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: 0, md: 0 } }}
        >
          <SliderSectionHeader
            sliderRef={storesRef}
            currentSlide={storesSlide}
            totalSlides={stores.length}
            slidesToShow={2.8}
            heading={<SectionTitle>{storesLabel}</SectionTitle>}
          />
          <SliderWrapper>
            <Slider
              ref={storesRef}
              afterChange={setStoresSlide}
              {...storesSettings}
            >
              {stores.map((store) => (
                <NewStoreCard
                  key={store?.id}
                  variant="normal"
                  item={store}
                  imageUrl={store?.cover_photo_full_url}
                />
              ))}
            </Slider>
          </SliderWrapper>
        </Stack>
      )}

      {items.length === 0 && stores.length === 0 && (
        <EmptyWishlist label="No favourites found" t={t} />
      )}
    </Stack>
  );
};

// ── Foods tab ─────────────────────────────────────────────────────────────────

const FoodsResult = ({ items, itemsLabel, t, theme }) => {
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  if (items.length === 0)
    return <EmptyWishlist label="No favourite items found" t={t} />;
  return (
    <Stack
      spacing={2}
      sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: "20px", md: 0 } }}
    >
      <SectionTitle>{itemsLabel}</SectionTitle>
      <Box sx={{ overflow: "hidden" }}>
        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
          {items.map((item) => (
            <Grid key={item?.id} item xs={6} sm={4} md={3} lg={2.4}>
              <NewProductCard variant="vertical" item={item} cardWidth="100%" />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
};

// ── Stores tab ────────────────────────────────────────────────────────────────

const StoresResult = ({ stores, storesLabel, t }) => {
  if (stores.length === 0)
    return <EmptyWishlist label="No favourite stores found" t={t} />;
  return (
    <Stack
      spacing={2}
      sx={{ pl: { xs: "20px", md: 0 }, pr: { xs: "20px", md: 0 } }}
    >
      <SectionTitle>{storesLabel}</SectionTitle>
      <Box sx={{ overflow: "hidden" }}>
        <Grid container spacing={3}>
          {stores.map((store) => (
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
    </Stack>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────

const WishListLayout = ({ configData }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const moduleType = getCurrentModuleType();

  const token = getToken();
  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;

  const q = typeof router.query.q === "string" ? router.query.q.trim() : "";

  const [appliedFilters, setAppliedFilters] = useState({});

  const apiParams = { search: q, ...appliedFilters };

  const { data: wishlistData, isLoading: wishlistLoading } = useWishListGet(
    apiParams,
    !!token,
  );

  const allItems = wishlistData?.item || [];
  const allStores = wishlistData?.store || [];

  // Sync API wishlist data into Redux so cards (NewStoreCard, NewProductCard)
  // can correctly detect isWishlisted via the shared wishLists selector.
  useEffect(() => {
    if (wishlistData) {
      dispatch(setWishList(wishlistData));
    }
  }, [wishlistData]);

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [appliedFilterCount, setAppliedFilterCount] = useState(0);

  const handleFilterApply = (filters) => {
    const safe = { ...(filters ?? {}) };
    setAppliedFilters(safe);
    setAppliedFilterCount(
      [
        safe?.sort_by,
        safe?.price_min || safe?.price_max,
        safe?.rating,
        safe?.type,
        safe?.quick_action,
      ].filter(Boolean).length,
    );
    setFilterAnchorEl(null);
  };
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

  const searchPlaceholder = t("Search Here...");

  const bannerTitle =
    moduleType === "food"
      ? "Search Saved Restaurants"
      : moduleType === "pharmacy"
      ? "Search Saved Medicine"
      : moduleType === "ecommerce"
      ? "Search Saved Products"
      : "Search Saved Grocery";

  const itemsLabel = t(getItemsOrFoods()).replace(/\b\w/g, (c) =>
    c.toUpperCase(),
  );
  const storesLabel = t(getStoresOrRestaurants()).replace(/\b\w/g, (c) =>
    c.toUpperCase(),
  );

  const activeTab = router.query.data_type_tab || TAB_ALL;

  const handleTabChange = (tab) => {
    router.push({ query: { ...router.query, data_type_tab: tab } }, undefined, {
      shallow: true,
    });
  };

  const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";

  const showTabWiseView = (tab) => {
    if (wishlistLoading) {
      return (
        <Box sx={{ px: { xs: "20px", md: 0 } }}>
          <WishlistSkeletonSection />
        </Box>
      );
    }

    switch (tab) {
      case TAB_ALL:
        return (
          <AllResult
            items={allItems}
            stores={allStores}
            itemsLabel={itemsLabel}
            storesLabel={storesLabel}
            t={t}
            theme={theme}
          />
        );
      case TAB_FOODS:
        return (
          <FoodsResult
            items={allItems}
            itemsLabel={itemsLabel}
            t={t}
            theme={theme}
          />
        );
      case TAB_RESTAURANTS:
        return (
          <StoresResult stores={allStores} storesLabel={storesLabel} t={t} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SimpleMobileHeader title="Favourite" />
      <SectionMobileActionBar
        searchValue={mobileSearch}
        onSearchChange={setMobileSearch}
        onSearchCommit={commitMobileSearch}
        onFilterOpen={() => setFilterAnchorEl(document.body)}
        filterCount={appliedFilterCount}
      />
      <Stack spacing={2} sx={{ pt: { xs: 0, md: 0 } }}>
        {/* Search banner */}
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

        {/* Breadcrumb + tabs + filter */}
        <Stack
          direction="row"
          alignItems="center"
          gap={{ xs: "8px", md: "12px" }}
          sx={{
            flexWrap: "nowrap",
            backgroundColor: "background.default",
            py: { xs: "8px", md: "12px" },
            position: { xs: "static", md: "sticky" },
            top: { md: "63px" },
            zIndex: { md: 10 },
            px: { xs: "20px", md: 0 },
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CustomPageBreadCrumb
              items={[
                {
                  key: "home",
                  label: t("Home"),
                  icon: <HomeOutlinedIcon style={{ fontSize: "14px" }} />,
                  onRedirect: homeHref,
                },
                { key: "wishlist", label: t("Favourite") },
              ]}
            />
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            gap={{ xs: "2px", md: "8px" }}
            flexShrink={0}
          >
            <FilterPill
              label={t("All")}
              active={activeTab === TAB_ALL}
              onClick={() => handleTabChange(TAB_ALL)}
            />
            <FilterPill
              label={itemsLabel}
              active={activeTab === TAB_FOODS}
              onClick={() => handleTabChange(TAB_FOODS)}
            />
            <FilterPill
              label={storesLabel}
              active={activeTab === TAB_RESTAURANTS}
              onClick={() => handleTabChange(TAB_RESTAURANTS)}
            />
          </Stack>

          {/* Filter button */}
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
              border: (theme) => `1px solid ${theme.palette.divider}`,
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

        {showTabWiseView(activeTab)}
      </Stack>

      <FoodSearchFilterDrawer
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        onApply={handleFilterApply}
        filterValue={appliedFilters}
        showFilterBy={false}
        categories={[]}
      />
    </>
  );
};

export default WishListLayout;
