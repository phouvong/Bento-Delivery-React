import { Skeleton, Typography, useTheme } from "@mui/material";
import {
  WhiteNext,
  WhitePrev,
} from "components/home/visit-again/SliderSettings";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import useGetStoresByFiltering from "../../../../../api-manage/hooks/react-query/store/useGetStoresByFiltering";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import { HomeComponentsWrapper } from "../../../HomePageComponents";
import NewStoreCard from "components/cards/newCard/NewStoreCard";

const FeaturedStores = (props) => {
  const { title, slide } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const pageParams = {
    type: "all",
    limit: 20,
    enabled: true,
  };
  const { data, isLoading } =
    useGetStoresByFiltering(pageParams);
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
    swipeToSlide: true,
    nextArrow: <WhiteNext />,
    prevArrow: <WhitePrev />,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          swipeToSlide: true,
          infinite: false,
        },
      },
      {
        breakpoint: 1250,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 2,
          swipeToSlide: true,
          infinite: false,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          swipeToSlide: true,
          infinite: false,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 2,
          swipeToSlide: true,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 479,
        settings: {
          slidesToShow: 1.7,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 420,
        settings: {
          slidesToShow: 1.3,
          slidesToScroll: 1,
          swipeToSlide: true,
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
              return <NewStoreCardSkeleton key={index} />;
            })}
          </Slider>
        </CustomStackFullWidth>
      ) : (
        <>
          {data && data?.pages?.length > 0 && featuredStores?.length > 0 && (
            <CustomStackFullWidth
              alignItems="flex-start"
              justifyContent="flex-start"
              spacing={1.25}
            >
              <Typography
                component="h2"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "16px", md: "18px" },
                  color: theme.palette.text.primary,
                }}
              >
                {t(title)}
              </Typography>
              <SliderCustom
                nopadding="true"
                sx={{
                  width: "100%",
                  "& .slick-track": { marginLeft: 0, marginRight: "auto" },
                  "& .slick-slide": { paddingRight: "16px" },
                  "& .slick-slide:last-child": { paddingRight: 0 },
                  "& .slick-slide > div": { width: "100%" },
                  "& .slick-slide > div > *": { width: "100% !important" },
                }}
              >
                <Slider {...settings}>
                  {featuredStores?.map((item, index) => (
                    <NewStoreCard
                      key={item?.id ?? index}
                      variant="normal"
                      item={item}
                      imageUrl={item?.cover_photo_full_url}
                    />
                  ))}
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
