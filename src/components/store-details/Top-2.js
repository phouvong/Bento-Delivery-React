import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DirectionsIcon from "@mui/icons-material/Directions";
import { keyframes } from "@mui/system";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
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
import useGetCartDiscountEligibility from "api-manage/hooks/react-query/add-cart/useGetCartDiscountEligibility";
import useGetProActiveOffer from "api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getToken } from "helper-functions/getToken";
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
import BogoBanner from "components/bogo/BogoBanner";
import BogoStoreOffersDrawer from "components/store-details/BogoStoreOffersDrawer";

const PageBackground = styled(Box)(() => ({
  width: "100%",
}));

const HeroCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: "none",
  // border: `1px solid ${theme.palette.divider}`,
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

// ─── Ported from StackFood restaurant-details (ProOfferCoupon /
// RestaurantDiscountCoupon / RestaurantCouponCard) — Top-2 is a
// side-by-side comparison duplicate of Top.js's own coupon slider, not a
// replacement. Keep both until the design is reviewed and one is dropped.
const COUPON_PRO_ACCENT = "#3979E0";

const CouponCard2 = styled(Box)(({ theme, variant }) => {
  const isDark = theme.palette.mode === "dark";
  const bg = {
    pro: isDark ? alpha("#2A61BA", 0.18) : "#F1F6FD",
    discount: isDark ? alpha(theme.palette.warning.main, 0.14) : "#FFFBEB",
  };
  return {
    position: "relative",
    // Fills its slick slot (sized by slidesToShow), rather than a fixed
    // pixel width — a hardcoded width here ignored the slot and overflowed
    // into the neighbouring card's gap.
    width: "100%",
    boxSizing: "border-box",
    height: "100%",
    minHeight: 100,
    flexShrink: 0,
    borderRadius: "16px",
    border: `2px solid ${theme.palette.background.paper}`,
    backgroundColor: bg[variant] || bg.discount,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflow: "hidden",
  };
});

const ProBadge2 = styled(Box)(({ theme }) => ({
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
  flexShrink: 0,
}));

const PromoCouponCard2 = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  boxSizing: "border-box",
  height: "100%",
  minHeight: 100,
  flexShrink: 0,
  borderRadius: "16px",
  border: `2px solid ${theme.palette.background.paper}`,
  backgroundColor:
    theme.palette.mode === "dark"
      ? alpha(theme.palette.error.main, 0.14)
      : "#FEE9E7",
  overflow: "hidden",
  cursor: "pointer",
}));

