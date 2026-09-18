import React from "react";
import { formatNumber } from "helper-functions/CardHelpers";
import RentalCardWrapper from "../global/RentalCardWrapper";
import { Box, Grid, Stack, Typography } from "@mui/material";
import H3 from "components/typographies/H3";
import CardDetailsSingleCard from "../global/CardDetailsSingleCard";
import NearMeIcon from "@mui/icons-material/NearMe";
import RoomIcon from "@mui/icons-material/Room";
import { t } from "i18next";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { isCurrentTime } from "../rental-checkout/checkoutHeplerFunction";
import { useSelector } from "react-redux";
import { FormatedDateWithTime } from "utils/CustomFunctions";
import moment from "moment";

const TripDetails = ({ tripDetails, setModalType, setOpenModal,checkOut,setOpenTripChange,setOpenModalCheckout }) => {
  const { cartList } = useSelector((state) => state.cart);
  return (
    <Box sx={{ mt: 3 }}>
      <RentalCardWrapper>
        <Stack
          direction="row"
          justifyContent="space-between"

        >
          <Typography fontWeight="600" fontSize="1rem">
            {t("Trip Details")}
          </Typography>

          { checkOut && <BorderColorOutlinedIcon
            onClick={() => setOpenModalCheckout?.(true)}
            sx={{
              fontSize: "16px",
              cursor: "pointer",
              color: (theme) => theme.palette.main,
            }}
          />}
        </Stack>

        {/* Trip Information Section */}
        <Box
          sx={{
            borderRadius: 2,
            mt: 3,
            mb: 2,
            border: (theme) => `1px solid ${theme.palette.neutral[200]}`,
          }}
        >
          <CardDetailsSingleCard
            sx={{ justifyContent: "space-between" }}
            isShowEdit={false}
            icon={
              <RoomIcon
                sx={{
                  fontSize: 16,
                  color: (theme) => theme.palette.neutral[400],
                }}
              />
            }
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                {tripDetails?.pickup_location?.location_name}
              </Typography>
            </Box>
            {!checkOut && <Typography
              onClick={() => {
                setModalType("map");
                setOpenModal(true);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: { xs: "12px", md: "16px" },
                color: (theme) => theme.palette.info.main,
                textDecoration: "underline",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {t("Map View")}{" "}
              <RoomIcon
                sx={{
                  color: (theme) => theme.palette.primary.main,
                  ml: 0.5,
                }}
              />
            </Typography>}
          </CardDetailsSingleCard>

          <CardDetailsSingleCard
            isShowEdit={false}
            icon={
              <NearMeIcon
                sx={{
                  fontSize: 16,
                  color: (theme) => theme.palette.neutral[400],
                }}
              />
            }
            sx={{ position: "relative" }}
          >
            <Box
              sx={{
                width: "1px",
                borderLeft: (theme) =>
                  `1px dashed ${theme.palette.neutral[400]}`,
                height: "50%",
                position: "absolute",
                top: "-15px",
                left: {
                  xs:"11%",
                  md:"4%"
                },
              }}
            ></Box>
            <Box
              sx={{
                display: "flex",
                gap: 0.5,
              }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: 14,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {tripDetails?.destination_location?.location_name}
                </Typography>
              </Typography>
            </Box>
          </CardDetailsSingleCard>
        </Box>

        {/* Time Details Section */}
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <CardDetailsSingleCard
              sx={{
                borderRadius: 2,
                justifyContent: "space-between",
                border: (theme) => `1px solid ${theme.palette.neutral[200]}`,
              }}
              isShowEdit={false}
              icon={
                <RoomIcon
                  sx={{
                    fontSize: 16,
                    color: (theme) => theme.palette.neutral[400],
                  }}
                />
              }
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                  {isCurrentTime(cartList)
                    ? t("Schedule at")
                    : !checkOut?t("Pickup Time"):t("Pickup Now")}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 400,
                    fontSize: 14,
                    color: (theme) => theme.palette.neutral[400],
                  }}
                >
                  {checkOut
                    ? (isCurrentTime(cartList)
                      ? FormatedDateWithTime(cartList?.user_data?.pickup_time)
                      : FormatedDateWithTime(new Date()))
                    : moment(
                      tripDetails?.schedule_at,
                      "YYYY-MM-DD HH:mm:ss"
                    ).format("DD MMM, YYYY, hh:mm a")}

                </Typography>
              </Box>
            </CardDetailsSingleCard>
          </Grid>

          <Grid item xs={12} lg={6}>
            <CardDetailsSingleCard
              sx={{
                borderRadius: 2,
                justifyContent: "space-between",
                border: (theme) => `1px solid ${theme.palette.neutral[200]}`,
              }}
              isShowEdit={false}
              icon={
                <HourglassEmptyOutlinedIcon
                  sx={{
                    fontSize: 16,
                    color: (theme) => theme.palette.neutral[400],
                  }}
                />
              }
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: 14,
                    textTransform: "capitalize",
                  }}
                >
                  {tripDetails?.trip_type?.replace("_", " ")}
                </Typography>
                {tripDetails?.estimated_hours > 0 && tripDetails?.trip_type === "hourly" && (
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 400,
                      fontSize: 14,
                      color: (theme) => theme.palette.neutral[400],
                    }}
                  >
                    {t("Estimated")} {formatNumber(tripDetails?.estimated_hours)} hr
                  </Typography>
                )}
                {tripDetails?.estimated_hours > 0 && tripDetails?.trip_type === "day_wise" && (
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 400,
                      fontSize: 14,
                      color: (theme) => theme.palette.neutral[400],
                    }}
                  >
                    {t("Estimated")} {formatNumber(tripDetails?.estimated_hours / 24)} days
                  </Typography>
                )}

                {tripDetails?.trip_type === "distance_wise" &&
                  tripDetails?.distance > 0 && (
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 400,
                        fontSize: 14,
                        color: (theme) => theme.palette.neutral[400],
                      }}
                    >
                      {formatNumber(tripDetails?.distance)} Km
                    </Typography>
                  )}
              </Box>
            </CardDetailsSingleCard>
          </Grid>
        </Grid>
      </RentalCardWrapper>
    </Box>
  );
};

export default TripDetails;
