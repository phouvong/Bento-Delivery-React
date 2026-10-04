import { useTheme } from "@emotion/react";
import {
  Box,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { t } from "i18next";
import { useEffect } from "react";
import useParcelVideo from "../../api-manage/hooks/react-query/percel/useParcelVideo";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import CustomImageContainer from "../CustomImageContainer";
import ParcelInstruction from "./ParcelInstruction";
import CustomVideoPlayer from "./video-player/CustomVideoPlayer";

const ParcelVideo = () => {
  const theme = useTheme();
  const { data, refetch, isLoading } = useParcelVideo();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    refetch();
  }, []);

  const steps = [
    {
      label: data?.banner_contents?.[0]?.value,
      description: data?.banner_contents?.[1]?.value,
    },
    {
      label: data?.banner_contents?.[2]?.value,
      description: data?.banner_contents?.[3]?.value,
    },
    {
      label: data?.banner_contents?.[4]?.value,
      description: data?.banner_contents?.[5]?.value,
    },
  ];

  const cardSx = {
    backgroundColor: theme.palette.background.paper,
    borderRadius: { xs: "12px", md: "16px" },
    boxShadow:
      "0px 1px 2px rgba(17, 24, 39, 0.04), 0px 4px 16px rgba(17, 24, 39, 0.06)",
    overflow: "hidden",
    height: "100%",
  };

  return (
    <CustomStackFullWidth mt={{ xs: "20px", sm: "30px", md: "50px" }}>
      <Grid container alignItems="stretch" spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <Box
            sx={{
              ...cardSx,
              position: "relative",
              width: "100%",
              // Mobile needs a fallback height because there's no sibling to
              // stretch against (the right card stacks below it).
              minHeight: { xs: 220, md: 0 },
            }}
          >
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                animation="pulse"
                sx={{
                  width: "100%",
                  height: { xs: 260, md: "100%" },
                  minHeight: { md: 320 },
                }}
              />
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  "& > *, & img, & video": {
                    width: "100% !important",
                    height: "100% !important",
                    objectFit: "cover",
                  },
                }}
              >
                {data?.banner_type === "video" ? (
                  <CustomVideoPlayer videoUrl={data?.banner_video} />
                ) : data?.banner_type === "video_content" ? (
                  <CustomVideoPlayer
                    videoUrl={data?.banner_video_content_full_url}
                  />
                ) : (
                  <CustomImageContainer
                    src={data?.banner_image_full_url}
                    width="100%"
                    objectfit="cover"
                    smWidth="100%"
                    smHeight="100%"
                  />
                )}
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={cardSx}>
            <Stack
              spacing={{ xs: 2, md: 2.5 }}
              sx={{ p: { xs: 2.5, md: 4 }, height: "100%" }}
            >
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: "18px", md: "26px" },
                  fontWeight: 700,
                  color: "neutral.1050",
                  lineHeight: 1.25,
                }}
              >
                {t("Easiest Way to Get services")}
              </Typography>
              {data?.banner_contents?.length > 0 && (
                <ParcelInstruction
                  steps={steps}
                  theme={theme}
                  isLoading={isLoading}
                />
              )}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </CustomStackFullWidth>
  );
};

export default ParcelVideo;
