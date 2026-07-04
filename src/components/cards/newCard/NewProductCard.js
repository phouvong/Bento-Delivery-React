import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarIcon from "@mui/icons-material/Star";
import {
  alpha,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import BadgeWithTooltip from "components/common/BadgeWithTooltip";
import { styled } from "@mui/material/styles";
import { keyframes } from "@mui/system";
import NextImage from "components/NextImage";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import useAddCartItem from "api-manage/hooks/react-query/add-cart/useAddCartItem";
import useCartItemUpdate from "api-manage/hooks/react-query/add-cart/useCartItemUpdate";
import useDeleteCartItem from "api-manage/hooks/react-query/add-cart/useDeleteCartItem";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getLanguage } from "helper-functions/getLanguage";
import { getGuestId } from "helper-functions/getToken";
import { handleProductRedirect } from "helper-functions/handleProductRedirect";
import { handleStoreRedirect } from "helper-functions/handleStoreRedirect";
import { ModuleTypes } from "helper-functions/moduleTypes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useRef, useState } from "react";
import useTextEllipsis from "api-manage/hooks/custom-hooks/useTextEllipsis";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "react-query";
import {
  setCart,
  setDecrementToCartItem,
  setIncrementToCartItem,
  setRemoveItemFromCart,
} from "redux/slices/cart";
import { addWishList, removeWishListItem } from "redux/slices/wishList";
import {
  not_logged_in_message,
  out_of_limits,
  out_of_stock,
} from "utils/toasterMessages";
import CartClearModal from "../../product-details/product-details-section/CartClearModal";
import CustomModal from "../../modal";
import GetLocationAlert from "../../GetLocationAlert";
import CustomDialogConfirm from "../../custom-dialog/confirm/CustomDialogConfirm";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import {
  ACTION,
  initialState,
  reducer,
} from "../../product-details/product-details-section/states";
import {
  getItemDataForAddToCart,
  getPriceAfterQuantityChange,
} from "../../product-details/product-details-section/helperFunction";
import ProductHalalSvg from "../assets/ProductHalalSvg";
import ProductVegSvg from "../assets/ProductVegSvg";
import ProductOrganicSvg from "../assets/ProductOrganicSvg";
import ProductNonVegSvg from "../assets/ProductNonVegSvg";
import StoreVerifiedSVG from "../assets/StoreVerifiedSVG";

const FoodDetailModal = dynamic(() =>
  import("../../food-details/foodDetail-modal/FoodDetailModal")
);
const ModuleModal = dynamic(() => import("../ModuleModal"));

// ─── Constants ─────────────────────────────────────────────────────────────

// Figma Drop Shadow/200: black-100 (0.05) then black-200 (0.1)
const BUTTON_SHADOW =
  "0px 1px 4px 0px rgba(0,0,0,0.05), 0px 1px 4px 0px rgba(0,0,0,0.1)";

// ─── Styled ────────────────────────────────────────────────────────────────

const ImageContainer = styled(Box)(({ theme, variant }) => ({
  position: "relative",
  backgroundColor: theme.palette.background.secondary,
  border: `1px solid ${theme.palette.neutral[200]}`,
  borderRadius: variant === "horizontal" ? "8px" : "12px",
  overflow: "hidden",
  flexShrink: 0,
  ...(variant === "vertical"
    ? { width: "100%", aspectRatio: "1 / 1" }
    : { height: "100%", aspectRatio: "1 / 1" }),
  "& img": {
    position: "absolute",
    inset: 0,
    width: "100% !important",
    height: "100% !important",
    objectFit: "cover",
  },
}));

const WishlistBtn = styled(IconButton, {
  shouldForwardProp: (p) => p !== "variant",
})(({ theme, variant }) => ({
  position: "absolute",
  top: variant === "horizontal" ? 7 : 9,
  right: variant === "horizontal" ? 7 : 9,
  width: variant === "horizontal" ? 24 : 26,
  height: variant === "horizontal" ? 24 : 26,
  padding: 6,
  borderRadius: "50%",
  backgroundColor: theme.palette.background.secondary,
  "&:hover": { backgroundColor: theme.palette.neutral[200] },
  zIndex: 2,
}));

const AddBtn = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 9,
  right: 9,
  width: 36,
  height: 36,
  borderRadius: "8px",
  backgroundColor: theme.palette.background.paper,
  boxShadow: BUTTON_SHADOW,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  zIndex: 2,
}));

const IncDecContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 9,
  right: 9,
  width: "auto",
  height: 36,
  borderRadius: "8px",
  backgroundColor: theme.palette.background.paper,
  boxShadow: BUTTON_SHADOW,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  zIndex: 2,
  overflow: "hidden",
}));

const IncDecBtn = styled(Box)(({ theme }) => ({
  width: 36,
  height: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  flexShrink: 0,
  "&:hover": { backgroundColor: theme.palette.action.hover },
}));

const DiscountBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.error.danger,
  borderRadius: 24,
  padding: "2px 6px",
  display: "inline-flex",
  alignItems: "center",
}));

const DeliveryBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.error.dangerLight,
  borderRadius: 24,
  padding: "2px 6px",
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
}));

// ─── SVG Icons (extracted to avoid re-creating large blobs on each render) ────

// ─── Small sub-components ──────────────────────────────────────────────────

// Crossfade keyframes for the verified-tick ↔ store-logo loop (opposite phase).
const storeBadgeCycleA = keyframes`
  0%, 40% { opacity: 1; transform: scale(1) rotate(0deg); }
  50%, 90% { opacity: 0; transform: scale(0.4) rotate(-25deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
`;
const storeBadgeCycleB = keyframes`
  0%, 40% { opacity: 0; transform: scale(0.4) rotate(25deg); }
  50%, 90% { opacity: 1; transform: scale(1) rotate(0deg); }
  100% { opacity: 0; transform: scale(0.4) rotate(25deg); }
`;

