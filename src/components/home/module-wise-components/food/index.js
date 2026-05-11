import { Grid } from "@mui/material";
import useGetNewArrivalStores from "api-manage/hooks/react-query/store/useGetNewArrivalStores";
import { useGetVisitAgain } from "api-manage/hooks/react-query/useGetVisitAgain";
import PaidAds from "components/home/paid-ads";
import { getModuleId } from "helper-functions/getModuleId";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useGetOtherBanners from "../../../../api-manage/hooks/react-query/useGetOtherBanners";
import { getToken } from "helper-functions/getToken";
import { IsSmallScreen } from "utils/CommonValues";
import CustomContainer from "../../../container";
import OrderDetailsModal from "../../../order-details-modal/OrderDetailsModal";
import Banners from "../../banners";
import BestReviewedItems from "../../best-reviewed-items";
import FeaturedCategories from "../../featured-categories";
import LoveItem from "../../love-item";
import NewArrivalStores from "../../new-arrival-stores";
import RunningCampaigns from "../../running-campaigns";
import SpecialFoodOffers from "../../special-food-offers";
import Stores from "../../stores";
import VisitAgain from "../../visit-again";
import TrendingBites from "../../trending-bites";
import FeaturedCategoriesWithFilter from "../ecommerce/FeaturedCategoriesWithFilter";
import TopOffersNearMe from "components/home/top-offers-nearme";
import RecommendedStore from "components/home/recommended-store";
import MobileAppBanner from "components/home/MobileAppBanner";

const SECTION_GAP = 3;

const FoodModule = (props) => {
  const { configData } = props;
  const token = getToken();
  const [isVisited, setIsVisited] = useState(false);
  const [storeData, setStoreData] = React.useState([]);
  const { orderDetailsModalOpen } = useSelector((state) => state.utilsData);
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
  }, [visitedStores, newStore?.stores, getModuleId()]);

  return (
    <Grid
      container
      rowSpacing={SECTION_GAP}
      sx={{
        "& > .MuiGrid-item:has(> *:empty)": { display: "none" },
        "& > .MuiGrid-item:empty": { display: "none" },
      }}
    >
      <Grid item xs={12}>
        <CustomContainer>
          <FeaturedCategories configData={configData} />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <RecommendedStore/>
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        {IsSmallScreen() ? (
          <VisitAgain
            configData={configData}
            visitedStores={storeData}
            isVisited={isVisited}
            isFetching={isFetching || visitIsFetching}
          />
        ) : (
          <CustomContainer>
            <VisitAgain
              configData={configData}
              isVisited={isVisited}
              visitedStores={storeData}
              isFetching={isFetching || visitIsFetching}
            />
          </CustomContainer>
        )}
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <PaidAds />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <SpecialFoodOffers title="Special Food Offers" />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <TopOffersNearMe title="Top offers near me" />
        </CustomContainer>
      </Grid>

      <Grid item xs={12}>
        <CustomContainer>
          <TrendingBites title="Trending Bites" />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <Banners />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <BestReviewedItems title="Best Reviewed Items" info={data} />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <LoveItem />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <NewArrivalStores />
        </CustomContainer>
      </Grid>

      <Grid item xs={12}>
        <CustomContainer>
          <RunningCampaigns />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <FeaturedCategoriesWithFilter title="Featured Categories" />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <MobileAppBanner />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        <CustomContainer>
          <Stores />
        </CustomContainer>
      </Grid>
      {orderDetailsModalOpen && !token && (
        <OrderDetailsModal orderDetailsModalOpen={orderDetailsModalOpen} />
      )}
    </Grid>
  );
};

FoodModule.propTypes = {};

export default FoodModule;
