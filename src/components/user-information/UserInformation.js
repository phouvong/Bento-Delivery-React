import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useDeleteProfile } from "api-manage/hooks/react-query/profile/useDeleteProfile";
import { getToken } from "helper-functions/getToken";
import { t } from "i18next";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setWalletAmount } from "redux/slices/cart";
import { setUser } from "redux/slices/profileInfo";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import useGetUserInfo from "../../api-manage/hooks/react-query/user/useGetUserInfo";
import PushNotificationLayout from "../PushNotificationLayout";
import CustomContainer from "../container";
import BodySection from "./BodySection";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import ProfileIntro from "./ProfileIntro";
import AccountMenuPanel from "components/header/second-navbar/account-popover/AccountMenuPanel";

// ── Page title map ────────────────────────────────────────────────────────────
const PAGE_TITLES = {
  "profile-settings": "Profile",
  "my-orders": "Orders & Trips",
  wallet: "My Wallet",
  coupons: "Available Coupons",
  offers: "Available Offers",
  "loyalty-points": "Loyalty Points",
  "referral-code": "Referral Code",
  inbox: "Inbox",
  settings: "Settings",
  addresses: "Addresses",
  "monthly-cart-list": "Monthly Cart List",
  "subscription-plan": "Subscription Plan",
  "track-order": "Track Orders",
};

// ── Page key → menu item key mapping ─────────────────────────────────────────
const PAGE_TO_MENU_KEY = {
  addresses: "addresses",
  "my-orders": "orders-trips",
  wallet: "wallet",
  coupons: "coupons",
  offers: "offers",
  "loyalty-points": "loyalty",
  "referral-code": "referral",
  inbox: "inbox",
  settings: "settings",
  "profile-settings": null,
  "monthly-cart-list": "monthly-cart-list",
  "subscription-plan": "subscription-plan",
  "track-order": "track-orders",
};

