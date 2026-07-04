import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { getCartListModuleWise } from "../../helper-functions/getCartListModuleWise";
import {
  cartItemsTotalAmount,
  handleProductValueWithOutDiscount,
} from "../../utils/CustomFunctions";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getToken } from "helper-functions/getToken";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import Prescription from "../Prescription";
import CustomContainer from "../container";
import Top from "./Top";
import MiddleSection from "./middle-section";
import StoreCartSidebar from "./StoreCartSidebar";
import { useRouter } from "next/router";
import useGetStoreBanners from "../../api-manage/hooks/react-query/store/useGetStoreBanners";
import useGetModule from "../../api-manage/hooks/react-query/useGetModule";
import { useDispatch } from "react-redux";
import { setSelectedModule } from "redux/slices/utils";
import CustomModal from "components/modal";
import RestaurantReviewModal from "components/store-details/ReviewModal";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import LastOrdersSection from "components/home/module-wise-components/food/LastOrdersSection";
import useGetProActiveOffer from "api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import useSubscribeProPlan from "api-manage/hooks/react-query/pro-plans/useSubscribeProPlan";
import ProPlanBanner from "components/pro-plan/ProPlanBanner";
import ProSavingsBanner from "components/pro-plan/ProSavingsBanner";

const ProPlanSubscriptionModal = dynamic(() =>
  import("components/pro-plan/ProPlanSubscriptionModal")
);
const ProPlanPaymentModal = dynamic(() =>
  import("components/pro-plan/ProPlanPaymentModal")
);
import useGetAllCartList from "api-manage/hooks/react-query/add-cart/useGetAllCartList";
import dynamic from "next/dynamic";
import CustomImageContainer from "components/CustomImageContainer";
import locationImage from "../../../public/static/fi_854878.svg";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { getSelectedVariations } from "components/header/second-navbar/SecondNavbar";
import { setCartList, setStoreCartList } from "redux/slices/cart";
import { saveModuleParam } from "utils/moduleParamManager";

const MapModal = dynamic(() => import("../Map/MapModal"));

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

