import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { t } from "i18next";
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "helper-functions/CardHelpers";
import { getLowestVariation } from "./helperFunction";

const PricePreviewWithStock = (props) => {
  const { theme, productDetailsData } = props;
  const hasVariations = productDetailsData?.variations?.length > 0;

  // With variations, "Start From" shows the cheapest variation's own price
  // and discount — not the base service price/discount.
  const lowestVariation = getLowestVariation(productDetailsData);

  const basePrice = hasVariations
    ? lowestVariation?.price ?? 0
    : productDetailsData?.base_price ?? productDetailsData?.price ?? 0;
  const priceDiscount = hasVariations
    ? lowestVariation?.discount
    : productDetailsData?.discount;
  const priceDiscountType = hasVariations
    ? lowestVariation?.discount_type
    : productDetailsData?.discount_type;

  const priceWithOrWithoutDiscount = () => {
    const discountedPrice = getDiscountedAmount(
      basePrice,
      priceDiscount,
      priceDiscountType,
      productDetailsData?.store_discount,
    );
    return (
      <Box paddingTop={2}>
        {hasVariations && (
          <Typography
            color={theme.palette.text.secondary}
            sx={{ fontSize: { xs: "14px", sm: "18px" } }}
          >
            {t("Start From")}
          </Typography>
        )}
        <Typography
          display="flex"
          alignItems="center"
          fontWeight="700"
          color={theme.palette.text.primary}
          sx={{ fontSize: { xs: "18px", sm: "32px" } }}
          component="h2"
        >
          {discountedPrice === basePrice ? (
            <>{getAmountWithSign(basePrice)}</>
          ) : (
            <>
              {getAmountWithSign(discountedPrice)}
              <Typography
                variant="body1"
                marginInlineStart="8px"
                fontWeight="400"
                color={theme.palette.customColor.textGray}
                sx={{ fontSize: { xs: "14px", sm: "18px" } }}
              >
                <del>{getAmountWithSign(basePrice)}</del>
              </Typography>
            </>
          )}
        </Typography>
      </Box>
    );
  };

  return <>{priceWithOrWithoutDiscount()}</>;
};

PricePreviewWithStock.propTypes = {};

export default PricePreviewWithStock;
