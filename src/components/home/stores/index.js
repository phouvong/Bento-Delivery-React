import { Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box, Stack } from "@mui/system";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import { t } from "i18next";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { HomeComponentsWrapper } from "../HomePageComponents";
import AllStores from "./AllStores";

const menus = [
  { label: t("All"), value: "all" },
  { label: t("Newly Joined"), value: "newly_joined" },
  { label: t("Nearby"), value: "nearby" },
  { label: t("Top Rated"), value: "top_rated" },
  { label: t("Popular"), value: "popular" },
];

const ModuleWiseMenu = {
  [ModuleTypes.FOOD]: menus,
  [ModuleTypes.GROCERY]: menus,
  [ModuleTypes.PHARMACY]: [
    { label: t("All"), value: "all" },
    { label: t("Open Now"), value: "currently_open" },
    { label: t("Free Delivery"), value: "free_delivery" },
    { label: t("Rx Accepted"), value: "rx_accepted" },
    { label: t("Nearby"), value: "nearby" },
  ],
  [ModuleTypes.ECOMMERCE]: menus,
};

// ─── Pill Tab ──────────────────────────────────────────────────────────────

const PillTabs = ({
  selectedMenuIndex,
  setSelectedMenuIndex,
  setFilteredData,
}) => {
  const theme = useTheme();
  const currentModule = getCurrentModuleType();
  const activeMenus = ModuleWiseMenu[currentModule] ?? menus;
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap="8px"
      sx={{
        overflowX: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
        flexWrap: { xs: "nowrap", md: "wrap" },
        width: { xs: "100%", md: "auto" },
        ml: { xs: 0, md: "auto" },
      }}
    >
      {activeMenus.map((item, index) => {
        const isActive = selectedMenuIndex === index;
        return (
          <Box
            key={index}
            onClick={() => {
              setSelectedMenuIndex(index);
              setFilteredData(item.value);
            }}
            sx={{
              height: 32,
              px: "12px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
              backgroundColor: isActive
                ? theme.palette.primary.main
                : "transparent",
              transition: "background-color 0.2s ease",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#ffffff" : "neutral.500",
                lineHeight: 1.3,
                whiteSpace: "nowrap",
              }}
            >
              {t(item.label)}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
};

// ─── Main ──────────────────────────────────────────────────────────────────

const Stores = ({ title }) => {
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [filteredData, setFilteredData] = useState("all");
  const [totalDataCount, setTotalDataCount] = useState(null);
  const { configData } = useSelector((state) => state.configData);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <HomeComponentsWrapper>
      {/* Header */}
      <CustomStackFullWidth
        py="10px"
        sx={{
          position: "sticky",
          top: { xs: "75px", md: "63px" },
          zIndex: 100,
          background: (theme) => theme.palette.background.default,
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: { xs: "flex-start", md: "space-between" },
          gap: { xs: "10px", md: "12px" },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "18px", md: "24px" },
            fontWeight: 700,
            color: "neutral.1050",
            lineHeight: 1.1,
            letterSpacing: "-1.2px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {t(title ?? "Explore Restaurants")}
        </Typography>
        <PillTabs
          selectedMenuIndex={selectedMenuIndex}
          setSelectedMenuIndex={setSelectedMenuIndex}
          setFilteredData={setFilteredData}
        />
      </CustomStackFullWidth>

      {/* Cards */}
      <CustomBoxFullWidth
        sx={{ minHeight: "20vh", marginTop: "1rem" }}
      >
        <AllStores
          selectedFilterValue="all"
          configData={configData}
          totalDataCount={totalDataCount}
          setTotalDataCount={setTotalDataCount}
          filteredData={filteredData}
        />
      </CustomBoxFullWidth>
    </HomeComponentsWrapper>
  );
};

export default Stores;
