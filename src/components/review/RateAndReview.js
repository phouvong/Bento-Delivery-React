import React, { useEffect, useState, useRef } from "react";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import useGetOrderDetails from "../../api-manage/hooks/react-query/order/useGetOrderDetails";
import GroupButtonsRateAndReview from "./GroupButtonsRateAndReview";
import ItemForm from "./ItemsFrom";
import Shimmer from "./Shimmer";
import DeliverymanForm from "./DeliverymanForm";
import useGetTrackOrderData from "../../api-manage/hooks/react-query/order/useGetTrackOrderData";
import { Box, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomEmptyResult from "../custom-empty-result";
import nodata from "../../../public/static/nodata.png";
import { Stack } from "@mui/system";
import CustomImageContainer from "../CustomImageContainer";
import ServiceReviewForm from "./ServiceReviewForm";
import ServicemanReviewForm from "./ServicemanReviewForm";

const parseJson = (raw) => {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// Expands bogo/bundle rows into their nested items, deduped by item_id, and
// skips any item_id that already has an entry in the order's `reviews` array
// (the order-details endpoint doesn't know per-item review state itself).
const extractReviewableItems = (rows = [], reviewedItemIds = new Set()) => {
  const seenItemIds = new Set();
  const result = [];

  const addLine = (line, orderId) => {
    const itemId = line?.item_id;
    if (
      itemId == null ||
      seenItemIds.has(itemId) ||
      reviewedItemIds.has(itemId)
    )
      return;
    seenItemIds.add(itemId);
    const itemDetails = parseJson(line?.item_details);
    result.push({
      id: line?.id,
      item_id: itemId,
      order_id: orderId ?? line?.order_id,
      quantity: line?.quantity,
      item_details: itemDetails,
      image_full_url: itemDetails?.image_full_url ?? line?.image_full_url,
    });
  };

  rows.forEach((row) => {
    if (row?.bogo_details) {
      [...(row.bogo_details.buy_items ?? []), ...(row.bogo_details.free_items ?? [])].forEach(
        (line) => addLine(line, row?.order_id),
      );
      return;
    }
    if (row?.bundle_details) {
      (row.bundle_details.items ?? []).forEach((line) => addLine(line, row?.order_id));
      return;
    }
    addLine(row, row?.order_id);
  });

  return result;
};

const extractReviewableServiceItems = (details = []) => {
  const idByName = new Map();
  details.forEach((row) => {
    if (row?.service_id != null && row?.service_name) {
      idByName.set(row.service_name, row.service_id);
    }
  });

  const seenIds = new Set();
  const result = [];
  const addService = (serviceId, serviceName, imageFullUrl) => {
    if (serviceId == null || seenIds.has(serviceId)) return;
    seenIds.add(serviceId);
    result.push({
      service_id: serviceId,
      service_name: serviceName,
      image_full_url: imageFullUrl,
    });
  };

  details.forEach((row) => {
    if (row?.bundle_details?.items?.length) {
      row.bundle_details.items.forEach((item) => {
        addService(
          item?.id ?? item?.service_id ?? idByName.get(item?.name),
          item?.name,
          item?.image_full_url ?? item?.image,
        );
      });
      return;
    }
    addService(row?.service_id, row?.service_name, row?.image_full_url);
  });

  return result;
};

const RateAndReview = ({
  onAllItemsReviewed,
  trackData,
  data: serviceData,
  isServiceBooking,
}) => {
  const { t } = useTranslation();
  const { deliveryManInfo } = useSelector((state) => state.searchFilterStore);
  const [type, setType] = useState("items");
  const [items, setItems] = useState([]);
  const loadedOrderId = useRef(null);
  const router = useRouter();
  const { orderId } = router.query;
  const { refetch, data, isRefetching } = useGetOrderDetails(orderId);
  const { refetch: refetchTrackOrder } = useGetTrackOrderData(orderId);

  // ── Service booking review ──
  // Driven entirely by the booking payload (provider + details[]), not the
  // order-details endpoint. Each service in details[] gets its own rating form.
  const isService = isServiceBooking || !!serviceData?.provider;

  // Load items when data arrives for a new order, but preserve local state during refetches.
  // Reviewed item_ids come from the `trackData` PROP, not the internal
  // `trackOrderData` query above — that query is `enabled: false` and only
  // resolves after `refetchTrackOrder()` fires in a later effect, so it's
  // very often still empty the first (and, per the `loadedOrderId` guard,
  // only) time this effect runs. `trackData` is fetched by the parent and is
  // already populated by the time this drawer can even open.
  useEffect(() => {
    if (data && data.length > 0) {
      // Check if this is a new order or the first load
      if (loadedOrderId.current !== orderId) {
        const reviewedItemIds = new Set(
          (trackData?.reviews ?? []).map((review) => review?.item_id),
        );
        setItems(extractReviewableItems(data, reviewedItemIds));
        loadedOrderId.current = orderId;
      }
      // If it's the same order (just a refetch), keep the local items state
    }
  }, [data, orderId, trackData?.reviews]);

  useEffect(() => {
    if (!orderId || isService) return;
    refetch();
    refetchTrackOrder();
  }, [orderId, isService, refetch, refetchTrackOrder]);

  const hasPendingDeliverymanReview =
    !!trackData?.delivery_man && !trackData?.is_reviewed;

  const handleItemReviewed = (itemId) => {
    if (itemId) {
      setItems((prevItems) => {
        const filtered = prevItems.filter((item) => {
          return item.id !== itemId;
        });
        if (filtered.length === 0) {
          if (hasPendingDeliverymanReview) {
            setType("delivery_man");
          } else {
            onAllItemsReviewed?.();
          }
        }
        return filtered;
      });
    }
  };

  const [serviceItems, setServiceItems] = useState([]);
  const [servicemen, setServicemen] = useState([]);
  const [serviceReviewType, setServiceReviewType] = useState("services");
  useEffect(() => {
    if (isService && Array.isArray(serviceData?.details)) {
      console.log("[RateAndReview] serviceData.details", serviceData.details);
      const extracted = extractReviewableServiceItems(serviceData.details);
      console.log("[RateAndReview] extracted serviceItems", extracted);
      setServiceItems(extracted);
    }
    // Service module bookings never require a serviceman — reviewing one
    // isn't part of the business flow here, so servicemen stays empty and
    // the "Servicemen" tab (gated on servicemen.length > 0) never shows.
  }, [isService, serviceData]);

  // Close the drawer only once BOTH services and servicemen are fully reviewed.
  const handleServiceReviewed = (serviceId) => {
    setServiceItems((prev) => {
      const filtered = prev.filter((s) => s?.service_id !== serviceId);
      if (filtered.length === 0 && servicemen.length === 0)
        onAllItemsReviewed?.();
      return filtered;
    });
  };

  const handleServicemanReviewed = (servicemanId) => {
    setServicemen((prev) => {
      const filtered = prev.filter((s) => s?.id !== servicemanId);
      if (filtered.length === 0 && serviceItems.length === 0)
        onAllItemsReviewed?.();
      return filtered;
    });
  };

  if (isService) {
    const provider = serviceData?.provider;
    return (
      <CustomStackFullWidth alignItems="center" spacing={2} mt="1rem">
        {provider && (
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ width: "100%", maxWidth: "600px" }}
          >
            <CustomImageContainer
              src={provider?.logo_full_url}
              width="48px"
              height="48px"
              borderRadius="50%"
              objectFit="cover"
            />
            <Typography fontSize="16px" fontWeight="700">
              {provider?.name}
            </Typography>
          </Stack>
        )}
        {servicemen?.length > 0 && (
          <Box sx={{ width: "100%", maxWidth: "600px" }}>
            <Tabs
              value={serviceReviewType}
              onChange={(e, value) => setServiceReviewType(value)}
              centered
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label={t("Services")} value="services" />
              <Tab label={t("Servicemen")} value="servicemen" />
            </Tabs>
          </Box>
        )}
        <CustomStackFullWidth spacing={3} sx={{ maxWidth: "600px" }}>
          {serviceReviewType === "servicemen" ? (
            servicemen?.length > 0 ? (
              servicemen.map((serviceman) => (
                <CustomPaperBigCard
                  sx={{ padding: { xs: ".5rem", md: "1rem" } }}
                  key={serviceman?.id}
                >
                  <ServicemanReviewForm
                    bookingId={serviceData?.id}
                    serviceman={serviceman}
                    onReviewComplete={handleServicemanReviewed}
                  />
                </CustomPaperBigCard>
              ))
            ) : (
              <CustomEmptyResult image={nodata} label="No servicemen to review" />
            )
          ) : serviceItems?.length > 0 ? (
            serviceItems.map((service) => (
              <CustomPaperBigCard
                sx={{ padding: { xs: ".5rem", md: "1rem" } }}
                key={service?.service_id}
              >
                <ServiceReviewForm
                  bookingId={serviceData?.id}
                  service={service}
                  onReviewComplete={handleServiceReviewed}
                />
              </CustomPaperBigCard>
            ))
          ) : (
            <CustomEmptyResult
              image={nodata}
              label={
                serviceData?.is_reviewed
                  ? "You have already reviewed this booking"
                  : "No services to review"
              }
            />
          )}
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  }

  return (
    <CustomStackFullWidth
      alignItems="center"
      justifyContent="center"
      spacing={2}
      mt="1rem"
    >
      <>
        {isRefetching && !items.length && !data ? (
          <Skeleton variant="ractangle" width="100px" height="100%" />
        ) : (
          trackData?.delivery_man &&
          (data?.module_type !== "parcel" ||
            items?.module_type !== "parcel") && (
            <GroupButtonsRateAndReview
              setType={setType}
              type={type}
              moduleType={data?.module_type}
            />
          )
        )}

        <CustomStackFullWidth
          alignItems="center"
          justifyContent="center"
          spacing={3}
          sx={{
            maxWidth: "600px",
          }}
        >
          {type === "items" && data?.module_type !== "parcel" ? (
            items?.length > 0 ? (
              items?.map((item, index) => {
                return (
                  <CustomPaperBigCard
                    sx={{ padding: { xs: ".5rem", md: "1rem" } }}
                    key={item?.id}
                  >
                    <ItemForm
                      data={item}
                      onReviewComplete={handleItemReviewed}
                    />
                  </CustomPaperBigCard>
                );
              })
            ) : (
              !isRefetching && (
                <CustomEmptyResult image={nodata} label="No items to review" />
              )
            )
          ) : (
            <CustomPaperBigCard sx={{ padding: { xs: ".5rem", md: "1rem" } }}>
              {trackData?.delivery_man && !trackData?.is_reviewed ? (
                <DeliverymanForm
                  data={trackData?.delivery_man}
                  orderId={orderId}
                  onReviewComplete={() => onAllItemsReviewed?.()}
                />
              ) : (
                <CustomStackFullWidth
                  justifyContent="center"
                  alignItems="center"
                  paddingBottom="20px"
                >
                  <Stack
                    width="100%"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                  >
                    <CustomEmptyResult
                      label={
                        trackData?.delivery_man
                          ? "You have already reviewed the delivery man"
                          : "No delivery man assigned for the delivery."
                      }
                      image={nodata}
                    />
                  </Stack>
                </CustomStackFullWidth>
              )}
            </CustomPaperBigCard>
          )}
        </CustomStackFullWidth>
      </>
    </CustomStackFullWidth>
  );
};

export default RateAndReview;
