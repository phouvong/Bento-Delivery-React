import { useTheme } from "@emotion/react";
import {
  alpha,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import { useAddStoreToWishlist } from "api-manage/hooks/react-query/wish-list/useAddStoreToWishLists";
import { useWishListStoreDelete } from "api-manage/hooks/react-query/wish-list/useWishListStoreDelete";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getStoreRedirectURL } from "helper-functions/handleStoreRedirect";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { addWishListStore, removeWishListStore } from "redux/slices/wishList";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { not_logged_in_message } from "utils/toasterMessages";
import CustomImageContainer from "../CustomImageContainer";
import VerifiedStoreBadge from "../cards/VerifiedStoreBadge";

const CustomWrapper = styled(Paper)(({ theme }) => ({
  padding: "16px",
  borderRadius: "16px",
  background: theme.palette.background.paper,
  //border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
}));

const StatCard = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  flex: 1,
  minWidth: 0,
}));

const StatDivider = styled("div")(({ theme }) => ({
  width: "1px",
  alignSelf: "stretch",
  backgroundColor: theme.palette.divider,
}));

const StoreDetails = ({ storeDetails }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const dispatchRedux = useDispatch();
  const { wishLists } = useSelector((state) => state.wishList);
  const { mutate } = useWishListStoreDelete();
  const { mutate: addFavoriteMutation } = useAddStoreToWishlist();
  const wishlistPending = useRef(false);

  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  const onSuccessHandlerForDelete = (res) => {
    dispatchRedux(removeWishListStore(storeDetails?.id));
    toast.success(res.message, { id: "wishlist" });
  };

  const addToFavorite = () => {
    if (wishlistPending.current) return;
    if (token) {
      wishlistPending.current = true;
      addFavoriteMutation(storeDetails?.id, {
        onSuccess: (response) => {
          if (response) {
            dispatchRedux(addWishListStore(storeDetails));
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

  const isInWishList = () => {
    return !!wishLists?.store?.find(
      (wishStore) => wishStore.id === storeDetails?.id
    );
  };

  const deleteWishlistStore = (id) => {
    if (wishlistPending.current) return;
    wishlistPending.current = true;
    mutate(id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
      onSettled: () => {
        wishlistPending.current = false;
      },
    });
  };

  const handleVisitStore = () => {
    router.push(getStoreRedirectURL(storeDetails));
  };

  const deliveryTime = storeDetails?.delivery_time?.split(" ");
  const itemsCount =
    storeDetails?.total_items > 0 ? storeDetails?.total_items - 1 : 0;
  const liked = isInWishList();

  // Only stats with a real value are shown — each StatCard is `flex: 1`, so
  // dropping one lets the rest stretch to fill the row instead of leaving a
  // gap where a 0%/blank stat used to sit.
  const statItems = [
    Number(storeDetails?.positive_rating) > 0 && {
      key: "positive",
      value: `${storeDetails?.positive_rating?.toFixed(0)}%`,
      label: t("Positive Reviews"),
    },
    (deliveryTime?.[0] || deliveryTime?.[1]) && {
      key: "delivery",
      value: `${deliveryTime?.[0] ?? ""} ${deliveryTime?.[1] ?? ""}`.trim(),
      label: t("Delivery Time"),
    },
    storeDetails?.minimum_order != null && {
      key: "minOrder",
      value: getAmountWithSign(storeDetails?.minimum_order),
      label: t("Min Order"),
    },
  ].filter(Boolean);

  // Figma's `--sds-color-text-default-default` (#1e1e1e light / #e0e0e0 dark)
  // is `theme.palette.neutral[1050]`, not `theme.palette.text.primary` —
  // this app's `text.primary` is a brand-tinted dark green (#3E594D), a
  // different color entirely.
  const defaultTextColor =
    theme.palette.neutral?.[1050] ?? theme.palette.text.primary;

  const headerIconSx = {
    width: 28,
    height: 28,
    borderRadius: "50%",
    color: defaultTextColor,
    backgroundColor: theme.palette.background.default,
    "&:hover": {
      backgroundColor: alpha(defaultTextColor, 0.06),
    },
  };

  return (
    <CustomWrapper>
      <Stack spacing={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "18px", md: "24px" },
              lineHeight: 1.1,
              letterSpacing: { md: "-1.2px" },
              color: defaultTextColor,
            }}
          >
            {t("Store")}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip
              title={liked ? t("Remove from wishlist") : t("Add to wishlist")}
            >
              <IconButton
                onClick={() =>
                  liked
                    ? deleteWishlistStore(storeDetails?.id)
                    : addToFavorite()
                }
                sx={headerIconSx}
              >
                <i
                  className={liked ? "fi fi-sr-heart" : "fi fi-rr-heart"}
                  style={{
                    fontSize: "14px",
                    display: "flex",
                    lineHeight: 1,
                    color: liked
                      ? theme.palette.error.main
                      : defaultTextColor,
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("Visit store")}>
              <IconButton onClick={handleVisitStore} sx={headerIconSx}>
                <i
                  className="fi fi-rr-arrow-up-right-from-square"
                  style={{
                    fontSize: "13px",
                    display: "flex",
                    lineHeight: 1,
                    color: defaultTextColor,
                  }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <CustomStackFullWidth
            sx={{
              position: "relative",
              height: 48,
              width: 48,
              flexShrink: 0,
              borderRadius: "8px",
              border: `1px solid ${theme.palette.divider}`,
              overflow: "hidden",
            }}
          >
            <CustomImageContainer
              src={storeDetails?.logo_full_url}
              height="100%"
              width="100%"
              obejctfit="cover"
              borderRadius="8px"
            />
          </CustomStackFullWidth>
          <Stack spacing={0.5} minWidth={0} flex={1}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: "15px", md: "18px" },
                  lineHeight: 1.2,
                  letterSpacing: { md: "-0.54px" },
                  color: defaultTextColor,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {storeDetails?.name}
              </Typography>
              <VerifiedStoreBadge
                verified={storeDetails?.verified_seller}
                fontSize="14px"
              />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              {Number(storeDetails?.rating_count) > 0 && (
                <>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <i
                      className="fi fi-sr-star"
                      style={{
                        color: theme.palette.warning.main,
                        fontSize: "12px",
                        display: "flex",
                        lineHeight: 1,
                      }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "13px", md: "16px" },
                        lineHeight: 1.2,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {storeDetails?.avg_rating?.toFixed?.(1) ??
                        storeDetails?.avg_rating}
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      width: "2px",
                      height: "14px",
                      backgroundColor: theme.palette.background.default,
                    }}
                  />
                </>
              )}
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: { xs: "13px", md: "16px" },
                  lineHeight: 1.2,
                  color: theme.palette.text.secondary,
                }}
              >
                {itemsCount} {t("Items")}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {statItems.length > 0 && (
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: "8px",
              px: 1,
              py: 1.5,
            }}
          >
            {statItems.map((item, index) => (
              <React.Fragment key={item.key}>
                {index > 0 && <StatDivider />}
                <StatCard>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "14px", md: "16px" },
                      color: defaultTextColor,
                      lineHeight: 1.1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "10px", md: "12px" },
                      color: theme.palette.text.secondary,
                      mt: 0.5,
                    }}
                  >
                    {item.label}
                  </Typography>
                </StatCard>
              </React.Fragment>
            ))}
          </Stack>
        )}
      </Stack>
    </CustomWrapper>
  );
};

StoreDetails.propTypes = {};

export default React.memo(StoreDetails);
