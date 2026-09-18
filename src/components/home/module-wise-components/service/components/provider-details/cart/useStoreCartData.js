import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getToken } from "helper-functions/getToken";
import { cartItemsTotalAmount } from "utils/CustomFunctions";
import { setCartPrefs, setClearCart } from "redux/slices/cart";
import useClearCart from "api-manage/hooks/react-query/add-cart/useClearCart";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import useGetSuggestedItems from "api-manage/hooks/react-query/product-details/useGetSuggestedItems";
import useGetProActiveOffer from "api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import useSubscribeProPlan from "api-manage/hooks/react-query/pro-plans/useSubscribeProPlan";

const resolveSuggestedItems = (suggestedItemsRaw) => {
  if (Array.isArray(suggestedItemsRaw?.items)) return suggestedItemsRaw.items;
  if (Array.isArray(suggestedItemsRaw?.products))
    return suggestedItemsRaw.products;
  if (Array.isArray(suggestedItemsRaw?.data)) return suggestedItemsRaw.data;
  if (Array.isArray(suggestedItemsRaw)) return suggestedItemsRaw;
  return [];
};

// Shared cart/checkout/pro-plan logic for the provider-details cart surfaces
// (desktop StoreCartSidebar + ServiceMobileCartModal). Both surfaces render
// at the same time on the same page, so they must stay in sync.
const useStoreCartData = ({ providerDetails, onAfterNavigate } = {}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  const { storeCartList, cartList } = useSelector((state) => state.cart);
  const { configData } = useSelector((state) => state.configData);

  const currentStoreId =
    router?.query?.id ?? router?.query?.storeId ?? router?.query?.store_id;
  // `cartList` isn't always an array — the rental flow stores the raw API
  // object ({ carts: [...], user_data }) in the same slice, so guard every
  // read with Array.isArray before filtering.
  const safeCartList = Array.isArray(cartList) ? cartList : [];
  const storeScopedCart =
    Array.isArray(storeCartList) && storeCartList.length > 0
      ? storeCartList
      : currentStoreId != null
      ? safeCartList.filter(
          (i) => String(i?.store_id) === String(currentStoreId)
        )
      : safeCartList;

  const [clearOpen, setClearOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [modalFor, setModalFor] = useState("sign-in");
  const [subtotalCollapsed, setSubtotalCollapsed] = useState(false);

  useEffect(() => {
    dispatch(
      setCartPrefs({
        extraPackaging: false,
        addCutlery: false,
        unavailableChoice: "remove",
        monthlySubscribe: false,
      })
    );
  }, [dispatch]);

  const proFeatureEnabled = configData?.pro_member_status === 1;
  const hasToken = !!getToken();
  const { data: activeOfferRaw, isLoading: activeOfferLoading } =
    useGetProActiveOffer({
      enabled: proFeatureEnabled && hasToken,
    });

  const { data: suggestedItemsRaw } = useGetSuggestedItems({
    storeId: providerDetails?.id,
    type: getCurrentModuleType(),
    recommended: 1,
    offset: 1,
    limit: 50,
  });
  const suggestedItems = resolveSuggestedItems(suggestedItemsRaw);

  const activeOffer = activeOfferRaw?.data ?? activeOfferRaw ?? null;
  const isProMember =
    Number(activeOffer?.plan_details?.days_remaining) > 0 ||
    Boolean(activeOffer?.plan_details?.plan_name);
  const isProActive = activeOffer?.status === true;
  const proBenefit = activeOffer?.benefit ?? null;
  const proOfferResolved =
    !(proFeatureEnabled && hasToken) || !activeOfferLoading;

  const moduleCartList = getCartListModuleWise(storeScopedCart);

  const proSavingsMessage = (() => {
    if (!proBenefit) return undefined;
    if (!isProActive) return undefined;

    const benefitType = proBenefit?.type;
    const offerType = proBenefit?.offer_type;
    const benefitPercentage = Number(proBenefit?.percentage) || 0;
    const benefitMaxAmount = Number(proBenefit?.max_amount) || 0;
    const chargeDiscountPct =
      Number(proBenefit?.charge_discount_percentage) || 0;
    const minOrderStatus = Number(proBenefit?.min_order_status) === 1;
    const minOrderAmount = Number(proBenefit?.min_order_amount) || 0;

    const cartSubtotal = cartItemsTotalAmount(moduleCartList);

    const qualifiesForOffer =
      !minOrderStatus || minOrderAmount <= 0 || cartSubtotal >= minOrderAmount;
    const amountToReachMin = Math.max(0, minOrderAmount - cartSubtotal);

    if (!qualifiesForOffer) {
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

  const isEmpty = moduleCartList.length === 0;

  const subtotal = cartItemsTotalAmount(moduleCartList);
  const originalSubtotal = moduleCartList?.reduce((sum, item) => {
    const itemQty = item?.quantity || 1;
    const itemPrice = item?.price || 0;
    return sum + itemPrice * itemQty;
  }, 0);
  const showOriginalSubtotal =
    originalSubtotal && Number(originalSubtotal) > Number(subtotal);

  const handleClearCart = () => {
    const targetStoreId =
      moduleCartList?.[0]?.store_id ??
      moduleCartList?.[0]?.store?.id ??
      providerDetails?.id ??
      currentStoreId ??
      null;
    clearCartMutate(targetStoreId, {
      onSuccess: () => {
        dispatch(setClearCart());
        toast.success(t("Cart cleared successfully"));
        setClearOpen(false);
        onAfterNavigate?.();
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
    ...(providerDetails?.slug && { store_slug: providerDetails.slug }),
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
        .push(
          { pathname: "/service/checkout", query: checkoutQuery },
          undefined,
          { shallow: true }
        )
        .then(() => window.scrollTo({ top: 0, behavior: "smooth" }));
      onAfterNavigate?.();
      return;
    }
    if (moduleCartList?.length === 0) {
      onAfterNavigate?.();
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
      .push(
        { pathname: "/service/checkout", query: checkoutQuery },
        undefined,
        { shallow: true }
      )
      .then(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    onAfterNavigate?.();
  };

  return {
    configData,
    currentStoreId,
    storeScopedCart,
    moduleCartList,
    isEmpty,
    subtotal,
    originalSubtotal,
    showOriginalSubtotal,
    suggestedItems,

    clearOpen,
    setClearOpen,
    clearLoading,
    handleClearCart,

    guestOpen,
    setGuestOpen,
    authOpen,
    setAuthOpen,
    modalFor,
    setModalFor,
    handleGuestRoute,
    handleCheckout,

    subtotalCollapsed,
    setSubtotalCollapsed,

    proFeatureEnabled,
    hasToken,
    activeOffer,
    isProMember,
    isProActive,
    proOfferResolved,
    proSavingsMessage,
    proModalOpen,
    setProModalOpen,
    proPaymentOpen,
    setProPaymentOpen,
    proSelectedPlan,
    handleProSubscribe,
    subscribeProMutation,
  };
};

export default useStoreCartData;
