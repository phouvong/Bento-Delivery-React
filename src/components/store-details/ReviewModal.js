import {
  Grid,
  IconButton,
  Typography,
  alpha,
  useTheme,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

import { Box, Stack } from "@mui/system";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import useGetStoreReviews from "api-manage/hooks/react-query/review/useGetStoreReviews";
import {
  getDateFormat,
  getNumberWithConvertedDecimalPoint,
} from "utils/CustomFunctions";
import CustomRatings from "components/search/CustomRatings";

import CustomImageContainer from "components/CustomImageContainer";
import DotSpin from "components/DotSpin";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { ReadMore } from "components/store-details/ReadMore";
import { getModuleId } from "helper-functions/getModuleId";
import { handleProductRedirect } from "helper-functions/handleProductRedirect";

import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import FoodDetailModal from "components/food-details/foodDetail-modal/FoodDetailModal";
import ModuleModal from "components/cards/ModuleModal";
import { useRouter } from "next/router";
import { addWishList, removeWishListItem } from "redux/slices/wishList";
import toast from "react-hot-toast";
import { not_logged_in_message } from "utils/toasterMessages";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
  },
}));
export const StyledSimpleBar = styled(SimpleBar)(({ theme }) => ({
  maxHeight: "60vh",
  "& .simplebar-track.simplebar-vertical": {
    right: "-20px !important",
  },
}));
const RestaurantReviewModal = ({
  product_avg_rating,
  rating_count,
  reviews_comments_count,
  id,
  restaurantDetails,
  configData,
  handleClose,
  variant,
}) => {
  const isDrawer = variant === "drawer";
  const [review_count, setReview_Count] = useState({});
  const theme = useTheme();
  const router = useRouter();
  const reduxDispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [productData, setProductData] = useState({});
  const { wishLists } = useSelector((state) => state.wishList);
  const { data, refetch, isLoading } = useGetStoreReviews(id);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { mutate: addFavoriteMutation } = useAddToWishlist();
  const { mutate } = useWishListDelete();
  console.log({ productData });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    wishlistItemExistHandler();
  }, [wishLists]);
  const wishlistItemExistHandler = () => {
    if (wishLists?.item?.find((wishItem) => wishItem.id === productData?.id)) {
      setIsWishlisted(true);
    } else {
      setIsWishlisted(false);
    }
  };
  const getPercentOfNumber = (percentRate) => {
    const total = restaurantDetails?.ratings.reduce(
      (sum, current) => sum + current,
      0
    );
    return percentRate ? ((percentRate / total) * 100).toFixed(1) : 0;
  };
  const handleClick = (itemReview) => {
    console.log({ itemReview });

    setProductData(itemReview);

    if (itemReview?.item?.module_type === "ecommerce") {
      handleProductRedirect(itemReview?.item, router);
    } else {
      setOpenModal(true);
    }
  };
  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    let token = undefined;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    if (token) {
      addFavoriteMutation(item?.id, {
        onSuccess: (response) => {
          if (response) {
            reduxDispatch(addWishList(item));
            setIsWishlisted(true);
            toast.success(response?.message);
          }
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error(t(not_logged_in_message));
  };
  const removeFromWishlistHandler = (e) => {
    e.stopPropagation();
    const onSuccessHandlerForDelete = (res) => {
      reduxDispatch(removeWishListItem(item?.id));
      setIsWishlisted(false);
      toast.success(res.message, {
        id: "wishlist",
      });
    };
    mutate(item?.id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        width: isDrawer ? "100%" : { xs: "350px", sm: "450px", md: "750px" },
        height: isDrawer ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
        borderRadius: isDrawer ? 0 : undefined,
        p: isDrawer ? 0 : "15px",
      }}
    >
      {isDrawer && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            px: 2,
            py: 1.5,
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            fontSize="16px"
            fontWeight={700}
            color={theme.palette.text.primary}
          >
            {t("Ratings & Reviews")}
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            aria-label={t("Close")}
            sx={{ color: theme.palette.text.primary }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      )}
      <CustomStackFullWidth
        sx={{
          flex: 1,
          minHeight: 0,
          padding: isDrawer
            ? "0.75rem"
            : {
                xs: ".5rem",
                sm: "1rem",
                md: "1.2rem",
              },
        }}
      >
        <StyledSimpleBar
          style={isDrawer ? { maxHeight: "calc(100vh - 64px)" } : undefined}
        >
          <CustomStackFullWidth
            backgroundColor={alpha(theme.palette.neutral[400], 0.1)}
            padding={isDrawer ? "0.5rem 1.25rem 1.25rem" : "2rem"}
            borderRadius="8px"
            color={theme.palette.text.primary}
            // margin=".5rem"
          >
            <Grid container gap={{ xs: 2, md: isDrawer ? 2 : 0 }}>
              <Grid item xs={12} sm={12} md={isDrawer ? 12 : 6}>
                <Stack>
                  <Typography
                    component="span"
                    fontSize="50px"
                    color={theme.palette.primary.main}
                    fontWeight="500"
                  >
                    {getNumberWithConvertedDecimalPoint(product_avg_rating, 1)}
                    <Typography
                      component="span"
                      fontSize="35px"
                      color={theme.palette.primary.deep}
                      fontWeight="500"
                    >
                      /5
                    </Typography>
                  </Typography>
                  <CustomRatings readOnly ratingValue={product_avg_rating} />
                  <Stack direction="row" spacing={1} marginTop=".8rem">
                    <Typography
                      fontSize="13px"
                      color={theme.palette.neutral[600]}
                      backgroundColor={alpha(theme.palette.neutral[500], 0.2)}
                      padding="2px 6px"
                      borderRadius="4px"
                    >
                      {rating_count} {t("Ratings")}
                    </Typography>
                    <Typography
                      fontSize="13px"
                      color={theme.palette.neutral[600]}
                      backgroundColor={alpha(theme.palette.neutral[500], 0.2)}
                      padding="2px 6px"
                      borderRadius="4px"
                    >
                      {reviews_comments_count} {t("Reviews")}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={12} md={isDrawer ? 12 : 6}>
                <Stack gap={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontSize="14px">5</Typography>
                    <Box flexGrow={1}>
                      <BorderLinearProgress
                        variant="determinate"
                        value={getPercentOfNumber(
                          restaurantDetails?.ratings[0]
                        )}
                      />
                    </Box>
                    <Typography
                      fontSize="14px"
                      color={theme.palette.neutral[600]}
                    >
                      {getPercentOfNumber(restaurantDetails?.ratings[0])}%
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontSize="14px">4</Typography>
                    <Box flexGrow={1}>
                      <BorderLinearProgress
                        variant="determinate"
                        value={getPercentOfNumber(
                          restaurantDetails?.ratings[1]
                        )}
                      />
                    </Box>
                    <Typography
                      fontSize="14px"
                      color={theme.palette.neutral[600]}
                    >
                      {getPercentOfNumber(restaurantDetails?.ratings[1])}%
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontSize="14px">3</Typography>
                    <Box flexGrow={1}>
                      <BorderLinearProgress
                        variant="determinate"
                        value={getPercentOfNumber(
                          restaurantDetails?.ratings[2]
                        )}
                      />
                    </Box>
                    <Typography
                      fontSize="14px"
                      color={theme.palette.neutral[600]}
                    >
                      {getPercentOfNumber(restaurantDetails?.ratings[2])}%
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontSize="14px">2</Typography>
                    <Box flexGrow={1}>
                      <BorderLinearProgress
                        variant="determinate"
                        value={getPercentOfNumber(
                          restaurantDetails?.ratings[3]
                        )}
                      />
                    </Box>
                    <Typography
                      fontSize="14px"
                      color={theme.palette.neutral[600]}
                    >
                      {getPercentOfNumber(restaurantDetails?.ratings[3])}%
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontSize="14px">1</Typography>
                    <Box flexGrow={1}>
                      <BorderLinearProgress
                        variant="determinate"
                        value={getPercentOfNumber(
                          restaurantDetails?.ratings[4]
                        )}
                      />
                    </Box>
                    <Typography
                      fontSize="14px"
                      color={theme.palette.neutral[600]}
                    >
                      {getPercentOfNumber(restaurantDetails?.ratings[4])}%
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CustomStackFullWidth>

          {data &&
            data?.map((review) =>
              isDrawer ? (
                <Stack
                  key={review?.id}
                  spacing={1.25}
                  sx={{
                    mt: 1.5,
                    p: 1.5,
                    borderRadius: "12px",
                    border: `1px solid ${theme.palette.neutral[300]}`,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ minWidth: 0 }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.12
                          ),
                          color: theme.palette.primary.main,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "13px",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {review?.customer_name?.[0]?.toUpperCase() || "U"}
                      </Box>
                      <Stack sx={{ minWidth: 0 }}>
                        <Typography
                          fontSize="13px"
                          fontWeight={600}
                          color={theme.palette.text.primary}
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {review?.customer_name}
                        </Typography>
                        <Typography fontSize="11px" color="text.secondary">
                          {getDateFormat(review.created_at)}
                        </Typography>
                      </Stack>
                    </Stack>
                    <CustomRatings
                      readOnly
                      ratingValue={review.rating}
                      fontSize={"1rem"}
                    />
                  </Stack>

                  <Stack direction="row" alignItems="flex-start" spacing={1.25}>
                    {review?.comment && (
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <ReadMore
                          color={theme.palette.neutral[700]}
                          limits="160"
                        >
                          {review?.comment}
                        </ReadMore>
                      </Box>
                    )}

                    <Stack
                      spacing={0.5}
                      alignItems="center"
                      onClick={() => handleClick(review?.item)}
                      sx={{
                        cursor: "pointer",
                        width: 84,
                        flexShrink: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: 84,
                          height: 84,
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: `0.8px solid ${theme.palette.neutral[300]}`,
                          p: "4px",
                        }}
                      >
                        <CustomImageContainer
                          src={review.item_image_full_url}
                          objectFit="cover"
                          height="74px"
                          borderRadius="6px"
                        />
                      </Box>
                      <Typography
                        textAlign="center"
                        color={theme.palette.neutral[600]}
                        fontSize="10px"
                        fontWeight={400}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "100%",
                        }}
                      >
                        {review.item_name}
                      </Typography>
                    </Stack>
                  </Stack>

                  {review.reply ? (
                    <Box
                      sx={{
                        background: alpha(theme.palette.neutral[400], 0.12),
                        padding: "10px 12px",
                        borderRadius: "8px",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          fontSize="12px"
                          fontWeight={600}
                          color={theme.palette.text.primary}
                        >
                          {restaurantDetails?.name}
                        </Typography>
                        <Typography fontSize="10px" color="text.secondary">
                          {getDateFormat(review.updated_at)}
                        </Typography>
                      </Stack>
                      <Stack mt="4px">
                        <ReadMore
                          color={theme.palette.text.secondary}
                          limits="160"
                        >
                          {review.reply}
                        </ReadMore>
                      </Stack>
                    </Box>
                  ) : null}
                </Stack>
              ) : (
                <Grid
                  container
                  key={review?.id}
                  padding="10px"
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Grid item xs={8} sm={8} md={9.5}>
                    <Stack gap={0.4} justifyContent="flex-end">
                      <Typography
                        fontSize="14px"
                        fontWeight="500"
                        color={theme.palette.text.primary}
                      >
                        {review?.customer_name}
                      </Typography>
                      <CustomRatings
                        readOnly
                        ratingValue={review.rating}
                        fontSize={"1.2rem"}
                      />
                      <Typography
                        fontSize="12px"
                        fontWeight="400"
                        color="text.secondary"
                      >
                        {getDateFormat(review.created_at)}
                      </Typography>
                      <ReadMore color={theme.palette.neutral[600]} limits="160">
                        {review?.comment}
                      </ReadMore>
                    </Stack>
                  </Grid>
                  <Grid item xs={4} sm={4} md={2.5}>
                    <Stack
                      justifyContent="center"
                      spacing={0.5}
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleClick(review?.item)}
                    >
                      <Stack
                        padding="7px"
                        borderRadius="8px"
                        sx={{
                          border: ".8px solid",
                          borderColor: (theme) => theme.palette.neutral[300],
                        }}
                      >
                        <CustomImageContainer
                          src={review.item_image_full_url}
                          objectFit="cover"
                          height="74px"
                          borderRadius="8px"
                        />
                      </Stack>
                      <Typography
                        textAlign="center"
                        color={theme.palette.neutral[600]}
                        fontSize="10px"
                        fontWeight="400"
                      >
                        {review.item_name}
                      </Typography>
                    </Stack>
                  </Grid>
                  {review.reply ? (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          background: theme.palette.neutral[300],
                          padding: "13px",
                          borderRadius: "9px",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            fontSize="12px"
                            fontWeight="500"
                            color={theme.palette.text.primary}
                          >
                            {restaurantDetails?.name}
                          </Typography>
                          <Typography
                            fontSize="10px"
                            fontWeight="400"
                            color="text.secondary"
                          >
                            {getDateFormat(review.updated_at)}
                          </Typography>
                        </Stack>
                        <Stack mt="5px">
                          <ReadMore
                            color={theme.palette.text.secondary}
                            limits="160"
                          >
                            {review.reply}
                          </ReadMore>
                        </Stack>
                      </Box>
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
              )
            )}
          {isLoading && (
            <Stack marginTop="2rem">
              <DotSpin />
            </Stack>
          )}
        </StyledSimpleBar>
      </CustomStackFullWidth>
      {openModal && getCurrentModuleType() === "food" && productData ? (
        <FoodDetailModal
          product={productData}
          //imageBaseUrl={imageBaseUrl}
          open={openModal}
          handleModalClose={() => setOpenModal(false)}
          setOpen={setOpenModal}
          addToWishlistHandler={addToWishlistHandler}
          removeFromWishlistHandler={removeFromWishlistHandler}
          isWishlisted={isWishlisted}
        />
      ) : (
        <ModuleModal
          open={openModal}
          handleModalClose={() => setOpenModal(false)}
          configData={configData}
          productDetailsData={productData}
          addToWishlistHandler={addToWishlistHandler}
          removeFromWishlistHandler={removeFromWishlistHandler}
          isWishlisted={isWishlisted}
          p
        />
      )}
    </Paper>
  );
};

export default RestaurantReviewModal;
