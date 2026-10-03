import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { FoodHalalHaram } from "components/cards/SpecialCard";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { CustomTypographyEllipsis } from "styled-components/CustomTypographies.style";
import { isBundleCartRow } from "helper-functions/bundleCartRow";
import { isBogoCartRow } from "helper-functions/bogoCartRow";
import {
  getAddOnsNames,
  parseAddOns,
  parseVariationSummary,
} from "helper-functions/orderLineSummary";
import CartBundleItem from "components/added-cart-view/CartBundleItem";
import BogoCartItemCard from "components/added-cart-view/BogoCartItemCard";
import CustomImageContainer from "../../../CustomImageContainer";
import PrescriptionOrderSummery from "../prescription-order/PrescriptionOrderSummery";
import SingleOrderAttachment from "../singleOrderAttachment";
import BogoOrderDetailsViewModal from "./BogoOrderDetailsViewModal";

// Order-detail bundle rows carry a differently-shaped `bundle_details` than
// the cart's — sub-items are order-line rows with `item_details` as a JSON
// string, and the price fields are `bundle_price`/`total_price`/`discount`
// rather than `base_price`/`final_price` — so map it into the shape
// `CartBundleItem` (built for the cart's bundle_details) expects.
const mapOrderBundleDetails = (bundleDetails) => {
  const quantity = Number(bundleDetails?.quantity) || 1;
  const totalPrice = Number(bundleDetails?.total_price) || 0;
  const discount = Number(bundleDetails?.discount) || 0;
  const finalPrice = quantity > 0 ? (totalPrice - discount) / quantity : 0;

  const items = (bundleDetails?.items ?? []).map((subItem) => {
    let parsedDetails = null;
    try {
      parsedDetails = subItem?.item_details
        ? JSON.parse(subItem.item_details)
        : null;
    } catch {
      parsedDetails = null;
    }
    const parsedAddOns = parseAddOns(subItem?.add_ons);
    return {
      item_id: subItem?.item_id,
      name: parsedDetails?.name ?? bundleDetails?.name,
      image_full_url: parsedDetails?.image_full_url ?? null,
      quantity: subItem?.quantity,
      price: subItem?.price,
      variationText: parseVariationSummary(subItem?.variation),
      addOnSummary: getAddOnsNames(parsedAddOns),
    };
  });

  return {
    name: bundleDetails?.name,
    quantity,
    final_price: finalPrice,
    base_price: Number(bundleDetails?.bundle_price) || finalPrice,
    total_price: totalPrice,
    discount,
    items,
  };
};

// Order-detail BOGO rows carry order-line shaped `buy_items`/`free_items`
// (each with `item_details` as a JSON string) rather than the cart's nested
// `.item` rows — map into the `{item_id, name, image_full_url}` shape
// `BogoCartItemCard` expects, mirroring `mapOrderBundleDetails` above.
const mapOrderBogoDetails = (bogoDetails) => {
  const quantity = Number(bogoDetails?.quantity) || 1;
  const totalPrice = Number(bogoDetails?.total_price) || 0;
  const finalPrice = quantity > 0 ? totalPrice / quantity : 0;

  const mapItems = (rows) =>
    (rows ?? []).map((subItem) => {
      let parsedDetails = null;
      try {
        parsedDetails = subItem?.item_details
          ? JSON.parse(subItem.item_details)
          : null;
      } catch {
        parsedDetails = null;
      }
      const parsedAddOns = parseAddOns(subItem?.add_ons);
      return {
        item_id: subItem?.item_id,
        quantity: subItem?.quantity,
        price: subItem?.price,
        variationText: parseVariationSummary(subItem?.variation),
        addOnSummary: getAddOnsNames(parsedAddOns),
        item: {
          name: parsedDetails?.name,
          image_full_url: parsedDetails?.image_full_url,
        },
      };
    });

  return {
    offer_title: bogoDetails?.offer_title,
    quantity,
    final_price: finalPrice,
    buy_items: mapItems(bogoDetails?.buy_items),
    free_items: mapItems(bogoDetails?.free_items),
  };
};

