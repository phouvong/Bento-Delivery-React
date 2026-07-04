import { Stack } from "@mui/material";
import useGetNewArrivalStores from "api-manage/hooks/react-query/store/useGetNewArrivalStores";
import { useGetVisitAgain } from "api-manage/hooks/react-query/useGetVisitAgain";
import MobileAppBanner from "components/home/MobileAppBanner";
import PaidAds from "components/home/paid-ads";
import RecommendedStore from "components/home/recommended-store";
import ModuleHomeSidebarLayout from "components/home/sidebar-layout/ModuleHomeSidebarLayout";
import { getModuleId } from "helper-functions/getModuleId";
import { getToken } from "helper-functions/getToken";
import { t } from "i18next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useGetOtherBanners from "../../../../api-manage/hooks/react-query/useGetOtherBanners";
import CustomContainer from "../../../container";
import OrderDetailsModal from "../../../order-details-modal/OrderDetailsModal";
import Banners from "../../banners";
import FeaturedCategories from "../../featured-categories";
import RunningCampaigns from "../../running-campaigns";
import Stores from "../../stores";
import TrendingBites from "../../trending-bites";
import VisitAgain from "../../visit-again";
import LastOrdersSection from "../food/LastOrdersSection";
import QuickDeliverySection from "../food/QuickDeliverySection";
import CommonConditions from "./common-conditions";
import PharmacySearchBanner from "./PharmacySearchBanner";
import { getPharmacySections } from "./pharmacySectionsConfig";
import SelfCareOTCSection from "./SelfCareOTCSection";
import VerifiedPharmacies from "./VerifiedPharmacies";

const S = ({ children }) => children ?? null;

const Pharmacy = ({ configData, routeSection }) => {
  const router = useRouter();
  const token = getToken();
  const [isVisited, setIsVisited] = useState(false);
  const { orderDetailsModalOpen } = useSelector((state) => state.utilsData);
  const [storeData, setStoreData] = React.useState([]);
  const { data, refetch, isLoading } = useGetOtherBanners();
  const {
    data: visitedStores,
    refetch: refetchVisitAgain,
    isFetching: visitIsFetching,
  } = useGetVisitAgain();
  const {
    data: newStore,
    refetch: newStoreRefetch,
    isFetching,
  } = useGetNewArrivalStores({
    type: "all",
  });
  const moduleId = useMemo(() => getModuleId(), []);

  useEffect(() => {
    if (visitedStores?.length > 0 || newStore?.stores?.length > 0) {
      if (visitedStores?.length > 0 && visitedStores) {
        setStoreData(visitedStores);
        setIsVisited(true);
      } else {
        if (newStore?.stores) {
          setStoreData(newStore?.stores);
        }
      }
    }
  }, [visitedStores, newStore?.stores, moduleId]);

  const overviewContent = (
    <Stack gap={{ xs: "16px", lg: "32px" }}>
      <S>
        <PharmacySearchBanner
          zoneid={
            typeof window !== "undefined"
              ? localStorage.getItem("zoneid")
              : undefined
          }
        />
      </S>

      <S>
        <CustomContainer
          sx={{
            paddingLeft: "16px !important",
            paddingRight: "0 !important",
          }}
        >
          <CommonConditions title={t("Shop By Conditions")} />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer noMobilePadding>
          <FeaturedCategories configData={configData} />
        </CustomContainer>
      </S>

      {configData?.repeat_order_option && token ? (
        <S>
          {/* 🔥 new feature your last order - user logged in wise */}
          <CustomContainer noMobilePadding={true}>
            <LastOrdersSection title={t("Refill Your Medicine")} />
          </CustomContainer>
        </S>
      ) : null}
      <S>
        <CustomContainer>
          <Banners />
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
            title={t("Quick & Emergency Delivery")}
            subtitle={t("Get fastest order from your nearby pharmacies.")}
            cardVariant="withItems"
          />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <PaidAds />
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
            title={t("Health Highlights")}
            subtitle={t("Essential medicines & health products")}
          />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <RecommendedStore title={t("Recommended Pharmacies")} />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer
          sx={{
            paddingLeft: "16px !important",
            paddingRight: "0 !important",
          }}
        >
          <VisitAgain
            configData={configData}
            isVisited={isVisited}
            visitedStores={storeData}
            isFetching={visitIsFetching || isFetching}
          />
        </CustomContainer>
      </S>

      <S>
        {/* new feature */}
        <CustomContainer
          sx={{
            paddingLeft: "16px !important",
            paddingRight: "0 !important",
          }}
        >
          <VerifiedPharmacies />
        </CustomContainer>
      </S>

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
          <SelfCareOTCSection />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer
          sx={{
            paddingLeft: "16px !important",
            paddingRight: "0 !important",
          }}
        >
          <RunningCampaigns />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <Stores title={t("Explore Pharmacy")} />
        </CustomContainer>
      </S>

      {orderDetailsModalOpen && !token && (
        <OrderDetailsModal orderDetailsModalOpen={orderDetailsModalOpen} />
      )}
    </Stack>
  );

  const pharmacySections = getPharmacySections();
  return (
    <ModuleHomeSidebarLayout
      overviewContent={overviewContent}
      sections={pharmacySections}
      routeSection={routeSection}
    />
  );
};

Pharmacy.propTypes = {};

export default Pharmacy;
