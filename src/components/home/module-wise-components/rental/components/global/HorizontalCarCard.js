import React, { use } from "react";
import { useRouter } from "next/router";
import { CustomCarCard } from "../Rental.style";
import { alpha, Box } from "@mui/system";
import CustomImageContainer from "components/CustomImageContainer";
import { Stack, Tooltip, Typography, useTheme } from "@mui/material";
import RentWithIncrementDecrement from "./RentWithIncrementDecrement";
import H3 from "components/typographies/H3";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import StarIcon from "@mui/icons-material/Star";
import QuickView from "components/cards/QuickView";
import { CustomOverLay } from "components/cards/Card.style";

import InfoIcon from "@mui/icons-material/Info";
import { t } from "i18next";
import GroupIcon from "@mui/icons-material/Group";
import AirIcon from "@mui/icons-material/Air";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import EvStationIcon from "@mui/icons-material/EvStation";
import {
  getAmountWithSign,
  getDiscountAmount,
  getDiscountedAmount,
} from "helper-functions/CardHelpers";
import { mainPrice } from "components/home/module-wise-components/rental/components/utils/bookingHepler";
import { useSelector } from "react-redux";
import { handleBadgeRental } from "./CarCard";
import CustomBadge from "components/cards/CustomBadge";

const HorizontalCarCard = ({
  setCarDetails,
  addToCartHandler,
  variations,
  isProductExist,
  count,
  handleIncrement,
  itemId,
  handleDecrement,
  updateLoading,
  removeItemCart,
  fromSearch,

  addToWishlistHandler,
  removeFromWishlistHandler,
  isWishlisted,
  data,
  setOpenModal,
  hideRentButton = false,
}) => {
  const router = useRouter();

  const handleClick = () =>
    router.push({
      pathname: `/rental/vehicle/${data?.slug || data?.id}`,
      query: {
        from: router?.query?.from,
        module: router?.query?.module || router?.query?.module_id,
      },
    });

  return (
    <CustomCarCard
      onClick={handleClick}
      sx={{
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: { xs: "column", md: "row" },
        cursor: "pointer",
      }}
    >
      <InformationSection
        setCarDetails={setCarDetails}
        data={data}
        setOpenModal={setOpenModal}
        addToWishlistHandler={addToWishlistHandler}
        removeFromWishlistHandler={removeFromWishlistHandler}
        isWishlisted={isWishlisted}
      />
      <PriceSection
        data={data}
        addToCartHandler={addToCartHandler}
        variations={variations}
        isProductExist={isProductExist}
        count={count}
        handleIncrement={handleIncrement}
        itemId={itemId}
        handleDecrement={handleDecrement}
        updateLoading={updateLoading}
        removeItemCart={removeItemCart}
        fromSearch={fromSearch}
        hideRentButton={hideRentButton}
      />
    </CustomCarCard>
  );
};

export default HorizontalCarCard;

