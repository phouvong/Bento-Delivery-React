import { useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetModule from "../../api-manage/hooks/react-query/useGetModule";
import { setSelectedModule } from "../../redux/slices/utils";
import { setModules } from "../../redux/slices/configData";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import FooterComponent from "../footer";
import HeaderComponent from "../header";
import BottomNav from "../header/BottomNav";
import { MainLayoutRoot } from "./LandingLayout";
import useGetLandingPage from "api-manage/hooks/react-query/useGetLandingPage";
import useScrollDirection from "hooks/useScrollDirection";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import SearchProductModal from "../home/search/SearchProductModal";
import FloatingCartButton from "../header/new-navbar/FloatingCartButton";

// Routes that own their own sticky/in-flow header on mobile (no extra mt needed).
// Adding a route here removes the default mobile navbar offset on that page.
const FULL_BLEED_MOBILE_ROUTES = new Set([
  "/search",
  "/profile",
  "/store/[id]",
  "/all-stores",
  "/checkout",
  "/refund-policy",
  "/cancellation-policy",
  "/shipping-policy",
  "/privacy-policy",
  "/track-order",
  "/store-registration",
  "/deliveryman-registration",
  "/help-and-support",
  "/about-us",
  // Section + category pages use their own MobileNavBar variant
  "/home/[...slug]",
  "/home/category/[slug]",
  "/home/wishlist",
  "/product/[id]",
  "/parcel-delivery-info",
  "/rental/vehicle-search",
  "/rental/checkout",
  "/rental/cart",
  "/rental/vehicle/[id]",
  "/rental/provider/latest",
  "/rental/provider/popular",
  "/rental/provider/[id]",
  "/rental/trip-status/[id]",
]);

const getMobileMarginTop = ({ pathname, currentModuleType, isCollapsed }) => {
  if (FULL_BLEED_MOBILE_ROUTES.has(pathname)) return "0px";
  if (currentModuleType === ModuleTypes.RIDE) return "4.9rem";
  if (currentModuleType === ModuleTypes.RENTAL) {
    return pathname?.startsWith("/rental") ? "3rem" : "6.3rem";
  }
  if (currentModuleType === ModuleTypes.PARCEL) return "7.8rem";
  return isCollapsed ? "10rem" : "11.9rem";
};

const MainLayout = ({ children, configData }) => {
  const [rerenderUi, setRerenderUi] = useState(false);
  const { data, refetch } = useGetModule();
  const theme = useTheme();
  const isSmall = useMediaQuery("(max-width:1180px)");
  const { direction, scrollY } = useScrollDirection({ threshold: 8 });
  const isCollapsed = isSmall && scrollY > 40 && direction === "down";
  const router = useRouter();
  const { page } = router.query;
  const dispatch = useDispatch();
  useEffect(() => {
    if (router.pathname === "/home") {
      refetch();
    }
  }, []);

  useEffect(() => {
    if (data?.length) {
      dispatch(setModules(data));
    }
  }, [data]);
  // if (data) {
  // 	const selectedModuleType = JSON.parse(
  // 		localStorage.getItem("module")
  // 	)?.module_type;
  // 	if (data.length === 0) {
  // 		localStorage.removeItem("module");
  // 		router.push("/", undefined, { shallow: true });
  // 	} else {
  // 		if (
  // 			!data?.find((item) => item.module_type === selectedModuleType)
  // 		) {
  // 			const newModule = data[0];
  // 			localStorage.setItem("module", JSON.stringify(newModule));
  // 			dispatch(setSelectedModule(newModule));
  // 			if (router.isReady) {
  // 				const nextQuery = {
  // 					...router.query,
  // 					module_id: `${newModule.id}`,
  // 				};
  // 				if (router.query.module_id !== `${newModule.id}`) {
  // 					router.replace(
  // 						{ pathname: router.pathname, query: nextQuery },
  // 						undefined,
  // 						{ shallow: true }
  // 					);
  // 				}
  // 			}
  // 		}
  // 	}
  // }
  const { landingPageData } = useSelector((state) => state.configData);
  const selectedModule = useSelector(
    (state) => state.utilsData?.selectedModule,
  );
  const queryModuleType =
    typeof router.query.module === "string" ? router.query.module : null;
  const currentModuleType =
    selectedModule?.module_type ??
    getCurrentModuleType() ??
    queryModuleType ??
    null;
  const { data: landing, refetch: landingRefetch } = useGetLandingPage();
  useEffect(() => {
    if (!landingPageData) {
      landingRefetch();
    }
  }, []);

  // ── Cross-tab module sync ──
  // The active module is shared across the whole browser (localStorage "module").
  // When another tab switches modules the `storage` event fires here, so this tab
  // mirrors the change: update redux + replace the URL's module param. Every open
  // tab stays on the same module (data + URL) instead of drifting out of sync.
  useEffect(() => {
    const handleModuleStorage = (e) => {
      if (e.key !== "module" || !e.newValue) return;
      let nextModule;
      try {
        nextModule = JSON.parse(e.newValue);
      } catch {
        return;
      }
      if (!nextModule?.id) return;
      dispatch(setSelectedModule(nextModule));
      // Only rewrite the URL on module-aware pages (those that carry ?module=).
      const identifier = nextModule.slug || nextModule.id;
      if (
        router.query.module !== undefined &&
        String(router.query.module) !== String(identifier)
      ) {
        router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query, module: identifier },
          },
          undefined,
          { shallow: true },
        );
      }
    };
    window.addEventListener("storage", handleModuleStorage);
    return () => window.removeEventListener("storage", handleModuleStorage);
  }, [router, dispatch]);

  return (
    <MainLayoutRoot justifyContent="space-between" key={rerenderUi}>
      <header>
        <HeaderComponent />
      </header>
      <CustomStackFullWidth
        sx={{
          marginTop: {
            xs: getMobileMarginTop({
              pathname: router.pathname,
              currentModuleType,
              isCollapsed,
            }),
            md: router.pathname?.startsWith("/rental")
              ? "10rem"
              : ["/profile", "/checkout"].includes(router.pathname)
              ? "4.4rem"
              : "5.4rem",
            lg: router.pathname?.startsWith("/rental")
              ? "10rem"
              : ["/profile", "/checkout"].includes(router.pathname)
              ? "4.4rem"
              : "6.4rem",
          },
          transition: "margin-top 0.25s ease",
        }}
      >
        <CustomStackFullWidth sx={{ minHeight: { xs: "auto", md: "70vh" } }}>
          {children}
        </CustomStackFullWidth>
      </CustomStackFullWidth>
      <footer>
        <FooterComponent
          configData={configData}
          landingPageData={landingPageData ?? landing}
        />
      </footer>
      {isSmall &&
        page !== "parcel" &&
        router.pathname !== "/store/[id]" &&
        router.pathname !== "/product/[id]" && <BottomNav />}
      <SearchProductModal />
      <FloatingCartButton />
    </MainLayoutRoot>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default React.memo(MainLayout);
