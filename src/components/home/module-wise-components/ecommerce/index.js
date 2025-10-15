import React, { useEffect, useState } from "react";
import { Grid, Skeleton, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { getToken } from "helper-functions/getToken";
import { useIntersectionObserver } from "api-manage/hooks/custom-hooks/useIntersectionObserver";
import CustomContainer from "../../../container";
import FeaturedCategories from "../../featured-categories";
import RecommendedStore from "components/home/recommended-store";
import PaidAds from "components/home/paid-ads";
import PopularItemsNearby from "../../popular-items-nearby";
import OrderDetailsModal from "../../../order-details-modal/OrderDetailsModal";
import dynamic from "next/dynamic";

// Lazy load components (below the fold)
const Brands = dynamic(() => import("components/home/brands"), { ssr: false });
const BestReviewedItems = dynamic(() => import("../../best-reviewed-items"), { ssr: false });
const LoveItem = dynamic(() => import("../../love-item"), { ssr: false });
const RunningCampaigns = dynamic(() => import("../../running-campaigns"), { ssr: false });
const SpecialFoodOffers = dynamic(() => import("../../special-food-offers"), { ssr: false });
const Stores = dynamic(() => import("../../stores"), { ssr: false });
const VisitAgain = dynamic(() => import("../../visit-again"), { ssr: false });
const FeaturedStores = dynamic(() => import("../pharmacy/featured-stores"), { ssr: false });
const PharmacyStaticBanners = dynamic(
  () => import("../pharmacy/pharmacy-banners/PharmacyStaticBanners"),
  { 
    ssr: false,
    loading: () => (
      <Skeleton
        variant="rectangular"
        height="100%"
        width="100%"
      />
    )
  }
);
const CampaignBanners = dynamic(() => import("./CampaignBanners"), { ssr: false });
const FeaturedCategoriesWithFilter = dynamic(() => import("./FeaturedCategoriesWithFilter"), { ssr: false });
const NewArrivals = dynamic(() => import("./NewArrivals"), { ssr: false });
const SinglePoster = dynamic(() => import("./SinglePoster"), { ssr: false });
const TopOffersNearMe = dynamic(() => import("components/home/top-offers-nearme"), { ssr: false });

const menus = ["All", "Beauty", "Bread & Juice", "Drinks", "Milks"];

const Shop = ({ configData }) => {
  const token = getToken();
  const { orderDetailsModalOpen } = useSelector((state) => state.utilsData);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  
  // Use custom intersection observer hook
  const { ref: triggerRef, hasTriggered: loadMore } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <Grid container spacing={1}>
      {/* Above-the-fold content */}
      <Grid item xs={12} sx={{ marginTop: { xs: "-10px", sm: "10px" } }}>
        <CustomContainer>
          <FeaturedCategories configData={configData} />
        </CustomContainer>
      </Grid>

      <Grid item xs={12}>
        <CustomContainer>
          <RecommendedStore />
        </CustomContainer>
      </Grid>

      <Grid item xs={12} mb={3}>
        <CustomContainer>
          <PaidAds />
        </CustomContainer>
      </Grid>

      <Grid item xs={12}>
        <CustomContainer>
          <PopularItemsNearby
            title="Most Popular Products"
            subTitle="We provide best quality & valuable products around the world"
          />
        </CustomContainer>
      </Grid>

      {/* Scroll Trigger */}
      <div ref={triggerRef} style={{ height: "1px" }} />
      
      {/* Below-the-fold content - loaded after scroll */}
      {loadMore && (
        <>
          <Grid item xs={12}>
            <CustomContainer>
              <PharmacyStaticBanners />
            </CustomContainer>
          </Grid>

          {token && (
            <Grid item xs={12} mb={3}>
              {isSmallScreen ? (
                <VisitAgain configData={configData} />
              ) : (
                <CustomContainer>
                  <VisitAgain configData={configData} />
                </CustomContainer>
              )}
            </Grid>
          )}

          <Grid item xs={12}>
            <CustomContainer>
              <TopOffersNearMe title="Top offers near me" />
            </CustomContainer>
          </Grid>

          <Grid item xs={12}>
            <CustomContainer>
              <CampaignBanners />
            </CustomContainer>
          </Grid>

          <Grid item xs={12}>
            <CustomContainer>
              <SpecialFoodOffers />
            </CustomContainer>
          </Grid>

          <Grid item xs={12}>
            <CustomContainer>
              <FeaturedStores title="Popular Store" configData={configData} />
            </CustomContainer>
          </Grid>

          <Grid item xs={12}>
            <CustomContainer>
              <BestReviewedItems
                menus={menus}
                title="Best Reviewed Items"
              />
            </CustomContainer>
          </Grid>

          <Grid item xs={12}>
            <CustomContainer>
              <NewArrivals />
            </CustomContainer>
          </Grid>

          <Grid item xs={12} mt="10px">
            <CustomContainer>
              <RunningCampaigns />
            </CustomContainer>
          </Grid>

          <Grid item xs={12}>
            <CustomContainer>
              <LoveItem />
            </CustomContainer>
          </Grid>

          <Grid item xs={12}>
            <CustomContainer>
              <FeaturedCategoriesWithFilter title="Featured Categories" />
            </CustomContainer>
          </Grid>

          <Grid item xs={12}>
            <CustomContainer>
              <Brands />
            </CustomContainer>
          </Grid>

          <Grid item xs={12}>
            <CustomContainer>
              <SinglePoster />
            </CustomContainer>
          </Grid>

          <Grid item xs={12}>
            <CustomContainer>
              <Stores />
            </CustomContainer>
          </Grid>
        </>
      )}

      {/* Modal */}
      {orderDetailsModalOpen && !token && (
        <OrderDetailsModal orderDetailsModalOpen={orderDetailsModalOpen} />
      )}
    </Grid>
  );
};


export default Shop;
