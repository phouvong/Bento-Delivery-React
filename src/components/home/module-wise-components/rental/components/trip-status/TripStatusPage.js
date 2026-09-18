import StarIcon from "@mui/icons-material/Star";
import { Button, Grid, NoSsr, Stack, styled, Typography } from "@mui/material";
import { alpha, Box } from "@mui/system";
import { ProfileApi } from "api-manage/another-formated-api/profileApi";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import CustomContainer from "components/container";
import CustomImageContainer from "components/CustomImageContainer";
import ClickToCall from "components/header/top-navbar/ClickToCall";
import RentalPaymentMethod from "components/home/module-wise-components/rental/components/trip-status/RentalPaymentMethod";
import RentalReviewModal from "components/home/module-wise-components/rental/components/trip-status/RentalReviewModal";
import RentalSuccessModal from "components/home/module-wise-components/rental/components/trip-status/RentalSuccessModal";
import useMakePayment from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/details/useMakePayment";
import CustomModal from "components/modal";
import { getGuestId, getToken } from "helper-functions/getToken";
import { t } from "i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Slider from "react-slick";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { useGetTripDetails } from "../../rental-api-manage/hooks/react-query/details/useGetTripDetails";
import { CustomRentalCard } from "../global/CustomRentalCard";
import RentalAdditionalNote from "../global/RentalAdditionalNote";
import RentalCardWrapper from "../global/RentalCardWrapper";
import RentalMap from "../global/RentalMap";
import RentalProceedtoCheckout from "../global/RentalProceedtoCheckout";
import TripStatusDetailsSkeleton from "../global/SkeletonLoaders/TripStatusDetailsSkeleton";
import RentalBillDetails from "../rental-checkout/RentalBillDetails";
import RentalCancelBooking from "./RentalCancelBooking";
import ProSavingsBanner from "components/pro-plan/ProSavingsBanner";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";
import TripDetails from "./TripDetails";
import TripStatusActivity from "./TripStatusActivity";

const StyledSlider = styled(Slider)({
  ".slick-dots": {
    top: "60px",
  },
});

