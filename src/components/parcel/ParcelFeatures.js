import { useTheme } from "@emotion/react";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { Stack, styled } from "@mui/system";
import { useEffect } from "react";
import Slider from "react-slick";
import { t } from "i18next";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import useWhyChoose from "../../api-manage/hooks/react-query/percel/UseWhyChoose";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import WhyChooseSimmer from "../Shimmer/Parcel/WhyChooseSimmer";
import H1 from "../typographies/H1";
import NextImage from "components/NextImage";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 8,
  slidesToScroll: 1,
  swipeToSlide: true,

  responsive: [
    {
      breakpoint: 2400,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        infinite: false,
        // dots: false
      },
    },
    {
      breakpoint: 2000,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        infinite: false,
        // dots: false
      },
    },
    {
      breakpoint: 1600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        infinite: false,
        // dots: false
      },
    },
    {
      breakpoint: 1450,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
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
      breakpoint: 840,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2,
        swipeToSlide: true,
        infinite: false,
      },
    },
    {
      breakpoint: 790,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        swipeToSlide: true,
        infinite: false,
      },
    },
    {
      breakpoint: 700,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        swipeToSlide: true,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        swipeToSlide: true,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1.7,
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
        slidesToShow: 1.7,
        slidesToScroll: 1,
        swipeToSlide: true,
      },
    },
  ],
};
const SliderCustomStyle = styled(Stack)(({ theme }) => ({
  "& .slick-slider": {
    "& .slick-list": {
      "& .slick-track": {
        "& .slick-slide": {
          display: "flex",
          justifyContent: "center",
        },
      },
    },
  },
}));

const ParcelFeatures = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { data, refetch, isLoading } = useWhyChoose();

  useEffect(() => {
    refetch();
  }, []);

  const renderCard = (item, key) => (
    <Stack
      key={key}
      alignItems="center"
      justifyContent="center"
      maxWidth="275px"
      width="100%"
      display="flex !important"
      spacing={{ xs: 1, sm: 1.5, md: 2 }}
      sx={{
        img: {
          width: { xs: "90px", sm: "130px", md: "150px" },
          height: { xs: "90px", sm: "130px", md: "150px" },
          aspectRatio: "1",
          objectFit: "contain",
        },
      }}
    >
      <NextImage
        src={item?.image_full_url}
        width={150}
        height={150}
        objectFit="contain"
        smWidth="90px"
        smHeight="90px"
      />
      <Stack spacing={{ xs: 0.5, sm: 0.75, md: 1 }} padding="0 10px">
        <Typography
          textAlign="center"
          width="100%"
          maxWidth="275px"
          fontSize={{
            xs: "20px",
           
          }}
          fontWeight="700"
          color="neutral.1050"
          sx={{ wordWrap: "break-word" }}
          component="h3"
        >
          {item?.title}
        </Typography>
        <Typography
          width="100%"
          maxWidth="275px"
          fontSize={{
            xs: "11px",
            sm: "12px",
            md: "14px",
          }}
          color={theme.palette.neutral[400]}
          textAlign="center"
          lineHeight={1.4}
          sx={{ wordWrap: "break-word" }}
        >
          {item.short_description}
        </Typography>
      </Stack>
    </Stack>
  );
  const renderHeader = () => (
    <Stack
      justifyContent="center"
      alignItems="center"
      spacing={{ xs: 1, md: 0.5 }}
    >
      <H1
        text="Why Send With Us"
        component="h2"
        sx={{ fontSize: { xs: "22px", md: "36px" }, color: "neutral.1050" }}
      />
      <Typography
        textAlign="center"
        color={theme.palette.neutral[400]}
        fontSize={{ xs: "12px", md: "14px" }}
      >
        {t(
          "Experience smooth, secure, and dependable delivery from pickup to drop-off."
        )}
      </Typography>
    </Stack>
  );

  if (isLoading) {
    return (
      <CustomStackFullWidth
        alignItems="center"
        justifyContent="center"
        spacing={{ xs: 2, md: 3 }}
        mt={{ xs: "20px", sm: "30px", md: "50px" }}
      >
        {renderHeader()}
        <CustomStackFullWidth>
          {isMobile ? (
            <Grid container spacing={2} justifyContent="center">
              {[...Array(4)].map((_, index) => (
                <Grid
                  item
                  xs={6}
                  key={index}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <WhyChooseSimmer />
                </Grid>
              ))}
            </Grid>
          ) : (
            <SliderCustomStyle>
              <Slider {...settings}>
                {[...Array(4)].map((_, index) => (
                  <WhyChooseSimmer key={index} />
                ))}
              </Slider>
            </SliderCustomStyle>
          )}
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  }

  if (!data?.banners?.length) {
    return null;
  }

  return (
    <CustomStackFullWidth
      alignItems="center"
      justifyContent="center"
      spacing={{ xs: 2, md: 3 }}
      mt={{ xs: "20px", sm: "30px", md: "50px" }}
    >
      {renderHeader()}
      <CustomStackFullWidth>
        {isMobile ? (
          <Grid container spacing={2} justifyContent="center">
            {data?.banners.map((item, index) => (
              <Grid
                item
                xs={12}
                key={index}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {renderCard(item, index)}
              </Grid>
            ))}
          </Grid>
        ) : (
          <SliderCustomStyle>
            <Slider {...settings}>
              {data?.banners.map((item, index) => renderCard(item, index))}
            </Slider>
          </SliderCustomStyle>
        )}
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};

export default ParcelFeatures;
