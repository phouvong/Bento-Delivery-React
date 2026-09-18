import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import CustomImageContainer from "components/CustomImageContainer";
import React, { useEffect, useState } from "react";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { useDispatch, useSelector } from "react-redux";
import { useAddWishlist } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useAddWishlist";
import { useRemoveRentalWishList } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useRemoveWishlist";
import { getToken } from "helper-functions/getToken";
import {
  addWishListProvider,
  removeWishListProvider,
  setWishList,
} from "redux/slices/wishList";
import { toast } from "react-hot-toast";
import { t } from "i18next";
import { not_logged_in_message } from "utils/toasterMessages";
import { useGetWishList } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useGetWishlist";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";
import { Stack } from "@mui/system";

const VendorProfile = ({ vehicleDetails }) => {
  const dispatch = useDispatch();
  const { wishLists } = useSelector((state) => state?.wishList);

  const onSuccessHandler = (response) => {
    dispatch(setWishList(response));
  };
  const { refetch } = useGetWishList(onSuccessHandler);
  const token = getToken();

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token]);

  const { mutate: addFavoriteMutation } = useAddWishlist();
  const { mutate: removeFavoriteMutation } = useRemoveRentalWishList();

  const checkIsWishListed = () => {
    return wishLists?.providers?.find(
      (wishItem) => wishItem.id === vehicleDetails?.provider_id
    );
  };

  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    if (getToken()) {
      addFavoriteMutation(
        { key: "provider_id", id: vehicleDetails?.provider_id },
        {
          onSuccess: (response) => {
            if (response) {
              dispatch(addWishListProvider(vehicleDetails?.provider));
              toast.success(response?.message);
            }
          },
          onError: (error) => {
            toast.error(error.response.data.message);
          },
        }
      );
    } else toast.error(t(not_logged_in_message));
  };

  const removeFromWishlistHandler = (e) => {
    e.stopPropagation();
    const onSuccessHandlerForDelete = (res) => {
      dispatch(removeWishListProvider(vehicleDetails?.provider_id));
      toast.success(res.message, {
        id: "wishlist_removeWishlist",
      });
    };
    removeFavoriteMutation(
      { key: "provider_id", id: vehicleDetails?.provider_id },
      {
        onSuccess: onSuccessHandlerForDelete,
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      }
    );
  };

  return (
    <>
      <CustomBoxFullWidth
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          background: "",
          flexWrap: { xs: "wrap", md: "nowrap" },
          gap: "20px",
          backgroundColor: (theme) => theme.palette.neutral[90],
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            gap: "20px",
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          <Box>
            <CustomImageContainer
              src={vehicleDetails?.provider?.logo_full_url}
              width={"60px"}
              height={"60px"}
              borderRadius={"50%"}
            />
          </Box>
          <Box sx={{ maxWidth: "150px" }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: "500",
                  textTransform: "capitalize",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {vehicleDetails?.provider?.name}
              </Typography>
              <VerifiedStoreBadge
                verified={
                  vehicleDetails?.provider?.verified_seller ??
                  vehicleDetails?.verified_seller
                }
                fontSize="14px"
              />
            </Stack>

            <Typography
              sx={{
                fontWeight: "400",
                fontSize: "11px",
                mt: "6px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {vehicleDetails?.provider?.address}
            </Typography>
          </Box>
        </Box>
        <Tooltip
          title={
            checkIsWishListed()
              ? t("Remove from wishlist")
              : t("Add to wishlist")
          }
          arrow
        >
          <IconButton
            onClick={(e) =>
              checkIsWishListed()
                ? removeFromWishlistHandler(e)
                : addToWishlistHandler(e)
            }
            sx={{
              width: 32,
              height: 32,
              padding: 0,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)",
              "&:hover": { backgroundColor: "#FFFFFF" },
            }}
          >
            <i
              className={
                checkIsWishListed() ? "fi fi-sr-heart" : "fi fi-br-heart"
              }
              style={{
                fontSize: "14px",
                lineHeight: 1,
                display: "flex",
                color: "#E53935",
              }}
            />
          </IconButton>
        </Tooltip>
      </CustomBoxFullWidth>
    </>
  );
};

export default VendorProfile;
