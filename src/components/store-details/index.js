import React, { useEffect, useMemo, useState } from "react";
import { Button, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import Prescription from "../Prescription";
import CustomContainer from "../container";
import Top from "./Top";
import MiddleSection from "./middle-section";
import PopularInTheStore from "./popular";
import { useRouter } from "next/router";
import useGetStoreBanners from "../../api-manage/hooks/react-query/store/useGetStoreBanners";
import StoreCustomMessage from "./StoreCustomMessage";
import useGetModule from "../../api-manage/hooks/react-query/useGetModule";
import { useDispatch } from "react-redux";
import { setSelectedModule } from "redux/slices/utils";
import CustomModal from "components/modal";
import RestaurantReviewModal from "components/store-details/ReviewModal";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import dynamic from "next/dynamic";
import CustomImageContainer from "components/CustomImageContainer";
import locationImage from "../../../public/static/fi_854878.svg";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [openStoreZoneModal, setOpenStoreZoneModal] = useState(false);
  const [openMapModal, setOpenMapModal] = useState(false);
  const bannerCover = storeDetails?.cover_photo_full_url;
  const ownCategories = storeDetails?.category_ids;
  const logo = storeDetails?.logo_full_url;
  const [rerender, setRerender] = useState(false);
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

  useEffect(() => {
    refetchModule();
    refetch();
  }, []);

  useEffect(() => {
    if (moduleDataFromApi) {
      moduleDataFromApi?.filter((item) => {
        if (storeShare.moduleId == item.id) {
          localStorage.setItem("module", JSON.stringify(item));
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
      latestCurrentLatLng?.lat !== undefined && latestCurrentLatLng?.lat !== null;
    if (!hasLatestCurrentLatLng) return;

    if (!latestZoneid || storeZoneId == null) return;

    const zoneIds = parseZoneIdsFromStorageValue(latestZoneid);
    if (zoneIds.length === 0) return;

    if (!zoneIds.includes(storeZoneId)) {
      setOpenStoreZoneModal(true);
    }
  };

  const layoutHandler = () => {
    if (isSmall) {
      return (
        <CustomStackFullWidth spacing={{ xs: 1, sm: 2, md: 3 }}>
          {storeDetails?.announcement === 1 && (
            <StoreCustomMessage
              storeAnnouncement={storeDetails?.announcement_message}
            />
          )}
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
          />
          <PopularInTheStore id={storeDetails?.id} storeShare={storeShare} />
          <CustomContainer>
            <CustomStackFullWidth spacing={3}>
              <MiddleSection
                ownCategories={ownCategories}
                storeDetails={storeDetails}
                isSmall={isSmall}
                storeShare={storeShare}
                setExpanded={setExpanded}
              />
              {configData?.prescription_order_status &&
                storeDetails?.prescription_order &&
                getCurrentModuleType() === "pharmacy" && (
                  <Prescription
                    expanded={expanded}
                    storeId={storeDetails?.id}
                  />
                )}
            </CustomStackFullWidth>
          </CustomContainer>
        </CustomStackFullWidth>
      );
    } else {
      return (
        <CustomContainer>
          <CustomStackFullWidth spacing={3} mt="1rem">
            {storeDetails?.announcement === 1 && (
              <StoreCustomMessage
                storeAnnouncement={storeDetails?.announcement_message}
              />
            )}
            <Top
              bannerCover={bannerCover}
              storeDetails={storeDetails}
              configData={configData}
              logo={logo}
              isSmall={isSmall}
              storeShare={storeShare}
              bannersData={bannersData}
              setOpenReviewModal={setOpenReviewModal}
            />
            <PopularInTheStore id={storeDetails?.id} storeShare={storeShare} />
            <MiddleSection
              ownCategories={ownCategories}
              storeDetails={storeDetails}
              isSmall={isSmall}
              storeShare={storeShare}
              setExpanded={setExpanded}
            />
            {configData?.prescription_order_status &&
              storeDetails?.prescription_order &&
              getCurrentModuleType() === "pharmacy" && (
                <Prescription expanded={expanded} storeId={storeDetails?.id} />
              )}
          </CustomStackFullWidth>
        </CustomContainer>
      );
    }
  };
  return (
    <>
      <CustomStackFullWidth
        key={rerender}
        sx={{ minHeight: "100vh" }}
        spacing={3}
      >
        {layoutHandler()}
      </CustomStackFullWidth>
      <CustomModal
        openModal={openReviewModal}
        handleClose={() => setOpenReviewModal(false)}
      >
        <RestaurantReviewModal
          product_avg_rating={storeDetails?.avg_rating}
          reviews_comments_count={storeDetails?.reviews_comments_count}
          rating_count={storeDetails?.rating_count}
          id={storeDetails?.id}
          restaurantDetails={storeDetails}
          configData={configData}
        />
      </CustomModal>
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
          <Typography  fontSize="18px" fontWeight="500">
            {t("Sorry !")}
          </Typography>
          <Typography  fontSize="18px" fontWeight="500">
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
    </>
  );
};

export default StoreDetails;