const InformationSection = ({
  setCarDetails,
  data,
  setOpenModal,
  addToWishlistHandler,
  removeFromWishlistHandler,
  isWishlisted,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "start",
        flexDirection: { xs: "column", md: "row" },
        gap: "20px",
        padding: "20px",
      }}
    >
      <Box sx={{ position: "relative", borderRadius: "10px" }}>
        {handleBadgeRental(data)}
        {data?.new_tag === 1 ? (
          <CustomBadge
            top={30}
            bg_color={theme.palette.error.light}
            text={t("New Arrival")}
            fontSize="12px"
          />
        ) : null}
        <Box>
          <CustomImageContainer
            src={data?.thumbnail_full_url || ""}
            width={{ xs: "100%", sm: "100%", md: "270px" }}
            height={{
              xs: "100%",
              sm: "220px",
              md: "135px",
            }}
            sx={{
              border: (theme) =>
                `1px solid ${alpha(
                  theme.palette.neutral[400],
                  0.4
                )} !important`,
              borderRadius: "10px !important",
              "& img": {
                borderRadius: "10px !important",
              },
            }}
          />

          <Box
            sx={{
              position: "absolute",
              right: "0.625rem",
              bottom: "15px",
              backgroundColor: theme.palette.background.paper,
              borderRadius: "50rem",
              display: "flex",
              alignItems: "center",
              zIndex: 0,
              svg: {
                color: theme.palette.info.main,
              },
            }}
          >
            <Typography
              variant="body2"
              component="div"
              className="infoText"
              sx={{ pt: "2px" }}
            >
              <Typography
                sx={{ mx: "3px" }}
                variant="body2"
                fontWeight="bold"
                component="strong"
              >
                {data?.total_vehicle_count}
              </Typography>
              {t(`Vehicles available`)}
            </Typography>
            <InfoIcon />
          </Box>
        </Box>
      </Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {data?.total_reviews > 0 ? (
            <Box
              sx={{
                justifyContent: "center",

                display: "flex",
                alignItems: "center",
                borderRadius: "5px",
                background: (theme) => alpha(theme.palette.primary.main, 0.2),
                gap: "4px",
                py: "2px",
                px: "10px",
              }}
            >
              <StarIcon
                sx={{
                  fontSize: "16px",
                  color: (theme) => theme.palette.primary.main,
                }}
              />
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: (theme) => theme.palette.primary.main,
                }}
              >
                {data?.avg_rating}
              </Typography>
            </Box>
          ) : null}
          {data?.total_reviews > 0 ? (
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: "normal",
                color: (theme) => theme.palette.neutral[400],
              }}
            >
              {data?.total_reviews} {t("Reviews")}
            </Typography>
          ) : null}
        </Box>

        <Box sx={{ mt: "20px" }}>
          <H3 text={data?.name} />
          <Typography
            sx={{
              mt: "6px",
              fontSize: "12px",
              fontWeight: "normal",
              color: (theme) => theme.palette.neutral[400],
            }}
          >
            {data?.provider?.name}
          </Typography>

          <Box
            sx={{
              color: theme.palette.neutral[400],
              minHeight: 40,
              display: "flex",
              flexWrap: "wrap",

              columnGap: "10px",
              mt: "15px",
              svg: {
                fontSize: "16px",
                marginBottom: "2px",
              },
            }}
          >
            {data?.seating_capacity && (
              <Stack direction="row" spacing={1} alignItems="center">
                <GroupIcon />
                <Typography
                  sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }}
                  variant="body2"
                  component="div"
                >
                  {data?.seating_capacity} {t("Seats")}
                </Typography>
              </Stack>
            )}
            {data?.type && (
              <Stack direction="row" spacing={1} alignItems="center">
                <DirectionsCarFilledIcon />
                <Typography
                  sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }}
                  variant="body2"
                  component="div"
                  mt={1}
                >
                  {data?.type?.replace("_", " ")}
                </Typography>
              </Stack>
            )}
            {data?.air_condition > 0 && (
              <Stack direction="row" spacing={1} alignItems="center">
                <AirIcon />
                <Typography
                  sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }}
                  variant="body2"
                  component="div"
                  mt={1}
                >
                  AC
                </Typography>
              </Stack>
            )}

            {data?.transmission_type && (
              <Stack direction="row" spacing={1} alignItems="center">
                <ManageHistoryIcon />
                <Typography
                  sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }}
                  variant="body2"
                  component="div"
                  mt={1}
                >
                  {data?.transmission_type?.replace("_", " ")}
                </Typography>
              </Stack>
            )}

            {data?.fuel_type && (
              <Stack direction="row" spacing={1} alignItems="center">
                <EvStationIcon />
                <Typography
                  sx={{ whiteSpace: "nowrap", textTransform: "capitalize" }}
                  variant="body2"
                  component="div"
                  mt={1}
                >
                  {data?.fuel_type?.replace("_", " ")}
                </Typography>
              </Stack>
            )}

            {/* <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >
                    <DiscFullIcon />
                    <Typography
                        variant="body2"
                        component="div"
                        mt={1}
                    >
                        Disc Brake Single ABS
                    </Typography>
                </Stack> */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
const PriceSection = ({
  addToCartHandler,
  variations,
  isProductExist,
  count,
  handleIncrement,
  itemId,
  handleDecrement,
  updateLoading,
  removeItemCart,
  fromSearch,
  hideRentButton = false,

  data,
}) => {
  const rentalSearch = useSelector(
    (state) => state?.rentalSearch?.rentalSearch
  );
  return (
    <Box
      sx={{
        background: (theme) => alpha(theme.palette.neutral[200], 0.2),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: { xs: "100%", sm: "100%", md: "auto" },
        px: { xs: "10px", md: "30px", lg: "76px" },
        pt: 2,
        pb: { xs: "10px", sm: 2, md: "20px" },
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Stack direction="row" alignItems="baseline" gap={1}>
        <Typography
          variant="body2"
          component="div"
          sx={{
            color: (theme) => theme.palette.neutral[400],
            textDecoration: "line-through",
          }}
        >
          {getAmountWithSign(mainPrice(data, rentalSearch?.tripType))}
        </Typography>
        <Typography variant="h6" component="div">
          {getAmountWithSign(
            getDiscountedAmount(
              mainPrice(data, rentalSearch?.tripType),
              data?.discount_price,
              data?.discount_type,
              data?.provider?.discount?.discount
            )
          )}
        </Typography>
      </Stack>
      {!hideRentButton && (
        <RentWithIncrementDecrement
          addToCartHandler={addToCartHandler}
          variations={variations}
          isProductExist={isProductExist}
          count={count}
          handleIncrement={handleIncrement}
          itemId={itemId}
          handleDecrement={handleDecrement}
          updateLoading={updateLoading}
          removeItemCart={removeItemCart}
          fromSearch={fromSearch}
          borderRadius="5px"
          paddingLeft="43px"
          paddingRight="43px"
          paddingBottom="9px"
          paddingTop="9px"
        />
      )}
    </Box>
  );
};
