import React, { useEffect, useRef, useState } from "react";
import RentalFilterLayout from "../global/RentalFilterLayout";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import TaxiSearchPanel from "../global/search/TaxiSearchPanel";
import { Box } from "@mui/system";
import { search_api } from "components/home/module-wise-components/rental/rental-api-manage/ApiRoutes";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import ModuleSearchBanner from "components/home/module-wise-components/shared/ModuleSearchBanner";
import CustomContainer from "components/container";

const VehicleSearchPage = () => {
  useScrollToTop();
  const searchPanelRef = useRef(null);
  const [pastSearchPanel, setPastSearchPanel] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const isSticky = pastSearchPanel && !footerVisible;

  // Sticky toggles on once the search panel scrolls above the navbar.
  useEffect(() => {
    const handleScroll = () => {
      if (!searchPanelRef.current) return;
      const { bottom } = searchPanelRef.current.getBoundingClientRect();
      setPastSearchPanel(bottom < 64);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sticky hides while the footer is in view so it doesn't sit over it.
  useEffect(() => {
    const footer =
      document.getElementById("site-footer") ||
      document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: "0px", threshold: 0 }
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <Box sx={{ position: "relative" }}>
      {/* ── Sticky search bar — fixed, outside overflow context ── */}
      {isSticky && (
        <Box
          sx={{
            position: "fixed",
            top: { xs: "50px", md: "64px" },
            left: 0,
            right: 0,
            zIndex: 1100,
            backgroundColor: "background.paper",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.10)",
            paddingY: ".5rem",
          }}
        >
          <CustomContainer>
            <TaxiSearchPanel isSticky showSearch={false} position="relative" />
          </CustomContainer>
        </Box>
      )}

      <RentalFilterLayout
        api_endpoint={search_api}
        isSticky={isSticky}
        topContent={
          <CustomStackFullWidth sx={{ position: "relative" }}>
            <CustomContainer>
              <ModuleSearchBanner
                isRental
                title="Rent the Perfect Car for Every Journey"
                subtitle="Choose from a wide range of cars and enjoy a smooth, reliable rental experience."
                component={
                  <Box ref={searchPanelRef}>
                    <TaxiSearchPanel
                      showSearch={false}
                      position="relative"
                      mt="40px"
                    />
                  </Box>
                }
                maxWidth="1200px"
              />
            </CustomContainer>
          </CustomStackFullWidth>
        }
      />
    </Box>
  );
};

export default VehicleSearchPage;
