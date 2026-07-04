import { t } from "i18next";
import { Stack, useMediaQuery } from "@mui/material";
import useGetNewArrivalStores from "api-manage/hooks/react-query/store/useGetNewArrivalStores";
import { useGetVisitAgain } from "api-manage/hooks/react-query/useGetVisitAgain";
import PaidAds from "components/home/paid-ads";
import ModuleHomeSidebarLayout from "components/home/sidebar-layout/ModuleHomeSidebarLayout";
import { getModuleId } from "helper-functions/getModuleId";
import { getToken } from "helper-functions/getToken";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useGetOtherBanners from "../../../api-manage/hooks/react-query/useGetOtherBanners";
import CustomContainer from "../../container";
import OrderDetailsModal from "../../order-details-modal/OrderDetailsModal";
import PromotionalBanner from "../PromotionalBanner";
import Banners from "../banners";
import BestReviewedItems from "../best-reviewed-items";
import Coupons from "../coupons";
import FeaturedCategories from "../featured-categories";
import LoveItem from "../love-item";
import NewArrivalStores from "../new-arrival-stores";
import PopularItemsNearby from "../popular-items-nearby";
import RunningCampaigns from "../running-campaigns";
import SpecialFoodOffers from "../special-food-offers";
import Stores from "../stores";
import VisitAgain from "../visit-again";
import TrendingBites from "../trending-bites";
import PharmacyStaticBanners from "./pharmacy/pharmacy-banners/PharmacyStaticBanners";
import TopOffersNearMe from "../top-offers-nearme";
import RecommendedStore from "components/home/recommended-store";
import MobileAppBanner from "components/home/MobileAppBanner";
import GrocerySearchBanner from "./grocery/GrocerySearchBanner";
import { getGrocerySections } from "./grocery/grocerySectionsConfig";
import TodaysDeals from "components/home/module-wise-components/grocery/TodaysDeals";
import TopOfferNotifyBanner from "./food/TopOfferNotifyBanner";
import { useRouter } from "next/router";
import LastOrdersSection from "./food/LastOrdersSection";
import QuickDeliverySection from "./food/QuickDeliverySection";
import TopPicksSection from "./grocery/TopPicksSection";
import Brands from "../brands";
import FlashSalesSection from "./ecommerce/FlashSalesSection";

const menus = ["All", "Beauty", "Bread & Juice", "Drinks", "Milks"];

// Wrapper that renders its children as-is. When a section returns null (no
// data / feature off), this element doesn't exist in the DOM at all, so the
// parent Stack skips it — no leftover gap.
const S = ({ children }) => children ?? null;

const Grocery = (props) => {
  const { configData, routeSection } = props;
  const router = useRouter();
  const token = getToken();
  const [isVisited, setIsVisited] = useState(false);
  const [storeData, setStoreData] = React.useState([]);
  const { orderDetailsModalOpen, orderInformation } = useSelector(
    (state) => state.utilsData,
  );
  const { data, refetch, isLoading } = useGetOtherBanners();
  const {
    data: visitedStores,
    refetch: refetchVisitAgain,
    isFetching: visitIsFetching,
    isLoading: visitIsLoading,
  } = useGetVisitAgain();
  const {
    data: newStore,
    refetch: newStoreRefetch,
    isFetching,
    isLoading: newStoreIsLoading,
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

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  console.log({ configData });

  const overviewContent = (
    <Stack gap={{ xs: "16px", lg: "32px" }}>
      <S>
        <GrocerySearchBanner
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
          {/* new feature */}
          <TopOfferNotifyBanner />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <Banners />
        </CustomContainer>
      </S>
      <S>
        <CustomContainer>
          <FlashSalesSection key="grocery" />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          {/* new feature */}
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
          <TrendingBites
            title={t("Fresh Finds")}
            subtitle={t("Discover fresh groceries through reels")}
          />
        </CustomContainer>
      </S>

      {configData?.repeat_order_option && token ? (
        <S>
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

      {/* new section... */}

      <S>
        {/* 🔥 new feature QuickDeliverySection */}
        <CustomContainer
          sx={{
            paddingLeft: "16px !important",
            paddingRight: "0 !important",
          }}
        >
          <QuickDeliverySection
            title={t("Express Delivery")}
            subtitle={t("Get fastest order from your nearby store")}
            cardVariant="withItems"
          />
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
          <TopPicksSection />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <SpecialFoodOffers />
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
        <CustomContainer>
          <PharmacyStaticBanners />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <RunningCampaigns />
        </CustomContainer>
      </S>

      <S>
        <CustomContainer>
          <PromotionalBanner bannerData={data} />
        </CustomContainer>
      </S>
      <S>
        <CustomContainer>
          <Stores title={t("Explore Stores")} />
        </CustomContainer>
      </S>

      {orderDetailsModalOpen && !token && (
        <OrderDetailsModal
          orderDetailsModalOpen={orderDetailsModalOpen}
          orderInformation={orderInformation}
        />
      )}
    </Stack>
  );

  const grocerySections = getGrocerySections();
  return (
    <ModuleHomeSidebarLayout
      overviewContent={overviewContent}
      sections={grocerySections}
      routeSection={routeSection}
    />
  );
};

Grocery.propTypes = {};

export default Grocery;
