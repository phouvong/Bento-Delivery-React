import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import CustomContainer from "../../../container";
import FeaturedCategories from "../../featured-categories";
import Banners from "../../banners";
import { IsSmallScreen } from "../../../../utils/CommonValues";
import VisitAgain from "../../visit-again";
import SpecialFoodOffers from "../../special-food-offers";
import BestReviewedItems from "../../best-reviewed-items";
import Stores from "../../stores";
import NewArrivalStores from "../../new-arrival-stores";
import RunningCampaigns from "../../running-campaigns";
import FeaturedCategoriesWithFilter from "../ecommerce/FeaturedCategoriesWithFilter";
import LoveItem from "../../love-item";
import useGetOtherBanners from "../../../../api-manage/hooks/react-query/useGetOtherBanners";
import OrderDetailsModal from "../../../order-details-modal/OrderDetailsModal";
import { useSelector } from "react-redux";
import { getToken } from "../../../../helper-functions/getToken";
import { getCurrentModuleId } from "../../../../helper-functions/getCurrentModuleType";
import { useGetVisitAgain } from "api-manage/hooks/react-query/useGetVisitAgain";
import useGetNewArrivalStores from "api-manage/hooks/react-query/store/useGetNewArrivalStores";
import { getModuleId } from "helper-functions/getModuleId";

const FoodModule = (props) => {
  const { configData } = props;
  const token = getToken();
  const [isVisited, setIsVisited] = useState(false);
  const [storeData, setStoreData] = React.useState([]);
  const { orderDetailsModalOpen } = useSelector((state) => state.utilsData);
  const { data, refetch, isLoading } = useGetOtherBanners();
  const { data: visitedStores, refetch: refetchVisitAgain } =
    useGetVisitAgain();
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
    <Grid container spacing={1}>
      <Grid item xs={12} sx={{ marginTop: { xs: "-10px", sm: "10px" } }}>
        <CustomContainer>
          <FeaturedCategories configData={configData} />
        </CustomContainer>
      </Grid>
      <Grid item xs={12}>
        {IsSmallScreen() ? (
          <VisitAgain
            configData={configData}
            visitedStores={storeData}
            isVisited={isVisited}
          />
        ) : (
          <CustomContainer>
            <VisitAgain
              configData={configData}
              isVisited={isVisited}
              visitedStores={storeData}
            />
          </CustomContainer>
        )}
      </Grid>

      <Grid item xs={12}>
        <CustomContainer>
          <SpecialFoodOffers title="Special Food Offers" />
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

      {/* <Grid item xs={12}>
       <CustomContainer>
         <DiscountedProductRedirectBanner />
       </CustomContainer>
      </Grid> */}
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
          <Stores />
        </CustomContainer>
      </Grid>
      {/* <Grid item xs={12}>
       <CustomContainer>
         <SinglePoster />
       </CustomContainer>
      </Grid> */}
      {orderDetailsModalOpen && !token && (
        <OrderDetailsModal orderDetailsModalOpen={orderDetailsModalOpen} />
      )}
    </Grid>
  );
};

FoodModule.propTypes = {};

export default FoodModule;