const StoreDetails = ({ storeDetails, configData }) => {
  useScrollToTop();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [openStoreZoneModal, setOpenStoreZoneModal] = useState(false);
  const [openMapModal, setOpenMapModal] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [condensedHeaderVisible, setCondensedHeaderVisible] = useState(false);

  const proFeatureEnabled = configData?.pro_member_status === 1;
  const hasToken = !!getToken();
  const { data: activeOfferRaw, isLoading: activeOfferLoading } =
    useGetProActiveOffer({
      enabled: proFeatureEnabled && hasToken,
    });
  const activeOffer = activeOfferRaw?.data ?? activeOfferRaw ?? null;
  const isProMember =
    (activeOffer?.status === true &&
      Number(activeOffer?.plan_details?.days_remaining) > 0) ||
    Boolean(activeOffer?.plan_details?.plan_name);
  const isProActive = activeOffer?.status === true;
  const proBenefit = activeOffer?.benefit ?? null;
  const proOfferResolved =
    !(proFeatureEnabled && hasToken) || !activeOfferLoading;
  const proSavingsMessage = (() => {
    if (!proBenefit) return undefined;
    const minOrderAmount = Number(proBenefit?.min_order_amount);
    const hasMin =
      proBenefit?.min_order_status === 1 &&
      Number.isFinite(minOrderAmount) &&
      minOrderAmount > 0;
    const minAmount = hasMin ? getAmountWithSign(minOrderAmount) : "";

    if (proBenefit?.type === "delivery_fee") {
      const pct = Number(proBenefit?.charge_discount_percentage);
      const isFree =
        proBenefit?.offer_type === "free" ||
        proBenefit?.offer_type === "full_free";
      if (isFree) {
        return hasMin
          ? t("Free delivery as a Pro member on orders above {{amount}}", {
              amount: minAmount,
            })
          : t("Free delivery as a Pro member");
      }
      if (Number.isFinite(pct) && pct > 0) {
        return hasMin
          ? t(
              "{{percent}}% off on delivery fee as a Pro member on orders above {{amount}}",
              { percent: pct, amount: minAmount }
            )
          : t("{{percent}}% off on delivery fee as a Pro member", {
              percent: pct,
            });
      }
      return hasMin
        ? t("Delivery fee benefit as a Pro member on orders above {{amount}}", {
            amount: minAmount,
          })
        : t("Delivery fee benefit as a Pro member");
    }

    if (proBenefit?.type === "discount") {
      const pct = Number(proBenefit?.percentage);
      const maxAmount = Number(proBenefit?.max_amount);
      const hasCap = Number.isFinite(maxAmount) && maxAmount > 0;
      const capAmount = hasCap ? getAmountWithSign(maxAmount) : "";

      if (Number.isFinite(pct) && pct > 0) {
        if (hasCap && hasMin) {
          return t(
            "{{percent}}% off as a Pro member (up to {{cap}}) on orders above {{amount}}",
            { percent: pct, cap: capAmount, amount: minAmount }
          );
        }
        if (hasCap) {
          return t("{{percent}}% off as a Pro member (up to {{cap}})", {
            percent: pct,
            cap: capAmount,
          });
        }
        if (hasMin) {
          return t(
            "{{percent}}% off as a Pro member on orders above {{amount}}",
            {
              percent: pct,
              amount: minAmount,
            }
          );
        }
        return t("{{percent}}% off as a Pro member", { percent: pct });
      }

      return hasMin
        ? t("Pro member discount unlocked on orders above {{amount}}", {
            amount: minAmount,
          })
        : t("Pro member discount unlocked");
    }

    if (proBenefit?.type === "coupon") {
      return t("Pro coupon benefit unlocked");
    }
    return undefined;
  })();

  const [proModalOpen, setProModalOpen] = useState(false);
  const [proPaymentOpen, setProPaymentOpen] = useState(false);
  const [proSelectedPlan, setProSelectedPlan] = useState(null);
  const subscribeProMutation = useSubscribeProPlan();
  const handleProSubscribeClick = () => {
    if (!hasToken) {
      toast.error(t("Please login to subscribe"));
      return;
    }
    setProModalOpen(true);
  };
  const handleProSubscribe = (plan) => {
    if (!plan) return;
    if (plan.price === 0) {
      subscribeProMutation.mutate(
        {
          plan_id: plan.id,
          payment_type: "free_trial",
          payment_method: "free_trial",
          callback_url:
            typeof window !== "undefined" ? window.location.href : "",
        },
        {
          onSuccess: (res) => {
            const redirect = res?.redirect_link ?? res?.data?.redirect_link;
            if (redirect && typeof window !== "undefined") {
              window.location.href = redirect;
              return;
            }
            toast.success(t("Subscribed successfully"));
            setProModalOpen(false);
            queryClient.invalidateQueries("pro-customer-active-offer");
          },
          onError: (err) => {
            toast.error(
              err?.response?.data?.message || t("Subscription failed")
            );
          },
        }
      );
      return;
    }
    setProSelectedPlan(plan);
    setProModalOpen(false);
    setProPaymentOpen(true);
  };
  const { cartList } = useSelector((state) => state.cart);
  const moduleCartList = getCartListModuleWise(cartList);
  const storeScopedCartList = (moduleCartList || []).filter((item) => {
    const itemStoreId = item?.store_id ?? item?.store?.id;
    return (
      storeDetails?.id != null &&
      itemStoreId != null &&
      String(itemStoreId) === String(storeDetails.id)
    );
  });
  const cartCount = storeScopedCartList.length || 0;
  const cartSubtotal = cartItemsTotalAmount(storeScopedCartList);
  const cartOriginalSubtotal = storeScopedCartList?.reduce((sum, item) => {
    const itemQty = item?.quantity || 1;
    const itemPrice = item?.price || 0;
    return sum + itemPrice * itemQty;
  }, 0);

  const showCartOriginalSubtotal =
    cartOriginalSubtotal && Number(cartOriginalSubtotal) > Number(cartSubtotal);
  const bannerCover = storeDetails?.cover_photo_full_url;
  const ownCategories = storeDetails?.category_ids;
  const logo = storeDetails?.logo_full_url;
  const [rerender] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const storeZoneId = useMemo(() => {
    const rawValue = router.query.store_zone_id ?? storeDetails?.zone_id;
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }, [router.query.store_zone_id, storeDetails?.zone_id]);
  const storeShare = {
    moduleId: router.query.module || router.query.module_id,
    moduleType: router.query.module_type,
    storeZoneId: storeZoneId ? [storeZoneId] : [],
  };
  const {
    data: bannersData,
    refetch,
    isLoading,
  } = useGetStoreBanners(storeDetails?.id);
  const { data: moduleDataFromApi, refetch: refetchModule } = useGetModule();
  const guestId =
    typeof window !== "undefined"
      ? localStorage.getItem("guest_id")
      : undefined;

  const moduleType = getCurrentModuleType();

  const cartListSuccessHandler = (res) => {
    if (res) {
      console.log({res});
      
      const thisStoreId = storeDetails?.id;
      const tempCartLists = res?.map((item) => ({
        ...item?.item,
        cartItemId: item?.id,
        // Guarantee store_id is present on every row — modal in-cart
        // matchers rely on it to scope detection per store.
        store_id: item?.item?.store_id ?? thisStoreId,
        // Same for module_type so getCartListModuleWise doesn't drop rows.
        module_type: item?.item?.module_type ?? moduleType,
        totalPrice:
         item?.price,
        selectedAddons: item?.item?.addons,
        quantity: item?.quantity,
        food_variations: item?.item?.food_variations,
        itemBasePrice: item?.item?.price,
        selectedOption:
          moduleType !== "food"
            ? item?.variation
            : getSelectedVariations(item?.item?.food_variations),
      }));
      console.log({tempCartLists});
      
      // Store-scoped slot (read by StoreCartSidebar).
      dispatch(setStoreCartList(tempCartLists));
      // Also merge into the global cartList: drop existing rows for THIS
      // store, then append the fresh ones. Other stores' items survive so
      // the multi-store cart drawer stays accurate, and modal in-cart
      // detection (which reads cartList) sees up-to-date data.
      const otherStoresItems = (cartList || [])?.filter(
        (i) => String(i?.store_id) !== String(thisStoreId)
      );
      dispatch(setCartList([...otherStoresItems, ...tempCartLists]));
    }
  };

  const {
    data: cartData,
    isLoading: cartListLoading,
    isFetching: cartListFetching,
    refetch: cartListRefetch,
  } = useGetAllCartList(guestId, cartListSuccessHandler, storeDetails?.id);
  const isCartLoading = cartListLoading || cartListFetching;

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
      storeDetails={storeDetails}
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
      {/* {storeDetails?.announcement === 1 && (
        <StoreCustomMessage
          storeAnnouncement={storeDetails?.announcement_message}
        />
      )} */}
      {topSection}
      {proFeatureEnabled &&
        (activeOffer?.status === true ? (
          <Box sx={{ pt: 2 }}>
            <ProSavingsBanner
              amount={
                activeOffer?.total_saved ??
                activeOffer?.plan_details?.total_saved
              }
              message={proSavingsMessage}
            />
          </Box>
        ) : (
          <Box sx={{ pt: 2 }}>
            {!isProActive && !activeOfferLoading ? (
              <ProPlanBanner onSubscribe={handleProSubscribeClick} />
            ) : null}
          </Box>
        ))}

      {configData?.repeat_order_option && getToken() ? (
        <Box sx={{ pt: 2, pb: 2 }}>
          <LastOrdersSection store_id={storeDetails?.id} />
        </Box>
      ) : null}
      {/* <PopularInTheStore id={storeDetails?.id} storeShare={storeShare} /> */}
      <MiddleSection
        ownCategories={ownCategories}
        storeDetails={storeDetails}
        isSmall={isSmall}
        storeShare={storeShare}
        setExpanded={setExpanded}
        condensedHeaderVisible={condensedHeaderVisible}
      />
      {configData?.prescription_order_status &&
        storeDetails?.prescription_order &&
        getCurrentModuleType() === "pharmacy" && (
          <Prescription
            expanded={expanded}
            storeId={storeDetails?.id}
            storeSlug={storeDetails?.slug}
          />
        )}
    </CustomStackFullWidth>
  );

  const mobileContent = (
    <CustomStackFullWidth spacing={0}>
      {topSection}
      {proFeatureEnabled && hasToken && proOfferResolved && (
        <Box sx={{ px: 2, pt: {xs: 1, md: 4}, pb: {xs: 1.5, md: 4} }}>
          {!isProActive && !activeOfferLoading ? (
            <ProPlanBanner onSubscribe={handleProSubscribeClick} />
          ) : (
            isProActive &&
            proSavingsMessage && (
              <ProSavingsBanner
                amount={
                  activeOffer?.total_saved ??
                  activeOffer?.plan_details?.total_saved
                }
                message={proSavingsMessage}
              />
            )
          )}
        </Box>
      )}

      {configData?.repeat_order_option && getToken() ? (
        <LastOrdersSection store_id={storeDetails?.id} />
      ) : null}
      <Box sx={{ mt: { xs: "0px", md: 0 } }}>
        <CustomContainer>
          <CustomStackFullWidth spacing={2}>
            <MiddleSection
              ownCategories={ownCategories}
              storeDetails={storeDetails}
              isSmall={isSmall}
              storeShare={storeShare}
              setExpanded={setExpanded}
              condensedHeaderVisible={condensedHeaderVisible}
            />
            {configData?.prescription_order_status &&
              storeDetails?.prescription_order &&
              getCurrentModuleType() === "pharmacy" && (
                <Prescription
                  expanded={expanded}
                  storeId={storeDetails?.id}
                  storeSlug={storeDetails?.slug}
                />
              )}
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
            gap: "34px",
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
              storeDetails={storeDetails}
              isCartLoading={isCartLoading}
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
          product_avg_rating={storeDetails?.avg_rating}
          reviews_comments_count={storeDetails?.reviews_comments_count}
          rating_count={storeDetails?.rating_count}
          id={storeDetails?.id}
          restaurantDetails={storeDetails}
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
              "Please select another delivery location so we can check whether the store delivers to your area."
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
            boxShadow: "0px -2px 12px rgba(0, 0, 0, 0.06)",
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
                backgroundColor: "#1E9657",
                color: "#fff",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "14px",
                borderRadius: "8px",
                px: 2.5,
                py: 1.25,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#187C49",
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
      <Drawer
        anchor="bottom"
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            borderRadius: "16px 16px 0 0",
            maxHeight: "90vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            overflow: "hidden",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <StoreCartSidebar storeDetails={storeDetails} />
        </Box>
      </Drawer>
      {proFeatureEnabled && proModalOpen && (
        <ProPlanSubscriptionModal
          open={proModalOpen}
          onClose={() => setProModalOpen(false)}
          onSubscribe={handleProSubscribe}
          isSubmitting={subscribeProMutation.isLoading}
        />
      )}
      {proFeatureEnabled && proPaymentOpen && (
        <ProPlanPaymentModal
          open={proPaymentOpen}
          onClose={() => setProPaymentOpen(false)}
          plan={proSelectedPlan}
        />
      )}
    </>
  );
};

export default StoreDetails;
