import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { t } from "i18next";
import cookie from "js-cookie";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TaxiView from "components/home/module-wise-components/rental/components/home/TaxiView";
import CustomContainer from "../../container";
import LogoSide from "../../logo/LogoSide";
import WishListCardView from "../../wishlist";
import ManageSearch from "../second-navbar/ManageSearch";
import ModuleWiseNav from "../second-navbar/ModuleWiseNav";
import MobileNavBar from "./MobileNavBar";
import NavBarIcon from "../second-navbar/NavBarIcon";
import AccountPopover from "../second-navbar/account-popover";
import AddressReselect from "../top-navbar/address-reselect/AddressReselect";

import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { getModule } from "helper-functions/getLanguage";
import AccountLanguageButton from "../second-navbar/account-popover/AccountLanguageButton";
import { setCartList, clearCartGroups } from "redux/slices/cart";
import { clearOfflinePaymentInfo } from "redux/slices/offlinePaymentData";
import {
  setOpenForgotPasswordModal,
  setOpenSignInModal,
  setSelectedModule,
} from "redux/slices/utils";
import { handleProductValueWithOutDiscount } from "utils/CustomFunctions";

import useGetBookingList from "api-manage/hooks/react-query/useGetBookingList";
import ForgotPassword from "components/auth/ForgotPassword/ForgotPassword";
import CustomModal from "components/modal";
import useGetGroupedCart from "../../../api-manage/hooks/react-query/add-cart/useGetGroupedCart";
import useGetGuest from "../../../api-manage/hooks/react-query/guest/useGetGuest";
import AllCartDrawer from "./AllCartDrawer";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getModuleIdentifier, saveModuleParam } from "utils/moduleParamManager";

const AuthModal = dynamic(() => import("components/auth/AuthModal"));

// ─── Styled ─────────────────────────────────────────────────────────────────

const ModuleTab = styled(Box)(({ theme, active }) => ({
  padding: "10px 24px",
  cursor: "pointer",
  whiteSpace: "nowrap",
  userSelect: "none",
  transition: "color 0.2s, background-color 0.2s",
  color: active ? theme.palette.neutral[1000] : theme.palette.neutral[500],
  fontWeight: active ? 700 : 600,
  ...(!active && {
    "&:hover": {
      color: theme.palette.neutral[1000],
    },
  }),
  fontSize: "18px",
  borderRadius: "8px 8px 0 0",
  backgroundColor: active ? theme.palette.background.default : "transparent",
  position: "relative",
  ...(active && {
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "8px 8px 0 0",
      padding: "1px 1px 0 1px",
      background:
        theme.palette.mode === "dark"
          ? "linear-gradient(180deg, #444444 0%, #000000 100%)"
          : "linear-gradient(180deg, #A3A3A3 0%, #FFFFFF 100%)",
      WebkitMask:
        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      maskComposite: "exclude",
      pointerEvents: "none",
    },
  }),
}));

const ModuleBarWrapper = styled(Box)(({ theme, hidden }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  overflow: "hidden",
  maxHeight: hidden ? "0px" : "56px",
  height: "100%",
  transition: "max-height 0.35s ease",
}));

// ─── Sub-components (reuse logic from SecondNavbar) ──────────────────────────

const parseJsonFromStorage = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getOtherModuleVariation = (itemVariations, selectedVariation) => {
  const selectedItem = [];
  itemVariations?.forEach((item) => {
    selectedVariation?.forEach((sVari) => {
      if (sVari?.type === item?.type) selectedItem.push(item);
    });
  });
  return selectedItem;
};

const getSelectedVariations = (variations) => {
  const selectedItem = [];
  if (variations?.length > 0) {
    variations.forEach((item, index) => {
      item?.values?.forEach((value, optionIndex) => {
        if (value?.isSelected) {
          selectedItem.push({
            choiceIndex: index,
            isSelected: value?.isSelected,
            label: value?.label,
            optionIndex,
            optionPrice: value?.optionPrice,
          });
        }
      });
    });
  }
  return selectedItem;
};

