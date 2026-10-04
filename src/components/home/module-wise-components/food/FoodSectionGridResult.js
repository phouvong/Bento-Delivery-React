import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useGetDiscountedItems from "api-manage/hooks/react-query/product-details/useGetDiscountedItems";
import useGetMostReviewed from "api-manage/hooks/react-query/useGetMostReviewed";
import useGetTopOffers from "api-manage/hooks/react-query/product-details/useGetTopOffers";
import useGetStoresByFiltering from "api-manage/hooks/react-query/store/useGetStoresByFiltering";
import NewProductCard from "components/cards/newCard/NewProductCard";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import FoodSectionPageWrapper from "./FoodSectionPageWrapper";
// ── Section label map ─────────────────────────────────────────────────────────

const LABELS = {
  offers: "Offers",
  "express-delivery": "Express Delivery",
  "free-delivery": "Free Delivery",
  "top-rated": "Top Rated",
  nearby: "Nearby",
};

// ── Product grid ──────────────────────────────────────────────────────────────

const ProductGrid = ({ items, isLoading }) => (
  <Box sx={{ px: { xs: "16px", md: 0 } }}>
    <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
      {isLoading
        ? [...Array(10)].map((_, i) => (
            <Grid key={i} item xs={6} sm={4} md={3} lg={2.4}>
              <ProductCardSimmer cardWidth="100%" />
            </Grid>
          ))
        : items.map((item) => (
            <Grid key={item?.id} item xs={6} sm={4} md={3} lg={2.4}>
              <NewProductCard variant="vertical" item={item} cardWidth="100%" />
            </Grid>
          ))}
    </Grid>
  </Box>
);

// ── Store grid ────────────────────────────────────────────────────────────────

const StoreGrid = ({ stores, isLoading }) => (
  <Box sx={{ px: { xs: "16px", md: 0 } }}>
    <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
      {isLoading
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
);

// ── Empty state ───────────────────────────────────────────────────────────────

const Empty = ({ label }) => {
  const { t } = useTranslation();
  return (
    <Typography sx={{ color: "neutral.500", py: 4, px: "16px" }}>
      {t("No results found for")} {t(label)}
    </Typography>
  );
};

// ── Section data fetchers ─────────────────────────────────────────────────────

const OffersGrid = () => {
  const { data, isLoading } = useGetDiscountedItems({
    currentTab: 0,
    limit: 20,
    offset: 0,
  });
  const items = data?.products ?? [];
  if (!isLoading && !items.length) return <Empty label="Offers" />;
  return <ProductGrid items={items} isLoading={isLoading} />;
};

const TopRatedGrid = () => {
  const { data, isLoading, refetch } = useGetMostReviewed({ type: "all" });
  useEffect(() => { refetch(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const items = data?.products ?? [];
  if (!isLoading && !items.length) return <Empty label="Top Rated" />;
  return <ProductGrid items={items} isLoading={isLoading} />;
};

const NearbyGrid = () => {
  const { data, isLoading } = useGetTopOffers("", "", "");
  const stores = data?.stores ?? [];
  if (!isLoading && !stores.length) return <Empty label="Nearby" />;
  return <StoreGrid stores={stores} isLoading={isLoading} />;
};

const FreeDeliveryGrid = () => {
  const { data, isLoading } = useGetStoresByFiltering({
    type: "free_delivery",
    limit: 20,
    enabled: true,
  });
  const stores = (data?.pages ?? []).flatMap((p) => p?.stores ?? []);
  if (!isLoading && !stores.length) return <Empty label="Free Delivery" />;
  return <StoreGrid stores={stores} isLoading={isLoading} />;
};

// ── Main component ────────────────────────────────────────────────────────────

const GRID_MAP = {
  discounted: null,
  offers: OffersGrid,
  "express-delivery": FreeDeliveryGrid,
  "free-delivery": FreeDeliveryGrid,
  "top-rated": TopRatedGrid,
  nearby: NearbyGrid,
};

const FoodSectionGridResult = ({ sectionId }) => {
  const SectionGrid = GRID_MAP[sectionId];
  if (!SectionGrid) return null;

  return (
    <FoodSectionPageWrapper sectionLabel={LABELS[sectionId]}>
      <SectionGrid />
    </FoodSectionPageWrapper>
  );
};

export default FoodSectionGridResult;
