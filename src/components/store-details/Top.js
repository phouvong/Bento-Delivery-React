import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DirectionsIcon from "@mui/icons-material/Directions";
import { keyframes } from "@mui/system";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LoyaltyRoundedIcon from "@mui/icons-material/LoyaltyRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import StarIcon from "@mui/icons-material/Star";
import {
  alpha,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  styled,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Box, Stack } from "@mui/system";
import React, { useEffect, useReducer, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAddStoreToWishlist } from "api-manage/hooks/react-query/wish-list/useAddStoreToWishLists";
import { useWishListStoreDelete } from "api-manage/hooks/react-query/wish-list/useWishListStoreDelete";
import { useGetStoreCouponList } from "api-manage/hooks/react-query/coupon/useGetStoreCouponList";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { addWishListStore, removeWishListStore } from "redux/slices/wishList";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { not_logged_in_message } from "utils/toasterMessages";
import ClosedNowScheduleWise from "../closed-now/ClosedNowScheduleWise";
import CustomImageContainer from "../CustomImageContainer";
import { StyledRating } from "../CustomMultipleRatings";
import LocationViewOnMap from "../Map/location-view/LocationViewOnMap";
import { useRouter } from "next/router";
import StoreShare from "components/store-details/StoreShare";
import CustomModal from "components/modal";
import CustomPageBreadCrumb from "components/common/CustomPageBreadCrumb";

const PageBackground = styled(Box)(() => ({
  width: "100%",
}));

const HeroCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    borderRadius: "0 0 16px 16px",
    border: "none",
    width: "100%",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
  },
}));

const LogoBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "68px",
  height: "68px",
  borderRadius: "12px",
  overflow: "hidden",
  flexShrink: 0,
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("md")]: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
  },
}));

const BannerWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  minHeight: "180px",
  overflow: "hidden",
  borderRadius: "16px 0 0 16px",
  [theme.breakpoints.down("md")]: {
    minHeight: "160px",
    borderRadius: "0 0 8px 8px",
  },
}));

const FloatingIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.92),
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  backdropFilter: "blur(4px)",
  boxShadow: "0px 2px 6px rgba(0,0,0,0.12)",
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
  },
}));

// Announcement icon left-right flip animation (default facing left)
const adSpin = keyframes`
  0%   { transform: scaleX(-1); }
  50%  { transform: scaleX(1); }
  100% { transform: scaleX(-1); }
`;

// Coupon variants — based on Figma 6amMart React Redesign (node 2042:50829)
const COUPON_PRO_ACCENT = "#2A61BA";

const CouponCard = styled(Box)(({ theme, variant }) => {
  const isDark = theme.palette.mode === "dark";
  const bg = {
    pro: isDark ? alpha("#2A61BA", 0.18) : "#F1F6FD",
    discount: isDark ? alpha(theme.palette.warning.main, 0.14) : "#FFFBEB",
    ticket: isDark ? alpha(theme.palette.error.main, 0.14) : "#FEE9E7",
  };
  return {
    position: "relative",
    width: 300,
    height: 100,
    flexShrink: 0,
    borderRadius: "16px",
    border: `2px solid ${theme.palette.background.paper}`,
    backgroundColor: bg[variant] || bg.discount,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflow: variant === "ticket" ? "visible" : "hidden",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  };
});

const ProBadge = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "2px",
  height: 20,
  padding: "2px 6px",
  borderRadius: 999,
  backgroundColor: theme.palette.background.paper,
  color: COUPON_PRO_ACCENT,
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 1.2,
  letterSpacing: "-0.42px",
}));

const TicketCutOut = styled(Box)(({ theme, side }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  width: 20,
  height: 20,
  borderRadius: "50%",
  backgroundColor: theme.palette.background.default,
  border: `2px solid ${theme.palette.background.paper}`,
  ...(side === "left" ? { left: -10 } : { right: -10 }),
}));

