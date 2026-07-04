import { AppBarStyle } from "./NavBar.style";

import { NoSsr, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import NewNavBar from "./new-navbar/NewNavBar";
import useGetZoneId from "api-manage/hooks/react-query/google-api/useGetZone";
import { useEffect, useState } from "react";

const HeaderComponent = () => {
  const { configData } = useSelector((state) => state.configData);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const [currentLocation] = useState(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("currentLatLng");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const { data: zoneData } = useGetZoneId(currentLocation, !!currentLocation);

  // ✅ store zoneid when received
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (zoneData?.zone_id) {
      localStorage.setItem("zoneid", zoneData.zone_id);
    }
  }, [zoneData]);

  return (
    <AppBarStyle scrolling={false} isSmall={isSmall}>
      <Box sx={{ width: "100%" }}>
        <NoSsr>
          <NewNavBar configData={configData} />
        </NoSsr>
      </Box>
    </AppBarStyle>
  );
};

export default HeaderComponent;
