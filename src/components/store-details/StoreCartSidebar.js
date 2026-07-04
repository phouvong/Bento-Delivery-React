import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogContent,
  IconButton,
  Popover,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  alpha,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CustomSwitch } from "components/header/NavBar.style";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import StarIcon from "@mui/icons-material/Star";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import { getCartListModuleWise } from "../../helper-functions/getCartListModuleWise";
import { getCurrentModuleType } from "../../helper-functions/getCurrentModuleType";
import { ModuleTypes } from "../../helper-functions/moduleTypes";
import {
  cartItemsTotalAmount,
  getTotalVariationsPrice,
} from "../../utils/CustomFunctions";
import {
  cart_item_remove,
  out_of_limits,
  out_of_stock,
  not_logged_in_message,
} from "../../utils/toasterMessages";
import {
  setCartPrefs,
  setClearCart,
  setDecrementToCartItem,
  setIncrementToCartItem,
  setRemoveItemFromCart,
} from "../../redux/slices/cart";
import useDeleteCartItem from "../../api-manage/hooks/react-query/add-cart/useDeleteCartItem";
import useCartItemUpdate from "../../api-manage/hooks/react-query/add-cart/useCartItemUpdate";
import useClearCart from "../../api-manage/hooks/react-query/add-cart/useClearCart";
import { onErrorResponse } from "../../api-manage/api-error-response/ErrorResponses";
import { getItemDataForAddToCart } from "../product-details/product-details-section/helperFunction";
import VariationContent from "../added-cart-view/VariationContent";
import CartIcon from "../added-cart-view/assets/CartIcon";
import CustomDialogConfirm from "../custom-dialog/confirm/CustomDialogConfirm";
import { PrimaryButton } from "../Map/map.style";
import { getToken } from "../../helper-functions/getToken";
import ProPlanBanner from "../pro-plan/ProPlanBanner";
import ProSavingsBanner from "../pro-plan/ProSavingsBanner";
import useGetSuggestedItems from "../../api-manage/hooks/react-query/product-details/useGetSuggestedItems";
import useGetProActiveOffer from "../../api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import useSubscribeProPlan from "../../api-manage/hooks/react-query/pro-plans/useSubscribeProPlan";
import NewProductCard from "components/cards/newCard/NewProductCard";
import prescription from "../store-details/assets/Frame.png";
import CartTotalPrice from "components/added-cart-view/CartTotalPrice";

const ProPlanSubscriptionModal = dynamic(() =>
  import("../pro-plan/ProPlanSubscriptionModal")
);
const ProPlanPaymentModal = dynamic(() =>
  import("../pro-plan/ProPlanPaymentModal")
);

const FoodDetailModal = dynamic(() =>
  import("../food-details/foodDetail-modal/FoodDetailModal")
);
const ModuleModal = dynamic(() => import("../cards/ModuleModal"));
const AuthModal = dynamic(() => import("../auth/AuthModal"));
const GuestCheckoutModal = dynamic(() => import("../cards/GuestCheckoutModal"));

const SidebarSurface = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 70,
  overflow: "visible",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  [theme.breakpoints.up("md")]: {
    maxHeight: "calc(100vh - 90px)",
    padding: "12px",
    margin: "-12px",
  },
}));
const SidebarPrescriptionCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: "0px 0px 16px -1px rgba(0,0,0,0.1)",
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
  flexDirection: "row",
  alignItems: "center",
  gap: "14px",
  padding: "16px 20px",
  "& .prescription-icon": {
    transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
}));
const SidebarCartLayout = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: "0px 0px 16px -1px rgba(0,0,0,0.1)",
  overflow: "clip",
  display: "flex",
  flexDirection: "column",
  maxHeight: "calc(100vh - 32px)",
}));

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

