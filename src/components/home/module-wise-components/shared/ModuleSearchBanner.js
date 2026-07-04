import { Box, Stack, Typography } from "@mui/material";
import ManageSearch from "components/header/second-navbar/ManageSearch";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch } from "react-redux";
import { setSearchBannerInView } from "redux/slices/utils";
import { useTranslation } from "react-i18next";

/**
 * Module-agnostic search banner. Title/subtitle are passed by caller so each
 * module (food / grocery / shop / pharmacy / …) can reuse the same UI with
 * its own copy.
 */
const ModuleSearchBanner = ({
  zoneid,
  searchQuery,
  title = "Search",
  subtitle = "Easy search to easy order & get fast delivery for your need.",
  component,
  maxWidth,
  isRental,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  // Track banner visibility only on the main home page and the search page.
  // Sub-pages (home/offer, home/category, home/nearby, ...) have a different
  // context, so the navbar there behaves on scroll regardless of this banner.
  const isTrackedPage =
    router.pathname === "/home" || router.pathname === "/search";

  // rootMargin offsets the sticky navbar (64px desktop top bar) so the banner
  // counts as "out of view" the moment its search input slips behind the navbar
  // — that's exactly when the navbar search should take over.
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "-64px 0px 0px 0px",
    skip: !isTrackedPage,
  });

  useEffect(() => {
    if (!isTrackedPage) return;
    dispatch(setSearchBannerInView(inView));
  }, [inView, isTrackedPage, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setSearchBannerInView(true));
    };
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: { xs: isRental ? "block" : "none", md: "block" },
        width: "100%",
        borderRadius: isRental ? { xs: 0, md: "16px" } : "16px",
        backgroundColor: isRental
          ? { xs: "transparent", md: "background.paper" }
          : "background.paper",
        boxShadow: isRental
          ? {
              xs: "none",
              md: "0px 1px 4px 0px #0000000d, 0px 1px 4px 0px #0000001a",
            }
          : "0px 1px 4px 0px #0000000d, 0px 1px 4px 0px #0000001a",
        position: "relative",
        py: isRental ? { xs: 0, md: 6 } : { xs: 2, md: 6 },
        px: isRental ? { xs: 0, md: 8 } : { xs: 2, md: 8 },
        mb: 1,
      }}
    >
      <Stack spacing={3} alignItems="center">
        <Stack
          spacing={1}
          alignItems="center"
          sx={{
            display: isRental ? { xs: "none", md: "flex" } : "flex",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "24px", md: "32px" },
              lineHeight: 1.1,
              letterSpacing: "-0.64px",
              color: "neutral.1050",
              textAlign: "center",
            }}
          >
            {t(title)}
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: 1.3,
              letterSpacing: "-0.48px",
              color: "neutral.500",
              textAlign: "center",
            }}
          >
            {t(subtitle)}
          </Typography>
        </Stack>

        <Box
          ref={isTrackedPage ? ref : undefined}
          sx={{
            width: "100%",
            maxWidth: maxWidth || "820px",
            "& form > div:first-child": {
              borderRadius: "9999px !important",
              height: "44px",
              backgroundColor: (theme) =>
                `${theme.palette.background.secondary} !important`,
              border: "none !important",
            },
            "& .MuiPaper-root": {
              backgroundColor: "background.paper",
            },
          }}
        >
          {component || (
            <ManageSearch zoneid={zoneid} fullWidth searchQuery={searchQuery} />
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default ModuleSearchBanner;