// StoreBadge — verified tick and/or store logo. When BOTH are present they
// crossfade back and forth on an infinite CSS loop; a single one renders static.
const StoreBadge = ({
  isStoreVerified,
  storeLogoUrl,
  storeName,
  verifiedLabel,
  theme,
}) => {
  const verifiedEl = (
    <Box
      sx={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        // padding: "2px",
      }}
    >
      <StoreVerifiedSVG />
    </Box>
  );

  const logoEl = (
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        border: `1px solid ${theme.palette.neutral[200]}`,
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.secondary",
      }}
    >
      <NextImage
        src={storeLogoUrl}
        alt={storeName}
        width="14"
        height="14"
        objectFit="cover"
      />
    </Box>
  );

  // Both present → animated crossfade loop.
  if (isStoreVerified && storeLogoUrl) {
    return (
      <BadgeWithTooltip title={verifiedLabel}>
        <Box
          sx={{
            position: "relative",
            width: 16,
            height: 16,
            flexShrink: 0,
            "& .store-badge-layer": {
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "& .store-badge-verified": {
              animation: `${storeBadgeCycleA} 5s ease-in-out infinite`,
            },
            "& .store-badge-logo": {
              animation: `${storeBadgeCycleB} 5s ease-in-out infinite`,
            },
            "@media (prefers-reduced-motion: reduce)": {
              "& .store-badge-logo": { display: "none" },
              "& .store-badge-verified": {
                animation: "none",
                opacity: 1,
                transform: "none",
              },
            },
          }}
        >
          <Box className="store-badge-layer store-badge-verified">
            {verifiedEl}
          </Box>
          <Box className="store-badge-layer store-badge-logo">{logoEl}</Box>
        </Box>
      </BadgeWithTooltip>
    );
  }

  if (isStoreVerified) {
    return (
      <BadgeWithTooltip title={verifiedLabel}>{verifiedEl}</BadgeWithTooltip>
    );
  }

  if (storeLogoUrl) return logoEl;

  return null;
};

const StoreRow = ({
  storeName,
  storeLogoUrl,
  rating,
  isStore,
  verifiedSeller,
  storeRedirectData,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const isStoreVerified = !!verifiedSeller;

  const moduleType = getCurrentModuleType();
  const verifiedLabel =
    moduleType === ModuleTypes.FOOD
      ? t("Verified Restaurant")
      : moduleType === ModuleTypes.RENTAL
      ? t("Verified Provider")
      : t("Verified Store");

  const canRedirect = !!(storeRedirectData?.slug || storeRedirectData?.id);
  const handleStoreClick = (e) => {
    e.stopPropagation();
    if (!canRedirect) return;
    handleStoreRedirect(storeRedirectData, router);
  };

  if (isStore && !rating > 0) return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ overflow: "hidden", minWidth: 0 }}
    >
      {!isStore && (
        <Stack
          direction="row"
          alignItems="center"
          gap="4px"
          sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}
        >
          <StoreBadge
            isStoreVerified={isStoreVerified}
            storeLogoUrl={storeLogoUrl}
            storeName={storeName}
            verifiedLabel={verifiedLabel}
            theme={theme}
          />
          <Typography
            onClick={canRedirect ? handleStoreClick : undefined}
            sx={{
              fontSize: "12px",
              color: "neutral.500",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
              cursor: canRedirect ? "pointer" : "inherit",
              "&:hover": canRedirect ? { opacity: 0.7 } : undefined,
            }}
          >
            {storeName}
          </Typography>
        </Stack>
      )}

      {rating > 0 && (
        <Stack
          direction="row"
          alignItems="center"
          gap="2px"
          sx={{ flexShrink: 0, ml: "4px" }}
        >
          <StarIcon sx={{ fontSize: "12px", color: "customColor.starAmber" }} />
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "neutral.500",
              lineHeight: 1.3,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {Number(rating).toFixed(1)}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

// ─── CartControls — shared Add/IncDec UI (extracted to prevent re-creation) ──

const CartControls = ({
  isHorizontal,
  isProductExist,
  count,
  updateLoading,
  isLoading,
  onDecrement,
  onIncrement,
  onAdd,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);

  // Collapse when user clicks/taps outside the control while expanded
  useEffect(() => {
    if (!expanded) return;
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [expanded]);

  if (!isProductExist) {
    return (
      <AddBtn onClick={onAdd}>
        {isLoading ? (
          <CircularProgress size={14} />
        ) : (
          <AddIcon sx={{ fontSize: "18px", color: "neutral.1050" }} />
        )}
      </AddBtn>
    );
  }

  // Collapsible side button (− / +) — width animates 0 ↔ 36
  const sideSx = {
    width: expanded ? 36 : 0,
    height: 36,
    overflow: "hidden",
    flexShrink: 0,
    display: "flex",
    transition: "width 0.25s ease",
  };

  return (
    <IncDecContainer
      ref={containerRef}
      onClick={(e) => {
        e.stopPropagation();
        setExpanded(true);
      }}
      sx={isHorizontal ? { bottom: 7, right: 7 } : {}}
    >
      <Box sx={sideSx}>
        <IncDecBtn onClick={onDecrement}>
          {count === 1 ? (
            <i
              className="fi fi-bs-trash"
              style={{
                fontSize: "13px",
                lineHeight: 1,
                display: "flex",
                color: theme.palette.error.red,
              }}
            />
          ) : (
            <RemoveIcon sx={{ fontSize: "16px", color: "neutral.1050" }} />
          )}
        </IncDecBtn>
      </Box>
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 600,
          color: "neutral.1050",
          minWidth: 36,
          px: "2px",
          textAlign: "center",
          fontVariantNumeric: "tabular-nums",
          flexShrink: 0,
        }}
      >
        {updateLoading ? <CircularProgress size={12} /> : count}
      </Typography>
      <Box sx={sideSx}>
        <IncDecBtn onClick={onIncrement}>
          <AddIcon sx={{ fontSize: "16px", color: "neutral.1050" }} />
        </IncDecBtn>
      </Box>
    </IncDecContainer>
  );
};

// ─── ImageOverlay — non-pharmacy (halal, veg, wishlist, add/incdec) ──────────

const ImageOverlay = ({
  isHorizontal,
  item,
  isWishlisted,
  onWishlist,
  showVeg,
  ...cartProps
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const btnSize = isHorizontal ? 24 : 26;
  const badgeSize = isHorizontal ? 20 : 24;
  const offset = isHorizontal ? 7 : 9;
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: offset,
          left: offset,
          display: "flex",
          gap: "4px",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        {!!item?.halal_tag_status && !!item?.is_halal && (
          <BadgeWithTooltip title={t("This product is Halal")}>
            <Box
              sx={{
                width: badgeSize,
                height: badgeSize,
                borderRadius: "50%",
                backgroundColor: "background.paper",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                padding: "3px",
              }}
            >
              <ProductHalalSvg />
            </Box>
          </BadgeWithTooltip>
        )}
        {!!item.organic && (
          <BadgeWithTooltip title={t("Organic")}>
            <Box
              sx={{
                width: badgeSize,
                height: badgeSize,
                borderRadius: "50%",
                backgroundColor: "background.paper",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                padding: "3px",
              }}
            >
              <ProductOrganicSvg color={theme.palette.customColor.vegIcon} />
            </Box>
          </BadgeWithTooltip>
        )}
        {!!showVeg && (
          <BadgeWithTooltip title={item?.veg ? t("Veg") : t("Non Veg")}>
            <Box
              sx={{
                width: badgeSize,
                height: badgeSize,
                borderRadius: "50%",
                backgroundColor: "background.paper",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                padding: "3px",
              }}
            >
              {item?.veg ? (
                <ProductVegSvg color={theme.palette.customColor.vegIcon} />
              ) : (
                <ProductNonVegSvg />
              )}
            </Box>
          </BadgeWithTooltip>
        )}
      </Box>
      <WishlistBtn
        variant={isHorizontal ? "horizontal" : "vertical"}
        onClick={onWishlist}
        sx={{ width: btnSize, height: btnSize }}
      >
        <i
          className={isWishlisted ? "fi fi-sr-heart" : "fi fi-br-heart"}
          style={{
            fontSize: "13px",
            lineHeight: 1,
            display: "flex",
            color: theme.palette.error.red,
          }}
        />
      </WishlistBtn>
      <CartControls isHorizontal={isHorizontal} {...cartProps} />
    </>
  );
};

// ─── PharmacyImageOverlay — discount, free delivery, wishlist, add/incdec ────

const PharmacyImageOverlay = ({
  isHorizontal,
  discountText,
  item,
  isWishlisted,
  onWishlist,
  ...cartProps
}) => {
  const theme = useTheme();
  const btnSize = isHorizontal ? 24 : 26;
  const offset = isHorizontal ? 7 : 9;
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: offset,
          left: offset,
          display: "flex",
          flexDirection: isHorizontal ? "column" : "row",
          gap: "4px",
          alignItems: isHorizontal ? "flex-start" : "center",
          zIndex: 2,
        }}
      >
        {!!discountText && (
          <DiscountBadge>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.95)",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
              }}
            >
              {discountText}
            </Typography>
          </DiscountBadge>
        )}
        {!!item?.store?.free_delivery && (
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "24px",
              backgroundColor: "info.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i
              className="fi fi-rs-biking-mountain"
              style={{
                fontSize: "12px",
                lineHeight: 1,
                display: "flex",
                color: "#fff",
              }}
            />
          </Box>
        )}
      </Box>
      <WishlistBtn
        variant={isHorizontal ? "horizontal" : "vertical"}
        onClick={onWishlist}
        sx={{ width: btnSize, height: btnSize }}
      >
        <i
          className={isWishlisted ? "fi fi-sr-heart" : "fi fi-br-heart"}
          style={{
            fontSize: "13px",
            lineHeight: 1,
            display: "flex",
            color: theme.palette.error.red,
          }}
        />
      </WishlistBtn>
      <CartControls isHorizontal={isHorizontal} {...cartProps} />
    </>
  );
};

