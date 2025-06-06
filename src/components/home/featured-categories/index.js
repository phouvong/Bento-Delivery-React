import React, { useEffect, useRef } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import {
  CustomBoxFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import { styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { useGetFeaturedCategories } from "api-manage/hooks/react-query/all-category/all-categorys";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { setFeaturedCategories } from "redux/slices/storedData";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import FoodCategoryCard from "../../cards/FoodCategoryCard";
import PharmacyCategoryCard from "../../cards/PharmacyCategoryCard";
import ShopCategoryCard from "../../cards/ShopCategoryCard";
import { HomeComponentsWrapper } from "../HomePageComponents";
import FeaturedItemCard from "./card";
import { moduleWiseNext, moduleWisePrev } from "./sliderSettings";

export const ButtonLeft = styled(CustomButtonPrimary)(
  ({ theme, language_direction }) => ({
    minWidth: "20px",
    width: "10px",
    height: "30px",
    borderRadius: "50%",
    transform: language_direction === "rtl" && "rotate(180deg)",
  })
);
export const ButtonRight = styled(CustomButtonPrimary)(({ theme }) => ({
  minWidth: "20px",
  width: "10px",
  height: "30px",
  borderRadius: "50%",
  color: "black",
  background: theme.palette.neutral[200],
  "&:hover": {
    background: theme.palette.neutral[400],
  },
}));

const FeaturedCategories = () => {
  const dispatch = useDispatch();
  const { featuredCategories } = useSelector((state) => state.storedData);
  const slider = useRef(null);
  const { data, refetch, isFetched } = useGetFeaturedCategories();
  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data) {
      dispatch(setFeaturedCategories(data?.data));
    }
  }, [data]);

  const moduleWiseCard = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return (
          <CustomBoxFullWidth
            sx={{
              "& .slick-slider": {
                paddingTop: {
                  xs: "22px",
                  md: "30px",
                },
                paddingBottom: {
                  xs: "4px",
                  md: "30px",
                },
              },
            }}
          >
            <Slider {...settings} ref={slider}>
              {[...featuredCategories].reverse().map((item, index) => {
                return (
                  <FeaturedItemCard
                    key={index}
                    image={item?.image_full_url}
                    title={item?.name}
                    id={item?.id}
                    slug={item?.slug}
                  />
                );
              })}
            </Slider>
          </CustomBoxFullWidth>
        );
      case ModuleTypes.PHARMACY:
        return (
          <Slider {...settings} ref={slider}>
            {[...featuredCategories].reverse()?.map((item, index) => {
              return (
                <PharmacyCategoryCard
                  key={index}
                  image={item?.image_full_url}
                  title={item?.name}
                  slug={item?.slug}
                  id={item?.id}
                />
              );
            })}
          </Slider>
        );
      case ModuleTypes.ECOMMERCE:
        return (
          <Slider {...shopCategorySliderSettings} ref={slider}>
            {featuredCategories?.map((item, index) => {
              return (
                <ShopCategoryCard
                  key={index}
                  imageUrl={item?.image_full_url}
                  item={item}
                />
              );
            })}
          </Slider>
        );
      case ModuleTypes.FOOD:
        return (
          <Slider {...foodCategorySliderSettings} ref={slider}>
            {featuredCategories?.map((item, index) => {
              return (
                <FoodCategoryCard
                  key={item?.id}
                  id={item?.id}
                  categoryImage={item?.image}
                  name={item?.name}
                  slug={item?.slug}
                  categoryImageUrl={item?.image_full_url}
                  height="40px"
                />
              );
            })}
          </Slider>
        );
    }
  };

  const moduleWiseCardShimmer = () => {
    switch (getCurrentModuleType()) {
      case ModuleTypes.GROCERY:
        return (
          <CustomBoxFullWidth
              sx={{
                "& .slick-slider": {
                  paddingTop: {
                    xs: "22px",
                    md: "30px",
                  },
                  paddingBottom: {
                    xs: "4px",
                    md: "30px",
                  },
                },
              }}
          >
            <Slider {...settings} ref={slider}>
              {[...Array(10)]?.map((item, index) => {
                return <FeaturedItemCard key={index} onlyshimmer />;
              })}
            </Slider>
          </CustomBoxFullWidth>
        );

      case ModuleTypes.PHARMACY:
        return (
          <Slider {...settings} ref={slider}>
            {[...Array(10)]?.map((_, index) => {
              return <PharmacyCategoryCard key={index} onlyshimmer />;
            })}
          </Slider>
        );
      case ModuleTypes.ECOMMERCE:
        return (
          <Slider {...shopCategorySliderSettings} ref={slider}>
            {[...Array(6)]?.map((_, index) => {
              return <ShopCategoryCard key={index} onlyshimmer />;
            })}
          </Slider>
        );
      case ModuleTypes.FOOD:
        return (
          <Slider {...foodCategorySliderSettings} ref={slider}>
            {[...Array(8)]?.map((item, index) => {
              return <FoodCategoryCard key={index} onlyshimmer />;
            })}
          </Slider>
        );
    }
  };

  const shopCategorySliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: moduleWiseNext(),
    prevArrow: moduleWisePrev(),

    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 1210,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 980,
        settings: {
          slidesToShow: 3.8,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 840,
        settings: {
          slidesToShow: 3.2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 785,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 730,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 630,
        settings: {
          slidesToShow: 2.3,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 570,
        settings: {
          slidesToShow: 2.1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1.8,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 460,
        settings: {
          slidesToShow: 1.6,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 374,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 280,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8.5,

    nextArrow: moduleWiseNext(),
    prevArrow: moduleWisePrev(),
    currentSlide: 0,
    rtl: true,

    responsive: [
      {
        breakpoint: 1650,
        settings: {
          slidesToShow: 8,
          //slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 7,
          //slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6.5,
          //slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 840,
        settings: {
          slidesToShow: 6.5,
          //slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 790,
        settings: {
          slidesToShow: 6,
          //slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 5,
          //slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4.2,
          //slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 475,
        settings: {
          slidesToShow: 3.9,
          //slidesToScroll: 1,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 3.7,
          //slidesToScroll: 1,
        },
      },
      {
        breakpoint: 420,
        settings: {
          slidesToShow: 3.3,
          //slidesToScroll: 1,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 2.7,
          //slidesToScroll: 1,
        },
      },
    ],
  };

  const foodCategorySliderSettings = {
    dots: false,
    infinite: featuredCategories.length >= 7,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 3,
    // autoplay: true,
    nextArrow: moduleWiseNext(),
    prevArrow: moduleWisePrev(),
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 3,
          infinite: featuredCategories.length >= 8,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: featuredCategories.length >= 6,
        },
      },
      {
        breakpoint: 850,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          infinite: featuredCategories.length >= 5,
        },
      },
      {
        breakpoint: 790,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 3,
          infinite: featuredCategories.length >= 5,
        },
      },

      {
        breakpoint: 600,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 3,
          initialSlide: 2,
          infinite: featuredCategories.length >= 7,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          infinite: featuredCategories.length >= 5,
        },
      },
    ],
  };

  return (
    <CustomBoxFullWidth sx={{ mt: "20px" }}>
      {!isFetched ? (
        <HomeComponentsWrapper>
          <SliderCustom
              sx={{
                "& .slick-slider": {
                  "& .slick-slide": {
                    padding: { xs: "0px", md: "6px" },
                    paddingBottom: {
                      xs: "5px",
                      sm: "10px",
                      md: "20px !important",
                    },
                  },
                },
              }}>
            {moduleWiseCardShimmer()}
          </SliderCustom>
        </HomeComponentsWrapper>
      ) : (
        featuredCategories &&
        featuredCategories.length > 0 && (
          <HomeComponentsWrapper>
            {featuredCategories && featuredCategories.length > 0 && (
              <SliderCustom
                sx={{
                  "& .slick-slider": {
                    "& .slick-slide": {
                      padding: { xs: "0px", md: "6px" },
                      paddingBottom: {
                        xs: "5px",
                        sm: "10px",
                        md: "20px !important",
                      },
                    },
                  },
                }}
              >
                {moduleWiseCard()}
                {/*{moduleWiseCardShimmer()}*/}
              </SliderCustom>
            )}
          </HomeComponentsWrapper>
        )
      )}
    </CustomBoxFullWidth>
  );
};

export default FeaturedCategories;
