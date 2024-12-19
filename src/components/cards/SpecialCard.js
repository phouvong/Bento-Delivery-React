/* eslint-disable @next/next/no-img-element */
import { Grid, Tooltip, Typography } from "@mui/material";
import { Box, Stack, styled } from "@mui/system";
import { t } from "i18next";
import { useState } from "react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { getCurrentModuleType } from "../../helper-functions/getCurrentModuleType";
import { ModuleTypes } from "../../helper-functions/moduleTypes";
import { textWithEllipsis } from "../../styled-components/TextWithEllipsis";
import AmountWithDiscountedAmount from "../AmountWithDiscountedAmount";
import CustomImageContainer from "../CustomImageContainer";
import CustomRatingBox from "../CustomRatingBox";
import OrganicTag from "../organic-tag";
import RecommendTag from "../recommendTag";
import Body2 from "../typographies/Body2";
import AddWithIncrementDecrement from "./AddWithIncrementDecrement";
import { CustomOverLay } from "./Card.style";
import QuickView, { PrimaryToolTip } from "./QuickView";

const VegNonVegFlag = styled(Box)(({ theme, veg, rounded }) => ({
  height: "14px",
  width: "14px",
  color: veg === "true" ? theme.palette.primary.customType3 : "red",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid",
  borderRadius: rounded ? rounded : "",
}));
const Circle = styled(Box)(({ theme, veg }) => ({
  height: "10px",
  width: "10px",
  backgroundColor: veg === "true" ? theme.palette.primary.customType3 : "red",
  borderRadius: "50%",
}));

export const FoodVegNonVegFlag = ({ veg }) => {
  return (
    <Tooltip
      arrow
      placement="top"
      title={veg === "true" ? t("Veg") : t("Non Veg")}
    >
      <VegNonVegFlag veg={veg}>
        <Circle veg={veg} />
      </VegNonVegFlag>
    </Tooltip>
  );
};

export const FoodHalalHaram = ({ position, width }) => {
  return (
    <PrimaryToolTip text={t("This product is Halal")}>
      <Stack
        sx={{
          position: position ? position : "absolute",
          bottom: position === "relative" ? "" : "10px",
          left: position === "relative" ? "" : "10px",
          zIndex: "999",
          img: {
            objectFit: "contain",
          },
        }}
      >
        <img
          src={"/static/halal.svg"}
          width={width ? width : 20}
          height={width ? width : 20}
          alt={t("Halal")}
        />
      </Stack>
    </PrimaryToolTip>
  );
};
const SpecialCard = (props) => {
  const {
    item,
    quickViewHandleClick,
    addToCart,
    handleBadge,
    isProductExist,
    handleIncrement,
    handleDecrement,
    count,
    handleClick,
    updateLoading,
    setOpenLocationAlert,
    isLoading,
    noRecommended,
    configData,
  } = props;

  const classes = textWithEllipsis();
  const [isHover, setIsHover] = useState(false);

  const getModuleWiseItemName = () => {
    if (getCurrentModuleType() === ModuleTypes.FOOD) {
      return (
        <Stack direction="row" alignItems="center" spacing={0.8}>
          <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
            <Typography
              className={classes.singleLineEllipsis}
              fontSize={{ xs: "12px", md: "14px" }}
              fontWeight="500"
              width={0}
              flexGrow={1}
              component="h3"
            >
              {item?.name}
            </Typography>
          </PrimaryToolTip>
          {configData?.configData?.toggle_veg_non_veg ? (
            <FoodVegNonVegFlag veg={item?.veg == 0 ? false : true} />
          ) : null}
        </Stack>
      );
    } else {
      return (
        <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
          <Typography
            className={classes.singleLineEllipsis}
            fontSize={{ xs: "12px", md: "14px" }}
            fontWeight="500"
            component="h3"
          >
            {item?.name}
          </Typography>
        </PrimaryToolTip>
      );
    }
  };

  return (
    <CustomStackFullWidth
      sx={{
        padding: "10px",
        cursor: "pointer",
        background: (theme) => theme.palette.neutral[100],
        borderRadius: "10px",
        width: { xs: "auto", md: "230px" },
        height: "100%",
        "&:hover": {
          img: {
            transform: "scale(1.05)",
          },
        },
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={handleClick}
    >
      <CustomStackFullWidth
        sx={{
          position: "relative",
          height: { xs: "140px", md: "180px" },
        }}
      >
        {!noRecommended && (
          <RecommendTag status={item?.recommended} top="70px" />
        )}
        {<OrganicTag status={item?.organic} top="40px" />}
        {handleBadge()}
        <Box borderRadius="8px" overflow="hidden" height="100%">
          <CustomImageContainer
            src={item?.image_full_url}
            height="100%"
            width="100%"
            objectfit="cover"
          />
        </Box>
        {item?.halal_tag_status && item?.is_halal ? (
          <FoodHalalHaram width={30} />
        ) : (
          ""
        )}

        <CustomOverLay hover={isHover}>
          <QuickView
            quickViewHandleClick={quickViewHandleClick}
            isHover={isHover}
            noWishlist
            isProductExist={isProductExist}
            addToCartHandler={addToCart}
            showAddtocart={!isProductExist}
            isLoading={isLoading}
            updateLoading={updateLoading}
            setOpenLocationAlert={setOpenLocationAlert}
          />
          <Box
            sx={{
              position: "absolute",
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
          >
            <AddWithIncrementDecrement
              verticalCard
              onHover={isHover}
              addToCartHandler={addToCart}
              isProductExist={isProductExist}
              handleIncrement={handleIncrement}
              handleDecrement={handleDecrement}
              setIsHover={() => setIsHover(true)}
              count={count}
              isLoading={isLoading}
              updateLoading={updateLoading}
            />
          </Box>
        </CustomOverLay>
      </CustomStackFullWidth>
      <CustomStackFullWidth mt="15px" sx={{ padding: "5px" }} spacing={0.5}>
        {getModuleWiseItemName()}
        <Body2 text={item?.store_name} component="h4" />
      </CustomStackFullWidth>
      <CustomBoxFullWidth sx={{ padding: "0px 5px 5px 5px" }}>
        <Grid container>
          <Grid item xs={9} sm={9}>
            <AmountWithDiscountedAmount item={item} />
          </Grid>
          <Grid item xs={3} sm={3}>
            <CustomRatingBox rating={item?.avg_rating} />
          </Grid>
        </Grid>
      </CustomBoxFullWidth>
    </CustomStackFullWidth>
  );
};

SpecialCard.propTypes = {};

export default SpecialCard;
