import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import useGetStoresByFiltering from "api-manage/hooks/react-query/store/useGetStoresByFiltering";

const FreeDeliveryStoreGrid = ({ filterParams = {} }) => {
  const { t } = useTranslation();

  const { data, isLoading } = useGetStoresByFiltering({
    type: "free_delivery",
    limit: 20,
    enabled: true,
    ...filterParams,
  });

  const stores = (data?.pages ?? []).flatMap((p) => p?.stores ?? []);

  if (!isLoading && stores.length === 0) {
    return (
      <Typography sx={{ color: "neutral.500", py: 4, px: { xs: "16px", md: 0 } }}>
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
};

export default FreeDeliveryStoreGrid;