const TicketCutOut2 = styled(Box)(({ theme, side }) => ({
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

const Top2 = (props) => {
  const {
    bannerCover,
    storeDetails,
    configData,
    logo,
    storeShare,
    bannersData,
    isLoading,
    setOpenReviewModal,
    onCondensedHeaderChange,
    onProSubscribeClick,
  } = props;
  const [state, dispatchLocal] = useReducer(reducer, initialState);
  const theme = useTheme();
  const [openShareModel, setOpenShareModel] = useState(false);
  const [openBogoDrawer, setOpenBogoDrawer] = useState(false);
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
  const apiStoreCoupons = rawApiCoupons.filter((coupon) => {
    if (coupon?.coupon_type === "pro_customer") return true;
    return (
      coupon?.store_id != null &&
      String(coupon.store_id) === String(storeDetails?.id)
    );
  });

  // The Pro coupon card must reflect the customer's own active Pro
  // entitlement, not the store's unrelated promotional `discount` object
  // (that one can be null/expired while the store still supports Pro
  // discounts) — pull the real percentage/min-order from the active offer.
  const hasToken = !!getToken();
  const { data: activeOfferRaw, isLoading: activeOfferLoading } =
    useGetProActiveOffer({
      enabled: hasToken,
    });
  const activeOffer = activeOfferRaw?.data ?? activeOfferRaw ?? null;
  // react-query keeps the last successful `data` around once `enabled`
  // flips false — it just stops refetching, it doesn't clear the cache.
  // Without the explicit `hasToken` check, a logged-out user would still
  // see the Pro card from before they logged out.
  const isProActive = hasToken && activeOffer?.status === true;
  const proBenefit = activeOffer?.benefit ?? null;
  const proFeatureEnabled = configData?.pro_member_status === 1;

  // Same reasoning as the Pro card — storeDetails.discount can be null even
  // when the store has a live vendor discount, since the actual current
  // eligibility (percentage/min-purchase) is computed by this endpoint, not
  // carried on storeDetails itself.
  const { data: cartDiscountEligibility } = useGetCartDiscountEligibility(
    storeDetails?.id,
    !!storeDetails?.id,
  );

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
  const onCondensedHeaderChangeRef = useRef(onCondensedHeaderChange);
  useEffect(() => {
    onCondensedHeaderChangeRef.current = onCondensedHeaderChange;
  }, [onCondensedHeaderChange]);

  useEffect(() => {
    let observer;
    const raf = requestAnimationFrame(() => {
      const sentinel = heroSentinelRef.current;
      if (!sentinel) return;
      observer = new IntersectionObserver(
        ([entry]) => {
          const show = !entry.isIntersecting;
          setShowCondensedHeader(show);
          onCondensedHeaderChangeRef.current?.(show);
        },
        { threshold: 0, rootMargin: "0px" },
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
      (wishStore) => wishStore.id === storeDetails?.id,
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

  // `storeDetails.store_discount` is the real cart-independent config (a
  // single object, with its own active window) — `storeDetails.discount`
  // is a separate, often-null field; `useGetCartDiscountEligibility` below
  // only returns numbers once a cart exists. Prefer store_discount first.
  const storeDiscount = storeDetails?.store_discount;
  const isStoreDiscountActive = (() => {
    if (!storeDiscount?.start_date || !storeDiscount?.end_date) return false;
    const now = new Date();
    const start = new Date(
      `${storeDiscount.start_date}T${storeDiscount.start_time || "00:00:00"}`,
    );
    const end = new Date(
      `${storeDiscount.end_date}T${storeDiscount.end_time || "23:59:59"}`,
    );
    return now >= start && now <= end;
  })();
  const activeStoreDiscount = isStoreDiscountActive ? storeDiscount : null;

  const discount = activeStoreDiscount ?? storeDetails?.discount;
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

  // Same underlying coupons array Top.js builds — only the card visuals
  // and slider settings below differ (StackFood-style cards, fixed
  // slidesToShow instead of variableWidth ticket cards).
  const coupons = [];
  // While logged in and still waiting to know the real Pro benefit, skip
  // the card entirely rather than flashing the generic store discount
  // (7%) before the real Pro percentage (e.g. 16%) arrives.
  const proBenefitPending = hasToken && activeOfferLoading;
  // The Pro plan's benefit can be item-discount based (`type:
  // "discount_percentage"`, tied to storeDetails.is_pro_discount_available)
  // or delivery-fee based (`type: "delivery_fee"`, e.g.
  // { offer_type: "partial_free" | "full_free", charge_discount_percentage,
  // min_order_status, min_order_amount } — see useGetProActiveOffer). The
  // two are independent: a store can grant the delivery benefit without
  // is_pro_discount_available, so that flag only gates the discount case.
  const proBenefitType = proBenefit?.type;
  if (
    proFeatureEnabled &&
    !proBenefitPending &&
    proBenefitType === "delivery_fee"
  ) {
    const deliveryDiscountPct =
      Number(proBenefit?.charge_discount_percentage) || 0;
    const isFullyFree = proBenefit?.offer_type === "full_free";
    const proHeading = isFullyFree
      ? t("Free Delivery")
      : deliveryDiscountPct > 0
      ? `${deliveryDiscountPct}% ${t("OFF")} ${t("Delivery")}`
      : null;
    if (proHeading) {
      const proBody =
        proBenefit?.min_order_status && Number(proBenefit?.min_order_amount) > 0
          ? `${t("Min purchase")} ${getAmountWithSign(
              proBenefit.min_order_amount,
            )} ${t("and special saving for mart pro members")}`
          : t("Special saving for mart pro members");
      coupons.push({
        key: "pro",
        variant: "pro",
        heading: proHeading,
        body: proBody,
        showSubscribeButton: !isProActive,
      });
    }
  } else if (
    proFeatureEnabled &&
    Number(storeDetails?.is_pro_discount_available) === 1 &&
    !proBenefitPending
  ) {
    // This card is the Pro plan's own benefit — it must use
    // proBenefit.percentage (the actual Pro discount, e.g. 16%), never the
    // store's generic public discount (discountPercentText, e.g. 7%),
    // which is a different, non-Pro offer shown in its own card below.
    // proBenefit comes from useGetProActiveOffer, which is enabled for any
    // logged-in user (not just subscribers) — it's the plan's terms, not
    // something exclusive to an active subscription.
    const proHeading =
      Number(proBenefit?.percentage) > 0
        ? `${proBenefit.percentage}% ${t("OFF")}`
        : discountPercentText;
    if (proHeading) {
      // "Up to X" cap — only mentioned when the benefit actually has one.
      const proCapAmount =
        Number(proBenefit?.max_amount) > 0
          ? proBenefit.max_amount
          : Number(discount?.max_discount) > 0
          ? discount.max_discount
          : null;
      const proCapText = proCapAmount
        ? ` (${t("up to")} ${getAmountWithSign(proCapAmount)})`
        : "";
      const proBody =
        proBenefit?.min_order_status && Number(proBenefit?.min_order_amount) > 0
          ? `${t("Min purchase")} ${getAmountWithSign(
              proBenefit.min_order_amount,
            )}${proCapText} ${t("and special saving for mart pro members")}`
          : Number(discount?.min_purchase) > 0
          ? `${t("Min purchase")} ${getAmountWithSign(
              discount.min_purchase,
            )}${proCapText} ${t("and special saving for mart pro members")}`
          : proCapText
          ? `${t("Special saving for mart pro members")}${proCapText}`
          : t("Special saving for mart pro members");
      coupons.push({
        key: "pro",
        variant: "pro",
        heading: proHeading,
        body: proBody,
        showSubscribeButton: !isProActive,
      });
    }
  }
  const eligibilityPercent = Number(cartDiscountEligibility?.percentage) || 0;
  if (discount) {
    coupons.push({
      key: "discount",
      variant: "discount",
      heading: discountPercentText,
      body: `${t("Min purchase")} ${getAmountWithSign(
        discount?.min_purchase,
      )} ${t("and special saving for")} ${getAmountWithSign(
        discount?.max_discount,
      )}`,
    });
  } else if (eligibilityPercent > 0) {
    coupons.push({
      key: "discount",
      variant: "discount",
      heading: `${eligibilityPercent}% ${t("OFF")}`,
      body:
        Number(cartDiscountEligibility?.min_purchase) > 0
          ? `${t("Min purchase")} ${getAmountWithSign(
              cartDiscountEligibility.min_purchase,
            )} ${t("and special saving for")} ${getAmountWithSign(
              cartDiscountEligibility?.max_discount,
            )}`
          : t("Discount on all items"),
    });
  }
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
  const ticketCoupons = allCoupons.map((coupon, idx) => {
    const expireDate = coupon?.expire_date || coupon?.end_date;
    return {
      key: `coupon-${coupon?.id ?? coupon?.code ?? idx}`,
      code: coupon?.code,
      heading:
        coupon?.discount_type === "percent"
          ? `${coupon?.discount}% ${t("OFF")}`
          : `${getAmountWithSign(coupon?.discount)} ${t("OFF")}`,
      startDate: coupon?.start_date,
      expireDate,
      minPurchase: coupon?.min_purchase,
    };
  });

  const slideCount = coupons.length + ticketCoupons.length;

  const couponSliderSettings2 = {
    dots: false,
    arrows: false,
    infinite: slideCount > 4,
    speed: 400,
    slidesToShow: 3.1,
    slidesToScroll: 1,
    rtl: theme.direction === "rtl",
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 2.8 } },
      { breakpoint: 900, settings: { slidesToShow: 1.15 } },
    ],
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

      <CustomStackFullWidth spacing={{ xs: "16px", md: "20px" }} useFlexGap>
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
                    open={storeDetails?.open}
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
                      flexDirection: "row-reverse",
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

        {/* Coupons & discount slider — StackFood-style port (ProOfferCoupon /
            RestaurantDiscountCoupon / RestaurantCouponCard), for comparison
            against Top.js's own coupon slider above. */}
        {slideCount > 0 && (
          <Box
            sx={{
              position: "relative",
              pl: { xs: 1, md: 0 },
              pr: { xs: 1, md: 0 },
              "& .slick-list": {
                margin: "0 -8px",
                paddingTop: { xs: 0, md: "4px" },
                overflow: "hidden",
              },
              "& .slick-slide > div": {
                padding: "0 8px",
                height: "100%",
              },
              "& .slick-slide": { height: "auto" },
              "& .slick-track": {
                display: "flex",
                alignItems: "stretch",
                justifyContent: "flex-start",
                marginLeft: 0,
              },
            }}
          >
            <Slider {...couponSliderSettings2}>
              {coupons.map((c) => (
                <Stack key={c.key} sx={{ height: "100%" }}>
                  <CouponCard2 variant={c.variant}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      justifyContent="space-between"
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ minWidth: 0 }}
                      >
                        {c.variant === "pro" ? (
                          <ProBadge2>
                            <StarIcon sx={{ fontSize: 12, color: "#F0C048" }} />
                            {t("Pro")}
                          </ProBadge2>
                        ) : (
                          <LocalOfferOutlinedIcon
                            sx={{
                              fontSize: 18,
                              color: "warning.main",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <Tooltip
                          title={c.showSubscribeButton ? c.heading : ""}
                          arrow
                        >
                          <Typography
                            noWrap
                            sx={{
                              fontSize: 16,
                              fontWeight: 700,
                              color:
                                theme.palette.mode === "dark"
                                  ? theme.palette.text.primary
                                  : "#303030",
                              lineHeight: 1.1,
                              letterSpacing: "-0.48px",
                              textTransform: "capitalize",
                            }}
                          >
                            {c.heading}
                          </Typography>
                        </Tooltip>
                      </Stack>
                      {c.showSubscribeButton && (
                        <Box
                          component="button"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onProSubscribeClick?.();
                          }}
                          sx={{
                            flexShrink: 0,
                            appearance: "none",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#FFFFFF",
                            backgroundColor: COUPON_PRO_ACCENT,
                            borderRadius: "999px",
                            px: "10px",
                            py: "4px",
                          }}
                        >
                          {t("Subscribe")}
                        </Box>
                      )}
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color:
                          theme.palette.mode === "dark"
                            ? theme.palette.text.secondary
                            : "#757575",
                        lineHeight: 1.3,
                      }}
                    >
                      {c.body}
                    </Typography>
                  </CouponCard2>
                </Stack>
              ))}
              {ticketCoupons.map((coupon) => (
                <Stack key={coupon.key} sx={{ height: "100%" }}>
                  <PromoCouponCard2
                    onClick={() => {
                      if (!coupon.code) return;
                      navigator.clipboard.writeText(coupon.code);
                      toast.success(t("Coupon code copied."));
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{ pt: "12px", pb: "4px", px: "16px" }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ flex: 1, minWidth: 0 }}
                      >
                        <LocalOfferOutlinedIcon
                          sx={{
                            fontSize: 18,
                            color: "error.main",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          noWrap
                          sx={{
                            fontSize: 14,
                            fontWeight: 500,
                            color:
                              theme.palette.mode === "dark"
                                ? theme.palette.text.primary
                                : "#1E1E1E",
                            lineHeight: 1.1,
                            letterSpacing: "-0.42px",
                          }}
                        >
                          {t("Code")}: {coupon.code}
                        </Typography>
                      </Stack>
                      <Typography
                        sx={{
                          fontSize: 16,
                          fontWeight: 700,
                          color:
                            theme.palette.mode === "dark"
                              ? theme.palette.text.primary
                              : "#1E1E1E",
                          lineHeight: 1.1,
                          letterSpacing: "-0.48px",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {coupon.heading}
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "20px",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left: "10px",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          borderTop: (theme) =>
                            `2px dashed ${theme.palette.background.paper}`,
                        }}
                      />
                      <TicketCutOut2 side="left" />
                      <TicketCutOut2 side="right" />
                    </Box>

                    <Box sx={{ pb: "12px", px: "16px" }}>
                      <Typography
                        sx={{
                          fontSize: 12,
                          color:
                            theme.palette.mode === "dark"
                              ? theme.palette.text.secondary
                              : "#757575",
                          lineHeight: 1.3,
                        }}
                      >
                        {coupon.startDate && coupon.expireDate
                          ? `${t("Valid from")} ${coupon.startDate} - ${
                              coupon.expireDate
                            }. ${t("Minimum order")} ${getAmountWithSign(
                              coupon.minPurchase,
                            )}.`
                          : `${t("Minimum order")} ${getAmountWithSign(
                              coupon.minPurchase,
                            )}.`}
                      </Typography>
                    </Box>
                  </PromoCouponCard2>
                </Stack>
              ))}
            </Slider>
          </Box>
        )}

        <Box sx={{ px: { xs: 2, md: 0 } }}>
          <BogoBanner
            storeId={storeDetails?.id}
            onClick={() => setOpenBogoDrawer(true)}
          />
        </Box>
      </CustomStackFullWidth>

      <BogoStoreOffersDrawer
        open={openBogoDrawer}
        onClose={() => setOpenBogoDrawer(false)}
        onReopen={() => setOpenBogoDrawer(true)}
        storeId={storeDetails?.id}
        storeDetails={storeDetails}
      />

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
        maxWidth="500px"
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

Top2.propTypes = {};

export default Top2;
