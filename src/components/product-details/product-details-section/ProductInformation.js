import { Skeleton, Typography, useTheme } from "@mui/material";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { Stack } from "@mui/system";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import IncrementDecrementManager from "./IncrementDecrementManager";
import ProductInformationBottomSection from "./ProductInformationBottomSection";
import VariationsManager from "./VariationsManager";
import { Box } from "@mui/system";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { getModuleId } from "helper-functions/getModuleId";
import {
  getStoreRedirectURL,
  handleStoreRedirect,
} from "helper-functions/handleStoreRedirect";
import { useTranslation } from "react-i18next";
import { getGuestId } from "helper-functions/getToken";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setCartList } from "redux/slices/cart";
import { setCartSidebarOpen } from "redux/slices/utils";
import { addWishList } from "redux/slices/wishList";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import {
  not_logged_in_message,
  out_of_limits,
  out_of_stock,
  product_update_to_cart_message,
  update_error_text,
} from "utils/toasterMessages";
import useAddCartItem from "../../../api-manage/hooks/react-query/add-cart/useAddCartItem";
import useCartItemUpdate from "../../../api-manage/hooks/react-query/add-cart/useCartItemUpdate";
import CustomModal from "../../modal";
import { ReadMore } from "../../ReadMore";
import CustomRatings from "../../search/CustomRatings";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";
import ProductHalalSvg from "components/cards/assets/ProductHalalSvg";
import ProductVegSvg from "components/cards/assets/ProductVegSvg";
import ProductNonVegSvg from "components/cards/assets/ProductNonVegSvg";
import ProductOrganicSvg from "components/cards/assets/ProductOrganicSvg";
import BadgeWithTooltip from "components/common/BadgeWithTooltip";
import CategoryInformation from "../CategoryInformation";
import InStockTag from "../InStockTag";
import CartClearModal from "./CartClearModal";
import {
  getAvailableStock,
  handleInitialTotalPriceVarPriceQuantitySet,
  isVariationAvailable,
} from "./helperFunction";
import PricePreviewWithStock from "./PricePreviewWithStock";
import { ACTION, initialState, reducer } from "./states";
import { alpha } from "@mui/material";
import StickyCartBar from "./StickyCartBar";

