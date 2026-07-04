import {
  alpha,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRef, useState } from "react";
import { useQueryClient } from "react-query";
import VideoPlayerWithCenteredControl from "components/home/paid-ads/VideoPlayerWithCenteredControl";
import { styled } from "@mui/material/styles";
import NextImage from "components/NextImage";
import ClosedNow from "components/closed-now";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";
import { useAddStoreToWishlist } from "api-manage/hooks/react-query/wish-list/useAddStoreToWishLists";
import { useWishListStoreDelete } from "api-manage/hooks/react-query/wish-list/useWishListStoreDelete";
import { handleStoreRedirect } from "helper-functions/handleStoreRedirect";
import { not_logged_in_message } from "utils/toasterMessages";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { addWishListStore, removeWishListStore } from "redux/slices/wishList";
import toast from "react-hot-toast";

// ─── Shadow (Figma Drop Shadow/300) ────────────────────────────────────────
const CARD_SHADOW =
  "0px 5px 9px 0px rgba(0,0,0,0.07), 0px 0px 4px 0px rgba(0,0,0,0.05)";

// ─── Styled ────────────────────────────────────────────────────────────────

const CardRoot = styled(Box)(({ theme }) => ({
  width: "min(300px, calc(100vw - 40px))",
  cursor: "pointer",
  "& .store-img img": {
    width: "100%",
    height: "100%",
  },
  "&:hover .img-gradient-overlay": {
    opacity: 1,
  },
}));

const AdsCardRoot = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "300px",
  cursor: "pointer",
  borderRadius: "12px",
  backgroundColor: theme.palette.background.paper,
  padding: "2px",
  boxShadow: "none",
  overflow: "hidden",
}));

const BadgePill = styled(Box)(({ theme, bgColor, textColor }) => ({
  backgroundColor: bgColor || theme.palette.error.dangerLight,
  borderRadius: 24,
  padding: "2px 6px",
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  flexShrink: 0,
}));

// ─── Sub-components ─────────────────────────────────────────────────────────

