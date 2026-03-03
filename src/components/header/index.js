import { AppBarStyle } from "./NavBar.style";

import { Card, NoSsr, useMediaQuery, useScrollTrigger, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import SecondNavBar from "./second-navbar/SecondNavbar";
import TopNavBar from "./top-navbar/TopNavBar";
import useGetZoneId from "api-manage/hooks/react-query/google-api/useGetZone";
import { useEffect, useState } from "react";

const HeaderComponent = () => {
  const { configData } = useSelector((state) => state.configData);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const scrolling = useScrollTrigger();

  // ✅ read localStorage on first CLIENT render (state initializer runs during render on client)
  const [location] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("location");
  });

  const [token] = useState(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });

  const [currentLocation] = useState(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("currentLatLng");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  // ✅ enable query only when we have location
  const zoneIdEnabled = !!currentLocation;

  const { data: zoneData } = useGetZoneId(currentLocation, zoneIdEnabled);

  // ✅ store zoneid when received
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (zoneData?.zone_id) {
      localStorage.setItem("zoneid", zoneData.zone_id);
    }
  }, [zoneData]);

  return (
    <AppBarStyle scrolling={location || token ? scrolling : false} isSmall={isSmall}>
      <Box>
        <NoSsr>
          <Card sx={{ boxShadow: "none" }}>
            <TopNavBar configData={configData} />
          </Card>
          <SecondNavBar configData={configData} />
        </NoSsr>
      </Box>
    </AppBarStyle>
  );
};

export default HeaderComponent;