export const getItemObject = (productData) => {
  return {
    guest_id: getGuestId(),
    model: productData?.available_date_starts ? "ItemCampaign" : "Item",
    add_on_ids: [],
    add_on_qtys: [],
    item_id: productData?.id,
    price: productData?.totalPrice,
    quantity: productData?.quantity,
    variation: productData?.selectedOption,
  };
};
const ProductInformation = ({
  productDetailsData,
  configData,
  productUpdate,
  handleModalClose,
  modalmanage,
  imageSrcUrl,
  isSmall,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const [wishListCount, setWishListCount] = useState(
    productDetailsData?.whislists_count
  );
  const currentLocation = JSON.parse(localStorage.getItem("currentLatLng"));
  const [clearCartModal, setClearCartModal] = React.useState(false);
  const { cartList: aliasCartList } = useSelector((state) => state.cart);
  //this aliasCartList has been added so that we can use cartList as per module wise.
  const cartList = getCartListModuleWise(aliasCartList);
  const dispatchRedux = useDispatch();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();
  console.log({ cartList });

  const actionCardRef = useRef(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const target = actionCardRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [state.modalData.length]);

  const { showLowStockCount, minimumStockForWarning } = useMemo(() => {
    const store = productDetailsData?.store_details;
    return {
      showLowStockCount: Number(store?.show_low_stock_count) === 1,
      minimumStockForWarning: Number(store?.minimum_stock_for_warning) || 0,
    };
  }, [productDetailsData?.store_details]);

  const renderStockBadge = (product) => {
    if (!isVariationAvailable(product)) return null;
    const availableStock = getAvailableStock(product);
    if (availableStock <= 0) return null;
    const cartQuantity = product?.quantity || 0;
    const currentStock = Math.max(
      0,
      (availableStock > 1 ? availableStock - 1 : availableStock) -
        (cartQuantity - 1)
    );
    console.log({ currentStock, availableStock });

    const showWarning =
      showLowStockCount && minimumStockForWarning >= currentStock;
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        {showWarning ? <RemainingStock qty={currentStock} /> : <InStockTag />}
      </Stack>
    );
  };
  const { mutate, isLoading } = useAddCartItem();
  const { mutate: updateMutate, isLoading: updateIsLoading } =
    useCartItemUpdate();
  const handleClearCartModalOpen = () => setClearCartModal(true);

  const handleClose = (value) => {
    if (value === "add-item") {
      const itemObject = getItemObject(state?.modalData[0]);
      mutate(
        { postData: itemObject, store_id: state?.modalData[0]?.store_id },
        {
          onSuccess: handleSuccess,
          onError: onErrorResponse,
        }
      );
    } else {
      setClearCartModal(false);
    }
  };

  useEffect(() => {
    handleInitialTotalPriceVarPriceQuantitySet(
      productDetailsData,
      dispatch,
      cartList,
      handleChoices,
      state.selectedOptions,
      state.modalData
    );
  }, [productDetailsData]);

  const handleChoices = (option, choice) => {
    if (cartList.length > 0) {
      // Scope the lookup to the current store so multi-store carts don't
      // cross-pollinate variation state between same-id products.
      const storeIdToMatch = productDetailsData?.store_id;
      const itemIsInCart = cartList.find(
        (item) =>
          item?.id === productDetailsData?.id &&
          JSON.stringify(item?.selectedOption?.[0]) ===
            JSON.stringify(option) &&
          (storeIdToMatch == null ||
            String(item?.store_id) === String(storeIdToMatch))
      );
      if (itemIsInCart) {
        dispatch({
          type: ACTION.setModalData,
          payload: {
            ...itemIsInCart,
          },
        });
      } else {
        dispatch({
          type: ACTION.setModalData,
          payload: {
            ...productDetailsData,
            selectedOption: [option],
            quantity: 1,
            price: option.price,
            totalPrice: option.price,
          },
        });
      }
    } else {
      dispatch({
        type: ACTION.setModalData,
        payload: {
          ...state.modalData[0],
          selectedOption: [option],
          price: option?.price,
          totalPrice: option?.price,
          quantity: 1,
        },
      });
    }
  };
  const decrementQuantity = () => {
    dispatch({ type: ACTION.decrementQuantity });
  };
  console.log("ddd", cartList);

  const incrementQuantity = () => {
    const modalItem = state.modalData[0];
    // Use variation-aware stock: if a variation is selected and has stock=0,
    // getAvailableStock returns 0 (variation stock), not the base product stock.
    const availableStock = getAvailableStock(modalItem);
    if (!isVariationAvailable(modalItem) || availableStock <= 0) {
      toast.error(t(out_of_stock), { id: "out-of-stock" });
      return;
    }
    if (availableStock > modalItem?.quantity) {
      if (productDetailsData?.maximum_cart_quantity) {
        if (productDetailsData?.maximum_cart_quantity > modalItem?.quantity) {
          dispatch({ type: ACTION.incrementQuantity });
        } else {
          toast.error(t(out_of_limits), { id: "out-of-limits" });
        }
      } else {
        dispatch({ type: ACTION.incrementQuantity });
      }
    } else {
      toast.error(t(out_of_stock), { id: "out-of-stock" });
    }
  };
  const handleSuccess = (res) => {
    console.log({ res });

    if (res) {
      let product = {};
      res?.forEach((item) => {
        product = {
          ...item?.item,
          cartItemId: item?.id,
          quantity: item?.quantity,
          totalPrice: item?.price,
          selectedOption: item?.variation,
        };
      });
      console.log({ product });

      dispatchRedux(
        setCart({
          ...product,
        })
      );
      //alert("Item added to cart");
      // dispatchRedux(setCartSidebarOpen(true));
      toast.success(t("Item added to cart"));
      handleModalClose?.();
      setClearCartModal(false);
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
      }
    );
  };

  const addToCard = () => {
    //handleAddToCartOnDispatch();
    if (cartList?.length > 0) {
      // Multi-store carts allowed — always proceed with add.
      const isStoreExist = true;
      if (isStoreExist) {
        handleAddToCartOnDispatch();
      } else {
        if (cartList.length !== 0) {
          handleClearCartModalOpen();
        }
      }
    } else {
      handleAddToCartOnDispatch();
    }
  };

  const updateCartSuccessHandler = (res) => {
    if (res) {
      const pp = res?.map((item) => {
        const newItem = {
          ...item?.item,
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
    if (
      JSON.stringify(productDetailsData) === JSON.stringify(state.modalData[0])
    ) {
      toast(t(update_error_text), {
        icon: "⚠️",
      });
    } else {
      // Detail APIs return store id in different shapes — flat `store_id`,
      // nested `store.id`, or only present on the cart-list snapshot. Resolve
      // through every candidate so the update call never goes out without one.
      const resolvedStoreId =
        productDetailsData?.store_id ??
        productDetailsData?.store?.id ??
        state.modalData?.[0]?.store_id ??
        state.modalData?.[0]?.store?.id;
      const itemIsInCart = cartList.find(
        (item) =>
          item?.id === productDetailsData?.id &&
          JSON.stringify(item?.selectedOption?.[0]) ===
            JSON.stringify(state.modalData[0]?.selectedOption?.[0]) &&
          (resolvedStoreId == null ||
            String(item?.store_id) === String(resolvedStoreId))
      );
      const cartItemObject = {
        cart_id: itemIsInCart?.cartItemId,
        guest_id: getGuestId(),
        model: state.modalData[0]?.available_date_starts
          ? "ItemCampaign"
          : "Item",
        add_on_ids: [],
        add_on_qtys: [],
        item_id: state.modalData[0]?.id,
        price: state.modalData[0]?.totalPrice,
        quantity: state.modalData[0]?.quantity,
        variation: state.modalData[0]?.selectedOption,
        store_id:
          resolvedStoreId ?? itemIsInCart?.store_id ?? itemIsInCart?.store?.id,
      };
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
  console.log({ state });

  const isInModal = modalmanage === "true" || modalmanage === true;

  const topInformation = () => {
    return (
      <CustomStackFullWidth
        spacing={1}
        padding={{
          xs: isInModal ? "0px" : "0px 8px 0px 8px",
          sm: "10px 20px 10px 20px",
          md: "0px",
        }}
      >
        {/* Store name row — verified badge / logo + name */}
        {(state.modalData[0]?.store_name || productDetailsData?.store_name) &&
          router?.pathname !== "/store/[id]" &&
          (() => {
            const storeData = state.modalData[0]?.store_details || {
              id: productDetailsData?.store_id,
              slug: productDetailsData?.store_slug,
            };
            const canRedirect = !!(storeData?.slug || storeData?.id);
            return (
              <Stack
                direction="row"
                alignItems="center"
                gap="4px"
                sx={{ overflow: "hidden", minWidth: 0 }}
              >
                {state.modalData[0]?.store_details?.verified_seller ??
                state.modalData[0]?.verified_seller ??
                productDetailsData?.store_details?.verified_seller ??
                productDetailsData?.verified_seller ? (
                  <VerifiedStoreBadge verified fontSize="14px" />
                ) : state.modalData[0]?.store_details?.logo_full_url ? (
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      overflow: "hidden",
                      flexShrink: 0,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <img
                      src={state.modalData[0]?.store_details?.logo_full_url}
                      alt={state.modalData[0]?.store_name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Box>
                ) : null}
                <Typography
                  onClick={
                    canRedirect
                      ? (e) => {
                          e.stopPropagation();
                          handleStoreRedirect(storeData, router);
                        }
                      : undefined
                  }
                  sx={{
                    fontSize: "12px",
                    color: "neutral.500",
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: 0,
                    cursor: canRedirect ? "pointer" : "default",
                    "&:hover": canRedirect
                      ? { color: "neutral.400" }
                      : undefined,
                    transition: "color 0.15s ease",
                  }}
                >
                  {state.modalData[0]?.store_name ||
                    productDetailsData?.store_name}
                </Typography>
              </Stack>
            );
          })()}
        {state.modalData[0]?.name ? (
          <CustomStackFullWidth
            direction="row"
            alignItems="center"
            spacing={{ xs: 1, sm: 1.5 }}
            sx={{
              position: "sticky",
              top: -14,
              zIndex: 5,
              backgroundColor: theme.palette.background.paper,
              py: { xs: 0.75, sm: 1 },
            }}
          >
            <Typography
              data-product-name=""
              sx={{
                fontSize: { xs: "18px", sm: "22px", md: "24px" },
                fontWeight: 700,
                lineHeight: 1.25,
                color: "neutral.1050",
              }}
              component="h1"
            >
              {state.modalData[0]?.name}
            </Typography>
            {renderStockBadge(state.modalData[0])}
          </CustomStackFullWidth>
        ) : (
          <Skeleton width={100} variant="text" />
        )}
        {(state.modalData[0]?.module_type === "pharmacy" ||
          state.modalData[0]?.module?.module_type === "pharmacy") &&
          state.modalData[0]?.generic_name?.[0] && (
            <Typography
              fontSize={{ xs: "12px", sm: "12px" }}
              fontWeight="400"
              color="customColor.textGray"
              component="h2"
            >
              {state.modalData[0]?.generic_name?.[0]}
            </Typography>
          )}

        {!state.modalData[0]?.isCampaignItem &&
          Number(state.modalData[0]?.avg_rating) > 0 &&
          Number(state.modalData[0]?.rating_count) > 0 && (
            <Stack direction="row" alignItems="center" gap="4px">
              <i
                className="fi fi-sr-star"
                style={{
                  color:
                    theme.palette.customColor?.starAmber ??
                    theme.palette.warning.main,
                  fontSize: "13px",
                  display: "flex",
                  lineHeight: 1,
                }}
              />
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "neutral.1050",
                  lineHeight: 1.3,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Number(state.modalData[0]?.avg_rating).toFixed(1)}
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "neutral.500",
                  lineHeight: 1.2,
                  letterSpacing: "-0.36px",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                ({state.modalData[0]?.rating_count} {t("Reviews")})
              </Typography>
            </Stack>
          )}

        {state.modalData[0]?.unit_type && (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Typography
              sx={{
                fontSize: { xs: "13px", md: "14px" },
                color: theme.palette.text.secondary,
              }}
            >
              {t("Unit")} :
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "13px", md: "14px" },
                fontWeight: 600,
                color: theme.palette.text.primary,
              }}
            >
              {state.modalData[0]?.unit_type}
            </Typography>
          </Stack>
        )}

        <PricePreviewWithStock
          state={state}
          theme={theme}
          productDetailsData={productDetailsData}
        />

        {/* Discount + free delivery + halal + veg/non-veg badges — right after price */}
        {(() => {
          const item = state.modalData[0];
          const showDiscount = productDetailsData?.discount > 0;
          const showFreeDelivery =
            !!productDetailsData?.store_details?.free_delivery;
          const showHalal = !!item?.halal_tag_status && !!item?.is_halal;
          const showOrganic = !!item?.organic;
          const showVeg =
            (item?.module_type === "food" ||
              item?.module?.module_type === "food") &&
            !!configData?.toggle_veg_non_veg;
          if (
            !showDiscount &&
            !showFreeDelivery &&
            !showHalal &&
            !showOrganic &&
            !showVeg
          )
            return null;
          return (
            <Stack
              direction="row"
              alignItems="center"
              gap="4px"
              flexWrap="wrap"
            >
              {showDiscount && (
                <Box
                  sx={{
                    backgroundColor: "error.danger",
                    borderRadius: "24px",
                    px: "6px",
                    py: "2px",
                    display: "inline-flex",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {productDetailsData?.discount_type === "percent"
                      ? `-${productDetailsData?.discount}%`
                      : `-${getAmountWithSign(productDetailsData?.discount)}`}
                  </Typography>
                </Box>
              )}
              {showFreeDelivery && (
                <Box
                  sx={{
                    backgroundColor: "error.dangerLight",
                    borderRadius: "24px",
                    px: "6px",
                    py: "2px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className="fi fi-rs-biking-mountain"
                    style={{
                      fontSize: "12px",
                      lineHeight: 1,
                      display: "flex",
                      color: theme.palette.error.dangerText,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "error.dangerText",
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t("Free")}
                  </Typography>
                </Box>
              )}
              {showOrganic && (
                <BadgeWithTooltip title={t("Organic")}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: "background.paper",
                      border: `1px solid ${theme.palette.divider}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      padding: "3px",
                    }}
                  >
                    <ProductOrganicSvg
                      color={theme.palette.customColor?.vegIcon}
                    />
                  </Box>
                </BadgeWithTooltip>
              )}
              {showHalal && (
                <BadgeWithTooltip title={t("This product is Halal")}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: "background.paper",
                      border: `1px solid ${theme.palette.divider}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      padding: "3px",
                    }}
                  >
                    <ProductHalalSvg />
                  </Box>
                </BadgeWithTooltip>
              )}
              {showVeg && (
                <BadgeWithTooltip title={item?.veg ? t("Veg") : t("Non Veg")}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: "background.paper",
                      border: `1px solid ${theme.palette.divider}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      padding: "3px",
                    }}
                  >
                    {item?.veg ? (
                      <ProductVegSvg
                        color={theme.palette.customColor?.vegIcon}
                      />
                    ) : (
                      <ProductNonVegSvg />
                    )}
                  </Box>
                </BadgeWithTooltip>
              )}
            </Stack>
          );
        })()}

        {(state.modalData[0]?.module_type === "pharmacy" ||
          state.modalData[0]?.module?.module_type === "pharmacy") &&
          (() => {
            const item = state.modalData[0];
            const company =
              item?.brand?.name ||
              item?.manufacturer_name ||
              item?.company_name;
            const unit = item?.unit_type;
            const perUnit = item?.per_unit;
            const categoryNames = item?.category_ids
              ?.map((c) => c?.name)
              ?.filter(Boolean)
              ?.join(" › ");
            const genericName = Array.isArray(item?.generic_name)
              ? item.generic_name.filter(Boolean).join(", ")
              : item?.generic_name;

            const rows = [
              company && { label: t("Company"), value: company },
              unit && { label: t("Unit"), value: unit },
              perUnit && {
                label: `${t("Per")} ${unit || t("Unit")}`,
                value: perUnit,
              },
              categoryNames && {
                label: t("Category"),
                value: categoryNames,
              },
              genericName && {
                label: t("Generic Name"),
                value: genericName,
              },
            ].filter(Boolean);

            if (rows.length === 0) return null;

            return (
              <Stack
                spacing={0.75}
                sx={{
                  mt: 1,
                  p: { xs: 1.25, md: 1.5 },
                  borderRadius: "10px",
                  border: `1px solid ${alpha(
                    theme.palette.text.primary,
                    0.08
                  )}`,
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                {rows.map((row, idx) => (
                  <Stack
                    key={idx}
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "13px", md: "14px" },
                        color: theme.palette.text.secondary,
                        minWidth: { xs: "100px", md: "120px" },
                      }}
                    >
                      {row.label} :
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "13px", md: "14px" },
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        flex: 1,
                      }}
                    >
                      {row.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            );
          })()}

        {modalmanage === "true" && state?.modalData?.[0]?.description ? (
          <Typography
            sx={{
              fontSize: { xs: "13px", md: "14px" },
              color: theme.palette.neutral[400],
              lineHeight: 1.5,
              whiteSpace: "pre-line",
            }}
          >
            {state.modalData[0].description}
          </Typography>
        ) : null}
        {state?.modalData[0]?.nutritions_name?.length > 0 && (
          <>
            <Typography fontSize="14px" fontWeight="500" mt="5px">
              {t("Nutrition Details")}
            </Typography>

            <Stack direction="row" spacing={0.5}>
              {state?.modalData[0]?.nutritions_name?.map((item, index) => (
                <Typography
                  fontSize="12px"
                  key={index}
                  color={theme.palette.neutral[400]}
                >
                  {item}
                  {index !== state?.modalData[0]?.nutritions_name.length - 1
                    ? ","
                    : "."}
                </Typography>
              ))}
            </Stack>
          </>
        )}
        {state?.modalData[0]?.allergies_name?.length > 0 && (
          <>
            <Typography fontSize="14px" fontWeight="500" mt="5px">
              {t("Allergic Ingredients")}
            </Typography>

            <Stack direction="row" spacing={0.5}>
              {state?.modalData[0]?.allergies_name?.map((item, index) => (
                <Typography
                  fontSize="12px"
                  key={index}
                  color={theme.palette.neutral[400]}
                >
                  {item}
                  {index !== state?.modalData[0]?.allergies_name.length - 1
                    ? ","
                    : "."}
                </Typography>
              ))}
            </Stack>
          </>
        )}
      </CustomStackFullWidth>
    );
  };

  return (
    <>
      {state.modalData.length > 0 && (
        <CustomStackFullWidth spacing={2}>
          {topInformation()}

          {state.modalData[0]?.variations?.length > 0 && (
            <VariationsManager
              productDetailsData={state.modalData[0]}
              handleChoices={handleChoices}
            />
          )}

          {modalmanage !== "true" && (
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
              <IncrementDecrementManager
                decrementQuantity={decrementQuantity}
                incrementQuantity={incrementQuantity}
                modalData={state?.modalData[0]}
                productUpdate={productUpdate}
              />
              <Box sx={{ mt: 1.75 }}>
                <ProductInformationBottomSection
                  addToCard={addToCard}
                  handleUpdateToCart={handleUpdateToCart}
                  productDetailsData={state.modalData[0]}
                  selectedOptions={state?.selectedOptions}
                  dispatchRedux={dispatchRedux}
                  addToFavorite={addToFavorite}
                  wishListCount={wishListCount}
                  setWishListCount={setWishListCount}
                  cartItemQuantity={state?.modalData[0]?.quantity}
                  t={t}
                  handleModalClose={handleModalClose}
                  isLoading={isLoading}
                  addToCartMutate={mutate}
                  updateIsLoading={updateIsLoading}
                />
              </Box>
            </Box>
          )}

          {isSmall && (
            <CustomStackFullWidth>
              <CategoryInformation
                tags={state?.modalData?.[0]?.tags}
                categories={state?.modalData?.[0]?.category_ids}
              />
            </CustomStackFullWidth>
          )}

          <CustomModal openModal={clearCartModal} handleClose={handleClose}>
            <CartClearModal
              handleClose={handleClose}
              dispatchRedux={dispatchRedux}
            />
          </CustomModal>

          <StickyCartBar
            visible={showStickyBar}
            modalData={state.modalData[0]}
            decrementQuantity={decrementQuantity}
            incrementQuantity={incrementQuantity}
            addToCard={addToCard}
            handleUpdateToCart={handleUpdateToCart}
            isLoading={isLoading}
            updateIsLoading={updateIsLoading}
            modalmanage={modalmanage}
          />
        </CustomStackFullWidth>
      )}
    </>
  );
};

const RemainingStock = ({ qty = 0 }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        padding: "3px 10px",
        backgroundColor: (theme) => alpha(theme.palette.info.blue, 0.1),
        color: (theme) => alpha(theme.palette.info.blue, 1),
        fontSize: "12px",
        borderRadius: "5px",
        fontWeight: "400",
        textAlign: "center",
      }}
    >
      {t("Only")} {qty} {t("Products Left")}
    </Box>
  );
};

export default ProductInformation;
