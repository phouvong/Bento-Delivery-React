import { useRef, useState } from "react";
import { Skeleton, Typography, styled } from "@mui/material";
import { Box } from "@mui/system";
import { t } from "i18next";
import { useRouter } from "next/router";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import NextImage from "components/NextImage";
import { handleServiceRedirect } from "helper-functions/handleProductRedirect";
import useGetServiceCampaigns from "components/home/module-wise-components/service/service-api-manage/hooks/react-query/campaigns/useGetServiceCampaigns";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

const ImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  borderRadius: "8px",
  aspectRatio: "1 / 1",
  overflow: "hidden",
  cursor: "pointer",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  "&:hover img": {
    transform: "scale(1.04)",
  },
}));

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-list": {
    overflowX: "hidden",
    overflowY: "visible",
    padding: "0",
  },
  "& .slick-track": {
    marginLeft: 0,
    marginRight: "auto",
  },
  "& .slick-slide": {
    paddingRight: "16px",
  },
  "& .slick-slide:first-child": {
    paddingLeft: 0,
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": {
      paddingRight: "12px",
    },
  },
}));

const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 1,
  swipeToSlide: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 1450,
      settings: { slidesToShow: 5.5, slidesToScroll: 1, infinite: false, swipeToSlide: true },
    },
    {
      breakpoint: 1024,
      settings: { slidesToShow: 4.5, slidesToScroll: 1, infinite: false, swipeToSlide: true },
    },
    {
      breakpoint: 760,
      settings: { slidesToShow: 3.5, slidesToScroll: 1, infinite: false, swipeToSlide: true },
    },
    {
      breakpoint: 600,
      settings: { slidesToShow: 2.8, slidesToScroll: 1, infinite: false, swipeToSlide: true },
    },
    {
      breakpoint: 480,
      settings: { slidesToShow: 2.2, slidesToScroll: 1, infinite: false, swipeToSlide: true },
    },
  ],
};

const ServiceCampaigns = () => {
  const { data, isFetching } = useGetServiceCampaigns();
  const router = useRouter();
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleClick = (campaign) => {
    handleServiceRedirect(campaign, router, "campaign");
  };

  if (!isFetching && !data?.length) {
    return null;
  }

  return (
    <HomeComponentsWrapper sx={{ gap: "1rem" }}>
      <SliderSectionHeader
        sliderRef={slider}
        currentSlide={currentSlide}
        totalSlides={data?.length ?? 0}
        slidesToShow={6}
        heading={
          <Typography
            sx={{
              fontSize: { xs: "18px", md: "24px" },
              fontWeight: 700,
              color: "neutral.1050",
              lineHeight: 1.1,
              letterSpacing: "-1.2px",
            }}
            component="h2"
          >
            {t("Just For You")}
          </Typography>
        }
      />
      <SliderWrapper sx={{ mt: "1rem" }}>
        <Slider
          {...sliderSettings}
          ref={slider}
          afterChange={(idx) => setCurrentSlide(idx)}
        >
          {isFetching
            ? [...Array(6)].map((_, index) => (
                <ImageContainer key={index}>
                  <Skeleton variant="rectangle" height="100%" width="100%" />
                </ImageContainer>
              ))
            : data?.map((item, index) => (
                <ImageContainer key={index} onClick={() => handleClick(item)}>
                  <NextImage
                    src={item?.thumbnail_full_url}
                    alt={item?.name}
                    height={160}
                    width={160}
                    objectFit="cover"
                  />
                </ImageContainer>
              ))}
        </Slider>
      </SliderWrapper>
    </HomeComponentsWrapper>
  );
};

export default ServiceCampaigns;
