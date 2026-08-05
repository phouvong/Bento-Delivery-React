import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useSelector } from "react-redux";
import { handleProductValueWithOutDiscount } from "utils/CustomFunctions";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import Top from "./Top";
import MiddleSection from "./middle-section";
import StoreCartSidebar from "./StoreCartSidebar";
import ServiceMobileCartModal from "./ServiceMobileCartModal";
import useStoreCartData from "./cart/useStoreCartData";
import { useRouter } from "next/router";
import useGetStoreBanners from "api-manage/hooks/react-query/store/useGetStoreBanners";
import useGetModule from "api-manage/hooks/react-query/useGetModule";
import { useDispatch } from "react-redux";
import { setSelectedModule } from "redux/slices/utils";
import CustomModal from "components/modal";
import RestaurantReviewModal from "components/store-details/ReviewModal";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import useGetAllCartList from "api-manage/hooks/react-query/add-cart/useGetAllCartList";
import dynamic from "next/dynamic";
import CustomImageContainer from "components/CustomImageContainer";
import locationImage from "../../../../../../../public/static/fi_854878.svg";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { getSelectedVariations } from "components/header/second-navbar/SecondNavbar";
import { setCartList, setStoreCartList } from "redux/slices/cart";
import { saveModuleParam } from "utils/moduleParamManager";
import CustomContainer from "components/container";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import ServiceLastBookingSection from "../home/ServiceLastBookingSection";
import { getToken } from "helper-functions/getToken";

const MapModal = dynamic(() => import("components/Map/MapModal"));

const parseZoneIdsFromStorageValue = (rawZoneIds) => {
  if (!rawZoneIds) return [];

  const normalized = String(rawZoneIds).trim();
  if (!normalized || normalized === "undefined" || normalized === "null")
    return [];

  try {
    const parsed = JSON.parse(normalized);
    const asArray = Array.isArray(parsed) ? parsed : [parsed];
    return asArray
      .map((item) => Number(item))
      .filter((item) => Number.isFinite(item));
  } catch {
    return normalized
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item));
  }
};

