import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@emotion/react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomSideDrawer from "components/side-drawer/CustomSideDrawer";
import DrawerHeader from "components/added-cart-view/DrawerHeader";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NearMeIcon from "@mui/icons-material/NearMe";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import { Box } from "@mui/system";
import { Divider, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import RoomIcon from "@mui/icons-material/Room";
import CardDetailsSingleCard from "../global/CardDetailsSingleCard";
import RentalProceedtoCheckout from "../global/RentalProceedtoCheckout";
import CartContentCart from "components/home/module-wise-components/rental/components/rental-cart/CartContentCart";
import { FormatedDateWithTime } from "utils/CustomFunctions";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import TripModalContent from "components/home/module-wise-components/rental/components/rental-cart/TripModalContent";
import TripVehicleList from "components/home/module-wise-components/rental/components/rental-cart/TripVehicleList";
import CustomModal from "components/custom-component/CustomModal";
import dynamic from "next/dynamic";
import EmptyCart from "components/added-cart-view/EmptyCart";
import {
  calculateTotalDiscount,
  getTotalAmount,
} from "components/home/module-wise-components/rental/components/rental-checkout/checkoutHeplerFunction";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getToken } from "helper-functions/getToken";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import useGetProActiveOffer from "api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import useSubscribeProPlan from "api-manage/hooks/react-query/pro-plans/useSubscribeProPlan";
import ProPlanBanner from "components/pro-plan/ProPlanBanner";
import ProSavingsBanner from "components/pro-plan/ProSavingsBanner";

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