const CartItemRow = ({ cartItem }) => {
  const { configData } = useSelector((state) => state.configData);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const guestId =
    typeof window !== "undefined" ? localStorage.getItem("guest_id") : null;

  const { mutate: deleteMutate, isLoading: removeIsLoading } =
    useDeleteCartItem();
  const { mutate: updateMutate, isLoading } = useCartItemUpdate();

  const onIncrementSuccess = (res) => {
    if (res) {
      res?.forEach((item) => {
        if (cartItem?.cartItemId === item?.id) {
          const product = {
            ...item?.item,
            cartItemId: item?.id,
            totalPrice: item?.price,
            quantity: item?.quantity,
            food_variations: item?.item?.food_variations,
            selectedAddons: item?.item?.addons,
            itemBasePrice: item?.item?.price,
            selectedOption: item?.variation,
          };
          dispatch(setIncrementToCartItem(product));
        }
      });
    }
  };

  const onDecrementSuccess = (res) => {
    if (res) {
      res?.forEach((item) => {
        if (cartItem?.cartItemId === item?.id) {
          const product = {
            ...item?.item,
            cartItemId: item?.id,
            totalPrice: item?.price,
            quantity: item?.quantity,
            food_variations: item?.item?.food_variations,
            selectedAddons: item?.item?.addons,
            itemBasePrice: item?.item?.price,
            selectedOption: item?.variation,
          };
          dispatch(setDecrementToCartItem(product));
        }
      });
    }
  };

  const handleIncrement = () => {
    const updateQuantity = cartItem?.quantity + 1;
    const price =
      cartItem?.price + getTotalVariationsPrice(cartItem?.food_variations);
    const productPrice = price * updateQuantity;
    const mainPrice =
      getCurrentModuleType() === "food"
        ? productPrice
        : (cartItem?.selectedOption?.length > 0
            ? cartItem?.selectedOption?.[0]?.price
            : cartItem?.price) * updateQuantity;
    const itemObject = getItemDataForAddToCart(
      cartItem,
      updateQuantity,
      mainPrice,
      guestId
    );

    if (getCurrentModuleType() !== "food") {
      if (cartItem?.stock <= cartItem?.quantity) {
        toast.error(t(out_of_stock));
        return;
      }
      if (
        cartItem?.maximum_cart_quantity &&
        cartItem?.maximum_cart_quantity <= cartItem?.quantity
      ) {
        toast.error(t(out_of_limits), { id: "out-of-limits" });
        return;
      }
    } else if (
      cartItem?.maximum_cart_quantity &&
      cartItem?.maximum_cart_quantity <= cartItem?.quantity
    ) {
      toast.error(t(out_of_limits));
      return;
    }

    updateMutate(itemObject, {
      onSuccess: onIncrementSuccess,
      onError: onErrorResponse,
    });
  };

  const handleDecrement = () => {
    const updateQuantity = cartItem?.quantity - 1;
    const price =
      cartItem?.price + getTotalVariationsPrice(cartItem?.food_variations);
    const productPrice = price * updateQuantity;
    const mainPrice =
      getCurrentModuleType() === "food"
        ? productPrice
        : (cartItem?.selectedOption?.length > 0
            ? cartItem?.selectedOption?.[0]?.price
            : cartItem?.price) * updateQuantity;
    const itemObject = getItemDataForAddToCart(
      cartItem,
      updateQuantity,
      mainPrice,
      guestId
    );
    updateMutate(itemObject, {
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
  console.log({ cartItem });

  const quantity = Number(cartItem?.quantity) || 1;
  const isFood = cartItem?.module_type === ModuleTypes.FOOD;

  const optionsTotal = (cartItem?.selectedOption ?? []).reduce(
    (sum, o) =>
      o?.isSelected === false ? sum : sum + (Number(o?.optionPrice) || 0),
    0
  );

  const addonsTotal = (cartItem?.selectedAddons ?? []).reduce(
    (sum, a) => sum + (Number(a?.price) || 0) * (Number(a?.quantity) || 0),
    0
  );

  let unitPrice;
  if (isFood) {
    unitPrice = (Number(cartItem?.price) || 0) + optionsTotal;
  } else {
    const variationPrice = Number(cartItem?.selectedOption?.[0]?.price);
    unitPrice =
      Number.isFinite(variationPrice) && variationPrice > 0
        ? variationPrice
        : Number(cartItem?.price) || 0;
  }
  const discountValue = Number(cartItem?.discount) || 0;
  const discountPerUnit =
    cartItem?.discount_type === "percent" || cartItem?.discount_type === "fixed"
      ? (discountValue / 100) * unitPrice
      : discountValue;
  const discountedUnitPrice = Math.max(unitPrice - discountPerUnit, 0);

  const itemTotal = discountedUnitPrice * quantity + addonsTotal;

  const originalPrice = unitPrice * quantity + addonsTotal;
  const showStrike = originalPrice > itemTotal;

  return (
    <>
      <Stack
        sx={{
          py: 1,
          px: 1.5,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          "&:last-child": {
            borderBottom: "none",
          },
        }}
        spacing={0.75}
      >
        {/* Main row: Image | Info | Qty */}
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Box
            onClick={() => setUpdateModalOpen(true)}
            sx={{ cursor: "pointer", flexShrink: 0 }}
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

          {/* Qty stepper: −  N  + (or 🗑  N  + when qty=1) */}
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
                  style={{
                    fontSize: "20px",
                    lineHeight: 1,
                    color: "currentColor",
                  }}
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

        {/* Variation info below image */}
        <Box sx={{ pl: 0.5 }}>
          <VariationContent cartItem={cartItem} />
        </Box>
      </Stack>

      {updateModalOpen && cartItem?.module_type === "food" ? (
        <FoodDetailModal
          open={updateModalOpen}
          product={{
            ...cartItem,
            cart_id: cartItem?.cartItemId,
            add_ons: cartItem?.addons,
          }}
          handleModalClose={() => setUpdateModalOpen(false)}
          imageBaseUrl={configData?.base_urls?.item_image_url}
          productUpdate
        />
      ) : updateModalOpen ? (
        <ModuleModal
          open={updateModalOpen}
          handleModalClose={() => setUpdateModalOpen(false)}
          configData={configData}
          productDetailsData={{
            ...cartItem,
            cart_id: cartItem?.cartItemId,
          }}
          productUpdate
        />
      ) : null}
    </>
  );
};

const MonthlyOrderInfo = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const policyItems = [
    t(
      "Your selected items will be automatically added to your cart every month."
    ),
    t("Prices and availability may change based on current store updates"),
    t("If any item is unavailable, it may be removed"),
    t("You will receive a remainder notification before next order"),
    t("Your order will not be placed automatically without your confirmation"),
  ];

  const PopupContent = () => (
    <Stack spacing={2} sx={{ p: { xs: "16px", md: "14px 16px 10px" } }}>
      {isMobile && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            sx={{ fontSize: "16px", fontWeight: 600, color: "neutral.1050" }}
          >
            {t("Monthly Reorder Policy")}
          </Typography>
          <IconButton size="small" onClick={handleClose} sx={{ p: 0.25 }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      )}
      <Box
        sx={{
          p: "12px 14px",
          borderRadius: "10px",
          backgroundColor: "background.default",
        }}
      >
        <Typography
          sx={{
            fontSize: "13px",
            color: "text.primary",
            mb: 0.75,
            opacity: 0.87,
          }}
        >
          {t("When you enable monthly reorder:")}
        </Typography>
        <Box component="ul" sx={{ pl: "18px", m: 0 }}>
          {policyItems.map((item, i) => (
            <Box
              key={i}
              component="li"
              sx={{
                fontSize: "13px",
                color: "text.primary",
                opacity: 0.87,
                lineHeight: 1.55,
                mb: i < policyItems.length - 1 ? 0.5 : 0,
              }}
            >
              {item}
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography
          onClick={handleClose}
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            color: "primary.main",
            textDecoration: "underline",
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          {t("Got It")}
        </Typography>
      </Box>
    </Stack>
  );

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
      </Box>

      {isMobile ? (
        <Dialog
          open={open}
          onClose={handleClose}
          onClick={(e) => e.stopPropagation()}
          PaperProps={{
            sx: {
              borderRadius: "14px",
              mx: "16px",
              width: "100%",
              maxWidth: "480px",
            },
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <PopupContent />
          </DialogContent>
        </Dialog>
      ) : (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          onClick={(e) => e.stopPropagation()}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          disableRestoreFocus
          PaperProps={{
            sx: {
              borderRadius: "10px",
              boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
              width: "300px",
              mt: "6px",
            },
          }}
        >
          <Stack sx={{ p: "4px 0 0" }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              sx={{ px: 1, pt: 0.5 }}
            >
              <IconButton size="small" onClick={handleClose} sx={{ p: 0.25 }}>
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "neutral.1050",
                textAlign: "center",
                pb: 0.5,
              }}
            >
              {t("Monthly Reorder Policy")}
            </Typography>
            <PopupContent />
          </Stack>
        </Popover>
      )}
    </>
  );
};

const StoreCartSidebar = ({ storeDetails, isCartLoading = false }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const handlePrescriptionClick = () => {
    if (getToken()) {
      router.push(
        {
          pathname: "/checkout",
          query: {
            page: "prescription",
            store_id: storeDetails?.id,
            ...(storeDetails?.slug && { store_slug: storeDetails.slug }),
            ...(getCurrentModuleType() && { module: getCurrentModuleType() }),
          },
        },
        undefined,
        { shallow: true }
      );
    } else {
      toast.error(t(not_logged_in_message));
    }
  };
  // Store details page uses the store-scoped cart list populated by
  // cart/list?store_id=X (see store-details/index.js). Falls back to
  // filtering the global cartList by the current store_id when empty.
  const { storeCartList, cartList } = useSelector((state) => state.cart);
  const currentStoreId =
    router?.query?.id ?? router?.query?.storeId ?? router?.query?.store_id;
  const storeScopedCart =
    Array.isArray(storeCartList) && storeCartList.length > 0
      ? storeCartList
      : currentStoreId != null
      ? (Array.isArray(cartList) ? cartList : [])?.filter(
          (i) => String(i?.store_id) === String(currentStoreId)
        )
      : Array.isArray(cartList)
      ? cartList
      : [];
  const { configData } = useSelector((state) => state.configData);
  console.log({ cartList, storeCartList, storeScopedCart });

  // Packaging fee comes from the parent's `storeDetails` (the store-details
  // page already has it from SSR — no need for a second fetch).
  const extraPackagingAmount =
    Number(storeDetails?.extra_packaging_amount) || 0;

  const moduleId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("module") || "null")?.id
      : null;
  const monthlySubKey =
    moduleId && currentStoreId
      ? `monthly_subscribe_${moduleId}_${currentStoreId}`
      : null;

  const [clearOpen, setClearOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [modalFor, setModalFor] = useState("sign-in");
  const [monthlyOrder, setMonthlyOrder] = useState(() => {
    if (typeof window === "undefined" || !monthlySubKey) return false;
    return localStorage.getItem(monthlySubKey) === "1";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMonthlyOrder(
      monthlySubKey ? localStorage.getItem(monthlySubKey) === "1" : false
    );
  }, [monthlySubKey]);
  // Default `extraPackaging` to false to match ItemCheckout's `isPackaging`
  // initial state — the user explicitly opts in instead of being silently
  // charged.
  const [extraPackaging, setExtraPackaging] = useState(false);
  const [addCutlery, setAddCutlery] = useState(true);
  const [unavailableExpanded, setUnavailableExpanded] = useState(false);
  const [unavailableChoice, setUnavailableChoice] = useState("remove");
  const [subtotalCollapsed, setSubtotalCollapsed] = useState(false);

  // Mirror the sidebar's packaging / cutlery / unavailable-item preferences
  // into Redux so ItemCheckout can pick them up when building the order
  // payload. Without this, the user's sidebar choices never reach the
  // /customer/order/place call.
  useEffect(() => {
    dispatch(
      setCartPrefs({
        extraPackaging,
        addCutlery,
        unavailableChoice,
        monthlySubscribe: monthlyOrder,
      })
    );
  }, [extraPackaging, addCutlery, unavailableChoice, monthlyOrder, dispatch]);

  useEffect(() => {
    if (!monthlySubKey) return;
    if (monthlyOrder) {
      localStorage.setItem(monthlySubKey, "1");
    } else {
      localStorage.removeItem(monthlySubKey);
    }
  }, [monthlyOrder, monthlySubKey]);

  // Pro Plan: only fetch active offer when feature is enabled AND the user
  // is authenticated. The endpoint is auth-only — skipping the call for
  // guests avoids a guaranteed-401 round trip.
  const proFeatureEnabled = configData?.pro_member_status === 1;
  const hasToken = !!getToken();
  const { data: activeOfferRaw, isLoading: activeOfferLoading } =
    useGetProActiveOffer({
      enabled: proFeatureEnabled && hasToken,
    });
  // "Also Brought Together" — store-scoped recommended items.
  // The /store/[id] route param is the slug, so use the numeric id from
  // storeDetails instead.
  const { data: suggestedItemsRaw } = useGetSuggestedItems({
    storeId: storeDetails?.id,
    type: getCurrentModuleType(),
    recommended: 1,
    offset: 1,
    limit: 50,
  });
  const suggestedItems = Array.isArray(suggestedItemsRaw?.items)
    ? suggestedItemsRaw.items
    : Array.isArray(suggestedItemsRaw?.products)
    ? suggestedItemsRaw.products
    : Array.isArray(suggestedItemsRaw?.data)
    ? suggestedItemsRaw.data
    : Array.isArray(suggestedItemsRaw)
    ? suggestedItemsRaw
    : [];
  const activeOffer = activeOfferRaw?.data ?? activeOfferRaw ?? null;
  const isProMember =
    Number(activeOffer?.plan_details?.days_remaining) > 0 ||
    Boolean(activeOffer?.plan_details?.plan_name);
  const isProActive = activeOffer?.status === true;
  const proBenefit = activeOffer?.benefit ?? null;
  const proOfferResolved =
    !(proFeatureEnabled && hasToken) || !activeOfferLoading;
  // Backend describes the benefit via {type, offer_type, charge_discount_percentage,
  // min_order_status, min_order_amount}. Build the Pro savings tag from those
  // fields so the message reflects the actual offer (free vs partial-free, plus
  // the optional minimum-order qualifier).
  const proSavingsMessage = (() => {
    if (!proBenefit) return undefined;
    const offerActive = isProActive;
    if (!offerActive) return undefined;

    const benefitType = proBenefit?.type;
    const offerType = proBenefit?.offer_type;
    const benefitPercentage = Number(proBenefit?.percentage) || 0;
    const benefitMaxAmount = Number(proBenefit?.max_amount) || 0;
    const chargeDiscountPct =
      Number(proBenefit?.charge_discount_percentage) || 0;
    const minOrderStatus = Number(proBenefit?.min_order_status) === 1;
    const minOrderAmount = Number(proBenefit?.min_order_amount) || 0;

    // Subtotal computed inline (the named `subtotal` constant is defined
    // later in the function body, so we recompute here to keep this IIFE
    // self-contained without reordering the rest of the file).
    const cartSubtotal = cartItemsTotalAmount(
      getCartListModuleWise(storeScopedCart)
    );

    const qualifiesForOffer =
      !minOrderStatus || minOrderAmount <= 0 || cartSubtotal >= minOrderAmount;
    const amountToReachMin = Math.max(0, minOrderAmount - cartSubtotal);

    if (!qualifiesForOffer) {
      // Below the min order amount — surface a single, actionable
      // "Add ৳X more to save" message regardless of benefit type.
      const amountToReachText = getAmountWithSign(amountToReachMin);
      return `${t("Add")} ${amountToReachText} ${t(
        "more to save with Pro Plan"
      )}`;
    }
    if (benefitType === "discount") {
      const rawDiscount = (cartSubtotal * benefitPercentage) / 100;
      const savedAmount =
        benefitMaxAmount > 0
          ? Math.min(rawDiscount, benefitMaxAmount)
          : rawDiscount;
      if (savedAmount > 0) {
        const savedText = getAmountWithSign(savedAmount);
        return `${t("You save")} ${savedText} ${t("with Pro Plan")}`;
      }
      return undefined;
    }
    if (benefitType === "delivery_fee") {
      if (offerType === "full_free" || offerType === "free") {
        return t("Free delivery as a Pro member");
      }
      if (offerType === "partial_free" && chargeDiscountPct > 0) {
        return `${chargeDiscountPct}% ${t("off delivery as a Pro member")}`;
      }
      return undefined;
    }
    if (benefitType === "coupon") {
      return t("Pro coupon benefit unlocked");
    }
    return undefined;
  })();
  const [proModalOpen, setProModalOpen] = useState(false);
  const [proPaymentOpen, setProPaymentOpen] = useState(false);
  const [proSelectedPlan, setProSelectedPlan] = useState(null);
  const subscribeProMutation = useSubscribeProPlan();
  const handleProSubscribe = (plan) => {
    // Free trial: subscribe inline with no payment modal. Paid plans hop to
    // the payment-method picker, which fires the same mutation with a
    // gateway/wallet payload.
    if (!plan) return;
    if (plan.price === 0) {
      subscribeProMutation.mutate(
        {
          plan_id: plan.id,
          payment_type: "free_trial",
          payment_method: "free_trial",
          callback_url:
            typeof window !== "undefined" ? window.location.href : "",
        },
        {
          onSuccess: (res) => {
            const redirect = res?.redirect_link ?? res?.data?.redirect_link;
            if (redirect && typeof window !== "undefined") {
              window.location.href = redirect;
              return;
            }
            toast.success(t("Subscribed successfully"));
            setProModalOpen(false);
          },
          onError: (err) => {
            toast.error(
              err?.response?.data?.message || t("Subscription failed")
            );
          },
        }
      );
      return;
    }
    setProSelectedPlan(plan);
    setProModalOpen(false);
    setProPaymentOpen(true);
  };

  const { mutate: clearCartMutate, isLoading: clearLoading } = useClearCart();

  const moduleCartList = getCartListModuleWise(storeScopedCart);

  const hasFlashSaleItem = useMemo(
    () => moduleCartList?.some((item) => Number(item?.flash_sale) === 1),
    [moduleCartList]
  );

  const subtotal =
    moduleCartList?.reduce((sum, item) => {
      const itemQty = Number(item?.quantity) || 1;
      const isFood = item?.module_type === ModuleTypes.FOOD;

      let unitPrice;
      if (isFood) {
        const optionsTotal = (item?.selectedOption ?? []).reduce(
          (s, o) =>
            o?.isSelected === false ? s : s + (Number(o?.optionPrice) || 0),
          0
        );
        unitPrice = (Number(item?.price) || 0) + optionsTotal;
      } else {
        const variationPrice = Number(item?.selectedOption?.[0]?.price);
        unitPrice =
          Number.isFinite(variationPrice) && variationPrice > 0
            ? variationPrice
            : Number(item?.price) || 0;
      }

      const discountValue = Number(item?.discount) || 0;
      const discountPerUnit =
        item?.discount_type === "percent" || item?.discount_type === "fixed"
          ? (discountValue / 100) * unitPrice
          : discountValue;
      const discountedUnitPrice = Math.max(unitPrice - discountPerUnit, 0);

      const addons = item?.selectedAddons ?? [];
      const addonsTotal = addons.reduce(
        (t, a) => t + (Number(a?.price) || 0) * (Number(a?.quantity) || 0),
        0
      );

      return sum + discountedUnitPrice * itemQty + addonsTotal;
    }, 0) ?? 0;

  const originalSubtotal = moduleCartList?.reduce((sum, item) => {
    const itemQty = item?.quantity || 1;
    const isFood = item?.module_type === ModuleTypes.FOOD;
    let unitPrice;
    if (isFood) {
      // Food: variation values are additive on top of the base price.
      unitPrice =
        (item?.price || 0) + getTotalVariationsPrice(item?.food_variations);
    } else {
      // Grocery / pharmacy / ecommerce: the selected variation in
      // `selectedOption[0].price` IS the line price (replaces the base
      // `item.price`). Fall back to base when no variation is picked.
      const variationPrice = Number(item?.selectedOption?.[0]?.price);
      unitPrice =
        Number.isFinite(variationPrice) && variationPrice > 0
          ? variationPrice
          : Number(item?.price) || 0;
    }
    // Addons are priced by the addon's own quantity, independent of item qty.
    const addons = item?.selectedAddons ?? item?.addons ?? [];
    const addonTotal = addons.reduce(
      (t, a) => t + (Number(a?.price) || 0) * (Number(a?.quantity) || 0),
      0
    );
    return sum + unitPrice * itemQty + addonTotal;
  }, 0);

  const showOriginalSubtotal =
    originalSubtotal && Number(originalSubtotal) > Number(subtotal);

  const handleClearCart = () => {
    const targetStoreId =
      moduleCartList?.[0]?.store_id ??
      moduleCartList?.[0]?.store?.id ??
      storeDetails?.id ??
      currentStoreId ??
      null;
    clearCartMutate(targetStoreId, {
      onSuccess: () => {
        dispatch(setClearCart());
        if (monthlySubKey) localStorage.removeItem(monthlySubKey);
        setMonthlyOrder(false);
        toast.success(t("Cart cleared successfully"));
        setClearOpen(false);
      },
      onError: onErrorResponse,
    });
  };

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const moduleParam = router.query?.module;
  const checkoutStoreId =
    moduleCartList?.[0]?.store_id ??
    moduleCartList?.[0]?.store?.id ??
    currentStoreId;

  const checkoutQuery = {
    page: "cart",
    ...(moduleParam && { module: moduleParam }),
    ...(checkoutStoreId != null && { store_id: checkoutStoreId }),
    ...(storeDetails?.slug && { store_slug: storeDetails.slug }),
  };

  const handleCheckout = () => {
    if (
      moduleCartList?.length > 0 &&
      !token &&
      configData?.guest_checkout_status === 1
    ) {
      setGuestOpen(true);
      return;
    }
    if (moduleCartList?.length > 0 && token) {
      router
        .push({ pathname: "/checkout", query: checkoutQuery }, undefined, {
          shallow: true,
        })
        .then(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      return;
    }
    if (moduleCartList?.length === 0) {
      router.push({
        pathname: "/home",
        query: { ...(moduleParam && { module: moduleParam }) },
      });
    } else {
      setAuthOpen(true);
    }
  };

  const handleGuestRoute = () => {
    router
      .push({ pathname: "/checkout", query: checkoutQuery }, undefined, {
        shallow: true,
      })
      .then(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  return (
    <>
      <SidebarSurface>
        {configData?.prescription_order_status &&
        storeDetails?.prescription_order &&
        getCurrentModuleType() === "pharmacy" ? (
          <SidebarPrescriptionCard sx={{ alignItems: "center" }}>
            <Stack
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                backgroundColor: alpha(theme.palette.primary.main, 0.06),
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <i
                className="fi fi-rr-file-prescription prescription-icon"
                style={{
                  fontSize: "22px",
                  display: "flex",
                  color: theme.palette.primary.main,
                }}
              />
            </Stack>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    lineHeight: 1.3,
                    letterSpacing: "-0.3px",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {t("Prescription Order")}
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="4px"
                  sx={{ mt: "2px" }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 400,
                      color: theme.palette.primary.main,
                      lineHeight: 1,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {t("Get your medicine as prescribed.")}
                  </Typography>
                </Stack>
              </Box>
              <IconButton
                onClick={handlePrescriptionClick}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.16),
                  },
                }}
              >
                <i
                  className="fi fi-rr-arrow-small-right prescription-arrow"
                  style={{ fontSize: "18px", display: "flex" }}
                />
              </IconButton>
            </Box>
          </SidebarPrescriptionCard>
        ) : null}
        {/* Header */}
        <SidebarCartLayout>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              padding:
                moduleCartList?.length === 0 ? "16px 16px 5px" : "16px 20px",
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {t("Cart")}
            </Typography>
            {moduleCartList?.length > 0 && (
              <Typography
                onClick={() => setClearOpen(true)}
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: theme.palette.warning?.main || "#F59E0B",
                  cursor: "pointer",
                  "&:hover": {
                    color: theme.palette.warning?.dark || "#D97706",
                  },
                }}
              >
                {t("Clear All")}
              </Typography>
            )}
          </Stack>

          {/* Items */}
          {isCartLoading && moduleCartList?.length === 0 ? (
            <Stack
              spacing={1.5}
              sx={{ padding: "16px 20px", minHeight: "240px", flex: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <Stack
                  key={i}
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                >
                  <Skeleton
                    variant="rounded"
                    width={56}
                    height={56}
                    sx={{ borderRadius: "10px", flexShrink: 0 }}
                  />
                  <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
                    <Skeleton variant="text" width="70%" height={16} />
                    <Skeleton variant="text" width="40%" height={14} />
                  </Stack>
                  <Skeleton
                    variant="rounded"
                    width={72}
                    height={28}
                    sx={{ borderRadius: "8px", flexShrink: 0 }}
                  />
                </Stack>
              ))}
            </Stack>
          ) : moduleCartList?.length === 0 ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ padding: "32px 24px 0px", minHeight: "240px", flex: 1 }}
            >
              {/* Shopping bag with sparkle lines above */}
              <Box
                sx={{
                  position: "relative",
                  width: 64,
                  height: 64,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {[12, 18, 12].map((h, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 2,
                        height: h,
                        borderRadius: 1,
                        backgroundColor: theme.palette.error.main,
                        transformOrigin: "bottom",
                        transform:
                          i === 0
                            ? "rotate(-15deg)"
                            : i === 2
                            ? "rotate(15deg)"
                            : "none",
                      }}
                    />
                  ))}
                </Stack>
                <Box
                  component="img"
                  src="/empty-cart-bag.svg"
                  alt="Empty cart"
                  sx={{ width: 80, height: 80 }}
                />
              </Box>

              <Stack alignItems="center" spacing={0.5}>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    textAlign: "center",
                  }}
                >
                  {t("Your Cart is Waiting!")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12.5px",
                    color: theme.palette.text.secondary,
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}
                >
                  {t("To order with us add anything to your cart.")}
                </Typography>
              </Stack>

              {/* Free-delivery banner */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                justifyContent="center"
                sx={{
                  mt: 1,
                  alignSelf: "stretch",
                  px: 1.5,
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.warning?.main || "#F97316",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <LocalShippingOutlinedIcon
                    sx={{ fontSize: 11, color: "#fff" }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: "11.5px",
                    color: theme.palette.text.primary,
                    lineHeight: 1.3,
                  }}
                >
                  {t("Order min")}{" "}
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.warning?.dark || "#C2410C",
                    }}
                  >
                    {getAmountWithSign(configData?.free_delivery_over ?? 500)}
                  </Box>{" "}
                  {t("to get free delivery")}
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <SimpleBar
              style={{ maxHeight: "calc(90vh - 420px)", width: "100%" }}
            >
              <Stack sx={{ px: 2.5, pb: 1 }}>
                {/* Items section with border */}
                <Stack
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {/* Items label */}
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      pt: 1.5,
                      px: 1.5,
                      pb: 0.5,
                    }}
                  >
                    {t("Items")}
                  </Typography>
                  <Stack>
                    {moduleCartList.map((item) => (
                      <CartItemRow
                        key={item?.cartItemId || item?.id}
                        cartItem={item}
                      />
                    ))}
                  </Stack>
                </Stack>

                {/* Add To Monthly Order — grocery & pharmacy only, hidden when any cart item is a flash sale */}
                {[ModuleTypes.GROCERY, ModuleTypes.PHARMACY].includes(
                  getCurrentModuleType()
                ) &&
                configData?.monthly_order_reminder &&
                !hasFlashSaleItem ? (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      mt: 1.5,
                      px: 1.25,
                      py: 1,
                      borderRadius: 1,
                      backgroundColor: alpha(
                        theme.palette.warning?.main || "#F59E0B",
                        0.12
                      ),
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          backgroundColor:
                            theme.palette.warning?.main || "#F59E0B",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        i
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {t("Add To Monthly Order")}
                      </Typography>
                      <MonthlyOrderInfo />
                    </Stack>
                    <Checkbox
                      checked={monthlyOrder}
                      onChange={(e) => {
                        if (!token) {
                          toast.error(t("Please login to use this feature"));
                          setModalFor("sign-in");
                          setAuthOpen(true);
                          return;
                        }
                        setMonthlyOrder(e.target.checked);
                      }}
                      size="small"
                      sx={{ p: 0.25 }}
                      name="monthly_subscribe"
                    />
                  </Stack>
                ) : null}

                {/* Settings rows */}
                <Stack sx={{ mt: 2 }}>
                  {extraPackagingAmount > 0 && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        pb: 1.5,
                        mb: 1.5,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Stack spacing={0.25} flex={1} minWidth={0}>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {t("Need Extra Packaging?")}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "11.5px",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {`${t("An additional")} ${getAmountWithSign(
                            extraPackagingAmount
                          )} ${t("will be applied.")}`}
                        </Typography>
                      </Stack>
                      <Checkbox
                        checked={extraPackaging}
                        onChange={(e) => setExtraPackaging(e.target.checked)}
                        size="small"
                        sx={{ p: 0.25 }}
                      />
                    </Stack>
                  )}

                  {getCurrentModuleType() !== ModuleTypes.GROCERY && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        pb: 1.5,
                        mb: 1.5,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Stack spacing={0.25} flex={1} minWidth={0}>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {t("Add Cutlery")}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "11.5px",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {t(
                            "If available, your order will come with cutlery."
                          )}
                        </Typography>
                      </Stack>
                      <CustomSwitch
                        checked={addCutlery}
                        onChange={(e) => setAddCutlery(e.target.checked)}
                        noimage="true"
                      />
                    </Stack>
                  )}

                  <Stack
                    spacing={0.5}
                    sx={{
                      pb: 1.5,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ cursor: "pointer" }}
                      onClick={() => setUnavailableExpanded((v) => !v)}
                    >
                      <Stack spacing={0.25} flex={1} minWidth={0}>
                        <Typography
                          sx={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {t("If Any Items Is Not Available")}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "11.5px",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {unavailableChoice === "remove"
                            ? t("Remove it form my cart")
                            : t("Call me ASAP")}
                        </Typography>
                      </Stack>
                      {unavailableExpanded ? (
                        <KeyboardArrowUpIcon sx={{ fontSize: 22 }} />
                      ) : (
                        <KeyboardArrowDownIcon sx={{ fontSize: 22 }} />
                      )}
                    </Stack>
                    {unavailableExpanded && (
                      <Stack
                        spacing={0.5}
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          backgroundColor: alpha(
                            theme.palette.text.primary,
                            0.03
                          ),
                        }}
                      >
                        {[
                          ["remove", t("Remove it form my cart")],
                          ["call", t("Call me ASAP")],
                        ].map(([key, label]) => (
                          <Stack
                            key={key}
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ cursor: "pointer" }}
                            onClick={() => setUnavailableChoice(key)}
                          >
                            <Box
                              sx={{
                                width: 14,
                                height: 14,
                                borderRadius: "50%",
                                border: `2px solid ${
                                  unavailableChoice === key
                                    ? theme.palette.primary.main
                                    : theme.palette.divider
                                }`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {unavailableChoice === key && (
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    backgroundColor: theme.palette.primary.main,
                                  }}
                                />
                              )}
                            </Box>
                            <Typography fontSize={12.5}>{label}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Stack>

                {/* Pro Plan: subscribe banner for non-members, savings banner
                for active members. Hidden entirely when the feature flag
                (configData.pro_member_status) is off. */}

                {/* Also Brought Together — falls back to demo data when the
                backend hasn't returned related_items yet. */}
                {(() => {
                  const broughtItems = suggestedItems;
                  if (broughtItems.length === 0) return null;
                  const sliderSettings = {
                    dots: false,
                    arrows: false,
                    infinite: false,
                    speed: 400,
                    slidesToShow: Math.min(2.5, broughtItems.length),
                    slidesToScroll: 1,
                    swipeToSlide: true,
                  };
                  return (
                    <Box
                      sx={{
                        mt: 2,
                        p: 1.5,
                        borderRadius: "14px",
                        backgroundColor:
                          theme.palette.background?.secondary ||
                          theme.palette.neutral?.[100] ||
                          "#F5F5F5",
                        "& .slick-list": { mx: -0.5 },
                        "& .slick-slide > div": { px: 0.5 },
                      }}
                    >
                      <Typography
                        sx={{
                          mb: 1.25,
                          fontSize: "14px",
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {t("Also Brought Together")}
                      </Typography>
                      <Slider {...sliderSettings}>
                        {broughtItems.map((rel) => {
                          const relPrice = Number(
                            rel?.discounted_price ?? rel?.price ?? 0
                          );
                          const relOriginal = Number(rel?.price ?? 0);
                          const hasOff =
                            relOriginal > 0 && relOriginal > relPrice;
                          const discountPct = hasOff
                            ? Math.round(
                                ((relOriginal - relPrice) / relOriginal) * 100
                              )
                            : 0;
                          const showHalal =
                            rel?.halal_tag_status && rel?.is_halal;
                          return (
                            <NewProductCard
                              key={rel?.id}
                              variant="vertical"
                              item={rel}
                              isPharmacy={
                                ModuleTypes.PHARMACY === getCurrentModuleType()
                              }
                              isStore
                              cardWidth={{ xs: "120px", md: "120px" }}
                            />
                          );
                        })}
                      </Slider>
                    </Box>
                  );
                })()}
              </Stack>
            </SimpleBar>
          )}

          {/* Footer with subtotal and checkout */}
          {moduleCartList?.length > 0 &&
            (() => {
              console.log({ subtotal });

              const extraPackagingFee = extraPackaging
                ? extraPackagingAmount
                : 0;
              const itemDiscount = showOriginalSubtotal
                ? Number(originalSubtotal) - Number(subtotal)
                : 0;
              const grandTotal = Number(subtotal) + extraPackagingFee;
              return (
                <CustomStackFullWidth
                  sx={{
                    borderTop: `1px solid ${theme.palette.divider}`,
                    padding: "12px 20px 16px",
                    backgroundColor: theme.palette.background.paper,
                  }}
                  spacing={1.25}
                >
                  {proFeatureEnabled &&
                    hasToken &&
                    proOfferResolved &&
                    !isProMember && (
                      <Box sx={{ mt: 2, width: "100%" }}>
                        <ProPlanBanner
                          onSubscribe={() => setProModalOpen(true)}
                          stacked
                        />
                      </Box>
                    )}
                  {proFeatureEnabled &&
                    hasToken &&
                    proOfferResolved &&
                    isProActive && (
                      <Box sx={{ mt: 2, width: "100%", mb: 1 }}>
                        <ProSavingsBanner
                          amount={
                            activeOffer?.total_saved ??
                            activeOffer?.plan_details?.total_saved
                          }
                          message={proSavingsMessage}
                        />
                      </Box>
                    )}
                  {/* Breakdown — animated expand/collapse */}
                  <Collapse in={!subtotalCollapsed} timeout={250} unmountOnExit>
                    <Stack
                      spacing={0.75}
                      sx={{
                        pb: 1,
                        mb: 0.5,
                        borderBottom: `1px dashed ${theme.palette.divider}`,
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {t("Items Total")}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {getAmountWithSign(originalSubtotal || subtotal)}
                        </Typography>
                      </Stack>
                      {itemDiscount > 0 && (
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {t("Item Discount")}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: theme.palette.success?.main || "#16A34A",
                            }}
                          >
                            -{getAmountWithSign(itemDiscount)}
                          </Typography>
                        </Stack>
                      )}
                      {extraPackaging && (
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography
                            sx={{
                              fontSize: "13px",
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {t("Extra Packaging")}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                            }}
                          >
                            {getAmountWithSign(extraPackagingFee)}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Collapse>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      sx={{ cursor: "pointer" }}
                      onClick={() => setSubtotalCollapsed((v) => !v)}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {t("Subtotal")}
                      </Typography>
                      <KeyboardArrowDownIcon
                        sx={{
                          fontSize: 18,
                          transform: subtotalCollapsed
                            ? "rotate(0deg)"
                            : "rotate(180deg)",
                          transition: "transform 250ms ease",
                        }}
                      />
                    </Stack>
                    <Stack direction="row" alignItems="baseline" spacing={0.75}>
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {getAmountWithSign(grandTotal)}
                      </Typography>
                      {showOriginalSubtotal && (
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: theme.palette.text.disabled,
                            textDecoration: "line-through",
                          }}
                        >
                          {getAmountWithSign(originalSubtotal)}
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                  <PrimaryButton
                    onClick={handleCheckout}
                    variant="contained"
                    size="large"
                    fullWidth
                    borderRadius="10px"
                  >
                    {t("Checkout")}
                  </PrimaryButton>
                </CustomStackFullWidth>
              );
            })()}
        </SidebarCartLayout>
      </SidebarSurface>

      <CustomDialogConfirm
        dialogTexts={t("Are you sure you want to clear cart?")}
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        onSuccess={handleClearCart}
        isLoading={clearLoading}
      />

      {guestOpen && (
        <GuestCheckoutModal
          open={guestOpen}
          setOpen={setGuestOpen}
          setSideDrawerOpen={() => {}}
          handleRoute={handleGuestRoute}
          setModalFor={setModalFor}
          setOpenAuth={setAuthOpen}
        />
      )}
      <AuthModal
        modalFor={modalFor}
        setModalFor={setModalFor}
        open={authOpen}
        handleClose={() => setAuthOpen(false)}
      />

      {proFeatureEnabled && proModalOpen && (
        <ProPlanSubscriptionModal
          open={proModalOpen}
          onClose={() => setProModalOpen(false)}
          onSubscribe={handleProSubscribe}
          isSubmitting={subscribeProMutation.isLoading}
        />
      )}
      {proFeatureEnabled && proPaymentOpen && (
        <ProPlanPaymentModal
          open={proPaymentOpen}
          onClose={() => setProPaymentOpen(false)}
          plan={proSelectedPlan}
        />
      )}
    </>
  );
};

export default StoreCartSidebar;
