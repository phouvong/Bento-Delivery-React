import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import ParcelOnTime from "../../../parcel/ParcelOnTime";
import ParcelFeatures from "../../../parcel/ParcelFeatures";
import ParcelVideo from "../../../parcel/ParcelVideo";
import CustomContainer from "../../../container";

import ParcelCategory from "../../../parcel/parcel-category/ParcelCategory";
import { useDispatch, useSelector } from "react-redux";
import OrderDetailsModal from "../../../order-details-modal/OrderDetailsModal";
import { getToken } from "helper-functions/getToken";
import { setParcelData } from "redux/slices/parcelDeliveryInfo";
import ModuleSearchBanner from "../shared/ModuleSearchBanner";
import ParcelSearchPanel from "../../../parcel/ParcelSearchPanel";
import LastOrdersSection from "../food/LastOrdersSection";
import MobileAppBanner from "components/home/MobileAppBanner";
import dynamic from "next/dynamic";
import { t } from "i18next";
import { toast } from "react-hot-toast";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import useGetProActiveOffer from "api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import useSubscribeProPlan from "api-manage/hooks/react-query/pro-plans/useSubscribeProPlan";
import ProPlanBanner from "components/pro-plan/ProPlanBanner";
import ProSavingsBanner from "components/pro-plan/ProSavingsBanner";

const ProPlanSubscriptionModal = dynamic(() =>
  import("components/pro-plan/ProPlanSubscriptionModal")
);
const ProPlanPaymentModal = dynamic(() =>
  import("components/pro-plan/ProPlanPaymentModal")
);

const PARCEL_ITEM_GIFT =
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200";
const PARCEL_ITEM_DOCUMENTS =
  "https://images.unsplash.com/photo-1568097277424-d557bcb3c25e?w=200";
const PARCEL_ITEM_ELECTRONICS =
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200";
const PARCEL_ITEM_PACKAGE =
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200";
const PARCEL_ITEM_APPAREL =
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200";
const PARCEL_ITEM_FRAGILE =
  "https://images.unsplash.com/photo-1513708924321-94c4886c3a87?w=200";

const PARCEL_LOGO_RIDER =
  "https://images.unsplash.com/photo-1601758174039-c0e23ad1c1d8?w=100";
const PARCEL_LOGO_BIKE =
  "https://images.unsplash.com/photo-1591197172062-c718f82aba20?w=100";

const PARCEL_DEMO_ORDERS = [
  {
    id: "p1",
    store: {
      id: "r1",
      name: "Dhanmondi 27 → Banani",
      logo_full_url: PARCEL_LOGO_RIDER,
    },
    items: [
      { image_full_url: PARCEL_ITEM_GIFT },
      { image_full_url: PARCEL_ITEM_DOCUMENTS },
      { image_full_url: PARCEL_ITEM_PACKAGE },
    ],
    totalPrice: 12.5,
    placedDate: "08 May, 2026",
  },
  {
    id: "p2",
    store: {
      id: "r2",
      name: "Mirpur 10 → Gulshan 2",
      logo_full_url: PARCEL_LOGO_BIKE,
    },
    items: [
      { image_full_url: PARCEL_ITEM_ELECTRONICS },
      { image_full_url: PARCEL_ITEM_FRAGILE },
    ],
    totalPrice: 18.75,
    placedDate: "05 May, 2026",
  },
  {
    id: "p3",
    store: {
      id: "r3",
      name: "Uttara 7 → Bashundhara",
      logo_full_url: PARCEL_LOGO_RIDER,
    },
    items: [
      { image_full_url: PARCEL_ITEM_APPAREL },
      { image_full_url: PARCEL_ITEM_GIFT },
      { image_full_url: PARCEL_ITEM_PACKAGE },
      { image_full_url: PARCEL_ITEM_DOCUMENTS },
    ],
    totalPrice: 22.0,
    placedDate: "02 May, 2026",
  },
  {
    id: "p4",
    store: {
      id: "r4",
      name: "Mohammadpur → Motijheel",
      logo_full_url: PARCEL_LOGO_BIKE,
    },
    items: [
      { image_full_url: PARCEL_ITEM_DOCUMENTS },
      { image_full_url: PARCEL_ITEM_DOCUMENTS },
    ],
    totalPrice: 8.0,
    placedDate: "28 Apr, 2026",
  },
  {
    id: "p5",
    store: {
      id: "r5",
      name: "Tejgaon → Old Dhaka",
      logo_full_url: PARCEL_LOGO_RIDER,
    },
    items: [
      { image_full_url: PARCEL_ITEM_FRAGILE },
      { image_full_url: PARCEL_ITEM_PACKAGE },
      { image_full_url: PARCEL_ITEM_GIFT },
    ],
    totalPrice: 15.4,
    placedDate: "25 Apr, 2026",
  },
];

