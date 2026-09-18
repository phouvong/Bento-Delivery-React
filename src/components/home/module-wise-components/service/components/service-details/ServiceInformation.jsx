import { alpha, Skeleton, Typography, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { getDiscountedAmount } from "helper-functions/CardHelpers";
import useAddCartItem from "api-manage/hooks/react-query/add-cart/useAddCartItem";
import useCartItemUpdate from "api-manage/hooks/react-query/add-cart/useCartItemUpdate";
import useDeleteCartItem from "api-manage/hooks/react-query/add-cart/useDeleteCartItem";
import useGetGroupedCart from "api-manage/hooks/react-query/add-cart/useGetGroupedCart";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { getGuestId } from "helper-functions/getToken";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setCartList } from "redux/slices/cart";
import { addWishList } from "redux/slices/wishList";
import "simplebar-react/dist/simplebar.min.css";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import {
  not_logged_in_message,
  out_of_limits,
  out_of_stock,
  product_update_to_cart_message,
  update_error_text,
} from "utils/toasterMessages";
import CategoryInformation from "./CategoryInformation";
import { handleInitialTotalPriceVarPriceQuantitySet } from "./helperFunction";
import IncrementDecrementManager from "./IncrementDecrementManager";
import PricePreviewWithStock from "./PricePreviewWithStock";
import ServiceInformationBottomSection from "./ServiceInformationBottomSection";
import ServiceVariation from "./ServiceVariation";
import { ACTION, initialState, reducer } from "./states";
import StickyCartBar from "./StickyCartBar";
import TotalPrice from "./TotalAmount";

// Campaign variations don't carry a variant_key from the backend (only
// name/price/discount) — fall back to name so variant diffing can still
// tell selections apart instead of collapsing them onto one key.
const identifyVariant = (variation) =>
  variation?.variant_key ?? variation?.name;

