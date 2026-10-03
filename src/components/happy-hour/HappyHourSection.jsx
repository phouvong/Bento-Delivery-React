import { Box, Stack } from "@mui/material";
import useHappyHourActive from "api-manage/hooks/custom-hooks/useHappyHourActive";
import HappyHourBanner from "./HappyHourBanner";

// The left half never reports its own state (module banners just self-hide),
// so callers pass `leftActive` alongside `leftContent`.
const HappyHourSection = ({ leftContent = null, leftActive = false }) => {
  const { isActive: happyHourActive } = useHappyHourActive();

  if (!leftActive && !happyHourActive) return null;

  const bothActive = leftActive && happyHourActive;
  const halfSx = {
    flex: bothActive ? { xs: "1 1 100%", md: "1 1 0%" } : "1 1 100%",
    minWidth: 0,
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      gap={{ xs: "16px", md: "20px" }}
      width="100%"
      alignItems="stretch"
      sx={{ display: { xs: leftActive ? "flex" : "none", md: "flex" } }}
    >
      {leftActive && <Box sx={halfSx}>{leftContent}</Box>}
      {happyHourActive && (
        <Box sx={{ ...halfSx, display: { xs: "none", md: "flex" } }}>
          <HappyHourBanner />
        </Box>
      )}
    </Stack>
  );
};

export default HappyHourSection;
