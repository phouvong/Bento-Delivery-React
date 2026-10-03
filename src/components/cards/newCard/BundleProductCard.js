import { alpha, Box, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import NextImage from "components/NextImage";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import useAddBundleToCart from "api-manage/hooks/react-query/add-cart/useAddBundleToCart";
import useUpdateBundleCart from "api-manage/hooks/react-query/add-cart/useUpdateBundleCart";
import useRemoveBundleFromCart from "api-manage/hooks/react-query/add-cart/useRemoveBundleFromCart";
import useCartListSync from "api-manage/hooks/custom-hooks/useCartListSync";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getGuestId } from "helper-functions/getToken";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ImageContainer, InfoSection, CartControls } from "./NewProductCard";
import BundleViewDrawer from "./BundleViewDrawer";

// Figma Drop Shadow/200: black-100 (0.05)
const GRID_SHADOW = "0px 1px 4px 0px rgba(0,0,0,0.05)";
// Figma Drop Shadow/All side — used behind the "+N" counter pill
const COUNTER_SHADOW = "0px 0px 16px -1px rgba(0,0,0,0.1)";

// ─── BundleGridContainer — the "Item" node: single padded/shadowed shell
// (matches Figma exactly — no second box layered behind it, so there's
// nothing for a sub-pixel gap to reveal as a ghost outline) ────

const BundleGridContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  aspectRatio: "1 / 1",
  display: "flex",
  gap: "6px",
  padding: "8px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "12px",
  boxShadow: GRID_SHADOW,
  flexShrink: 0,
}));

// ─── BundleTile — a single bordered/rounded image tile inside the grid ───────

const BundleTile = styled(Box)(({ theme }) => ({
  position: "relative",
  flex: "1 1 0",
  minWidth: 0,
  minHeight: 0,
  border: `1px solid ${theme.palette.neutral[200]}`,
  borderRadius: "8px",
  overflow: "hidden",
  "& img": {
    position: "absolute",
    inset: 0,
    width: "100% !important",
    height: "100% !important",
    objectFit: "cover",
  },
}));

// ─── BundleImageGrid — 1 / 2 / 3 / 4+ layouts with a centered "+N" overlay ───

