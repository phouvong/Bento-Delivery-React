/* eslint-disable react-hooks/exhaustive-deps */
import {
  alpha,
  Box,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import H2 from "components/typographies/H2";
import { t } from "i18next";
import Link from "next/link";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import useGetBrandsList from "api-manage/hooks/react-query/brands/useGetBrandsList";
import SliderSectionHeader from "components/common/SliderSectionHeader";
import CustomContainer from "components/container";
import NextImage from "components/NextImage";
import { getModuleId } from "helper-functions/getModuleId";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { setBrands } from "redux/slices/brands";
import AtoZ from "sort/AtoZ";
import BrandCard from "./BrandCard";

// ─── New Brand Card (Figma) ────────────────────────────────────────────────

const NewBrandCard = ({ item }) => {
  const theme = useTheme();
  return (
    <Link
      href={`/search?brand_id=${item?.id}&data_type=brand`}
      style={{ textDecoration: "none" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          px: "4px",
          cursor: "pointer",
        }}
      >
        {/* Image box */}
        <Box
          sx={{
            width: "92px",
            height: "92px",
            borderRadius: "12px",
            overflow: "hidden",
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            flexShrink: 0,
            "& img": {
              width: "100% !important",
              height: "100% !important",
              objectFit: "cover !important",
            },
          }}
        >
          <NextImage
            src={item?.image_full_url}
            alt={item?.name || "brand"}
            width={92}
            height={92}
            objectFit="cover"
          />
        </Box>

        {/* Texts */}
        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 700,
              color: "neutral.1050",
              lineHeight: 1.1,
              letterSpacing: "-0.48px",
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item?.name}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 400,
              color: "neutral.500",
              lineHeight: 1.2,
              letterSpacing: "-0.42px",
              mt: "4px",
              whiteSpace: "nowrap",
            }}
          >
            {t("In")} {item?.items_count} {t("stores")}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
};

// ─── Shimmer card ──────────────────────────────────────────────────────────

const BrandShimmerCard = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      px: "4px",
    }}
  >
    <Skeleton
      variant="rounded"
      width={92}
      height={92}
      sx={{ borderRadius: "12px" }}
    />
    <Skeleton variant="text" width={70} height={16} />
    <Skeleton variant="text" width={50} height={14} />
  </Box>
);

// ─── Slider wrapper ────────────────────────────────────────────────────────

const BrandSliderWrapper = styled(Box)(() => ({
  "& .slick-list": { overflow: "hidden" },
  "& .slick-track": { marginLeft: 0, marginRight: "auto" },
  "& .slick-slide > div": { padding: "0 12px 0 0" },
  "& .slick-slide:first-child > div": { paddingLeft: 0 },
}));
export const CustomSkeleton = styled(Skeleton)(({ theme }) => ({
  background: theme.palette.background.sklenton,
  maxWidth: "100%",
}));
const Brands = ({ viewAll }) => {
  const [sortBy, setSortBy] = useState("Default");
  const [currentSlide, setCurrentSlide] = useState(0);
  const theme = useTheme();
  const sliderRef = useRef();
  const tabScreen = useMediaQuery("(max-width: 991px)");
  const { brands: data } = useSelector((state) => state?.brands);
  const { configData } = useSelector((state) => state?.configData);

  const dispatch = useDispatch();
  const handleSuccess = (response) => {
    dispatch(setBrands(response));
  };

  const { refetch, isLoading, isFetching } = useGetBrandsList(handleSuccess);

  useEffect(() => {
    refetch();
  }, [data, getModuleId()]);

  const baseUrl = configData?.base_urls?.brand_image_url;

  const handleSortBy = (value) => {
    setSortBy(value);
  };

  const [filteredData, setFilteredData] = useState(data);
  useEffect(() => {
    if (data) {
      if (sortBy === "AtoZ") {
        setFilteredData([...data].sort((a, b) => a.name.localeCompare(b.name)));
      } else if (sortBy === "ZtoA") {
        setFilteredData([...data].sort((a, b) => b.name.localeCompare(a.name)));
      } else {
        setFilteredData(data);
      }
    }
  }, [data, sortBy]);
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !isFetching) {
      if (data?.length === 0 && viewAll) {
        router.push("/home");
      }
    }
  }, [isLoading, isFetching]);

  // Page View
  if (viewAll)
    return (
      <>
        <Box paddingBlock={"32px"}>
          <CustomContainer>
            {filteredData?.length > 0 ? (
              <Stack
                direction="row"
                flexWrap="wrap"
                justifyContent="space-between"
                marginBottom="30px"
                paddingBottom="20px"
                borderBottom={`1px solid ${theme.palette.divider}`}
                gap={2}
              >
                <Box
                  width={{
                    xs: "100%",
                    sm: "0",
                  }}
                  flexGrow={"1"}
                >
                  <H2 text={"Brands"} textAlign={"left"} component="h2" />
                  <Typography variant={"body1"}>
                    {t("Explore the Trusted and Trendsetting Brands")}
                  </Typography>
                </Box>
                <AtoZ handleSortBy={handleSortBy} sortBy={sortBy} />
              </Stack>
            ) : isLoading || isFetching ? (
              <>
                <Skeleton variant="text" width="80px" />
                <Skeleton variant="text" width="60px" />
              </>
            ) : (
              ""
            )}
            {isLoading || isFetching ? (
              <></>
            ) : (
              filteredData?.length > 0 && (
                <Grid container spacing={2}>
                  {filteredData?.map((item, i) => (
                    <Grid item xs={6} md={3} key={item?.id}>
                      <CustomBrandCard>
                        <BrandCard
                          name={item?.name}
                          image={item?.image_full_url}
                          stock={item?.items_count}
                          id={item?.id}
                          baseUrl={baseUrl}
                          items_count={item?.items_count}
                        />
                      </CustomBrandCard>
                    </Grid>
                  ))}
                </Grid>
              )
            )}
          </CustomContainer>
        </Box>
      </>
    );
  // Section View
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 9,
    slidesToScroll: 2,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1450,
        settings: { slidesToShow: 8, slidesToScroll: 2, swipeToSlide: true },
      },
      {
        breakpoint: 1200,
        settings: { slidesToShow: 7, slidesToScroll: 2, swipeToSlide: true },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 6, slidesToScroll: 2, swipeToSlide: true },
      },
      {
        breakpoint: 840,
        settings: { slidesToShow: 5, slidesToScroll: 2, swipeToSlide: true },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 4.5, slidesToScroll: 2, swipeToSlide: true },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 3.8, slidesToScroll: 2, swipeToSlide: true },
      },
      {
        breakpoint: 380,
        settings: { slidesToShow: 3.2, slidesToScroll: 1, swipeToSlide: true },
      },
    ],
  };

  if (!isLoading && !isFetching && (!data || data.length === 0)) return null;

  return (
    <Box sx={{ py: "12px" }}>
      <SliderSectionHeader
        sliderRef={sliderRef}
        currentSlide={currentSlide}
        totalSlides={data?.length ?? 0}
        slidesToShow={9}
        sx={{ mb: "16px" }}
        heading={
          isLoading ? (
            <Skeleton variant="text" width="120px" height={32} />
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
              {t("Top Brands")}
            </Typography>
          )
        }
      />

      {/* Slider */}
      <BrandSliderWrapper>
        <Slider
          ref={sliderRef}
          {...sliderSettings}
          afterChange={(idx) => setCurrentSlide(idx)}
        >
          {isLoading || isFetching
            ? [...Array(9)].map((_, i) => <BrandShimmerCard key={i} />)
            : data?.map((item) => <NewBrandCard key={item?.id} item={item} />)}
        </Slider>
      </BrandSliderWrapper>
    </Box>
  );
};

