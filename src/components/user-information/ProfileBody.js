import React from "react";
import { Stack } from "@mui/system";
import Wallet from "../wallet";
import Profile from "../profile";
import OrderDetails from "../my-orders/order-details";
import ProfileOrdersPage from "./ProfileOrdersPage";
import LoyaltyPoints from "../loyalty-points";
import ReferralCode from "../referral-code";
import CouponsTabbedPage from "./CouponsTabbedPage";
import Chatting from "../chat/Chatting";
import Settings from "../settings";
import MyTrips from "components/home/module-wise-components/rental/components/my-trips/MyTrips";
import SubscriptionPlanPage from "./subscription/SubscriptionPlanPage";
import MonthlyCartListPage from "./MonthlyCartListPage";
import TrackOrderInput from "../track-order/TrackOrderInput";

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
      return <OrderDetails configData={configData} id={orderId} page={page} />;
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
  };

  return <Stack>{renderContent()}</Stack>;
};

export default ProfileBody;