const CartIcon = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const { cartList } = useSelector((state) => state.cart);
  return (
    <>
      <NavBarIcon
        icon={
          <i
            className="fi fi-rr-shopping-cart"
            style={{ fontSize: "20px", display: "flex", lineHeight: 1 }}
          />
        }
        label={t("Cart")}
        user="false"
        handleClick={() => setOpen(true)}
        badgeCount={getCartListModuleWise(cartList)?.length || null}
      />
      {/* {open && (
        <CardView
          isLoading={isLoading}
          sideDrawerOpen={open}
          setSideDrawerOpen={setOpen}
          cartList={cartList}
          refetch={refetch}
        />
      )} */}
      <AllCartDrawer
        open={open}
        onClose={() => setOpen(false)}
        cartData={cartList}
        refetch={refetch}
      />
    </>
  );
};

const TaxiIcon = ({ isLoading, configData }) => {
  const [open, setOpen] = useState(false);
  const { refetch } = useGetGroupedCart();
  const { cartList } = useSelector((state) => state.cart);
  return (
    <>
      <NavBarIcon
        icon={<DirectionsCarOutlinedIcon sx={{ fontSize: "22px" }} />}
        user="false"
        handleClick={() => setOpen(true)}
        badgeCount={getCartListModuleWise(cartList?.carts)?.length || null}
      />
      {open && (
        <TaxiView
          isLoading={isLoading}
          sideDrawerOpen={open}
          setSideDrawerOpen={setOpen}
          cartList={cartList}
          refetch={refetch}
          configData={configData}
        />
      )}
    </>
  );
};

