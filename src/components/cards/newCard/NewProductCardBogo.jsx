import React from "react";
import { Box, Stack, Typography, styled, useTheme } from "@mui/material";
import { t } from "i18next";
import NextImage from "components/NextImage";
import { getAmountWithSign } from "helper-functions/CardHelpers";

// Read-only row card for a single buy/free line inside the BOGO item-details
// modal — the "bogo" variant of NewProductCard. There is no cart control on
// this card itself; the modal owns one shared quantity stepper + add/update
// button for the whole bundle (mirrors Stackfood's NewFoodBogoCard).

const CardRoot = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "flex-start",
  gap: "16px",
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.neutral[200]}`,
  borderRadius: "12px",
  padding: "16px",
}));

const ImageBox = styled(Box)(({ theme }) => ({
  position: "relative",
  flexShrink: 0,
  width: "100px",
  height: "100px",
  borderRadius: "8px",
  overflow: "hidden",
  backgroundColor: theme.palette.background.secondary,
  border: `1px solid ${theme.palette.neutral[200]}`,
}));

const NewProductCardBogo = ({ item }) => {
  const theme = useTheme();

  return (
    <CardRoot>
      <Stack sx={{ flex: 1, minWidth: 0, gap: "6px" }}>
        {Number(item?.avg_rating) > 0 && (
          <Stack direction="row" alignItems="center" gap="2px">
            <i
              className="fi fi-sr-star"
              style={{
                fontSize: "12px",
                lineHeight: 1,
                display: "flex",
                color: theme.palette.customColor.starAmber,
              }}
            />
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: 1.3,
                color: "neutral.500",
              }}
            >
              {Number(item.avg_rating).toFixed(1)}
            </Typography>
          </Stack>
        )}
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.48px",
            color: "neutral.700",
            textTransform: "capitalize",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {item?.name}
        </Typography>

        <Stack direction="row" alignItems="center" gap="4px" flexWrap="wrap">
          {item?.is_free ? (
            <>
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "neutral.500",
                  textDecoration: "line-through",
                }}
              >
                {getAmountWithSign(item?.price)}
              </Typography>
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "-0.54px",
                  color: theme.palette.error.dangerText,
                }}
              >
                {t("Free")}
              </Typography>
            </>
          ) : (
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "-0.54px",
                color: "neutral.1050",
              }}
            >
              {getAmountWithSign(item?.price)}
            </Typography>
          )}
        </Stack>

        {!!item?.variationText && (
          <Typography
            sx={{
              fontSize: "13px",
              letterSpacing: "-0.39px",
              color: "neutral.500",
            }}
          >
            {t("Variation")} : {item.variationText}
          </Typography>
        )}
        {!!item?.addOnSummary && (
          <Typography
            sx={{
              fontSize: "13px",
              letterSpacing: "-0.39px",
              color: "neutral.500",
            }}
          >
            {t("Addon")} : {item.addOnSummary}
          </Typography>
        )}

        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "-0.42px",
            color: "neutral.1050",
          }}
        >
          {t("Qty")} : {item?.quantity ?? 1}
        </Typography>
      </Stack>

      <ImageBox>
        <NextImage
          src={item?.image_full_url}
          alt={item?.name || ""}
          fill
          objectFit="cover"
        />
      </ImageBox>
    </CardRoot>
  );
};

export default NewProductCardBogo;
