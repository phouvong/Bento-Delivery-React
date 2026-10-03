import {
  Box,
  Dialog,
  Drawer,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import NextImage from "components/NextImage";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { useGetItemDetails } from "api-manage/hooks/react-query/product-details/useGetItemDetails";
import { useGetServiceItemDetails } from "components/home/module-wise-components/service/service-api-manage/useGetServiceItemDetails";
import { StoreRow } from "./NewProductCard";

// ─── BundleSubItemViewModal — read-only "Item Modal Sheet" (per Figma) for a
// single bundle sub-item. Fetches the item's own full details (gallery,
// description, store, rating) for richer display, but shows only the
// variation/add-on already locked in by the bundle — no editing, no cart
// controls, no discount (bundle pricing is handled by the drawer itself).

const BundleSubItemViewModal = ({ open, onClose, subItem, storeInfo }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeImage, setActiveImage] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const [descOverflowing, setDescOverflowing] = useState(false);
  const descRef = useRef(null);

  // Service sub-items use `service_id` and the service module's own details
  // endpoint — mart's item-details API 404s for a service id.
  const { data: itemDetailsRaw, isFetched: isItemFetched } = useGetItemDetails(
    { id: subItem?.isService ? undefined : subItem?.id },
  );
  const { data: serviceDetailsRaw, isFetched: isServiceFetched } =
    useGetServiceItemDetails({ id: subItem?.isService ? subItem?.id : undefined });
  const itemDetails = subItem?.isService ? serviceDetailsRaw : itemDetailsRaw;
  const isFetched = subItem?.isService ? isServiceFetched : isItemFetched;
  // Service's details API has no plain `description` — falls back to
  // long/short description instead.
  const description = subItem?.isService
    ? itemDetails?.long_description ?? itemDetails?.short_description
    : itemDetails?.description;

  useEffect(() => {
    setActiveImage(0);
    setDescExpanded(false);
  }, [subItem?.id]);

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    setDescOverflowing(el.scrollHeight > el.clientHeight);
  }, [description]);

  if (!subItem) return null;

  // Service's details API names these differently from mart's item-details.
  const galleryImages = subItem?.isService
    ? itemDetails?.additional_images_full_url
    : itemDetails?.images_full_url;
  const primaryImage = subItem?.isService
    ? itemDetails?.thumbnail_full_url
    : itemDetails?.image_full_url;
  const images = galleryImages?.length
    ? galleryImages
    : primaryImage
      ? [primaryImage]
      : subItem.image
        ? [subItem.image]
        : [];

  const store = {
    storeName:
      itemDetails?.store_name ?? itemDetails?.provider_name ?? storeInfo?.storeName,
    storeLogoUrl: subItem?.isService
      ? itemDetails?.provider_image_full_url ?? storeInfo?.storeLogoUrl
      : itemDetails?.store_details?.logo_full_url ?? storeInfo?.storeLogoUrl,
    rating: itemDetails?.avg_rating ?? storeInfo?.rating,
    verifiedSeller: subItem?.isService
      ? itemDetails?.verified_provider ?? storeInfo?.verifiedSeller
      : itemDetails?.store_details?.verified_seller ?? storeInfo?.verifiedSeller,
  };

  const totalPrice = (subItem.unitPrice ?? 0) * (subItem.quantity ?? 1);

  const body = (
    <Stack sx={{ height: "100%", minHeight: 0 }}>
      {/* Top bar — close only, per Figma */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          px: "12px",
          py: "6px",
          flexShrink: 0,
        }}
      >
        <IconButton size="small" onClick={onClose} sx={{ borderRadius: "50%" }}>
          <i
            className="fi fi-rr-cross-small"
            style={{
              fontSize: "20px",
              lineHeight: 1,
              display: "flex",
              color: theme.palette.neutral[1050],
            }}
          />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: "20px", pb: "24px" }}>
          {/* Main image */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "380 / 282",
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "background.secondary",
              border: (th) => `1px solid ${th.palette.neutral[200]}`,
              "& img": {
                position: "absolute",
                inset: 0,
                width: "100% !important",
                height: "100% !important",
                objectFit: "cover",
              },
            }}
          >
            <NextImage
              src={images[activeImage] ?? subItem.image}
              alt={subItem.name}
              width="380"
              height="282"
              objectFit="cover"
            />
          </Box>

          {/* Thumbnail gallery — only when the item actually has more than one image */}
          {images.length > 1 && (
            <Stack direction="row" gap="8px" sx={{ mt: "10px", overflowX: "auto" }}>
              {images.map((src, i) => (
                <Box
                  key={i}
                  onClick={() => setActiveImage(i)}
                  sx={{
                    position: "relative",
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: (th) =>
                      `2px solid ${
                        i === activeImage
                          ? th.palette.primary.main
                          : th.palette.neutral[200]
                      }`,
                    "& img": {
                      position: "absolute",
                      inset: 0,
                      width: "100% !important",
                      height: "100% !important",
                      objectFit: "cover",
                    },
                  }}
                >
                  <NextImage src={src} alt={subItem.name} width="48" height="48" objectFit="cover" />
                </Box>
              ))}
            </Stack>
          )}

          {/* Store row */}
          {!!store.storeName && (
            <Box sx={{ mt: "16px" }}>
              <StoreRow
                storeName={store.storeName}
                storeLogoUrl={store.storeLogoUrl}
                rating={store.rating}
                verifiedSeller={store.verifiedSeller}
                storeRedirectData={{}}
              />
            </Box>
          )}

          {/* Name */}
          <Typography
            sx={{
              mt: "12px",
              fontSize: "18px",
              fontWeight: 700,
              color: "neutral.1050",
              lineHeight: 1.2,
              letterSpacing: "-0.54px",
              textTransform: "capitalize",
            }}
          >
            {subItem.name}
          </Typography>

          {/* Rating + review count */}
          {Number(itemDetails?.avg_rating) > 0 && (
            <Stack direction="row" alignItems="center" gap="4px" sx={{ mt: "4px" }}>
              <i
                className="fi fi-sr-star"
                style={{
                  fontSize: "13px",
                  lineHeight: 1,
                  display: "flex",
                  color: theme.palette.customColor.starAmber,
                }}
              />
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "neutral.500" }}>
                {Number(itemDetails.avg_rating).toFixed(1)}
              </Typography>
              {Number(itemDetails?.rating_count) > 0 && (
                <Typography sx={{ fontSize: "13px", color: "neutral.400" }}>
                  ({itemDetails.rating_count} {t("Reviews")})
                </Typography>
              )}
            </Stack>
          )}

          {/* Price + quantity */}
          <Stack
            direction="row"
            alignItems="baseline"
            justifyContent="space-between"
            sx={{ mt: "8px" }}
          >
            <Stack direction="row" alignItems="baseline" gap="6px">
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
                {getAmountWithSign(subItem.unitPrice)}
              </Typography>
              {subItem.quantity > 1 && (
                <Typography sx={{ fontSize: "13px", fontWeight: 400, color: "neutral.500" }}>
                  × {subItem.quantity} = {getAmountWithSign(totalPrice)}
                </Typography>
              )}
            </Stack>

            <Box
              sx={{
                minWidth: "36px",
                borderRadius: "8px",
                backgroundColor: "background.secondary",
                px: "8px",
                py: "6px",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "neutral.1050",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {t("Qty")}: {subItem.quantity}
              </Typography>
            </Box>
          </Stack>

          {/* Description — from the item's own details, not part of the
              bundle summary. Skeleton while the item fetch hasn't settled
              yet, so the layout doesn't jump once it arrives. */}
          {!isFetched ? (
            <Stack sx={{ mt: "16px", gap: "6px" }}>
              <Skeleton variant="text" width="30%" height={18} />
              <Skeleton variant="text" width="100%" height={16} />
              <Skeleton variant="text" width="90%" height={16} />
              <Skeleton variant="text" width="60%" height={16} />
            </Stack>
          ) : (
            !!description && (
              <Stack sx={{ mt: "16px", gap: "4px" }}>
                <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "neutral.500" }}>
                  {t("Description")}
                </Typography>
                <Typography
                  ref={descRef}
                  sx={{
                    fontSize: "14px",
                    color: "neutral.1050",
                    lineHeight: 1.5,
                    "& p": { margin: 0 },
                    ...(!descExpanded && {
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }),
                  }}
                  // Service's long_description is rich text (HTML tags);
                  // mart's description is plain text.
                  {...(subItem?.isService
                    ? { dangerouslySetInnerHTML: { __html: description } }
                    : { children: description })}
                />
                {(descOverflowing || descExpanded) && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    gap="4px"
                    onClick={() => setDescExpanded((v) => !v)}
                    justifyContent="center"
                    sx={{
                      cursor: "pointer",
                      alignSelf: "center",
                      mt: "6px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "primary.main",
                      }}
                    >
                      {descExpanded ? t("See Less") : t("See More")}
                    </Typography>
                    <i
                      className="fi fi-rr-angle-small-down"
                      style={{
                        fontSize: "14px",
                        lineHeight: 1,
                        display: "flex",
                        color: theme.palette.primary.main,
                        transform: descExpanded ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </Stack>
                )}
              </Stack>
            )
          )}

          {/* Selected variation + add-ons — the only "options" shown, since
              this is a locked-in bundle line, not an editable product */}
          {!!subItem.variationText && (
            <Stack sx={{ mt: "16px", gap: "4px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "neutral.500" }}>
                {t("Variation")}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "neutral.1050" }}>
                {subItem.variationText}
              </Typography>
            </Stack>
          )}
          {!!subItem.addOnSummary && (
            <Stack sx={{ mt: "12px", gap: "4px" }}>
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "neutral.500" }}>
                {t("Addon")}
              </Typography>
              <Typography sx={{ fontSize: "14px", color: "neutral.1050" }}>
                {subItem.addOnSummary}
              </Typography>
            </Stack>
          )}
      </Box>
    </Stack>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        sx={{ zIndex: 1500 }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            height: "85vh",
            maxHeight: "700px",
            minHeight: "60vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {body}
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      sx={{ zIndex: 1500 }}
      PaperProps={{
        sx: {
          width: 468,
          maxWidth: "100vw",
          borderRadius: "20px",
          overflow: "hidden",
          maxHeight: "90vh",
        },
      }}
    >
      {body}
    </Dialog>
  );
};

export default BundleSubItemViewModal;
