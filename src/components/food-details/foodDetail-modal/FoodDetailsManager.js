import { Grid, Stack, Typography } from "@mui/material";

import {
  CustomFavICon,
  FoodSubTitleTypography,
} from "../food-card/FoodCard.style";
// import { CustomTypographyTag } from "../../styled-components/CustomTypographies.style";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import {
  CustomOverlayBox,
  CustomStackForFoodModal,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { getImageUrl, isAvailable } from "utils/CustomFunctions";
import CustomImageContainer from "../../CustomImageContainer";
import CustomRatingBox from "../../CustomRatingBox";
import { FoodHalalHaram, FoodVegNonVegFlag } from "../../cards/SpecialCard";
import NotAvailableCard from "./NotAvailableCard";
import React from "react";

const FoodDetailsManager = (props) => {
  const {
    configData,
    handleDiscountChip,
    modalData,
    product,
    t,
    router,
    addToWishlistHandler,
    removeFromWishlistHandler,
    isWishlisted,
    theme,

    handleRouteToStore,
  } = props;

  return (
    <Grid container direction="row">
      <Grid item xs={12} md={12} position="relative">
        {handleDiscountChip(product, t)}
        {modalData?.length > 0 &&
          !isAvailable(
            modalData[0]?.available_time_starts,
            modalData[0]?.available_time_ends
          ) && (
            <CustomOverlayBox height="40%" top="126px">
              <NotAvailableCard
                endTime={
                  modalData.length > 0 && modalData[0].available_time_ends
                }
                startTime={
                  modalData.length > 0 && modalData[0].available_time_starts
                }
              />
            </CustomOverlayBox>
          )}

        <CustomImageContainer
          src={modalData[0]?.image_full_url}
          borderRadius=".3rem"
          width="100%"
          height="200px"
          alt="The house from the offer."
          objectfit="cover"
          aspectRatio="2/1"
        />
        <CustomStackForFoodModal width="100%" spacing={2}>
          <Stack spacing={1.4} alignItems="start">
            {!product?.available_date_ends && (
              <CustomRatingBox rating={product?.avg_rating} />
            )}
            {router.pathname !== `/store/[id]` ? (
              <Typography
                sx={{ cursor: "pointer" }}
                fontSize="14px"
                fontWeight="400"
                color={theme.palette.whiteContainer.main}
                onClick={handleRouteToStore}
              >
                {product?.store_name}
              </Typography>
            ) : (
              <Typography
                fontSize="14px"
                fontWeight="400"
                color={theme.palette.whiteContainer.main}
              >
                {product?.store_name}
              </Typography>
            )}
          </Stack>
          {!product?.available_date_ends && (
            <>
              {!isWishlisted ? (
                <CustomFavICon>
                  <IconButton onClick={addToWishlistHandler}>
                    <FavoriteBorderIcon color="primary" />
                  </IconButton>
                </CustomFavICon>
              ) : (
                <CustomFavICon>
                  <IconButton onClick={(e) => removeFromWishlistHandler(e)}>
                    <FavoriteIcon color="primary" />
                  </IconButton>
                </CustomFavICon>
              )}
            </>
          )}
        </CustomStackForFoodModal>
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <Stack paddingX="1rem" width="100%" spaicing={1} paddingTop="1rem">
          <CustomStackFullWidth>
            <CustomStackFullWidth
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              flexWrap="wrap"
              spacing={0.5}
            >
              <Typography fontSize="16px" fontWeight="500">
                {modalData.length > 0 && modalData[0].name}
              </Typography>
              {modalData.length > 0 &&
                modalData[0]?.module?.module_type === "food" &&
                configData?.toggle_veg_non_veg && (
                  <FoodVegNonVegFlag
                    veg={modalData[0]?.veg === 0 ? "false" : "true"}
                  />
                )}
              {modalData[0]?.halal_tag_status && modalData[0]?.is_halal ? (
                <FoodHalalHaram position="relative" />
              ) : (
                ""
              )}
            </CustomStackFullWidth>
          </CustomStackFullWidth>
          {modalData[0]?.generic_name[0] && (
            <Typography
              fontSize={{ xs: "12px", sm: "12px" }}
              fontWeight="400"
              color="customColor.textGray"
              component="h2"
              mb="5px"
            >
              {modalData[0]?.generic_name[0]}.
            </Typography>
          )}
          <FoodSubTitleTypography
            color={theme.palette.neutral[400]}
            sx={{
              textAlign: "left",
              fontSize: "12px",
            }}
          >
            {modalData.length > 0 && modalData[0].description}
          </FoodSubTitleTypography>

          {modalData[0]?.nutritions_name?.length > 0 && (
            <>
              <Typography fontSize="14px" fontWeight="500" mt="5px">
                {t("Nutrition Details")}
              </Typography>

              <Stack direction="row" spacing={0.5}>
                {modalData[0]?.nutritions_name?.map((item, index) => (
                  <Typography fontSize="12px" key={index}>
                    {item}
                    {index !== modalData[0]?.nutritions_name.length - 1
                      ? ","
                      : "."}
                  </Typography>
                ))}
              </Stack>
            </>
          )}
          {modalData[0]?.allergies_name?.length > 0 && (
            <>
              <Typography fontSize="14px" fontWeight="500" mt="5px">
                {t("Allergic Ingredients")}
              </Typography>

              <Stack direction="row" spacing={0.5}>
                {modalData[0]?.allergies_name?.map((item, index) => (
                  <Typography fontSize="12px" key={index}>
                    {item}
                    {index !== modalData[0]?.allergies_name.length - 1
                      ? ","
                      : "."}
                  </Typography>
                ))}
              </Stack>
            </>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

FoodDetailsManager.propTypes = {};

export default FoodDetailsManager;
