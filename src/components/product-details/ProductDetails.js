import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import useGetStoreDetails from "api-manage/hooks/react-query/store/useGetStoreDetails";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import { t } from "i18next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useWishListGet } from "api-manage/hooks/react-query/wish-list/useWishListGet";
import { useDispatch, useSelector } from "react-redux";
import { addWishList, removeWishListItem, setWishList } from "redux/slices/wishList";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { not_logged_in_message } from "utils/toasterMessages";
import SinglePoster from "../home/module-wise-components/ecommerce/SinglePoster";
import FeaturedStores from "../home/module-wise-components/pharmacy/featured-stores";
import DetailsAndReviews from "./details-and-reviews/DetailsAndReviews";
import ProductDetailsSection from "./product-details-section/ProductDetailsSection";
import ProductReviewsSection from "./ProductReviewsSection";
import ProductsMoreFromTheStore from "./ProductsMoreFromTheStore";
import StoreDetails from "./StoreDetails";

const ProductDetails = ({ productDetailsData, configData }) => {
  const theme = useTheme();
  const storeImageBaseUrl = configData?.base_urls?.store_image_url;
  const reduxDispatch = useDispatch();
  const router = useRouter();
  const wishLists = useSelector((state) => state?.wishList?.wishLists);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { data: wishlistData } = useWishListGet({}, !!token);
  const [showProductNameInBar, setShowProductNameInBar] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (typeof document === "undefined") return;

    let observer;
    const attach = () => {
      const node = document.querySelector("[data-product-name]");
      if (!node) return false;
      observer = new IntersectionObserver(
        ([entry]) => {
          setShowProductNameInBar(!entry.isIntersecting);
        },
        { threshold: 0, rootMargin: "-52px 0px 0px 0px" },
      );
      observer.observe(node);
      return true;
    };

    if (attach()) return () => observer?.disconnect();

    const mo = new MutationObserver(() => {
      if (attach()) mo.disconnect();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      observer?.disconnect();
    };
  }, [productDetailsData?.id]);
  useEffect(() => {
    if (wishlistData) {
      reduxDispatch(setWishList(wishlistData));
    }
  }, [wishlistData]);

  useEffect(() => {
    if (productDetailsData?.id && wishLists?.item) {
      const found = wishLists.item.some(
        (item) => item.id === productDetailsData.id,
      );
      setIsWishlisted(found);
    }
  }, [productDetailsData?.id, wishLists?.item]);

  const { mutate: addFavoriteMutation } = useAddToWishlist();
  const { mutate } = useWishListDelete();
  const wishlistPending = useRef(false);
  const { data: storeData, refetch } = useGetStoreDetails(
    productDetailsData?.store_id,
  );
  useEffect(() => {
    if (productDetailsData?.store_id) {
      refetch();
    }
  }, []);
  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    if (wishlistPending.current) return;
    let token = undefined;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    if (token) {
      wishlistPending.current = true;
      addFavoriteMutation(productDetailsData?.id, {
        onSuccess: (response) => {
          if (response) {
            reduxDispatch(addWishList(productDetailsData));
            setIsWishlisted(true);
            toast.success(response?.message);
          }
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
        onSettled: () => {
          wishlistPending.current = false;
        },
      });
    } else toast.error(t(not_logged_in_message));
  };
  const removeFromWishlistHandler = (e) => {
    e.stopPropagation();
    if (wishlistPending.current) return;
    const onSuccessHandlerForDelete = (res) => {
      reduxDispatch(removeWishListItem(productDetailsData?.id));
      setIsWishlisted(false);
      toast.success(res.message, {
        id: "wishlist",
      });
    };
    wishlistPending.current = true;
    mutate(productDetailsData?.id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
      onSettled: () => {
        wishlistPending.current = false;
      },
    });
  };

  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;
  const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";
  const storeName = productDetailsData?.store_details?.name ?? storeData?.name;
  const storeId = productDetailsData?.store_id;
  const storeHref =
    storeId && moduleParam
      ? `/store/${storeId}?module=${moduleParam}`
      : storeId
      ? `/store/${storeId}`
      : undefined;

  const breadcrumbItems = [
    {
      key: "home",
      label: t("Home"),
      icon: (
        <i
          className="fi fi-rr-home"
          style={{ fontSize: 12, display: "flex", lineHeight: 1 }}
        />
      ),
      onRedirect: homeHref,
    },
    ...(storeName
      ? [
          {
            key: "store",
            label: storeName,
            ...(storeHref ? { onRedirect: storeHref } : {}),
          },
        ]
      : []),
    {
      key: "product",
      label: productDetailsData?.name,
    },
  ];

  return (
    <CustomStackFullWidth
      paddingTop={{ xs: 0, md: "2.5rem" }}
      //paddingBottom="2.5rem"
      //sx={{ minHeight: "100vh" }}
    >
      {/* Mobile-only fixed top bar with back arrow + dynamic title */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          alignItems: "center",
          gap: 1,
          height: 52,
          px: 1.5,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          borderBottomLeftRadius: "15px",
          borderBottomRightRadius: "15px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        }}
      >
        <IconButton
          onClick={() => router.back()}
          size="small"
          aria-label={t("Back")}
          sx={{ color: theme.palette.text.primary }}
        >
          <i
            className="fi fi-rr-arrow-small-left"
            style={{ fontSize: "18px", display: "flex", lineHeight: 1 }}
          />
        </IconButton>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "16px",
            color: theme.palette.text.primary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flex: 1,
            minWidth: 0,
          }}
        >
          {showProductNameInBar ? productDetailsData?.name : t("Item Details")}
        </Typography>
        {showProductNameInBar && (
          <IconButton
            onClick={
              isWishlisted ? removeFromWishlistHandler : addToWishlistHandler
            }
            size="small"
            aria-label={t(
              isWishlisted ? "Remove from wishlist" : "Add to wishlist",
            )}
            sx={{
              color: isWishlisted
                ? theme.palette.error.main
                : theme.palette.text.primary,
            }}
          >
            <i
              className={isWishlisted ? "fi fi-sr-heart" : "fi fi-rr-heart"}
              style={{ fontSize: "18px", display: "flex", lineHeight: 1 }}
            />
          </IconButton>
        )}
      </Box>

      {/* Spacer so content isn't hidden under the fixed bar on mobile */}
      <Box sx={{ display: { xs: "block", md: "none" }, height: 52 }} />

      <CustomStackFullWidth
        sx={{
          px: { xs: 1.5, sm: 3, lg: 0 },
          py: { xs: 1.5, sm: 0, lg: 0 },
          mb: { xs: 1.25, md: 2 },
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          "& nav": {
            flexWrap: "nowrap",
            minWidth: "max-content",
          },
          "& nav span": {
            fontSize: { xs: "13px", md: "16px" },
          },
        }}
      >
        <CustomPageBreadCrumb items={breadcrumbItems} />
      </CustomStackFullWidth>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <CustomStackFullWidth spacing={{ xs: 2, md: 5 }}>
            <Box>
              <ProductDetailsSection
                productDetailsData={productDetailsData}
                configData={configData}
                addToWishlistHandler={addToWishlistHandler}
                removeFromWishlistHandler={removeFromWishlistHandler}
                isWishlisted={isWishlisted}
              />
            </Box>
            <DetailsAndReviews
              configData={configData}
              description={productDetailsData?.description}
              reviews={productDetailsData?.reviews}
              productId={productDetailsData?.id}
              storename={productDetailsData?.store_details?.name}
            />
            <ProductReviewsSection
              productId={productDetailsData?.id}
              storename={productDetailsData?.store_details?.name}
            />
            <CustomStackFullWidth>
              <FeaturedStores
                slide="3"
                title="Popular Store"
                configData={configData}
              />
            </CustomStackFullWidth>
          </CustomStackFullWidth>
        </Grid>
        <Grid item xs={12} md={4}>
          <CustomStackFullWidth spacing={3}>
            <StoreDetails
              storeDetails={productDetailsData?.store_details ?? storeData}
              storeImageBaseUrl={storeImageBaseUrl}
            />
            <CustomStackFullWidth sx={{ display: { xs: "none", md: "block" } }}>
              <ProductsMoreFromTheStore productDetails={productDetailsData} />
            </CustomStackFullWidth>
          </CustomStackFullWidth>
        </Grid>

        <Grid item xs={12} sx={{ display: { xs: "block", md: "none" } }}>
          <ProductsMoreFromTheStore productDetails={productDetailsData} />
        </Grid>

        <Grid item xs={12}>
          <SinglePoster />
        </Grid>
      </Grid>
    </CustomStackFullWidth>
  );
};

export default ProductDetails;
