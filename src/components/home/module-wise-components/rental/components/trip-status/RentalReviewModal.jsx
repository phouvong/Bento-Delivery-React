import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useTranslation } from "react-i18next";
import { Clear } from "@mui/icons-material";
import Slider from "react-slick";
import RentalReviewItem from "components/home/module-wise-components/rental/components/trip-status/RentalReviewItem";

const StyledSlider = styled(Slider)(({ theme }) => ({
  ".slick-dots": {
    top: "auto",
    bottom: "-24px !important",
    "& li": {
      margin: 0,
      width: "14px",
      "&.slick-active button:before": {
        color: theme.palette.primary.main,
      },
    },
  },
}));

const RentalReviewModal = ({
  handleClose,
  refetchTripDetails,
  trip_id,
  vehicle_identity,
}) => {
  const [vehicleIdentity, setVehicleIdentity] = useState(vehicle_identity);
  const [vehicleIdentityId, setVehicleIdentityId] = useState(null);
  const [vehicleId, setVehicleId] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const activeFormRef = useRef(null);
  const sliderRef = useRef(null);
  const theme = useTheme();
  const { t } = useTranslation();
  useEffect(() => {
    setVehicleIdentity(vehicle_identity?.filter((item) => !item?.rating));
  }, [vehicle_identity]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    onInit: () => {
      setVehicleIdentityId(vehicleIdentity[0]?.vehicle_identity_id);
      activeFormRef.current = document.querySelectorAll("form")[0];
    },
    beforeChange: (current, next) => {
      activeFormRef.current = document.querySelectorAll("form")[next];
      setVehicleIdentityId(vehicleIdentity[next].vehicle_identity_id);
      setVehicleId(vehicleIdentity[next].vehicle_id);
      setCurrentSlide(next);
    },
    afterChange: (current) => {
      activeFormRef.current = document.querySelectorAll("form")[current];
    },
  };

  const handleSubmitClick = async () => {
    if (activeFormRef.current) {
      const index = Array.from(document.querySelectorAll("form")).indexOf(
        activeFormRef.current
      );
      await setVehicleIdentityId(vehicleIdentity[index].vehicle_identity_id);
      await setVehicleId(vehicleIdentity[index].vehicle_id);

      activeFormRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const handleSkipClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <Box
      sx={{
        width: "462px",
        maxWidth: "100%",
        p: 3,
        position: "relative",
        mx: "auto",
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: theme.shadows[3],
      }}
    >
      {/* Close Icon */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: theme.palette.text.primary,
        }}
      >
        <Clear sx={{ height: "16px" }} />
      </IconButton>

      <Stack mt={3}>
        <Stack alignItems="center" textAlign="center">
          <Typography variant="h6" mb={1}>
            {t("How was your Trip")}?
          </Typography>
          <Typography variant="body2">
            {t("Give us your valuable review")}
          </Typography>
        </Stack>

        <StyledSlider ref={sliderRef} {...settings}>
          {vehicleIdentity?.map((item) => (
            <RentalReviewItem
              key={item.id}
              trip_id={trip_id}
              item={item}
              vehicleIdentityId={vehicleIdentityId}
              currentSlide={currentSlide}
              vehicleIdentity={vehicleIdentity}
              handleClose={handleClose}
              vehicleId={vehicleId}
              refetchTripDetails={refetchTripDetails}
            />
          ))}
        </StyledSlider>
      </Stack>

      <Stack mt={5} direction="row" spacing={2} width="100%">
        <Button
          variant="outlined"
          color={
            currentSlide === vehicleIdentity.length - 1 ? "error" : "primary"
          }
          onClick={
            currentSlide === vehicleIdentity.length - 1
              ? handleClose
              : handleSkipClick
          }
          sx={{ width: "100%" }}
        >
          {currentSlide === vehicleIdentity.length - 1
            ? t("Cancel")
            : t("Skip for Now")}
        </Button>
        <Button
          type="button"
          sx={{ width: "100%" }}
          variant="contained"
          color="primary"
          onClick={
            vehicleIdentity[currentSlide]?.rating
              ? handleSkipClick
              : handleSubmitClick
          }
        >
          {vehicleIdentity[currentSlide]?.rating
            ? t("Next")
            : currentSlide === vehicleIdentity.length - 1
            ? t("Submit")
            : t("Submit & Next")}
        </Button>
      </Stack>
    </Box>
  );
};

export default RentalReviewModal;