const CouponArrow = ({ direction, onClick }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isRtl = theme.direction === "rtl";
  // In RTL "previous" sits on the right and "next" on the left — flip
  // both the absolute position and the chevron icon so the visual cue
  // matches reading direction.
  const isPrev = direction === "prev";
  const pinTo = isPrev ? (isRtl ? "right" : "left") : isRtl ? "left" : "right";
  const Icon = isPrev === !isRtl ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <IconButton
      onClick={onClick}
      size="small"
      aria-label={isPrev ? t("Previous coupon") : t("Next coupon")}
      sx={{
        position: "absolute",
        top: "50%",
        [pinTo]: -8,
        transform: "translateY(-50%)",
        zIndex: 3,
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: (theme) => theme.palette.background.paper,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.12)",
        "&:hover": {
          backgroundColor: (theme) => theme.palette.background.paper,
        },
      }}
    >
      <Icon fontSize="small" />
    </IconButton>
  );
};

const initialState = {
  viewMap: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "setViewMap":
      return {
        ...state,
        viewMap: action.payload,
      };
    default:
      return state;
  }
};

const Top = (props) => {
  const {
    bannerCover,
    storeDetails,
    logo,
    storeShare,
    bannersData,
    isLoading,
    setOpenReviewModal,
    onCondensedHeaderChange,
  } = props;
  const [state, dispatchLocal] = useReducer(reducer, initialState);
  const theme = useTheme();
  const [openShareModel, setOpenShareModel] = useState(false);
  const [announcementExpanded, setAnnouncementExpanded] = useState(false);
  const [openAnnouncementModal, setOpenAnnouncementModal] = useState(false);
  const dispatchRedux = useDispatch();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const router = useRouter();
  const { data: storeCouponData } = useGetStoreCouponList(storeDetails?.id);
  const rawApiCoupons = Array.isArray(storeCouponData?.data)
    ? storeCouponData.data
    : Array.isArray(storeCouponData)
    ? storeCouponData
    : [];
  // Keep coupons that belong to THIS store OR are pro_customer coupons
  // (which are issued globally for Pro members and have store_id: null).
  // Drops zone-wise / free_delivery / default coupons tied to other stores
  // or with no store at all.
  const apiStoreCoupons = rawApiCoupons.filter((coupon) => {
    if (coupon?.coupon_type === "pro_customer") return true;
    return (
      coupon?.store_id != null &&
      String(coupon.store_id) === String(storeDetails?.id)
    );
  });
  console.log({ storeCouponData });

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      const moduleParam =
        router.query.module ||
        router.query.module_type ||
        getCurrentModuleType();
      router.push(moduleParam ? `/home?module=${moduleParam}` : "/home");
    }
  };

  const heroSentinelRef = useRef(null);
  const [showCondensedHeader, setShowCondensedHeader] = useState(false);
  // Keep latest callback in a ref so observer closure never goes stale
  const onCondensedHeaderChangeRef = useRef(onCondensedHeaderChange);
  useEffect(() => {
    onCondensedHeaderChangeRef.current = onCondensedHeaderChange;
  }, [onCondensedHeaderChange]);

  useEffect(() => {
    let observer;
    // Delay one rAF so the parent's useScrollToTop runs first.
    // Without this, on client-side navigation the previous page's scroll
    // position can briefly put the sentinel out of view and flash the header.
    const raf = requestAnimationFrame(() => {
      const sentinel = heroSentinelRef.current;
      if (!sentinel) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          const show = !entry.isIntersecting;
          setShowCondensedHeader(show);
          onCondensedHeaderChangeRef.current?.(show);
        },
        { threshold: 0, rootMargin: "0px" }
      );
      observer.observe(sentinel);
    });
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasStoreRatingOrReview =
    Number(storeDetails?.avg_rating) > 0 ||
    Number(storeDetails?.rating_count) > 0 ||
    Number(storeDetails?.reviews_comments_count) > 0;

  const ACTION = {
    setViewMap: "setViewMap",
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    cssEase: "linear",
    arrows: false,
  };

  const openMapHandler = () => {
    dispatchLocal({ type: ACTION.setViewMap, payload: true });
  };

  const { wishLists } = useSelector((state) => state.wishList);

  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const { mutate: addFavoriteMutation } = useAddStoreToWishlist();
  const addToFavorite = () => {
    if (token) {
      addFavoriteMutation(storeDetails?.id, {
        onSuccess: (response) => {
          if (response) {
            dispatchRedux(addWishListStore(storeDetails));
            toast.success(response?.message);
          }
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error(t(not_logged_in_message));
  };

  const isInWishList = () => {
    return !!wishLists?.store?.find(
      (wishStore) => wishStore.id === storeDetails?.id
    );
  };

  const onSuccessHandlerForDelete = (res) => {
    dispatchRedux(removeWishListStore(storeDetails?.id));
    toast.success(res.message, { id: "wishlist" });
  };

  const { mutate } = useWishListStoreDelete();
  const deleteWishlistStore = (id) => {
    mutate(id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };

  const handleBannerClick = (link) => {
    if (link) {
      router.push(link);
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    toast(() => <span>{t("Your store URL has been copied")}</span>);
  };

  const moduleType =
    getCurrentModuleType() || storeShare?.moduleType || ModuleTypes.FOOD;
  const moduleLabelMap = {
    [ModuleTypes.FOOD]: t("Restaurant"),
    [ModuleTypes.GROCERY]: t("Grocery"),
    [ModuleTypes.PHARMACY]: t("Pharmacy"),
    [ModuleTypes.ECOMMERCE]: t("Shop"),
  };
  const moduleLabel = moduleLabelMap[moduleType] || t("Store");

  const moduleHref = `/${
    moduleType === ModuleTypes.FOOD ? "restaurants" : "stores"
  }/${moduleType || "all"}?module_id=${
    storeShare?.moduleId || ""
  }&module_type=${storeShare?.moduleType || moduleType}`;

  const ratingValue =
    Number(storeDetails?.avg_rating) === 0
      ? 0
      : storeDetails?.avg_rating
      ? Number(storeDetails?.avg_rating)
      : 0;

  const discount = storeDetails?.discount;
  const discountPercentText = discount
    ? discount.discount_type === "percent"
      ? `${discount.discount}% ${t("OFF")}`
      : `${getAmountWithSign(discount.discount)} ${t("OFF")}`
    : null;

  const renderBanner = () => {
    if (isLoading) {
      return <Skeleton variant="rectangular" width="100%" height="100%" />;
    }
    if (bannersData?.length) {
      return (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            "& .slick-slider, & .slick-list, & .slick-track, & .slick-slide > div":
              {
                height: "100%",
              },
            "& .slick-slide": { height: "100%" },
          }}
        >
          <Slider {...sliderSettings}>
            {bannersData.map((banner) => (
              <Stack
                key={banner?.id}
                onClick={() => handleBannerClick(banner?.default_link)}
                sx={{ cursor: "pointer", width: "100%", height: "100%" }}
              >
                <CustomImageContainer
                  src={banner?.image_full_url}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  //borderRadius="16px"
                />
              </Stack>
            ))}
          </Slider>
        </Box>
      );
    }
    return (
      <CustomImageContainer
        src={bannerCover}
        width="100%"
        height="100%"
        objectFit="cover"
      />
    );
  };

  return (
    <PageBackground>
      {/* Mobile-only condensed sticky header — appears when hero scrolls out */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          backgroundColor: theme.palette.background.paper,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
          transform: showCondensedHeader
            ? "translateY(0)"
            : "translateY(-100%)",
          transition: "transform 200ms ease",
          willChange: "transform",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ px: 1.5, py: 1.25 }}
        >
          <IconButton
            onClick={handleBack}
            size="small"
            sx={{
              p: 0.5,
              color: "neutral.1050",
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 24 }} />
          </IconButton>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "neutral.1050",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
              flex: 1,
            }}
          >
            {storeDetails?.name}
          </Typography>
        </Stack>
      </Box>

      <CustomStackFullWidth spacing={1.5}>
        {/* Hero card — breadcrumb + info on left, banner on right */}
        <HeroCard>
          <Grid container alignItems="stretch">
            <Grid
              item
              xs={12}
              md={7}
              sx={{
                p: { xs: 2, sm: 2.5 },
                order: { xs: 2, md: 1 },
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Breadcrumb */}
              <Box sx={{ mb: 1.75 }}>
                <CustomPageBreadCrumb
                  color={theme.palette.neutral?.[400] || "#9CA3AF"}
                  items={[
                    {
                      key: "home",
                      label: t("Home"),
                      icon: <HomeOutlinedIcon style={{ fontSize: "14px" }} />,
                      onRedirect: "/home",
                    },
                    {
                      key: "module",
                      label: moduleLabel,
                      onRedirect: "/all-stores",
                    },
                    {
                      key: "store",
                      label: storeDetails?.name || "",
                    },
                  ]}
                />
              </Box>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ height: "auto" }}
              >
                <LogoBox>
                  <CustomImageContainer
                    src={logo}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    borderRadius="12px"
                  />
                  <ClosedNowScheduleWise
                    active={storeDetails?.active}
                    schedules={storeDetails?.schedules}
                    borderRadius="12px"
                  />
                </LogoBox>

                <Stack flex={1} spacing={0.5} sx={{ minWidth: 0 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.75}
                    sx={{ minWidth: 0 }}
                  >
                    <Typography
                      ref={heroSentinelRef}
                      sx={{
                        fontSize: { xs: "18px", sm: "22px" },
                        fontWeight: 700,
                        color: "neutral.1050",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {storeDetails?.name}
                    </Typography>
                    <VerifiedStoreBadge
                      verified={storeDetails?.verified_seller}
                      fontSize="20px"
                    />
                  </Stack>

                  {storeDetails?.address && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      sx={{ minWidth: 0 }}
                    >
                      <LocationOnOutlinedIcon
                        sx={{
                          fontSize: "16px",
                          color: "neutral.500",
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "neutral.600",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {storeDetails?.address}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>

              {/* Mobile-only — gray pill cards (Image 1 design) */}

              <Stack
                direction="row"
                alignItems="stretch"
                justifyContent="flex-end"
                spacing={1}
                sx={{ mt: "auto", pt: 1 }}
              >
                {hasStoreRatingOrReview && (
                  <Stack
                    onClick={() => setOpenReviewModal(true)}
                    sx={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "background.secondary",
                      borderRadius: "10px",
                      p: 1.1,
                      cursor: "pointer",
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <StarIcon
                        sx={{
                          fontSize: { xs: "14px", md: "16px" },
                          color: theme.palette.warning?.main || "#F5A623",
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: { xs: "14px", md: "18px" },
                          fontWeight: 400,
                          color: "neutral.1050",
                          lineHeight: 1.15,
                        }}
                      >
                        {Number(storeDetails?.avg_rating || 0).toFixed(1)}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: { xs: "10px", md: "11.5px" },
                        color: "neutral.500",
                        textAlign: "center",
                      }}
                    >
                      {storeDetails?.reviews_comments_count} {t("Reviews")}
                    </Typography>
                  </Stack>
                )}

                {storeDetails?.delivery_time && (
                  <Stack
                    sx={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "background.secondary",
                      borderRadius: "10px",
                      p: 1.1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", md: "18px" },
                        fontWeight: 400,
                        color: "neutral.1050",
                        lineHeight: 1.15,
                        textAlign: "center",
                      }}
                    >
                      {storeDetails?.delivery_time}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "10px", md: "11.5px" },
                        color: "neutral.500",
                        textAlign: "center",
                      }}
                    >
                      {t("Est. Delivery Time")}
                    </Typography>
                  </Stack>
                )}

                {storeDetails?.minimum_order !== 0 &&
                  storeDetails?.minimum_order != null && (
                    <Stack
                      sx={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "background.secondary",
                        borderRadius: "10px",
                        p: 1.1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "14px", md: "18px" },
                          fontWeight: 400,
                          color: "neutral.1050",
                          lineHeight: 1.15,
                          textAlign: "center",
                        }}
                      >
                        {getAmountWithSign(storeDetails?.minimum_order)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "10px", md: "11.5px" },
                          color: "neutral.500",
                          textAlign: "center",
                        }}
                      >
                        {t("Minimum Order")}
                      </Typography>
                    </Stack>
                  )}
              </Stack>
            </Grid>

            <Grid
              item
              xs={12}
              md={5}
              sx={{
                display: "flex",
                order: { xs: 1, md: 2 },
                "& > *": { width: "100%" },
              }}
            >
              <BannerWrapper sx={{ height: 210, minHeight: 210 }}>
                {renderBanner()}
                {/* Mobile-only back arrow */}
                <Box
                  sx={{
                    display: { xs: "block", md: "none" },
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 2,
                  }}
                >
                  <FloatingIconButton onClick={handleBack}>
                    <ChevronLeftIcon
                      sx={{
                        fontSize: "20px",
                        color: "neutral.1050",
                      }}
                    />
                  </FloatingIconButton>
                </Box>
                {/* Floating action buttons over banner */}
                <Stack
                  direction="row"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 2,
                    flexDirection: { xs: "row-reverse", md: "row" },
                    gap: { xs: 1.5, md: 0.75 },
                  }}
                >
                  {!isInWishList() ? (
                    <Tooltip title={t("Add to wishlist")} arrow>
                      <FloatingIconButton onClick={addToFavorite}>
                        <FavoriteBorderIcon
                          sx={{
                            fontSize: "16px",
                            color: theme.palette.primary.main,
                          }}
                        />
                      </FloatingIconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title={t("Remove from wishlist")} arrow>
                      <FloatingIconButton
                        onClick={() => deleteWishlistStore(storeDetails?.id)}
                      >
                        <FavoriteIcon
                          sx={{
                            fontSize: "16px",
                            color: theme.palette.primary.main,
                          }}
                        />
                      </FloatingIconButton>
                    </Tooltip>
                  )}
                  <Tooltip title={t("Location")} arrow>
                    <FloatingIconButton onClick={openMapHandler}>
                      <DirectionsIcon
                        sx={{
                          fontSize: "16px",
                          color: theme.palette.primary.main,
                        }}
                      />
                    </FloatingIconButton>
                  </Tooltip>
                  <Tooltip title={t("Share")} arrow>
                    <FloatingIconButton onClick={() => setOpenShareModel(true)}>
                      <ShareOutlinedIcon
                        sx={{
                          fontSize: "16px",
                          color: theme.palette.primary.main,
                        }}
                      />
                    </FloatingIconButton>
                  </Tooltip>
                </Stack>

                {/* Announcement button — only shown when store has announcement */}
                {storeDetails?.announcement === 1 && (
                  <Box
                    onClick={() => setOpenAnnouncementModal(true)}
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      zIndex: 3,
                      display: "flex",
                      flexDirection: "row-reverse", // icon stays right, text expands left
                      alignItems: "center",
                      height: 36,
                      borderRadius: "999px",
                      backgroundColor: "#E8B931",
                      cursor: "pointer",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.20)",
                      "&:hover": {
                        "& .announcement-label": {
                          maxWidth: "140px",
                          pl: "12px",
                        },
                        "& .announcement-icon i": {
                          animationDuration: "0.6s",
                        },
                      },
                    }}
                  >
                    {/* Icon — fixed 36×36, always right, continuously spinning */}
                    <Box
                      className="announcement-icon"
                      sx={{
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <i
                        className="fi fi-sr-megaphone"
                        style={{
                          fontSize: 18,
                          display: "flex",
                          lineHeight: 1,
                          color: "#000",
                          animation: `${adSpin} 3s linear infinite`,
                        }}
                      />
                    </Box>
                    {/* Text — hidden under icon, slides left on hover */}
                    <Box
                      className="announcement-label"
                      sx={{
                        maxWidth: 0,
                        overflow: "hidden",
                        pl: 0,
                        transition:
                          "max-width 0.35s cubic-bezier(0.4,0,0.2,1), padding-left 0.35s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#1F2937",
                          whiteSpace: "nowrap",
                          lineHeight: 1,
                          pr: "5px",
                        }}
                      >
                        {t("Announcement")}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </BannerWrapper>
            </Grid>
          </Grid>
        </HeroCard>

        {/* Coupons & discount slider — Figma 2042:50829 */}
        {(() => {
          const coupons = [];
          if (
            Number(storeDetails?.is_pro_discount_available) === 1 &&
            discount
          ) {
            coupons.push({
              key: "pro",
              variant: "pro",
              icon: (
                <StarIcon sx={{ fontSize: 12, color: COUPON_PRO_ACCENT }} />
              ),
              heading: discountPercentText,
              body: `${t("Min purchase")} ${getAmountWithSign(
                discount?.min_purchase
              )} ${t("and special saving for mart pro members")}`,
            });
          }
          if (discount) {
            coupons.push({
              key: "discount",
              variant: "discount",
              icon: (
                <LoyaltyRoundedIcon
                  sx={{ fontSize: 18, color: "warning.main" }}
                />
              ),
              heading: discountPercentText,
              body: `${t("Min purchase")} ${getAmountWithSign(
                discount?.min_purchase
              )} ${t("and special saving for")} ${getAmountWithSign(
                discount?.max_discount
              )}`,
            });
          }
          // Merge coupons from `storeDetails.coupons` (SSR) with those
          // fetched from /api/v1/coupon/list?store_id=X (client). Tolerate
          // both `expire_date` and `end_date`. Dedupe by id/code so the same
          // coupon isn't rendered twice when both sources include it.
          const seenCouponKeys = new Set();
          const allCoupons = [
            ...(storeDetails?.coupons || []),
            ...apiStoreCoupons,
          ].filter((coupon) => {
            const key = coupon?.id ?? coupon?.code;
            if (key == null) return true;
            if (seenCouponKeys.has(key)) return false;
            seenCouponKeys.add(key);
            return true;
          });

          allCoupons.forEach((coupon, idx) => {
            const expireDate = coupon?.expire_date || coupon?.end_date;
            const isPro = coupon?.coupon_type === "pro_customer";
            coupons.push({
              key: `coupon-${coupon?.id ?? coupon?.code ?? idx}`,
              // Pro-customer coupons reuse the existing "pro" variant so the
              // ProBadge styling fires on the card (crown / star + "Pro").
              variant: isPro ? "pro" : "ticket",
              icon: isPro ? (
                <StarIcon sx={{ fontSize: 12, color: COUPON_PRO_ACCENT }} />
              ) : (
                <LocalOfferRoundedIcon
                  sx={{ fontSize: 18, color: "error.main" }}
                />
              ),
              heading:
                coupon?.discount_type === "percent"
                  ? `${coupon?.discount}% ${t("OFF")}`
                  : `${getAmountWithSign(coupon?.discount)} ${t("OFF")}`,
              body:
                coupon?.start_date && expireDate
                  ? `${t("Valid from")} ${
                      coupon.start_date
                    } - ${expireDate}. ${t(
                      "Minimum order"
                    )} ${getAmountWithSign(coupon?.min_purchase)}.`
                  : `${t("Minimum order")} ${getAmountWithSign(
                      coupon?.min_purchase
                    )}.`,
            });
          });

          if (coupons.length === 0) return null;

          const couponSliderSettings = {
            dots: false,
            // Reverse slide order in RTL so the first coupon sits on the
            // right and "prev"/"next" travel in the natural reading
            // direction. Pairs with the position+icon flip in CouponArrow.
            rtl: theme.direction === "rtl",
            infinite: coupons.length > 2,
            speed: 400,
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            swipeToSlide: true,
            arrows: coupons.length > 3,
            prevArrow: <CouponArrow direction="prev" />,
            nextArrow: <CouponArrow direction="next" />,
            responsive: [
              {
                breakpoint: 900,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  swipeToSlide: true,
                  variableWidth: false,
                  arrows: false,
                },
              },
            ],
          };

          return (
            <Box
              sx={{
                position: "relative",
                pt: { xs: 1, md: 0.5 },
                pb: { xs: 0, md: 0 },
                pl: { xs: 1, md: 0 },
                pr: { xs: 1, md: 0 },
                "& .slick-list": {
                  margin: { xs: 0, md: "0 -8px" },
                  paddingTop: { xs: 0, md: "4px" },
                  // paddingBottom: { xs: "0px", md: "4px" },
                  overflow: "hidden",
                },
                "& .slick-slide > div": {
                  padding: { xs: 0, md: "0 8px" },
                },
                "& .slick-track": {
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "flex-start",
                  marginLeft: 0,
                },
              }}
            >
              <Slider {...couponSliderSettings}>
                {coupons.map((c) => (
                  <Box key={c.key}>
                    <CouponCard variant={c.variant}>
                      {c.variant === "ticket" && (
                        <>
                          <TicketCutOut side="left" />
                          <TicketCutOut side="right" />
                        </>
                      )}
                      {c.variant === "pro" ? (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <ProBadge>
                            {c.icon}
                            {t("Pro")}
                          </ProBadge>
                          <Typography
                            sx={{
                              fontSize: 16,
                              fontWeight: 700,
                              color:
                                theme.palette.mode === "dark"
                                  ? theme.palette.text.primary
                                  : "#1F2937",
                              lineHeight: 1.1,
                              letterSpacing: "-0.48px",
                              textTransform: "capitalize",
                            }}
                          >
                            {c.heading}
                          </Typography>
                        </Stack>
                      ) : (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {c.icon}
                          <Typography
                            sx={{
                              fontSize: 16,
                              fontWeight: 700,
                              color:
                                theme.palette.mode === "dark"
                                  ? theme.palette.text.primary
                                  : "#1F2937",
                              lineHeight: 1.1,
                              letterSpacing: "-0.48px",
                              textTransform: "capitalize",
                            }}
                          >
                            {c.heading}
                          </Typography>
                        </Stack>
                      )}
                      <Typography
                        sx={{
                          fontSize: 12,
                          color:
                            theme.palette.mode === "dark"
                              ? theme.palette.text.secondary
                              : "#4B5563",
                          lineHeight: 1.3,
                        }}
                      >
                        {c.body}
                      </Typography>
                    </CouponCard>
                  </Box>
                ))}
              </Slider>
            </Box>
          );
        })()}
      </CustomStackFullWidth>

      {state.viewMap && (
        <LocationViewOnMap
          open={state.viewMap}
          handleClose={() =>
            dispatchLocal({ type: ACTION.setViewMap, payload: false })
          }
          latitude={storeDetails?.latitude}
          longitude={storeDetails?.longitude}
          address={storeDetails?.address}
          storeDetails={storeDetails}
        />
      )}
      {openShareModel && (
        <StoreShare
          handleCopy={handleCopy}
          setOpenShareModal={setOpenShareModel}
          openShareModal={openShareModel}
        />
      )}

      {/* Announcement Modal */}
      <CustomModal
        openModal={openAnnouncementModal}
        handleClose={() => setOpenAnnouncementModal(false)}
        closeButton
        maxWidth="sm"
      >
        <Box sx={{ pt: 0.5, px: { xs: 2, md: 3 }, pb: { xs: 8, md: 4 } }}>
          <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor: "#E8B931",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <i
                className="fi fi-sr-megaphone"
                style={{
                  fontSize: 18,
                  display: "flex",
                  lineHeight: 1,
                  color: "#000",
                }}
              />
            </Box>
            <Typography
              sx={{ fontSize: "16px", fontWeight: 700, color: "text.primary" }}
            >
              {t("Announcement")}
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontSize: "14px",
              color: "text.secondary",
              lineHeight: 1.7,
              whiteSpace: "pre-line",
            }}
          >
            {storeDetails?.announcement_message ||
              t("No announcement available.")}
          </Typography>
        </Box>
      </CustomModal>
    </PageBackground>
  );
};

Top.propTypes = {};

export default Top;
