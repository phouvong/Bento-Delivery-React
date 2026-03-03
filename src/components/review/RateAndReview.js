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
import { Skeleton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomEmptyResult from "../custom-empty-result";
import nodata from "../../../public/static/nodata.png";
import { Stack } from "@mui/system";


const RateAndReview = ({ onAllItemsReviewed, trackData }) => {
  const { deliveryManInfo } = useSelector((state) => state.searchFilterStore);
  const [type, setType] = useState("items");
  const [items, setItems] = useState([]);
  const loadedOrderId = useRef(null);
  const router = useRouter();
  const { orderId } = router.query;
  const { refetch, data, isRefetching } = useGetOrderDetails(orderId);
  const {
    refetch: refetchTrackOrder,
    data: trackOrderData,
  } = useGetTrackOrderData(orderId);

  // Load items when data arrives for a new order, but preserve local state during refetches
  useEffect(() => {
    if (data && data.length > 0) {
      // Check if this is a new order or the first load
      if (loadedOrderId.current !== orderId) {
        const unReviewedItems = data.filter((item) => item.isReview === false);
        setItems(data);
        loadedOrderId.current = orderId;
      }
      // If it's the same order (just a refetch), keep the local items state
    }
  }, [data, orderId]);

  useEffect(() => {
    if (!orderId) return;
    refetch();
    refetchTrackOrder();
  }, [orderId, refetch, refetchTrackOrder]);

  const handleItemReviewed = (itemId) => {
    if (itemId) {
      setItems((prevItems) => {
        const filtered = prevItems.filter((item) => {
          return item.id !== itemId;
        });
        if (filtered.length === 0) {
          onAllItemsReviewed?.();
        }
        return filtered;
      });
    }
  };
  console.log({ trackOrderData });

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
          (data?.module_type !== "parcel" || items?.module_type !== "parcel") && (
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
            maxWidth: "600px"
          }}
        >
          {type === "items" && (data?.module_type !== "parcel") ? (
            items?.length > 0 ? (
              items?.map((item, index) => {
                return (
                  <CustomPaperBigCard sx={{ padding: { xs: ".5rem", md: "1rem" } }} key={item?.id}>
                    <ItemForm data={item} onReviewComplete={handleItemReviewed} />
                  </CustomPaperBigCard>
                );
              })
            ) : (
              !isRefetching && <CustomEmptyResult label="No items to review" />
            )
          ) : (
            <CustomPaperBigCard sx={{ padding: { xs: ".5rem", md: "1rem" } }}>
              {trackData?.delivery_man ? (
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
                      label="No delivery man assigned for the delivery."
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
