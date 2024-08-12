import React, { useEffect } from "react";
import Slider from "react-slick";
import useGetStoresByFiltering from "../../../../../api-manage/hooks/react-query/store/useGetStoresByFiltering";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import PharmacyFeaturedStoreCard from "../../../../cards/PharmacyFeaturedStoreCard";
import H2 from "../../../../typographies/H2";
import { HomeComponentsWrapper } from "../../../HomePageComponents";
import { settings } from "./SliderSettings";
import { Skeleton } from "@mui/material";
import SpecialOfferCardShimmer from "../../../../Shimmer/SpecialOfferCardSimmer";
import { getImageUrl } from "utils/CustomFunctions";
import {
  WhiteNext,
  WhitePrev,
} from "components/home/visit-again/SliderSettings";

const FeaturedStores = (props) => {
  const { title, configData, slide } = props;
  const type = "all";
  const offset = 1;
  const page_limit = 20;
  const pageParams = {
    type,
    offset,
    limit: page_limit,
  };
  const { data, refetch, fetchNextPage, isFetchingNextPage, isLoading } =
    useGetStoresByFiltering(pageParams);
  useEffect(() => {
    refetch();
  }, []);
  let featuredStores = [];
  if (data) {
    if (data?.pages?.length > 0) {
      if (data?.pages?.[0]?.stores?.length > 0) {
        data?.pages?.[0]?.stores?.forEach(
          (item) => item?.featured === 1 && featuredStores.push(item)
        );
      }
    }
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slide ?? 4,
    slidesToScroll: 1,
    nextArrow: <WhiteNext />,
    prevArrow: <WhitePrev />,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: false,
        },
      },
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 479,
        settings: {
          slidesToShow: 1.7,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 420,
        settings: {
          slidesToShow: 1.3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <HomeComponentsWrapper>
      {isLoading ? (
        <CustomStackFullWidth spacing={1}>
          <Skeleton width="200px" />
          <Slider {...settings}>
            {[...Array(6)].map((item, index) => {
              return <SpecialOfferCardShimmer key={index} width="290px" />;
            })}
          </Slider>
        </CustomStackFullWidth>
      ) : (
        <>
          {data && data?.pages?.length > 0 && featuredStores?.length > 0 && (
            <CustomStackFullWidth
              alignItems="flex-start"
              justyfyContent="flex-start"
            >
              {isLoading ? (
                <Skeleton variant="text" width="110px" />
              ) : (
                <H2 text={title} />
              )}
              <SliderCustom
                nopadding="true"
                sx={{
                  "& .slick-slider": {
                    "& .slick-list": {
                      paddingY: "16px",
                    },
                  },
                }}
              >
                <Slider {...settings}>
                  {featuredStores?.map((item, index) => {
                    const {
                      name,
                      address,
                      logo,
                      cover_photo,
                      total_items,
                      slug,
                      id,
                      module_id,
                      zone_id,
                    } = item;
                    const info = {
                      name,
                      address,
                      logo: item?.logo_full_url,
                      cover_photo: item?.cover_photo_full_url,
                      total_items,
                      slug,
                      id,
                      module_id,
                      zone_id,
                    };
                    return (
                      <PharmacyFeaturedStoreCard data={info} key={index} />
                    );
                  })}
                </Slider>
              </SliderCustom>
            </CustomStackFullWidth>
          )}
        </>
      )}
    </HomeComponentsWrapper>
  );
};

FeaturedStores.propTypes = {};

export default FeaturedStores;
