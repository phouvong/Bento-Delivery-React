import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  Drawer,
  IconButton,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import NextImage from "components/NextImage";
import NewProductCardBogo from "components/cards/newCard/NewProductCardBogo";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getGuestId, getToken } from "helper-functions/getToken";
import { handleStoreRedirect } from "helper-functions/handleStoreRedirect";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import useAddBogoToCart from "api-manage/hooks/react-query/add-cart/useAddBogoToCart";
import useUpdateBogoCart from "api-manage/hooks/react-query/add-cart/useUpdateBogoCart";
import useRemoveBogoFromCart from "api-manage/hooks/react-query/add-cart/useRemoveBogoFromCart";

// A raw buy/free line from GET /bogo/offers/{id} (§5.3 of the BOGO API
// guide) → the shape NewProductCardBogo renders. Item-level discounts never
// apply inside a bundle, so there is nothing to zero out here (unlike
// Stackfood's `mapBundleFoodItem`, which forces `discount: 0` on a richer
// generic food shape) — this API already hands back bundle-final prices.
const mapBundleItem = (raw) => ({
  id: raw?.item_id ?? raw?.service_id,
  name: raw?.name,
  image_full_url: raw?.image_full_url,
  price: raw?.price,
  quantity: raw?.quantity ?? 1,
  is_free: !!raw?.is_free,
  variationText: raw?.variation_summary,
  addOnSummary: raw?.add_on_summary,
  avg_rating: raw?.avg_rating,
});

const SidebarPanel = styled(Stack)(({ theme }) => ({
  width: "366px",
  maxWidth: "366px",
  flexShrink: 0,
  boxSizing: "border-box",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.1), 0px 1px 4px 0px rgba(0,0,0,0.05)",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    maxWidth: "100%",
    borderRadius: 0,
  },
}));

const BannerImage = styled(Box)({
  position: "relative",
  width: "calc(100% - 8px)",
  aspectRatio: "354 / 118",
  borderRadius: "16px 16px 0 0",
  overflow: "hidden",
  margin: "4px 4px 0",
});

const InfoBox = styled(Stack)(({ theme }) => ({
  width: "100%",
  gap: "4px",
  padding: "12px",
  borderRadius: "8px",
  backgroundColor: theme.palette.background.secondary,
}));

const StepperPill = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  height: "44px",
  padding: "0 4px",
  borderRadius: "8px",
  backgroundColor: theme.palette.background.secondary,
  flexShrink: 0,
}));

const StepperButton = styled(IconButton)({
  width: "36px",
  height: "36px",
  padding: "6px",
  borderRadius: "8px",
  "& i": {
    display: "flex",
    fontSize: "16px",
  },
});

