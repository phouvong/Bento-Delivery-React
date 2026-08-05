import React, { useEffect } from "react";
import { t } from "i18next";
import { Box, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import CustomContainer from "../../../container";
import PromotionalBanner from "components/home/PromotionalBanner";
import useGetOtherBanners from "api-manage/hooks/react-query/useGetOtherBanners";
import OrderDetailsModal from "../../../order-details-modal/OrderDetailsModal";
import ModuleHomeSidebarLayout from "components/home/sidebar-layout/ModuleHomeSidebarLayout";
import ServiceSearchBanner from "./components/global/ServiceSearchBanner";
import TopOfferNotifyBanner from "./components/home/TopOfferNotifyBanner";
import TrendingBites from "components/home/trending-bites";
import QuickDeliverySection from "./components/home/QuickDeliverySection";
import PopularServices from "./components/home/PopularServices";
import MobileAppBanner from "components/home/MobileAppBanner";
import RecommendedServices from "./components/home/RecommendedServices";
import { getServiceSections } from "./serviceSectionsConfig";
import isVerifiedStoreEnabled from "helper-functions/isVerifiedStoreEnabled";
import FeaturedCategories from "components/home/featured-categories";
import Banners from "components/home/banners";
import Services from "./components/home/services";
import ServiceLastBookingSection from "./components/home/ServiceLastBookingSection";
import PaidAds from "components/home/paid-ads";
import { getToken } from "helper-functions/getToken";
import VerifiedProvider from "./components/home/VerifiedProvider";
import { setOpenSignInModal } from "redux/slices/utils";
import useServiceBusinessConfig from "components/home/module-wise-components/service/service-api-manage/hooks/custom-hooks/useServiceBusinessConfig";
import ServiceCampaigns from "./components/home/ServiceCampaigns";
import PharmacyStaticBanners from "../pharmacy/pharmacy-banners/PharmacyStaticBanners";
import RecommendedStore from "components/home/recommended-store";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const S = ({ children }) => children ?? null;

const ServiceModule = (props) => {
  const { data, refetch: refetchOtherBanners } = useGetOtherBanners();
  // enabled:false query — fetch on mount for the promotional banner section.
  useEffect(() => {
    refetchOtherBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { configData, routeSection } = props;
  const token = getToken();
  const router = useRouter();
  const dispatch = useDispatch();
  const { orderDetailsModalOpen, selectedModule } = useSelector(
    (state) => state.utilsData,
  );
  const { biddingSystemEnabled } = useServiceBusinessConfig(configData);
  const currentModuleType =
    selectedModule?.module_type ?? getCurrentModuleType();
  const isServiceModuleActive = currentModuleType === "service";

  const handleCustomServiceClick = () => {
    // Re-check live module state at click time (not the value captured when
    // this closure/render was created) — router.query.module can lag a tick
    // behind a just-completed module switch, which previously let a click
    // during that gap push to the create page with the OLD module in the
    // query string.
    if ((getCurrentModuleType() ?? currentModuleType) !== "service") return;
    if (!token) {
      dispatch(setOpenSignInModal(true));
      return;
    }
    router.push(`/service/custom-service/create?module=service`);
  };

  const overviewContent = (
    <Stack gap={{ xs: "16px", lg: "32px" }}>
      <S>
        <ServiceSearchBanner
          zoneid={
            typeof window !== "undefined"
              ? localStorage.getItem("zoneid")
              : undefined
          }
        />
      </S>
      <S>
        <CustomContainer noMobilePadding>
          <FeaturedCategories configData={configData} />
        </CustomContainer>
      </S>
      {biddingSystemEnabled && isServiceModuleActive ? (
        <S>
          <CustomContainer>
            <TopOfferNotifyBanner onClick={handleCustomServiceClick} />
          </CustomContainer>
        </S>
      ) : null}
      <S>
        <CustomContainer>
          <Banners />
        </CustomContainer>
      </S>
      <S>
        <CustomContainer>
          <PopularServices />
        </CustomContainer>
      </S>
      <S>
        <CustomContainer
          sx={{
            paddingLeft: "16px !important",
            paddingRight: "0 !important",
          }}
        >
          <QuickDeliverySection
            title={t("Quick & Emergency Experts")}
            subtitle={t(
              "Get fastest service from your nearby Service Provides",
            )}
            cardVariant="withItems"
          />
        </CustomContainer>
      </S>
      <S>
        <CustomContainer
          sx={{
            paddingLeft: "16px !important",
            paddingRight: "0 !important",
          }}
        >
          <TrendingBites
            title={t("Expert at Work")}
            subtitle={t("Discover professionals solving real problems")}
          />
        </CustomContainer>
      </S>
      {token ? (
        <S>
          <CustomContainer noMobilePadding={true}>
            <ServiceLastBookingSection />
          </CustomContainer>
        </S>
      ) : null}
      <S>
        <CustomContainer>
          <PaidAds />
        </CustomContainer>
      </S>
      {isVerifiedStoreEnabled(configData) && (
        <S>
          <CustomContainer
            sx={{
              paddingLeft: "16px !important",
              paddingRight: "0 !important",
            }}
          >
            <VerifiedProvider
              title={t("Verified Providers")}
              subtitle={t("Trust & secure buying experience.")}
            />
          </CustomContainer>
        </S>
      )}
      <S>
        <CustomContainer noMobilePadding>
          <MobileAppBanner />
        </CustomContainer>
      </S>
      <S>
        <CustomContainer
          sx={{
            paddingLeft: "16px !important",
            paddingRight: "0 !important",
          }}
        >
          <RecommendedStore />
        </CustomContainer>
      </S>
      <S>
        <CustomContainer>
          <PharmacyStaticBanners /> {/* basic campaign */}
        </CustomContainer>
      </S>
      <S>
        <CustomContainer>
          <RecommendedServices />
        </CustomContainer>
      </S>
      <S>
        <CustomContainer>
          <ServiceCampaigns />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <PromotionalBanner bannerData={data} />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <Services title={t("Explore Our Services")} />
        </CustomContainer>
      </S>
    </Stack>
  );

  const serviceSections = getServiceSections(configData);

  return (
    <>
      <ModuleHomeSidebarLayout
        overviewContent={overviewContent}
        routeSection={routeSection}
        sections={serviceSections}
      />
      {orderDetailsModalOpen && !token && (
        <OrderDetailsModal
          orderDetailsModalOpen={orderDetailsModalOpen}
          type="booking"
        />
      )}
    </>
  );
};

export default ServiceModule;
