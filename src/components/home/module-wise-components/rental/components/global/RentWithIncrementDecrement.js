import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { alpha, Button, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { borderRadius, Box, Stack } from "@mui/system";
import React, { useState } from "react";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import Loading from "../../../../../custom-loading/Loading";
import { t } from "i18next";
import { PrimaryToolTip } from "components/cards/QuickView";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector } from "react-redux";

const CustomButton = styled(Box)(({ theme, fill,width,height }) => ({
  width: width|| "36px",
  height: height|| "36px",
  borderRadius: "4px",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  justifyContent: "center",
  backgroundColor:
    fill === "true"
      ? getCurrentModuleType() === ModuleTypes.FOOD
        ? theme.palette.moduleTheme.food
        : theme.palette.primary.main
      : alpha(
          getCurrentModuleType() === ModuleTypes.FOOD
            ? theme.palette.moduleTheme.food
            : theme.palette.primary.main,
          0.1
        ),
  color:
    fill === "true"
      ? theme.palette.whiteContainer.main
      : getCurrentModuleType() === ModuleTypes.FOOD
      ? theme.palette.moduleTheme.food
      : theme.palette.primary.main,
  "&:hover": {
    filter: "brightness(0.6)",
  },
  [theme.breakpoints.down("sm")]: {
    width: "25px",
    height: "25px",
  },
}));

const RentWithIncrementDecrement = (props) => {
  const {
    handleCardHoverFromCartIconClick,
    addToCartHandler,
    isProductExist,
    handleIncrement,
    handleDecrement,
    count,
    isLoading,
    updateLoading,
    borderRadius = "5px",
    paddingLeft = "33px",
    paddingRight = "33px",
    paddingBottom,
    height,
    paddingTop,
    isVerticle,
    text = "Rent",
    fontSize,
    itemId,
    removeItemCart,
    countWidth,
    buttonHeight,
    width,
    availableQuantity,
    item
  } = props;


  const theme = useTheme();
  const handleCart = (e) => {
    e.stopPropagation();
    addToCartHandler?.(e);

    // handleCardHoverFromCartIconClick?.(e);
  };

  const incrementHandler = (e) => {
    e.stopPropagation();
    handleIncrement?.({
      itemId: itemId,
      quantity: count,
    });
  };

  const decrementHandler = (e) => {
    e.stopPropagation();
    handleDecrement?.({
      itemId: itemId,
      quantity: count,
    });
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    removeItemCart?.({
      itemId: itemId,
    });
  };
  const cardWiseManage = () => {
    if (isProductExist) {
      return (
        <Stack
          direction={isVerticle ? "column" : "row"}
          alignItems="center"
          justifyContent="center"
          gap={isVerticle && "7px"}
          sx={{
            backgroundColor: alpha(theme.palette.neutral[400], 0.1),
            borderRadius: "10px",
            width: "fit-content",
          }}
        >
          {count === 1 || item?.vehicle?.total_vehicle_count===0 ? (
            <CustomButton width={width} height={buttonHeight} onClick={(e) => handleRemove(e)}>
              <DeleteIcon sx={{ width: "16px", color: "red" }} />
            </CustomButton>
          ) : (
            <CustomButton width={width} height={buttonHeight} onClick={(e) => decrementHandler(e)}>
              <RemoveIcon
                sx={{
                  fontSize: { xs: "15px", md: "20px" },
                  transition: "all ease 0.5s",
                }}
              />
            </CustomButton>
          )}

          {updateLoading ? (
            <Stack width="35px" height="21px">
              <Loading color={theme.palette.primary.main} />
            </Stack>
          ) : (
            <Typography
              onClick={(e) => e.stopPropagation()}
              textAlign="center"
              sx={{
                width: !isVerticle
                  ? { xs: "30px", md: countWidth ? countWidth : "35px" }
                  : "auto",
                transition: "all ease 0.5s",
              }}
            >
              {count}
            </Typography>
          )}

          <CustomButton width={width} height={buttonHeight} fill="true" onClick={(e) => incrementHandler(e)}>
            <AddIcon
              sx={{
                fontSize: { xs: "15px", md: "20px" },
                transition: "all ease 0.5s",
              }}
            />
          </CustomButton>
        </Stack>
      );
    } else {
      return (
        <>
          {isLoading ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{
                backgroundColor: (theme) => theme.palette.neutral[100],
                color: (theme) => theme.palette.primary.main,
                height: { xs: "25px", md: "35px" },
                width: { xs: "25px", md: "35px" },
                borderRadius: "5px",
                transition: "all ease 0.5s",
                border: (theme) =>
                  `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
              }}
            >
              <Loading color={theme.palette.primary.main} />
            </Stack>
          ) : (
            <PrimaryToolTip text="Add to cart">
              <Stack onClick={(e) => handleCart(e)}>
                <Button
                  sx={{
                    borderRadius: borderRadius,
                    paddingLeft: paddingLeft,
                    paddingRight: paddingRight,
                    paddingBottom: paddingBottom,
                    paddingTop: paddingTop,
                    fontSize: fontSize,
                    height: height,
                  }}
                  
                  variant="contained"
                >
                  {t(text)}
                </Button>
              </Stack>
            </PrimaryToolTip>
          )}
        </>
      );
    }
  };

  return <>{cardWiseManage()}</>;
};

RentWithIncrementDecrement.propTypes = {};

export default RentWithIncrementDecrement;
