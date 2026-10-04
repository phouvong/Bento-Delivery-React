import { useTheme } from "@emotion/react";
import { Check } from "@mui/icons-material";
import {
  alpha,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepLabel,
  Stepper,
  styled,
  Typography,
  useMediaQuery
} from "@mui/material";
import { Stack } from "@mui/system";
import TrackOrderMap from "components/track-order/TrackOrderMap";
import moment from "moment";
import { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { useTranslation } from "react-i18next";
import "simplebar-react/dist/simplebar.min.css";
import {
  CustomStackFullWidth
} from "../../styled-components/CustomStyles.style";
import { StepperCustomBorder } from "../checkout/CheckOut.style";
import CustomImageContainer from "../CustomImageContainer";
import delivered from "../my-orders/assets/delivery.png";
import orderConfirmImage from "../my-orders/assets/order-confirmed.png";
import outForDelivery from "../my-orders/assets/out-for-delivery.png";
import shippedImage from "../my-orders/assets/shhiped.png";
const CustomStepperLabels = styled(Stepper)(({ theme }) => ({
  "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel": {
    marginTop: "-80px",
  },
  "& .MuiStepLabel-label.Mui-completed": {
    color: theme.palette.primary.main,
  },
}));

const QontoConnector = styled(StepConnector)(({ theme, isMobile }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.neutral[400],
    borderTopWidth: 2,
    borderRadius: 1,
    borderLeftWidth: isMobile === "true" && 3,
    marginTop: isMobile === "true" && "-41px",
    marginBottom: isMobile === "true" && "-41px",
    minHeight: isMobile === "true" && "100px",
  },
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.primary.main,
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: theme.palette.primary.main,
  }),
  "& .QontoStepIcon-completedIcon": {
    color: theme.palette.neutral[100],
    zIndex: 1,
    fontSize: 0,
    padding: "7px",
  },
}));
function QontoStepIcon(props) {
  const { active, completed, className, isBooking } = props;
  const theme = useTheme();
  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <StepperCustomBorder
          background={theme.palette.primary.main}
          padding="5px"
          border={`3px solid ${theme.palette.neutral[100]}`}
          boxshadow={`0px 4px 10px ${alpha(theme.palette.neutral[400], 0.3)}`}
        >
          <Check className="QontoStepIcon-completedIcon" />
        </StepperCustomBorder>
      ) : active && isBooking ? (
        <StepperCustomBorder
          background={theme.palette.primary.main}
          padding="10px"
          border={`3px solid ${theme.palette.neutral[100]}`}
          boxshadow={`0px 4px 10px ${alpha(theme.palette.neutral[400], 0.3)}`}
        >
          <div className="QontoStepIcon-circle" />
        </StepperCustomBorder>
      ) : (
        <StepperCustomBorder
          background={theme.palette.neutral[400]}
          padding="10px"
          border={`3px solid ${theme.palette.neutral[100]}`}
          boxshadow={`0px 4px 10px ${alpha(theme.palette.neutral[400], 0.3)}`}
        >
          <div className="QontoStepIcon-circle" />
        </StepperCustomBorder>
      )}
    </QontoStepIconRoot>
  );
}
const TrackOrder = ({
  configData,
  trackOrderData,
  isBooking,
  serviceBookingLog,
  serviceBookingDetails,
}) => {
  const [userLocation, setUserLocation] = useState({});
  const { t } = useTranslation();
  const [actStep, setActStep] = useState(1);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  let currentLatLng = undefined;
  if (typeof window !== "undefined") {
    currentLatLng = JSON.parse(window.localStorage.getItem("currentLatLng"));
  }
  useEffect(() => {
    setUserLocation({
      lat: trackOrderData?.delivery_address?.latitude,
      lng: trackOrderData?.delivery_address?.longitude,
    });
  }, []);
  // A sub-booking's /booking/log returns the sibling list (no `tracking`),
  // so fall back to the details endpoint's status_history to build the stages.
  const buildTrackingFromHistory = (details) => {
    const history = details?.status_history;
    if (!history || typeof history !== "object") return [];
    const currentStatus = (details?.booking_status ?? "").toLowerCase();
    return ["confirmed", "ongoing", "completed"].map((status) => ({
      status,
      reached: Boolean(history?.[status]),
      is_current: currentStatus === status,
      timestamp: history?.[status] ?? null,
    }));
  };

  const bookingTracking =
    Array.isArray(serviceBookingLog?.tracking) &&
    serviceBookingLog.tracking.length > 0
      ? serviceBookingLog.tracking
      : buildTrackingFromHistory(serviceBookingDetails);
    
  const currentTrackingIndex = bookingTracking.findIndex((step) => step?.is_current);
  const reachedStepCount = bookingTracking.filter((step) => step?.reached).length;
  const bookingActiveStep =
    currentTrackingIndex === -1
      ? reachedStepCount === 0
        ? -1
        : reachedStepCount
      : currentTrackingIndex === bookingTracking.length - 1
        ? bookingTracking.length
        : currentTrackingIndex;

  const orderSteps = [
    {
      label: "Order Confirmed",
      time: trackOrderData?.confirmed,
      img: orderConfirmImage.src,
    },
    {
      label: `Preparing ${
        trackOrderData?.module?.module_type === "food" ? "foods" : "items"
      }`,
      time: trackOrderData?.processing,
      img: shippedImage.src,
    },
    {
      label: ` ${
        trackOrderData?.module?.module_type === "food" ? "Foods" : "Items"
      } is on the way`,
      time: trackOrderData?.picked_up,
      img: outForDelivery.src,
    },
    {
      label: "Delivered",
      time: trackOrderData?.delivered,
      img: delivered.src,
    },
  ];

  const bookingStepDefaults = [
    { status: "confirmed", label: "Confirmed", img: orderConfirmImage.src },
    { status: "ongoing", label: "Ongoing", img: outForDelivery.src },
    { status: "completed", label: "Completed", img: delivered.src },
  ];

  const bookingSteps = bookingStepDefaults.map((defaultStep) => {
    const trackingStep = bookingTracking.find(
      (step) => step?.status === defaultStep.status
    );
    return {
      label: trackingStep?.label ?? defaultStep.label,
      time: trackingStep?.timestamp,
      img: defaultStep.img,
    };
  });

  const steps = isBooking ? bookingSteps : orderSteps;

  const handleStepper = () => {
    if (isBooking) {
      setActStep(bookingActiveStep);
      return;
    }
    if (trackOrderData?.order_status === "pending") {
      setActStep(1);
    } else if (trackOrderData?.order_status === "confirmed") {
      setActStep(2);
    } else if (
      trackOrderData?.order_status === "processing" ||
      trackOrderData?.order_status === "handover" || 
      trackOrderData?.order_status === "picked_up"
    ) {
      setActStep(3);
    } else if (trackOrderData?.order_status === "picked_up") {
      setActStep(3);
    } else if (
      trackOrderData?.order_status === "delivered" ||
      trackOrderData?.order_status === "returned"
    ) {
      setActStep(5);
    }
  };
  useEffect(() => {
    handleStepper();
  }, [actStep, trackOrderData, isBooking, serviceBookingLog]);
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
      isGeolocationEnabled: true,
    });
  const getCurrentLocation = () => {
    setUserLocation({ lat: coords.latitude, lng: coords.longitude });
  };

  return (
    <CustomStackFullWidth
      mt={{ xs: "20px", md: "70px" }}
      minHeight="30vh"
      alignItems={isSmall ? "center" : "initial"}
      spacing={4}
    >
      {isSmall ? (
        <Stepper
          activeStep={actStep}
          orientation="vertical"
          connector={<QontoConnector isMobile="true" />}
        >
          {steps.map((labels, index) => (
            <Step key={labels.label}>
              <StepLabel StepIconComponent={QontoStepIcon} StepIconProps={{ isBooking }}>
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  gap={{ xs: "5px", md: "10px" }}
                  marginBottom="25px"
                >
                  <CustomImageContainer
                    src={labels.img}
                    width="29px"
                    height="29px"
                    alt={labels.label}
                  />
                  {t(labels?.label)}
                  {labels?.time && (
                    <Typography mt="10px" variant="body2" textAlign="center">
                      {moment(labels?.time).format("ddd, Do MMM")}
                    </Typography>
                  )}
                </Stack>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      ) : (
        <CustomStepperLabels
          activeStep={actStep}
          alternativeLabel
          connector={<QontoConnector />}
        >
          {steps.map((labels, index) => (
            <Step key={labels}>
              <StepLabel StepIconComponent={QontoStepIcon} StepIconProps={{ isBooking }}>
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  gap={{ xs: "5px", md: "10px" }}
                >
                  <CustomImageContainer
                    src={labels.img}
                    width="29px"
                    height="29px"
                    alt={labels.label}
                  />
                  {t(labels?.label)}
                </Stack>
              </StepLabel>
              {labels?.time && (
                <Typography mt="10px" variant="body2" textAlign="center">
                  {moment(labels?.time).format("ddd, Do MMM")}
                </Typography>
              )}
            </Step>
          ))}
        </CustomStepperLabels>
      )}
      {!isBooking && (
        <TrackOrderMap
          getCurrentLocation={getCurrentLocation}
          trackOrderData={trackOrderData}
          userLocation={userLocation}
        />
      )}
    </CustomStackFullWidth>
  );
};

TrackOrder.propTypes = {};

export default TrackOrder;