const BundleImageGrid = ({ images, alt, cartControlProps }) => {
  const theme = useTheme();
  // Not filtering out falsy entries — a sub-item with no image still gets
  // its own tile (NextImage placeholders it), so the tile count keeps
  // matching the bundle's actual item count.
  const list = Array.isArray(images) ? images : [];
  const shown = list.slice(0, 4);
  const extraCount = list.length > 4 ? list.length - 4 : 0;

  if (shown.length <= 1) {
    return (
      <ImageContainer variant="vertical" className="card-img">
        <NextImage
          src={shown[0]}
          alt={alt}
          width="190"
          height="190"
          objectFit="cover"
        />
        <CartControls isHorizontal={false} {...cartControlProps} />
      </ImageContainer>
    );
  }

  // Column layout: column 1 always gets ceil(n/2) tiles stacked, column 2 gets the rest.
  const firstColCount = shown.length === 2 ? 1 : Math.ceil(shown.length / 2);
  const firstCol = shown.slice(0, firstColCount);
  const secondCol = shown.slice(firstColCount);

  return (
    <BundleGridContainer className="card-img">
      <Box
        sx={{
          flex: "1 1 0",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {firstCol.map((src, i) => (
          <BundleTile key={i}>
            <NextImage
              src={src}
              alt={alt}
              width="94"
              height="94"
              objectFit="cover"
            />
          </BundleTile>
        ))}
      </Box>
      {secondCol.length > 0 && (
        <Box
          sx={{
            flex: "1 1 0",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {secondCol.map((src, i) => (
            <BundleTile key={i}>
              <NextImage
                src={src}
                alt={alt}
                width="94"
                height="94"
                objectFit="cover"
              />
            </BundleTile>
          ))}
        </Box>
      )}

      {extraCount > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minHeight: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: "6px",
            py: "4px",
            borderRadius: "8px",
            backgroundColor: theme.palette.background.paper,
            boxShadow: COUNTER_SHADOW,
            zIndex: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              color: "neutral.1050",
              lineHeight: 1.1,
              letterSpacing: "-0.48px",
              whiteSpace: "nowrap",
            }}
          >
            +{extraCount}
          </Typography>
        </Box>
      )}

      <CartControls isHorizontal={false} {...cartControlProps} />
    </BundleGridContainer>
  );
};

// ─── BundleTileHorizontal — borderless rounded tile used in the horizontal grid
const BundleTileHorizontal = styled(Box)(() => ({
  position: "relative",
  flex: "1 1 0",
  minWidth: 0,
  minHeight: 0,
  borderRadius: "6px",
  overflow: "hidden",
  "& img": {
    position: "absolute",
    inset: 0,
    width: "100% !important",
    height: "100% !important",
    objectFit: "cover",
  },
}));

// Row groups per Figma: 2 → two full-width rows; 3 → top full row + bottom split
// row; 4 → a 2x2 grid. Only the shown (<=4) tiles are laid out this way.
const HORIZONTAL_ROWS = {
  2: (imgs) => [[imgs[0]], [imgs[1]]],
  3: (imgs) => [[imgs[0]], [imgs[1], imgs[2]]],
  4: (imgs) => [
    [imgs[0], imgs[1]],
    [imgs[2], imgs[3]],
  ],
};

// ─── BundleImageGridHorizontal — 1 / 2 / 3 / 4+ layouts for the horizontal card

const BundleImageGridHorizontal = ({ images, alt, cartControlProps }) => {
  const theme = useTheme();
  // See BundleImageGrid above — no filtering, so the tile count still
  // matches the bundle's actual item count when images are missing.
  const list = Array.isArray(images) ? images : [];
  const shown = list.slice(0, 4);
  const extraCount = list.length > 4 ? list.length - 4 : 0;
  const boxSize = { xs: "96px", sm: "126px" };

  if (shown.length <= 1) {
    return (
      <ImageContainer
        variant="horizontal"
        className="card-img-h"
        sx={{ width: boxSize, height: boxSize, flexShrink: 0 }}
      >
        <NextImage
          src={shown[0]}
          alt={alt}
          width="126"
          height="126"
          objectFit="cover"
        />
        <CartControls isHorizontal {...cartControlProps} />
      </ImageContainer>
    );
  }

  const rows = HORIZONTAL_ROWS[shown.length](shown);

  return (
    <Box
      sx={{
        position: "relative",
        width: boxSize,
        height: boxSize,
        flexShrink: 0,
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.neutral[200]}`,
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        p: "6px",
      }}
    >
      <Box
        sx={{
          flex: "1 1 0",
          minWidth: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "6px",
        }}
      >
        {rows.map((row, i) => (
          <Box
            key={i}
            sx={{ display: "flex", gap: "6px", width: "100%", flex: "1 1 0" }}
          >
            {row.map((src, j) => (
              <BundleTileHorizontal key={j}>
                <NextImage
                  src={src}
                  alt={alt}
                  width="60"
                  height="54"
                  objectFit="cover"
                />
              </BundleTileHorizontal>
            ))}
          </Box>
        ))}
      </Box>

      {extraCount > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minHeight: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: "6px",
            py: "4px",
            borderRadius: "8px",
            backgroundColor: theme.palette.background.paper,
            boxShadow: COUNTER_SHADOW,
            zIndex: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              color: "neutral.1050",
              lineHeight: 1.1,
              letterSpacing: "-0.48px",
              whiteSpace: "nowrap",
            }}
          >
            +{extraCount}
          </Typography>
        </Box>
      )}

      <CartControls isHorizontal {...cartControlProps} />
    </Box>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────

const BundleProductCard = ({
  item,
  images,
  variant = "vertical", // "vertical" | "horizontal"
  onCardClick,
  cardWidth,
  max_width,
  horizontalStyle,
  isStore,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [bundleDrawerOpen, setBundleDrawerOpen] = useState(false);

  const { cartList: aliasCartList } = useSelector((s) => s.cart);

  // A bundle's cart row is atomic — id is always 0 and item is always null
  // per the API guide, so it can't be matched the way a regular product row
  // is. Match by bundle_details.bundle_id instead; mergeBundleRow/
  // removeBundleRow (from useCartListSync) key by bundle_group_id rather
  // than going through the id-keyed setCart/setIncrementToCartItem/etc.
  // action creators, which would collide every bundle's id:0 row together.
  const cartList = getCartListModuleWise(aliasCartList);
  const isInCart = cartList?.find(
    (c) => c?.bundle_details?.bundle_id === item?.id,
  );
  const isProductExist = !!isInCart;
  const count = isInCart?.quantity ?? 0;
  const bundleGroupId = isInCart?.bundle_details?.bundle_group_id;

  const { mutate: addBundleMutate, isLoading } = useAddBundleToCart();
  const { mutate: updateBundleMutate, isLoading: updateLoading } =
    useUpdateBundleCart();
  const { mutate: removeBundleMutate } = useRemoveBundleFromCart();
  const { mergeBundleRow, removeBundleRow } = useCartListSync();

  const bundleImages = Array.isArray(images) ? images : item?.images ?? [];

  const handleAddSuccess = (res) => {
    mergeBundleRow(res?.data?.[0]);
    toast.success(t("Item added to cart"));
  };

  const handleUpdateSuccess = (res) => {
    mergeBundleRow(res?.data?.[0]);
  };

  // Accepts an explicit quantity so the bundle drawer can let a user pick a
  // quantity first (e.g. 5) and add it in a single call, instead of adding
  // 1 then incrementing repeatedly.
  const addToCartHandler = (quantity = 1) => {
    if (isInCart) return;
    addBundleMutate(
      { bundle_id: item?.id, quantity, guest_id: getGuestId() },
      { onSuccess: handleAddSuccess, onError: onErrorResponse },
    );
  };

  // Sets an already-in-cart bundle straight to `newQuantity` in one API
  // call — used by the drawer's quantity stepper + "Update" action, and by
  // the card's own +/- controls below.
  const handleSetQuantity = (newQuantity) => {
    if (!isInCart || updateLoading || newQuantity === isInCart.quantity) return;
    if (newQuantity < 1) return;
    updateBundleMutate(
      {
        bundle_group_id: bundleGroupId,
        quantity: newQuantity,
        guest_id: getGuestId(),
      },
      { onSuccess: handleUpdateSuccess, onError: onErrorResponse },
    );
  };

  const handleIncrement = () => {
    if (!isInCart || updateLoading) return;
    handleSetQuantity(isInCart.quantity + 1);
  };

  const handleDecrement = () => {
    if (!isInCart) return;
    if (isInCart.quantity === 1) {
      removeBundleMutate(
        { bundle_group_id: bundleGroupId, guest_id: getGuestId() },
        {
          onSuccess: () => {
            removeBundleRow(bundleGroupId);
            toast.success(t("Removed from cart."));
          },
          onError: onErrorResponse,
        },
      );
    } else {
      handleSetQuantity(isInCart.quantity - 1);
    }
  };

  // Clicking anywhere on a bundle card — not just the plus icon — always
  // opens the bundle contents drawer, never the single-item detail modal.
  const handleClick = () => {
    if (onCardClick) {
      onCardClick(item);
      return;
    }
    setBundleDrawerOpen(true);
  };

  // Plus-icon click never hits the API directly — it opens the bundle
  // contents drawer, where the actual add/increment/decrement happens.
  const handleAddClick = (e) => {
    e.stopPropagation();
    setBundleDrawerOpen(true);
  };

  // Bundle API (GET /bundle/home, /store-bundles, /{id}) already computes
  // base_price/final_price/discount_percentage server-side — bill
  // final_price, not bundle_price (see the API guide's note on happy hour
  // replacing the bundle's own discount). Falls back to the older
  // discount/discount_type shape when final_price isn't present.
  const originalPrice = item?.base_price ?? item?.price ?? 0;
  const hasServerPricing = item?.final_price != null;
  const displayPrice = hasServerPricing
    ? item.final_price
    : item?.discount > 0
    ? originalPrice -
      (item.discount_type === "percent"
        ? (originalPrice * item.discount) / 100
        : item.discount)
    : originalPrice;
  const discountText = hasServerPricing
    ? item?.discount_percentage > 0
      ? `-${item.discount_percentage}%`
      : null
    : item?.discount > 0
    ? item.discount_type === "percent"
      ? `-${item.discount}%`
      : `-${getAmountWithSign(item.discount)}`
    : null;

  const cartControlProps = {
    isProductExist,
    count,

    updateLoading: bundleDrawerOpen ? false : updateLoading,
    isLoading: bundleDrawerOpen ? false : isLoading,
    onDecrement: (e) => {
      e.stopPropagation();
      handleDecrement();
    },
    onIncrement: (e) => {
      e.stopPropagation();
      handleIncrement();
    },
    onAdd: handleAddClick,
  };

  return (
    <>
      {bundleDrawerOpen && (
        <BundleViewDrawer
          open={bundleDrawerOpen}
          onClose={() => setBundleDrawerOpen(false)}
          item={item}
          displayPrice={displayPrice}
          originalPrice={originalPrice}
          isProductExist={isProductExist}
          count={count}
          updateLoading={updateLoading}
          isLoading={isLoading}
          onAdd={addToCartHandler}
          onSetQuantity={handleSetQuantity}
        />
      )}

      {variant === "horizontal" ? (
        <Box
          onClick={handleClick}
          sx={{
            width: "100%",
            maxWidth: max_width ?? "398px",
            height: { xs: "120px", sm: "150px" },
            display: "flex",
            alignItems: "start",
            gap: "8px",
            backgroundColor: "background.paper",
            border: `1px solid ${theme.palette.neutral[200]}`,
            borderRadius: "12px",
            overflow: "hidden",
            pl: "12px",
            pr: "8px",
            py: "10px",
            cursor: "pointer",
            "&:hover": {
              boxShadow: `0px 4px 12px ${alpha(
                theme.palette.neutral[1000],
                0.08,
              )}`,
            },
            ...horizontalStyle,
          }}
        >
          <InfoSection
            isHorizontal
            item={item}
            isStore={isStore}
            displayPrice={displayPrice}
            originalPrice={originalPrice}
            discountText={discountText}
            t={t}
          />
          <BundleImageGridHorizontal
            images={bundleImages}
            alt={item?.name}
            cartControlProps={cartControlProps}
          />
        </Box>
      ) : (
        <Box
          onClick={handleClick}
          sx={{
            width: cardWidth ?? { xs: "150px", md: "180px" },
            minWidth: 0,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px",
            cursor: "pointer",
            gap: { xs: "6px", md: "8px" },
            // No overflow:hidden — the image grid is full-bleed here, so
            // clipping the wrapper would cut off its drop shadow.
          }}
        >
          <BundleImageGrid
            images={bundleImages}
            alt={item?.name}
            cartControlProps={cartControlProps}
          />
          <InfoSection
            isHorizontal={false}
            item={item}
            isStore={isStore}
            displayPrice={displayPrice}
            originalPrice={originalPrice}
            discountText={discountText}
            t={t}
          />
        </Box>
      )}
    </>
  );
};

export default BundleProductCard;
