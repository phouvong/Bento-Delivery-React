import { Box, Grid, Skeleton, Typography } from "@mui/material";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import useGetQuickDeliveryStores from "api-manage/hooks/react-query/store/useGetQuickDeliveryStores";
import { useTranslation } from "react-i18next";
import ExpressStoreCard from "components/cards/newCard/ExpressStoreCard";
import { useRouter } from "next/router";

const StoreShimmer = () => (
  <Skeleton
    variant="rounded"
    width="100%"
    height={200}
    sx={{ borderRadius: "12px" }}
  />
);

/**
 * filterParams — passed from the wrapper (FoodSectionPageWrapper etc.)
 * when filter drawer is applied. Shape:
 *   { sort_by, type, rating, price_min, price_max }
 */
const ExpressDeliveryStoreGrid = ({ cardVariant = "", filterParams = {} }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const q = typeof router.query.q === "string" ? router.query.q.trim() : "";

  const { data, isLoading } = useGetQuickDeliveryStores({
    limit: 10,
    offset: 1,
    with_items: cardVariant === "withItems" ? 1 : null,
    search: q || undefined,
    ...filterParams,
  });
  const stores = data?.stores ?? [];

  if (!isLoading && stores.length === 0) {
    return (
      <Typography
        sx={{ color: "neutral.500", py: 4, px: { xs: "16px", md: 0 } }}
      >
        {t("No stores found")}
      </Typography>
    );
  }

  return (
    <Box sx={{ px: { xs: "16px", md: 0 } }}>
      <Grid container spacing={{ xs: 1.5, md: 3 }}>
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <Grid key={i} item xs={12} sm={6} md={4}>
                <StoreShimmer />
              </Grid>
            ))
          : stores.map((store) => (
              <Grid key={store?.id} item xs={12} sm={6} md={4}>
                <Box sx={{ "& > *": { width: "100% !important" } }}>
                  {cardVariant === "withItems" ? (
                    <ExpressStoreCard
                      key={store?.id}
                      store={store}
                      items={store?.top_items || []}
                    />
                  ) : (
                    <NewStoreCard
                      key={store?.id}
                      variant="normal"
                      item={store}
                      imageUrl={store?.cover_photo_full_url}
                    />
                  )}
                </Box>
              </Grid>
            ))}
      </Grid>
    </Box>
  );
};

export default ExpressDeliveryStoreGrid;
