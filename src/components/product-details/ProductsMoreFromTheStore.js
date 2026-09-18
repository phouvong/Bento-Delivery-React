import { useEffect, useState } from "react";
import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import useGetMoreFromStores from "../../api-manage/hooks/react-query/product-details/useGetMoreFromStore";
import NewProductCard from "components/cards/newCard/NewProductCard";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const STATIC_MORE_ITEMS = [
  {
    "id": 65,
    "name": "Avia Men's Tenon",
    "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2024-10-29-6720ca16a11cf.png",
    "price": 120,
    "discounted_price": 90,
    "discount": 25,
    "discount_type": "percent",
    "order_count": 2,
    "avg_rating": 0
  },
  {
    "id": 126,
    "name": "YOTAMI Womens Tops",
    "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2024-10-29-6720d11e0b7da.png",
    "price": 150,
    "discounted_price": 112.5,
    "discount": 25,
    "discount_type": "percent",
    "order_count": 1,
    "avg_rating": 0
  },
  {
    "id": 49,
    "name": "Men's Jeans Pant",
    "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2024-10-29-6720c943ae303.png",
    "price": 49,
    "discounted_price": 43.12,
    "discount": 12,
    "discount_type": "percent",
    "order_count": 0,
    "avg_rating": 0
  },
  {
    "id": 475,
    "name": "Men's Black Leather Sandals",
    "image_full_url": "https://6ammart-dev.6amdev.xyz/storage/app/public/product/2026-04-29-69f1a447d1082.WebP",
    "price": 2500,
    "discounted_price": 1875,
    "discount": 25,
    "discount_type": "percent",
    "order_count": 0,
    "avg_rating": 0
  }
];

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

  const isServiceModule = getCurrentModuleType() === "service";

  const { refetch } = useGetMoreFromStores(pageParams, handleSuccess);

  // useEffect(() => {
  //   refetch();
  // }, []);
  useEffect(() => {
    if (isServiceModule) {
      setMoreItem(STATIC_MORE_ITEMS);
    } else {
      refetch();
    }
  }, [isServiceModule, productDetails?.id]);

  if (!moreItem || moreItem.length === 0) return null;

  const items = moreItem?.slice(0, 4) ?? [];

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "12px",
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
