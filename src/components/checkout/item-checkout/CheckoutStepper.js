import React from "react";
import { Breadcrumbs, Link as MuiLink, Stack, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getStoresOrRestaurants } from "../../../helper-functions/getStoresOrRestaurants";

const getCurrentLabel = (pathname, t) => {
  if (pathname?.includes("/cart")) return t("Cart");
  if (pathname?.includes("/checkout")) return t("Checkout");
  return t("Checkout");
};

const CheckoutStepper = ({
  text,
  text1,
  text2,
  storeData,
  homeHref,
  storeHref: storeHrefOverride,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const { cartList, campaignItemList, buyNowItemList } = useSelector(
    (state) => state.cart
  );

  // The checkout store comes from the URL (store_id). Only trust a cart item as
  // a name/id fallback when it actually belongs to that store — otherwise a
  // stale item from another store/module would mislabel the breadcrumb.
  const queryStoreId =
    router?.query?.store_id != null ? String(router.query.store_id) : null;
  const sourceItem =
    campaignItemList?.[0] || buyNowItemList?.[0] || cartList?.[0];
  const sourceMatchesStore =
    !queryStoreId || String(sourceItem?.store_id) === queryStoreId;

  const storeName =
    storeData?.name ||
    (sourceMatchesStore
      ? sourceItem?.store_name || sourceItem?.store?.name
      : null);
  const storeId =
    storeData?.id ||
    queryStoreId ||
    (sourceMatchesStore ? sourceItem?.store_id : null);

  const currentLabel = text || text1 || getCurrentLabel(router?.pathname, t);
  const listLabel = t(getStoresOrRestaurants());

  const queryModule =
    typeof router?.query?.module === "string" ? router.query.module : null;
  const resolvedHomeHref =
    homeHref ?? (queryModule ? `/home?module=${queryModule}` : "/home");

  // Link back to the store using its slug + module so the store-details page
  // resolves the correct store under the right module (not a numeric-id lookup
  // that can collide across modules).
  const storeSlug =
    storeData?.slug ||
    (typeof router?.query?.store_slug === "string"
      ? router.query.store_slug
      : null);
  const storeLinkId = storeSlug || storeId;
  const computedStoreHref = storeLinkId
    ? queryModule
      ? `/store/${storeLinkId}?module=${queryModule}`
      : `/store/${storeLinkId}`
    : null;
  const storeHref = storeHrefOverride ?? computedStoreHref;

  return (
    <Stack spacing={{ xs: 0.5, md: 0.5 }} sx={{ width: "100%" }}>
      <Typography
        variant="h4"
        sx={{
          display: { xs: "none", md: "block" },
          fontWeight: 700,
          fontSize: { xs: "1.5rem", md: "2rem" },
          color: theme.palette.text.primary,
        }}
      >
        {currentLabel}
      </Typography>
      <Breadcrumbs
        separator={
          <NavigateNextIcon
            fontSize="small"
            sx={{ color: theme.palette.text.secondary }}
          />
        }
        aria-label="breadcrumb"
      >
        <Link href={resolvedHomeHref} passHref legacyBehavior>
          <MuiLink
            underline="hover"
            color="inherit"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: { xs: "0.8rem", md: "0.875rem" },
              color: theme.palette.text.secondary,
            }}
          >
            <HomeOutlinedIcon sx={{ fontSize: 18 }} />
            {t("Home")}
          </MuiLink>
        </Link>

        {storeName &&
          (storeHref ? (
            <Link href={storeHref} passHref legacyBehavior>
              <MuiLink
                underline="hover"
                color="inherit"
                sx={{
                  fontSize: { xs: "0.8rem", md: "0.875rem" },
                  color: theme.palette.text.secondary,
                }}
              >
                {storeName}
              </MuiLink>
            </Link>
          ) : (
            <Typography
              sx={{
                fontSize: { xs: "0.8rem", md: "0.875rem" },
                color: theme.palette.text.secondary,
              }}
            >
              {storeName}
            </Typography>
          ))}
        <Typography
          sx={{
            fontSize: { xs: "0.8rem", md: "0.875rem" },
            color: theme.palette.text.primary,
            fontWeight: 500,
          }}
        >
          {currentLabel}
        </Typography>
      </Breadcrumbs>
    </Stack>
  );
};

export default CheckoutStepper;