const DiscountBadges = ({ item, theme, t }) => {
  const discounts = [];

  if (item?.discount?.discount > 0) {
    const text =
      item.discount.discount_type === "percent"
        ? `-${item.discount.discount}%`
        : `-${item.discount.discount}`;
    discounts.push({ key: "pct", text, icon: null });
  }

  if (item?.free_delivery) {
    discounts.push({
      key: "free",
      text: t("Free"),
      icon: (
        <i
          className="fi fi-rs-biking-mountain"
          style={{
            fontSize: "12px",
            lineHeight: 1,
            display: "flex",
            color: theme.palette.error.dangerText,
          }}
        />
      ),
    });
  }

  if (item?.discount?.discount_type === "bogo") {
    discounts.push({
      key: "bogo",
      text: t("Buy 1 Get 1 Free"),
      icon: (
        <i
          className="fi fi-sr-badge-percent"
          style={{
            fontSize: "12px",
            lineHeight: 1,
            display: "flex",
            color: theme.palette.error.dangerText,
          }}
        />
      ),
    });
  }

  const visible = discounts.slice(0, 3);
  const overflow = discounts.length - visible.length;

  if (visible.length === 0) return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap="4px"
      flexWrap="nowrap"
      sx={{ overflow: "hidden" }}
    >
      {visible.map((d) => (
        <BadgePill key={d.key} theme={theme}>
          {d.icon}
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "error.dangerText",
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {d.text}
          </Typography>
        </BadgePill>
      ))}
      {overflow > 0 && (
        <BadgePill bgColor={theme.palette.customColor.tagBg}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "neutral.500",
              lineHeight: 1.3,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            +{overflow}
          </Typography>
        </BadgePill>
      )}
    </Stack>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

/**
 * Props:
 * - variant: "normal" (default) | "ads"
 * Normal: item (store), imageUrl, showAdBadge, showNewBadge
 * Ads:    ad (full ad object with add_type, cover_image_full_url, video_attachment_full_url, store, title, description)
 */
const NewStoreCard = ({
  item,
  imageUrl,
  variant = "normal",
  showAdBadge = false,
  showNewBadge = false,
  ad,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { wishLists } = useSelector((s) => s.wishList);
  const { configData } = useSelector((s) => s.configData);

  // Distance comes in meters from API — convert to km
  const formatDistance = (distanceInMeters) => {
    if (!distanceInMeters) return null;
    const km = distanceInMeters / 1000;
    const decimals = configData?.digit_after_decimal_point ?? 1;
    if (km > 1000) return t("1k+ km");
    return `${km.toFixed(decimals)} km`;
  };

  // For ads variant, wishlist targets ad.store; for normal, targets item
  const wishlistTarget = variant === "ads" ? ad?.store : item;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isWishlisted =
    !!token && !!wishLists?.store?.find((w) => w.id === wishlistTarget?.id);

  const { mutate: addFavoriteMutation } = useAddStoreToWishlist();
  const { mutate: wishlistDeleteMutate } = useWishListStoreDelete();
  const wishlistPending = useRef(false);

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
      wishlistDeleteMutate(wishlistTarget?.id, {
        onSuccess: (res) => {
          dispatch(removeWishListStore(wishlistTarget?.id));
          queryClient.invalidateQueries("wishlist");
          toast.success(res.message, { id: "wishlist" });
        },
        onError: (err) => toast.error(err?.response?.data?.message),
        onSettled: () => {
          wishlistPending.current = false;
        },
      });
    } else {
      addFavoriteMutation(wishlistTarget?.id, {
        onSuccess: (res) => {
          dispatch(addWishListStore(wishlistTarget));
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

  const handleClick = () =>
    handleStoreRedirect(variant === "ads" ? ad?.store : item, router);

  // ── Wishlist button (shared) ──
  const WishlistBtn = ({ size = 24 }) => (
    <IconButton
      onClick={toggleWishlist}
      sx={{
        width: size,
        height: size,
        padding: "6px",
        backgroundColor: "background.secondary",
        "&:hover": { backgroundColor: "neutral.200" },
      }}
    >
      {isWishlisted ? (
        <i
          className="fi fi-sr-heart"
          style={{
            fontSize: "12px",
            lineHeight: 1,
            display: "flex",
            color: theme.palette.error.red,
          }}
        />
      ) : (
        <i
          className="fi fi-br-heart"
          style={{
            fontSize: "12px",
            lineHeight: 1,
            display: "flex",
            color: theme.palette.error.red,
          }}
        />
      )}
    </IconButton>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // ADS VARIANT — uses `ad` prop (full ad object)
  // ─────────────────────────────────────────────────────────────────────────
  // Video player state — always called (hooks rules)
  const [playing, setPlaying] = useState(true);
  const [ended, setEnded] = useState(false);

  if (variant === "ads") {
    const isVideo = ad?.add_type === "video_promotion";
    const adStore = ad?.store;
    const adImage = ad?.cover_image_full_url;
    const adTitle = ad?.title || adStore?.name;
    const adDesc = ad?.description;

    return (
      <AdsCardRoot onClick={handleClick}>
        {/* Image / Video thumbnail */}
        <Box
          className="store-img"
          sx={{
            position: "relative",
            width: "100%",
            height: "185px",
            borderRadius: "12px",
            overflow: "hidden",
            border: "2px solid",
            borderColor: "background.paper",
            boxShadow:
              "0px 4px 4px -1px rgba(0,0,0,0.05), 0px 4px 4px -1px rgba(0,0,0,0.05)",
          }}
        >
          {isVideo ? (
            <VideoPlayerWithCenteredControl
              video={ad?.video_attachment_full_url}
              playing={playing}
              setPlaying={setPlaying}
              ended={ended}
              setEnded={setEnded}
              isMargin={false}
              height="185px"
            />
          ) : (
            <NextImage
              src={adImage}
              alt={adTitle}
              width="300"
              height="185"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
          <ClosedNow active={adStore?.active} open={1} borderRadius="12px" />
        </Box>

        {/* Info */}
        <Box
          sx={{
            pt: "16px",
            pb: "12px",
            px: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Ad title + wishlist */}
          <Stack direction="row" alignItems="flex-start" gap="10px">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack
                direction="row"
                alignItems="center"
                gap="4px"
                sx={{ mb: "4px" }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "neutral.1050",
                    lineHeight: 1.1,
                    letterSpacing: "-0.48px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textTransform: "capitalize",
                    flexShrink: 1,
                    minWidth: 0,
                  }}
                >
                  {adTitle}
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "neutral.500",
                  lineHeight: 1.3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {adDesc || adStore?.address}
              </Typography>
            </Box>
            <IconButton
              onClick={toggleWishlist}
              sx={{ padding: "8px", borderRadius: "50%", flexShrink: 0 }}
            >
              {isWishlisted ? (
                <i
                  className="fi fi-sr-heart"
                  style={{
                    fontSize: "20px",
                    lineHeight: 1,
                    display: "flex",
                    color: theme.palette.error.red,
                  }}
                />
              ) : (
                <i
                  className="fi fi-br-heart"
                  style={{
                    fontSize: "20px",
                    lineHeight: 1,
                    display: "flex",
                    color: theme.palette.error.red,
                  }}
                />
              )}
            </IconButton>
          </Stack>

          {/* Rating + divider + reviews + Explore */}
          <Stack direction="row" alignItems="center" gap="8px">
            {/* Rating — only show when there's meaningful data */}
            {(() => {
              const rating = Number(
                ad?.average_rating || adStore?.avg_rating || 0
              );
              const reviewCount =
                ad?.reviews_comments_count || adStore?.rating_count || 0;
              if (rating <= 0 && reviewCount <= 0) return null;
              return (
                <>
                  <Stack sx={{ gap: "2px", flexShrink: 0, minWidth: "56px" }}>
                    <Stack direction="row" alignItems="center" gap="2px">
                      <i
                        className="fi fi-sr-star"
                        style={{
                          fontSize: "14px",
                          lineHeight: 1,
                          display: "flex",
                          color: theme.palette.customColor.starAmber,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "neutral.1050",
                          lineHeight: 1.2,
                          letterSpacing: "-0.42px",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {rating.toFixed(1)}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "neutral.500",
                        lineHeight: 1.3,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {reviewCount > 0 ? `${reviewCount}+ ${t("Rev")}` : ""}
                    </Typography>
                  </Stack>
                  {/* Divider */}
                  <Box
                    sx={{
                      width: "1px",
                      alignSelf: "stretch",
                      backgroundColor: "customColor.tagBg",
                      flexShrink: 0,
                    }}
                  />
                </>
              );
            })()}

            {/* Avatar/item image group — Figma: overlapping circles 28x28 */}
            {(() => {
              const images = ad?.store?.top_items
                ?.map((i) => i.image_full_url)
                .slice(0, 3);
              const overflow = Math.max(
                0,
                (ad?.store?.top_items?.length || 0) - (images?.length || 0)
              );
              if (!ad?.store?.top_items?.length) return null;
              return (
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="4px"
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  <Stack direction="row" alignItems="center">
                    {images.map((src, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          border: "2px solid",
                          borderColor: "background.paper",
                          overflow: "hidden",
                          ml: i === 0 ? 0 : "-6px",
                          zIndex: images.length - i,
                          flexShrink: 0,
                          backgroundColor: "background.secondary",
                        }}
                      >
                        <NextImage
                          src={src}
                          alt=""
                          width="28"
                          height="28"
                          objectFit="cover"
                        />
                      </Box>
                    ))}
                  </Stack>
                  {overflow > 0 && (
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "neutral.500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      +{overflow}
                    </Typography>
                  )}
                </Stack>
              );
            })()}

            {/* Explore button */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              variant="contained"
              sx={{
                height: 36,
                px: "16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "-0.42px",
                textTransform: "none",
                flexShrink: 0,
                backgroundColor: "primary.main",
                "&:hover": { backgroundColor: "primary.dark" },
              }}
            >
              {t("Explore")}
            </Button>
          </Stack>
        </Box>
      </AdsCardRoot>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NORMAL VARIANT (default)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <CardRoot onClick={handleClick}>
      {/* Image */}
      {/* Image — all corners rounded (12px), overflow clips image */}
      <Box
        className="store-img"
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "350 / 175",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <NextImage
          src={imageUrl}
          alt={item?.name}
          width="300"
          height="150"
          objectFit="cover"
        />

        {/* Closed overlay */}
        <ClosedNow
          active={item?.active}
          open={item?.open}
          borderRadius="12px"
        />

        {/* Bottom gradient shadow — visible on parent hover */}
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

        {/* Bottom-left tags (New) */}
        {item?.is_new ? (
          <Box
            sx={{
              position: "absolute",
              bottom: 10,
              left: 10,
              display: "flex",
              gap: "4px",
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.customColor.newBadge,
                borderRadius: 9999,
                px: "8px",
                py: "2px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.95)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.42px",
                  whiteSpace: "nowrap",
                }}
              >
                {t("New")}
              </Typography>
            </Box>
          </Box>
        ) : null}

        {/* Bottom-right AD badge */}
        {item?.ad ? (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              zIndex: 2,
              backgroundColor: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(0,0,0,0.24)",
              borderRadius: 9999,
              px: "6px",
              py: "2px",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#f3f3f3",
                lineHeight: 1.2,
                letterSpacing: "-0.42px",
              }}
            >
              AD
            </Typography>
          </Box>
        ) : null}

        {/* Top-right wishlist */}
        <Box sx={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}>
          <IconButton
            onClick={toggleWishlist}
            sx={{
              width: 32,
              height: 32,
              padding: "8px",
              backgroundColor: "background.paper",
              borderRadius: "50%",
              "&:hover": { backgroundColor: "background.paper", opacity: 0.9 },
            }}
          >
            {isWishlisted ? (
              <i
                className="fi fi-sr-heart"
                style={{
                  fontSize: "14px",
                  lineHeight: 1,
                  display: "flex",
                  color: theme.palette.error.red,
                }}
              />
            ) : (
              <i
                className="fi fi-br-heart"
                style={{
                  fontSize: "14px",
                  lineHeight: 1,
                  display: "flex",
                  color: theme.palette.error.red,
                }}
              />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Info — Figma: pt:8 px:4 pb:0, gap:2px between rows */}
      <Box
        sx={{
          pt: "8px",
          px: "4px",
          pb: 0,
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {/* Row 1: Store name + Rating — pb:2px */}
        <Stack
          direction="row"
          alignItems="center"
          gap="16px"
          sx={{ pb: "2px" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap="4px"
            sx={{ flex: 1, minWidth: 0 }}
          >
            {item?.verified_seller ? (
              <Box sx={{ flexShrink: 0 }}>
                <VerifiedStoreBadge
                  verified={item?.verified_seller}
                  fontSize="14px"
                  sx={{ marginInlineStart: 0, alignSelf: "center" }}
                />
              </Box>
            ) : null}
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "customColor.textNeutral",
                lineHeight: 1.1,
                letterSpacing: "-0.48px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textTransform: "capitalize",
                flexShrink: 1,
                minWidth: 0,
              }}
            >
              {item?.name}
            </Typography>
          </Stack>
          {/* Rating */}
          {item?.avg_rating > 0 && (
            <Stack
              direction="row"
              alignItems="center"
              gap="2px"
              sx={{ flexShrink: 0 }}
            >
              <i
                className="fi fi-sr-star"
                style={{
                  fontSize: "13px",
                  lineHeight: 1,
                  display: "flex",
                  color: theme.palette.customColor.starAmber,
                }}
              />
              <Typography
                sx={{
                  fontSize: "14px",
                  lineHeight: 1.2,
                  letterSpacing: "-0.42px",
                  color: "neutral.1050",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Number(item.avg_rating).toFixed(1)}
              </Typography>
              {item?.rating_count > 0 && (
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "customColor.ratingCount",
                    lineHeight: 1.1,
                    letterSpacing: "-0.42px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  ({item.rating_count})
                </Typography>
              )}
            </Stack>
          )}
        </Stack>

        {/* Row 2: Categories */}
        {item?.category_names && item?.category_names?.length ? (
          <Typography
            sx={{
              fontSize: "12px",
              color: "neutral.500",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
              minWidth: 0,
              pb: "2px",
            }}
          >
            {Array.isArray(item.category_names)
              ? item.category_names.join(", ")
              : item.category_names}
          </Typography>
        ) : null}

        {/* Row 3: Delivery info */}
        <Stack direction="row" alignItems="center" gap="8px" sx={{ pb: "6px" }}>
          {item?.delivery_time && (
            <Stack direction="row" alignItems="center" gap="4px">
              <i
                className="fi fi-rr-clock"
                style={{
                  fontSize: "13px",
                  lineHeight: 1,
                  display: "flex",
                  color: theme.palette.customColor.deliveryText,
                }}
              />
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "customColor.deliveryText",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {item.delivery_time}
                {formatDistance(item?.distance)
                  ? ` (${formatDistance(item?.distance)})`
                  : ""}
              </Typography>
            </Stack>
          )}
          {item?.delivery_time && item?.minimum_delivery_fee != null && (
            <Box
              sx={{
                width: "1px",
                height: "10px",
                backgroundColor: "customColor.tagBg",
                flexShrink: 0,
              }}
            />
          )}
          {item?.minimum_delivery_fee != null && (
            <Stack direction="row" alignItems="center" gap="4px">
              <i
                className="fi fi-rs-biking-mountain"
                style={{
                  fontSize: "13px",
                  lineHeight: 1,
                  display: "flex",
                  color: theme.palette.customColor.deliveryText,
                }}
              />
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "customColor.deliveryText",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {item.minimum_delivery_fee === 0
                  ? t("Free")
                  : `$${item.minimum_delivery_fee}`}
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* Row 4: Discount badges */}
        <DiscountBadges item={item} theme={theme} t={t} />
      </Box>
    </CardRoot>
  );
};

export default NewStoreCard;
