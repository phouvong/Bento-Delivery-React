import { Stack } from "@mui/material";
import useGetNewArrivalStores from "api-manage/hooks/react-query/store/useGetNewArrivalStores";
import { useGetVisitAgain } from "api-manage/hooks/react-query/useGetVisitAgain";
import Brands from "components/home/brands";
import MobileAppBanner from "components/home/MobileAppBanner";
import PaidAds from "components/home/paid-ads";
import RecommendedStore from "components/home/recommended-store";
import ModuleHomeSidebarLayout from "components/home/sidebar-layout/ModuleHomeSidebarLayout";
import { getModuleId } from "helper-functions/getModuleId";
import { getToken } from "helper-functions/getToken";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Banners from "../../banners";
import { IsSmallScreen } from "utils/CommonValues";
import useGetOtherBanners from "../../../../api-manage/hooks/react-query/useGetOtherBanners";
import CustomContainer from "../../../container";
import OrderDetailsModal from "../../../order-details-modal/OrderDetailsModal";
import FeaturedCategories from "../../featured-categories";
import LoveItem from "../../love-item";
import RunningCampaigns from "../../running-campaigns";
import SpecialFoodOffers from "../../special-food-offers";
import Stores from "../../stores";
import TrendingBites from "../../trending-bites";
import VisitAgain from "../../visit-again";
import LastOrdersSection from "../food/LastOrdersSection";
import TopOfferNotifyBanner from "../food/TopOfferNotifyBanner";
import TodaysDeals from "../grocery/TodaysDeals";
import PharmacyStaticBanners from "../pharmacy/pharmacy-banners/PharmacyStaticBanners";
import CampaignBanners from "./CampaignBanners";
import EcommerceSearchBanner from "./EcommerceSearchBanner";
import { getEcommerceSections } from "./ecommerceSectionsConfig";
import SinglePoster from "./SinglePoster";
import TrendingItemsSection from "./TrendingItemsSection";
const FlashSalesSection = dynamic(() => import("./FlashSalesSection"), {
  ssr: false,
});

const S = ({ children }) => children ?? null;

const Shop = ({ configData, routeSection }) => {
  const router = useRouter();
  const menus = ["All", "Beauty", "Bread & Juice", "Drinks", "Milks"];
  const { orderDetailsModalOpen } = useSelector((state) => state.utilsData);
  const [storeData, setStoreData] = React.useState([]);
  const [isVisited, setIsVisited] = useState(false);
  const token = getToken();
  const { data, refetch, isLoading } = useGetOtherBanners();
  const {
    data: visitedStores,
    refetch: refetchVisitAgain,
    isFetching,
  } = useGetVisitAgain();
  const {
    data: newStore,
    refetch: newStoreRefetch,
    isFetching: newIsFetching,
  } = useGetNewArrivalStores({
    type: "all",
  });
  const moduleId = useMemo(() => getModuleId(), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
        if (token) {
          await refetchVisitAgain();
        }
        newStoreRefetch();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

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
        <EcommerceSearchBanner
          zoneid={
            typeof window !== "undefined"
              ? localStorage.getItem("zoneid")
              : undefined
          }
        />
      </S>

      {/* <S>
        <CustomContainer>
          <PharmacyStaticBanners />
        </CustomContainer>
      </S> */}
      <CustomContainer>
        <Banners />
      </CustomContainer>

      <S>
        <CustomContainer noMobilePadding>
          <FeaturedCategories configData={configData} />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <TopOfferNotifyBanner />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <FlashSalesSection key="eCommerce" />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <TodaysDeals />
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
            isFetching={isFetching || newIsFetching}
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
            title="Trending Now"
            subtitle="Watch trending items and shop instantly"
          />
        </CustomContainer>
      </S>
      {configData?.repeat_order_option && token ? (
        <S>
          {/* 🔥 new feature your last order - user logged in wise */}
          <CustomContainer noMobilePadding={true}>
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
          <Brands />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <PaidAds />
        </CustomContainer>
      </S>
      <S>
        <CustomContainer>
          <CampaignBanners />
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
        <CustomContainer noMobilePadding={true}>
          <SpecialFoodOffers />
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
          <TrendingItemsSection />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer noMobilePadding={true}>
          <LoveItem />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <RunningCampaigns />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer noMobilePadding>
          <SinglePoster bannerData={data} />
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

  const ecommerceSections = getEcommerceSections();
  return (
    <ModuleHomeSidebarLayout
      overviewContent={overviewContent}
      sections={ecommerceSections}
      routeSection={routeSection}
    />
  );
};

Shop.propTypes = {};

export default Shop;
