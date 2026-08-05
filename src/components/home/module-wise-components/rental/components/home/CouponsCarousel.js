import { useState } from "react";
import { alpha, Button, Skeleton, useTheme } from "@mui/material";
import Slider from "react-slick";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { HomeComponentsWrapper } from "../../../../HomePageComponents";
import { Box } from "@mui/system";
import H2 from "components/typographies/H2";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  NextFood,
  PrevFood,
} from "components/home/best-reviewed-items/SliderSettings";
import CouponItems from "components/home/module-wise-components/rental/components/global/CouponItems";
import { useGetCouponLists } from "../../rental-api-manage/hooks/react-query/coupon/useCouponsLists";

const VehicleCategories = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [isHover, setIsHover] = useState(false);

  const { data, isFetching } = useGetCouponLists();

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 3.1,
    cssEase: "ease-in-out",
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    variableHeight: true,
    prevArrow: isHover && <PrevFood />,
    nextArrow: isHover && <NextFood />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      {data?.length > 0 && (
        <HomeComponentsWrapper
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          bgcolor={
            theme.palette.mode === "dark"
              ? theme.palette.background.paper
              : alpha(theme.palette.primary.main, 0.05)
          }
          sx={{
            padding: "20px 20px 1px",
            borderRadius: 2,
            cursor: "pointer",
            ".slick-slide": {
              padding: "10px",
              ".MuiBox-root": {
                overflow: "visible",
              },
            },
          }}
        >
          <CustomStackFullWidth
            alignItems="center"
            justyfyContent="center"
            mb={3}
            spacing={1}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <CustomStackFullWidth
              alignItems="center"
              justifyContent="space-between"
              direction="row"
            >
              {isFetching ? (
                <Skeleton variant="text" width="110px" />
              ) : (
                <H2
                  text={t("Coupons")}
                  component="h2"
                  sx={{
                    color: (theme) => theme.palette.neutral[1000],
                  }}
                />
              )}
              {isFetching ? (
                <Skeleton width="100px" variant="80px" />
              ) : (
                <Link
                  href={{
                    pathname: "/profile",
                    query: { page: "coupons" },
                  }}
                  legacyBehavior
                >
                  <Button
                    variant="text"
                    sx={{
                      transition: "all ease 0.5s",
                      textTransform: "capitalize",
                      "&:hover": {
                        letterSpacing: "0.03em",
                      },
                    }}
                  >
                    {t("See all")}
                  </Button>
                </Link>
              )}
            </CustomStackFullWidth>

            <CustomBoxFullWidth
              sx={{
                ".slick-track ": {
                  marginLeft: "0px",
                  marginRight: "0px",
                },
              }}
            >
              {isFetching ? (
                <Slider {...settings}>
                  {[...Array(4)].map((item, index) => {
                    return (
                      <Skeleton
                        key={index}
                        variant="rounded"
                        height={100}
                        width={335}
                      />
                    );
                  })}
                </Slider>
              ) : (
                <Slider {...settings}>
                  {data?.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        img: {
                          borderRadius: ".5rem",
                        },
                      }}
                    >
                      <CouponItems data={item} />
                    </Box>
                  ))}
                </Slider>
              )}
            </CustomBoxFullWidth>
          </CustomStackFullWidth>
        </HomeComponentsWrapper>
      )}
    </>
  );
};

export default VehicleCategories;
