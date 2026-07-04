import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import RoomIcon from "@mui/icons-material/Room";
import { alpha, ClickAwayListener, Grid, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import AddressReselectPopover from "./AddressReselectPopover";
import { getModule } from "helper-functions/getLanguage";
import { AddressTypographyGray } from "../TopNavBar";

const AddressReselect = ({ location, setOpenDrawer }) => {
  const theme = useTheme();
  const router = useRouter();
  const [openReselectModal, setOpenReselectModal] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(true);

  const [openPopover, setOpenPopover] = useState(false);
  const [address, setAddress] = useState(null);
  const { t } = useTranslation();
  let token = undefined;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  let currentLatLngForMar;
  if (typeof localStorage.getItem("currentLatLng") !== undefined) {
    currentLatLngForMar = JSON.parse(localStorage.getItem("currentLatLng"));
  }
  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastScrollY = window.scrollY;
    let openTimerId = null;
    const SCROLL_THRESHOLD_PX = 10;
    const OPEN_DELAY_MS = 180;

    const clearOpenTimer = () => {
      if (openTimerId) {
        window.clearTimeout(openTimerId);
        openTimerId = null;
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      // Ignore tiny scroll movements to prevent tooltip blinking on mobile.
      if (Math.abs(delta) < SCROLL_THRESHOLD_PX) return;
      lastScrollY = currentScrollY;

      // Close immediately while scrolling down.
      if (delta > 0) {
        clearOpenTimer();
        setTooltipOpen(false);
        return;
      }

      // Debounce re-open while scrolling up (wait for scroll to settle).
      clearOpenTimer();
      openTimerId = window.setTimeout(() => {
        setTooltipOpen(true);
      }, OPEN_DELAY_MS);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearOpenTimer();
    };
  }, []);
  let currentLatLng;
  useEffect(() => {
    let currentLatLng;
    if (typeof localStorage.getItem("currentLatLng") !== undefined) {
      currentLatLng = JSON.parse(localStorage.getItem("currentLatLng"));
      const location = localStorage.getItem("location");
    }
  }, []);

  useEffect(() => {
    if (address) {
      localStorage.setItem("location", address?.address);
      const values = { lat: address?.lat, lng: address?.lng };
      localStorage.setItem("currentLatLng", JSON.stringify(values));
      if (address.zone_ids && address.zone_ids.length > 0) {
        const value = [address.zone_ids];

        localStorage.setItem("zoneid", JSON.stringify(address.zone_ids));
        toast.success(t(`New ${getModule()?.module_type === "rental" ? "Pickup" : "Delivery"} address selected.`));
        setOpenPopover(false);
      }
    }
  }, [address, t]);
  const handleClickToLandingPage = () => {
    setOpenPopover(true);
    setOpenDrawer?.(false);
  };

  const anchorRef = useRef(null);
  const handleClosePopover = () => {
    setOpenPopover(false);
  };
  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };
  return (
    <>
      <Grid
        container
        alignItems="center"
        justifyContent="flex-end"
        sx={{
          cursor: "pointer",
          color: (theme) => theme.palette.neutral[1000],
          maxWidth: { xs: "230px", sm: "280px" },
        }}
        ref={anchorRef}
        onClick={handleClickToLandingPage}
      >
        <Grid item xs={11} align="left">
          {!location ? (
            router.pathname !== "/" ? (
              <>
                <ClickAwayListener onClickAway={handleTooltipClose}>
                  <Tooltip
                    title={t("Sharing your location improves search accuracy and delivery estimates for smoother order delivery.")}
                    arrow
                    placement="bottom-start"
                    open={tooltipOpen}
                    disableHoverListener
                    disableFocusListener
                    disableTouchListener
                    TransitionProps={{ timeout: 0 }}
                    slotProps={{
                      popper: {
                        sx: { zIndex: 9999 },
                        modifiers: [
                          { name: "offset", options: { offset: [0, 4] } },
                        ],
                      },
                      tooltip: {
                        sx: {
                          bgcolor: (t) => t.palette.mode === "dark" ? t.palette.neutral[700] : "#303030",
                          color: "#f3f3f3",
                          textTransform: "none",
                          fontSize: "14px",
                          fontWeight: 400,
                          lineHeight: 1.3,
                          padding: "8px 12px",
                          borderRadius: "8px",
                          maxWidth: "320px",
                          textAlign: "left",
                          boxShadow: "0px 4px 8px rgba(0,0,0,0.1), 0px 16px 16px rgba(0,0,0,0.05)",
                          "& .MuiTooltip-arrow": {
                            color: (t) => t.palette.mode === "dark" ? t.palette.neutral[700] : "#303030",
                            left: "8px !important",
                            transform: "none !important",
                          },
                        },
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      onClick={() => setTooltipOpen(false)}
                      alignItems="center"
                      gap="5px"
                      sx={{
                        cursor: 'pointer',
                        color: (theme) => theme.palette.neutral[1000],
                        minWidth: "174px"
                      }}
                    >
                      <i
                        className="fi fi-rs-marker"
                        style={{ fontSize: "16px", display: "flex", lineHeight: 1, color: "inherit" }}
                      />
                      <AddressTypographyGray align="left">
                        {t('Select your location')}
                      </AddressTypographyGray>
                    </Stack>
                  </Tooltip>
                </ClickAwayListener>
              </>
            ) : (
              null
            )
          ) : (
            <CustomStackFullWidth direction="row" alignItems="center" spacing={1}>
              <i
                className="fi fi-rs-marker"
                style={{ fontSize: "16px", display: "flex", lineHeight: 1, color: "inherit" }}
              />
              <Typography
                fontSize={{ xs: "12px", sm: "16px" }}
                align="center"
                color={theme.palette.neutral[1000]}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "1",
                  WebkitBoxOrient: "vertical",
                  textAlign: "left",
                  transition: "all ease 0.5s",
                  wordBreak: "break-all",
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                  // width: "210px",
                }}
              >
                {location}
              </Typography>
            </CustomStackFullWidth>
          )}
        </Grid>
        {router.pathname !== "/" && (
          <Grid item xs={1}>
            <CustomStackFullWidth>
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: { xs: "16px", sm: "20px" },
                }}
              />
            </CustomStackFullWidth>
          </Grid>
        )}
      </Grid>
      <AddressReselectPopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        open={openPopover}
        t={t}
        address={address}
        setAddress={setAddress}
        token={token}
        currentLatLngForMar={currentLatLngForMar}
      />
    </>
  );
};

AddressReselect.propTypes = {};

export default AddressReselect;
