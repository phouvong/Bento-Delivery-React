import React from "react";
import { Button, Stack, Typography, alpha, useTheme } from "@mui/material";
import moment from "moment";
import Loading from "../../custom-loading/Loading";

const AddOrderToCart = (props) => {
  const {
    isInCart,
    product,
    t,
    addToCard,
    isScheduled,
    isLoading,
    updateIsLoading,
    requiresSelection,
    requiredLabel,
  } = props;
  const theme = useTheme();

  const handleBuyNowClick = () => addToCard?.("buy_now");
  const inCart = isInCart?.(product?.id);

  const primaryButtonSx = {
    flex: 1,
    height: 44,
    borderRadius: "10px",
    textTransform: "none",
    fontWeight: 700,
    fontSize: { xs: "13px", md: "14px" },
    boxShadow: "none",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.paper,
    "&:hover": {
      boxShadow: "none",
      backgroundColor: theme.palette.primary.dark,
    },
    "&.Mui-disabled": {
      color: theme.palette.text.secondary,
      backgroundColor: alpha(theme.palette.text.primary, 0.08),
    },
  };

  const buyNowSx = {
    ...primaryButtonSx,
    backgroundColor:
      theme.palette.customColor?.buyButton || theme.palette.warning.light,
    color: theme.palette.text.primary,
    "&:hover": {
      backgroundColor:
        theme.palette.customColor?.buyButton || theme.palette.warning.main,
      boxShadow: "none",
    },
  };

  if (isScheduled === "false") {
    return (
      <Stack
        spacing={0.5}
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
          borderRadius: "10px",
          py: 1,
          px: 1.5,
          width: "100%",
        }}
      >
        <Typography fontSize="14px" fontWeight={700}>
          {t("Not Available now")}
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          flexWrap="wrap"
          justifyContent="center"
        >
          <Typography fontSize="12px">{t("Available will be")}</Typography>
          <Typography fontSize="12px" fontWeight={600}>
            {`${moment(product?.available_time_starts, ["HH:mm"]).format(
              "hh:mm a"
            )} - ${moment(product?.available_time_ends, ["HH:mm"]).format(
              "hh:mm a"
            )}`}
          </Typography>
        </Stack>
      </Stack>
    );
  }

  const addToCartLabel = updateIsLoading
    ? null
    : inCart
    ? t("Update to Cart")
    : t("Add to Cart");

  const showRequiredCta = requiresSelection;
  const ctaLabel = showRequiredCta
    ? requiredLabel || t("Choose Required Option")
    : addToCartLabel;
  const ctaDisabled = showRequiredCta || isLoading || updateIsLoading;
  const showButtonLoader = isLoading || updateIsLoading;

  return (
    <Stack direction="row" spacing={1.25} sx={{ width: "100%" }}>
      <Button onClick={handleBuyNowClick} disabled={ctaDisabled} sx={buyNowSx}>
        {t("Buy Now")}
      </Button>
      <Button
        onClick={() => addToCard()}
        disabled={ctaDisabled}
        sx={primaryButtonSx}
      >
        {showButtonLoader ? (
          <Stack height="22px" alignItems="center" justifyContent="center">
            <Loading />
          </Stack>
        ) : (
          ctaLabel
        )}
      </Button>
    </Stack>
  );
};

export default AddOrderToCart;
