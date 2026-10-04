import React from "react";
import { Box, Stack } from "@mui/system";
import { styled, Typography } from "@mui/material";
import { t } from "i18next";

const CustomTypography = styled(Typography)(({ theme, active }) => ({
  fontSize: "20px",
  cursor: "pointer",
  // borderBottom: active === "true" ? "1px solid" : "none",
  // borderBottomWidth: "50%",
  fontWeight: active === "true" ? "700" : "400",
}));

const ActiveIndicator = styled(Box)(({ theme, active }) => ({
  backgroundColor: active === "true" ? theme.palette.primary.main : "inherit",
  borderRadius: "7px",
  width: "100%",
  height: "3px",
}));
const LangTab = (props) => {
  const { tabs, currentTab, setCurrentTab } = props;
  // overflow-x: auto;
  // overflow-y: hidden;
  // white-space: nowrap;
  // height: -webkit-fill-available;
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        overflowX: "auto",
        overflowY: "hidden",
        whiteSpace: "nowrap",
        height: "-webkit-fill-available",
      }}
    >
      {tabs?.length > 0 &&
        tabs.map((item, index) => {
          return (
            <Stack
              key={index}
              alignItems="center"
              justifyContent="center"
              spacing={1}
            >
              <Typography
                active={currentTab === index ? "true" : "false"}
                onClick={() => setCurrentTab(index, item)}
              >
                {t(item?.value)}
              </Typography>
              <ActiveIndicator
                active={currentTab === index ? "true" : "false"}
              />
            </Stack>
          );
        })}
    </Stack>
  );
};

LangTab.propTypes = {};

export default LangTab;