const BogoItemDetailsModal = ({ open, onClose, bundle, offer }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });
  const token = getToken();
  const guestId = getGuestId();

  const cartGroups = useSelector((state) => state.cart?.cartGroups) ?? [];
  const taxIncluded = useSelector((state) => state.configData?.configData?.tax_included) === 1;
  const store = bundle?.store;

  // `cart/get-all` folds a bundle into one entry per group carrying
  // `bogo_details` (§6.2) — no ungrouped-row reconciliation needed, unlike
  // Stackfood's raw cart endpoint.
  const existingCartRow = cartGroups
    .find((group) => String(group?.store?.id) === String(store?.id))
    ?.carts?.find((row) => row?.bogo_details?.bundle_id === bundle?.bundle_id);
  const isInCart = !!existingCartRow;
  const existingBogoGroupId = existingCartRow?.bogo_details?.bogo_group_id;
  const existingQuantity = existingCartRow?.bogo_details?.quantity || 1;

  const [quantity, setQuantity] = useState(existingQuantity);

  const { mutate: addMutate, isLoading: addLoading } = useAddBogoToCart();
  const { mutate: updateMutate, isLoading: updateLoading } = useUpdateBogoCart();
  const { mutate: removeMutate, isLoading: removeLoading } = useRemoveBogoFromCart();
  const isCartActionLoading = addLoading || updateLoading || removeLoading;

  if (!bundle) return null;

  const buyItems = (bundle?.buy_items || []).map(mapBundleItem);
  const getItems = (bundle?.free_items || []).map(mapBundleItem);

  const unitPrice = bundle?.final_price ?? 0;
  const unitOriginalPrice = bundle?.original_price ?? unitPrice;
  const total = unitPrice * quantity;
  const oldTotal = unitOriginalPrice * quantity;
  const hasDiscount = oldTotal > total;

  const guestParam = !token && guestId ? { guest_id: guestId } : {};

  const handleAddToCart = () => {
    if (!bundle?.bundle_id) return;
    addMutate(
      { ...guestParam, bundle_id: bundle.bundle_id, quantity },
      {
        onSuccess: (res) => {
          toast.success(res?.message || t("Item added to cart"));
          onClose?.();
        },
        onError: onErrorResponse,
      },
    );
  };

  const handleUpdateCart = () => {
    if (!existingBogoGroupId) return;
    if (quantity === existingQuantity) {
      toast.error(t("Please change the quantity to update"), {
        id: "bogo-cart-no-change",
      });
      return;
    }
    updateMutate(
      { ...guestParam, bogo_group_id: existingBogoGroupId, quantity },
      {
        onSuccess: (res) => {
          toast.success(res?.message || t("Cart updated"));
          onClose?.();
        },
        onError: onErrorResponse,
      },
    );
  };

  const handleRemoveFromCart = () => {
    if (!existingBogoGroupId) return;
    removeMutate(
      { ...guestParam, bogo_group_id: existingBogoGroupId },
      {
        onSuccess: (res) => {
          toast.success(res?.message || t("Cart item remove successfully"));
          setQuantity(1);
        },
        onError: onErrorResponse,
      },
    );
  };

  const handleAddOrUpdateCart = isInCart ? handleUpdateCart : handleAddToCart;

  // Not in cart yet: nothing to remove, so minus stays disabled until the
  // stepper is bumped above 1. Already in cart: minus is always live — at
  // quantity 1 it swaps to a trash icon that removes the bundle outright.
  const canDecrement = isInCart || quantity > 1;

  const SectionHeader = ({ title }) => (
    <Typography
      component="h3"
      sx={{
        fontSize: "20px",
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: "-0.6px",
        color: "neutral.1050",
      }}
    >
      {title}
    </Typography>
  );

  const LeftSideContent = (
    <SidebarPanel>
      <BannerImage>
        <NextImage src={offer?.image_full_url} alt={offer?.title} fill objectFit="cover" />
      </BannerImage>

      <Stack sx={{ px: "16px", pt: "16px", pb: "20px", gap: "16px" }}>
        <Stack sx={{ gap: "8px" }}>
          <Typography
            component="h2"
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.6px",
              color: "neutral.1050",
            }}
          >
            {offer?.title}
          </Typography>
          <Typography sx={{ fontSize: "16px", lineHeight: 1.3, color: "neutral.500" }}>
            {offer?.description}
          </Typography>
        </Stack>

        <InfoBox direction="row" alignItems="center" justifyContent="space-between">
          <Stack sx={{ gap: "2px" }}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "-0.48px",
                color: "info.main",
              }}
            >
              {t("Buy {{buy}} Get {{get}} Free", {
                buy: offer?.buy_qty ?? 1,
                get: offer?.get_qty ?? 1,
              })}
            </Typography>
            {offer?.valid_until && (
              <Typography sx={{ fontSize: "12px", color: "neutral.500" }}>
                {t("Valid Until")} : {offer.valid_until}
              </Typography>
            )}
          </Stack>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.6px",
              color: "neutral.1050",
              flexShrink: 0,
            }}
          >
            {getAmountWithSign(unitPrice)}
          </Typography>
        </InfoBox>

        {store?.name && (
          <Stack
            direction="row"
            alignItems="center"
            gap="8px"
            role="button"
            tabIndex={0}
            onClick={() => handleStoreRedirect(store, router)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStoreRedirect(store, router);
              }
            }}
            sx={{ cursor: "pointer" }}
          >
            <Box
              sx={{
                position: "relative",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0,
                backgroundColor: "background.secondary",
              }}
            >
              <NextImage
                src={store?.logo_full_url}
                alt={store?.name}
                fill
                objectFit="cover"
              />
            </Box>
            <Stack sx={{ flex: 1, minWidth: 0, gap: "2px" }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "-0.48px",
                  color: "neutral.1050",
                  textTransform: "capitalize",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {store.name}
              </Typography>
              {store?.delivery_time && (
                <Stack direction="row" alignItems="center" gap="4px">
                  <i
                    className="fi fi-rr-clock"
                    style={{
                      fontSize: "12px",
                      lineHeight: 1,
                      display: "flex",
                      color: theme.palette.neutral[500],
                    }}
                  />
                  <Typography sx={{ fontSize: "12px", color: "neutral.500" }}>
                    {store.delivery_time}
                    {store?.distance_label ? ` (${store.distance_label})` : ""}
                  </Typography>
                </Stack>
              )}
            </Stack>
            <i
              className="fi fi-rs-angle-small-right"
              style={{ fontSize: "16px", lineHeight: 1, display: "flex", color: theme.palette.neutral[500] }}
            />
          </Stack>
        )}
      </Stack>
    </SidebarPanel>
  );

  const FoodSections = (
    <Stack sx={{ gap: "24px", flex: 1, minWidth: 0 }}>
      {buyItems.length > 0 && (
        <Stack sx={{ gap: "16px" }}>
          <SectionHeader title={t("Buy These")} />
          <Stack sx={{ gap: "16px" }}>
            {buyItems.map((food) => (
              <NewProductCardBogo item={food} key={food?.id} />
            ))}
          </Stack>
        </Stack>
      )}

      {getItems.length > 0 && (
        <Stack sx={{ gap: "16px" }}>
          <SectionHeader title={t("You will Get")} />
          <Stack sx={{ gap: "16px" }}>
            {getItems.map((food) => (
              <NewProductCardBogo item={food} key={food?.id} />
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );

  const Footer = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems="center"
      gap="16px"
      sx={{
        width: "100%",
        padding: { xs: "16px 20px", sm: "20px 32px" },
        boxShadow: "0px -1px 2px 0px rgba(0,0,0,0.1), 0px -1px 2px 0px rgba(0,0,0,0.05)",
        backgroundColor: "background.paper",
        boxSizing: "border-box",
      }}
    >
      <Stack sx={{ flex: 1, minWidth: 0, width: { xs: "100%", sm: "auto" } }}>
        <Stack direction="row" alignItems="baseline" gap="4px">
          <Typography sx={{ fontSize: "16px", fontWeight: 500, letterSpacing: "-0.48px", color: "neutral.1050" }}>
            {t("Total")}
          </Typography>
          {taxIncluded && (
            <Typography sx={{ fontSize: "14px", letterSpacing: "-0.42px", color: "neutral.400" }}>
              {t("(Inc. VAT/TAX)")}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" alignItems="center" gap="6px">
          <Typography
            sx={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.6px", color: "neutral.1050" }}
          >
            {getAmountWithSign(total)}
          </Typography>
          {hasDiscount && (
            <Typography
              sx={{ fontSize: "14px", color: "neutral.500", textDecoration: "line-through" }}
            >
              {getAmountWithSign(oldTotal)}
            </Typography>
          )}
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" gap="20px" sx={{ width: { xs: "100%", sm: "auto" } }}>
        <StepperPill>
          <StepperButton
            disabled={isCartActionLoading || !canDecrement}
            onClick={() => {
              if (quantity <= 1) {
                if (isInCart) handleRemoveFromCart();
                return;
              }
              setQuantity((prev) => Math.max(1, prev - 1));
            }}
          >
            {quantity <= 1 && isInCart ? (
              <i className="fi fi-rr-trash" style={{ color: theme.palette.error.main }} />
            ) : (
              <i className="fi fi-rr-minus" />
            )}
          </StepperButton>
          <Box sx={{ width: "32px", textAlign: "center" }}>
            <Typography sx={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.54px", color: "neutral.1050" }}>
              {quantity}
            </Typography>
          </Box>
          <StepperButton
            disabled={isCartActionLoading}
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            <i className="fi fi-rr-plus" />
          </StepperButton>
        </StepperPill>

        <Box
          component="button"
          onClick={handleAddOrUpdateCart}
          disabled={isCartActionLoading || !bundle?.bundle_id}
          sx={{
            flex: { xs: 1, sm: "0 0 auto" },
            minWidth: { sm: "160px" },
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            border: "none",
            borderRadius: "12px",
            backgroundColor: "primary.main",
            color: theme.palette.whiteContainer.main,
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "-0.48px",
            cursor: "pointer",
            px: "16px",
            opacity: isCartActionLoading || !bundle?.bundle_id ? 0.6 : 1,
          }}
        >
          {isCartActionLoading && (
            <CircularProgress size={16} sx={{ color: theme.palette.whiteContainer.main }} />
          )}
          {isInCart ? t("Update Cart") : t("Add to cart")}
        </Box>
      </Stack>
    </Stack>
  );

  const closeButton = (
    <IconButton
      onClick={onClose}
      sx={{ position: "absolute", top: "8px", right: "8px", zIndex: 1 }}
    >
      <i className="fi fi-rr-cross-small" style={{ fontSize: "20px" }} />
    </IconButton>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {closeButton}
        <Box sx={{ overflowY: "auto", flex: 1 }}>
          {LeftSideContent}
          <Box sx={{ p: "16px" }}>{FoodSections}</Box>
        </Box>
        {Footer}
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "900px",
          maxWidth: "92vw",
          borderRadius: "20px",
          position: "relative",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        },
      }}
    >
      {closeButton}
      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          display: "flex",
          gap: "32px",
          p: "32px",
          overflowY: "auto",
          overflowX: "hidden",
          flex: 1,
        }}
      >
        <Box sx={{ position: "sticky", top: 0, flexShrink: 0 }}>{LeftSideContent}</Box>
        {FoodSections}
      </Box>
      {Footer}
    </Dialog>
  );
};

export default BogoItemDetailsModal;
