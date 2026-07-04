import {
  Box,
  Skeleton,
  Stack,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Typography } from "@mui/material";
// import { useGetRecommendProductsForHome } from "api-manage/hooks/react-query/useGetRecommendProductsForHome";
// replaced with useGetMostReviewed — Love Item section now shows best reviewed items (same card, same data shape)
import useGetMostReviewed from "api-manage/hooks/react-query/useGetMostReviewed";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { setYouWillLoveItems } from "redux/slices/storedData";
import "slick-carousel/slick/slick.css";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import NewProductCard from "components/cards/newCard/NewProductCard";
import ProductCardSimmer from "../../Shimmer/ProductCardSimmer";
import { HomeComponentsWrapper } from "../HomePageComponents";
import SliderSectionHeader from "../../common/SliderSectionHeader";
import Menus from "./Menus";
import useNewArrivals from "api-manage/hooks/react-query/product-details/useNewArrivals";

// ─── Styled ────────────────────────────────────────────────────────────────

const Container = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  paddingLeft: "32px",
  paddingRight: "0px",
  paddingTop: "24px",
  paddingBottom: "24px",
  boxShadow:
    "0px 1px 4px 0px rgba(0,0,0,0.05), 0px 1px 4px 0px rgba(0,0,0,0.10)",
  [theme.breakpoints.down("sm")]: {
    borderRadius: 0,
    boxShadow: "none",
    paddingLeft: "16px",
    paddingRight: "0px",
    paddingTop: "20px",
    paddingBottom: "10px",
    background:
      theme.palette.mode === "dark"
        ? `linear-gradient(180deg, ${theme.palette.warning.light}22 0%, ${theme.palette.background.default} 100%)`
        : "linear-gradient(180deg, #FFF1C2 0%, #F7F7F7 100%)",
  },
}));

const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
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
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

// ─── Main ──────────────────────────────────────────────────────────────────

const LoveItem = () => {
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [menu, setMenu] = useState([]);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [reRender, setReRender] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  // const params = { offset: 1, limit: 15 };
  const {
    data: newArrivalsData,
    refetch: newArrivalsRefetch,
    isLoading: newArrivalsIsLoading,
  } = useNewArrivals();
  const { data, refetch, isLoading, isFetched } = useGetMostReviewed({
    type: "all",
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    refetch();
    newArrivalsRefetch();
  }, []);

  const { youWillLoveItems } = useSelector((state) => state.storedData);
  const dispatch = useDispatch();

  const getCategoryIds = () => {
    const categoryIds = [];
    if (youWillLoveItems?.products) {
      youWillLoveItems.products.forEach((product) => {
        product?.category_ids?.forEach((categoryId) => {
          categoryIds.push(categoryId);
        });
      });
    }
    return categoryIds;
  };

  const uniqueCategories = [
    ...new Set(getCategoryIds()?.map((item) => JSON.stringify(item))),
  ].map(JSON.parse);

  useEffect(() => {
    if (youWillLoveItems?.products?.length === 0) refetch();
  }, [youWillLoveItems]);

  useEffect(() => {
    if (data) dispatch(setYouWillLoveItems(data));
  }, [data]);

  useEffect(() => {
    if (data?.total_size > 0) {
      setMenu(["Recommended", ...uniqueCategories?.map((item) => item.name)]);
      setFilteredData(setYouWillLoveItems.products);
    }
  }, [setYouWillLoveItems.products]);

  useEffect(() => {
    if (selectedMenuIndex === 0) {
      setFilteredData(youWillLoveItems?.products);
      setReRender(true);
    } else {
      const categoryWiseData = youWillLoveItems?.products?.filter((item) =>
        item?.category_ids?.some(
          (categoryId) =>
            uniqueCategories[selectedMenuIndex - 1]?.id === categoryId?.id,
        ),
      );
      setFilteredData(categoryWiseData);
      setReRender(true);
    }
  }, [selectedMenuIndex]);

  const enhancedSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5.1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.4,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 2.2,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 360,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 341,
        settings: {
          slidesToShow: 1.8,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
    ],
  };

  const activeProducts =
    activeTab === 0 ? data?.products ?? [] : newArrivalsData?.products ?? [];

  const isActiveLoading = activeTab === 0 ? !isFetched : newArrivalsIsLoading;

  if (isFetched && !data?.products?.length) return null;

  return (
    <Container>
      <CustomStackFullWidth spacing={2}>
        <SliderSectionHeader
          sliderRef={slider}
          currentSlide={currentSlide}
          totalSlides={activeProducts.length}
          slidesToShow={5}
          trailingAfterArrows
          heading={
            !isFetched ? (
              <Skeleton variant="text" width="180px" />
            ) : (
              <Typography
                sx={{
                  fontSize: { xs: "18px", md: "24px" },
                  fontWeight: 700,
                  color: "neutral.1050",
                  lineHeight: 1.1,
                  letterSpacing: "-1.2px",
                  whiteSpace: "nowrap",
                }}
              >
                {t("Items You Will Love")}
              </Typography>
            )
          }
          trailing={
            <Stack
              direction="row"
              gap="8px"
              alignItems="center"
              sx={{ flexShrink: 0, flexWrap: "nowrap", marginInlineEnd: "2px" }}
            >
              {["Top Rated", "New Arrival"].map((label, i) => {
                const isActive = activeTab === i;
                return (
                  <Box
                    key={i}
                    onClick={() => setActiveTab(i)}
                    sx={{
                      height: 32,
                      px: "8px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      backgroundColor: isActive
                        ? "primary.main"
                        : "transparent",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "12px",
                          md: "14px",
                        },
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#fff" : "neutral.500",
                        letterSpacing: isActive ? "-0.48px" : "-0.42px",
                        lineHeight: 1.1,
                        whiteSpace: "nowrap",
                        textTransform: "capitalize",
                      }}
                    >
                      {t(label)}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          }
          sx={{ pr: { xs: "16px", md: "32px" } }}
        />
        {!isActiveLoading && activeProducts.length === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            gap="8px"
            sx={{ py: { xs: "24px", md: "32px" }, width: "100%" }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: "background.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="fi fi-rs-search-alt"
                style={{
                  fontSize: "22px",
                  lineHeight: 1,
                  display: "flex",
                  color: theme.palette.neutral[500],
                }}
              />
            </Box>
            <Typography
              sx={{
                fontSize: { xs: "14px", md: "16px" },
                fontWeight: 500,
                color: "neutral.500",
                lineHeight: 1.3,
              }}
            >
              {t("No results found")}
            </Typography>
          </Stack>
        ) : (
          <SliderWrapper>
            <Slider
              {...enhancedSettings}
              ref={slider}
              afterChange={(idx) => setCurrentSlide(idx)}
            >
              {isActiveLoading
                ? [...Array(3)].map((_, i) => <ProductCardSimmer key={i} />)
                : activeProducts.map((item) => (
                    <div key={item?.id}>
                      <NewProductCard
                        variant="vertical"
                        item={item}
                        cardWidth={{ xs: "100%", md: "170px" }}
                      />
                    </div>
                  ))}
            </Slider>
          </SliderWrapper>
        )}
      </CustomStackFullWidth>
    </Container>
  );
};

LoveItem.propTypes = {};

export default LoveItem;
