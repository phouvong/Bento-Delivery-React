import { Skeleton } from "@mui/material";
import React, { useEffect } from "react";
import {
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import CustomImageContainer from "../../../../CustomImageContainer";
import useGetBasicCampaigns from "../../../../../api-manage/hooks/react-query/useGetBasicCampaigns";
import Slider from "react-slick";
import { BannersWrapper } from "../../../banners";
import { getModuleId } from "helper-functions/getModuleId";
import { useRouter } from "next/router";

const PharmacyStaticBanners = () => {
  const router = useRouter();
  const { data, refetch, isFetched } = useGetBasicCampaigns();
  useEffect(() => {
    refetch()
  }, []);
  const handleBannerClick = (banner) => {
    router.push(
      {
        pathname: "/campaigns/[id]",
        query: { id: `${banner?.id}`, module_id: `${getModuleId()}` },
      },
      undefined,
      { shallow: true }
    );
  };

  const settings = {
    dots: false,
    infinite: data?.length > 2 && true,
    slidesToShow: data?.length == 1 ? 1 : 2,
    slidesToScroll: 1,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {!isFetched ? (
          <CustomStackFullWidth
              sx={{
                mt: "10px",
                "& .slick-list": {
                  marginRight: { xs: "-10px", sm: "-20px" },
                },
                "& .slick-slide": {
                  paddingRight: { xs: "10px", sm: "20px" },
                },
              }}
          >
                <Slider {...settings}>
                  {[...Array(2)].map((_, index) => (
                      <BannersWrapper key={index}>
                        <Skeleton
                            variant="rectangular"
                            height="100%"
                            width="100%"
                        />
                      </BannersWrapper>
                  ))}
                </Slider>
          </CustomStackFullWidth>
      ) : (
          data?.length > 0 && (
              <CustomStackFullWidth
                  sx={{
                    mt: "10px",
                    "& .slick-list": {
                      marginRight: { xs: "-10px", sm: "-20px" },
                    },
                    "& .slick-slide": {
                      paddingRight: { xs: "10px", sm: "20px" },
                    },
                  }}
              >
                <SliderCustom float="center">
                  <Slider {...settings}>
                    {data.map((item, index) => (
                        <BannersWrapper
                            key={index}
                            onClick={() => handleBannerClick(item)}
                        >
                          <CustomImageContainer
                              src={item?.image_full_url}
                              alt={item?.title}
                              height="100%"
                              width="100%"
                              objectFit="cover"
                              borderRadius="10px"
                              bg="#ddd"
                          />
                        </BannersWrapper>
                    ))}
                  </Slider>
                </SliderCustom>
              </CustomStackFullWidth>
          )
      )}
    </>
  );
};

PharmacyStaticBanners.propTypes = {};

export default PharmacyStaticBanners;
