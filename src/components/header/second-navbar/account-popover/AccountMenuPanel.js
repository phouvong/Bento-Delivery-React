import React, { useState } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { t } from "i18next";
import toast from "react-hot-toast";
import { setLogoutUser } from "redux/slices/profileInfo";
import { setWelcomeModal } from "redux/slices/utils";
import { clearAllCartData } from "redux/slices/cart";
import { logoutSuccessFull } from "utils/toasterMessages";
import CustomDialogConfirm from "../../../custom-dialog/confirm/CustomDialogConfirm";
import ThemeSwitches from "../../top-navbar/ThemeSwitches";
import AccountLanguageButton from "./AccountLanguageButton";

/**
 * Reusable account menu panel — shows the full menu list (Dark Mode, Language,
 * Orders & Trips, Wallet, Coupons, Offers, Loyalty, Referral, Inbox, Settings)
 * plus a bottom Login/Signup (guest) or Logout (logged in) button.
 *
 * Props:
 *  - bg: "white" (default) | "gray"  — background variant
 *  - token: string | undefined        — auth token; controls login vs logout button
 *  - onSignInClick: fn               — called when guest taps Login/Signup or an
 *                                       auth-required menu item
 *  - onClose: fn                     — called after a menu action; close popover etc.
 *  - cartListRefetch: fn             — needed for logout flow
 */