const TripStatusPage = () => {
  const router = useRouter();
  const { id, from } = router.query;
  const [openModal, setOpenModal] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [usePartialPayment, setUsePartialPayment] = useState(false);
  const [switchToWallet, setSwitchToWallet] = useState(false);
  const [modalType, setModalType] = useState("cancel");
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  useEffect(() => {
    if (from === '"place_order"') {
      setOpenSuccessModal(true);
    }
  }, [from]);

  const userOnSuccessHandler = (res) => {};

  const { data: customerData } = useQuery(
    ["profile-info"],
    ProfileApi.profileInfo,
    {
      onSuccess: userOnSuccessHandler,
      onError: onSingleErrorResponse,
    }
  );

  const { mutate, isLoading } = useMakePayment();

  const {
    data: tripDetails,
    refetch: refetchData,
    isFetching,
    isLoading: isLoadingTripDetails,
  } = useGetTripDetails(id);

  useEffect(() => {
    refetchData();
  }, [id]);

  const isReviewBtnShow = tripDetails?.vehicle_identity?.some(
    (item) => !item?.rating
  );

  const trip_id = tripDetails?.id;
  const vehicle_identity = tripDetails?.vehicle_identity;

  const handlePayment = () => {
    const callBackUrl = `${window.location.origin}/rental/trip-status/${tripDetails?.id}`;

    const createPaymentObject = ({
      paymentMethod,
      gateway = null,
      isPartial = false,
    }) => ({
      trip_id: tripDetails?.id,
      payment_method: isPartial ? "partial_payment" : paymentMethod,
      payment_gateway: gateway || paymentMethod,
      callback_url: callBackUrl,
      payment_platform: "web",
      guest_id: getGuestId(),
    });

    const handleMutate = (paymentObject) =>
      mutate(paymentObject, {
        onSuccess: (response) => {
          if (response) {
            paymentObject.payment_method === "cash_payment" ||
            paymentObject.payment_method === "wallet" ||
            (paymentObject?.payment_method === "partial_payment" &&
              paymentObject?.payment_gateway === "cash_payment")
              ? refetchData()
              : router.push(response);
            setOpenPaymentModal(false);
          }
        },
        onError: onSingleErrorResponse,
      });

    // Case 1: Cash or Wallet payment without partial payment
    if (
      (paymentMethod === "cash_payment" || paymentMethod === "wallet") &&
      !usePartialPayment
    ) {
      const paymentObject = createPaymentObject({ paymentMethod });
      return handleMutate(paymentObject);
    }

    // Case 2: Digital payment without partial payment
    if (
      paymentMethod !== "partial_payment" &&
      paymentMethod !== "wallet" &&
      paymentMethod !== "cash_payment" &&
      !usePartialPayment
    ) {
      const paymentObject = createPaymentObject({
        paymentMethod: "digital_payment",
        gateway: paymentMethod,
      });
      return handleMutate(paymentObject);
    }

    // Case 3: Partial payment
    if (usePartialPayment) {
      const isCash = paymentMethod === "cash_payment";
      const paymentObject = createPaymentObject({
        paymentMethod: isCash ? "cash_payment" : "digital_payment",
        gateway: isCash ? null : paymentMethod,
        isPartial: true,
      });
      return handleMutate(paymentObject);
    }
  };

  const carts = tripDetails?.trip_details?.map((item) => ({
    ...item,
    vehicle: item?.vehicle_details,
    price: "2000",
  }));

  const tempCartList = {
    user_data: {
      rental_type: tripDetails?.trip_type,
      estimated_hours: tripDetails?.estimated_hours,
      distance: tripDetails?.distance,
    },
    carts: carts,
  };

  const tripDetailsTotalPrice = () => {
    if (!tripDetails?.trip_details?.length) return 0;
    const total = tripDetails.trip_details.reduce((sum, trip) => {
      const price = trip?.calculated_price || 0;
      return sum + price;
    }, 0);

    return total;
  };

  const tripCost = tripDetailsTotalPrice();
  const subTotal =
    tripCost -
    tripDetails?.discount_on_trip -
    tripDetails?.coupon_discount_amount;

  const handleClick = () => {
    router.push({
      pathname: "/profile",
      query: {
        page: "inbox",
        type: "vendor",
        id: tripDetails?.provider?.id,
        routeName: "vendor_id",
        chatFrom: "true",
        deliveryman_name: tripDetails?.provider?.name,
        deliveryManData_image: tripDetails?.provider?.logo_full_url,
      },
    });
  };

  const handleCloseSuccessModal = () => {
    const { from, ...remainingQueries } = router.query;
    // Construct the new URL without the "from" query parameter
    router.push(
      {
        pathname: router.pathname,
        query: remainingQueries, // Pass only the remaining query parameters
      },
      undefined,
      { shallow: true }
    );
    setOpenSuccessModal(false);
  };

  const buttonContent = (tripStatus) => {
    if (tripDetails?.payment_status === "paid" && tripStatus === "completed") {
      return (
        <Stack direction="row" spacing={2} width="100%">
          {isReviewBtnShow &&
            getToken() &&
            tripDetails?.provider?.reviews_section && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenReviewModal(true)}
                sx={{ width: "100%" }}
              >
                {t("Give Review")}
              </Button>
            )}
        </Stack>
      );
    }

    switch (tripStatus) {
      case "pending":
        return (
          <RentalProceedtoCheckout
            rentalUserData={{
              total_cart_price: tripDetails?.trip_amount,
            }}
            textKey="trip-status"
            onClick={() => {
              setOpenCancelModal(true);
            }}
            hover={{
              background: (theme) => alpha(theme.palette.neutral[400], 0.5),
            }}
            border={(theme) => `1px solid ${theme.palette.neutral[200]}`}
            backgroundColor={(theme) => alpha(theme.palette.neutral[200], 0.5)}
            color={(theme) => theme.palette.error.main}
            text="Cancel"
          />
        );
      case "completed":
      case "payment_failed":
      case "failed":
        return (
          <RentalProceedtoCheckout
            rentalUserData={{
              total_cart_price: tripDetails?.trip_amount,
            }}
            textKey="trip-status"
            onClick={() => {
              setOpenPaymentModal(true);
            }}
            hover={{
              background: (theme) => alpha(theme.palette.primary.dark, 0.9),
            }}
            border={(theme) => `1px solid ${theme.palette.neutral[200]}`}
            backgroundColor={(theme) => theme.palette.primary.main}
            color={(theme) => theme.palette.neutral[100]}
            text="Make Payment"
          />
        );

      default:
        return null;
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const activityStatus =
    tripDetails?.trip_status === "failed" ||
    tripDetails?.trip_status === "payment_failed" ||
    tripDetails?.payment_status === "failed" ||
    tripDetails?.payment_status === "payment_failed"
      ? "payment_failed"
      : tripDetails?.trip_status || tripDetails?.payment_status;

  return (
    <NoSsr>
      <CustomContainer>
        {isLoadingTripDetails ? (
          <TripStatusDetailsSkeleton />
        ) : (
          <CustomStackFullWidth
            sx={{
              mt: {
                xs: "20px",
                md: "40px",
              },
            }}
          >
            {tripDetails && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TripStatusActivity
                    status={activityStatus}
                    tripDetails={tripDetails}
                  />
                  <RentalCardWrapper>
                    {tripDetails?.trip_details?.map((item, index) => (
                      <CustomRentalCard.root
                        key={index}
                        showPrice={false}
                        sx={{
                          background: (theme) =>
                            alpha(theme.palette.neutral[200], 0.2),
                          p: "20px",
                          justifyContent: "start",
                          gap: "20px",
                          flexWrap: "wrap",
                          "&:not(:last-child)": {
                            mb: "20px",
                          },
                        }}
                      >
                        <CustomImageContainer
                          src={item?.vehicle_details?.thumbnail_full_url}
                          width={{
                            xs: "100%",
                            sm: "189px",
                            lg: "160px",
                          }}
                          height={{
                            xs: "120px",
                            md: "80px",
                          }}
                          sx={{
                            border: (theme) =>
                              `1px solid ${alpha(
                                theme.palette.neutral[400],
                                0.4
                              )} !important`,
                            borderRadius: "5px",
                          }}
                        />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flex: 1,
                            flexWrap: "wrap",
                            gap: "5px",
                          }}
                        >
                          <CustomRentalCard.details
                            item={{
                              ...item,
                              vehicle: item?.vehicle_details,
                              provider: tripDetails?.provider,
                            }}
                            showIcons={false}
                            showPrice={false}
                          />
                          {item?.license_plate_number?.length > 0 && (
                            <CustomRentalCard.licenseNumber
                              sx={{
                                borderLeft:
                                  item?.license_plate_number?.length < 3
                                    ? (theme) =>
                                        `1px solid ${theme.palette.neutral[200]}`
                                    : "none",

                                pl:
                                  item?.license_plate_number?.length < 3
                                    ? "20px"
                                    : "0px",
                              }}
                              licensesNumber={item?.license_plate_number}
                            />
                          )}
                        </Box>
                      </CustomRentalCard.root>
                    ))}
                  </RentalCardWrapper>
                  <Stack
                    sx={{ mt: "20px" }}
                    direction={{ xs: "column", sm: "row" }}
                    gap="1rem"
                  >
                    <RentalCardWrapper>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "20px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "center",
                            gap: tripDetails?.vehicle_identity[0]?.driver_data
                              ? "10px"
                              : "20px",
                            flexWrap: {
                              xs: "nowrap",
                              md: "wrap",
                            },
                          }}
                        >
                          <CustomImageContainer
                            src={tripDetails?.provider?.logo_full_url}
                            width="80px"
                            height="80px"
                            borderRadius="5px"
                          />
                          <Box>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontWeight: "500",
                                display: "flex",
                                justifyContent: "start",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <StarIcon
                                sx={{
                                  fontSize: "18px",
                                  color: (theme) => theme.palette.warning.main,
                                }}
                              />{" "}
                              {tripDetails?.provider?.avg_rating}{" "}
                              <Typography
                                component="span"
                                sx={{
                                  fontSize: "12px",
                                  fontWeight: "400",
                                  color: (theme) => theme.palette.neutral[400],
                                }}
                              >
                                ({tripDetails?.provider?.rating_count})
                              </Typography>
                            </Typography>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.5}
                            >
                              <Typography
                                sx={{
                                  fontSize: { xs: "14px", md: "16px" },
                                  fontWeight: {
                                    xs: "500",
                                    md: "700",
                                  },
                                }}
                              >
                                {tripDetails?.provider?.name}
                              </Typography>
                              <VerifiedStoreBadge
                                verified={
                                  tripDetails?.provider?.verified_seller
                                }
                                fontSize="16px"
                              />
                            </Stack>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontWeight: "400",
                              }}
                            >
                              {tripDetails?.provider?.total_vehicles}{" "}
                              {t("Vehicles")}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "10px",
                            ml: "auto",
                            justifyContent: "end",
                            alignItems: "end",
                          }}
                        >
                          <ClickToCall phone={tripDetails?.provider?.phone}>
                            <Box sx={{ cursor: "pointer" }}>
                              <CustomImageContainer
                                src="/static/rental/callIcon.png"
                                width={"26px"}
                                height={"26px"}
                              />
                            </Box>
                          </ClickToCall>

                          {getToken() && tripDetails?.provider?.chat ? (
                            <Box
                              sx={{ cursor: "pointer" }}
                              onClick={handleClick}
                            >
                              <CustomImageContainer
                                src="/static/rental/smsIcon.png"
                                width={"26px"}
                                height={"26px"}
                              />
                            </Box>
                          ) : null}
                        </Box>
                      </Box>
                    </RentalCardWrapper>

                    {tripDetails?.vehicle_identity?.length > 0 ? (
                      <RentalCardWrapper>
                        <Stack maxWidth="366px">
                          <StyledSlider {...settings}>
                            {tripDetails?.vehicle_identity?.map(
                              (item) =>
                                item?.driver_data && (
                                  <Box
                                    key={item?.id}
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      flexWrap: "wrap",
                                      gap: "20px",
                                      position: "relative",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "start",
                                        alignItems: "center",
                                        gap: "20px",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <CustomImageContainer
                                        src={item?.driver_data?.image_full_url}
                                        width="80px"
                                        height="80px"
                                        borderRadius="50%"
                                      />
                                      <Box>
                                        <Typography
                                          sx={{
                                            fontSize: "16px",
                                            fontWeight: "400",
                                          }}
                                        >
                                          {t("Driver")}
                                        </Typography>

                                        <Typography
                                          sx={{
                                            fontSize: "16px",
                                            fontWeight: "700",
                                          }}
                                        >
                                          {`${item?.driver_data?.first_name} ${item?.driver_data?.last_name}`}
                                        </Typography>
                                      </Box>
                                    </Box>

                                    <Box
                                      sx={{
                                        position: "absolute",
                                        right: { xs: "5px", sm: "5px" },
                                        top: "20px",
                                      }}
                                    >
                                      <ClickToCall phone={item?.phone}>
                                        <Box sx={{ cursor: "pointer" }}>
                                          <CustomImageContainer
                                            src="/static/rental/callIcon.png"
                                            width={"26px"}
                                            height={"26px"}
                                          />
                                        </Box>
                                      </ClickToCall>
                                    </Box>
                                  </Box>
                                )
                            )}
                          </StyledSlider>
                        </Stack>
                      </RentalCardWrapper>
                    ) : (
                      <Typography sx={{ fontSize: "16px", fontWeight: "400" }}>
                        {t(
                          "Driver information is not available for this trip."
                        )}
                      </Typography>
                    )}
                  </Stack>
                  <TripDetails
                    tripDetails={tripDetails}
                    setModalType={setModalType}
                    setOpenModal={setOpenModal}
                  />
                  {tripDetails?.trip_note && (
                    <RentalAdditionalNote
                      text={tripDetails?.trip_note}
                      isShowTextArea={false}
                    />
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      minHeight: {
                        xs: "100%",
                        md: "139vh",
                      },
                    }}
                  >
                    <RentalCardWrapper sx={{ position: "sticky", top: "80px" }}>
                      <RentalBillDetails
                        totalPrice={tripDetails?.trip_amount}
                        billDetails={tripDetails}
                        tripCost={tripCost}
                        tripDiscount={tripDetails?.discount_on_trip}
                        subTotal={subTotal}
                        vatTax={{
                          tax_amount: tripDetails?.tax_amount,
                          tax_included:
                            tripDetails?.tax_status === "excluded" ? 0 : 1,
                        }}
                        vatPer={tripDetails?.tax_percentage}
                        additionalCharge={tripDetails?.additional_charge}
                        rentalCoupon={tripDetails?.coupon_discount_amount}
                        proOrderDiscountActive={
                          tripDetails?.benefit_type !== "coupon" &&
                          Number(tripDetails?.pro_discount) > 0
                        }
                        proOrderDiscountAmount={Number(
                          tripDetails?.pro_discount || 0
                        )}
                        proOrderDiscountPct={0}
                        proOrderDiscountMax={0}
                        proSavingsBanner={(() => {
                          // Coupon benefit: savings live in `coupon_discount_amount`.
                          if (
                            tripDetails?.benefit_type === "coupon" &&
                            Number(tripDetails?.coupon_discount_amount) > 0
                          ) {
                            return (
                              <ProSavingsBanner
                                amount={Number(
                                  tripDetails?.coupon_discount_amount
                                )}
                              />
                            );
                          }
                          // Discount / delivery_fee benefit: savings live in `pro_discount`.
                          if (Number(tripDetails?.pro_discount) > 0) {
                            return (
                              <ProSavingsBanner
                                amount={Number(tripDetails?.pro_discount)}
                              />
                            );
                          }
                          return null;
                        })()}
                      />
                      {buttonContent(activityStatus)}
                    </RentalCardWrapper>
                  </Box>
                </Grid>
              </Grid>
            )}
          </CustomStackFullWidth>
        )}
      </CustomContainer>

      <CustomModal
        openModal={openModal}
        handleClose={() => setOpenModal(false)}
      >
        <Box sx={{ width: { xs: "300px", md: "700px", padding: ".8rem" } }}>
          <RentalMap
            location={{
              latitude: tripDetails?.destination_location?.latitude,
              longitude: tripDetails?.destination_location?.longitude,
            }}
            height="400px"
            locations={{
              destination: tripDetails?.destination_location,
              pickup: tripDetails?.pickup_location,
            }}
          />
        </Box>
      </CustomModal>

      <CustomModal
        openModal={openCancelModal}
        handleClose={() => setOpenCancelModal(false)}
      >
        <RentalCancelBooking
          tripDetails={tripDetails}
          refetchData={refetchData}
          handleClose={() => setOpenCancelModal(false)}
        />
      </CustomModal>

      <CustomModal
        openModal={openPaymentModal}
        handleClose={() => setOpenPaymentModal(false)}
      >
        <RentalPaymentMethod
          tripDetails={tripDetails}
          refetchData={refetchData}
          handleClose={() => setOpenPaymentModal(false)}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          setUsePartialPayment={setUsePartialPayment}
          setSwitchToWallet={setSwitchToWallet}
          customerData={customerData}
          payableAmount={tripDetails?.trip_amount}
          usePartialPayment={usePartialPayment}
          switchToWallet={switchToWallet}
          handlePayment={handlePayment}
          isLoading={isLoading}
          tripCost={tripCost}
        />
      </CustomModal>

      <CustomModal
        openModal={openReviewModal}
        handleClose={() => setOpenReviewModal(false)}
      >
        <RentalReviewModal
          handleClose={() => setOpenReviewModal(false)}
          trip_id={trip_id}
          vehicle_identity={vehicle_identity}
          refetchTripDetails={refetchData}
        />
      </CustomModal>

      <CustomModal
        openModal={openSuccessModal}
        handleClose={handleCloseSuccessModal}
      >
        <RentalSuccessModal
          tripDetails={tripDetails}
          handleCloseSuccessModal={handleCloseSuccessModal}
        />
      </CustomModal>
    </NoSsr>
  );
};

export default TripStatusPage;