export const getItemObject = (productData) => {
  const variants = (productData?.selectedOption?.[0] ?? []).map(
    ({ variation, quantity }) => ({
      variant_key: variation?.variant_key,
      quantity,
    }),
  );

  return {
    guest_id: getGuestId(),
    model: productData?.available_date_starts ? "ItemCampaign" : "Service",
    service_id: productData?.id,
    price: productData?.totalPrice,
    quantity: productData?.quantity,
    ...(variants.length ? { variants } : {}),
  };
};
const ServiceInformation = ({
  productDetailsData,
  productUpdate,
  handleModalClose,
  isSmall,
}) => {
  const theme = useTheme();
  const [wishListCount, setWishListCount] = useState(
    productDetailsData?.whislists_count ?? 0,
  );
  const { cartList: aliasCartList } = useSelector((state) => state.cart);
  const cartList = useMemo(
    () => getCartListModuleWise(aliasCartList),
    [aliasCartList],
  );
  const dispatchRedux = useDispatch();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();

  const actionCardRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const target = actionCardRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [state.modalData.length]);

  const { mutate, isLoading } = useAddCartItem();
  const { mutate: updateMutate, isLoading: updateIsLoading } =
    useCartItemUpdate();
  const { mutate: deleteMutate, isLoading: deleteIsLoading } =
    useDeleteCartItem();
  // Removing a variation entirely (no remaining variant qty changed) only
  // fires deleteMutate — without folding its own isLoading in, the Update
  // Cart button never shows a spinner for that specific edit.
  const isCartActionLoading = isLoading || updateIsLoading || deleteIsLoading;
  const { isLoading: cartLoading, isFetching: cartFetching } =
    useGetGroupedCart();

  useEffect(() => {
    handleInitialTotalPriceVarPriceQuantitySet(
      productDetailsData,
      dispatch,
      cartList,
      handleChoices,
    );
  }, [productDetailsData, cartList]);

  const handleChoices = (option, choice) => {
    const isVariationSelection = Array.isArray(option) && option.length > 0;
    // Each variation carries its own discount, independent of the service's
    // base discount — sum each variation's own discounted price rather than
    // discounting the raw total with the base discount.
    const computedPrice = isVariationSelection
      ? option.reduce(
          (sum, { variation, quantity }) =>
            sum +
            getDiscountedAmount(
              variation?.price ?? 0,
              variation?.discount,
              variation?.discount_type,
            ) *
              (quantity ?? 1),
          0,
        )
      : option?.price ??
        productDetailsData?.base_price ??
        productDetailsData?.price;

    if (cartList.length > 0) {
      const storeIdToMatch = productDetailsData?.store_id;
      const itemIsInCart = cartList.find(
        (item) =>
          item?.id === productDetailsData?.id &&
          JSON.stringify(item?.selectedOption?.[0]) ===
            JSON.stringify(option) &&
          (storeIdToMatch == null ||
            String(item?.store_id) === String(storeIdToMatch)),
      );
      if (itemIsInCart) {
        dispatch({
          type: ACTION.setModalData,
          payload: {
            ...itemIsInCart,
          },
        });
      } else {
        const hasSelection = Array.isArray(option)
          ? option.length > 0
          : !!option;
        dispatch({
          type: ACTION.setModalData,
          payload: {
            ...productDetailsData,
            selectedOption: hasSelection ? [option] : [],
            quantity: 1,
            price: computedPrice,
            totalPrice: computedPrice,
            // computedPrice already reflects each variation's own discount —
            // don't let the base service discount apply again downstream.
            ...(isVariationSelection && { discount: 0, discount_type: null }),
          },
        });
      }
    } else {
      const hasSelection = Array.isArray(option) ? option.length > 0 : !!option;
      dispatch({
        type: ACTION.setModalData,
        payload: {
          ...state.modalData[0],
          selectedOption: hasSelection ? [option] : [],
          price: computedPrice,
          totalPrice: computedPrice,
          quantity: 1,
          ...(isVariationSelection && { discount: 0, discount_type: null }),
        },
      });
    }
  };
  const decrementQuantity = () => {
    dispatch({ type: ACTION.decrementQuantity });
  };

  const incrementQuantity = () => {
    const currentStock = state.modalData[0]?.stock;
    // Services have no inventory stock; null/undefined means unlimited
    if (currentStock == null || currentStock > state.modalData[0]?.quantity) {
      if (productDetailsData?.maximum_cart_quantity) {
        if (
          productDetailsData?.maximum_cart_quantity >
          state.modalData[0]?.quantity
        ) {
          dispatch({ type: ACTION.incrementQuantity });
        } else {
          toast.error(t(out_of_limits));
        }
      } else {
        dispatch({ type: ACTION.incrementQuantity });
      }
    } else {
      toast.error(t(out_of_stock));
    }
  };
  const handleSuccess = (res) => {
    if (res) {
      if (res.length <= 1) {
        const item = res[0];
        if (item) {
          dispatchRedux(
            setCart({
              ...(item?.item ?? item?.service ?? {}),
              cartItemId: item?.id,
              quantity: item?.quantity,
              totalPrice: item?.price,
              selectedOption: item?.variation,
            }),
          );
        }
      }
      //alert("Item added to cart");
      // dispatchRedux(setCartSidebarOpen(true));
      toast.success(t("Item added to cart"));
      handleModalClose?.();
    }
  };
  const handleAddToCartOnDispatch = () => {
    const itemObject = getItemObject(state?.modalData[0]);
    mutate(
      {
        postData: itemObject,
        store_id: state?.modalData[0]?.store_id ?? productDetailsData?.store_id,
      },
      {
        onSuccess: handleSuccess,
        onError: onErrorResponse,
      },
    );
  };

  const addToCard = () => {
    handleAddToCartOnDispatch();
  };

  const updateCartSuccessHandler = (res) => {
    if (res) {
      const pp = res?.map((item) => {
        const newItem = {
          ...(item?.item ?? item?.service ?? {}),
          cartItemId: item?.id,
          quantity: item?.quantity,
          totalPrice: item?.price,
          selectedOption: item?.variation,
        };

        return newItem;
      });
      dispatchRedux(setCartList(pp));
      toast.success(t(product_update_to_cart_message));
      handleModalClose?.();
    }
  };
  const handleUpdateToCart = (cartItem) => {
    const resolvedStoreId = productDetailsData?.provider?.id;
    if (
      JSON.stringify(productDetailsData) === JSON.stringify(state.modalData[0])
    ) {
      toast(t(update_error_text), {
        icon: "⚠️",
      });
    } else {
      const hasVariation = productDetailsData?.variations?.length > 0;
      const storeIdToMatch = productDetailsData?.store_id;

      let cartItemObject = {};

      if (hasVariation) {
        const itemObject = getItemObject(state?.modalData[0]);
        const newSelections = state?.modalData[0]?.selectedOption?.[0] ?? [];
        const newVariantMap = new Map(
          newSelections.map(({ variation, quantity }) => [
            identifyVariant(variation),
            quantity,
          ]),
        );

        const oldCartItems = cartList.filter(
          (item) =>
            item?.id === productDetailsData?.id && item?.selectedOption != null,
        );
        const prevVariantMap = new Map(
          oldCartItems.map((c) => [
            identifyVariant(c.selectedOption),
            c.quantity,
          ]),
        );

        // Nothing changed at all — skip all API calls
        const nothingChanged =
          newVariantMap.size === prevVariantMap.size &&
          [...newVariantMap.entries()].every(
            ([key, qty]) => prevVariantMap.get(key) === qty,
          );
        if (nothingChanged) {
          toast(t(update_error_text), { icon: "⚠️" });
          return;
        }

        // Delete removed variants
        oldCartItems.forEach((oldItem) => {
          if (!newVariantMap.has(identifyVariant(oldItem.selectedOption))) {
            deleteMutate({
              cart_id: oldItem.cartItemId,
              store_id: oldItem.store_id ?? oldItem.store?.id,
            });
          }
        });

        // Only call add API if any remaining variant is new or changed qty
        const hasChangedVariants = newSelections.some(
          ({ variation, quantity }) => {
            const prevQty = prevVariantMap.get(identifyVariant(variation));
            return prevQty === undefined || prevQty !== quantity;
          },
        );

        if (hasChangedVariants) {
          mutate(
            {
              postData: itemObject,
              store_id:
                state?.modalData[0]?.store_id ?? productDetailsData?.store_id,
            },
            {
              onSuccess: handleSuccess,
              onError: onErrorResponse,
            },
          );
        }

        if (productUpdate) {
          handleModalClose?.();
        }
        return;
      } else {
        const itemIsInCart = cartList.find(
          (item) =>
            item?.id === productDetailsData?.id &&
            JSON.stringify(item?.selectedOption?.[0]) ===
              JSON.stringify(state.modalData[0]?.selectedOption?.[0]) &&
            (storeIdToMatch == null ||
              String(item?.store_id) === String(storeIdToMatch)),
        );
        cartItemObject = {
          cart_id: itemIsInCart?.cartItemId,
          guest_id: getGuestId(),
          model: state.modalData[0]?.available_date_starts
            ? "ItemCampaign"
            : "Service",
          service_id: state.modalData[0]?.id,
          price: state.modalData[0]?.totalPrice,
          quantity: state.modalData[0]?.quantity,
          store_id:
            resolvedStoreId ??
            itemIsInCart?.store_id ??
            itemIsInCart?.store?.id,
        };
      }
      updateMutate(cartItemObject, {
        onSuccess: updateCartSuccessHandler,
        onError: onErrorResponse,
      });
      if (productUpdate) {
        handleModalClose?.();
      }
    }
  };

  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const { mutate: addFavoriteMutation } = useAddToWishlist();
  const addToFavorite = () => {
    if (token) {
      addFavoriteMutation(productDetailsData?.id, {
        onSuccess: (response) => {
          if (response) {
            dispatchRedux(addWishList(productDetailsData));
            toast.success(response?.message);
            setWishListCount(wishListCount + 1);
          }
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error(t(not_logged_in_message));
  };

  const topInformation = () => {
    return (
      <CustomStackFullWidth
        spacing={0.5}
        padding={{
          xs: "0px 8px 0px 8px",
          sm: "10px 20px 10px 20px",
          md: "0px",
        }}
      >
        {state.modalData[0]?.name ? (
          <CustomStackFullWidth
            direction="row"
            alignItems="center"
            spacing={{ xs: 1, sm: 1.5 }}
            marginTop={{ xs: "6px", sm: "4px" }}
          >
            <Typography
              data-product-name=""
              sx={{
                fontSize: { xs: "18px", sm: "22px", md: "24px" },
                fontWeight: 700,
                lineHeight: 1.25,
                color: (theme) => theme.palette.text.primary,
              }}
              component="h1"
            >
              {state.modalData[0]?.name}
            </Typography>
          </CustomStackFullWidth>
        ) : (
          <Skeleton width={100} variant="text" />
        )}
        {Number(productDetailsData?.avg_rating) > 0 &&
          Number(productDetailsData?.rating_count) > 0 && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mt: 0.5 }}
            >
              <i
                className="fi fi-sr-star"
                style={{
                  color: theme.palette.warning.main,
                  fontSize: "14px",
                  display: "flex",
                  lineHeight: 1,
                }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "13px", md: "14px" },
                  color: theme.palette.text.primary,
                }}
              >
                {productDetailsData?.avg_rating?.toFixed(1)}
              </Typography>
              <Typography
                onClick={() =>
                  document
                    .getElementById("service-reviews-section")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                sx={{
                  fontSize: { xs: "13px", md: "14px" },
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                ({productDetailsData?.rating_count} {t("Reviews")})
              </Typography>
            </Stack>
          )}

        <CategoryInformation
          categories={[
            state?.modalData?.[0]?.category,
            state?.modalData?.[0]?.sub_category,
          ].filter(Boolean)}
          isSmall={isSmall}
        />

        <PricePreviewWithStock
          theme={theme}
          productDetailsData={productDetailsData}
        />
      </CustomStackFullWidth>
    );
  };

  return (
    <>
      {state.modalData.length > 0 && (
        <CustomStackFullWidth spacing={2}>
          {topInformation()}

          <Box
            ref={actionCardRef}
            sx={{
              display: { xs: "none", md: "block" },
              p: { xs: 2, md: 2.5 },
              borderRadius: "12px",
              border: (theme) =>
                `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
              backgroundColor: (theme) => theme.palette.background.paper,
            }}
          >
            <Stack
              direction={
                productDetailsData?.variations?.length > 0 ? "column" : "row"
              }
              alignItems={
                productDetailsData?.variations?.length > 0
                  ? "stretch"
                  : "center"
              }
              justifyContent="space-between"
              spacing={1.5}
            >
              <Box
                sx={{
                  order: productDetailsData?.variations?.length > 0 ? 0 : 1,
                }}
              >
                {productDetailsData?.variations?.length > 0 ? (
                  <ServiceVariation
                    variations={productDetailsData.variations}
                    selectedVariation={state.modalData[0]?.selectedOption?.[0]}
                    onSelectVariation={(variation) => {
                      handleChoices(variation, null);
                    }}
                    cartLoading={cartLoading}
                  />
                ) : (
                  <IncrementDecrementManager
                    decrementQuantity={decrementQuantity}
                    incrementQuantity={incrementQuantity}
                    modalData={state?.modalData[0]}
                    productUpdate={productUpdate}
                  />
                )}
              </Box>
              <Stack
                direction={
                  productDetailsData?.variations?.length > 0 ? "row" : "column"
                }
                alignItems="start"
                justifyContent="space-between"
                sx={{
                  order: productDetailsData?.variations?.length > 0 ? 1 : 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "14px", md: "16px" },
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {t("Total")}
                </Typography>
                <TotalPrice
                  totalPrice={state.modalData[0]?.totalPrice}
                  discount={state.modalData[0]?.discount}
                  discount_type={state.modalData[0]?.discount_type}
                  store_discount={state.modalData[0]?.store_discount}
                  quantity={state.modalData[0]?.quantity}
                />
              </Stack>
            </Stack>
            <Box sx={{ mt: 1.75 }}>
              <ServiceInformationBottomSection
                addToCard={addToCard}
                handleUpdateToCart={handleUpdateToCart}
                productUpdate={productUpdate}
                productDetailsData={state.modalData[0]}
                t={t}
                handleModalClose={handleModalClose}
                isLoading={isCartActionLoading}
              />
            </Box>
          </Box>

          <StickyCartBar
            visible={showStickyBar}
            modalData={state.modalData[0]}
            variations={productDetailsData?.variations}
            selectedVariation={state.modalData[0]?.selectedOption}
            decrementQuantity={decrementQuantity}
            incrementQuantity={incrementQuantity}
            addToCard={addToCard}
            handleUpdateToCart={handleUpdateToCart}
            onSelectVariation={(variation) => handleChoices(variation, null)}
            productUpdate={productUpdate}
            isLoading={isCartActionLoading}
            updateIsLoading={updateIsLoading}
            cartLoading={cartLoading}
          />
        </CustomStackFullWidth>
      )}
    </>
  );
};

export default ServiceInformation;