const UserInformation = ({ page, configData, orderId }) => {
  const theme = useTheme();
  useScrollToTop();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [accountDeleteStatus, setAccountDeleteStatus] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSuccess = (res) => {
    localStorage.setItem("wallet_amount", res?.wallet_balance);
    dispatch(setWalletAmount(res?.wallet_balance));
    dispatch(setUser(res));
  };

  const userToken = getToken();
  const { data, refetch, isLoading } = useGetUserInfo(handleSuccess);

  const onSuccessHandlerForUserDelete = (res) => {
    if (res?.errors) {
      setAccountDeleteStatus(false);
    } else {
      localStorage.removeItem("token");
      toast.success(t("Account has been deleted"));
      dispatch(setUser(null));
      router.push("/", undefined, { shallow: true });
    }
  };

  const { mutate, isLoading: isLoadingDelete } = useDeleteProfile(
    onSuccessHandlerForUserDelete,
  );
  const deleteUserHandler = () => mutate();

  const [addAddress, setAddAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const activePage = page ?? "profile-settings";
  const activeMenuKey = PAGE_TO_MENU_KEY[activePage] ?? null;
  const isOrderDetails = activePage === "my-orders" && Boolean(orderId);

  // Mobile: derive from URL — if on a sub-page, show content; else show sidebar
  const mobileView =
    isMobile && activePage !== "profile-settings" ? "content" : null;
  const setMobileView = (val) => {
    if (!val) router.push("/profile");
  };

  const handleMenuItemClick = (item) => {
    if (isMobile) {
      setMobileView("content");
    }
    router.push(item.path);
  };

  const sidebar = (
    <Box
      sx={{
        backgroundColor: { xs: "background.default", md: "background.paper" },
        borderRadius: "16px",

        width: { xs: "100%", md: "246px" },
        flexShrink: 0,
        boxShadow: {
          xs: "none",
          md: "0px 1px 4px rgba(0,0,0,0.10), 0px 1px 4px rgba(0,0,0,0.05)",
        },
        alignSelf: "flex-start",
        position: "sticky",
        top: { xs: "16px", md: "80px" },
        paddingLeft: { xs: "16px", md: "0px" },
        paddingRight: { xs: "16px", md: "0px" },
      }}
    >
      <AccountMenuPanel
        bg={isMobile ? "gray" : "white"}
        token={userToken}
        hideTopSection={isMobile ? false : true}
        hideLoginButton
        activePage={activeMenuKey}
        onItemClick={handleMenuItemClick}
        onClose={() => {}}
      />
    </Box>
  );

  const content = (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <BodySection
        page={activePage}
        configData={configData}
        orderId={orderId}
        userToken={userToken}
        deleteUserHandler={deleteUserHandler}
        accountDeleteStatus={accountDeleteStatus}
        setAccountDeleteStatus={setAccountDeleteStatus}
        isLoadingDelete={isLoadingDelete}
      />
    </Box>
  );

  return (
    <PushNotificationLayout>
      <CustomStackFullWidth>
        {/* ── Mobile simple top bar ── */}
        {isMobile && (
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1251,
              backgroundColor: "background.paper",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              px: "8px",
              pt: "12px",
              pb: "8px",
              boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
              borderRadius: "0 0 16px 16px",
            }}
          >
            <IconButton
              onClick={() => {
                if (isOrderDetails) {
                  router.push({
                    pathname: "/profile",
                    query: {
                      page: "my-orders",
                      // Restore the previously selected module tab.
                      ...(router.query.orderTabModule
                        ? { orderTabModule: router.query.orderTabModule }
                        : {}),
                    },
                  });
                } else if (mobileView === "content") {
                  setMobileView(null);
                } else {
                  router.push("/home");
                }
              }}
              sx={{ p: "8px", color: "text.primary" }}
            >
              <i
                className="fi fi-rr-arrow-small-left"
                style={{ fontSize: "20px", lineHeight: 1, display: "flex" }}
              />
            </IconButton>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-0.54px",
              }}
            >
              {t(
                isOrderDetails
                  ? "Order Details"
                  : mobileView === "content"
                  ? PAGE_TITLES[activePage] ?? "Profile"
                  : "Profile",
              )}
            </Typography>
          </Box>
        )}
        {/* ── Profile intro ── */}
        {userToken && !mobileView && (
          <CustomContainer noMobilePadding>
            <Box sx={{ pt: "32px", pb: "0px", px: { xs: "16px", md: "0px" } }}>
              <ProfileIntro
                data={data}
                page={activePage}
                refetch={refetch}
                configData={configData}
                addAddress={addAddress}
                setAddAddress={setAddAddress}
                editAddress={editAddress}
                setEditAddress={setEditAddress}
              />
            </Box>
          </CustomContainer>
        )}
        {/* ── Sidebar + Content layout ── */}
        <CustomContainer noMobilePadding={true}>
          <Box
            sx={{
              pt: { xs: mobileView === "content" ? "0px" : "32px", md: "32px" },
              pb: "40px",
            }}
          >
            {isMobile ? (
              /* Mobile: show sidebar OR content */
              mobileView === "content" ? (
                <Box>{content}</Box>
              ) : (
                sidebar
              )
            ) : (
              /* Desktop: 2-column */
              <Stack direction="row" gap="32px" alignItems="flex-start">
                {sidebar}
                {content}
              </Stack>
            )}
          </Box>
        </CustomContainer>
        {/* keep old ui for testing... */}
        {/* <Grid container gap="10px">
          <Grid item xs={12} sm={12} md={12}>
            <CustomContainer>
              <BodySection
                page={page}
                configData={configData}
                orderId={orderId}
                userToken={userToken}
                deleteUserHandler={deleteUserHandler}
                accountDeleteStatus={accountDeleteStatus}
                setAccountDeleteStatus={setAccountDeleteStatus}
                isLoadingDelete={isLoadingDelete}
              />
            </CustomContainer>
          </Grid>
        </Grid> */}
      </CustomStackFullWidth>
    </PushNotificationLayout>
  );
};

export default UserInformation;
