import React, { useEffect, useState } from "react";
import { Stack, styled } from "@mui/system";
import { PrimaryButton } from "../../Map/map.style";
import {
  alpha,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSelector } from "react-redux";

import { useRouter } from "next/router";
import {
  setBuyNowItemList,
  setCampaignItemList,
} from "../../../redux/slices/cart";
import toast from "react-hot-toast";
import { useWishListDelete } from "../../../api-manage/hooks/react-query/wish-list/useWishListDelete";
import { removeWishListItem } from "../../../redux/slices/wishList";
import NotAvailableCard from "./NotAvailableCard";
import { getCurrentModuleType } from "../../../helper-functions/getCurrentModuleType";
import { isVariationAvailable } from "components/product-details/product-details-section/helperFunction";
import GetLocationAlert from "components/GetLocationAlert";
import CustomModal from "components/modal";

export const BottomStack = styled(Stack)(({ theme }) => ({
  width: "100%",
}));

const ProductInformationBottomSection = ({
  addToCard,
  productDetailsData,
  selectedOptions,
  handleUpdateToCart,
  dispatchRedux,
  addToFavorite,
  wishListCount,
  setWishListCount,
  cartItemQuantity,
  handleModalClose,
  isLoading,
  t,
  addToCartMutate,
  updateIsLoading,
}) => {
  const theme = useTheme();
  const { cartList } = useSelector((state) => state.cart);
  const { wishLists } = useSelector((state) => state.wishList);
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [openLocationAlert, setOpenLocationAlert] = useState(false);

  const variationErrorToast = () =>
    toast.error(
      t(
        "This variation is out of stock. Choose another variation to proceed further."
      )
    );

  // Match by product id + store_id only. Variation is intentionally NOT
  // compared here: the modal usually auto-selects the first variation on
  // open, which often doesn't match what's already in cart — that would
  // keep the button stuck on "Add to Cart" even when the item is in cart.
  // String-coerce both sides so number-vs-string id/store_id mismatches
  // (a common shape inconsistency between detail API and cart API) match.
  const isInCart = (id) => {
    if (!(cartList?.length > 0)) return false;
    const storeIdToMatch = productDetailsData?.store_id;
    return !!cartList?.find(
      (item) =>
        String(item?.id) === String(id) &&
        (storeIdToMatch == null ||
          String(item?.store_id) === String(storeIdToMatch))
    );
  };
  const router = useRouter();

  const ensureLocation = () => {
    if (typeof window === "undefined") return true;
    const hasLocation = Boolean(localStorage.getItem("location"));
    if (!hasLocation) {
      setOpenLocationAlert(true);
      return false;
    }
    return true;
  };

  const handleRedirect = () => {
    if (productDetailsData?.isCampaignItem) {
      dispatchRedux(setCampaignItemList(productDetailsData));
      router.push("/checkout?page=campaign", undefined, { shallow: true });
    } else {
      dispatchRedux(setBuyNowItemList(productDetailsData));

      // const isExist = isInCart(productDetailsData?.id);
      // if (isExist) {
      //   dispatchRedux(setUpdateItemToCart(productDetailsData));
      // } else {
      //   dispatchRedux(setCart(productDetailsData));
      // }
      router.push(
        {
          pathname: "/checkout",
          query: {
            page: "buy_now",
            // id: productDetailsData?.id,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const handleRedirectToCheckoutClick = () => {
    if (!ensureLocation()) return;
    if (productDetailsData?.selectedOption?.length > 0) {
      if (productDetailsData?.selectedOption?.[0]?.stock === 0) {
        variationErrorToast();
      } else {
        handleRedirect();
        handleModalClose?.();
      }
    } else {
      handleRedirect();
    }
  };
  const isInWishList = (id) => {
    return !!wishLists?.item?.find((wishItem) => wishItem.id === id);
  };

  const onSuccessHandlerForDelete = (res) => {
    dispatchRedux(removeWishListItem(productDetailsData?.id));
    setWishListCount(wishListCount - 1);
    toast.success(res.message, {
      id: "wishlist",
    });
  };
  const { mutate } = useWishListDelete();
  const deleteWishlistItem = (id) => {
    mutate(id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };
  useEffect(() => {}, [wishListCount]);

  const handleVariationAvailability = (checkFor, cartItem) => {
    if (!ensureLocation()) return;
    if (productDetailsData?.selectedOption?.length > 0) {
      if (productDetailsData?.selectedOption?.[0]?.stock === 0) {
        variationErrorToast();
      } else {
        checkFor === "add" ? addToCard() : handleUpdateToCart(cartItem);
      }
    } else {
      checkFor === "add" ? addToCard() : handleUpdateToCart(cartItem);
    }
  };

  const handleWishlist = () => (
    <>
      {isInWishList(productDetailsData?.id) && (
        <Button
          variant="outlined"
          onClick={() => deleteWishlistItem(productDetailsData?.id)}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <i
              className="fi fi-sr-heart"
              style={{
                fontSize: "16px",
                display: "flex",
                lineHeight: 1,
                color: theme.palette.primary.main,
              }}
            />
            <Typography>{wishListCount}</Typography>
          </Stack>
        </Button>
      )}
      {!isInWishList(productDetailsData?.id) && (
        <Button variant="outlined" onClick={addToFavorite}>
          <Stack direction="row" spacing={1} alignItems="center">
            <i
              className="fi fi-rr-heart"
              style={{
                fontSize: "16px",
                display: "flex",
                lineHeight: 1,
              }}
            />
            <Typography>{wishListCount}</Typography>
          </Stack>
        </Button>
      )}
    </>
  );

  const cartActionSx = {
    flex: 1,
    minWidth: 0,
    height: "44px",
    maxHeight: "44px",
    px: 2,
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: { xs: "13px", md: "14px" },
    boxShadow: "none",
    backgroundColor: alpha(
      theme.palette.neutral?.[400] || theme.palette.text.secondary,
      0.12
    ),
    color: theme.palette.text.primary,
    border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
    "&:hover": {
      boxShadow: "none",
      backgroundColor: alpha(
        theme.palette.neutral?.[400] || theme.palette.text.secondary,
        0.2
      ),
      borderColor: alpha(theme.palette.text.primary, 0.28),
    },
  };

  const buyNowSx = {
    flex: 1,
    minWidth: 0,
    height: "44px",
    maxHeight: "44px",
    px: 2,
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 700,
    fontSize: { xs: "13px", md: "14px" },
    boxShadow: "none",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.paper,
    "&:hover": {
      boxShadow: "none",
      backgroundColor: theme.palette.primary.dark,
    },
  };

  const actionsHandler = () => (
    <BottomStack direction="row" width="100%" gap={1.5}>
      {!productDetailsData?.isCampaignItem && (
        <>
          {!isInCart(productDetailsData?.id) &&
            productDetailsData?.stock > 0 &&
            isVariationAvailable(productDetailsData) && (
              <LoadingButton
                onClick={() => handleVariationAvailability("add")}
                disabled={productDetailsData?.stock === 0}
                loading={isLoading}
                loadingPosition="end"
                loadingIndicator={
                  <CircularProgress
                    size={15}
                    sx={{ color: theme.palette.text.primary }}
                  />
                }
                endIcon={<span />}
                sx={{
                  ...cartActionSx,
                  "&.MuiLoadingButton-loading": {
                    backgroundColor: alpha(
                      theme.palette.neutral?.[400] || theme.palette.text.secondary,
                      0.12
                    ),
                    color: theme.palette.text.primary,
                  },
                  "& .MuiLoadingButton-loadingIndicatorEnd": {
                    position: "relative",
                    right: 0,
                    ml: 1,
                  },
                }}
              >
                {t("Add to Cart")}
              </LoadingButton>
            )}
          {isInCart(productDetailsData?.id) && (
            <LoadingButton
              onClick={() =>
                handleVariationAvailability(
                  "update",
                  isInCart(productDetailsData?.id)
                )
              }
              loading={updateIsLoading}
              loadingPosition="end"
              loadingIndicator={
                <CircularProgress
                  size={15}
                  sx={{ color: theme.palette.text.primary }}
                />
              }
              endIcon={<span />}
              sx={{
                ...cartActionSx,
                "&.MuiLoadingButton-loading": {
                  backgroundColor: alpha(
                    theme.palette.neutral?.[400] || theme.palette.text.secondary,
                    0.12
                  ),
                  color: theme.palette.text.primary,
                },
                "& .MuiLoadingButton-loadingIndicatorEnd": {
                  position: "relative",
                  right: 0,
                  ml: 1,
                },
              }}
            >
              {t("Update To Cart")}
            </LoadingButton>
          )}
        </>
      )}

      {productDetailsData?.stock > 0 &&
      isVariationAvailable(productDetailsData) ? (
        <Button onClick={() => handleRedirectToCheckoutClick()} sx={buyNowSx}>
          {productDetailsData?.isCampaignItem ? t("Order Now") : t("Buy Now")}
        </Button>
      ) : (
        <Button
          onClick={() => handleRedirectToCheckoutClick()}
          disabled={
            productDetailsData?.stock === 0 ||
            !isVariationAvailable(productDetailsData)
          }
          sx={{
            ...buyNowSx,
            backgroundColor: alpha(theme.palette.error.main, 0.12),
            color: theme.palette.error.main,
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.18),
              boxShadow: "none",
            },
          }}
        >
          {t("Out of Stock")}
        </Button>
      )}
    </BottomStack>
  );
  const handleUnavailability = () => (
    <Stack spacing={2}>
      {getCurrentModuleType() !== "ecommerce" && (
        <NotAvailableCard
          endTime={productDetailsData?.available_time_ends}
          startTime={productDetailsData?.available_time_starts}
          moduleType={productDetailsData?.module?.module_type}
        />
      )}
      {productDetailsData?.schedule_order && <>{actionsHandler()}</>}
    </Stack>
  );

  // here unavailability checking is not necessary for modules except food , food modules also don't have details page

  return (
    <>
      {actionsHandler()}
      {productDetailsData?.is_prescription_required == 1 && (
        <Typography
          color={theme.palette.error.main}
          fontSize="13px"
          textTransform="capitalize"
        >
          {t("prescription is required")}
        </Typography>
      )}
      <CustomModal
        openModal={openLocationAlert}
        handleClose={() => setOpenLocationAlert(false)}
      >
        <GetLocationAlert setOpenAlert={setOpenLocationAlert} />
      </CustomModal>
    </>
  );
};

export default ProductInformationBottomSection;