const AccountMenuPanel = ({
  bg = "white",
  token,
  onSignInClick,
  onClose,
  cartListRefetch,
  hideLoginButton = false,
  hideTopSection = false, // hides Dark Mode + Language rows
  activePage = null, // highlights the matching menu item (page key)
  onItemClick = null, // override router.push (e.g. for sidebar switching)
}) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { configData, modules, countryCode, language } = useSelector(
    (state) => state.configData
  );

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const isGray = bg === "gray";
  const containerBg = isGray
    ? theme.palette.background.secondary
    : theme.palette.background.paper;

  const handleLogout = async () => {
    setIsLogoutLoading(true);
    dispatch(setWelcomeModal(false));
    setTimeout(() => {
      cartListRefetch?.();
      dispatch(setLogoutUser(null));
      dispatch(clearAllCartData());
      localStorage.removeItem("token");
      // Clear any "don't show this incomplete order again" flags so the
      // next user sees a fresh state.
      Object.keys(localStorage)
        .filter((k) => k.startsWith("incomplete_order_hidden_"))
        .forEach((k) => localStorage.removeItem(k));
      onClose?.();
      toast.success(t(logoutSuccessFull));
      const REDIRECT_TO_HOME_PATHS = [
        "/profile",
        "/interest",
        "/rental/cart",
        "/rental/checkout",
      ];
      if (REDIRECT_TO_HOME_PATHS.includes(router.pathname)) {
        router.push("/home");
      }
      setLogoutDialogOpen(false);
      setIsLogoutLoading(false);
    }, 500);
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
    setIsLogoutLoading(false);
  };

  // ── Menu items config ──
  // requireAuth: if true, clicking without token opens login modal
  const moduleParam = router.query.module;
  const profilePath = (page) => ({
    pathname: "/profile",
    query: { page, ...(moduleParam ? { module: moduleParam } : {}) },
  });

  const menuItems = [
    {
      key: "addresses",
      label: "Addresses",
      icon: "fi fi-rr-map-marker-home",
      path: profilePath("addresses"),
      requireAuth: true,
    },
    {
      key: "orders-trips",
      label: "Orders & Trips",
      icon: "fi fi-rr-list-check",
      path: profilePath("my-orders"),
      requireAuth: true,
    },
    {
      key: "track-orders",
      label: "Track Orders",
      icon: "fi fi-rr-biking-mountain",
      // Logged-in users see the track-order UI inside the profile layout;
      // guests get the standalone /track-order page.
      path: token ? profilePath("track-order") : "/track-order",
      requireAuth: false,
    },
    {
      key: "wallet",
      label: "My Wallet",
      icon: "fi fi-rr-wallet",
      path: profilePath("wallet"),
      requireAuth: true,
      hidden: configData?.customer_wallet_status === 0,
    },
    {
      key: "monthly-cart-list",
      label: "Monthly Cart List",
      icon: "fi fi-rr-shopping-cart",
      path: profilePath("monthly-cart-list"),
      requireAuth: true,
      hidden: !configData?.monthly_order_reminder,
    },
    {
      key: "coupons",
      label: "Available Coupons",
      icon: "fi fi-rr-ticket",
      path: profilePath("coupons"),
      requireAuth: true,
    },

    {
      key: "loyalty",
      label: "Loyalty Points",
      icon: "fi fi-rr-badge",
      path: profilePath("loyalty-points"),
      requireAuth: true,
      hidden: configData?.loyalty_point_status === 0,
    },
    {
      key: "referral",
      label: "Referral Code",
      icon: "fi fi-rr-share",
      path: profilePath("referral-code"),
      requireAuth: true,
      hidden: configData?.ref_earning_status === 0,
    },
    {
      key: "subscription-plan",
      label: "Subscription Plan",
      icon: "fi fi-rr-crown",
      path: profilePath("subscription-plan"),
      requireAuth: true,
      hidden: configData?.pro_member_status === 0,
    },
    {
      key: "inbox",
      label: "Inbox",
      icon: "fi fi-rr-messages",
      path: profilePath("inbox"),
      requireAuth: true,
    },
    {
      key: "settings",
      label: "Settings",
      icon: "fi fi-rr-settings",
      path: profilePath("settings"),
      requireAuth: true,
    },
  ];

  const handleItemClick = (item) => {
    if (item.requireAuth && !token) {
      onClose?.();
      onSignInClick?.();
      return;
    }
    onClose?.();
    if (onItemClick) {
      onItemClick(item);
    } else {
      router.push(item.path);
    }
  };

  // ── Common item row style ──
  const rowSx = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    px: "8px",
    py: "8px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: isGray
        ? theme.palette.background.paper
        : theme.palette.action.hover,
    },
  };

  const labelSx = {
    fontSize: "16px",
    fontWeight: 400,
    color: "neutral.1050",
    lineHeight: 1.1,
    letterSpacing: "-0.48px",
    textTransform: "capitalize",
  };

  const iconStyle = {
    fontSize: "16px",
    lineHeight: 1,
    display: "flex",
    // Figma: icon uses --sds-color-icon-default-secondary (lower emphasis than
    // the title). neutral[500] gives that gray in light + a dimmer gray in dark.
    color: theme.palette.neutral[500],
    flexShrink: 0,
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: containerBg,
          borderRadius: isGray ? "16px" : "12px",
          p: isGray ? "8px" : "12px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
        }}
      >
        {/* Top group: Dark Mode + Language */}
        {!hideTopSection && (
          <>
            <Stack gap="4px">
              <Box
                sx={{
                  ...rowSx,
                  cursor: "default",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <i
                  className={
                    theme.palette.mode === "dark"
                      ? "fi fi-rr-moon-stars"
                      : "fi fi-rr-brightness"
                  }
                  style={iconStyle}
                />
                <Typography sx={{ ...labelSx, flex: 1 }}>
                  {theme.palette.mode === "dark"
                    ? t("Dark Mode")
                    : t("Light Mode")}
                </Typography>
                <ThemeSwitches noText />
              </Box>
              <Box
                sx={{
                  ...rowSx,
                  cursor: "default",
                  "&:hover": { backgroundColor: "transparent" },
                  display: { xs: "flex", md: "none" },
                }}
              >
                <i className="fi fi-rr-language" style={iconStyle} />
                <Typography sx={{ ...labelSx, flex: 1 }}>
                  {t("Language")}
                </Typography>
                <AccountLanguageButton />
              </Box>
            </Stack>
            <Box
              sx={{
                height: "1px",
                backgroundColor: theme.palette.divider,
                width: "100%",
              }}
            />
          </>
        )}

        {/* Menu list */}
        <Stack gap="4px">
          {menuItems.map((item) => {
            if (item.hidden) return null;
            const isActive = activePage === item.key;
            return (
              <Box
                key={item.key}
                onClick={() => handleItemClick(item)}
                sx={{
                  ...rowSx,
                  borderRadius: isActive ? "8px" : "4px",
                  backgroundColor: isActive
                    ? theme.palette.background.secondary
                    : "transparent",
                  "&:hover": {
                    backgroundColor: isActive
                      ? theme.palette.background.secondary
                      : isGray
                      ? theme.palette.background.paper
                      : theme.palette.action.hover,
                  },
                }}
              >
                <i className={item.icon} style={iconStyle} />
                <Typography
                  sx={{
                    ...labelSx,
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  {t(item.label)}
                </Typography>
              </Box>
            );
          })}
        </Stack>

        {/* Bottom button: Login/Signup (guest) or Logout (auth).
            When `hideLoginButton` is true and user is logged out, hide entirely
            (used by ProfileDrawer which has its own top login promo). */}
        {!token && hideLoginButton ? null : token ? (
          <Box
            onClick={() => setLogoutDialogOpen(true)}
            sx={{
              width: "100%",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: isGray
                ? theme.palette.background.paper
                : theme.palette.background.secondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-0.48px",
                textTransform: "capitalize",
              }}
            >
              {t("Log Out")}
            </Typography>
          </Box>
        ) : (
          <Box
            onClick={() => {
              onClose?.();
              onSignInClick?.();
            }}
            sx={{
              width: "100%",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: theme.palette.primary.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              "&:hover": { backgroundColor: theme.palette.primary.dark },
            }}
          >
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.1,
                letterSpacing: "-0.48px",
                textTransform: "capitalize",
              }}
            >
              {t("Login/Signup")}
            </Typography>
          </Box>
        )}
      </Box>

      <CustomDialogConfirm
        isLoading={isLogoutLoading}
        dialogTexts={t("Are you sure you want to logout?")}
        open={logoutDialogOpen}
        onClose={handleLogoutDialogClose}
        onSuccess={handleLogout}
      />
    </>
  );
};

export default AccountMenuPanel;