const TaxiView = (props) => {
  const [isOpenModal, setOpenModal] = React.useState(false);
  const [openTripChange, setOpenTripChange] = React.useState(false);
  const [ids, setIds] = React.useState(null);
  const [updateCartObject, setUpdateCartObject] = React.useState({});
  const theme = useTheme();
  const {
    sideDrawerOpen,
    setSideDrawerOpen,
    cartList,
    refetch,
    isLoading,
    configData: configDataProp,
  } = props;
  const router = useRouter();

  const closeHandler = () => {
    setSideDrawerOpen(false);
  };

  const currentTime = new Date().toLocaleTimeString();

  // Prefer the prop passed down from the navbar (always populated from
  // the page-level configData) and fall back to the redux slice for
  // pages that don't pass it explicitly.
  const { configData: configDataFromStore } = useSelector(
    (state) => state.configData
  );
  const configData = configDataProp || configDataFromStore;
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
  // While the offer is still loading we don't yet know if the user is a
  // member — render neither banner instead of flashing the "Subscribe Now"
  // CTA at someone who is already subscribed.
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
    // Matches the value the backend uses to gate the Pro benefit.
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
  const [proModalOpen, setProModalOpen] = React.useState(false);
  const [proPaymentOpen, setProPaymentOpen] = React.useState(false);
  const [proSelectedPlan, setProSelectedPlan] = React.useState(null);
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

  return (
    <>
      <CustomSideDrawer
        anchor="right"
        open={sideDrawerOpen}
        onClose={closeHandler}
        variant="temporary"
        maxWidth="450px"
        width="100%"
      >
        <Box
          sx={{
            position: "relative",
            height: "100vh",
            overflowY: "auto",
          }}
        >
          <CustomStackFullWidth
            alignItems="start"
            justifyContent="start"
            gap={0}
            sx={{
              position: "relative",
              top: "0px",
              height: "100vh",
            }}
          >
            <DrawerHeader
              CartIcon={
                <DirectionsCarFilledIcon
                  width="18px"
                  height="18px"
                  color={theme.palette.primary.dark}
                />
              }
              title="Trip Cart"
              closeHandler={closeHandler}
            />
            {cartList?.carts?.length > 0 ? (
              <CustomStackFullWidth sx={{ px: "20px" }}>
                <Box
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: "0px 2px 5px 0px rgba(71, 71, 71, 0.07)",
                    borderRadius: "10px",
                    padding: "15px",
                    marginTop: "10px",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between">
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
                  <Divider sx={{ marginTop: "10px" }} />

                  <CardDetailsSingleCard
                    isShowEdit={false}
                    icon={
                      <RoomIcon
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
                          display: "-webkit-box",
                          WebkitLineClamp: 1, // Limits to 2 lines
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {cartList.user_data?.pickup_location?.location_name}
                      </Typography>
                    </Box>
                  </CardDetailsSingleCard>

                  <CardDetailsSingleCard
                    isShowEdit={false}
                    icon={
                      <NearMeIcon
                        sx={{
                          fontSize: "16px",
                          color: (theme) => theme.palette.neutral[500],
                        }}
                      />
                    }
                    sx={{
                      position: "relative",
                      borderBottom: (theme) =>
                        `1px solid ${theme.palette.neutral[200]}`,
                    }}
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
                    />
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
                          WebkitLineClamp: 1, // Limits to 2 lines
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {
                          cartList.user_data?.destination_location
                            ?.location_name
                        }
                      </Typography>
                    </Box>
                  </CardDetailsSingleCard>

                  <CardDetailsSingleCard
                    isShowEdit={false}
                    icon={
                      <CalendarTodayIcon
                        sx={{
                          fontSize: "16px",
                          color: (theme) => theme.palette.neutral[500],
                        }}
                      />
                    }
                    sx={{
                      borderBottom: (theme) =>
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
                        {cartList?.user_data?.pickup_time
                          ? new Date(
                            cartList.user_data.pickup_time
                          ).getTime() <= new Date().getTime()
                            ? t("Pickup Now")
                            : t("Schedule at")
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
                        {FormatedDateWithTime(cartList.user_data?.pickup_time)}
                      </Typography>
                    </Box>
                  </CardDetailsSingleCard>

                  <CardDetailsSingleCard
                    isShowEdit={false}
                    sx={{ pb: "0px" }}
                    icon={
                      <HourglassEmptyOutlinedIcon
                        sx={{
                          fontSize: "16px",
                          color: (theme) => theme.palette.neutral[600],
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
                        - {cartList?.user_data?.rental_type?.replace("_", " ")}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: "400",
                          color: (theme) => theme.palette.neutral[600],
                          fontSize: "12px",
                          textTransform: "capitalize",
                        }}
                      >
                        {cartList?.user_data?.rental_type === "hourly" ? (
                          <>
                            (<b>{cartList?.user_data?.estimated_hours}</b> Hrs)
                          </>
                        ) : cartList?.user_data?.rental_type === "day_wise" ? (
                          <>
                            (<b>{(cartList?.user_data?.estimated_hours / 24).toFixed(2)}</b>{" "}
                            Days)
                          </>
                        ) : (
                          <>
                            (<b>{cartList?.user_data?.distance?.toFixed(3)}</b>{" "}
                            Km)
                          </>
                        )}
                      </Typography>
                    </Box>
                  </CardDetailsSingleCard>
                </Box>

                <CustomStackFullWidth sx={{ mt: "20px" }}>
                  {cartList?.carts.map((item, index) => (
                    <CartContentCart
                      key={index}
                      item={item}
                      userData={cartList?.user_data}
                      isPriceShow={false}
                    />
                  ))}
                </CustomStackFullWidth>
              </CustomStackFullWidth>
            ) : (
              <CustomStackFullWidth sx={{ marginBlock: "auto" }}>
                <EmptyCart
                  cartList={cartList?.carts}
                  setSideDrawerOpen={setSideDrawerOpen}
                  text={t("Continue Booking")}
                  subTitle={t(
                    "No vehicles added in your cart. Please add vehicle to your cart list."
                  )}
                  icon={
                    <DirectionsCarFilledIcon
                      sx={{
                        width: "28px",
                        height: "28px",
                        color: (theme) => theme.palette.primary.main,
                      }}
                    />
                  }
                />
              </CustomStackFullWidth>
            )}

            {cartList?.carts?.length > 0 && (
              <RentalProceedtoCheckout
                rentalUserData={cartList}
                totalAmount={Math.max(
                  getTotalAmount(cartList) - calculateTotalDiscount(cartList),
                  0
                )}
                sx={{
                  backgroundColor: (theme) => theme.palette.background.paper,
                  position: "sticky",
                  bottom: "0px",
                  width: "100%",
                  padding: "10px",
                  textAlign: "center",
                  pb: "20px",
                  px: "20px",
                  boxShadow: "0px -7px 15px 0px rgba(0, 0, 0, 0.07)",
                  marginTop: "auto",
                }}
                onClick={() => {
                  setSideDrawerOpen(false);
                  router.push("/rental/cart");
                }}
              >
                {proFeatureEnabled &&
                  (() => {
                    // Active offer with a rental-applicable benefit.
                    const hasRentalBenefit =
                      isProActive && proBenefit?.type !== "delivery_fee";
                    if (hasRentalBenefit) {
                      return (
                        <Box sx={{ mb: 1 }}>
                          <ProSavingsBanner
                            amount={
                              activeOffer?.total_saved ??
                              activeOffer?.plan_details?.total_saved
                            }
                            message={proSavingsMessage}
                          />
                        </Box>
                      );
                    }
                    // Show subscribe prompt only when truly not subscribed
                    // (no plan_details). A subscribed user with no benefit
                    // for this module sees nothing — they're already paying.
                    if (!isProMember && !activeOfferLoading) {
                      return (
                        <Box sx={{ mb: 1 }}>
                          <ProPlanBanner
                            onSubscribe={() => {
                              if (!hasToken) {
                                toast.error(t("Please login to use this feature"));
                                return;
                              }
                              setProModalOpen(true);
                            }}
                            subjectLabel="rental"
                          />
                        </Box>
                      );
                    }
                    return null;
                  })()}
              </RentalProceedtoCheckout>
            )}
          </CustomStackFullWidth>
        </Box>

        {isOpenModal && (
          <CarBookingModal
            open={isOpenModal}
            handleClose={() => setOpenModal(false)}
            update
            data={cartList?.user_data}
            setOpenTripChange={setOpenTripChange}
            setIds={setIds}
            setUpdateCartObject={setUpdateCartObject}
            callUpdateUserData={false}
          // isHourly={data?.trip_hourly}
          // isDistence={data?.trip_distance}
          />
        )}
      </CustomSideDrawer>

      <CustomModal openModal={openTripChange}>
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

export default TaxiView;
