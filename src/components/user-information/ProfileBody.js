import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { Stack } from "@mui/system";
import Wallet from "../wallet";
import Profile from "../profile";
import OrderDetails from "../my-orders/order-details";
import BookingDetails from "../home/module-wise-components/service/components/my-bookings/booking-details";
import ProfileOrdersPage, { ORDER_TAB_MODULE_KEY } from "./ProfileOrdersPage";
import { ModuleTypes } from "helper-functions/moduleTypes";
import LoyaltyPoints from "../loyalty-points";
import ReferralCode from "../referral-code";
import CouponsTabbedPage from "./CouponsTabbedPage";
import Chatting from "../chat/Chatting";
import Settings from "../settings";
import MyTrips from "components/home/module-wise-components/rental/components/my-trips/MyTrips";
import SubscriptionPlanPage from "./subscription/SubscriptionPlanPage";
import MonthlyCartListPage from "./MonthlyCartListPage";
import TrackOrderInput from "../track-order/TrackOrderInput";
import CustomService from "../home/module-wise-components/service/components/custom-service";
import ServiceRequest from "components/home/module-wise-components/service/components/service-request";

const ORDER_DETAIL_PAGES = [
  "my-orders",
  "my-orders?flag=success",
  "my-orders?flag=cancel",
  "my-orders?flag=fail",
];

const WALLET_PAGES = [
  "wallet",
  "wallet?flag=success",
  "wallet?flag=cancel",
  "wallet?flag=fail",
];

const SUBSCRIPTION_PAGES = [
  "subscription-plan",
  "subscription-plan?flag=success",
  "subscription-plan?flag=cancel",
  "subscription-plan?flag=fail",
];

const ProfileBody = ({
  page,
  configData,
  orderId,
  setEditProfile,
  editProfile,
  addAddress,
  setAddAddress,
  editAddress,
  refetch,
  setEditAddress,
  deleteUserHandler,
  accountDeleteStatus,
  setAccountDeleteStatus,
  isLoadingDelete,
}) => {
  const router = useRouter();
  const { modules } = useSelector((state) => state.configData);
  const urlModuleId = router.query[ORDER_TAB_MODULE_KEY];
  const modulesLoaded = Array.isArray(modules) && modules.length > 0;
  const activeModule = modules?.find(
    (m) => String(m.id) === String(urlModuleId),
  );
  const isServiceBooking = activeModule?.module_type === ModuleTypes.SERVICE;
  const isModuleLookupPending = !!urlModuleId && !modulesLoaded;

  const renderContent = () => {
    if (page === "profile-settings") {
      return (
        <Profile
          configData={configData}
          editProfile={editProfile}
          setEditProfile={setEditProfile}
          addAddress={addAddress}
          setAddAddress={setAddAddress}
          editAddress={editAddress}
          addressRefetch={refetch}
          setEditAddress={setEditAddress}
        />
      );
    }
    if (page === "monthly-cart-list") {
      return <MonthlyCartListPage configData={configData} />;
    }

    if (page === "track-order") {
      return <TrackOrderInput configData={configData} pt="0px" />;
    }

    if (page === "my-orders" && !orderId) {
      return <ProfileOrdersPage configData={configData} />;
    }

    if (ORDER_DETAIL_PAGES.includes(page) && orderId) {
      if (isModuleLookupPending) {
        return (
          <Stack spacing={2} sx={{ width: "100%", p: { xs: 2, sm: 3, md: 3 } }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Skeleton variant="text" width={160} height={28} />
              <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: "6px" }} />
            </Stack>
            <Skeleton variant="text" width={160} height={20} />
            <Stack direction="row" spacing={1}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" width={110} height={36} sx={{ borderRadius: "6px" }} />
              ))}
            </Stack>
            <Skeleton variant="rounded" width="100%" height={160} sx={{ borderRadius: "10px" }} />
          </Stack>
        );
      }
      return isServiceBooking ? (
        <BookingDetails configData={configData} id={orderId} />
      ) : (
        <OrderDetails configData={configData} id={orderId} page={page} />
      );
    }

    if (page === "my-trips") {
      return <MyTrips configData={configData} />;
    }

    if (WALLET_PAGES.includes(page)) {
      return <Wallet configData={configData} />;
    }

    if (page === "loyalty-points") {
      return <LoyaltyPoints configData={configData} />;
    }

    if (page === "referral-code") {
      return <ReferralCode configData={configData} />;
    }

    if (page === "coupons") {
      return <CouponsTabbedPage configData={configData} />;
    }

    if (page === "inbox") {
      return <Chatting configData={configData} />;
    }

    if (SUBSCRIPTION_PAGES.includes(page)) {
      return <SubscriptionPlanPage configData={configData} />;
    }

    if (page === "settings") {
      return (
        <Settings
          configData={configData}
          deleteUserHandler={deleteUserHandler}
          accountDeleteStatus={accountDeleteStatus}
          setAccountDeleteStatus={setAccountDeleteStatus}
          isLoadingDelete={isLoadingDelete}
        />
      );
    }

    if (page === "custom-service") {
      return <CustomService configData={configData} />;
    }
    if (page === "service-request") {
      return <ServiceRequest configData={configData} />;
    }
  };

  return <Stack>{renderContent()}</Stack>;
};

export default ProfileBody;
