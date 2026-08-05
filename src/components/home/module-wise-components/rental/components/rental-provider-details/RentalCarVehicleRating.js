import { alpha, Box, Grid, IconButton, Typography } from "@mui/material";
import CustomImageContainer from "components/CustomImageContainer";
import H3 from "components/typographies/H3";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StarIcon from "@mui/icons-material/Star";
import { t } from "i18next";
import { Stack } from "@mui/system";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { IconButtonStyled, PrimaryToolTip } from "components/cards/QuickView";
import React, { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import {
  addWishListProvider,
  removeWishListProvider,
  setWishList,
} from "redux/slices/wishList";
import { toast } from "react-hot-toast";
import { not_logged_in_message } from "utils/toasterMessages";
import { getToken } from "helper-functions/getToken";
import { useAddWishlist } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useAddWishlist";
import { useRemoveRentalWishList } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useRemoveWishlist";
import { useDispatch, useSelector } from "react-redux";
import { useGetWishList } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useGetWishlist";
import CustomModal from "components/modal";
import RestaurantReviewModal from "components/store-details/ReviewModal";
import RentalCarReviewModal from "../global/RentalReviewModal";
import CloseIcon from "components/icons/CloseIcon";
import ClosedNowScheduleWise from "components/closed-now/ClosedNowScheduleWise";
import {ImageWrapper} from "components/cards/VerticalCard";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";
const RentalCarVehicleRating = ({ data, configData }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { wishLists } = useSelector((state) => state?.wishList);
  const [open, setOpen] = useState(false);
  const onSuccessHandler = (response) => {
    dispatch(setWishList(response));
  };
  const { refetch } = useGetWishList(onSuccessHandler);
  const token = getToken();
  const refetchWishlist = async () => {
    await refetch();
  };
  useEffect(() => {
    if (token) {
      refetchWishlist();
    }
  }, [token]);
  const { mutate: addFavoriteMutation } = useAddWishlist();
  const { mutate: removeFavoriteMutation } = useRemoveRentalWishList();
  const checkIsWishListed = () => {
    return wishLists?.providers?.find(
      (wishItem) => wishItem.id === data?.id
    );
  };
  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    if (getToken()) {
      addFavoriteMutation(
        { key: "provider_id", id: data?.id },
        {
          onSuccess: (response) => {
            if (response) {
              dispatch(addWishListProvider(data));
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
      dispatch(removeWishListProvider(data?.id));
      toast.success(res.message, {
        id: "wishlist_removeWishlist",
      });
    };
    removeFavoriteMutation(
      { key: "provider_id", id: data?.id },
      {
        onSuccess: onSuccessHandlerForDelete,
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      }
    );
  };
  const {
    logo_full_url,
    address,
    name,
    avg_rating,
    rating_count,
    total_vehicle_count,
    brand_count,delivery_time

  } = data;
  return (
    <>
      <CustomBoxFullWidth
        sx={{
          backgroundColor: (theme) => theme.palette.primary.main,
          borderRadius: "10px",
        }}
      >
        <CustomBoxFullWidth
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: "10px", sm: "20px" },
            py: { xs: "10px", sm: "20px" },
            gap: { xs: "10px", sm: "20px" },
            backgroundColor: (theme) => theme.palette.neutral[90],
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              gap: { xs: "10px", sm: "20px" },

            }}
          >

            <Box sx={{ position: "relative", display: "inline-block",height:"100px" }}>
              <CustomImageContainer
                width={{ xs: "80px", sm: "100px" }}
                height={{ xs: "80px", sm: "100px" }}
                borderRadius="50%"
                src={logo_full_url}
              />

              {data?.active !== undefined && (
                <ClosedNowScheduleWise
                  active={data?.active}
                  schedules={data?.schedules}
                  borderRadius="49%"
                />
              )}
            </Box>


            <Box>
            </Box>
            <Box>
              <Stack direction="row" alignItems="center" spacing={0.6} sx={{ mt: "10px" }}>
                <H3
                  text={name}
                  sx={{
                    fontWeight: "700",
                    textTransform: "capitalize",
                    color: (theme) => theme.palette.neutral[100],
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                />
                <VerifiedStoreBadge
                  verified={data?.verified_seller}
                  color="#0b17f3f1"
                  fontSize="20px"
                />
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "400",
                  fontSize: "14px",
                  lineHeight: "1.2",
                  color: (theme) =>
                    theme.palette.neutral[100],
                  mt: {xs:"5px",md:"10px"},
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
              >
                {address}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "400",
                  fontSize: "14px",
                  mt: {xs:"5px",md:"10px"},
                  lineHeight: "1.2",
                  color: (theme) =>
                    theme.palette.neutral[100],

                }}
              >
                Approx. Pickup Time : {delivery_time}
              </Typography>
            </Box>
          </Box>
          <>
            {checkIsWishListed() ? (
              <PrimaryToolTip text="Remove from wishlist">
                <IconButtonStyled
                  color="#EF7822"
                  bgColor={theme.palette.background.paper}
                  onClick={(e) =>
                    removeFromWishlistHandler(e)
                  }
                >
                  <FavoriteIcon />
                </IconButtonStyled>
              </PrimaryToolTip>
            ) : (
              <PrimaryToolTip text="Add to wishlist">
                <IconButtonStyled
                  onClick={(e) => addToWishlistHandler(e)}
                >
                  <FavoriteBorderIcon />
                </IconButtonStyled>
              </PrimaryToolTip>
            )}
          </>
        </CustomBoxFullWidth>
        <VehicleAndRatingSection
          avg_rating={avg_rating}
          rating_count={rating_count}
          total_vehicle_count={total_vehicle_count}
          brand_count={brand_count}
          configData={configData}
          open={open}
          setOpen={setOpen}
          data={data}
        />
      </CustomBoxFullWidth>
    </>
  );
};
export default RentalCarVehicleRating;
const VehicleAndRatingSection = ({
  avg_rating,
  rating_count,
  total_vehicle_count,
  brand_count,
  configData,
  open,
  setOpen,
  data,
}) => {

	
  return (
    <>
      <CustomBoxFullWidth
        sx={{ display: "flex", justifyContent: "center", py: "25px" }}
      >
        <Grid container spacing={{
          xs:0,
          md:2
        }}>
          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingInline: "8px",
                color: (theme) => theme.palette.neutral[100],
              }}
            >
              <DirectionsCarIcon />
              <Typography
                sx={{ fontSize: "20px", fontWeight: "600" }}
              >
                {t("Vehicle")}{" "}
              </Typography>
              <Stack
                direction="row"
                justifyContent="center"
                flexWrap="wrap"
                spacing={0.5}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    color: (theme) =>
                      theme.palette.neutral[100],
                  }}
                >
                  {t("Vehicle")} <b>{total_vehicle_count}</b>,
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    color: (theme) =>
                      theme.palette.neutral[100],
                  }}
                >
                  {t("Brand")} <b>{brand_count}</b>
                </Typography>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              onClick={() => {
                setOpen(true);
              }}
              sx={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingInline: "8px",
                borderLeft: (theme) =>
                  `1px solid ${alpha(
                    theme.palette.neutral[100],
                    0.4
                  )}`,
                color: (theme) => theme.palette.neutral[100],
              }}
            >
              <StarIcon
                sx={{
                  color: (theme) =>
                    theme.palette.neutral[100],
                }}
              />
              <Typography
                sx={{ fontSize: "20px", fontWeight: "600" }}
              >
                {t("Rating")}{" "}
              </Typography>
              <Stack
                direction="row"
                justifyContent="center"
                flexWrap="wrap"
                spacing={0.5}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    color: (theme) =>
                      theme.palette.neutral[100],
                  }}
                >
                  {t("Rating")} <b>{avg_rating?.toFixed(1)}</b>,
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    color: (theme) =>
                      theme.palette.neutral[100],
                  }}
                >
                  {t("Review")} <b>{rating_count}</b>
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CustomBoxFullWidth>
      <CustomModal openModal={open} handleClose={() => setOpen(false)}>
      <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <CloseIcon sx={{ fontSize: "16px" }} />
        </IconButton>
        <RentalCarReviewModal
          product_avg_rating={avg_rating}
          reviews_comments_count={data?.reviews_comments_count}
          rating_count={rating_count}
          id={data?.id}
          restaurantDetails={data}
          configData={configData}
        />
      </CustomModal>
    </>
  );
};