import { Box, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import useGetSearchPageData from "api-manage/hooks/react-query/search/useGetSearchPageData";
import { useGetRecommendStores } from "api-manage/hooks/react-query/store/useGetRecommendStores";
import useGetTrendingSearches from "api-manage/hooks/react-query/useGetTrendingSearches";
import NewStoreCard from "components/cards/newCard/NewStoreCard";
import ClosedNow from "components/closed-now";
import { createEnhancedArrows } from "components/common/EnhancedSliderArrows";
import NextImage from "components/NextImage";
import { getStoreRedirectURL } from "helper-functions/handleStoreRedirect";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import Link from "next/link";
import { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";

// ─── Styled (same as New Arrival food module) ──────────────────────────────

const StoreCard = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "6px",
  width: "80px",
}));

const StoreImageBox = styled(Box)(() => ({
  position: "relative",
  width: "80px",
  height: "80px",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #ededed",
  backgroundColor: "background.paper",
  flexShrink: 0,
}));

const sliderSettings = (searchFromNav = false, itemCount = 0) => {
  const slidesToShow = searchFromNav ? 4.8 : 8.2;
  const canLoop = itemCount >= Math.ceil(slidesToShow);
  return {
    dots: false,
    arrows: false,
    infinite: false, //canLoop,
    autoplay: canLoop,
    autoplaySpeed: 2500,
    speed: 600,
    slidesToShow,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4.2,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: itemCount >= 5,
          autoplay: itemCount >= 5,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 1,
          swipeToSlide: true,
          infinite: itemCount >= 4,
          autoplay: itemCount >= 4,
        },
      },
    ],
  };
};

// Used by FeaturedRestaurantsSection — gap 20px (Figma spec)
const SliderWrapper = styled(CustomBoxFullWidth)(({ theme }) => ({
  "& .slick-list": {
    overflowX: "hidden",
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
  "& .slick-slide > div > *": {
    width: "100% !important",
  },
  [theme.breakpoints.down("sm")]: {
    "& .slick-slide": { paddingRight: "12px" },
  },
}));

// ─── Section wrapper ───────────────────────────────────────────────────────

const Section = ({ title, children }) => (
  <Stack spacing={2}>
    <Typography
      sx={{
        fontSize: "18px",
        fontWeight: 700,
        color: "neutral.1050",
        letterSpacing: "-0.54px",
        lineHeight: 1.1,
      }}
    >
      {title}
    </Typography>
    {children}
  </Stack>
);

// ─── Section: Recent Searches ─────────────────────────────────────────────

const RecentSearchSection = ({
  list,
  onItemClick,
  onDelete,
  onClearAll,
  t,
}) => {
  if (!list || list.length === 0) return null;
  return (
    <Stack spacing={2}>
      {/* Header row */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: "neutral.1050",
            letterSpacing: "-0.54px",
            lineHeight: 1.1,
          }}
        >
          {t("Recent Searches")}
        </Typography>
        <Typography
          onClick={onClearAll}
          sx={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#ec221f",
            letterSpacing: "-0.48px",
            lineHeight: 1.1,
            cursor: "pointer",
            userSelect: "none",
            textTransform: "capitalize",
          }}
        >
          {t("Clear All")}
        </Typography>
      </Stack>

      {/* Items */}
      <Stack spacing="6px">
        {list
          .slice(0, 6)
          .reverse()
          .map((item, index) => (
            <Stack key={index} direction="row" alignItems="center" gap="12px">
              <i
                className="fi fi-rr-clock"
                style={{
                  fontSize: "16px",
                  lineHeight: 1,
                  display: "flex",
                  color: "neutral.500",
                  flexShrink: 0,
                }}
              />
              <Typography
                onClick={() => onItemClick(item)}
                sx={{
                  flex: 1,
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "neutral.700",
                  lineHeight: 1.3,
                  cursor: "pointer",
                  "&:hover": { opacity: 0.7 },
                }}
              >
                {item}
              </Typography>
              <Box
                onClick={() => onDelete(item)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  py: "8px",
                  cursor: "pointer",
                  flexShrink: 0,
                  "&:hover": { opacity: 0.7 },
                }}
              >
                <i
                  className="fi fi-rr-cross-small"
                  style={{
                    fontSize: "20px",
                    lineHeight: 1,
                    display: "flex",
                    color: "neutral.500",
                  }}
                />
              </Box>
            </Stack>
          ))}
      </Stack>
    </Stack>
  );
};

