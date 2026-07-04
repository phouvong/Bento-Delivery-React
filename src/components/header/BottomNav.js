import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Box, NoSsr, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { t } from "i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { toast } from "react-hot-toast";
import { getToken } from "helper-functions/getToken";
import WishListCardView from "../wishlist";
import ProfileDrawer from "./ProfileDrawer";
import NextImage from "components/NextImage";

const AuthModal = dynamic(() => import("components/auth/AuthModal"));

const NAV_ITEMS = [
  {
    key: "offers",
    label: t("Offers"),
    icon: "fi fi-rr-badge-percent",
    path: "/home/offers",
  },
  {
    key: "orders",
    label: t("Orders"),
    icon: "fi fi-rr-receipt",
    path: "/profile?page=my-orders",
    requireAuth: true,
  },
  {
    key: "favourite",
    label: t("Favourite"),
    icon: "fi fi-rr-heart",
    openWishlist: true,
    requireAuth: true,
  },
  {
    key: "profile",
    label: t("Profile"),
    icon: "fi fi-rr-user",
    openProfile: true,
  },
];

const BottomNav = () => {
  const router = useRouter();
  const theme = useTheme();
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const [wishListOpen, setWishListOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [modalFor, setModalFor] = useState("sign-in");

  const isActive = (item) => {
    if (item.openWishlist) {
      return router.pathname === "/home/wishlist";
    }
    if (item.openProfile) {
      const page = router.query?.page;
      return (
        router.pathname === "/profile" &&
        (!page || page === "profile-settings" || page === "addresses")
      );
    }
    if (!item.path) return false;
    const [pathname, search] = item.path.split("?");
    if (search) {
      const params = new URLSearchParams(search);
      return (
        router.pathname === pathname &&
        [...params.entries()].every(([k, v]) => router.query[k] === v)
      );
    }
    return router.pathname.startsWith(pathname);
  };

  const handleClick = (item) => {
    if (item.openProfile) {
      if (getToken()) {
        router.push("/profile");
      } else {
        setProfileOpen(true);
      }
      return;
    }
    if (item.requireAuth && !getToken()) {
      toast.error(t("Please login"));
      setAuthOpen(true);
      return;
    }
    if (item.openWishlist) {
      router.push({
        pathname: "/home/wishlist",
        query: router.query.module ? { module: router.query.module } : {},
      });
      return;
    }
    if (item.path) router.push(item.path);
  };

  return (
    <NoSsr>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "65px",
          backgroundColor: theme.palette.background.paper,
          boxShadow:
            "0px -1px 2px rgba(0,0,0,0.10), 0px -1px 2px rgba(0,0,0,0.05)",
          zIndex: 1082,
          display: { xs: "flex", md: "none" },
        }}
      >
        <Stack
          direction="row"
          alignItems="stretch"
          justifyContent="center"
          gap="12px"
          sx={{ flex: 1, width: "100%", px: 0 }}
        >
          {NAV_ITEMS.filter((item) =>
            item.key === "offers"
              ? !["ride-share", "rental", "parcel"].includes(
                  getCurrentModuleType()
                )
              : true
          ).map((item) => {
            const active = isActive(item);
            const color = active ? theme.palette.primary.main : "#757575";

            return (
              <Stack
                key={item.key}
                onClick={() => handleClick(item)}
                alignItems="center"
                justifyContent="flex-end"
                gap={"4px"}
                sx={{
                  flex: 1,
                  height: "60px",
                  pt: 0,
                  pb: "8px",
                  px: "8px",
                  cursor: "pointer",
                  userSelect: "none",
                  position: "relative",
                }}
              >
                {/* Active indicator — downward triangle */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    width: 0,
                    height: 0,
                    borderLeft: "12px solid transparent",
                    borderRight: "12px solid transparent",
                    borderTop: active
                      ? `6px solid ${theme.palette.primary.main}`
                      : "6px solid transparent",
                    transition: "border-top-color 0.2s ease",
                  }}
                />
                {item.key === "profile" && profileInfo?.image_full_url ? (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "9999px",
                      overflow: "hidden",
                      outline: active
                        ? `2px solid ${theme.palette.primary.main}`
                        : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <NextImage
                      src={profileInfo.image_full_url}
                      alt={profileInfo.image_full_url}
                      width={20}
                      height={20}
                      objectFit="cover"
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className={item.icon}
                      style={{
                        fontSize: "20px",
                        lineHeight: 1,
                        display: "flex",
                        color,
                      }}
                    />
                  </Box>
                )}
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: active ? 600 : 400,
                    lineHeight: 1.2,
                    letterSpacing: active ? "-0.24px" : "-0.36px",
                    color,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {t(item.label)}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Box>

      {wishListOpen && (
        <WishListCardView
          sideDrawerOpen={wishListOpen}
          setSideDrawerOpen={setWishListOpen}
        />
      )}

      <ProfileDrawer
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onSignInClick={() => setAuthOpen(true)}
      />

      {authOpen && (
        <AuthModal
          open={authOpen}
          handleClose={() => {
            setAuthOpen(false);
            setModalFor("sign-in");
          }}
          modalFor={modalFor}
          setModalFor={setModalFor}
        />
      )}
    </NoSsr>
  );
};

export default React.memo(BottomNav);