const Parcel = ({ configData }) => {
  const { orderDetailsModalOpen } = useSelector((state) => state.utilsData);
  const token = getToken();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setParcelData(null));
  }, []);

  const proFeatureEnabled = configData?.pro_member_status === 1;
  const hasToken = !!token;
  const { data: activeOfferRaw, isLoading: activeOfferLoading } =
    useGetProActiveOffer({
      enabled: proFeatureEnabled && hasToken,
    });

  const activeOffer = activeOfferRaw?.data ?? activeOfferRaw ?? null;
  console.log({ proFeatureEnabled, activeOffer, activeOfferLoading });
  const isProMember =
    Number(activeOffer?.plan_details?.days_remaining) > 0 ||
    Boolean(activeOffer?.plan_details?.plan_name);
  const isProActive = activeOffer?.status === true;
  const proBenefit = activeOffer?.benefit ?? null;
  const proOfferResolved = !activeOfferLoading;
  console.log({ activeOfferLoading });

  const proSavingsMessage = (() => {
    if (!proBenefit) return undefined;
    const offerActive = isProActive;
    if (!offerActive) return undefined;
    const benefitType = proBenefit?.type;
    const offerType = proBenefit?.offer_type;
    const chargeDiscountPct =
      Number(proBenefit?.charge_discount_percentage) || 0;
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
  console.log({ activeOffer });

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <CustomContainer sx={{ mt: { md: "24px" } }}>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <ModuleSearchBanner
              title="Send  Fastest Parcel Delivery"
              subtitle="Choose your delivery destination and enjoy fast, reliable parcel service."
              component={<ParcelSearchPanel />}
            />
          </Box>
          <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
            <ParcelSearchPanel />
          </Box>

          <ParcelCategory />
          {proFeatureEnabled &&
            (() => {
              // The user is already a Pro subscriber when `plan_details` is
              // populated with a positive `days_remaining`. The API returns
              // `status: false` + `message: "no_benefit_for_module"` for
              // subscribers whose plan offers no benefit on the current
              // module — pushing "Subscribe Now" again would be misleading.
              const noBenefitForModule =
                activeOffer?.message === "no_benefit_for_module";
              const alreadySubscribed =
                Number(activeOffer?.plan_details?.days_remaining) > 0 ||
                Boolean(activeOffer?.plan_details?.plan_name);

              if (
                activeOffer?.status === true &&
                proBenefit?.type === "delivery_fee"
              ) {
                return (
                  <Box sx={{ mb: { xs: 2, md: 3 } }}>
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

              if (
                activeOffer?.status === false &&
                !noBenefitForModule &&
                !alreadySubscribed
              ) {
                return (
                  <Box sx={{ mb: { xs: 2, md: 3 } }}>
                    <ProPlanBanner
                      onSubscribe={() => {
                        if (!hasToken) {
                          toast.error(t("Please login to use this feature"));
                          return;
                        }
                        setProModalOpen(true);
                      }}
                    />
                  </Box>
                );
              }

              return null;
            })()}
        </CustomContainer>

        <CustomContainer>
          <ParcelOnTime />
          {/* <Box sx={{ my: { xs: 2, md: 6 } }}>
            <LastOrdersSection
              title="Your Last Parcels"
              orders={PARCEL_DEMO_ORDERS}
            />
          </Box> */}
          <ParcelFeatures />
          <CustomContainer noMobilePadding sx={{ mt: { xs: 3, md: 5 } }}>
            <MobileAppBanner />
          </CustomContainer>

          <ParcelVideo />
        </CustomContainer>
      </Grid>
      {orderDetailsModalOpen && !token && (
        <OrderDetailsModal orderDetailsModalOpen={orderDetailsModalOpen} />
      )}
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
    </Grid>
  );
};

export default Parcel;
