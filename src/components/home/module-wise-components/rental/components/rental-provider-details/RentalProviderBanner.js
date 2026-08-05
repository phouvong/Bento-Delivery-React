import RentalCardWrapper from "../global/RentalCardWrapper";
import RentalCarVehicleRating from "./RentalCarVehicleRating";
import { Box, Grid } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RentalCarDetailsBannerImg from "./RentalCarDetailsBannerImg";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useGetProviderDetails } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/provider/useGetProviderDetails";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import StoreCustomMessage from "components/store-details/StoreCustomMessage";
import useGetProviderBanner from "../../rental-api-manage/hooks/react-query/provider/useGetProviderBanner";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useQueryClient } from "react-query";
import dynamic from "next/dynamic";
import { getToken } from "helper-functions/getToken";
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

const RentalProviderBanner = ({ configData }) => {
  useScrollToTop();
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = router.query?.id;
  const { data, isLoading } = useGetProviderDetails(id);
  const { data: bannerData, isLoading: bannerLoading } =
    useGetProviderBanner(id);

  // ── Pro plan wiring (mirrors store-details / parcel) ──
  const proFeatureEnabled = configData?.pro_member_status === 1;
  const hasToken = !!getToken();
  const { data: activeOfferRaw, isLoading: activeOfferLoading } =
    useGetProActiveOffer({
      enabled: proFeatureEnabled && hasToken,
    });
  const activeOffer = activeOfferRaw?.data ?? activeOfferRaw ?? null;
  const proBenefit = activeOffer?.benefit ?? null;
  const proSavingsMessage = (() => {
    if (!proBenefit) return undefined;
    const minOrderAmount = Number(proBenefit?.min_order_amount);
    const hasMin =
      proBenefit?.min_order_status === 1 &&
      Number.isFinite(minOrderAmount) &&
      minOrderAmount > 0;
    const minAmount = hasMin ? getAmountWithSign(minOrderAmount) : "";

    if (proBenefit?.type === "discount") {
      const pct = Number(proBenefit?.percentage);
      const maxAmount = Number(proBenefit?.max_amount);
      const hasCap = Number.isFinite(maxAmount) && maxAmount > 0;
      const capAmount = hasCap ? getAmountWithSign(maxAmount) : "";
      if (Number.isFinite(pct) && pct > 0) {
        if (hasCap && hasMin) {
          return t(
            "{{percent}}% off as a Pro member (up to {{cap}}) on orders above {{amount}}",
            { percent: pct, cap: capAmount, amount: minAmount }
          );
        }
        if (hasCap) {
          return t("{{percent}}% off as a Pro member (up to {{cap}})", {
            percent: pct,
            cap: capAmount,
          });
        }
        if (hasMin) {
          return t(
            "{{percent}}% off as a Pro member on orders above {{amount}}",
            { percent: pct, amount: minAmount }
          );
        }
        return t("{{percent}}% off as a Pro member", { percent: pct });
      }
    }
    if (proBenefit?.type === "delivery_fee") {
      return hasMin
        ? t("Delivery fee benefit as a Pro member on orders above {{amount}}", {
            amount: minAmount,
          })
        : t("Delivery fee benefit as a Pro member");
    }
    if (proBenefit?.type === "coupon") {
      return t("Pro coupon benefit unlocked");
    }
    return undefined;
  })();
  const [proModalOpen, setProModalOpen] = useState(false);
  const [proPaymentOpen, setProPaymentOpen] = useState(false);
  const [proSelectedPlan, setProSelectedPlan] = useState(null);
  const subscribeProMutation = useSubscribeProPlan();
  const handleProSubscribeClick = () => {
    if (!hasToken) {
      toast.error(t("Please login to subscribe"));
      return;
    }
    setProModalOpen(true);
  };
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
            queryClient.invalidateQueries("pro-customer-active-offer");
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

  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : "rental";
  const homeHref = `/home?module=${moduleParam}`;

  const breadcrumbItems = [
    {
      key: "home",
      label: t("Home"),
      icon: <HomeOutlinedIcon style={{ fontSize: "14px" }} />,
      onRedirect: homeHref,
    },
    {
      key: "provider",
      label: data?.name,
    },
  ];

  return (
    <RentalCardWrapper
      borderTopLeftRadius="0px"
      borderTopRightRadius="0px"
      sx={{
        mb: { xs: "20px", md: "-20px" },
        px: { xs: "8px", md: "20px" },
      }}
    >
      <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
        <CustomPageBreadCrumb items={breadcrumbItems} />
      </Box>
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <RentalCarVehicleRating
            data={data || []}
            configData={configData}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <RentalCarDetailsBannerImg
            cover_photo_url={data?.cover_photo_full_url}
            bannerData={bannerData}
            bannerLoading={bannerLoading}
            data={data}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          {data?.announcement === 1 && (
            <StoreCustomMessage
              storeAnnouncement={data?.announcement_message}
            />
          )}
        </Grid>
        {proFeatureEnabled &&
          (() => {
            // True when the user already pays for a Pro plan, even if
            // the active offer carries no benefit for this module
            // (`status: false, message: "no_benefit_for_module"`). We
            // must NOT show the subscribe banner in that case.
            const isProSubscriber = !!(
              activeOffer?.plan_details?.plan_name ||
              Number(activeOffer?.plan_details?.days_remaining) > 0
            );
            const hasRentalBenefit =
              activeOffer?.status === true &&
              proBenefit?.type !== "delivery_fee";

            if (hasRentalBenefit) {
              return (
                <Grid item xs={12} md={12}>
                  <ProSavingsBanner
                    amount={
                      activeOffer?.total_saved ??
                      activeOffer?.plan_details?.total_saved
                    }
                    message={proSavingsMessage}
                  />
                </Grid>
              );
            }
            if (activeOffer?.status === false && !activeOfferLoading) {
              return (
                <Grid item xs={12} md={12}>
                  <ProPlanBanner
                    onSubscribe={handleProSubscribeClick}
                    subjectLabel="rental"
                  />
                </Grid>
              );
            }
            // Subscribed but no benefit for rentals — render nothing.
            return null;
          })()}
      </Grid>
      {proFeatureEnabled && proModalOpen && (
        <ProPlanSubscriptionModal
          open={proModalOpen}
          onClose={() => setProModalOpen(false)}
          onSubscribe={handleProSubscribe}
        />
      )}
      {proFeatureEnabled && proPaymentOpen && proSelectedPlan && (
        <ProPlanPaymentModal
          open={proPaymentOpen}
          onClose={() => setProPaymentOpen(false)}
          plan={proSelectedPlan}
        />
      )}
    </RentalCardWrapper>
  );
};

export default RentalProviderBanner;
