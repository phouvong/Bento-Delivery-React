import { useEffect, useRef, useState } from "react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import H2 from "../../typographies/H2";
import { Skeleton, styled } from "@mui/material";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import useGetNewArrivalStores from "../../../api-manage/hooks/react-query/store/useGetNewArrivalStores";
import SpecialOfferCardShimmer from "../../Shimmer/SpecialOfferCardSimmer";
import { HomeComponentsWrapper } from "../HomePageComponents";
import {foodNewArrivalsettings, settings} from "../../home/new-arrival-stores/sliderSettings";
import StoreCard from "components/cards/StoreCard";
import {useGetRecommendStores} from "api-manage/hooks/react-query/store/useGetRecommendStores";
import {setRecommendedStores} from "redux/slices/storedData";



const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-slide": {
    padding: "0 10px", // Set the desired padding value
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": {
      padding: "0px", // Set the desired padding value
    },
  },
}));

const menus = ["Popular", "Top Rated", "New"];
const RecommendedStore = () => {
  const dispatch=useDispatch()
  const slider = useRef(null);
  const { recommendedStores } = useSelector((state) => state.storedData);
  const [storeData, setStoreData] = useState([]);
  const {
    data: popularData,
    refetch: popularRefetch,
    isLoading:popularIsLoading ,
  } = useGetRecommendStores();
  // useEffect(() => {
  //   if(recommendedStores?.length>0){
  //     return
  //   }else{
  //     popularRefetch()
  //   }
  //
  // }, [recommendedStores]);
  //
  // useEffect(() => {
  //   if (popularData?.stores?.length > 0) {
  //     dispatch (setRecommendedStores(popularData?.stores));
  //   }
  // }, [popularData]);
  // console.log({recommendedStores})
  const sliderItems = (
    <SliderWrapper
      sx={{
        "& .slick-slide": {
          paddingRight: { xs: "10px", sm: "20px" },
          paddingY: "10px",
        },
      }}
    >
      {popularIsLoading ? (
        <Slider {...settings}>
          {[...Array(6)].map((item, index) => {
            return <SpecialOfferCardShimmer key={index} width={290} />;
          })}
        </Slider>
      ) : (
        <>
          { popularData?.stores?.length>0 &&  (
            <Slider {...settings} ref={slider}>
              {popularData?.stores?.map((item, index) => {
                return (
                  <StoreCard
                    key={index}
                    imageUrl={item?.cover_photo_full_url}
                    item={item}
                  />
                );
              })}
            </Slider>
          )}
        </>
      )}
    </SliderWrapper>
  );

  const getLayout = () => {
    return (

          <>
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              {popularIsLoading ? (
                <Skeleton variant="text" width="110px" />
              ) : (
                <H2 text={t("Recommended Store")} component="h2" />
              )}
            </CustomStackFullWidth>
            {sliderItems}

          </>

    );
  };

  return (
    <HomeComponentsWrapper sx={{ paddingTop: "5px", gap: "1rem" }}>
      {getLayout()}
    </HomeComponentsWrapper>
  );
};

export default RecommendedStore