const WishListIcon = ({ totalWishList }) => {
  const router = useRouter();
  return (
    <>
      <NavBarIcon
        id="wish-list-icon"
        icon={
          <i
            className="fi fi-rr-heart"
            style={{ fontSize: "20px", display: "flex", lineHeight: 1 }}
          />
        }
        label={t("WishList")}
        user="false"
        handleClick={() =>
          router.push({
            pathname: "/home/wishlist",
            query: router.query.module ? { module: router.query.module } : {},
          })
        }
        badgeCount={totalWishList > 0 ? totalWishList : null}
      />
    </>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const NewNavBar = ({ configData }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const isSmall = useMediaQuery("(max-width:1180px)");
  const _scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 60,
  });
  const isLandingPage = router.pathname === "/";
  const _moduleType = getCurrentModuleType();
  const isSearchlessModule =
    _moduleType === "ride-share" ||
    _moduleType === "rental" ||
    _moduleType === "parcel" ||
    _moduleType === "ride";
  const scrollTrigger = isLandingPage ? false : _scrollTrigger;
  // On the home & search pages the navbar search must stay hidden while the
  // ModuleSearchBanner is still visible; elsewhere it follows scroll only.
  const isSearchAwarePage =
    router.pathname === "/home" || router.pathname === "/search";

  // ── Redux ──
  const { cartList } = useSelector((state) => state.cart);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { offlineInfoStep } = useSelector((state) => state.offlinePayment);
  const { modules } = useSelector((state) => state.configData);
  const { openForgotPasswordModal, openSignInModal, searchBannerInView } =
    useSelector((state) => state.utilsData);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const { wishLists } = useSelector((state) => state.wishList);

  // Navbar search shows on scroll, but on home/search pages it waits until the
  // ModuleSearchBanner has scrolled out of view. Also hidden for modules that
  // don't have item-level search (rental, ride-share, parcel, ride).
  const showNavSearch =
    scrollTrigger &&
    !isSearchlessModule &&
    (!isSearchAwarePage || !searchBannerInView);

  // ── Local state ──
  const [moduleType, setModuleType] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [modalFor, setModalFor] = useState("sign-in");
  const [toggled, setToggled] = useState(false);
  const anchorRef = useRef(null);

  // ── localStorage (client-side only) ──
  const [location, setLocation] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("location");
  });

  let token, zoneId, guestId;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
    zoneId = parseJsonFromStorage(localStorage.getItem("zoneid"));
    guestId = localStorage.getItem("guest_id");
  }

  // sync selected module from URL query param whenever it changes
  useEffect(() => {
    if (!router.isReady || !modules?.length) return;
    const urlModuleParam = router.query.module;
    if (!urlModuleParam) return;
    const matched = modules.find(
      (m) =>
        String(m?.slug) === String(urlModuleParam) ||
        String(m?.id) === String(urlModuleParam)
    );
    if (!matched) return;
    const current = selectedModule?.slug || selectedModule?.id;
    if (String(current) === String(urlModuleParam)) return; // already in sync
    localStorage.setItem("module", JSON.stringify(matched));
    saveModuleParam(matched?.id, matched?.slug);
    dispatch(setSelectedModule(matched));
  }, [router.isReady, router.query.module, modules]); // eslint-disable-line react-hooks/exhaustive-deps

  // sync location from storage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setLocation(localStorage.getItem("location"));
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    const id = setInterval(sync, 1000);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
      clearInterval(id);
    };
  }, []);

  // ── Data hooks ──
  const { data: guestData, refetch: guestRefetch } = useGetGuest();

  useEffect(() => {
    if (!guestId) guestRefetch().catch(() => {});
  }, [guestId]);

  useEffect(() => {
    if (guestData?.guest_id)
      localStorage.setItem("guest_id", guestData.guest_id);
  }, [guestData]);

  // Use grouped cart (cart/get-all) as the single global source of truth
  // for the navbar. It also dispatches setCartList(flattened) on success
  // so badges/counters keep working. cart/list is only used on store-details.
  const { data: cartData, refetch: cartListRefetch } = useGetGroupedCart();
  const {
    data: bookingLists,
    isLoading: bookingLoading,
    refetch: bookingRefetch,
  } = useGetBookingList(guestId);

  useEffect(() => {
    if (moduleType) {
      dispatch(clearCartGroups());
      moduleType === "rental" ? bookingRefetch() : cartListRefetch();
    }
  }, [moduleType]);

  // Non-rental cartList is populated centrally by useGetGroupedCart's
  // onSuccess (flattens cart/get-all → cartList). Only rental needs a
  // manual dispatch here from its booking list.
  useEffect(() => {
    if (moduleType === "rental") {
      dispatch(setCartList(bookingLists));
      if (bookingLists?.carts?.length > 0)
        cookie.set("cart-list", bookingLists?.carts?.length);
    }
  }, [moduleType, bookingLists, location]);

  useEffect(() => {
    if (offlineInfoStep !== 0 && router.pathname !== "/checkout") {
      dispatch(clearOfflinePaymentInfo());
    }
  }, []);

  useEffect(() => {
    setModuleType(selectedModule?.module_type);
  }, [selectedModule]);

  const totalWishList =
    moduleType === "rental"
      ? (wishLists?.vehicles?.length || 0) + (wishLists?.providers?.length || 0)
      : (wishLists?.item?.length || 0) + (wishLists?.store?.length || 0);

  const handleWishlistClick = (page) =>
    router.push({ pathname: "/profile", query: { page } });

  const handleClose = () => {
    setModalFor("sign-in");
    setOpenSignIn(false);
    setAuthInitialView("landing");
    if (openSignInModal) dispatch(setOpenSignInModal(false));
  };

  // Tracks which view AuthModal should boot into. Defaults to "landing";
  // ForgotPassword's "Back to Login" flips this to "password" so the user
  // sees SignInForm directly.
  const [authInitialView, setAuthInitialView] = useState("landing");

  // Reopen the sign-in modal whenever something dispatches
  // `setOpenSignInModal(true)` — e.g. ForgotPassword's "Back to Login".
  useEffect(() => {
    if (openSignInModal) {
      setModalFor("sign-in");
      setAuthInitialView("password");
      setOpenSignIn(true);
    }
  }, [openSignInModal]);

  // ── Icons row (right side) ──
  const renderIcons = () => (
    <Stack direction="row" alignItems="center" spacing={1}>
      {token && moduleType !== "parcel" && (
        <NavBarIcon
          icon={
            <i
              className="fi fi-rr-messages"
              style={{ fontSize: "20px", display: "flex", lineHeight: 1 }}
            />
          }
          label={t("Chat")}
          user="false"
          handleClick={() => handleWishlistClick("inbox")}
        />
      )}
      {token && zoneId && moduleType !== "parcel" && (
        <WishListIcon totalWishList={totalWishList} />
      )}
      {moduleType !== "parcel" &&
        moduleType !== "rental" &&
        (location || cartList?.length !== 0) &&
        zoneId && <CartIcon refetch={cartListRefetch} cartData={cartData} />}
      {moduleType === "rental" && (
        <TaxiIcon isLoading={bookingLoading} configData={configData} />
      )}

      {token ? (
        <Stack direction="row" alignItems="center" spacing="12px">
        <AccountLanguageButton />
        <Box
          ref={anchorRef}
          onClick={() => setOpenPopover(true)}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            pl: "4px",
            pr: "12px",
            height: "36px",
            borderRadius: "8px",
            backgroundColor: "primary.main",
            cursor: "pointer",
            flexShrink: 0,
            overflow: "hidden",
            "&:hover": { opacity: 0.9 },
          }}
        >
          {/* Avatar or fallback icon */}
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              mr: "5px",
              ...(profileInfo?.image_full_url && { p: "3px" }),
            }}
          >
            {profileInfo?.image_full_url ? (
              <Avatar
                alt={profileInfo?.f_name}
                src={profileInfo?.image_full_url}
                sx={{ width: "100%", height: "100%", borderRadius: "50%" }}
              />
            ) : (
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className="fi fi-rr-circle-user"
                  style={{ fontSize: "16px", display: "flex", lineHeight: 1, color: "#fff" }}
                />
              </Box>
            )}
          </Box>
          {/* First name */}
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: "-0.4px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100px",
            }}
          >
            {profileInfo?.f_name ?? profileInfo?.name?.split(" ")[0] ?? t("User")}
          </Typography>
        </Box>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" spacing="12px">
        <AccountLanguageButton />
        <Box
          ref={anchorRef}
          onClick={() => setOpenPopover(true)}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            pl: "4px",
            pr: "12px",
            height: "36px",
            borderRadius: "8px",
            backgroundColor: "primary.main",
            cursor: "pointer",
            flexShrink: 0,
            overflow: "hidden",
            "&:hover": { opacity: 0.9 },
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              p: "8px",
            }}
          >
            <i
              className="fi fi-rr-circle-user"
              style={{
                fontSize: "16px",
                display: "flex",
                lineHeight: 1,
                color: "#fff",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: "-0.48px",
              textTransform: "capitalize",
              whiteSpace: "nowrap",
            }}
          >
            {t("Login")}
          </Typography>
        </Box>
        </Stack>
      )}
    </Stack>
  );

  // ── Desktop top bar ──
  const renderDesktopTopBar = () => (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      height="64px"
    >
      {/* Logo */}
      <Box sx={{ flexShrink: 0 }}>
        <LogoSide
          width="110px"
          height="50px"
          configData={configData}
          objectFit="contain"
        />
      </Box>

      {/* Location: right after logo, 24px gap */}
      <Box sx={{ flexShrink: 0, ml: "24px" }}>
        <AddressReselect location={location} />
      </Box>

      {/* Search: grows to fill space, 24px from icons */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          justifyContent: "flex-end",
          mr: "24px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: showNavSearch ? "500px" : "0px",
            opacity: showNavSearch ? 1 : 0,
            visibility: showNavSearch ? "visible" : "hidden",
            transition:
              "max-width 0.35s ease, opacity 0.3s ease, visibility 0.3s",
            minWidth: 0,
            "& form > div:first-child": {
              borderRadius: "9999px !important",
              height: "44px",
              backgroundColor: (theme) =>
                `${theme.palette.background.secondary} !important`,
              border: "none !important",
            },
            "& .MuiPaper-root": {
              backgroundColor: "background.paper",
            },
          }}
        >
          <ManageSearch
            zoneid={zoneId}
            fullWidth
            searchFromNav={true}
            searchQuery={
              router.pathname === "/search" &&
              !searchBannerInView &&
              router.query.data_type === "searched"
                ? router.query.search
                : undefined
            }
          />
        </Box>
      </Box>

      {/* Right: icons */}
      {renderIcons()}
    </Stack>
  );

  const handleModuleChange = (mod) => {
    const isOnHome = router.pathname === "/home";
    if (isOnHome && mod.id === selectedModule?.id) return;
    localStorage.setItem("module", JSON.stringify(mod));
    dispatch(setSelectedModule(mod));
    const moduleIdentifier = getModuleIdentifier(mod);
    saveModuleParam(mod?.id, mod?.slug);
    router.push({ pathname: "/home", query: { module: moduleIdentifier } });
  };

  // ── Module bar ──
  const renderModuleBar = () => {
    if (!modules?.length) return null;
    if (router.pathname === "/profile") return null;
    if (router.pathname === "/") return null;
    if (router.pathname === "/checkout") return null;
    return (
      <ModuleBarWrapper hidden={scrollTrigger}>
        <CustomContainer>
          <Stack
            direction="row"
            alignItems="flex-end"
            justifyContent="flex-start"
            sx={{
              overflowX: "auto",
              "&::-webkit-scrollbar": { display: "none" },
              height: "56px",
            }}
          >
            {modules.map((mod) => {
              const isActive = mod.id === selectedModule?.id;
              return (
                <ModuleTab
                  key={mod.id}
                  active={isActive ? 1 : 0}
                  onClick={() => handleModuleChange(mod)}
                >
                  {mod.module_name}
                </ModuleTab>
              );
            })}
          </Stack>
        </CustomContainer>
      </ModuleBarWrapper>
    );
  };

  return (
    <>
      {isSmall ? (
        <MobileNavBar
          configData={configData}
          location={location}
          setOpenSignIn={setOpenSignIn}
        />
      ) : (
        <>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.background.paper,
              // backgroundColor: scrollTrigger
              //   ? (theme) => theme.palette.background.paper
              //   : (theme) => theme.palette.background.secondary,
              transition: "background-color 0.35s ease",
            }}
          >
            <CustomContainer>
              <Toolbar disableGutters sx={{ width: "100%" }}>
                {renderDesktopTopBar()}
              </Toolbar>
            </CustomContainer>
          </Box>
          {renderModuleBar()}
        </>
      )}

      <AccountPopover
        anchorEl={anchorRef.current}
        onClose={() => setOpenPopover(false)}
        open={openPopover}
        cartListRefetch={cartListRefetch}
        token={token}
        onSignInClick={() => setOpenSignIn(true)}
      />

      <AuthModal
        modalFor={modalFor}
        setModalFor={setModalFor}
        open={openSignIn}
        handleClose={handleClose}
        initialView={authInitialView}
      />

      {openForgotPasswordModal && (
        <CustomModal
          handleClose={() => dispatch(setOpenForgotPasswordModal(false))}
          openModal={openForgotPasswordModal}
        >
          <ForgotPassword configData={configData} />
        </CustomModal>
      )}
    </>
  );
};

export default NewNavBar;
