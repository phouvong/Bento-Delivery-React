import { useRef, useState } from "react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { Skeleton, Stack, Typography, useTheme, styled } from "@mui/material";
import { Box } from "@mui/system";
import { t } from "i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import NewStoreCardSkeleton from "components/Shimmer/NewStoreCardSkeleton";
import { HomeComponentsWrapper } from "components/home/HomePageComponents";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import ExpressStoreCard from "components/cards/newCard/ExpressStoreCard";
import useGetQuickDeliveryStores from "api-manage/hooks/react-query/store/useGetQuickDeliveryStores";

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  // clip horizontal overflow but allow vertical for box-shadow
  "& .slick-list": {
    overflowX: "hidden",
    overflowY: "visible",
    padding: "8px 0",
  },
  "& .slick-track": {
    marginLeft: 0,
    marginRight: "auto",
  },
  "& .slick-slide": {
    paddingRight: "20px",
  },
  "& .slick-slide:first-child": {
    paddingLeft: 0,
  },
  // NewStoreCard has fixed width:300px — override to fill slide
  "& .slick-slide > div > *": {
    width: "100% !important",
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": {
      paddingRight: "12px",
    },
  },
}));

const QuickDeliverySection = ({ title, subtitle, cardVariant = "" }) => {
  const theme = useTheme();
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data, isLoading: popularIsLoading } = useGetQuickDeliveryStores({
    limit: 10,
    offset: 1,
    with_items: cardVariant === "withItems" ? 1 : null, // for ui food module no need to show item
  });

  const foodSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3.5,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 2.8,
          slidesToScroll: 2,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 695,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          swipeToSlide: true,
          initialSlide: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          swipeToSlide: true,
          initialSlide: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.4,
          slidesToScroll: 1,
          swipeToSlide: true,
          initialSlide: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 340,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          swipeToSlide: true,
          initialSlide: 1,
          infinite: false,
        },
      },
    ],
  };

  const grocerySettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2.8,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 2.8,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          swipeToSlide: true,
          initialSlide: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
          swipeToSlide: true,
          initialSlide: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 340,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
          swipeToSlide: true,
          initialSlide: 1,
          infinite: false,
        },
      },
    ],
  };

  const enhancedSettings =
    cardVariant === "withItems" ? grocerySettings : foodSettings;

  const stores = data?.stores ?? [];

  if (!popularIsLoading && !stores.length) return null;

  return (
    <HomeComponentsWrapper sx={{ gap: "1rem" }}>
      <SliderSectionHeader
        sliderRef={slider}
        currentSlide={currentSlide}
        totalSlides={stores.length}
        slidesToShow={cardVariant === "withItems" ? 3 : 4}
        sx={{ mb: "1rem" }}
        heading={
          popularIsLoading ? (
            <Skeleton variant="text" width="140px" />
          ) : (
            <Stack direction="row" alignItems="center" gap="12px">
              <Box
                sx={{
                  flexShrink: 0,
                  lineHeight: 0,
                  display: { xs: "none", md: "block" },
                }}
              >
                {customIcon(53, 48)}
              </Box>
              <Stack sx={{ gap: "2px" }}>
                <Typography
                  sx={{
                    fontSize: { xs: "18px", md: "24px" },
                    fontWeight: 700,
                    color: "neutral.1050",
                    lineHeight: 1.1,
                    letterSpacing: "-1.2px",
                  }}
                >
                  {t(title ?? "Quick Delivery")}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "neutral.500",
                    lineHeight: 1.3,
                    display: { xs: "none", md: "block" },
                  }}
                >
                  {t(
                    subtitle ?? "Get fastest order from your nearby restaurant",
                  )}
                </Typography>
              </Stack>
            </Stack>
          )
        }
      />
      <SliderWrapper>
        <Slider
          {...enhancedSettings}
          ref={slider}
          afterChange={(idx) => setCurrentSlide(idx)}
        >
          {popularIsLoading
            ? [...Array(4)].map((_, i) => <NewStoreCardSkeleton key={i} />)
            : stores.map((item, index) =>
                cardVariant === "withItems" ? (
                  <ExpressStoreCard
                    key={index}
                    store={item}
                    items={item?.top_items || []}
                  />
                ) : (
                  <NewStoreCard
                    key={index}
                    variant="normal"
                    item={item}
                    imageUrl={item?.cover_photo_full_url}
                  />
                ),
              )}
        </Slider>
      </SliderWrapper>
    </HomeComponentsWrapper>
  );
};