// ─── InfoSection — non-pharmacy info block ────────────────────────────────────

const InfoSection = ({
  isHorizontal,
  item,
  isStore,
  displayPrice,
  originalPrice,
  discountText,
  t,
}) => {
  const lanDirection = getLanguage() || "ltr";
  const { ref: nameRef, isEllipsed } = useTextEllipsis(item?.name);
  const nameTypography = (
    <Typography
      ref={nameRef}
      sx={{
        fontSize: { xs: "14px", md: "16px" },
        fontWeight: 400,
        color: "customColor.textNeutral",
        lineHeight: 1.1,
        letterSpacing: "-0.48px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        textTransform: "capitalize",
        textAlign: lanDirection === "rtl" ? "end" : "start",
      }}
    >
      {item?.name}
    </Typography>
  );
  return (
    <Stack
      sx={{
        flexDirection: "column",
        gap: { xs: "6px", md: "8px" },
        pt: isHorizontal ? 0 : { xs: "8px", md: "8px" },
        px: isHorizontal ? 0 : "4px",
        py: isHorizontal ? "2px" : 0,
        flex: 1,
        minWidth: 0,
        overflow: "hidden",
        justifyContent: isHorizontal ? "center" : "flex-start",
      }}
    >
      <StoreRow
        storeName={item?.store_name}
        storeLogoUrl={
          item?.store_logo_full_url ??
          item?.store?.logo_full_url ??
          item?.store_details?.logo_full_url
        }
        rating={item?.avg_rating}
        isStore={isStore}
        verifiedSeller={
          item?.verified_seller ??
          item?.store?.verified_seller ??
          item?.store_details?.verified_seller
        }
        storeRedirectData={
          item?.store_details || {
            id: item?.store_id,
            slug: item?.store_slug,
          }
        }
      />
      <Stack sx={{ flexDirection: "column", gap: { xs: "4px", md: "6px" } }}>
        {isEllipsed ? (
          <Tooltip title={item?.name} placement="top" arrow>
            {nameTypography}
          </Tooltip>
        ) : (
          nameTypography
        )}
        <Stack
          direction="row"
          alignItems="baseline"
          gap="4px"
          flexWrap="nowrap"
          sx={{ py: "2px", overflow: "hidden", minWidth: 0 }}
        >
          <Typography
            sx={{
              fontSize: { xs: "14px", md: "18px" },
              fontWeight: 700,
              color: "neutral.1050",
              lineHeight: 1.1,
              letterSpacing: "-0.54px",
              fontVariantNumeric: "tabular-nums",
              flexShrink: 0,
            }}
          >
            {getAmountWithSign(displayPrice)}
          </Typography>
          {originalPrice > displayPrice && (
            <Typography
              sx={{
                fontSize: { xs: "11px", md: "14px" },
                fontWeight: 400,
                color: "neutral.500",
                lineHeight: 1.2,
                letterSpacing: "-0.42px",
                textDecoration: "line-through",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
            >
              {getAmountWithSign(originalPrice)}
            </Typography>
          )}
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          gap="4px"
          flexWrap="nowrap"
          sx={{ overflow: "hidden" }}
        >
          {!!discountText && (
            <DiscountBadge sx={{ flexShrink: 0 }}>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.95)",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                }}
              >
                {discountText}
              </Typography>
            </DiscountBadge>
          )}
          {!!item?.store?.free_delivery && (
            <DeliveryBadge sx={{ flexShrink: 0 }}>
              <i
                className="fi fi-rs-biking-mountain"
                style={{
                  fontSize: "11px",
                  lineHeight: 1,
                  display: "flex",
                  color: "error.dangerText",
                }}
              />
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "error.dangerText",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                }}
              >
                {t("Free")}
              </Typography>
            </DeliveryBadge>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

// ─── PharmacyInfoSection — name + generic + company + price + unit ───────────

const PharmacyInfoSection = ({
  isHorizontal,
  item,
  isStore,
  subName,
  companyName,
  displayPrice,
  originalPrice,
}) => {
  const lanDirection = getLanguage() || "ltr";
  const { ref: nameRef, isEllipsed } = useTextEllipsis(item?.name);
  const nameTypography = (
    <Typography
      ref={nameRef}
      sx={{
        fontSize: { xs: "14px", md: "16px" },
        fontWeight: 500,
        color: "customColor.textNeutral",
        lineHeight: 1.1,
        letterSpacing: "-0.48px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 1,
        WebkitBoxOrient: "vertical",
        textTransform: "capitalize",
        textAlign: lanDirection === "rtl" ? "end" : "start",
      }}
    >
      {item?.name}
    </Typography>
  );
  return (
    <Stack
      sx={{
        flexDirection: "column",
        gap: "8px",
        pt: isHorizontal ? 0 : "8px",
        px: isHorizontal ? 0 : "4px",
        py: isHorizontal ? "2px" : 0,
        flex: 1,
        minWidth: 0,
        justifyContent: isHorizontal ? "center" : "flex-start",
      }}
    >
      <StoreRow
        storeName={item?.store_name}
        storeLogoUrl={
          item?.store_logo_full_url ??
          item?.store?.logo_full_url ??
          item?.store_details?.logo_full_url
        }
        rating={item?.avg_rating}
        isStore={isStore}
        verifiedSeller={
          item?.verified_seller ??
          item?.store?.verified_seller ??
          item?.store_details?.verified_seller
        }
        storeRedirectData={
          item?.store_details || {
            id: item?.store_id,
            slug: item?.store_slug,
          }
        }
      />
      <Stack sx={{ flexDirection: "column", gap: "6px" }}>
        <Stack sx={{ flexDirection: "column", gap: "4px" }}>
          {isEllipsed ? (
            <Tooltip title={item?.name} placement="top" arrow>
              {nameTypography}
            </Tooltip>
          ) : (
            nameTypography
          )}
          {!!subName && (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "neutral.500",
                lineHeight: 1.2,
                letterSpacing: "-0.42px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {subName}
            </Typography>
          )}
          {!!companyName && (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "neutral.400",
                lineHeight: 1.2,
                letterSpacing: "-0.42px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {companyName}
            </Typography>
          )}
        </Stack>
        <Stack sx={{ flexDirection: "column" }}>
          <Stack
            direction="row"
            alignItems="center"
            gap="4px"
            flexWrap="wrap"
            sx={{ py: "2px" }}
          >
            <Typography
              sx={{
                fontSize: { xs: "16px", md: "18px" },
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-0.54px",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {getAmountWithSign(displayPrice)}
            </Typography>
            {originalPrice > displayPrice && (
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "14px" },
                  fontWeight: 400,
                  color: "neutral.500",
                  lineHeight: 1.2,
                  letterSpacing: "-0.42px",
                  textDecoration: "line-through",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {getAmountWithSign(originalPrice)}
              </Typography>
            )}
          </Stack>
          {(item?.unit_type || item?.total_stock_quantity) && (
            <Stack
              direction="row"
              alignItems="center"
              gap="2px"
              flexWrap="wrap"
            >
              {!!item?.unit_type && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "neutral.1050",
                    lineHeight: 1.3,
                  }}
                >
                  {item.unit_type}
                </Typography>
              )}
              {!!item?.unit_value && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "neutral.400",
                    lineHeight: 1.3,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  ({item.unit_value})
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

// ─── RentalFeatureTag — pill chip for vehicle attributes ─────────────────────

const RentalFeatureTag = ({ iconClass, label }) => (
  <Stack
    direction="row"
    alignItems="center"
    gap="4px"
    sx={{
      backgroundColor: "background.default",
      borderRadius: "999px",
      px: "8px",
      py: "4px",
      flexShrink: 0,
    }}
  >
    {iconClass && (
      <i
        className={iconClass}
        style={{ fontSize: "14px", lineHeight: 1, display: "flex" }}
      />
    )}
    <Typography
      sx={{
        fontSize: "14px",
        fontWeight: 400,
        color: "customColor.textNeutral",
        lineHeight: 1.2,
        letterSpacing: "-0.42px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Typography>
  </Stack>
);

// ─── RentalImageOverlay — discount top-left, wishlist top-right, info bottom-right

export const RentalImageOverlay = ({
  discountText,
  item,
  isWishlisted,
  onWishlist,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const totalVehicleCount = Number(
    item?.total_vehicle_count ?? item?.total_vehicles ?? 0
  );
  const extraVehicleCount = Math.max(totalVehicleCount - 1, 0);
  const showInfoButton = totalVehicleCount > 1;
  const tooltipContent = showInfoButton
    ? `${extraVehicleCount} ${t(
        extraVehicleCount === 1
          ? "More Similar Vehicle"
          : "More Similar Vehicles"
      )}`
    : "";
  return (
    <>
      {/* Discount badge — top-left */}
      {!!discountText && (
        <Box sx={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}>
          <DiscountBadge>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.95)",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
              }}
            >
              {discountText}
            </Typography>
          </DiscountBadge>
        </Box>
      )}

      {/* Wishlist — top-right */}
      <WishlistBtn
        variant="vertical"
        onClick={onWishlist}
        sx={{ top: 9, right: 9, width: 26, height: 26 }}
      >
        <i
          className={isWishlisted ? "fi fi-sr-heart" : "fi fi-br-heart"}
          style={{
            fontSize: "13px",
            lineHeight: 1,
            display: "flex",
            color: theme.palette.error.red,
          }}
        />
      </WishlistBtn>

      {/* Info button — only shown when there are more similar vehicles.
          Expands on hover to reveal "N More Similar Vehicle(s)". */}
      {showInfoButton && (
        <Box
          sx={{
            position: "absolute",
            bottom: 9,
            right: 9,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: 28,
            maxWidth: "calc(100% - 18px)",
            borderRadius: "999px",
            backgroundColor: "info.main",
            color: "#fff",
            cursor: "pointer",
            overflow: "hidden",
            transition: "max-width 0.3s ease, padding 0.3s ease",
            "& .info-label": {
              maxWidth: 0,
              opacity: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              fontSize: "12px",
              fontWeight: 500,
              lineHeight: 1.2,
              transition:
                "max-width 0.3s ease, opacity 0.25s ease, padding 0.3s ease",
            },
            "&:hover": {
              px: "10px",
              gap: "6px",
            },
            "&:hover .info-label": {
              maxWidth: 220,
              opacity: 1,
            },
          }}
        >
          <Typography
            component="span"
            className="info-label"
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {tooltipContent}
          </Typography>
          <Box
            component="span"
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i
              className="fi fi-rs-info"
              style={{
                fontSize: "14px",
                lineHeight: 1,
                display: "flex",
                color: "#fff",
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

// ─── RentalInfoSection — store + name + "Start From" + price + feature tags ──

export const RentalInfoSection = ({
  item,
  isStore,
  displayPrice,
  originalPrice,
}) => {
  const { t } = useTranslation();
  const lanDirection = getLanguage() || "ltr";
  const { ref: nameRef, isEllipsed } = useTextEllipsis(item?.name);
  const features = [];
  if (item?.capacity)
    features.push({
      iconClass: "fi fi-rs-user",
      label: `${item.capacity} ${t("Seats")}`,
    });
  if (item?.air_conditioning)
    features.push({ iconClass: "fi fi-rs-wind", label: t("AC") });
  if (item?.transmission)
    features.push({ iconClass: "fi fi-rs-command", label: item.transmission });
  if (item?.extra_features) features.push({ label: item.extra_features });

  return (
    <Stack
      sx={{
        flexDirection: "column",
        gap: "8px",
        pt: "12px",
        px: "4px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <StoreRow
        storeName={item?.store_name}
        storeLogoUrl={
          item?.store_logo_full_url ??
          item?.store?.logo_full_url ??
          item?.store_details?.logo_full_url
        }
        rating={item?.avg_rating}
        isStore={isStore}
        verifiedSeller={
          item?.verified_seller ??
          item?.store?.verified_seller ??
          item?.store_details?.verified_seller
        }
        storeRedirectData={
          item?.store_details || {
            id: item?.store_id,
            slug: item?.store_slug,
          }
        }
      />
      <Stack sx={{ flexDirection: "column", gap: "6px" }}>
        {(() => {
          const el = (
            <Typography
              ref={nameRef}
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "customColor.textNeutral",
                lineHeight: 1.1,
                letterSpacing: "-0.48px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                textTransform: "capitalize",
                textAlign: lanDirection === "rtl" ? "end" : "start",
              }}
            >
              {item?.name}
            </Typography>
          );
          return isEllipsed ? (
            <Tooltip title={item?.name} placement="top" arrow>
              {el}
            </Tooltip>
          ) : (
            el
          );
        })()}

        <Stack sx={{ flexDirection: "column", gap: "2px" }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              color: "neutral.500",
              lineHeight: 1.2,
              letterSpacing: "-0.42px",
            }}
          >
            {t("Start From")}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            gap="4px"
            flexWrap="wrap"
            sx={{ py: "2px" }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-0.54px",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {getAmountWithSign(displayPrice)}
            </Typography>
            {originalPrice > displayPrice && (
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "neutral.500",
                  lineHeight: 1.2,
                  letterSpacing: "-0.42px",
                  textDecoration: "line-through",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {getAmountWithSign(originalPrice)}
              </Typography>
            )}
          </Stack>
        </Stack>

        {features.length > 0 && (
          <Stack direction="row" gap="6px" flexWrap="wrap" alignItems="center">
            {features.map((f, i) => (
              <RentalFeatureTag
                key={i}
                iconClass={f.iconClass}
                label={f.label}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────

const NewProductCard = ({
  item,
  variant = "vertical", // "vertical" | "horizontal"
  onCardClick,
  max_width,
  cardWidth,
  isStore,
  isPharmacy = false,
  isRental = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const reduxDispatch = useDispatch();
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [openLocationAlert, setOpenLocationAlert] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const { cartList: aliasCartList } = useSelector((s) => s.cart);
  const { wishLists } = useSelector((s) => s.wishList);
  const { configData } = useSelector((s) => s.configData);

  // ── Derived values — no useState/useEffect needed ──
  const cartList = getCartListModuleWise(aliasCartList);
  const isInCart = cartList?.find((c) => c.id === item?.id);
  const isProductExist = !!isInCart;
  const count = isInCart?.quantity ?? 0;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isWishlisted =
    !!token && !!wishLists?.item?.find((w) => w.id === item?.id);

  const { mutate: addToMutate, isLoading } = useAddCartItem();
  const { mutate: updateMutate, isLoading: updateLoading } =
    useCartItemUpdate();
  const { mutate: cartItemRemoveMutate } = useDeleteCartItem();
  const { mutate: addFavoriteMutation } = useAddToWishlist();
  const { mutate: wishlistDeleteMutate } = useWishListDelete();
  const wishlistPending = useRef(false);

  // ── Cart add success handler ──
  const handleAddSuccess = (res) => {
    if (!res) return;
    console.log({ res });

    let product = {};
    res.forEach((i) => {
      product = {
        ...i?.item,
        cartItemId: i?.id,
        quantity: i?.quantity,
        totalPrice: i?.price,
        selectedOption: [],
      };
    });
    reduxDispatch(setCart(product));
    toast.success(t("Item added to cart"));
    dispatch({ type: ACTION.setClearCartModal, payload: false });
  };

  // ── Cart increment success — exact copy from ProductCard ──
  const cartUpdateHandleSuccess = (res) => {
    if (!res) return;
    res.forEach((i) => {
      if (isInCart?.cartItemId === i?.id) {
        reduxDispatch(
          setIncrementToCartItem({
            ...i?.item,
            cartItemId: i?.id,
            totalPrice: i?.price,
            quantity: i?.quantity,
            food_variations: i?.item?.food_variations,
            selectedAddons: i?.item?.addons,
            itemBasePrice: i?.item?.price,
            selectedOption: i?.variation,
          })
        );
      }
    });
  };

  // ── Cart decrement success — exact copy from ProductCard ──
  const cartUpdateHandleSuccessDecrement = (res) => {
    if (!res) return;
    res.forEach((i) => {
      reduxDispatch(
        setDecrementToCartItem({
          ...i?.item,
          cartItemId: i?.id,
          totalPrice: i?.price,
          quantity: i?.quantity,
          food_variations: i?.item?.food_variations,
          selectedAddons: i?.item?.addons,
          itemBasePrice: i?.item?.price,
          selectedOption: i?.variation,
        })
      );
    });
  };

  // ── Direct add to cart (no variation) ──
  const addToCartHandler = () => {
    const itemObject = {
      guest_id: getGuestId(),
      model: item?.available_date_starts ? "ItemCampaign" : "Item",
      add_on_ids: [],
      add_on_qtys: [],
      item_id: item?.id,
      price: item?.price,
      quantity: 1,
      variation: [],
    };

    if (cartList.length > 0) {
      // Multi-store carts allowed — always proceed with add.
      const isStoreExist = true;
      if (isStoreExist) {
        if (!isInCart)
          addToMutate(
            { postData: itemObject, store_id: item?.store_id },
            {
              onSuccess: handleAddSuccess,
              onError: onErrorResponse,
            }
          );
      } else {
        dispatch({ type: ACTION.setClearCartModal, payload: true });
      }
    } else {
      if (!isInCart)
        addToMutate(
          { postData: itemObject, store_id: item?.store_id },
          {
            onSuccess: handleAddSuccess,
            onError: onErrorResponse,
          }
        );
    }
  };

  // ── Cart clear modal confirm — use item directly (no modalData state) ──
  const handleCloseForClearCart = (value) => {
    if (value === "add-item") {
      addToMutate(
        {
          postData: {
            guest_id: getGuestId(),
            model: item?.available_date_starts ? "ItemCampaign" : "Item",
            add_on_ids: [],
            add_on_qtys: [],
            item_id: item?.id,
            price: item?.price,
            quantity: 1,
            variation: [],
          },
          store_id: item?.store_id,
        },
        { onSuccess: handleAddSuccess, onError: onErrorResponse }
      );
    } else {
      dispatch({ type: ACTION.setClearCartModal, payload: false });
    }
  };

  // ── Increment — exact logic from ProductCard ──
  const handleIncrement = () => {
    if (!isInCart) return;
    if (updateLoading) return;
    const updateQuantity = isInCart.quantity + 1;
    const itemObject = getItemDataForAddToCart(
      isInCart,
      updateQuantity,
      getPriceAfterQuantityChange(isInCart, updateQuantity),
      getGuestId()
    );

    if (getCurrentModuleType() === ModuleTypes.FOOD) {
      if (
        item?.maximum_cart_quantity &&
        item.maximum_cart_quantity <= isInCart.quantity
      ) {
        toast.error(t(out_of_limits), { id: "out-of-limits" });
        return;
      }
      updateMutate(itemObject, {
        onSuccess: cartUpdateHandleSuccess,
        onError: onErrorResponse,
      });
    } else {
      // Variation-aware stock: if a variation is selected, use its stock.
      // isInCart.stock is base product stock — not reliable for variation products.
      const selectedVariation = isInCart.selectedOption?.[0];
      const stockValue =
        selectedVariation && typeof selectedVariation.stock === "number"
          ? selectedVariation.stock
          : isInCart.stock ?? item?.stock;
      if (
        stockValue != null &&
        (stockValue <= 0 || isInCart.quantity + 1 > stockValue)
      ) {
        toast.error(t(out_of_stock), { id: "out-of-stock" });
        return;
      }
      if (
        item?.maximum_cart_quantity &&
        item.maximum_cart_quantity <= isInCart.quantity
      ) {
        toast.error(t(out_of_limits), { id: "out-of-limits" });
        return;
      }
      updateMutate(itemObject, {
        onSuccess: cartUpdateHandleSuccess,
        onError: onErrorResponse,
      });
    }
  };

  // ── Decrement — exact logic from ProductCard ──
  const handleDecrement = () => {
    if (!isInCart) return;
    if (isInCart.quantity === 1) {
      cartItemRemoveMutate(
        {
          cart_id: isInCart.cartItemId,
          store_id: isInCart?.store_id ?? isInCart?.store?.id,
          guestId: getGuestId(),
        },
        {
          onSuccess: () => {
            reduxDispatch(setRemoveItemFromCart(isInCart));
            toast.success(t("Removed from cart."));
          },
          onError: onErrorResponse,
        }
      );
    } else {
      const updateQuantity = isInCart.quantity - 1;
      updateMutate(
        getItemDataForAddToCart(
          isInCart,
          updateQuantity,
          getPriceAfterQuantityChange(isInCart, updateQuantity),
          getGuestId()
        ),
        {
          onSuccess: cartUpdateHandleSuccessDecrement,
          onError: onErrorResponse,
        }
      );
    }
  };

  // ── Wishlist toggle ──
  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (wishlistPending.current) return;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error(t(not_logged_in_message));
      return;
    }
    wishlistPending.current = true;
    if (isWishlisted) {
      wishlistDeleteMutate(item?.id, {
        onSuccess: (res) => {
          reduxDispatch(removeWishListItem(item?.id));
          queryClient.invalidateQueries("wishlist");
          toast.success(res.message, { id: "wishlist" });
        },
        onError: (err) => toast.error(err?.response?.data?.message),
        onSettled: () => {
          wishlistPending.current = false;
        },
      });
    } else {
      addFavoriteMutation(item?.id, {
        onSuccess: (res) => {
          reduxDispatch(addWishList(item));
          queryClient.invalidateQueries("wishlist");
          toast.success(res?.message);
        },
        onError: (err) => toast.error(err?.response?.data?.message),
        onSettled: () => {
          wishlistPending.current = false;
        },
      });
    }
  };

  // ── Card click — exact from ProductCard ──
  const handleClick = () => {
    if (onCardClick) {
      onCardClick(item);
      return;
    }
    if (item?.module_type === "ecommerce") {
      handleProductRedirect(item, router);
    } else {
      dispatch({ type: ACTION.setOpenModal, payload: true });
    }
  };

  // ── Add button click — exact addToCart from ProductCard ──
  const handleAddClick = (e) => {
    e.stopPropagation();
    if (item?.module_type === "ecommerce") {
      if (item?.variations?.length > 0 || item?.has_variant) {
        handleProductRedirect(item, router);
      } else {
        addToCartHandler();
      }
    } else if (item?.module_type === "food") {
      if (item?.food_variations?.length > 0 || item?.has_variant) {
        dispatch({ type: ACTION.setOpenModal, payload: true });
      } else {
        addToCartHandler();
      }
    } else {
      if (item?.variations?.length > 0 || item?.has_variant) {
        dispatch({ type: ACTION.setOpenModal, payload: true });
      } else {
        addToCartHandler();
      }
    }
  };

  // ── Computed price ──
  const displayPrice =
    item?.discount > 0
      ? item.price -
        (item.discount_type === "percent"
          ? (item.price * item.discount) / 100
          : item.discount)
      : item?.price;
  const originalPrice = item?.price;
  const discountText =
    item?.discount > 0
      ? item.discount_type === "percent"
        ? `-${item.discount}%`
        : `-${getAmountWithSign(item.discount)}`
      : null;

  // ── Shared overlay/info props ──
  const subName = Array.isArray(item?.generic_name)
    ? item?.generic_name?.[0]
    : item?.generic_name;
  const companyName = item?.manufacturer || "";

  const cartControlProps = {
    isProductExist,
    count,
    updateLoading,
    isLoading,
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

  const isFood = getCurrentModuleType() === ModuleTypes.FOOD;

  return (
    <>
      {/* Product modal */}
      {state.openModal && isFood && item && (
        <FoodDetailModal
          product={item}
          imageBaseUrl={configData?.base_urls?.item_image_url}
          open={state.openModal}
          handleModalClose={() =>
            dispatch({ type: ACTION.setOpenModal, payload: false })
          }
          setOpen={(v) => dispatch({ type: ACTION.setOpenModal, payload: v })}
          addToWishlistHandler={toggleWishlist}
          removeFromWishlistHandler={toggleWishlist}
          isWishlisted={isWishlisted}
          setOpenLocationAlert={setOpenLocationAlert}
        />
      )}
      {state.openModal && !isFood && item && (
        <ModuleModal
          open={state.openModal}
          handleModalClose={() =>
            dispatch({ type: ACTION.setOpenModal, payload: false })
          }
          configData={configData}
          productDetailsData={item}
          addToWishlistHandler={toggleWishlist}
          removeFromWishlistHandler={toggleWishlist}
          isWishlisted={isWishlisted}
        />
      )}

      {/* Cart clear modal */}
      <CustomModal
        openModal={state.clearCartModal}
        handleClose={() =>
          dispatch({ type: ACTION.setClearCartModal, payload: false })
        }
      >
        <CartClearModal
          handleClose={handleCloseForClearCart}
          dispatchRedux={reduxDispatch}
        />
      </CustomModal>

      {/* Location alert */}
      <CustomModal
        openModal={openLocationAlert}
        handleClose={() => setOpenLocationAlert(false)}
      >
        <GetLocationAlert setOpenAlert={setOpenLocationAlert} />
      </CustomModal>

      <CustomDialogConfirm
        dialogTexts={t("Are you sure you want to delete this item?")}
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        onSuccess={() => {}}
      />

      {/* ── Rental Card (always vertical) ── */}
      {isRental && (
        <Box
          onClick={handleClick}
          sx={{
            width: { xs: "150px", md: "180px" },
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px",
            cursor: "pointer",
            gap: "8px",
          }}
        >
          <Box
            className="card-img"
            sx={{
              position: "relative",
              backgroundColor: "background.secondary",
              border: `1px solid ${theme.palette.neutral[200]}`,
              borderRadius: "12px",
              overflow: "hidden",
              width: "100%",
              aspectRatio: "2 / 1",
            }}
          >
            <NextImage
              src={item?.thumbnail_full_url}
              alt={item?.name}
              width="270"
              height="136"
              objectFit="cover"
            />
            <RentalImageOverlay
              discountText={discountText}
              item={item}
              isWishlisted={isWishlisted}
              onWishlist={toggleWishlist}
            />
          </Box>
          <RentalInfoSection
            item={item}
            isStore={isStore}
            displayPrice={displayPrice}
            originalPrice={originalPrice}
          />
        </Box>
      )}

      {/* ── Vertical Card ── */}
      {variant === "vertical" && isPharmacy && !isRental && (
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
            overflow: "hidden",
            "&:hover .img-gradient-overlay": { opacity: 1 },
          }}
        >
          <ImageContainer variant="vertical" className="card-img">
            <NextImage
              src={item?.image_full_url}
              alt={item?.name}
              width="190"
              height="190"
              objectFit="cover"
            />
            <Box
              className="img-gradient-overlay"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60px",
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0) 11%, rgba(0,0,0,0.6) 100%)",
                pointerEvents: "none",
                zIndex: 1,
                opacity: 0,
                transition: "opacity 0.3s ease",
              }}
            />
            <PharmacyImageOverlay
              isHorizontal={false}
              discountText={discountText}
              item={item}
              isWishlisted={isWishlisted}
              onWishlist={toggleWishlist}
              {...cartControlProps}
            />
          </ImageContainer>
          <PharmacyInfoSection
            isHorizontal={false}
            item={item}
            isStore={isStore}
            subName={subName}
            companyName={companyName}
            displayPrice={displayPrice}
            originalPrice={originalPrice}
          />
        </Box>
      )}

      {/* ── Horizontal Card ── */}
      {variant === "horizontal" && isPharmacy && !isRental && (
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
            border: "none",
            borderRadius: "12px",
            overflow: "hidden",
            pl: "12px",
            pr: "8px",
            py: "10px",
            cursor: "pointer",
            "&:hover .img-gradient-overlay": { opacity: 1 },
            "&:hover": {
              boxShadow: `0px 4px 12px ${alpha(
                theme.palette.neutral[1000],
                0.08
              )}`,
            },
          }}
        >
          <PharmacyInfoSection
            isHorizontal
            item={item}
            isStore={isStore}
            subName={subName}
            companyName={companyName}
            displayPrice={displayPrice}
            originalPrice={originalPrice}
          />
          <ImageContainer
            variant="horizontal"
            className="card-img-h"
            sx={{
              width: { xs: "96px", sm: "126px" },
              height: { xs: "96px", sm: "126px" },
              flexShrink: 0,
            }}
          >
            <NextImage
              src={item?.image_full_url}
              alt={item?.name}
              width="126"
              height="126"
              objectFit="cover"
            />
            <Box
              className="img-gradient-overlay"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60px",
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0) 11%, rgba(0,0,0,0.6) 100%)",
                pointerEvents: "none",
                zIndex: 1,
                opacity: 0,
                transition: "opacity 0.3s ease",
              }}
            />
            <PharmacyImageOverlay
              isHorizontal
              discountText={discountText}
              item={item}
              isWishlisted={isWishlisted}
              onWishlist={toggleWishlist}
              {...cartControlProps}
            />
          </ImageContainer>
        </Box>
      )}

      {/* ── Vertical Card ── */}
      {variant === "vertical" && !isPharmacy && !isRental && (
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
            overflow: "hidden",
            "&:hover .img-gradient-overlay": { opacity: 1 },
          }}
        >
          <ImageContainer variant="vertical" className="card-img">
            <NextImage
              src={item?.image_full_url}
              alt={item?.name}
              width="190"
              height="190"
              objectFit="cover"
            />
            <Box
              className="img-gradient-overlay"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60px",
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0) 11%, rgba(0,0,0,0.6) 100%)",
                pointerEvents: "none",
                zIndex: 1,
                opacity: 0,
                transition: "opacity 0.3s ease",
              }}
            />
            <ImageOverlay
              isHorizontal={false}
              item={item}
              isWishlisted={isWishlisted}
              onWishlist={toggleWishlist}
              showVeg={
                !!configData?.toggle_veg_non_veg &&
                getCurrentModuleType() === ModuleTypes.FOOD
              }
              {...cartControlProps}
            />
          </ImageContainer>
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

      {/* ── Horizontal Card ── */}
      {variant === "horizontal" && !isPharmacy && !isRental && (
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
            "&:hover .img-gradient-overlay": { opacity: 1 },
            "&:hover": {
              boxShadow: `0px 4px 12px ${alpha(
                theme.palette.neutral[1000],
                0.08
              )}`,
            },
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
          <ImageContainer
            variant="horizontal"
            className="card-img-h"
            sx={{
              width: { xs: "96px", sm: "126px" },
              height: { xs: "96px", sm: "126px" },
              flexShrink: 0,
            }}
          >
            <NextImage
              src={item?.image_full_url}
              alt={item?.name}
              width="126"
              height="126"
              objectFit="cover"
            />
            <Box
              className="img-gradient-overlay"
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60px",
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0) 11%, rgba(0,0,0,0.6) 100%)",
                pointerEvents: "none",
                zIndex: 1,
                opacity: 0,
                transition: "opacity 0.3s ease",
              }}
            />
            <ImageOverlay
              isHorizontal
              item={item}
              isWishlisted={isWishlisted}
              onWishlist={toggleWishlist}
              showVeg={
                !!configData?.toggle_veg_non_veg &&
                getCurrentModuleType() === ModuleTypes.FOOD
              }
              {...cartControlProps}
            />
          </ImageContainer>
        </Box>
      )}
    </>
  );
};

export default NewProductCard;