const ProviderDetails = ({ providerDetails, configData }) => {
  useScrollToTop();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [openStoreZoneModal, setOpenStoreZoneModal] = useState(false);
  const [openMapModal, setOpenMapModal] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [condensedHeaderVisible, setCondensedHeaderVisible] = useState(false);
  const { cartList } = useSelector((state) => state.cart);
  const {
    moduleCartList,
    subtotal: cartSubtotal,
    originalSubtotal: cartOriginalSubtotal,
    showOriginalSubtotal: showCartOriginalSubtotal,
  } = useStoreCartData({ providerDetails });
  const cartCount = moduleCartList.length || 0;

  const bannerCover = providerDetails?.cover_photo_full_url;
  const ownCategories = providerDetails?.category_ids;
  const logo = providerDetails?.logo_full_url;
  const [rerender] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const storeZoneId = useMemo(() => {
    const rawValue = router.query.store_zone_id ?? providerDetails?.zone_id;
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }, [router.query.store_zone_id, providerDetails?.zone_id]);
  const storeShare = {
    moduleId: router.query.module || router.query.module_id,
    moduleType: router.query.module_type,
    storeZoneId: storeZoneId ? [storeZoneId] : [],
  };
  const {
    data: bannersData,
    refetch,
    isLoading,
  } = useGetStoreBanners(providerDetails?.id);
  const { data: moduleDataFromApi, refetch: refetchModule } = useGetModule();
  const guestId =
    typeof window !== "undefined"
      ? localStorage.getItem("guest_id")
      : undefined;

  const moduleType = getCurrentModuleType();

  const cartListSuccessHandler = (res) => {
    if (!res) return;
    const thisStoreId = providerDetails?.id;
    const isService = moduleType === "service";
    const tempCartLists = res.map((item) => {
      const product = item?.item ?? item?.service ?? {};
      const quantity = item?.quantity ?? 1;

      if (isService) {
        // For variation items: use variation's own price/discount.
        // For non-variation items: use base service price/discount.
        const variation = item?.variation ?? null;
        const hasVariation = !!(variation?.variant_key || variation?.name);
        const serviceUnitPrice = hasVariation
          ? variation.price ?? 0
          : product?.base_price ?? 0;
        const serviceDiscount = hasVariation
          ? variation.discount ?? 0
          : product?.discount ?? 0;
        const serviceDiscountType = hasVariation
          ? variation.discount_type ?? product?.discount_type
          : product?.discount_type;

        return {
          ...product,
          image_full_url:
            product?.image_full_url ?? product?.thumbnail_full_url,
          price: serviceUnitPrice,
          totalPrice: serviceUnitPrice * quantity,
          discount: serviceDiscount,
          discount_type: serviceDiscountType,
          cartItemId: item?.id,
          store_id: item?.provider_id ?? product?.store_id ?? thisStoreId,
          module_id: item?.module_id ?? product?.module_id ?? undefined,
          module_type: product?.module_type ?? moduleType,
          selectedAddons: product?.addons ?? [],
          quantity,
          food_variations: product?.food_variations ?? [],
          itemBasePrice: product?.base_price ?? item?.price,
          selectedOption: item?.variation ?? [],
        };
      }

      const unitPrice =
        handleProductValueWithOutDiscount(product) ?? product?.price ?? 0;
      return {
        ...product,
        image_full_url: product?.image_full_url ?? product?.thumbnail_full_url,
        price: product?.price ?? 0,
        cartItemId: item?.id,
        store_id: product?.store_id ?? thisStoreId,
        module_id: item?.module_id ?? product?.module_id ?? undefined,
        module_type: product?.module_type ?? moduleType,
        totalPrice: unitPrice * quantity,
        selectedAddons: product?.addons ?? [],
        quantity,
        food_variations: product?.food_variations ?? [],
        itemBasePrice: product?.price,
        selectedOption:
          moduleType !== "food"
            ? item?.variation ?? []
            : getSelectedVariations(product?.food_variations),
      };
    });
    dispatch(setStoreCartList(tempCartLists));
    const otherStoresItems = (cartList || []).filter(
      (i) => String(i?.store_id) !== String(thisStoreId),
    );
    dispatch(setCartList([...otherStoresItems, ...tempCartLists]));
  };

  const {
    data: cartData,
    isFetching: isCartFetching,
    refetch: cartListRefetch,
  } = useGetAllCartList(guestId, cartListSuccessHandler, providerDetails?.id);

  const isCartInitialLoading = isCartFetching && !cartData;

  useEffect(() => {
    refetchModule();
    refetch();
    cartListRefetch();
  }, [refetchModule, refetch]);

  useEffect(() => {
    if (moduleDataFromApi) {
      moduleDataFromApi?.filter((item) => {
        if (storeShare.moduleId == item.id) {
          localStorage.setItem("module", JSON.stringify(item));
          saveModuleParam(item?.id, item?.slug);
          dispatch(setSelectedModule(item));
        }
      });
    }
  }, [moduleDataFromApi]);
  const currentLatLng =
    typeof window !== "undefined"
      ? (() => {
          try {
            return JSON.parse(localStorage.getItem("currentLatLng") || "null");
          } catch {
            return null;
          }
        })()
      : null;
  const hasCurrentLatLng =
    currentLatLng?.lat !== undefined && currentLatLng?.lat !== null;
  const zoneid =
    typeof window !== "undefined" ? localStorage.getItem("zoneid") : undefined;

  const isStoreZoneMismatch = useMemo(() => {
    if (!hasCurrentLatLng || !zoneid || storeZoneId == null) return false;

    const zoneIds = parseZoneIdsFromStorageValue(zoneid);
    if (zoneIds.length === 0) return false;

    return !zoneIds.includes(storeZoneId);
  }, [hasCurrentLatLng, storeZoneId, zoneid]);
  useEffect(() => {
    if (!hasCurrentLatLng || !zoneid) {
      setOpenStoreZoneModal(false);
      return;
    }
    setOpenStoreZoneModal(isStoreZoneMismatch);
  }, [hasCurrentLatLng, isStoreZoneMismatch, zoneid]);

  useEffect(() => {
    if (!openStoreZoneModal) return;
    const timeoutId = window.setTimeout(() => {
      router.replace("/");
    }, 5000);
    return () => window.clearTimeout(timeoutId);
  }, [openStoreZoneModal, router]);

  const handleOpenPickFromMap = () => {
    setOpenStoreZoneModal(false);
    setOpenMapModal(true);
  };

  const handleCloseMapModal = () => {
    setOpenMapModal(false);

    const latestZoneid =
      typeof window !== "undefined" ? localStorage.getItem("zoneid") : null;
    const latestCurrentLatLngRaw =
      typeof window !== "undefined"
        ? localStorage.getItem("currentLatLng")
        : null;
    let latestCurrentLatLng = null;
    try {
      latestCurrentLatLng = latestCurrentLatLngRaw
        ? JSON.parse(latestCurrentLatLngRaw)
        : null;
    } catch {
      latestCurrentLatLng = null;
    }
    const hasLatestCurrentLatLng =
      latestCurrentLatLng?.lat !== undefined &&
      latestCurrentLatLng?.lat !== null;
    if (!hasLatestCurrentLatLng) return;

    if (!latestZoneid || storeZoneId == null) return;

    const zoneIds = parseZoneIdsFromStorageValue(latestZoneid);
    if (zoneIds.length === 0) return;

    if (!zoneIds.includes(storeZoneId)) {
      setOpenStoreZoneModal(true);
    }
  };

  const topSection = (
    <Top
      bannerCover={bannerCover}
      providerDetails={providerDetails}
      configData={configData}
      logo={logo}
      isSmall={isSmall}
      storeShare={storeShare}
      bannersData={bannersData}
      isLoading={isLoading}
      setOpenReviewModal={setOpenReviewModal}
      onCondensedHeaderChange={setCondensedHeaderVisible}
    />
  );

  const mainContent = (
    <CustomStackFullWidth spacing={{ xs: 0.5, md: 1 }}>
      {topSection}
      {getToken() && providerDetails?.id ? (
        <Box sx={{ pt: 2, pb: 2 }}>
          <ServiceLastBookingSection store_id={providerDetails?.id} />
        </Box>
      ) : null}
      <MiddleSection
        ownCategories={ownCategories}
        providerDetails={providerDetails}
        isSmall={isSmall}
        storeShare={storeShare}
        setExpanded={setExpanded}
        condensedHeaderVisible={condensedHeaderVisible}
      />
    </CustomStackFullWidth>
  );

  const mobileContent = (
    <CustomStackFullWidth spacing={0}>
      {topSection}
      {configData?.service_module?.rebooking_option && getToken() ? (
        <ServiceLastBookingSection store_id={providerDetails?.id} />
      ) : null}
      <Box sx={{ mt: { xs: "12px", md: 0 } }}>
        <CustomContainer>
          <CustomStackFullWidth spacing={2}>
            <MiddleSection
              ownCategories={ownCategories}
              providerDetails={providerDetails}
              isSmall={isSmall}
              storeShare={storeShare}
              setExpanded={setExpanded}
              condensedHeaderVisible={condensedHeaderVisible}
            />
          </CustomStackFullWidth>
        </CustomContainer>
      </Box>
    </CustomStackFullWidth>
  );

  const layoutHandler = () => {
    if (isSmall) {
      return mobileContent;
    }
    return (
      <CustomContainer>
        <Box
          sx={{
            mt: "45px",
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
          }}
        >
          <Box sx={{ flex: { xs: "1 1 auto", md: 8.5 }, minWidth: 0 }}>
            {mainContent}
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              flex: { md: 3.5 },
              minWidth: 0,
            }}
          >
            <StoreCartSidebar
              providerDetails={providerDetails}
              isLoading={isCartInitialLoading}
            />
          </Box>
        </Box>
      </CustomContainer>
    );
  };

  return (
    <>
      <CustomStackFullWidth
        key={rerender}
        sx={{ minHeight: "100vh", mt: { xs: 0, md: 0, lg: "20px" } }}
        spacing={3}
      >
        {layoutHandler()}
      </CustomStackFullWidth>
      <Drawer
        anchor="right"
        open={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
        sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420, md: 480 },
            maxWidth: "100%",
          },
        }}
      >
        <RestaurantReviewModal
          product_avg_rating={providerDetails?.avg_rating}
          reviews_comments_count={providerDetails?.reviews_comments_count}
          rating_count={providerDetails?.rating_count}
          id={providerDetails?.id}
          restaurantDetails={providerDetails}
          configData={configData}
          handleClose={() => setOpenReviewModal(false)}
          variant="drawer"
        />
      </Drawer>
      <CustomModal
        openModal={openStoreZoneModal}
        handleClose={() => setOpenStoreZoneModal(false)}
        maxWidth="650px"
      >
        <CustomStackFullWidth
          p={{ xs: "24px", sm: "32px" }}
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ textAlign: "center", position: "relative" }}
        >
          <IconButton
            onClick={() => setOpenStoreZoneModal(false)}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: (theme) => theme.palette.neutral[100],
              "&:hover": {
                backgroundColor: (theme) => theme.palette.neutral[200],
              },
            }}
          >
            <CloseIcon sx={{ fontSize: "18px" }} />
          </IconButton>

          <CustomImageContainer
            src={locationImage?.src}
            width="70px"
            height="70px"
          />
          <Typography fontSize="18px" fontWeight="500">
            {t("Sorry !")}
          </Typography>
          <Typography fontSize="18px" fontWeight="500">
            {t("This store is not available in your location")}
          </Typography>
          <Typography
            variant="subtitle2"
            color={theme.palette.neutral[400]}
            maxWidth="420px"
          >
            {t(
              "Please select another delivery location so we can check whether the store delivers to your area.",
            )}
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenPickFromMap}
            sx={{
              mt: "1rem !important",
              px: 6,
              py: 1.6,
              borderRadius: "12px",
              fontSize: { xs: "14px", sm: "16px" },
              textTransform: "capitalize",
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {t("Pick from Map")}
          </Button>
        </CustomStackFullWidth>
      </CustomModal>
      {openMapModal && (
        <MapModal
          open={openMapModal}
          handleClose={handleCloseMapModal}
          disableAutoFocus
          fromStore
        />
      )}

      {/* Bottom cart bar — Mobile Only */}
      {cartCount > 0 && (
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: (theme) => theme.palette.background.paper,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: (theme) =>
              `0px -2px 12px ${alpha(theme.palette.text.primary, 0.06)}`,
            px: 2,
            py: 1.25,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack spacing={0.25} sx={{ minWidth: 0 }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5}
                onClick={() => setCartDrawerOpen(true)}
                sx={{ cursor: "pointer" }}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: (theme) => theme.palette.text.secondary,
                  }}
                >
                  {t("Subtotal")}
                </Typography>
                <KeyboardArrowUpIcon
                  sx={{
                    fontSize: 16,
                    color: (theme) => theme.palette.text.secondary,
                  }}
                />
              </Stack>
              <Stack direction="row" alignItems="baseline" spacing={0.75}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: (theme) => theme.palette.text.primary,
                  }}
                >
                  {getAmountWithSign(cartSubtotal)}
                </Typography>
                {showCartOriginalSubtotal && (
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: (theme) => theme.palette.text.disabled,
                      textDecoration: "line-through",
                    }}
                  >
                    {getAmountWithSign(cartOriginalSubtotal)}
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Button
              onClick={() => setCartDrawerOpen(true)}
              variant="contained"
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.whiteContainer.main,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "14px",
                borderRadius: "8px",
                px: 2.5,
                py: 1.25,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                  boxShadow: "none",
                },
              }}
            >
              {t("View Cart List")} ({cartCount})
            </Button>
          </Stack>
        </Box>
      )}

      {/* Cart Drawer - Mobile Only */}
      <ServiceMobileCartModal
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        providerDetails={providerDetails}
      />
    </>
  );
};

export default ProviderDetails;
