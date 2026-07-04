import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import toast from "react-hot-toast";

import AddressReselectPopover from "../top-navbar/address-reselect/AddressReselectPopover";
import AllCartDrawer from "./AllCartDrawer";
import { getModule } from "helper-functions/getLanguage";
import MobileSearchOverlay from "./MobileSearchOverlay";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { getFoodSections } from "components/home/module-wise-components/food/foodSectionsConfig";
import { getGrocerySections } from "components/home/module-wise-components/grocery/grocerySectionsConfig";
import { getPharmacySections } from "components/home/module-wise-components/pharmacy/pharmacySectionsConfig";
import { getEcommerceSections } from "components/home/module-wise-components/ecommerce/ecommerceSectionsConfig";

import useGetGroupedCart from "../../../api-manage/hooks/react-query/add-cart/useGetGroupedCart";
import useGetBookingList from "api-manage/hooks/react-query/useGetBookingList";
import TaxiView from "components/home/module-wise-components/rental/components/home/TaxiView";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import { setCartList, clearCartGroups } from "redux/slices/cart";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { getModuleIdentifier, saveModuleParam } from "utils/moduleParamManager";
import { setSelectedModule } from "redux/slices/utils";
import useScrollDirection from "hooks/useScrollDirection";
import { useGetCategories } from "api-manage/hooks/react-query/all-category/all-categorys";

/**
 * Mobile navbar — three sections (default state):
 *   1) Top row: address (location) + cart icon
 *   2) Module tabs row: horizontally scrollable list of modules
 *   3) Search bar: full-width
 *
 * Behavior on scroll:
 *   - Scrolling down past threshold → sections 1 & 2 collapse, search bar
 *     stays sticky at top.
 *   - Scrolling up → all three sections become visible again.
 */
