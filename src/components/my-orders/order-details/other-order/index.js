import { useTheme } from "@emotion/react";
import { Box, Skeleton, Stack, Typography, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import useGetTrackOrderData from "../../../../api-manage/hooks/react-query/order/useGetTrackOrderData";
import { useStoreRefundRequest } from "api-manage/hooks/react-query/refund-request/useStoreRefundRequest";
import {
  CustomPaperBigCard,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomDivider from "../../../CustomDivider";
import NoDeliveryManImage from "../../../NoDeliveryManImage";
import TrackParcelOrderDrawer from "../../../home/module-wise-components/parcel/TrackParcelOrderDrawer";
import TrackOrder from "../../../track-order";
import ProfileTab from "../../../user-information/ProfileTab";
import TopDetails from "../TopDetails";
import {
  orderDetailsMenuData,
  orderDetailsMenuDataForParcel,
  orderDetailsMenuDataTakeAway,
} from "../orderDetailsMenuData";
import DeliveryManInfo from "./DeliveryManInfo";
import OrderSummery from "./OrderSummery";
import RefundModal from "./RefundModal";
import StoreDetails from "./StoreDetails";
import { useSelector } from "react-redux";
import { getGuestId, getToken } from "helper-functions/getToken";
import { useUpdatePaymentMethod } from "api-manage/hooks/react-query/payment-method/useUpdatePaymentMethod";
import { useGetFailedPayment } from "api-manage/hooks/react-query/useGetFailedPayment";
import { cod_exceeds_message } from "utils/toasterMessages";


const OtherOrder = (props) => {
  const { configData, data, refetch, id, dataIsLoading, page } = props;
  const [openModal, setOpenModal] = useState(false);
  const [currentTab, setCurrentTab] = useState(orderDetailsMenuData[0]?.name);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
  const router = useRouter();
  const { tab } = router.query;
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const guestId = getGuestId();
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const phone = guestUserInfo?.contact_person_number || router.query?.phone;
  const [paymentFailedData, setPaymentFailedData] = useState(null);
  const { mutate: paymentMethodUpdateMutation, isLoading: repayOrderLoading } =
    useUpdatePaymentMethod();
  const {
    refetch: refetchTrackOrder,
    data: trackOrderData,
    isLoading: trackDataIsLoading,
    isFetching: trackDataIsFetching,
  } = useGetTrackOrderData(id, phone, guestId);
  const { refetch: refetchFailedPayment, data: failPayment } = useGetFailedPayment(
    trackOrderData?.id,
    (res) => {
      if (res) {
        setPaymentFailedData?.(res);
      }
    }
  );
  useEffect(() => {
    if (trackOrderData?.id) {
      refetchFailedPayment();
    }
  }, [trackOrderData?.id]);
  useEffect(() => {
    if (!id) return;

    if (getToken() || phone) {
      refetchTrackOrder();
    }
  }, [id, phone, guestId, refetchTrackOrder]);

  useEffect(() => {
    let interval;

    if (trackOrderData?.delivery_man && currentTab === "track-order") {
      refetchTrackOrder(); // run immediately once
      interval = setInterval(() => {
        refetchTrackOrder();
      }, 10000); // repeat every 10 seconds
    }

    return () => clearInterval(interval); // cleanup on unmount or dependency change
  }, [trackOrderData, currentTab]);

  const { mutate, isLoading: refundIsLoading } = useStoreRefundRequest();
  const formSubmitHandler = (values) => {
    const tempValue = { ...values, id };
    const onSuccessHandler = async (resData) => {
      if (resData) {
        await refetchTrackOrder();
        toast.success(resData.message);
        setOpenModal(false);
      }

      // router.push('/')
    };
    mutate(tempValue, {
      onSuccess: onSuccessHandler,
      onError: onErrorResponse,
    });
  };
  const handleTab = (item) => {
    if (item.name === "track-order") {
      if (trackOrderData?.module_type === "parcel") {
        setSideDrawerOpen(true);
      } else {
        setCurrentTab(item?.name);
      }
    } else {
      setCurrentTab(item?.name);
    }
  };
  useEffect(() => {
    if (tab) {
      setCurrentTab(tab);
    }
  }, [tab]);
  const handlePayment = () => {
    const handleSuccess = (response) => {
      toast.success(response.message);
      refetchTrackOrder();
      refetch();
      //setOpenPaymentMethod(false);
    };

    const formData = {
      order_id: trackOrderData?.id,
      _method: "put",
    };
    if (paymentFailedData?.maximum_cod_order_amount > trackOrderData?.order_amount) {
      paymentMethodUpdateMutation(formData, {
        onSuccess: handleSuccess,
        onError: onErrorResponse,
      });
    } else {
      toast.error(cod_exceeds_message);
    }
  };
  const activeTabPanel = () => {
    switch (currentTab) {
      case "order-summary":
        return (
          <OrderSummery
            trackOrderData={trackOrderData}
            refetchTrackOrder={refetchTrackOrder}
            configData={configData}
            t={t}
            data={data}
            isLoading={trackDataIsLoading}
            dataIsLoading={dataIsLoading}
            openPaymentMethod={openPaymentMethod}
            setOpenPaymentMethod={setOpenPaymentMethod}
            handlePayment={handlePayment}
            repayOrderLoading={repayOrderLoading}
          />
        );
        break;
      case "seller-info":
        return (
          <>
            {data && data.module_type !== "parcel" && (
              <StoreDetails
                storeData={trackOrderData?.store}
                configData={configData}
                t={t}
              />
            )}
          </>
        );
        break;
      case "delivery-man-info":
        return (
          <>
            {trackOrderData?.delivery_man ? (
              <DeliveryManInfo
                deliveryManData={trackOrderData?.delivery_man}
                configData={configData}
                storeData={trackOrderData?.store}
                t={t}
              />
            ) : (
              <CustomStackFullWidth
                minHeight="20vh"
                justifyContent="center"
                alignItems="center"
              >
                <NoDeliveryManImage />
                <Typography>{t("No delivery man assigned")} </Typography>
              </CustomStackFullWidth>
            )}
          </>
        );
        break;
      case "track-order":
        return (
          <TrackOrder
            trackOrderData={trackOrderData}
            configData={configData}
            t={t}
          />
        );
        break;
      default:
        break;
    }
  };

  if (dataIsLoading) {
    const skeletonContent = (
      <Stack spacing={2} sx={{ width: "100%", p: { xs: 2, sm: 3, md: 3 } }}>
        {/* Header row: Order ID + status chips + Cancel button */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="text" width={160} height={28} />
            <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: "6px" }} />
            <Skeleton variant="rounded" width={100} height={24} sx={{ borderRadius: "6px" }} />
          </Stack>
          <Skeleton variant="rounded" width={110} height={36} sx={{ borderRadius: "8px" }} />
        </Stack>

        {/* Order date */}
        <Skeleton variant="text" width={160} height={20} />

        {/* Tabs */}
        <Stack direction="row" spacing={1}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" width={110} height={36} sx={{ borderRadius: "6px" }} />
          ))}
        </Stack>

        {/* Content area: items + summary */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
            gap: 2,
          }}
        >
          {/* Items list */}
          <Stack spacing={1.5}>
            {Array.from({ length: 2 }).map((_, i) => (
              <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                <Skeleton variant="rounded" width={64} height={64} sx={{ borderRadius: "8px", flexShrink: 0 }} />
                <Stack spacing={0.5} flex={1}>
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={18} />
                  <Skeleton variant="text" width="30%" height={18} />
                </Stack>
                <Skeleton variant="text" width={60} height={22} />
              </Stack>
            ))}
          </Stack>

          {/* Summary card */}
          <Stack
            spacing={1}
            sx={{
              minWidth: { xs: "100%", md: 200 },
              border: (t) => `1px solid ${t.palette.divider}`,
              borderRadius: "10px",
              p: 2,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Stack key={i} direction="row" justifyContent="space-between">
                <Skeleton variant="text" width={90} height={18} />
                <Skeleton variant="text" width={60} height={18} />
              </Stack>
            ))}
            <Box sx={{ borderBottom: (t) => `2px solid ${t.palette.divider}`, my: 0.5 }} />
            <Stack direction="row" justifyContent="space-between">
              <Skeleton variant="text" width={50} height={22} />
              <Skeleton variant="text" width={70} height={22} />
            </Stack>
          </Stack>
        </Box>

        {/* Address + Payment row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <Stack
              key={i}
              spacing={1}
              sx={{
                border: (t) => `1px solid ${t.palette.divider}`,
                borderRadius: "10px",
                p: 2,
              }}
            >
              <Skeleton variant="text" width={80} height={22} />
              <Skeleton variant="text" width="80%" height={18} />
              <Skeleton variant="text" width="60%" height={18} />
            </Stack>
          ))}
        </Box>
      </Stack>
    );

    return (
      <CustomStackFullWidth alignItems="center" justifyContent="center" mb="2rem">
        {isSmall ? (
          <CustomPaperBigCard padding="14px">{skeletonContent}</CustomPaperBigCard>
        ) : (
          skeletonContent
        )}
      </CustomStackFullWidth>
    );
  }

  const content = (
    <>
      <TopDetails
        data={data}
        trackData={trackOrderData}
        trackDataIsLoading={trackDataIsLoading}
        trackDataIsFetching={trackDataIsFetching}
        currentTab={currentTab}
        configData={configData}
        id={id}
        openModal={openModal}
        setOpenModal={setOpenModal}
        refetchOrderDetails={refetch}
        refetchTrackData={refetchTrackOrder}
        dataIsLoading={dataIsLoading}
        openPaymentMethod={openPaymentMethod}
        setOpenPaymentMethod={setOpenPaymentMethod}
        page={page}
        paymentMethodUpdateMutation={paymentMethodUpdateMutation}
        paymentFailedData={paymentFailedData}
        setPaymentFailedData={setPaymentFailedData}
      />
      <CustomDivider border={isSmall ? "1px" : undefined} />
      {!trackDataIsLoading && (
        <ProfileTab
          menuData={
            data && data.module_type === "parcel"
              ? orderDetailsMenuDataForParcel
              : trackOrderData?.order_type === "take_away"
                ? orderDetailsMenuDataTakeAway
                : orderDetailsMenuData
          }
          marginright="20px"
          fontSize="14px"
          padding="15px 15px 15px 25px"
          borderRadius="5px"
          page={currentTab}
          handlePage={handleTab}
        />
      )}
      {trackOrderData && activeTabPanel()}
    </>
  );

  return (
    <CustomStackFullWidth alignItems="center" justifyContent="center" mb="2rem">
      {isSmall ? (
        <CustomPaperBigCard padding="14px">{content}</CustomPaperBigCard>
      ) : (
        content
      )}
      <RefundModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        // reasons={reasonsData?.refund_reasons}
        formSubmit={formSubmitHandler}
        refundIsLoading={refundIsLoading}
      />
      {sideDrawerOpen && trackOrderData && (
        <TrackParcelOrderDrawer
          orderId={trackOrderData?.id}
          sideDrawerOpen={sideDrawerOpen}
          setSideDrawerOpen={setSideDrawerOpen}
          closeHandler={() => setSideDrawerOpen(false)}
          phoneOrEmail={phone}
        />
      )}
    </CustomStackFullWidth>
  );
};

OtherOrder.propTypes = {};

export default OtherOrder;
