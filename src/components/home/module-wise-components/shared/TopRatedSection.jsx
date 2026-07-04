import { Box, Grid, Typography } from "@mui/material";
import useGetMostReviewed from "api-manage/hooks/react-query/useGetMostReviewed";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "components/Shimmer/ProductCardSimmer";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const TopRatedSection = ({ isPharmacy = false }) => {
  const { t } = useTranslation();
  const { data, isLoading, refetch } = useGetMostReviewed({ type: "all" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    refetch();
  }, []);

  const items = data?.products ?? [];
  const isEmpty = !isLoading && !items.length;

  if (isEmpty) {
    return (
      <Box sx={{ py: 4, px: "16px" }}>
        <Typography sx={{ color: "neutral.500" }}>
          {t("No top rated items found")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ overflow: "hidden" }}>
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
        {isLoading
          ? [...Array(10)].map((_, i) => (
              <Grid key={i} item xs={6} sm={4} md={3} lg={2.4}>
                <ProductCardSimmer cardWidth="100%" />
              </Grid>
            ))
          : items.map((item) => (
              <Grid key={item?.id} item xs={6} sm={4} md={3} lg={2.4}>
                <NewProductCard
                  isPharmacy={isPharmacy}
                  variant="vertical"
                  item={item}
                  cardWidth="100%"
                />
              </Grid>
            ))}
      </Grid>
    </Box>
  );
};

export default TopRatedSection;
