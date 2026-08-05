import React from "react";
import { Stack, styled } from "@mui/system";
import { alpha, Button, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { setBuyNowItemList } from "redux/slices/cart";
import Loading from "components/custom-loading/Loading";

// Fixed id so rapid repeated clicks refresh the same toast instead of
// stacking duplicates.
const VARIATION_TOAST_ID = "service-select-variation";

export const BottomStack = styled(Stack)(({ theme }) => ({
  width: "100%",
}));

// Splits a multi-variation selection into one flat cart-shaped line per variation.
const buildBuyNowPayload = (data, isCampaignBooking) => {
  const model = isCampaignBooking ? "ItemCampaign" : "Service";
  // Raw service objects only carry thumbnail_full_url — the normal add-to-cart
  // flow picks this up server-side via the cart API response, but buy-now
  // skips that round-trip, so normalize here to avoid a missing billing image.
  const image_full_url = data?.image_full_url ?? data?.thumbnail_full_url;
  const variantSelections = data?.selectedOption?.[0];
  if (!Array.isArray(variantSelections) || variantSelections.length === 0) {
    return { ...data, model, image_full_url };
  }
  return variantSelections.map(({ variation, quantity }) => {
    const unitPrice = variation?.price ?? 0;
    return {
      ...data,
      model,
      image_full_url,
      selectedOption: variation,
      quantity,
      price: unitPrice,
      totalPrice: unitPrice * (quantity ?? 1),
      discount: variation?.discount ?? 0,
      discount_type: variation?.discount_type ?? null,
    };
  });
};

const ServiceInformationBottomSection = ({
  addToCard,
  handleUpdateToCart,
  productUpdate,
  productDetailsData,
  handleModalClose,
  isLoading,
  t,
  directionSX,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();

  const variationSelected = productDetailsData?.selectedOption?.[0]?.length > 0;
  const variationRequired =
    productDetailsData?.variations?.length > 0 && !variationSelected;

  const isCampaignBooking =
    Boolean(productDetailsData?.isCampaignService) ||
    String(router?.query?.campaign) === "1";

  const handleBookNow = () => {
    dispatch(
      setBuyNowItemList(
        buildBuyNowPayload(productDetailsData, isCampaignBooking),
      ),
    );
    router.push(
      { pathname: "/service/checkout", query: { page: "buy_now" } },
      undefined,
      { shallow: true },
    );
    handleModalClose?.();
  };

  const withVariationGuard = (action) => () => {
    if (variationRequired) {
      toast.error(t("Please select a variation"), { id: VARIATION_TOAST_ID });
      return;
    }
    action();
  };

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
      0.12,
    ),
    color: theme.palette.text.primary,
    border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
    "&:hover": {
      boxShadow: "none",
      backgroundColor: alpha(
        theme.palette.neutral?.[400] || theme.palette.text.secondary,
        0.2,
      ),
      borderColor: alpha(theme.palette.text.primary, 0.28),
    },
  };

  const bookNowSx = {
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
    "&.Mui-disabled": {
      color: alpha(theme.palette.primary.contrastText, 0.5),
    },
  };

  return (
    <BottomStack direction={directionSX || "row"} width="100%" gap={1.5}>
      {!isCampaignBooking && (
        <Button
          onClick={
            // Updating an already-cart-added item is allowed to zero out
            // every variation — that means "remove these variants from the
            // cart", and handleUpdateToCart already deletes them correctly.
            // Only the initial add-to-cart path requires a selection.
            productUpdate
              ? handleUpdateToCart
              : withVariationGuard(addToCard)
          }
          sx={cartActionSx}
        >
          {isLoading ? (
            <Loading />
          ) : productUpdate ? (
            t("Update Cart")
          ) : (
            t("Add to Cart")
          )}
        </Button>
      )}

      <Button onClick={withVariationGuard(handleBookNow)} sx={bookNowSx}>
        {t("Book Now")}
      </Button>
    </BottomStack>
  );
};

export default ServiceInformationBottomSection;
