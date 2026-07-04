import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import InStockTag from "../../product-details/InStockTag";
import {
  getAvailableStock,
  isVariationAvailable,
} from "../../product-details/product-details-section/helperFunction";
import { CustomOverlayBox } from "styled-components/CustomStyles.style";
import { isAvailable } from "utils/CustomFunctions";
import BadgeWithTooltip from "components/common/BadgeWithTooltip";
import ProductHalalSvg from "components/cards/assets/ProductHalalSvg";
import ProductVegSvg from "components/cards/assets/ProductVegSvg";
import ProductNonVegSvg from "components/cards/assets/ProductNonVegSvg";
import ProductOrganicSvg from "components/cards/assets/ProductOrganicSvg";
import NotAvailableCard from "./NotAvailableCard";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";
import CustomImageContainer from "../../CustomImageContainer";
import FoodModalMediaPreview from "./FoodModalMediaPreview";
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "../../../helper-functions/CardHelpers";

const RemainingStock = ({ qty = 0 }) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        padding: "3px 10px",
        backgroundColor: (theme) => alpha(theme.palette.info.blue, 0.1),
        color: (theme) => alpha(theme.palette.info.blue, 1),
        fontSize: "12px",
        borderRadius: "5px",
        fontWeight: 500,
        textAlign: "center",
      }}
    >
      {t("Only")} {qty} {t("Products Left")}
    </Box>
  );
};

