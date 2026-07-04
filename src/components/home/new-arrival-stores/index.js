import { useEffect, useRef, useState } from "react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import H2 from "../../typographies/H2";

import { Skeleton, Typography, styled } from "@mui/material";
import { Box } from "@mui/system";
import { t } from "i18next";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";

import { useGetPopularStoreWithoutInfiniteScroll } from "api-manage/hooks/react-query/store/useGetPopularStore";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getStoreRedirectURL } from "helper-functions/handleStoreRedirect";
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
import { foodNewArrivalsettings, settings } from "./sliderSettings";
import NextImage from "components/NextImage";
import useGetBrandsList from "api-manage/hooks/react-query/brands/useGetBrandsList";

const FoodNewArrivalCard = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  width: "100%",
}));

const FoodNewArrivalImageBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "93px",
  height: "93px",
  flexShrink: 0,
  borderRadius: "12px",
  overflow: "hidden",
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: {
    width: "75px",
    height: "75px",
  },
}));

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-slide": {
    padding: "0 10px",
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": {
      padding: "0px",
    },
  },
}));

const FoodSliderWrapper = styled(CustomBoxFullWidth)(() => ({
  "& .slick-list": {
    overflow: "hidden",
    touchAction: "pan-y",
  },
  "& .slick-track": {
    display: "flex",
    marginLeft: 0,
    marginRight: "auto",
  },
  "& .slick-slide": {
    padding: "0 16px 0 0",
    pointerEvents: "none",
  },
  "& .slick-slide.slick-active": {
    pointerEvents: "auto",
  },
  "& .slick-slide:first-child": {
    paddingLeft: 0,
  },
  "& a": {
    userSelect: "none",
    WebkitUserDrag: "none",
    draggable: "false",
  },
}));

