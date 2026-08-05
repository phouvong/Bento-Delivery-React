import { useState, useRef } from "react";
import { Typography, useTheme } from "@mui/material";
import Slider from "react-slick";
import { useRouter } from "next/router";
import { getLanguage } from "helper-functions/getLanguage";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { RTL } from "components/rtl";
import { HomeComponentsWrapper } from "../../../../HomePageComponents";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import {
  NextFood,
  PrevFood,
} from "components/home/best-reviewed-items/SliderSettings";
import RentalProviderCard from "../global/RentalProviderCard";
import {
  DEMO_PROVIDERS,
  normalizeRentalProvider,
} from "../global/rentalProviderModel";

const VerifiedProviders = ({ data, isLoading }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const [isHover, setIsHover] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const sliderRef = useRef(null);

  // Backend response can come back as either `data.providers`, `data.stores`,
  // or just a top-level array. Normalize each entry through
  // `normalizeRentalProvider` so the card props stay stable.
  const apiProvidersRaw =
    data?.providers ?? data?.stores ?? data?.data ?? data ?? null;
  const providers = Array.isArray(apiProvidersRaw)
    ? apiProvidersRaw.map(normalizeRentalProvider)
    : [];

  // Defensive: even if a parent forgets to gate on the list length, the
  // section bails out here so no empty / demo content sneaks through.
  if (providers.length === 0) return null;

  const handleProviderClick = (provider) => {
    const slugOrId = provider?.slug || provider?.id;
    if (!slugOrId) return;
    const moduleParam =
      typeof router.query.module === "string" ? router.query.module : "rental";
    router.push({
      pathname: `/rental/provider/${slugOrId}`,
      query: { module: moduleParam },
    });
  };

  const updateArrowVisibility = (currentSlide) => {
    const totalSlides = providers.length;
    const slidesToShow =
      window.innerWidth >= 992 ? 4 : window.innerWidth >= 576 ? 2 : 1;
    setShowLeftArrow(currentSlide > 0);
    setShowRightArrow(currentSlide < totalSlides - slidesToShow);
  };

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 3.5,
    cssEase: "ease-in-out",
    autoplay: false,
    speed: 600,
    swipeToSlide: true,
    prevArrow: isHover && showLeftArrow && <PrevFood displayNoneOnMobile />,
    nextArrow: isHover && showRightArrow && <NextFood displayNoneOnMobile />,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3.2, swipeToSlide: true },
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: 2.5, swipeToSlide: true },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, swipeToSlide: true },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1.2, swipeToSlide: true },
      },
    ],
    afterChange: (current) => updateArrowVisibility(current),
  };

  return (
    <HomeComponentsWrapper
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      sx={{
        cursor: "default",

        ".slick-slide": {
          padding: "0 6px",
          ".MuiBox-root": {
            overflow: "visible",
          },
        },
        ".slick-list": {
          margin: "0 -6px",
        },
      }}
    >
      <CustomStackFullWidth
        alignItems="center"
        justifyContent="center"
        mb={2}
        spacing={1}
      >
        <CustomStackFullWidth
          alignItems="flex-start"
          justifyContent="flex-start"
          direction="column"
          spacing={0.5}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "20px", md: "24px" },
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
            }}
          >
            {t("Verified Providers")}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "13px", md: "14px" },
              fontWeight: 400,
              color: theme.palette.neutral[500],
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.4,
            }}
          >
            {t("Trust & secure buying experience.")}
          </Typography>
        </CustomStackFullWidth>

        <RTL direction={lanDirection}>
          <CustomBoxFullWidth
            sx={{
              ".slick-track": {
                marginLeft: "0px",
                marginRight: "0px",
                display: "flex",
              },
            }}
          >
            <Slider ref={sliderRef} {...settings}>
              {providers.map((provider) => (
                <Box key={provider.id}>
                  <RentalProviderCard
                    data={provider}
                    onClick={() => handleProviderClick(provider)}
                  />
                </Box>
              ))}
            </Slider>
          </CustomBoxFullWidth>
        </RTL>
      </CustomStackFullWidth>
    </HomeComponentsWrapper>
  );
};

export default VerifiedProviders;
