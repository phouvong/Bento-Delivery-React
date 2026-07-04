import { useEffect, useState } from "react";
import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import useGetMoreFromStores from "../../api-manage/hooks/react-query/product-details/useGetMoreFromStore";
import NewProductCard from "components/cards/newCard/NewProductCard";

const ProductsMoreFromTheStore = ({ productDetails }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [offSet, setOffSet] = useState(1);
  const [moreItem, setMoreItem] = useState([]);

  const limit = 10;
  const pageParams = {
    productId: productDetails?.id,
    offset: offSet,
    limit: limit,
  };

  const handleSuccess = (res) => {
    if (res) {
      setMoreItem(res);
    }
  };

  const { refetch } = useGetMoreFromStores(pageParams, handleSuccess);

  useEffect(() => {
    refetch();
  }, []);

  if (!moreItem || moreItem.length === 0) return null;

  const items = moreItem?.slice(0, 4) ?? [];

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "12px",
        //border: `1px solid ${theme.palette.divider}`,
        p: { xs: 1.5, md: 2 },
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: { xs: "15px", md: "16px" },
          color: theme.palette.text.primary,
          textDecoration: "none",
          mb: { xs: 1, md: 1.25 },
        }}
        component="h2"
      >
        {t("More From Same Store")}
      </Typography>

      <Stack
        divider={
          <Box
            sx={{
              height: "1px",
              backgroundColor: alpha(theme.palette.text.primary, 0.08),
              my: { xs: 1, md: 1.25 },
            }}
          />
        }
      >
        {items.map((item) => (
          <NewProductCard key={item?.id} variant="horizontal" item={item} />
        ))}
      </Stack>
    </Box>
  );
};

ProductsMoreFromTheStore.propTypes = {};

export default ProductsMoreFromTheStore;