// ─── Section: Trending Searches ──────────────────────────────────────────

const TrendingSearchSection = ({ onItemClick, t, isLoading, items }) => {
  if (!isLoading && items.length === 0) return null;

  return (
    <Box
      sx={{
        backgroundColor: "background.secondary",
        px: "20px",
        py: "16px",
      }}
    >
      <Stack spacing={1.5}>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: "neutral.1050",
            letterSpacing: "-0.54px",
            lineHeight: 1.1,
          }}
        >
          {t("Trending Searches")}
        </Typography>

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              rowGap: "12px",
              columnGap: "16px",
            }}
          >
            {[...Array(8)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                width={90}
                height={24}
                sx={{ borderRadius: "8px" }}
              />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              rowGap: "12px",
              columnGap: "16px",
            }}
          >
            {items.map((keyword, index) => (
              <Box
                key={index}
                onClick={() => onItemClick(keyword)}
                sx={{
                  px: "8px",
                  py: "4px",
                  height: "24px",
                  borderRadius: "8px",
                  backgroundColor: "background.paper",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "opacity 0.15s",
                  "&:hover": { opacity: 0.75 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "neutral.1050",
                    letterSpacing: "-0.42px",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  {keyword}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

// ─── Section: Top Restaurants ────────────────────────────────────────────

const TopRestaurantsSection = ({ t, searchFromNav = false }) => {
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const slider = useRef(null);
  const isFoodModule = getCurrentModuleType() === "food";

  const { data: storesData, isLoading } = useGetSearchPageData(
    {
      offset: 1,
      currentTab: 1,
      page_limit: 20,
      quick_action: "top_rated",
    },
    () => {},
    true,
  );
  const stores = storesData?.pages?.[0]?.stores ?? [];

  const enhancedSettings = {
    ...sliderSettings(searchFromNav, stores.length),
    ...createEnhancedArrows(isSliderHovered, {
      displayNoneOnMobile: true,
      variant: "primary",
    }),
  };

  if (!isLoading && stores.length === 0) return null;

  const sliderItems = (
    <SliderWrapper
      onMouseEnter={() => setIsSliderHovered(true)}
      onMouseLeave={() => setIsSliderHovered(false)}
    >
      {isLoading ? (
        <Slider {...enhancedSettings}>
          {[...Array(5)].map((_, i) => (
            <Stack key={i} alignItems="center" gap="6px">
              <Skeleton
                variant="rounded"
                width={80}
                height={80}
                sx={{ borderRadius: "12px" }}
              />
              <Skeleton variant="text" width={60} height={14} />
            </Stack>
          ))}
        </Slider>
      ) : (
        <>
          {stores.length > 0 && (
            <Slider {...enhancedSettings} ref={slider}>
              {stores.map((store, index) => (
                <Link key={index} href={getStoreRedirectURL(store)}>
                  <StoreCard>
                    <StoreImageBox>
                      <NextImage
                        src={store?.logo_full_url}
                        alt={store?.name}
                        width={80}
                        height={80}
                        objectFit="cover"
                        style={{ width: "100%", height: "100%" }}
                      />
                      <ClosedNow
                        active={store?.active}
                        open={store?.open}
                        borderRadius="12px"
                      />
                    </StoreImageBox>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "neutral.1050",
                        letterSpacing: "-0.42px",
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "80px",
                        lineHeight: 1.2,
                      }}
                    >
                      {store?.name}
                    </Typography>
                  </StoreCard>
                </Link>
              ))}
            </Slider>
          )}
        </>
      )}
    </SliderWrapper>
  );

  return (
    <Section title={isFoodModule ? t("Top Restaurants") : t("Top Store")}>
      {sliderItems}
    </Section>
  );
};

const FeaturedRestaurantsSection = ({
  t,
  searchFromNav = false,
  popularData,
  popularIsLoading,
}) => {
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const slider = useRef(null);
  const isFoodModule = getCurrentModuleType() === "food";

  const enhancedSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: searchFromNav ? 1.8 : 2.7,
    slidesToScroll: 1,
    swipeToSlide: true,
    ...createEnhancedArrows(isSliderHovered, {
      displayNoneOnMobile: true,
      variant: "white",
      noAnimation: true,
      noHoverColor: true,
    }),
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
          slidesToShow: 2.1,
          slidesToScroll: 1,
          infinite: false,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 760,
        settings: {
          slidesToShow: 1,
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
  const sliderItems = (
    <SliderWrapper
      onMouseEnter={() => setIsSliderHovered(true)}
      onMouseLeave={() => setIsSliderHovered(false)}
    >
      {popularIsLoading ? (
        <Slider {...enhancedSettings}>
          {[...Array(4)].map((_, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Skeleton variant="rectangular" width="100%" height={120} />
              <Box sx={{ p: "10px" }}>
                <Skeleton variant="text" width="70%" height={16} />
                <Skeleton
                  variant="text"
                  width="50%"
                  height={14}
                  sx={{ mt: "4px" }}
                />
              </Box>
            </Box>
          ))}
        </Slider>
      ) : (
        <>
          {popularData?.stores?.length > 0 && (
            <Slider {...enhancedSettings} ref={slider}>
              {popularData.stores.map((item, index) => (
                <NewStoreCard
                  key={index}
                  variant="normal"
                  item={item}
                  imageUrl={item?.cover_photo_full_url}
                />
              ))}
            </Slider>
          )}
        </>
      )}
    </SliderWrapper>
  );
  if (!popularData?.stores?.length) return null;

  return (
    <Section
      title={isFoodModule ? t("Featured Restaurants") : t("Featured Store")}
    >
      {sliderItems}
    </Section>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────

const SearchDropdownEmpty = ({
  list,
  onItemClick,
  onDelete,
  onClearAll,
  t,
  searchFromNav = false,
}) => {
  const { data, isLoading } = useGetTrendingSearches();
  const { data: popularData, isLoading: popularIsLoading } =
    useGetRecommendStores();
  const items = (
    Array.isArray(data?.trending_searches) ? data?.trending_searches : []
  )
    .map((item) =>
      typeof item === "string"
        ? item
        : item?.keyword ?? item?.name ?? item?.title,
    )
    .filter(Boolean);

  return (
    <Stack>
      {list.length ? (
        <Box sx={{ px: "20px", pt: "20px", pb: "24px" }}>
          <RecentSearchSection
            list={list}
            onItemClick={onItemClick}
            onDelete={onDelete}
            onClearAll={onClearAll}
            t={t}
          />
        </Box>
      ) : null}
      <TrendingSearchSection
        onItemClick={onItemClick}
        t={t}
        isLoading={isLoading}
        items={items}
      />
      <Box sx={{ pl: "20px", pt: items.length ? "24px" : "20px", pb: "24px" }}>
        <TopRestaurantsSection t={t} searchFromNav={searchFromNav} />
      </Box>
      {popularData?.stores?.length ? (
        <>
          <Divider sx={{ borderColor: "divider", borderBottomWidth: "2px" }} />
          <Box sx={{ pl: "20px", pt: "24px", pb: "20px" }}>
            <FeaturedRestaurantsSection
              t={t}
              searchFromNav={searchFromNav}
              popularData={popularData}
              popularIsLoading={popularIsLoading}
            />
          </Box>
        </>
      ) : null}
    </Stack>
  );
};

export default SearchDropdownEmpty;
