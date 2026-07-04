import { t } from "i18next";
import { Stack } from "@mui/material";
import useGetNewArrivalStores from "api-manage/hooks/react-query/store/useGetNewArrivalStores";
import MobileAppBanner from "components/home/MobileAppBanner";
import PaidAds from "components/home/paid-ads";
import FoodSearchBanner from "./FoodSearchBanner";
import TopOfferNotifyBanner from "./TopOfferNotifyBanner";
import RecommendedStore from "components/home/recommended-store";
import ModuleHomeSidebarLayout from "components/home/sidebar-layout/ModuleHomeSidebarLayout";
import TopOffersNearMe from "components/home/top-offers-nearme";
import QuickDeliverySection from "./QuickDeliverySection";
import LastOrdersSection from "./LastOrdersSection";
import TrendingDishes from "./TrendingDishes";
import { getModuleId } from "helper-functions/getModuleId";
import { getToken } from "helper-functions/getToken";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { IsSmallScreen } from "utils/CommonValues";
import useGetOtherBanners from "../../../../api-manage/hooks/react-query/useGetOtherBanners";
import CustomContainer from "../../../container";
import OrderDetailsModal from "../../../order-details-modal/OrderDetailsModal";
import Banners from "../../banners";
import FeaturedCategories from "../../featured-categories";
import LoveItem from "../../love-item";
import NewArrivalStores from "../../new-arrival-stores";
import RunningCampaigns from "../../running-campaigns";
import TrendingBites from "../../trending-bites";
import VisitAgain from "../../visit-again";
import FeaturedCategoriesWithFilter from "../ecommerce/FeaturedCategoriesWithFilter";
import Stores from "../../stores";
import { getFoodSections } from "./foodSectionsConfig";
import NewArrivals from "../ecommerce/NewArrivals";
import TopPicksSection from "../grocery/TopPicksSection";

// Wrapper that renders its children as-is. When a section returns null (no
// data / feature off), this element doesn't exist in the DOM at all, so the
// parent Stack skips it — no leftover gap. Avoids CSS :has() entirely.
// NOTE: must stay at module scope — defining it inside the component recreates
// the type every render, remounting every wrapped section on each render.
const S = ({ children }) => children ?? null;

const FoodModule = (props) => {
  const { configData, routeSection } = props;
  const token = getToken();
  const [isVisited, setIsVisited] = useState(false);
  const [storeData, setStoreData] = React.useState([]);
  const { orderDetailsModalOpen } = useSelector((state) => state.utilsData);
  const { data, refetch, isLoading } = useGetOtherBanners();
  const {
    data: newStore,
    refetch: newStoreRefetch,
    isFetching,
  } = useGetNewArrivalStores({
    type: "all",
  });
  const moduleId = useMemo(() => getModuleId(), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
        newStoreRefetch();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (newStore?.stores?.length > 0) {
      setStoreData(newStore.stores);
    }
  }, [newStore?.stores, moduleId]);

  const overviewContent = (
    <Stack gap={{ xs: "16px", lg: "32px" }}>
      <S>
        <FoodSearchBanner
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

      <S>
        <CustomContainer>
          <Banners />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          {/* 🔥 new feature TimeBasedServiceBanner */}
          <TopOfferNotifyBanner />
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
            title={t("Trending Bites")}
            subtitle={t("What everyone's watching and ordering")}
          />
        </CustomContainer>
      </S>
      <S>
        {/* 🔥 new feature QuickDeliverySection */}
        <CustomContainer
          sx={{
            paddingLeft: "16px !important",
            paddingRight: "0 !important",
          }}
        >
          <QuickDeliverySection />
        </CustomContainer>
      </S>

      {configData?.repeat_order_option && token ? (
        <S>
          {/* 🔥 new feature your last order - user logged in wise */}
          <CustomContainer noMobilePadding>
            <LastOrdersSection />
          </CustomContainer>
        </S>
      ) : null}

      <S>
        <CustomContainer
          sx={{
            paddingLeft: "16px !important",
            paddingRight: "0 !important",
          }}
        >
          <TopOffersNearMe title={t("Top Picks Near You")} />
        </CustomContainer>
      </S>
      <S>
        <CustomContainer
          sx={{
            paddingLeft: "16px !important",
            paddingRight: "0 !important",
          }}
        >
          <TopPicksSection />
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
          <RecommendedStore />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer
          sx={{
            paddingLeft: "16px !important",
            paddingRight: "0 !important",
          }}
        >
          <TrendingDishes />
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
            isFetching={isFetching}
          />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer noMobilePadding>
          <LoveItem />
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
        <CustomContainer
          sx={{
            paddingLeft: "16px !important",
            paddingRight: "0 !important",
          }}
        >
          <NewArrivalStores />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <Stores />
        </CustomContainer>
      </S>

      {orderDetailsModalOpen && !token && (
        <OrderDetailsModal orderDetailsModalOpen={orderDetailsModalOpen} />
      )}
    </Stack>
  );

  const foodSections = getFoodSections();
  return (
    <ModuleHomeSidebarLayout
      overviewContent={overviewContent}
      sections={foodSections}
      routeSection={routeSection}
    />
  );
};

FoodModule.propTypes = {};

export default FoodModule;
