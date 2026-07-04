import {
  Box,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { data_limit } from "api-manage/ApiRoutes";
import CustomEmptyResult from "components/custom-empty-result";
import CustomPagination from "components/custom-pagination";
import nodata from "components/loyalty-points/assets/Search.svg";
import RideCard from "components/my-orders/RideCard";
import { CustomPaper } from "components/my-orders/order";
import { useTranslation } from "react-i18next";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";

// ── Tab values ────────────────────────────────────────────────────────────────
const TAB_ALL = "all";
const TAB_RUNNING = "running";
const TAB_HISTORY = "previous";

// ── Shimmer ───────────────────────────────────────────────────────────────────
const Shimmer = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <CustomBoxFullWidth>
      <Grid container spacing={3}>
        {[...Array(4)].map((_, i) => (
          <Grid item xs={12} key={i}>
            <CustomPaper>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  width="100%"
                >
                  <Skeleton
                    variant="rectangular"
                    width={isSmall ? 100 : 90}
                    height={isSmall ? 100 : 72}
                  />
                  <Stack width="100%" spacing={0.5}>
                    <Skeleton variant="text" width="200px" height={20} />
                    <Skeleton variant="text" width="130px" height={20} />
                    <Skeleton variant="text" width="130px" height={20} />
                  </Stack>
                </Stack>
                {!isSmall && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Skeleton variant="text" width="130px" height={40} />
                  </Stack>
                )}
              </Stack>
            </CustomPaper>
          </Grid>
        ))}
      </Grid>
    </CustomBoxFullWidth>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

/**
 * Ride-share variant of the orders list. Same tab bar / day grouping /
 * pagination shell as ProfileOrdersList, but renders the display-only RideCard
 * since ride payloads have their own key shape.
 */
const ProfileRidesList = ({
  ordersData,
  isLoadingOrder,
  onFilterTabChange,
  activeFilterTab,
  offset,
  setOffset,
}) => {
  const { t } = useTranslation();

  const allCount = ordersData?.total_size ?? 0;
  const displayRides = ordersData?.orders || [];

  const groupByDay = (rides) => {
    const groups = [];
    const map = new Map();
    (rides ?? []).forEach((ride) => {
      const day = ride?.created_at
        ? new Date(ride.created_at).toDateString()
        : "Unknown";
      if (!map.has(day)) {
        map.set(day, []);
        groups.push({ day, rides: map.get(day) });
      }
      map.get(day).push(ride);
    });
    return groups;
  };

  const formatDayLabel = (dayString) => {
    if (!dayString || dayString === "Unknown") return dayString;
    const date = new Date(dayString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return t("Today");
    if (date.toDateString() === yesterday.toDateString()) return t("Yesterday");
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const tabs = [
    {
      key: TAB_ALL,
      label: `${t("All")} (${ordersData?.all_count || allCount || 0})`,
    },
    {
      key: TAB_RUNNING,
      label: `${t("Running")} (${ordersData?.running_count || 0})`,
    },
    {
      key: TAB_HISTORY,
      label: `${t("History")} (${ordersData?.previous_count || 0})`,
    },
  ];

  return (
    <Box
      sx={{
        p: {
          xs: "16px",
          md: "24px",
          backgroundColor: { xs: "background.default", md: "background.paper" },
        },
      }}
    >
      {/* ── Tab bar ── */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: { xs: "background.default", md: "background.paper" },
          zIndex: 1,
        }}
      >
        <Stack direction="row" alignItems="center" gap="8px">
          {tabs.map((tab) => {
            const isActive = activeFilterTab === tab.key;
            return (
              <Box
                key={tab.key}
                onClick={() => onFilterTabChange(tab)}
                sx={{
                  px: "16px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  userSelect: "none",
                  borderBottom: isActive
                    ? "2px solid"
                    : "2px solid transparent",
                  borderColor: isActive ? "primary.main" : "transparent",
                  transition: "border-color 0.15s ease",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "14px", md: "18px" },
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? "primary.main" : "neutral.500",
                    lineHeight: 1.2,
                    letterSpacing: "-0.54px",
                    whiteSpace: "nowrap",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* ── Ride list ── */}
      <CustomStackFullWidth spacing={3} sx={{ pt: "16px" }}>
        {isLoadingOrder ? (
          <Shimmer />
        ) : displayRides.length === 0 ? (
          <CustomEmptyResult
            image={nodata}
            label="No Rides Found"
            width="128px"
            height="128px"
          />
        ) : (
          <Stack spacing={{ xs: "16px", md: "32px" }}>
            {groupByDay(displayRides).map(({ day, rides: dayRides }) => (
              <Stack key={day} spacing={2}>
                {/* Date divider */}
                <Stack direction="row" alignItems="center" gap="16px">
                  <Box
                    sx={{
                      flex: 1,
                      height: { xs: "2px", md: "1px" },
                      backgroundColor: {
                        xs: "background.paper",
                        md: "divider",
                      },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", md: "18px" },
                      fontWeight: 700,
                      color: "neutral.500",
                      lineHeight: 1.1,
                      letterSpacing: "-0.54px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDayLabel(day)}
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      height: { xs: "2px", md: "1px" },
                      backgroundColor: {
                        xs: "background.paper",
                        md: "divider",
                      },
                    }}
                  />
                </Stack>

                {/* Rides in this day */}
                <Stack
                  divider={
                    <Divider
                      sx={{
                        borderColor: {
                          xs: "neutral.200",
                          md: "background.secondary",
                        },
                      }}
                    />
                  }
                  spacing={0}
                >
                  {dayRides.map((ride) => (
                    <Box
                      key={ride?.id}
                      sx={{
                        py: { xs: "10px", md: "16px" },
                        px: { xs: "12px", md: 0 },
                        backgroundColor: {
                          xs: "background.default",
                          md: "background.paper",
                        },
                        borderRadius: { xs: "12px", md: 0 },
                      }}
                    >
                      <RideCard ride={ride} />
                    </Box>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}

        {ordersData?.total_size > data_limit && (
          <CustomPagination
            total_size={ordersData?.total_size}
            page_limit={data_limit}
            offset={offset}
            setOffset={setOffset}
          />
        )}
      </CustomStackFullWidth>
    </Box>
  );
};

export default ProfileRidesList;