const OrderRow = ({ product, t }) => {
  const theme = useTheme();
  const addOnPrice = Number(product?.total_add_on_price) || 0;
  const originalPrice = (Number(product?.price) || 0) + addOnPrice;
  const discountAmount =
    (Number(product?.discount_on_item) || 0) +
    (Number(product?.addon_discount) || 0);
  const discountedPrice = Math.max(originalPrice - discountAmount, 0);
  const variationText = parseVariationSummary(product?.variation);
  return (
    <Stack direction="row" gap="8px" alignItems="flex-start" width="100%">
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "8px",
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <CustomImageContainer
          src={product?.image_full_url}
          height="100%"
          width="100%"
          objectFit="cover"
          borderRadius="8px"
          loading="lazy"
        />
      </Box>

      <Stack direction="row" flex={1} minWidth={0} gap="6px">
        <Stack flex={1} minWidth={0} gap="4px">
          <CustomTypographyEllipsis fontWeight="400" fontSize="14px">
            <Stack flexDirection="row" gap="4px" alignItems="center">
              {t(product?.item_details?.name)}
              {product?.item_details?.halal_tag_status &&
              product?.item_details?.is_halal ? (
                <FoodHalalHaram position="relative" width={23} />
              ) : (
                ""
              )}
            </Stack>
          </CustomTypographyEllipsis>
          <Stack
            direction="row"
            alignItems="baseline"
            gap="6px"
            flexWrap="wrap"
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {getAmountWithSign(discountedPrice)}
            </Typography>
            {discountAmount > 0 && (
              <Typography
                sx={{
                  fontSize: "13px",
                  color: theme.palette.text.secondary,
                  textDecoration: "line-through",
                }}
              >
                {getAmountWithSign(originalPrice)}
              </Typography>
            )}
          </Stack>
          {variationText && (
            <Typography
              sx={{ fontSize: "12px", color: theme.palette.text.secondary }}
            >
              {variationText}
            </Typography>
          )}
          {product?.add_ons?.length > 0 && (
            <Typography
              sx={{ fontSize: "12px", color: theme.palette.text.secondary }}
            >
              {t("Addons")}: {getAddOnsNames(product?.add_ons)}
            </Typography>
          )}
        </Stack>

        <Box
          sx={{
            minWidth: "32px",
            px: 1,
            py: 0.75,
            borderRadius: "8px",
            backgroundColor: theme.palette.background.secondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {product?.quantity}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
};

const OrderInfo = ({ data, summaryData, configData, items, t, isSmall }) => {
  const theme = useTheme();
  const [bogoViewModal, setBogoViewModal] = useState(null);
  return (
    <Grid item xs={12} sm={12} md={12}>
      {!data?.prescription_order &&
      summaryData?.module_type === "pharmacy" &&
      summaryData?.order_attachment_full_url &&
      summaryData?.order_attachment_full_url?.length &&
      summaryData?.order_attachment ? (
        <SingleOrderAttachment
          title="Prescription"
          trackOrderData={summaryData}
          configData={configData}
        />
      ) : null}
      {data?.prescription_order ? (
        <PrescriptionOrderSummery data={data} />
      ) : null}
      {items && items?.length > 0 && (
        <Box
          sx={{
            border: `1px solid ${theme.palette.customColor.tagBg}`,
            borderRadius: "8px",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            ml: { xs: "0px", sm: "20px", md: "25px" },
          }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {t("Order List")}
          </Typography>
          <Stack width="100%" gap="20px">
            {items.map((product, index) => (
              <Stack
                key={`${product?.id ?? "row"}-${index}`}
                width="100%"
                gap="20px"
              >
                {isBundleCartRow(product) ? (
                  <CartBundleItem
                    bundleDetails={mapOrderBundleDetails(
                      product?.bundle_details
                    )}
                    quantity={product?.quantity}
                    showStepper={false}
                    disableGutters
                  />
                ) : isBogoCartRow(product) ? (
                  <Box
                    onClick={() =>
                      setBogoViewModal({
                        bogoDetails: mapOrderBogoDetails(product?.bogo_details),
                        quantity: product?.quantity,
                        totalPrice: product?.price,
                      })
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    <BogoCartItemCard
                      bogoDetails={mapOrderBogoDetails(product?.bogo_details)}
                      quantity={product?.quantity}
                      showStepper={false}
                      disableGutters
                    />
                  </Box>
                ) : (
                  <OrderRow product={product} t={t} />
                )}
                {index !== items.length - 1 && (
                  <Box
                    sx={{
                      height: "1px",
                      width: "100%",
                      backgroundColor: theme.palette.background.secondary,
                    }}
                  />
                )}
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
      <BogoOrderDetailsViewModal
        open={!!bogoViewModal}
        onClose={() => setBogoViewModal(null)}
        data={bogoViewModal}
      />
    </Grid>
  );
};

OrderInfo.propTypes = {};

export default OrderInfo;