const MobileNavBar = ({ configData, location, setOpenSignIn }) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const isSearchPage = router.pathname === "/search";
  const isHomePage = router.pathname === "/home";
  const showModuleTabs = isHomePage || router.pathname === "/track-order";

  const SECTION_TITLES = {
    offers: "Offers",
    "free-delivery": "Free Delivery",
    "verified-seller": "Verified Seller",
    "top-rated": "Top Rated",
    nearby: "Nearby",
  };
  const slug = router.query?.slug;
  const sectionSlug = Array.isArray(slug) ? slug[0] : slug;
  const isCategoryPage = router.pathname === "/home/category/[slug]";
  const categoryTitle =
    typeof router.query?.name === "string" && router.query.name
      ? router.query.name
      : "Category";
  const isSectionPage =
    (router.pathname === "/home/[...slug]" && !!SECTION_TITLES[sectionSlug]) ||
    isCategoryPage;
  const sectionTitle = isCategoryPage
    ? categoryTitle
    : SECTION_TITLES[sectionSlug];

  const { modules, selectedModule } = useSelector((state) => ({
    modules: state.configData.modules,
    selectedModule: state.utilsData.selectedModule,
  }));
  const { cartList } = useSelector((state) => state.cart);

  const [cartOpen, setCartOpen] = useState(false);
  const [taxiOpen, setTaxiOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [addressPopoverOpen, setAddressPopoverOpen] = useState(false);
  const [address, setAddress] = useState(null);
  const addressAnchorRef = useRef(null);
  // Single global cart fetch: cart/get-all. Mutations invalidate the
  // "cart-groups" query, triggering auto-refetch.
  const { refetch: cartListRefetch } = useGetGroupedCart();

  let token, currentLatLngForMar, guestId;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
    guestId = localStorage.getItem("guest_id");
    try {
      currentLatLngForMar = JSON.parse(localStorage.getItem("currentLatLng"));
    } catch (e) {
      currentLatLngForMar = null;
    }
  }

  // Rental uses a separate booking-list endpoint instead of the grouped cart.
  // Mirror NewNavBar so the cart badge/count works on mobile too.
  const { data: bookingLists, refetch: bookingRefetch } =
    useGetBookingList(guestId);
  const moduleType = selectedModule?.module_type ?? getCurrentModuleType();
  useEffect(() => {
    if (moduleType) {
      dispatch(clearCartGroups());
      if (moduleType === ModuleTypes.RENTAL) {
        bookingRefetch();
      } else {
        cartListRefetch();
      }
    }
  }, [moduleType]);
  useEffect(() => {
    if (moduleType === ModuleTypes.RENTAL) {
      dispatch(setCartList(bookingLists));
    }
  }, [moduleType, bookingLists]);

  // Persist new address selection (same pattern as AddressReselect)
  useEffect(() => {
    if (!address) return;
    if (typeof window === "undefined") return;
    localStorage.setItem("location", address?.address);
    localStorage.setItem(
      "currentLatLng",
      JSON.stringify({ lat: address?.lat, lng: address?.lng })
    );
    if (address.zone_ids && address.zone_ids.length > 0) {
      localStorage.setItem("zoneid", JSON.stringify(address.zone_ids));
      const isRental = getModule()?.module_type === "rental";
      toast.success(
        t(`New ${isRental ? "Pickup" : "Delivery"} address selected.`)
      );
      setAddressPopoverOpen(false);
    }
  }, [address]);

  const MODULE_NOUN = {
    [ModuleTypes.FOOD]: t("Food"),
    [ModuleTypes.GROCERY]: t("Grocery"),
    [ModuleTypes.PHARMACY]: t("Medicine"),
    [ModuleTypes.ECOMMERCE]: t("Products"),
    [ModuleTypes.PARCEL]: t("Parcel"),
  };
  const moduleNoun = MODULE_NOUN[getCurrentModuleType()] ?? t("Items");

  // Animated placeholder — cycles through [moduleNoun, ...category names].
  const { data: categoriesResponse } = useGetCategories();
  const animatedItems = useMemo(() => {
    const base = [moduleNoun];
    const cats = categoriesResponse?.data ?? [];
    cats.slice(0, 15).forEach((c) => {
      if (c?.name) base.push(c.name);
    });
    return base;
  }, [categoriesResponse, moduleNoun]);

  const [phIndex, setPhIndex] = useState(0);
  const [phVisible, setPhVisible] = useState(true);
  const animatedItemsRef = useRef(animatedItems);
  animatedItemsRef.current = animatedItems;

  useEffect(() => {
    const id = setInterval(() => {
      const items = animatedItemsRef.current;
      if (!items || items.length <= 1) return;
      setPhVisible(false);
      setTimeout(() => {
        setPhIndex((prev) => (prev + 1) % items.length);
        setPhVisible(true);
      }, 280);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const rawNoun = animatedItems[phIndex] ?? moduleNoun;
  // Keep long category names from breaking the placeholder UI
  const currentNoun =
    rawNoun.length > 22 ? `${rawNoun.slice(0, 22).trimEnd()}…` : rawNoun;

  const searchPlaceholder = (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        maxWidth: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {t("Search for")}&nbsp;
      <span
        style={{
          fontWeight: 600,
          color: theme.palette.neutral[1050],
          display: "inline-block",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          opacity: phVisible ? 1 : 0,
          transform: phVisible ? "translateY(0)" : "translateY(-5px)",
          transition: "opacity 0.28s ease, transform 0.28s ease",
        }}
      >
        &ldquo;{currentNoun}&rdquo;
      </span>
    </span>
  );

  const moduleTabsRef = useRef(null);

  const { direction, scrollY } = useScrollDirection({ threshold: 8 });
  // After 40px down-scroll, collapse top + module rows; on any up-scroll, restore.
  const isCollapsed = scrollY > 40 && direction === "down";

  const cartCount = useMemo(() => {
    if (getCurrentModuleType() === ModuleTypes.RENTAL) {
      return cartList?.carts?.length || 0;
    }
    return getCartListModuleWise(cartList)?.length || 0;
  }, [cartList]);

  // ── Module-wise section chips ──
  const sectionChips = useMemo(() => {
    const sectionsFn = {
      [ModuleTypes.FOOD]: getFoodSections,
      [ModuleTypes.GROCERY]: getGrocerySections,
      [ModuleTypes.PHARMACY]: getPharmacySections,
      [ModuleTypes.ECOMMERCE]: getEcommerceSections,
    }[getCurrentModuleType()];
    if (!sectionsFn) return [];
    try {
      return sectionsFn() ?? [];
    } catch (e) {
      return [];
    }
    // selectedModule?.module_type triggers recompute when module changes —
    // getCurrentModuleType() reads localStorage and isn't tracked by React
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModule?.module_type]);

  // Map a section label/id to its Figma chip background tint
  const isDark = theme.palette.mode === "dark";
  const chipBgFor = (s) => {
    const key =
      (s.id || "").toLowerCase() + " " + (s.label || "").toLowerCase();
    if (/offer|discount|deal/.test(key))
      return isDark ? "rgba(239,68,68,0.15)" : "#fee9e7";
    if (/rate|top|popular|best/.test(key))
      return isDark ? "rgba(234,179,8,0.15)" : "#fffbeb";
    return isDark ? "rgba(59,130,246,0.15)" : "#f1f6fd";
  };

  const goToSection = (s) => {
    const moduleParam = router.query.module;
    router.push({
      pathname: `/home/${s.id}`,
      query: moduleParam ? { module: moduleParam } : undefined,
    });
  };

  // ── Module switching — always redirect to /home?module=... from any page ──
  const handleSelectModule = (item) => {
    const isHome = router.pathname === "/home";
    const isSameModule = item?.id === selectedModule?.id;
    // Already on /home with the same module → no-op
    if (isHome && isSameModule) return;

    dispatch(setSelectedModule(item));
    if (typeof window !== "undefined") {
      localStorage.setItem("module", JSON.stringify(item));
    }
    const moduleIdentifier = getModuleIdentifier(item);
    saveModuleParam?.(item?.id, item?.slug);
    router.push(
      { pathname: "/home", query: { module: moduleIdentifier } },
      undefined,
      { shallow: isHome }
    );
  };

  // Keep the active module tab visible
  useEffect(() => {
    const el = moduleTabsRef.current?.querySelector("[data-active='true']");
    if (el && el.scrollIntoView) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedModule?.id]);

  // ── Render ──
  if (isSearchPage) return null;
  if (router.pathname === "/profile") return null;
  if (router.pathname === "/store/[id]") return null;
  if (router.pathname === "/product/[id]") return null;
  if (router.pathname === "/checkout") return null;
  const SIMPLE_HEADER_ROUTES = [
    "/all-stores",
    "/refund-policy",
    "/cancellation-policy",
    "/shipping-policy",
    "/privacy-policy",
    "/track-order",
    "/store-registration",
    "/deliveryman-registration",
    "/help-and-support",
    "/about-us",
    "/parcel-delivery-info",
    "/rental/vehicle-search",
    "/rental/checkout",
    "/rental/cart",
    "/rental/vehicle/[id]",
    "/rental/provider/latest",
    "/rental/provider/popular",
    "/rental/provider/[id]",
    "/rental/trip-status/[id]",
  ];
  if (SIMPLE_HEADER_ROUTES.includes(router.pathname)) return null;

  if (router.pathname === "/home/wishlist") return null;

  if (isSectionPage) {
    return (
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: theme.zIndex.appBar,
          width: "100%",
          backgroundColor: "background.paper",
          borderBottom: `1px solid ${theme.palette.divider}`,
          px: "16px",
          py: "12px",
        }}
      >
        <Stack direction="row" alignItems="center" gap="8px">
          <Box
            onClick={() => {
              const moduleParam =
                typeof router.query.module === "string"
                  ? router.query.module
                  : getCurrentModuleType();
              router.push(`/home?module=${moduleParam}`);
            }}
            sx={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              cursor: "pointer",
              flexShrink: 0,
              "&:active": {
                backgroundColor: theme.palette.background.secondary,
              },
            }}
          >
            <i
              className="fi fi-rr-arrow-small-left"
              style={{
                fontSize: "20px",
                lineHeight: 1,
                display: "flex",
                color: theme.palette.neutral[1050],
              }}
            />
          </Box>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: "neutral.1050",
              letterSpacing: "-0.54px",
              lineHeight: 1.1,
            }}
          >
            {t(sectionTitle)}
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: theme.zIndex.appBar,
          width: "100%",
          backgroundColor: theme.palette.background.default,
          transition: "box-shadow 0.25s ease",
          boxShadow: isCollapsed
            ? "0px 1px 2px rgba(0,0,0,0.10), 0px 1px 2px rgba(0,0,0,0.05)"
            : "none",
        }}
      >
        {/* ── Grey header wrapper for Section 1 + 2 ── */}
        <Box sx={{ backgroundColor: theme.palette.background.secondary }}>
          {/* ── Section 1: Address + Cart ── */}
          <Box
            sx={{
              overflow: "hidden",
              maxHeight: isCollapsed ? "0px" : "60px",
              opacity: isCollapsed ? 0 : 1,
              transition: "max-height 0.25s ease, opacity 0.2s ease",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                pl: "16px",
                pr: "8px",
                pt: "12px",
                pb: "4px",
                gap: "16px",
                minHeight: "36px",
              }}
            >
              {/* Address column — title row + subtitle row */}
              <Box
                ref={addressAnchorRef}
                onClick={() => setAddressPopoverOpen(true)}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <Stack direction="row" alignItems="center" gap="4px">
                  <i
                    className="fi fi-rr-marker"
                    style={{
                      fontSize: "14px",
                      lineHeight: 1,
                      display: "flex",
                      color: theme.palette.neutral[1050],
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: theme.palette.neutral[1050],
                      lineHeight: 1.2,
                      letterSpacing: "-0.42px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t("Home")}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap="4px">
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 400,
                      color: isDark ? theme.palette.text.secondary : "#757575",
                      lineHeight: 1.2,
                      letterSpacing: "-0.36px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {location || t("Set your location")}
                  </Typography>
                  <i
                    className="fi fi-rr-angle-small-down"
                    style={{
                      fontSize: "16px",
                      lineHeight: 1,
                      display: "flex",
                      color: theme.palette.neutral[1050],
                      flexShrink: 0,
                    }}
                  />
                </Stack>
              </Box>

              {/* Cart — monochrome stroke icon */}
              {getCurrentModuleType() === ModuleTypes.PARCEL ? null : (
                <IconButton
                  onClick={() => {
                    if (getCurrentModuleType() === ModuleTypes.RENTAL) {
                      setTaxiOpen(true);
                      return;
                    }
                    setCartOpen(true);
                  }}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "8px",
                    color: theme.palette.neutral[1050],
                    position: "relative",
                    flexShrink: 0,
                    p: "8px",
                  }}
                  aria-label={t("Cart")}
                >
                  {getCurrentModuleType() === ModuleTypes.RENTAL ? (
                    <DirectionsCarOutlinedIcon
                      sx={{
                        fontSize: "20px",
                        color: theme.palette.neutral[1050],
                      }}
                    />
                  ) : (
                    <i
                      className="fi fi-rr-shopping-cart"
                      style={{
                        fontSize: "16px",
                        lineHeight: 1,
                        display: "flex",
                        color: theme.palette.neutral[1050],
                      }}
                    />
                  )}
                  {cartCount > 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        minWidth: 16,
                        height: 16,
                        px: "4px",
                        borderRadius: "8px",
                        backgroundColor: "primary.main",
                        color: "common.white",
                        fontSize: "10px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: 1,
                      }}
                    >
                      {cartCount}
                    </Box>
                  )}
                </IconButton>
              )}
            </Stack>
          </Box>

          {/* ── Section 2: Module tabs ── */}
          {showModuleTabs && (
            <Box
              sx={{
                overflow: "hidden",
                maxHeight: isCollapsed ? "0px" : "56px",
                opacity: isCollapsed ? 0 : 1,
                transition: "max-height 0.25s ease, opacity 0.2s ease",
              }}
            >
              <Box
                ref={moduleTabsRef}
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "6px",
                  px: "16px",
                  pt: "12px",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {modules?.map((mod) => {
                  const isActive = selectedModule?.id === mod?.id;
                  return (
                    <Box
                      key={mod.id}
                      data-active={isActive}
                      onClick={() => handleSelectModule(mod)}
                      sx={{
                        flexShrink: 0,
                        px: "16px",
                        py: "8px",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        userSelect: "none",
                        color: isActive
                          ? theme.palette.neutral[1050]
                          : isDark
                          ? theme.palette.text.secondary
                          : "#757575",
                        fontWeight: isActive ? 600 : 400,
                        fontSize: "14px",
                        borderRadius: "8px 8px 0 0",
                        backgroundColor: isActive
                          ? theme.palette.background.paper
                          : "transparent",
                        position: "relative",
                        transition: "color 0.2s, background-color 0.2s",
                        ...(isActive && {
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
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "14px",
                          fontWeight: "inherit",
                          lineHeight: 1.1,
                          letterSpacing: "-0.42px",
                          textTransform: "capitalize",
                        }}
                      >
                        {mod?.module_name}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
        {/* ── Section 3: Search bar — home only, hidden for rental and parcel */}
        {isHomePage &&
          getCurrentModuleType() !== ModuleTypes.RENTAL &&
          getCurrentModuleType() !== ModuleTypes.PARCEL &&
          getCurrentModuleType() !== ModuleTypes.RIDE && (
            <Box
              sx={{
                pt: "12px",
                pr: "16px",
                pb: "8px",
                pl: "16px",
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap="8px"
                onClick={() => setSearchOpen(true)}
                sx={{
                  height: isCollapsed ? "40px" : "44px",
                  px: "16px",
                  backgroundColor: theme.palette.background.secondary,
                  borderRadius: "9999px",
                  cursor: "pointer",
                  userSelect: "none",
                  transition: "height 0.25s ease",
                }}
              >
                <i
                  className="fi fi-rr-search"
                  style={{
                    fontSize: "16px",
                    lineHeight: 1,
                    display: "flex",
                    color: theme.palette.neutral[1050],
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: 1.3,
                    color: theme.palette.neutral[450],
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {searchPlaceholder}
                </Typography>
              </Stack>
            </Box>
          )}
        {/* ── Module-wise section chips (scrollable filter row) ── */}
        {sectionChips.length > 0 &&
          (router.pathname === "/home" ||
            router.pathname === "/home/[...slug]") && (
            <Box
              sx={{
                pl: "16px",
                pr: "0px",
                pb: "12px",
                pt: "4px",
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                  paddingRight: "16px",
                }}
              >
                {sectionChips
                  .filter((s) => s.id !== "discounted")
                  .map((s) => (
                    <Box
                      key={s.id}
                      onClick={() => goToSection(s)}
                      sx={{
                        flexShrink: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        height: "32px",
                        pl: "8px",
                        pr: "8px",
                        py: "4px",
                        backgroundColor: chipBgFor(s),
                        borderRadius: "9999px",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      {s.icon && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            p: "2px",
                          }}
                        >
                          {s.icon}
                        </Box>
                      )}
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 700,
                          lineHeight: 1.1,
                          letterSpacing: "-0.42px",
                          color: theme.palette.neutral[1050],
                          textTransform: "capitalize",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t(s.label)}
                      </Typography>
                    </Box>
                  ))}
              </Box>
            </Box>
          )}
      </Box>

      <AllCartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartData={cartList}
        refetch={cartListRefetch}
      />

      {taxiOpen && (
        <TaxiView
          sideDrawerOpen={taxiOpen}
          setSideDrawerOpen={setTaxiOpen}
          cartList={cartList}
          refetch={bookingRefetch}
          configData={configData}
        />
      )}

      <MobileSearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <AddressReselectPopover
        anchorEl={addressAnchorRef.current}
        open={addressPopoverOpen}
        onClose={() => setAddressPopoverOpen(false)}
        t={t}
        address={address}
        setAddress={setAddress}
        token={token}
        currentLatLngForMar={currentLatLngForMar}
      />
    </>
  );
};

export default MobileNavBar;