const FoodDetailsManager = (props) => {
  const {
    configData,
    modalData,
    product,
    t,
    router,
    addToWishlistHandler,
    removeFromWishlistHandler,
    isWishlisted,
    theme,
    handleRouteToStore,
    onClose,
  } = props;

  const item = modalData?.[0];
  const [activeThumb, setActiveThumb] = useState(0);
  const wishlistPending = useRef(false);
  const handleWishlistClick = (e) => {
    if (wishlistPending.current) return;
    wishlistPending.current = true;
    const handler = isWishlisted
      ? removeFromWishlistHandler
      : addToWishlistHandler;
    handler?.(e);
    setTimeout(() => {
      wishlistPending.current = false;
    }, 2000);
  };

  const { showLowStockCount, minimumStockForWarning } = useMemo(() => {
    const store = product?.store_details ?? item?.store_details;
    return {
      showLowStockCount: Number(store?.show_low_stock_count) === 1,
      minimumStockForWarning: Number(store?.minimum_stock_for_warning) || 0,
    };
  }, [product?.store_details, modalData]);

  const renderStockBadge = (data) => {
    if (!data) return null;
    if (!isVariationAvailable(data)) return null;
    const availableStock = getAvailableStock(data);
    if (availableStock <= 0) return null;
    const cartQuantity = data?.quantity || 0;
    const currentStock = Math.max(0, availableStock - (cartQuantity - 1));
    const showWarning =
      showLowStockCount && minimumStockForWarning >= currentStock;
    return showWarning ? <RemainingStock qty={currentStock} /> : <InStockTag />;
  };

  const allImages = [
    ...(item?.images_full_url ?? []),
    item?.image_full_url,
  ].filter(Boolean);

  const hasVideoPreview =
    !!item?.video_preview_available &&
    !!(item?.video_preview_url || item?.video_preview_modal_url);
  const videoOffset = hasVideoPreview ? 1 : 0;

  const price = item?.price ?? product?.price ?? 0;
  const discounted = getDiscountedAmount(
    price,
    item?.discount ?? product?.discount,
    item?.discount_type ?? product?.discount_type,
    item?.store_discount ?? product?.store_discount,
    1
  );
  const hasDiscount = discounted < price;

  const isUnavailable =
    item &&
    !isAvailable(item?.available_time_starts, item?.available_time_ends);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack spacing={0} sx={{ width: "100%" }}>
      {/* Image: full width on mobile (no horizontal padding from outer container) */}
      <Box sx={{ position: "relative" }}>
        {isUnavailable && (
          <CustomOverlayBox height="40%" top="40%">
            <NotAvailableCard
              endTime={item?.available_time_ends}
              startTime={item?.available_time_starts}
            />
          </CustomOverlayBox>
        )}

        {/* Close button — mobile only, scrolls with content, top-left of image */}
        {onClose && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              display: { xs: "flex", md: "none" },
              position: "absolute",
              top: 12,
              left: 12,
              zIndex: 5,
              width: 28,
              height: 28,
              padding: 0,
              backgroundColor: "rgba(0,0,0,0.35)",
              borderRadius: "50%",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.55)" },
            }}
          >
            <i
              className="fi fi-rr-cross-small"
              style={{
                fontSize: 16,
                display: "flex",
                lineHeight: 1,
                color: "#fff",
              }}
            />
          </IconButton>
        )}

        {/* Wishlist button — top-right of image */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: 12, md: 10 },
            right: { xs: 12, md: 10 },
            zIndex: 5,
            width: 36,
            height: 36,
            borderRadius: { xs: "50%", md: "8px" },
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton onClick={handleWishlistClick} size="small">
            <i
              className={isWishlisted ? "fi fi-sr-heart" : "fi fi-rr-heart"}
              style={{
                fontSize: 16,
                display: "flex",
                lineHeight: 1,
                color: theme.palette.primary.main,
              }}
            />
          </IconButton>
        </Box>

        <FoodModalMediaPreview
          imageUrl={allImages}
          product={item}
          height="282px"
          aspectRatio="1/1"
          borderRadius={isMobile ? "0px" : "12px"}
          alt={item?.name}
          activeIndex={activeThumb + videoOffset}
          onSlideChange={(idx) => {
            const mapped = idx - videoOffset;
            if (mapped >= 0) setActiveThumb(mapped);
          }}
        />
      </Box>

      {/* Content after image: px 1.5 (12px) on mobile, 0 on desktop */}
      <Stack spacing={1} sx={{ px: { xs: 1.5, md: 0 }, pt: 1.5 }}>
        {allImages.length > 1 && (
          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              overflowX: "auto",
              pb: 0.5,
              "&::-webkit-scrollbar": { height: 4 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: alpha(theme.palette.text.primary, 0.15),
                borderRadius: 4,
              },
            }}
          >
            {allImages.map((img, idx) => (
              <Box
                key={idx}
                onClick={() => setActiveThumb(idx)}
                sx={{
                  flexShrink: 0,
                  width: 48,
                  height: 48,
                  borderRadius: "10px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: `1px solid ${
                    idx === activeThumb
                      ? theme.palette.primary.main
                      : alpha(theme.palette.text.primary, 0.1)
                  }`,
                  transition: "border-color 0.15s ease",
                }}
              >
                <CustomImageContainer
                  src={img}
                  width="100%"
                  height="100%"
                  objectfit="cover"
                />
              </Box>
            ))}
          </Stack>
        )}

        {router?.pathname !== `/store/[id]` &&
          (item?.store_name || product?.store_name) && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              onClick={handleRouteToStore}
              sx={{ cursor: "pointer" }}
            >
              {/* verified → verified icon; not verified + logo → logo; otherwise nothing */}
              {item?.store_details?.verified_seller ?? item?.verified_seller ? (
                <VerifiedStoreBadge verified fontSize="14px" />
              ) : item?.store_details?.logo_full_url ? (
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <CustomImageContainer
                    src={item?.store_details?.logo_full_url}
                    width="100%"
                    height="100%"
                    objectfit="cover"
                  />
                </Box>
              ) : null}
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "13px" },
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                }}
              >
                {item?.store_name || product?.store_name}
              </Typography>
            </Stack>
          )}

        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
          <Typography
            sx={{
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 700,
              color: theme.palette.text.primary,
              lineHeight: 1.25,
            }}
          >
            {item?.name}
          </Typography>
          {renderStockBadge(item)}
        </Stack>

        {/* Rating */}
        {Number(item?.avg_rating) > 0 && (
          <Stack direction="row" alignItems="center" gap="2px">
            <i
              className="fi fi-sr-star"
              style={{
                color:
                  theme.palette.customColor?.starAmber ??
                  theme.palette.warning.main,
                fontSize: 14,
                display: "flex",
                lineHeight: 1,
              }}
            />
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-0.42px",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {Number(item?.avg_rating).toFixed(1)}
            </Typography>
            {Number(item?.rating_count) > 0 && (
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "neutral.500",
                  lineHeight: 1.2,
                  letterSpacing: "-0.36px",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                ({item?.rating_count} {t("Reviews")})
              </Typography>
            )}
          </Stack>
        )}

        {/* Price row */}
        <Stack
          direction="row"
          alignItems="baseline"
          gap="4px"
          flexWrap="wrap"
          sx={{ py: "2px" }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              color: "neutral.1050",
              lineHeight: 1.1,
              letterSpacing: "-0.6px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {getAmountWithSign(discounted)}
          </Typography>
          {hasDiscount && (
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
              {getAmountWithSign(price)}
            </Typography>
          )}
        </Stack>

        {/* Discount + free delivery + halal + veg/non-veg badges */}
        {(() => {
          const showHalal = !!item?.halal_tag_status && !!item?.is_halal;
          const showOrganic = !!item?.organic;
          const showVeg =
            item?.module?.module_type === "food" &&
            !!configData?.toggle_veg_non_veg;
          if (
            !hasDiscount &&
            !item?.store_details?.free_delivery &&
            !showHalal &&
            !showOrganic &&
            !showVeg
          )
            return null;
          return (
            <Stack
              direction="row"
              alignItems="center"
              gap="4px"
              flexWrap="wrap"
            >
              {hasDiscount && (
                <Box
                  sx={{
                    backgroundColor: "error.danger",
                    borderRadius: "24px",
                    px: "6px",
                    py: "2px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {item?.discount_type === "percent"
                      ? `-${item?.discount}%`
                      : `-${getAmountWithSign(item?.discount)}`}
                  </Typography>
                </Box>
              )}
              {!!item?.store_details?.free_delivery && (
                <Box
                  sx={{
                    backgroundColor: "error.dangerLight",
                    borderRadius: "24px",
                    px: "6px",
                    py: "2px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <i
                    className="fi fi-rs-biking-mountain"
                    style={{
                      fontSize: "12px",
                      lineHeight: 1,
                      display: "flex",
                      color: theme.palette.error.dangerText,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "error.dangerText",
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("Free")}
                  </Typography>
                </Box>
              )}
              {showOrganic && (
                <BadgeWithTooltip title={t("Organic")}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: "background.paper",
                      border: `1px solid ${theme.palette.divider}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      padding: "3px",
                    }}
                  >
                    <ProductOrganicSvg
                      color={theme.palette.customColor?.vegIcon}
                    />
                  </Box>
                </BadgeWithTooltip>
              )}
              {showHalal && (
                <BadgeWithTooltip title={t("This product is Halal")}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: "background.paper",
                      border: `1px solid ${theme.palette.divider}`,
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
              {showVeg && (
                <BadgeWithTooltip title={item?.veg ? t("Veg") : t("Non Veg")}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: "background.paper",
                      border: `1px solid ${theme.palette.divider}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      padding: "3px",
                    }}
                  >
                    {item?.veg ? (
                      <ProductVegSvg
                        color={theme.palette.customColor?.vegIcon}
                      />
                    ) : (
                      <ProductNonVegSvg />
                    )}
                  </Box>
                </BadgeWithTooltip>
              )}
            </Stack>
          );
        })()}

        {item?.generic_name?.[0] && (
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "13px" },
              color: theme.palette.text.secondary,
            }}
          >
            {item.generic_name[0]}
          </Typography>
        )}

        {item?.description && (
          <Typography
            sx={{
              fontSize: { xs: "13px", md: "14px" },
              color:
                theme.palette.neutral?.[400] || theme.palette.text.secondary,
              lineHeight: 1.55,
              whiteSpace: "pre-line",
            }}
          >
            {item?.description}
          </Typography>
        )}

        {item?.nutritions_name?.length > 0 && (
          <Stack spacing={0.5}>
            <Typography fontSize="13px" fontWeight={600}>
              {t("Nutrition Details")}
            </Typography>
            <Typography
              fontSize="12px"
              color={
                theme.palette.neutral?.[400] || theme.palette.text.secondary
              }
            >
              {item?.nutritions_name?.join(", ")}.
            </Typography>
          </Stack>
        )}

        {item?.allergies_name?.length > 0 && (
          <Stack spacing={0.5}>
            <Typography fontSize="13px" fontWeight={600}>
              {t("Allergic Ingredients")}
            </Typography>
            <Typography
              fontSize="12px"
              color={
                theme.palette.neutral?.[400] || theme.palette.text.secondary
              }
            >
              {item?.allergies_name?.join(", ")}.
            </Typography>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

FoodDetailsManager.propTypes = {};

export default FoodDetailsManager;
