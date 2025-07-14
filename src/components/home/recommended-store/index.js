import { useEffect, useRef, useState } from "react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import H2 from "../../typographies/H2";

import { Skeleton, styled } from "@mui/material";
import { Box } from "@mui/system";
import { t } from "i18next";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";

import { useGetPopularStoreWithoutInfiniteScroll } from "api-manage/hooks/react-query/store/useGetPopularStore";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { setNewArrivalStores } from "redux/slices/storedData";
import "slick-carousel/slick/slick.css";
import useGetNewArrivalStores from "../../../api-manage/hooks/react-query/store/useGetNewArrivalStores";
import CustomImageContainer from "../../CustomImageContainer";
import SpecialOfferCardShimmer from "../../Shimmer/SpecialOfferCardSimmer";
import NearbyStoreCard from "../../cards/NearbyStoreCard";
import ClosedNow from "../../closed-now";
import { HomeComponentsWrapper } from "../HomePageComponents";
import Menus from "../best-reviewed-items/Menus";
import {foodNewArrivalsettings, settings} from "../../home/new-arrival-stores/sliderSettings";
import StoreCard from "components/cards/StoreCard";
import {useGetRecommendStores} from "api-manage/hooks/react-query/store/useGetRecommendStores";

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100px",
  width: "100px",
  borderRadius: "50%",
  boxShadow: "0px 4px 10px 0px rgba(0, 54, 85, 0.10)",
  "&:hover": {
    boxShadow: "5px 0px 20px rgba(0, 54, 85, 0.15)",
    img: {
      transform: "scale(1.04)",
    },
  },
  [theme.breakpoints.down("md")]: {
    height: "80px",
    width: "80px",
  },
  [theme.breakpoints.down("sm")]: {
    height: "57px",
    width: "57px",
  },
}));

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
  const { data, refetch, isFetching, isLoading } = useGetNewArrivalStores({
    type: "all",
  });
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const { configData } = useSelector((state) => state.configData);
  const moduleId = JSON.parse(window.localStorage.getItem("module"))?.id;
  const queryKey = "navbar-stores";
  const slider = useRef(null);
  const { newArrivalStores } = useSelector((state) => state.storedData);
  const [storeData, setStoreData] = useState([]);
  const {
    data: popularData,
    refetch: popularRefetch,
    isLoading: popularIsLoading,
  } = useGetRecommendStores();
  const dispatch = useDispatch();

  useEffect(() => {
    popularRefetch();
  }, []);
  useEffect(() => {
    if (popularData?.stores?.length > 0) {
      setStoreData(popularData?.stores);
    }
  }, [popularData]);

  const sliderItems = (
    <SliderWrapper
      sx={{
        "& .slick-slide": {
          paddingRight: { xs: "10px", sm: "20px" },
          paddingY: "10px",
        },
      }}
    >
      {isLoading ? (
        <Slider {...settings}>
          {[...Array(6)].map((item, index) => {
            return <SpecialOfferCardShimmer key={index} width={290} />;
          })}
        </Slider>
      ) : (
        <Slider {...settings} ref={slider}>
          {storeData?.map((item, index) => {
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
    </SliderWrapper>
  );

  const getLayout = () => {
    return (
      <>
        {popularData && popularData?.stores?.length > 0 && (
          <>
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              {isLoading ? (
                <Skeleton variant="text" width="110px" />
              ) : (
                <H2 text={t("Recommended Store")} component="h2" />
              )}
            </CustomStackFullWidth>
            {sliderItems}

          </>
        )}
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

