import React from "react";
import CustomContainer from "components/container";
import {
  alpha,
  Box,
  Grid,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SolutionSvg from "components/landing-page/SolutionSvg";
import DownloadApps from "components/landing-page/DownloadApps";
import Link from "next/link";
import { ComponentTwoContainer } from "components/landing-page/ComponentTwo";
import CustomImageContainer from "components/CustomImageContainer";
import { Stack } from "@mui/system";
import { t } from "i18next";

const AvailableZoneSection = ({ landingPageData }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const toolTipsContent = (zone) => {
    return (
      <>
        <Stack>
          <Typography paddingX="7px">{zone?.display_name}</Typography>
          <Stack direction="row" p="7px" flexWrap="wrap" gap="4px">
            {zone?.modules?.length > 0 ? (
              <Typography fontSize="12px">{t("Modules are")} </Typography>
            ) : (
              <Typography fontSize="12px">
                {t("No module available")}
              </Typography>
            )}

            {/* Add a space after the text */}
            {zone?.modules?.map((item, index) => (
              <Typography key={index} fontSize="12px">
                {item}
                {index !== zone.modules.length - 1 ? "," : "."}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </>
    );
  };

  return (
    <ComponentTwoContainer
      background
      paddingTop={isSmall ? "2rem" : "3rem"}
      paddingBottom="2rem"
    >
      <CustomContainer>
        {" "}
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          spacing={{ xs: 2, md: 4 }}
        >
          <Grid item xs={12} sm={12} md={6} align={isSmall ? "center" : "left"}>
            <Typography
              fontSize={{ xs: "1.2rem", md: "30px" }}
              fontWeight={{ xs: "600", md: "700" }}
            >
              {landingPageData?.available_zone_title}
            </Typography>
            <Typography
              // fontSize="16px"
              // fontWeight="500"
              fontSize={{ xs: "14px", md: "16px" }}
              fontWeight={{ xs: "400", md: "500" }}
              color={theme.palette.neutral[400]}
              paddingTop={isSmall ? "10px" : "0rem"}
            >
              {landingPageData?.available_zone_short_description}
            </Typography>
            <Box sx={{ position: "relative", marginTop: "35px" }}>
              {/* Scrollable container with custom scrollbar */}
              <Box
                sx={{
                  height: 200,
                  overflowY: "auto",
                  paddingRight: "10px",
                  "&::-webkit-scrollbar": {
                    width: "3px", // Custom scrollbar width
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f0f0f0", // Track color
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#c1c1c1", // Thumb color
                    borderRadius: "3px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#003638", // Thumb hover color
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    maxWidth: "543px",
                    paddingBottom: "35px",
                  }}
                >
                  {landingPageData?.available_zone_list
                    ?.filter((item) => item?.modules?.length > 0)
                    .map((zone, index) => (
                      <Tooltip
                        arrow
                        placement="top"
                        title={toolTipsContent(zone)}
                        key={index}
                      >
                        <Box
                          sx={{
                            borderRadius: "10px",
                            border: "1px solid",
                            borderColor: alpha(theme.palette.neutral[400], 0.5),
                            backgroundColor: (theme) =>
                              theme.palette.neutral[100],
                            padding: "15px 30px",
                            cursor: "pointer",
                            fontSize: "20px",
                            fontWeight: 700,
                            textAlign: "center",
                            textDecoration: "none",
                            "&:hover": {
                              boxShadow: `0px 4px 12px 0px ${theme.palette.neutral[100]}`,
                              color: "#039d55",
                            },
                          }}
                          data-bs-toggle="popover"
                          data-bs-trigger="hover"
                          data-bs-placement="top"
                          title="Popover title"
                          data-bs-content="And here's some amazing content. It's very engaging. Right?"
                        >
                          {zone?.display_name}
                        </Box>
                      </Tooltip>
                    ))}
                </Box>
              </Box>

              {/* The gradient overlay at the bottom */}

              <Box
                sx={{
                  position: "absolute",
                  height: "62px",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  background: `linear-gradient(180deg, ${alpha(
                    theme.palette.background.default,
                    0.0
                  )} 43.03%,  ${alpha(
                    theme.palette.background.default,
                    0.72
                  )} 55.48%,  ${alpha(
                    theme.palette.background.default,
                    0.9
                  )} 100%)`,
                  pointerEvents: "none",
                }}
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            align={isSmall ? "center" : "right"}
          >
            <Box
              sx={{
                position: "relative",
                width: { xs: "223px", md: "440px" },
                height: { xs: "150px", md: "380px" },
              }}
            >
              <CustomImageContainer
                src={landingPageData?.available_zone_image_full_url}
              />
            </Box>
          </Grid>
        </Grid>
      </CustomContainer>
    </ComponentTwoContainer>
  );
};

export default AvailableZoneSection;