function customIcon(width = 53, height = 48) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 53 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M33.6274 10.4733C35.0189 10.3009 36.3073 10.8175 36.7079 12.3511C37.1675 14.1105 37.4675 15.9521 38.0533 17.6707C39.2176 17.8074 40.4149 18.179 41.5797 18.2048C42.0688 18.2156 41.8773 17.803 42.1727 17.5393C42.4786 17.2664 46.4598 16.7228 46.954 16.7603C47.0299 16.7661 47.1293 16.7612 47.1779 16.8276C47.3729 17.0941 46.8764 20.4051 46.7964 20.9743C46.7661 21.1902 46.7233 21.4415 46.5384 21.5727C46.16 21.8413 44.806 21.4294 44.3341 21.3403C45.1573 24.645 46.2356 27.947 47.0672 31.2432C47.162 31.2236 47.2575 31.208 47.3535 31.1966C49.3432 30.9662 51.3547 31.4757 52.8074 32.9903C52.9129 33.1005 52.9845 33.2422 53 33.3984C52.9834 33.4374 52.9725 33.4643 52.9444 33.4956C52.5255 33.96 40.1667 40.8484 40.005 40.8418C39.9418 40.8393 39.9188 40.8174 39.8808 40.7639C39.6694 40.4664 39.7953 39.7341 39.8306 39.3787C30.3409 39.1895 20.5814 39.4803 11.0694 39.3185C10.8603 39.3149 10.8346 39.317 10.6936 39.1726C10.587 38.7767 10.788 38.3325 10.9169 37.9335C10.3601 37.9816 7.02038 38.0479 6.6672 37.7862C6.38651 37.3617 6.65729 36.7811 7.0856 36.737C8.47008 36.5943 9.95686 36.7235 11.3474 36.6693L11.9359 35.5551C8.21192 35.696 4.34047 35.4782 0.605819 35.5662C-0.322615 35.5881 -0.103759 34.3467 0.720433 34.3363C1.51437 34.3263 2.30979 34.3403 3.10401 34.34L8.39495 34.3383C9.83434 34.3414 11.4103 34.3701 12.832 34.2793C13.1873 33.9015 13.5411 33.481 13.8833 33.0869C12.9021 33.1526 11.5758 33.1011 10.5705 33.0982L5.98788 33.1197C5.66146 33.1192 5.42071 33.1633 5.17687 32.9047C5.09337 32.5529 5.23996 32.0471 5.59429 31.9871C6.25224 31.8758 7.0609 31.9197 7.72784 31.9221L12.6824 31.914C13.4171 31.9105 14.6334 31.9326 15.3259 31.8274C15.6749 31.7744 17.0761 30.9397 17.4686 30.7097C17.184 30.7614 16.875 30.7708 16.5854 30.7746C14.8606 30.7978 13.1317 30.766 11.407 30.7717C10.4028 30.775 10.5225 29.5628 11.5166 29.5191C12.7983 29.4626 14.0927 29.499 15.377 29.4902C16.2544 29.4794 17.211 29.5375 18.0749 29.4117L18.5574 29.0125C19.1511 28.9244 20.1954 28.9489 20.8185 28.949C22.1799 28.9474 23.5412 28.9593 24.9024 28.9847C27.0604 29.0082 29.1918 28.8913 31.3574 29.0169C30.4178 30.7172 29.0933 32.5678 29.0749 34.6148C29.0539 36.9376 31.5639 36.8617 33.1125 36.8001C33.4879 34.9166 34.2623 32.7018 34.731 30.8256C34.928 30.0367 35.1892 29.2683 35.3355 28.4547C34.2946 28.1808 33.2749 27.7054 32.2248 27.4774C31.9774 27.4237 32.3666 28.2897 31.7153 28.3188C31.1317 28.3449 30.5309 28.3311 29.947 28.3289L26.5918 28.3199C23.8898 28.3151 21.1879 28.329 18.4865 28.3189C17.8224 28.3419 17.7937 28.1309 17.7093 27.5254C17.6017 26.7538 17.4248 26.2161 18.3996 26.1699C19.4422 26.1204 20.5004 26.1441 21.5404 26.1436C23.4796 26.1345 25.4189 26.139 27.3581 26.1571C26.9371 25.7803 26.5778 25.3291 26.42 24.76C25.8464 22.6916 28.3299 17.2929 29.3592 15.327C29.7004 14.6753 30.0776 14.0393 30.446 13.4041C31.3045 11.9235 32.0025 10.9623 33.6274 10.4733ZM32.1233 22.566C33.5991 22.9748 35.1107 23.8151 36.4467 24.3068C38.0939 24.9131 40.1257 25.6262 39.2807 27.987C38.312 30.693 37.132 33.6009 36.0629 36.2909C35.9929 36.467 35.9403 36.5811 36.0019 36.7704C36.1585 36.8431 36.2192 36.8029 36.4102 36.7817C43.7307 35.455 42.82 26.3285 42.345 20.4462C40.5308 20.0906 38.6962 20.049 36.8666 19.8497C35.5737 19.7088 35.5964 17.7565 35.003 17.1004C33.6165 18.9277 33.0568 20.6134 32.1233 22.566Z"
        fill="#6F5DD5"
      />
      <path
        d="M15.0089 12.5266C15.4276 12.4971 15.8602 12.5006 16.2804 12.5025C19.3582 12.5165 22.4372 12.4864 25.5146 12.5124C25.79 12.5147 26.1386 12.5753 26.3947 12.6722C26.8986 13.2129 26.3325 15.508 26.212 16.3332C25.9513 18.1043 25.6741 19.8726 25.3803 21.6379C25.2226 22.6145 25.0808 23.6205 24.8665 24.5757C24.7378 25.1493 24.3315 25.578 23.7805 25.6156C23.1816 25.6565 22.5874 25.6498 21.99 25.6482L18.9726 25.6381L9.17037 25.6093C8.65408 25.6079 5.46053 25.6526 5.258 25.5571C4.99513 25.3066 4.93462 24.9133 5.20362 24.633C5.32671 24.5059 5.48523 24.4243 5.65572 24.4003C6.05669 24.3401 7.4402 24.376 7.94709 24.3764L12.5554 24.3615C12.5821 23.9268 12.6534 23.5845 12.7345 23.1579C11.4 23.1755 10.0564 23.1773 8.72274 23.1506C8.47385 23.1456 7.9825 23.125 7.98468 22.794C7.9903 21.9399 8.65208 21.9475 9.26486 21.9528C10.4685 21.9629 11.6752 21.9318 12.8764 21.9774C12.9389 21.5969 13.0226 21.1912 13.0941 20.8099C12.5321 20.883 9.333 21.1537 10.5428 19.8004C10.8919 19.4098 12.7627 19.5468 13.3313 19.5561C13.441 18.4287 13.7011 17.1998 13.8686 16.0705C13.987 15.2727 14.1134 14.4734 14.2242 13.6721C14.3092 13.0583 14.5478 12.8534 15.0089 12.5266Z"
        fill="#DB793B"
      />
      <path
        d="M51.5241 35.0781C51.543 35.0833 51.59 35.1013 51.602 35.1141C55.0811 38.8823 51.19 45.1169 46.7296 45.1577C44.4761 45.1782 42.7127 44.0669 42.1233 41.6659C41.9836 40.8298 41.7495 40.5258 42.6782 40.0708C43.1319 39.8485 44.1959 39.0842 44.6406 39.0608L44.6809 39.1622C44.414 40.1568 44.6437 41.3671 45.4803 41.959C47.6685 43.5072 50.6983 41.0874 50.2736 38.4658C50.108 37.4439 49.5212 37.0495 48.7945 36.5182C49.2163 36.4021 51.0519 35.3371 51.5241 35.0781Z"
        fill="#BBAFFF"
      />
      <path
        d="M37.0977 2.83258C38.8911 2.72625 40.5408 3.63747 41.3717 5.352C41.6551 5.93682 41.757 6.51086 41.8876 7.14673C40.6572 6.67721 39.3299 6.14064 38.0898 5.7278C37.2214 8.61792 37.6496 8.93849 39.8258 10.5073L40.3683 10.8627C39.8801 11.3314 39.4649 11.5911 38.852 11.8257C38.2258 11.5149 37.6673 11.1555 37.0544 10.8291C35.845 10.1849 34.5879 9.54108 33.4111 8.83167C33.01 7.60298 33.1889 6.05704 33.858 4.9705C34.6604 3.66742 35.7265 3.15067 37.0977 2.83258Z"
        fill="#DB793B"
      />
      <path
        d="M12.5717 39.9346C13.4194 39.9175 14.2674 39.9187 15.1151 39.9381C15.1221 40.1623 15.1288 40.4218 15.1807 40.6377C15.3284 41.2584 15.7049 41.7907 16.2263 42.1155C17.3809 42.8288 18.9342 42.3528 19.8324 41.3887C20.1564 41.041 20.4893 40.3858 20.7278 39.9535C21.4808 39.8967 22.4835 39.9268 23.2576 39.9307C23.0391 40.7355 22.9217 41.1295 22.5022 41.8307C21.6156 43.1742 20.7045 44.1236 19.2389 44.7498C16.563 45.893 13.2082 44.7471 12.6056 41.5201C12.5465 41.2033 12.4604 40.2028 12.5717 39.9346Z"
        fill="#BBAFFF"
      />
    </svg>
  );
}

export default QuickDeliverySection;
