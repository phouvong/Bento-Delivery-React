import React, { useEffect } from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";
import CartContent from "./CartContent";
import { Stack } from "@mui/system";
import cartImage from "./assets/cartImage.png";
import CustomImageContainer from "../CustomImageContainer";
import "simplebar-react/dist/simplebar.min.css";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import { cartItemTotalDiscount } from "../../utils/CustomFunctions";

const CartContents = (props) => {
  const { cartList, imageBaseUrl, refetch } = props;

  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const discountContent = t("You have Saved");

  return (
    <CustomStackFullWidth
      justifyContent="flex-start"
      sx={{ height: "100%" }}
      alignItems="center"
      mt=".7rem"
    >

      <SimpleBar
        style={{
          maxHeight: "60vh",
          width: "100%",
        }}
      >
        {cartList?.length > 0 &&
          cartList?.map((item) => {
            return (
              <CartContent
                key={item?.id}
                cartItem={item}
                imageBaseUrl={imageBaseUrl}
                refetch={refetch}
              />
            );
          })}
      </SimpleBar>
    </CustomStackFullWidth>
  );
};

CartContents.propTypes = {};

export default CartContents;