const menus = ["Popular", "Top Rated", "New"];
const NewArrivalStores = () => {
  const { data, refetch, isFetching, isLoading } = useGetNewArrivalStores({
    type: "all",
  });
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const { configData } = useSelector((state) => state.configData);
  const moduleId = JSON.parse(window.localStorage.getItem("module"))?.id;
  const queryKey = "navbar-stores";
  const slider = useRef(null);
  const isDragging = useRef(false);
  const { newArrivalStores } = useSelector((state) => state.storedData);
  const [storeData, setStoreData] = useState([]);
  const {
    data: popularData,
    refetch: popularRefetch,
    isLoading: popularIsLoading,
  } = useGetPopularStoreWithoutInfiniteScroll({ queryKey, type: "all" });
  const dispatch = useDispatch();
  useEffect(() => {
    if (newArrivalStores.length === 0) {
      refetch();
    }
  }, [newArrivalStores]);

  useEffect(() => {
    if (data?.stores?.length > 0) {
      dispatch(setNewArrivalStores(data?.stores));
    }
  }, [data]);
  useEffect(() => {
    popularRefetch();
  }, []);
  useEffect(() => {
    if (popularData?.stores?.length > 0) {
      setStoreData(popularData?.stores);
    }
  }, [popularData]);
  const handleMenuClick = (index) => {
    setSelectedMenuIndex(index);

    if (index === 0) {
      //popular wise
      setStoreData(popularData?.stores);
    } else if (index === 1) {
      //top-rated wise
      const newStores = popularData?.stores.sort(
        (a, b) => b.avg_rating - a.avg_rating,
      );
      setStoreData(newStores);
    } else {
      //new wise
      const newStores = popularData?.stores.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
      setStoreData(newStores);
    }
  };

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
              <NearbyStoreCard
                key={index}
                configData={configData}
                item={item}
              />
            );
          })}
        </Slider>
      )}
    </SliderWrapper>
  );

  const getLayout = () => {
    if (getCurrentModuleType() === ModuleTypes.FOOD) {
      return (
        <>
          {newArrivalStores && newArrivalStores.length > 0 && (
            <>
              <CustomStackFullWidth
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                py="10px"
                mb={"10px"}
              >
                {isLoading ? (
                  <Skeleton variant="text" width="200px" />
                ) : (
                  <Typography
                    sx={{
                      fontSize: { xs: "18px", md: "24px" },
                      fontWeight: 700,
                      color: "neutral.1050",
                      lineHeight: 1.1,
                      letterSpacing: "-1.2px",
                    }}
                  >
                    {t("New Arrival Restaurants")}
                  </Typography>
                )}
              </CustomStackFullWidth>
              <FoodSliderWrapper>
                <Slider
                  {...foodNewArrivalsettings}
                  beforeChange={() => { isDragging.current = true; }}
                  afterChange={() => { setTimeout(() => { isDragging.current = false; }, 50); }}
                >
                  {newArrivalStores?.map((item, index) => (
                    <Box key={index}>
                      <Link
                        href={getStoreRedirectURL(item)}
                        onClick={(e) => { if (isDragging.current) e.preventDefault(); }}
                      >
                        <FoodNewArrivalCard>
                          <FoodNewArrivalImageBox>
                            <NextImage
                              src={item?.logo_full_url}
                              alt={item?.title}
                              height={93}
                              width={93}
                              objectFit="cover"
                              style={{ width: "100%", height: "100%" }}
                            />
                            <ClosedNow
                              active={item?.active}
                              open={item?.open}
                              borderRadius="12px"
                            />
                          </FoodNewArrivalImageBox>
                          <Box
                            sx={{
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "neutral.1050",
                              letterSpacing: "-0.42px",
                              lineHeight: 1.2,
                              textAlign: "center",
                              width: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item?.name}
                          </Box>
                        </FoodNewArrivalCard>
                      </Link>
                    </Box>
                  ))}
                </Slider>
              </FoodSliderWrapper>
            </>
          )}
        </>
      );
    } else if (
      getCurrentModuleType() === ModuleTypes.GROCERY ||
      getCurrentModuleType() === ModuleTypes.ECOMMERCE
    ) {
      return (
        <>
          {popularData && popularData?.stores?.length > 0 && (
            <>
              <CustomStackFullWidth
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                py="10px"
                mb={"10px"}
              >
                {isLoading ? (
                  <Skeleton variant="text" width="200px" />
                ) : (
                  <Typography
                    sx={{
                      fontSize: { xs: "18px", md: "24px" },
                      fontWeight: 700,
                      color: "neutral.1050",
                      lineHeight: 1.1,
                      letterSpacing: "-1.2px",
                    }}
                  >
                    {t("Top Brands")}
                  </Typography>
                )}
              </CustomStackFullWidth>
              <FoodSliderWrapper>
                <Slider {...foodNewArrivalsettings}>
                  {popularData?.stores?.map((item, index) => (
                    <Box key={index}>
                      <Link href={getStoreRedirectURL(item)}>
                        <FoodNewArrivalCard>
                          <FoodNewArrivalImageBox>
                            <NextImage
                              src={item?.logo_full_url}
                              alt={item?.title}
                              height={93}
                              width={93}
                              objectFit="cover"
                              style={{ width: "100%", height: "100%" }}
                            />
                            <ClosedNow
                              active={item?.active}
                              open={item?.open}
                              borderRadius="12px"
                            />
                          </FoodNewArrivalImageBox>
                          <Box
                            sx={{
                              fontSize: "14px",
                              fontWeight: 400,
                              color: "neutral.1050",
                              letterSpacing: "-0.42px",
                              lineHeight: 1.2,
                              textAlign: "center",
                              width: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item?.name}
                          </Box>
                        </FoodNewArrivalCard>
                      </Link>
                    </Box>
                  ))}
                </Slider>
              </FoodSliderWrapper>
            </>
          )}
        </>
      );
    } else {
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
                  <H2 text={t("Best Store Nearby")} component="h2" />
                )}
                <Menus
                  selectedMenuIndex={selectedMenuIndex}
                  setSelectedMenuIndex={handleMenuClick}
                  menus={menus}
                />
              </CustomStackFullWidth>
              {selectedMenuIndex === 0 && <>{sliderItems}</>}
              {selectedMenuIndex === 1 && <>{sliderItems}</>}
              {selectedMenuIndex === 2 && <>{sliderItems}</>}
            </>
          )}
        </>
      );
    }
  };

  return (
    <HomeComponentsWrapper sx={{ gap: "1rem" }}>
      {getLayout()}
    </HomeComponentsWrapper>
  );
};

export default NewArrivalStores;
