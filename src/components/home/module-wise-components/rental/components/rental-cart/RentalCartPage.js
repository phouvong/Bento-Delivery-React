import { alpha, Box, positions } from "@mui/system";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { Button, Grid, Skeleton, Stack, Typography } from "@mui/material";
import RentalCardWrapper from "../global/RentalCardWrapper";
import CustomContainer from "components/container";
import RentalProceedtoCheckout from "../global/RentalProceedtoCheckout";
import CardDetailsSingleCard from "../global/CardDetailsSingleCard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NearMeIcon from "@mui/icons-material/NearMe";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import RoomIcon from "@mui/icons-material/Room";
import CheckoutStepper from "components/checkout/item-checkout/CheckoutStepper";
import CustomModal from "components/modal";
import TripModalContent from "./TripModalContent";
import React, { useEffect, useRef, useState } from "react";
import { t } from "i18next";
import Link from "next/link";
import { useSelector } from "react-redux";
import CartPageCartContentCard from "components/home/module-wise-components/rental/components/rental-cart/CartPageCartContentCard";
import { FormatedDateWithTime } from "utils/CustomFunctions";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { useRouter } from "next/router";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import TripVehicleList from "components/home/module-wise-components/rental/components/rental-cart/TripVehicleList";
import dynamic from "next/dynamic";
import {
  calculateProviderWiseDiscount,
  calculateTotalDiscount,
  getTotalAmount,
  isCurrentTime,
} from "components/home/module-wise-components/rental/components/rental-checkout/checkoutHeplerFunction";
import useGetProActiveOffer from "api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import useSubscribeProPlan from "api-manage/hooks/react-query/pro-plans/useSubscribeProPlan";
import ProPlanBanner from "components/pro-plan/ProPlanBanner";
import ProSavingsBanner from "components/pro-plan/ProSavingsBanner";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getToken } from "helper-functions/getToken";
import { toast } from "react-hot-toast";
const CarBookingModal = dynamic(() =>
  import(
    "components/home/module-wise-components/rental/components/global/CarBookingModal"
  )
);
const ProPlanSubscriptionModal = dynamic(() =>
  import("components/pro-plan/ProPlanSubscriptionModal")
);
const ProPlanPaymentModal = dynamic(() =>
  import("components/pro-plan/ProPlanPaymentModal")
);
const RentalCartPage = () => {
  useScrollToTop();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [openTripChange, setOpenTripChange] = React.useState(false);
  const [ids, setIds] = React.useState(null);
  const [updateCartObject, setUpdateCartObject] = React.useState({});
  const { cartList } = useSelector((state) => state.cart);
  // Carts are shared across modules in redux. After a reload a food/grocery
  // cart can land at index 0, so always resolve the rental cart by
  // module_type instead of trusting carts[0].
  const rentalCart = cartList?.carts?.find(
    (c) => c?.module_type === "rental" && c?.provider
  );
  const { configData } = useSelector((state) => state.configData);
  const currentTime = new Date().toLocaleTimeString();
  const proFeatureEnabled = configData?.pro_member_status === 1;
  const hasToken = !!getToken();
  const { data: activeOfferRaw, isLoading: activeOfferLoading } =
    useGetProActiveOffer({
      enabled: proFeatureEnabled && hasToken,
    });
  const activeOffer = activeOfferRaw?.data ?? activeOfferRaw ?? null;
  const isProMember =
    Number(activeOffer?.plan_details?.days_remaining) > 0 ||
    Boolean(activeOffer?.plan_details?.plan_name);
  const isProActive = activeOffer?.status === true;
  const proBenefit = activeOffer?.benefit ?? null;
  const proOfferResolved =
    !(proFeatureEnabled && hasToken) || !activeOfferLoading;
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

    // Rental "cart subtotal" = trip cost minus provider/vehicle discounts.
    // Mirrors the value the backend uses to gate the Pro benefit.
    const tripCostNow = getTotalAmount(cartList) || 0;
    const tripDiscountNow = calculateTotalDiscount(cartList, tripCostNow) || 0;
    const cartSubtotal = Math.max(0, tripCostNow - tripDiscountNow);

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
  // Redirect to the module home when the rental cart becomes empty while the
  // user is on this page (last vehicle removed, or logout wiped the slice).
  // The middleware already guards fresh navigations/reloads to an empty cart;
  // this handles the client-side "now empty" transition it can't see.
  //
  // Robustness: wait for redux-persist to rehydrate (the slice starts as `[]`,
  // which would otherwise look "empty" on every reload), only bounce on the
  // had-items → now-empty transition, and cross-check the `cart-list` cookie so
  // a momentarily-lagging redux state doesn't trigger a false redirect.
  const hadItemsRef = useRef(false);
  const isRehydrated = useSelector((state) => state?._persist?.rehydrated);
  useEffect(() => {
    if (!isRehydrated) return;

    const hasItems =
      Array.isArray(cartList?.carts) && cartList.carts.length > 0;
    if (hasItems) {
      hadItemsRef.current = true;
      return;
    }

    // Server-truth cookie (written after the cart fetch): a positive value
    // means the cart still has items even if redux hasn't caught up yet.
    const cartListCookie =
      typeof document !== "undefined"
        ? document.cookie
            .split("; ")
            .find((row) => row.startsWith("cart-list="))
            ?.split("=")[1]
        : undefined;
    if (cartListCookie != null && Number(cartListCookie) > 0) return;

    if (hadItemsRef.current) {
      router.replace({
        pathname: "/home",
        ...(router.query?.module
          ? { query: { module: router.query.module } }
          : {}),
      });
    }
  }, [cartList, isRehydrated, router]);

  const tripCost = getTotalAmount(cartList);
  const calculateProviderWiseDiscounts = calculateProviderWiseDiscount(
    cartList,
    tripCost
  );
  const isShowDiscount =
    calculateProviderWiseDiscounts > calculateTotalDiscount(cartList, tripCost);
  const finalDiscount =
    calculateProviderWiseDiscounts > calculateTotalDiscount(cartList, tripCost)
      ? calculateProviderWiseDiscounts
      : calculateTotalDiscount(cartList, tripCost);
  const discountDifference =
    calculateProviderWiseDiscounts === 0 ||
    calculateTotalDiscount(cartList, tripCost) === 0
      ? 0
      : Math.abs(
          calculateProviderWiseDiscounts -
            calculateTotalDiscount(cartList, tripCost)
        );

  return (
    <>
      <CustomContainer>
        <CustomStackFullWidth sx={{ mt: { xs: "12px", md: "10px" } }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <CustomStackFullWidth sx={{ mb: "20px" }}>
                <CheckoutStepper
                  text2={t("Trip details")}
                  text={t("Cart")}
                  text1={t("Checkout")}
                  homeHref="/home?module=rental"
                  storeData={
                    rentalCart?.provider
                      ? { name: rentalCart.provider.name }
                      : undefined
                  }
                  storeHref={
                    rentalCart?.provider
                      ? `/rental/provider/${
                          rentalCart.provider.slug || rentalCart.provider.id
                        }`
                      : undefined
                  }
                />
              </CustomStackFullWidth>
              <RentalCardWrapper>
                {!cartList?.carts && <Skeleton height="200px" width="100%" />}
                {cartList?.carts?.map((item, index) => (
                  <CartPageCartContentCard
                    key={index}
                    item={item}
                    userData={cartList?.user_data}
                    cartPage={true}
                    showPrice={true}
                  />
                ))}
                <Box sx={{ textAlign: "center" }}>
                  {rentalCart?.provider?.id && (
                    <Link href={`/rental/provider/${rentalCart.provider.id}`}>
                      <Button
                        sx={{
                          background: "none",
                          color: (theme) => theme.palette.primary.main,
                        }}
                      >
                        {t("Add More Vehicle")} +
                      </Button>
                    </Link>
                  )}
                </Box>
              </RentalCardWrapper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ position: "sticky", top: "80px" }}>
                <RentalCardWrapper>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    marginBottom="1rem"
                  >
                    <Typography fontWeight="600" fontSize="1rem">
                      {t("Trip Details")}
                    </Typography>

                    <BorderColorOutlinedIcon
                      onClick={() => setOpenModal(true)}
                      sx={{
                        fontSize: "16px",
                        cursor: "pointer",
                        color: (theme) => theme.palette.main,
                      }}
                    />
                  </Stack>
                  <Box sx={{ mb: "30px" }}>
                    <Box
                      sx={{
                        borderRadius: "10px",
                        mb: "15px",
                        border: (theme) =>
                          `1px solid ${theme.palette.neutral[200]}`,
                      }}
                    >
                      <CardDetailsSingleCard
                        icon={
                          <RoomIcon
                            sx={{
                              fontSize: "16px",
                              color: (theme) => theme.palette.neutral[400],
                            }}
                          />
                        }
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "500",
                              fontSize: "14px",
                              display: "-webkit-box",
                              WebkitLineClamp: 2, // Limits to 2 lines
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {cartList?.user_data?.pickup_location
                              ?.location_name ? (
                              cartList?.user_data?.pickup_location
                                ?.location_name
                            ) : (
                              <Skeleton height="20px" width="200px" />
                            )}
                          </Typography>
                        </Box>
                      </CardDetailsSingleCard>
                      <CardDetailsSingleCard
                        isShowEdit={false}
                        icon={
                          <NearMeIcon
                            sx={{
                              fontSize: "16px",
                              color: (theme) => theme.palette.neutral[400],
                            }}
                          />
                        }
                        sx={{ position: "relative" }}
                      >
                        <Box
                          sx={{
                            width: "1px",
                            borderLeft: (theme) =>
                              `1px dashed ${theme.palette.neutral[400]}`,
                            height: "50%",
                            position: "absolute",
                            top: "-15px",
                            left: "8%",
                          }}
                        ></Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "500",
                              fontSize: "14px",
                              display: "-webkit-box",
                              WebkitLineClamp: 2, // Limits to 2 lines
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {cartList?.user_data?.destination_location
                              ?.location_name ? (
                              cartList?.user_data?.destination_location
                                ?.location_name
                            ) : (
                              <Skeleton height="20px" width="200px" />
                            )}
                          </Typography>
                        </Box>
                      </CardDetailsSingleCard>
                    </Box>
                    <CardDetailsSingleCard
                      icon={
                        <CalendarTodayIcon
                          sx={{
                            fontSize: "16px",

                            color: (theme) => theme.palette.neutral[400],
                          }}
                        />
                      }
                      sx={{
                        borderRadius: "10px",
                        mb: "15px",
                        border: (theme) =>
                          `1px solid ${theme.palette.neutral[200]}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          {isCurrentTime(cartList)
                            ? t("Schedule at")
                            : t("Pickup Now")}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: "400",
                            color: (theme) => theme.palette.neutral[400],
                            fontSize: "12px",
                          }}
                        >
                          -{" "}
                          {isCurrentTime(cartList)
                            ? FormatedDateWithTime(
                                cartList?.user_data?.pickup_time
                              )
                            : FormatedDateWithTime(new Date())}
                        </Typography>
                      </Box>
                    </CardDetailsSingleCard>
                    <CardDetailsSingleCard
                      onClickEdit={() => setOpenModal(true)}
                      sx={{
                        borderRadius: "10px",
                        border: (theme) =>
                          `1px solid ${theme.palette.neutral[200]}`,
                      }}
                      icon={
                        <HourglassEmptyOutlinedIcon
                          sx={{
                            fontSize: "16px",
                            color: (theme) => theme.palette.neutral[500],
                          }}
                        />
                      }
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          {t("Rent Type")}
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: "400",
                            color: (theme) => theme.palette.neutral[400],
                            fontSize: "12px",
                            textTransform: "capitalize",
                          }}
                        >
                          -{" "}
                          {cartList?.user_data?.rental_type?.replace("_", " ")}
                        </Typography>
                      </Box>
                    </CardDetailsSingleCard>
                  </Box>
                  {proFeatureEnabled &&
                    hasToken &&
                    proOfferResolved &&
                    !isProMember && (
                      <Box sx={{ mb: "16px" }}>
                        <ProPlanBanner
                          onSubscribe={() => setProModalOpen(true)}
                        />
                      </Box>
                    )}
                  {proFeatureEnabled &&
                    hasToken &&
                    proOfferResolved &&
                    isProActive &&
                    proSavingsMessage && (
                      <Box sx={{ mb: "16px" }}>
                        <ProSavingsBanner
                          amount={
                            activeOffer?.total_saved ??
                            activeOffer?.plan_details?.total_saved
                          }
                          message={proSavingsMessage}
                        />
                      </Box>
                    )}
                  <RentalProceedtoCheckout
                    rentalUserData={cartList}
                    totalAmount={Math.max(tripCost - finalDiscount, 0)}
                    sx={{
                      boxShadow: "none",
                      p: "0px",
                    }}
                    onClick={() => {
                      router.push("/rental/checkout");
                    }}
                    discountDifference={discountDifference}
                    isShowDiscount={isShowDiscount}
                  />
                </RentalCardWrapper>
              </Box>
            </Grid>
          </Grid>
        </CustomStackFullWidth>
        {openModal && (
          <CarBookingModal
            open={openModal}
            handleClose={() => setOpenModal(false)}
            update
            data={cartList?.user_data}
            setOpenTripChange={setOpenTripChange}
            setIds={setIds}
            setUpdateCartObject={setUpdateCartObject}
          />
        )}
      </CustomContainer>
      <CustomModal
        openModal={openTripChange}
        handleClose={() => setOpenTripChange(false)}
      >
        <TripModalContent
          title="Trip Vehicle List"
          onCloseModal={() => {
            setOpenTripChange(false);
          }}
          content={
            <TripVehicleList
              onCloseModal={() => {
                setOpenTripChange(false);
              }}
              ids={ids}
              cartLists={cartList?.carts}
              updateCartObject={updateCartObject}
            />
          }
        />
      </CustomModal>
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

export default RentalCartPage;
