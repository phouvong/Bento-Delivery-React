import {
  Grid,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import NewProductCard from "components/cards/newCard/NewProductCard";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import useGetMostReviewed from "../../../api-manage/hooks/react-query/useGetMostReviewed";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { setBestReviewedItems } from "redux/slices/storedData";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import ProductCard from "../../cards/ProductCard";
import CustomImageContainer from "../../CustomImageContainer";
import ProductCardSimmer from "../../Shimmer/ProductCardSimmer";
import H2 from "../../typographies/H2";
import { HomeComponentsWrapper } from "../HomePageComponents";
import { loveItemSettings } from "../love-item/loveItemSettings";
import Menus from "./Menus";
import { createEnhancedArrows } from "../../common/EnhancedSliderArrows";

const BestReviewedItems = (props) => {
  const { title, info, bannerIsLoading, isPharmacy } = props;
  const url = info?.best_reviewed_section_banner_full_url;
  const [menu, setMenu] = useState([]);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [reRender, setReRender] = useState(false);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const SliderRef = useRef(null);
  const {
    data,
    refetch,
    isRefetching: itemIsLoading,
    isLoading,
    isFetching,
  } = useGetMostReviewed({ type: "all" });
  const { bestReviewedItems } = useSelector((state) => state.storedData);
  const dispatch = useDispatch();

  const getCategoryIds = () => {
    const categoryIds = [];
    if (bestReviewedItems && bestReviewedItems.products) {
      bestReviewedItems.products.forEach((product) => {
        if (product?.category_ids) {
          product?.category_ids.forEach((categoryId) => {
            categoryIds.push(categoryId);
          });
        }
      });
    }

    return categoryIds;
  };
  const uniqueCategories = [
    ...new Set(getCategoryIds().map((item) => JSON.stringify(item))),
  ].map(JSON.parse);
  useEffect(() => {
    if (bestReviewedItems.products.length === 0) {
      refetch();
    }
  }, [bestReviewedItems]);
  useEffect(() => {
    if (data) {
      dispatch(setBestReviewedItems(data));
    }
  }, [data]);
  useEffect(() => {
    if (data) {
      if (uniqueCategories?.length > 0) {
        setMenu(["All", ...uniqueCategories?.map((item) => item.name)]);
      }
      setFilteredData(bestReviewedItems.products);
    }
  }, [bestReviewedItems.products]);
  console.log({ uniqueCategories });

  useEffect(() => {
    if (selectedMenuIndex === 0) {
      setFilteredData(bestReviewedItems.products);
      setReRender(true);
    } else {
      const categoryWiseData = bestReviewedItems?.products?.filter((item) => {
        return item?.category_ids?.some((categoryId) => {
          return uniqueCategories[selectedMenuIndex - 1]?.id === categoryId?.id;
        });
      });

      setFilteredData(categoryWiseData);
      setReRender(true);
    }
  }, [selectedMenuIndex]);

  console.log("vvvv", getCategoryIds());

  const slides = () =>
    filteredData?.map((product) =>
      isPharmacy ? (
        <div key={product?.id}>
          <NewProductCard
            variant="vertical"
            item={product}
            isPharmacy
            cardWidth={{ xs: "150px", md: "170px" }}
          />
        </div>
      ) : (
        <ProductCard
          key={product?.id}
          item={product}
          cardheight="340px"
          cardFor="vertical"
          cardType="vertical-type"
        />
      ),
    );

  const bestReviewedSliderSettings = {
    //centerMode: true,
    initialSlide: 0,
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: info?.best_reviewed_section_banner ? 4 : 5,
    slidesToScroll: 2,
    cssEase: "linear",
    ...createEnhancedArrows(isSliderHovered, {
      displayNoneOnMobile: true,
      variant: "primary",
      noBackground: true,
    }),
    responsive: [
      {
        breakpoint: 350,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: false,
        },
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1.7,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: info?.best_reviewed_section_banner ? 2.6 : 2.1,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
    ],
  };

  const foodBestReviewedSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesPerRow: 1,
    rows: 2,
    slidesToShow: info?.best_reviewed_section_banner ? 2.1 : 2.7,
    slidesToScroll: 1,
    swipeToSlide: true,
    cssEase: "linear",
    ...createEnhancedArrows(isSliderHovered, {
      displayNoneOnMobile: true,
      variant: "primary",
      noBackground: true,
    }),
    responsive: [
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 1.1,
          slidesPerRow: 1,
          rows: 2,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1.1,
          slidesPerRow: 1,
          rows: 2,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1.34,
          slidesPerRow: 1,
          rows: 2,
          slidesToScroll: 2,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1.45,
          slidesPerRow: 1,
          rows: 2,
          slidesToScroll: 2,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1.9,
          slidesPerRow: 1,
          rows: 2,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 1150,
        settings: {
          slidesToShow: 2.1,
          slidesPerRow: 1,
          rows: 2,
          slidesToScroll: 3,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2.3,
          slidesPerRow: 1,
          rows: 2,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
    ],
  };

  return (
    <>
      {getCurrentModuleType() === ModuleTypes.FOOD ? (
        <HomeComponentsWrapper>
          {bestReviewedItems && bestReviewedItems?.products?.length > 0 && (
            <>
              <CustomStackFullWidth
                alignItems={isSmall ? "center" : "flex-start"}
                justyfyContent="center"
                spacing={1}
              >
                <H2 text={title} textAlign="left" component="h2" />
                <CustomBoxFullWidth>
                  <Grid
                    container
                    spacing={2}
                    alignItems="stretch"
                    sx={{
                      "& .MuiGrid-item": {
                        display: "flex",
                        flexDirection: "column",
                      },
                    }}
                  >
                    {/* Banner — 4 col desktop only */}
                    {url && (
                      <Grid
                        item
                        xs={0}
                        md={4}
                        sx={{ display: { xs: "none", md: "block" } }}
                      >
                        <Box
                          sx={{
                            flex: 1,
                            borderRadius: "12px",
                            overflow: "hidden",
                            position: "relative",
                            "&:hover img": {
                              transform: "scale(1.05)",
                              transition: "transform 0.3s ease",
                            },
                          }}
                        >
                          {bannerIsLoading ? (
                            <Skeleton
                              variant="rectangular"
                              height="100%"
                              width="100%"
                            />
                          ) : (
                            <Box sx={{ position: "absolute", inset: 0 }}>
                              <CustomImageContainer
                                src={url}
                                height="100%"
                                width="100%"
                                borderRadius="12px"
                                objectfit="cover"
                              />
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    )}

                    {/* Slider — 8 col desktop, 12 col mobile */}
                    <Grid item xs={12} md={url ? 8 : 12}>
                      <Box
                        onMouseEnter={() => setIsSliderHovered(true)}
                        onMouseLeave={() => setIsSliderHovered(false)}
                        sx={{
                          "& .slick-track": { marginLeft: 0 },
                          "& .slick-slide": {
                            paddingRight: "12px",
                            paddingLeft: "12px",
                          },
                          "& .slick-list": { margin: "0 -12px" },
                        }}
                      >
                        <Slider
                          dots={false}
                          infinite={false}
                          speed={500}
                          slidesToShow={2}
                          slidesToScroll={1}
                          {...createEnhancedArrows(isSliderHovered, {
                            displayNoneOnMobile: true,
                            variant: "primary",
                            noBackground: true,
                          })}
                          responsive={[
                            {
                              breakpoint: 900,
                              settings: { slidesToShow: 1.5 },
                            },
                            {
                              breakpoint: 600,
                              settings: { slidesToShow: 1.1 },
                            },
                          ]}
                        >
                          {/* Group items into pairs — each slide = col of 2 */}
                          {(() => {
                            const items = bestReviewedItems?.products ?? [];
                            const pairs = [];
                            for (let i = 0; i < items.length; i += 2) {
                              pairs.push(items.slice(i, i + 2));
                            }
                            return pairs.map((pair, pi) => (
                              <Box key={pi}>
                                <Stack spacing="20px">
                                  {pair.map((item, ii) => (
                                    <NewProductCard
                                      key={ii}
                                      item={item}
                                      variant="horizontal"
                                    />
                                  ))}
                                </Stack>
                              </Box>
                            ));
                          })()}
                        </Slider>
                      </Box>
                    </Grid>
                  </Grid>
                </CustomBoxFullWidth>
              </CustomStackFullWidth>
            </>
          )}
        </HomeComponentsWrapper>
      ) : (
        <>
          {isFetching ? (
            <CustomStackFullWidth spacing={1}>
              <Skeleton width="200px" />

              <SliderCustom nopadding="true">
                <Slider {...loveItemSettings}>
                  {[...Array(5)].map((_, index) => {
                    return (
                      <ProductCardSimmer key={index} variant="horizontal" />
                    );
                  })}
                </Slider>
              </SliderCustom>
            </CustomStackFullWidth>
          ) : (
            <>
              {bestReviewedItems && filteredData.length > 0 && (
                <HomeComponentsWrapper>
                  <Stack gap="16px">
                    <CustomStackFullWidth
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {isPharmacy ? (
                        <Typography
                          sx={{
                            fontSize: { xs: "18px", md: "24px" },
                            fontWeight: 700,
                            color: "neutral.1050",
                            lineHeight: 1.1,
                            letterSpacing: "-1.2px",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {title}
                        </Typography>
                      ) : (
                        <H2 text={title} component="h2" />
                      )}
                      <Stack
                        maxWidth="960px"
                        width={isSmall ? "initial" : "100%"}
                      >
                        {menu?.length > 0 && (
                          <Menus
                            selectedMenuIndex={selectedMenuIndex}
                            setSelectedMenuIndex={setSelectedMenuIndex}
                            menus={menu}
                          />
                        )}
                      </Stack>
                    </CustomStackFullWidth>
                    <Grid container spacing={{ xs: 1, md: 1, lg: 1 }}>
                      {info?.best_reviewed_section_banner && !isSmall && (
                        <Grid item xs={0} sm={0} lg={2.5}>
                          <CustomBoxFullWidth
                            sx={{
                              position: "relative",
                              height: {
                                xs: "200px",
                                sm: "300px",
                                md: "352px",
                              },
                              paddingTop: "8px",
                              display: {
                                xs: "none",
                                sm: "inherit",
                              },
                              "&:hover": {
                                img: {
                                  transform: "scale(1.03)",
                                },
                              },
                            }}
                          >
                            {bannerIsLoading ? (
                              <Skeleton
                                variant="rectangular"
                                height="100%"
                                width="100%"
                              />
                            ) : (
                              <CustomImageContainer
                                src={url}
                                height="100%"
                                width="100%"
                                borderRadius=".7rem"
                                objectfit="cover"
                              />
                            )}
                          </CustomBoxFullWidth>
                        </Grid>
                      )}
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        lg={info?.best_reviewed_section_banner ? 9.5 : 12}
                      >
                        <Grid item md={12} container position="relative">
                          <CustomStackFullWidth
                            justifyContent="right"
                            key={reRender}
                          >
                            <SliderCustom
                              onMouseEnter={() => setIsSliderHovered(true)}
                              onMouseLeave={() => setIsSliderHovered(false)}
                            >
                              <Slider
                                ref={SliderRef}
                                {...bestReviewedSliderSettings}
                              >
                                {slides()}
                              </Slider>
                            </SliderCustom>
                          </CustomStackFullWidth>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Stack>
                </HomeComponentsWrapper>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

BestReviewedItems.propTypes = {};

export default BestReviewedItems;
