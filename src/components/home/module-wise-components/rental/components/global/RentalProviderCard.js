import React, { useEffect } from "react";
import { Box, Stack } from "@mui/system";
import { alpha, IconButton, Typography, useTheme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import useIsVerifiedStoreEnabled from "api-manage/hooks/custom-hooks/useIsVerifiedStoreEnabled";
import NextImage from "components/NextImage";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useAddWishlist } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useAddWishlist";
import { useRemoveRentalWishList } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useRemoveWishlist";
import { useGetWishList } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useGetWishlist";
import {
  addWishListProvider,
  removeWishListProvider,
  setWishList,
} from "redux/slices/wishList";
import { getToken } from "helper-functions/getToken";
import { not_logged_in_message } from "utils/toasterMessages";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const RentalProviderCard = ({ data, onClick, onWishlistToggle }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const verifiedStoreEnabled = useIsVerifiedStoreEnabled();
  const { wishLists } = useSelector((state) => state?.wishList);

  const onWishListFetched = (response) => dispatch(setWishList(response));
  const { refetch } = useGetWishList(onWishListFetched);
  const token = getToken();

  useEffect(() => {
    if (token) refetch();
  }, [token]);

  const { mutate: addFavoriteMutation } = useAddWishlist();
  const { mutate: removeFavoriteMutation } = useRemoveRentalWishList();

  // The provider id might live on the card data itself or on a nested
  // `provider`. Resolve both so callers can pass either shape.
  const providerId = data?.id ?? data?.provider_id ?? data?.provider?.id;
  const providerEntity = data?.provider ?? data;

  const isWishlisted = !!wishLists?.providers?.find(
    (wishItem) => wishItem.id === providerId
  );

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!getToken()) {
      toast.error(t(not_logged_in_message));
      return;
    }
    if (!providerId) return;
    if (isWishlisted) {
      removeFavoriteMutation(
        { key: "provider_id", id: providerId },
        {
          onSuccess: (res) => {
            dispatch(removeWishListProvider(providerId));
            toast.success(res?.message, { id: "wishlist_removeWishlist" });
            onWishlistToggle?.(data, false);
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message);
          },
        }
      );
    } else {
      addFavoriteMutation(
        { key: "provider_id", id: providerId },
        {
          onSuccess: (res) => {
            if (res) {
              dispatch(addWishListProvider(providerEntity));
              toast.success(res?.message);
              onWishlistToggle?.(data, true);
            }
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message);
          },
        }
      );
    }
  };

  const providerName = data?.name || "";
  const coverUrl =
    data?.cover_full_url ||
    data?.cover_photo_full_url ||
    data?.image_full_url ||
    data?.logo_full_url ||
    "";
  const rating = data?.avg_rating ?? data?.rating ?? 0;
  const reviewCount =
    data?.total_reviews ??
    data?.review_count ??
    data?.reviews_count ??
    data?.rating_count ??
    0;
  const verified =
    (data?.verified ?? data?.verified_seller ?? true) && verifiedStoreEnabled;
  // Prefer the human address (from the stores/verified API) when present;
  // fall back to the comma-separated tags / module name used by the demo
  // shape so neither flow regresses.
  const subtitleText =
    data?.address ||
    data?.vehicle_types ||
    data?.tags ||
    data?.module?.module_name ||
    "";
  const responseTime =
    data?.response_time || data?.delivery_time || "20-30 min";
  const totalVehicles =
    data?.total_vehicles ?? data?.vehicle_count ?? data?.total_items;
  const minPrice = Number(data?.min_price ?? data?.min) || 0;
  const maxPrice = Number(data?.max_price ?? data?.max) || 0;
  const isAd =
    data?.is_ad ?? data?.sponsored ?? Number(data?.ad) === 1 ?? false;
  const discount = Number(data?.discount_percent ?? data?.discount ?? 0) || 0;

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        width: "100%",
        cursor: "pointer",
        borderRadius: "16px",
        overflow: "hidden",
        //backgroundColor: theme.palette.background.paper,
        border: "none",
        display: "flex",
        flexDirection: "column",

        transition: "box-shadow 0.3s ease",
        "&:hover": {},
        "& .provider-card-img img": {
          position: "absolute !important",
          inset: "0 !important",
          width: "100% !important",
          height: "100% !important",
          objectFit: "cover !important",
          borderRadius: "12px",
          transition: "transform 0.4s ease",
        },
        "&:hover .provider-card-img img": {
          transform: "scale(1.05)",
        },
      }}
    >
      <Box
        className="provider-card-img"
        sx={{
          position: "relative",
          width: "calc(100% - 16px)",
          height: "180px",
          margin: "8px 8px 0",
          backgroundColor: theme.palette.background.secondary,
          overflow: "hidden",
          borderRadius: "12px",
        }}
      >
        <NextImage
          src={coverUrl}
          alt={providerName}
          width="380"
          height="180"
          objectFit="cover"
        />

        <IconButton
          onClick={handleWishlist}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            padding: 0,
            backgroundColor: "#FFFFFF",
            zIndex: 3,
            "&:hover": {
              backgroundColor: "#FFFFFF",
            },
          }}
        >
          <i
            className={isWishlisted ? "fi fi-sr-heart" : "fi fi-br-heart"}
            style={{
              fontSize: "14px",
              lineHeight: 1,
              display: "flex",
              color: "#E53935",
            }}
          />
        </IconButton>

        {isAd && (
          <Box
            sx={{
              position: "absolute",
              right: 10,
              bottom: 10,
              backgroundColor: alpha("#000000", 0.55),
              color: "#FFFFFF",
              fontSize: "11px",
              fontWeight: 600,
              px: "10px",
              py: "3px",
              borderRadius: "999px",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: "0.3px",
              zIndex: 2,
            }}
          >
            {t("AD")}
          </Box>
        )}
      </Box>

      <Stack
        sx={{
          flexDirection: "column",
          gap: "6px",
          padding: "12px 6px 14px",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap="8px"
        >
          <Stack
            direction="row"
            alignItems="center"
            gap="6px"
            sx={{ flex: 1, minWidth: 0 }}
          >
            {verified && (
              <VerifiedIcon
                sx={{
                  fontSize: "16px",
                  color: theme.palette.primary.main,
                  flexShrink: 0,
                }}
              />
            )}
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 700,
                color: theme.palette.text.primary,
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {providerName}
            </Typography>
          </Stack>
          {rating > 0 && (
            <Stack
              direction="row"
              alignItems="center"
              gap="3px"
              sx={{ flexShrink: 0 }}
            >
              <StarIcon sx={{ fontSize: "14px", color: "#F5B027" }} />
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  lineHeight: 1.2,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {Number(rating).toFixed(1)}
              </Typography>
              {reviewCount > 0 && (
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: theme.palette.neutral[500],
                    lineHeight: 1.2,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  ({reviewCount})
                </Typography>
              )}
            </Stack>
          )}
        </Stack>

        {subtitleText && (
          <Typography
            sx={{
              fontSize: "13px",
              color: theme.palette.neutral[500],
              lineHeight: 1.3,
              fontFamily: "'DM Sans', sans-serif",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {subtitleText}
          </Typography>
        )}

        <Stack
          direction="row"
          alignItems="center"
          gap="12px"
          sx={{ mt: "2px" }}
        >
          <Stack direction="row" alignItems="center" gap="4px">
            <AccessTimeIcon
              sx={{
                fontSize: "14px",
                color: theme.palette.neutral[500],
              }}
            />
            <Typography
              sx={{
                fontSize: "13px",
                color: theme.palette.neutral[500],
                lineHeight: 1.2,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {t("In")} {responseTime}
            </Typography>
          </Stack>
          {totalVehicles > 0 && (
            <Stack direction="row" alignItems="center" gap="4px">
              <DirectionsCarFilledIcon
                sx={{
                  fontSize: "14px",
                  color: theme.palette.neutral[500],
                }}
              />
              <Typography
                sx={{
                  fontSize: "13px",
                  color: theme.palette.neutral[500],
                  lineHeight: 1.2,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {totalVehicles}
              </Typography>
            </Stack>
          )}
          {(minPrice > 0 || maxPrice > 0) && (
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: theme.palette.primary.main,
                lineHeight: 1.2,
                fontFamily: "'DM Sans', sans-serif",
                ml: "auto",
              }}
            >
              {maxPrice > 0 && minPrice > 0 && maxPrice !== minPrice
                ? `${getAmountWithSign(minPrice)} - ${getAmountWithSign(
                    maxPrice
                  )}`
                : getAmountWithSign(maxPrice || minPrice)}
            </Typography>
          )}
        </Stack>

        {discount > 0 && (
          <Box
            sx={{
              alignSelf: "flex-start",
              backgroundColor: alpha("#E53935", 0.12),
              color: "#E53935",
              fontSize: "11px",
              fontWeight: 700,
              px: "8px",
              py: "3px",
              borderRadius: "20px",
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.2,
              mt: "4px",
            }}
          >
            -{discount}%
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default RentalProviderCard;