const CustomBrandCard = styled(Box)(({ theme }) => ({
  borderRadius: "10px",
  padding: "10px",
  background: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  transition: "all ease .3s",
  ":hover": {
    boxShadow: theme.shadows[14],
  },
  [theme.breakpoints.up("xl")]: {
    ".brand-card-image": {
      maxWidth: "100px",
      marginRight: "5px",
    },
  },
}));
const PopularCategoryStack = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  gap: 1,
  ".MuiBox-root:first-of-type": {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
    ":hover": {
      boxShadow: theme.shadows[18],
    },
  },
}));

const CustomWrapperBox = styled(Box)(({ theme }) => ({
  width: { xs: "100%" },
  maxWidth: { lg: "200px", xl: "270px" },

  background: theme.palette.background.paper,
  ":hover": {
    boxShadow: theme.shadows[4],
  },
  borderRadius: "5px",
  [theme.breakpoints.up("xs")]: {
    padding: "17px 35px 22px",
  },
  [theme.breakpoints.up("md")]: {
    padding: "15px 20px 20px",
    boxShadow: theme.shadows[3],
  },
  [theme.breakpoints.up("xl")]: {
    padding: "17px 35px 22px",
  },
}));
const CustomWrapperStack = styled(Stack)(({ theme, datalength }) => ({
  width: "575px",
  flexGrow: "1",
  borderRadius: "5px",
  position: "relative",
  ".MuiBox-root:first-of-type": {
    display: "none",
  },
  // rowGap: "24px",
  alignItems: "center",
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  [theme.breakpoints.up("xs")]: {
    padding: "20px 15px",
  },
  [theme.breakpoints.up("md")]: {
    padding: "20px 5px",
    "&::before": {
      position: "absolute",
      content: "''",
      left: "0",
      top: "50%",
      height: "1px",
      width: "100%",
      opacity: datalength > 4 ? "1" : "0",

      backgroundColor: alpha(theme.palette.neutral[400], 0.2),
    },
    ":hover": {
      boxShadow: theme.shadows[4],
    },
  },
  [theme.breakpoints.up("xl")]: {
    padding: "45px 30px",
  },
  [theme.breakpoints.down("md")]: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    width: "100%",
    gap: ".5rem",
    "> .MuiBox-root": {
      // border: "1px solid #ddd",
      borderRadius: ".25rem",
    },
    ".MuiBox-root:first-of-type": {
      display: "flex",
      gridRow: "span 4",
      justifyContent: "center",
      padding: ".25rem",
      img: {
        maxWidth: "80px",
      },
    },
  },
}));
export default Brands;
