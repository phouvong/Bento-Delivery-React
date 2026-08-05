import React, { useState } from "react";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";

import {
  getAmountWithSign,
  getDiscountedAmount,
} from "helper-functions/CardHelpers";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import {
  getTotalVariationsPrice,
  handleTotalAmountWithAddons,
} from "utils/CustomFunctions";
import { cart_item_remove, out_of_limits } from "utils/toasterMessages";
import {
  setDecrementToCartItem,
  setIncrementToCartItem,
  setRemoveItemFromCart,
} from "redux/slices/cart";
import useDeleteCartItem from "api-manage/hooks/react-query/add-cart/useDeleteCartItem";
import useCartItemUpdate from "api-manage/hooks/react-query/add-cart/useCartItemUpdate";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getItemDataForAddToCart } from "../../service-details/helperFunction";
import { getToken } from "helper-functions/getToken";
import CustomImageContainer from "components/CustomImageContainer";
import VariationContent from "components/added-cart-view/VariationContent";

const ModuleModal = dynamic(() => import("components/cards/ModuleModal"));

const QtyButton = styled(IconButton)(({ theme }) => ({
  padding: "6px",
  borderRadius: "8px",
  minWidth: "auto",
  backgroundColor: "transparent",
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const buildUpdatedCartProduct = (item, cartItem, isService) => {
  const nestedData = isService ? item?.service : item?.item;

  if (isService) {
    // For variation items: use variation's own price/discount.
    // For non-variation items: use base service price/discount.
    const variation = item?.variation ?? null;
    const hasVariation = !!(variation?.variant_key || variation?.name);
    const serviceUnitPrice = hasVariation
      ? (variation.price ?? 0)
      : (nestedData?.base_price ?? 0);
    const serviceDiscount = hasVariation
      ? (variation.discount ?? 0)
      : (nestedData?.discount ?? 0);
    const serviceDiscountType = hasVariation
      ? (variation.discount_type ?? nestedData?.discount_type)
      : nestedData?.discount_type;

    return {
      ...nestedData,
      image_full_url: nestedData?.image_full_url ?? nestedData?.thumbnail_full_url,
      price: serviceUnitPrice,
      totalPrice: serviceUnitPrice * (item?.quantity ?? 1),
      discount: serviceDiscount,
      discount_type: serviceDiscountType,
      cartItemId: item?.id,
      store_id: item?.provider_id ?? nestedData?.store_id,
      module_id: item?.module_id ?? nestedData?.module_id,
      module_type: nestedData?.module_type ?? getCurrentModuleType(),
      quantity: item?.quantity,
      food_variations: nestedData?.food_variations ?? [],
      selectedAddons: nestedData?.addons ?? [],
      itemBasePrice: nestedData?.base_price ?? item?.price,
      selectedOption: item?.variation ?? [],
    };
  }

  return {
    ...nestedData,
    image_full_url: nestedData?.image_full_url ?? nestedData?.thumbnail_full_url,
    price: nestedData?.price,
    cartItemId: item?.id,
    store_id: nestedData?.store_id ?? cartItem?.store_id,
    module_id: item?.module_id ?? nestedData?.module_id,
    module_type: nestedData?.module_type ?? getCurrentModuleType(),
    totalPrice: item?.price,
    quantity: item?.quantity,
    food_variations: nestedData?.food_variations ?? [],
    selectedAddons: nestedData?.addons ?? [],
    itemBasePrice: nestedData?.price,
    selectedOption: item?.variation ?? [],
  };
};

const CartItemRow = ({ cartItem, spacingTop = 0 }) => {
  const { configData } = useSelector((state) => state.configData);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation();
  const guestId =
    typeof window !== "undefined" ? localStorage.getItem("guest_id") : null;

  const { mutate: deleteMutate, isLoading: removeIsLoading } =
    useDeleteCartItem();
  const { mutate: updateMutate, isLoading } = useCartItemUpdate();

  const onIncrementSuccess = (res) => {
    if (!res) return;
    const isService = getCurrentModuleType() === "service";
    res?.forEach((item) => {
      if (cartItem?.cartItemId === item?.id) {
        dispatch(
          setIncrementToCartItem(
            buildUpdatedCartProduct(item, cartItem, isService)
          )
        );
      }
    });
  };

  const onDecrementSuccess = (res) => {
    if (!res) return;
    const isService = getCurrentModuleType() === "service";
    res?.forEach((item) => {
      if (cartItem?.cartItemId === item?.id) {
        dispatch(
          setDecrementToCartItem(
            buildUpdatedCartProduct(item, cartItem, isService)
          )
        );
      }
    });
  };

  const buildUpdateItemObject = (updateQuantity) => {
    if (getCurrentModuleType() === "service") {
      // Service update expects unit price and variation array
      return {
        cart_id: cartItem?.cartItemId,
        price: cartItem?.price,
        quantity: updateQuantity,
        store_id: cartItem?.store_id ?? cartItem?.store?.id,
        variation: cartItem?.selectedOption ?? [],
        ...(guestId && !getToken() ? { guest_id: guestId } : {}),
      };
    }
    const price =
      cartItem?.price + getTotalVariationsPrice(cartItem?.food_variations);
    const productPrice = price * updateQuantity;
    const mainPrice =
      getCurrentModuleType() === "food"
        ? productPrice
        : (cartItem?.selectedOption?.length > 0
            ? cartItem?.selectedOption?.[0]?.price
            : cartItem?.price) * updateQuantity;
    return getItemDataForAddToCart(cartItem, updateQuantity, mainPrice, guestId);
  };

  const handleIncrement = () => {
    const updateQuantity = cartItem?.quantity + 1;

    if (
      cartItem?.maximum_cart_quantity &&
      cartItem?.maximum_cart_quantity <= cartItem?.quantity
    ) {
      toast.error(t(out_of_limits));
      return;
    }

    updateMutate(buildUpdateItemObject(updateQuantity), {
      onSuccess: onIncrementSuccess,
      onError: onErrorResponse,
    });
  };

  const handleDecrement = () => {
    const updateQuantity = cartItem?.quantity - 1;

    updateMutate(buildUpdateItemObject(updateQuantity), {
      onSuccess: onDecrementSuccess,
      onError: onErrorResponse,
    });
  };

  const handleRemove = () => {
    const cartIdAndGuestId = {
      cart_id: cartItem?.cartItemId,
      store_id: cartItem?.store_id ?? cartItem?.store?.id,
      guestId: guestId,
    };
    deleteMutate(cartIdAndGuestId, {
      onSuccess: () => {
        dispatch(setRemoveItemFromCart(cartItem));
        toast.success(t(cart_item_remove));
      },
      onError: onErrorResponse,
    });
  };

  const itemTotal = handleTotalAmountWithAddons(
    getDiscountedAmount(
      cartItem?.totalPrice,
      cartItem?.discount,
      cartItem?.discount_type,
      cartItem?.store_discount,
      cartItem?.quantity
    ),
    cartItem?.selectedAddons
  );

  const originalPrice =
    cartItem?.price && cartItem?.quantity
      ? cartItem.price * cartItem.quantity
      : null;
  const showStrike =
    originalPrice != null && Number(originalPrice) > Number(itemTotal);

  return (
    <>
      <Stack
        sx={{
          marginTop: spacingTop,
          py: 1,
          px: 1.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          "&:last-child": { borderBottom: "none" },
        }}
        spacing={0.75}
      >
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Box
            sx={{ flexShrink: 0 }}
          >
            <CustomImageContainer
              src={cartItem?.image_full_url}
              width="48px"
              height="48px"
              borderRadius="8px"
              objectfit="cover"
            />
          </Box>

          <Stack flex={1} spacing={0.25} sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: theme.palette.text.primary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: 1.25,
              }}
            >
              {cartItem?.name}
            </Typography>
            {cartItem?.selectedOption?.name && (
              <Typography
                sx={{
                  fontSize: "11px",
                  color: theme.palette.text.secondary,
                  lineHeight: 1.3,
                }}
              >
                {cartItem.selectedOption.name}
              </Typography>
            )}
            <Stack direction="row" alignItems="baseline" spacing={0.75}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                {getAmountWithSign(itemTotal)}
              </Typography>
              {showStrike && (
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: theme.palette.text.disabled,
                    textDecoration: "line-through",
                  }}
                >
                  {getAmountWithSign(originalPrice)}
                </Typography>
              )}
            </Stack>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            gap={0}
            sx={{
              flexShrink: 0,
              backgroundColor: theme.palette.action.hover,
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {cartItem?.quantity === 1 ? (
              <QtyButton
                onClick={handleRemove}
                disabled={removeIsLoading}
                sx={{ color: theme.palette.error.main }}
              >
                <i
                  className="fi fi-rr-trash"
                  style={{ fontSize: "20px", lineHeight: 1, color: "currentColor" }}
                />
              </QtyButton>
            ) : (
              <QtyButton onClick={handleDecrement} disabled={isLoading}>
                <RemoveIcon sx={{ fontSize: 20 }} />
              </QtyButton>
            )}
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                width: "32px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {cartItem?.quantity}
            </Typography>
            <QtyButton onClick={handleIncrement} disabled={isLoading}>
              <AddIcon sx={{ fontSize: 20 }} />
            </QtyButton>
          </Stack>
        </Stack>

        <Box sx={{ pl: 0.5 }}>
          <VariationContent cartItem={cartItem} />
        </Box>
      </Stack>
    </>
  );
};

export default CartItemRow;
