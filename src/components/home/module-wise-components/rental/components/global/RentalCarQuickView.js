import {
  alpha,
  Box,
  Button,
  Grid,
  Radio,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import Slider from "react-slick";
import H2 from "components/typographies/H2";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import RentalCardWrapper from "./RentalCardWrapper";
import GroupIcon from "@mui/icons-material/Group";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import AirIcon from "@mui/icons-material/Air";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import EvStationIcon from "@mui/icons-material/EvStation";
import DiscFullIcon from "@mui/icons-material/DiscFull";
import { t } from "i18next";
import CustomImageContainer from "components/CustomImageContainer";
import { minHeight, textAlign } from "@mui/system";
import RentWithIncrementDecrement from "./RentWithIncrementDecrement";
import {
  cardDiscount,
  cardTotalPrice,
} from "components/home/module-wise-components/rental/components/utils/bookingHepler";
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "helper-functions/CardHelpers";
import React, { useEffect, useState } from "react";
import { useAddWishlist } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useAddWishlist";
import { useRemoveRentalWishList } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useRemoveWishlist";
import { getToken } from "helper-functions/getToken";
import {
  addWishListProvider,
  addWishListVehicle,
  removeWishListProvider,
  removeWishListVehicle,
} from "redux/slices/wishList";
import { toast } from "react-hot-toast";
import { not_logged_in_message } from "utils/toasterMessages";
import { IconButtonStyled, PrimaryToolTip } from "components/cards/QuickView";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useDispatch, useSelector } from "react-redux";
import { handleBadgeRental } from "components/home/module-wise-components/rental/components/global/CarCard";
import CustomBadge from "components/cards/CustomBadge";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VehicleDetailsRentThisCar from "../vehicle-details/VehicleDetailsRentThisCar";

const RentalCarQuickView = ({
  carDetails,
  addToCartHandler,
  isProductExist,
  userData,
  handleRentalTripType,
  from,
  handleClose,
  setIsSameOpen,
  setOpenTripChange,
  updateCartObject,
  setIds,
  setUpdateCartObject,
  openCarBookingModal,
  handleIncrementFromCard,
  handleDecrementFromCard,
  fromSearch
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [tripType, setTripType] = useState(null);
  const [typeWisePrice, setTypeWisePrice] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { wishLists } = useSelector((state) => state?.wishList);
  const rentalSearch = useSelector((state) => state?.rentalSearch?.rentalSearch);

  const formattedText = carDetails?.description
    ?.replace(/\r\n\r\n/g, "<br /><br />")
    ?.replace(/(\d+\.)/g, '<br />$1');

  const { mutate: addFavoriteMutation } = useAddWishlist();
  const { mutate: removeFavoriteMutation } = useRemoveRentalWishList();

  const checkIsWishListed = () => {
    return wishLists?.vehicles?.find(
      (wishItem) => wishItem.id === carDetails?.id
    );
  };

  useEffect(() => {
    if (isProductExist) {
      const rentalType = userData?.rental_type;
      if (rentalType === "hourly") {
        setTypeWisePrice(carDetails?.hourly_price);
      } else if (rentalType === "distance_wise") {
        setTypeWisePrice(carDetails?.distance_price);
      } else if (rentalType ==="day_wise") {
        setTypeWisePrice(carDetails?.day_wise_price); // Make sure this field exists in carDetails
      }
      setTripType(rentalType);
    } else if (rentalSearch) {
      setTripType(rentalSearch?.tripType);
    } else {
      setTripType(null);
    }
  }, [isProductExist, userData?.rental_type, rentalSearch]);




  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    if (getToken()) {
      addFavoriteMutation(
        { key: "vehicle_id", id: carDetails?.id },
        {
          onSuccess: (response) => {
            if (response) {
              dispatch(addWishListVehicle(carDetails));
              toast.success(response?.message);
            }
          },
          onError: (error) => {
            toast.error(error.response.data.message);
          },
        }
      );
    } else toast.error(t(not_logged_in_message));
  };

  const removeFromWishlistHandler = (e) => {
    e.stopPropagation();
    const onSuccessHandlerForDelete = (res) => {
      dispatch(removeWishListVehicle(carDetails?.id));
      toast.success(res.message, {
        id: "wishlist_removeWishlist",
      });
    };
    removeFavoriteMutation(
      { key: "vehicle_id", id: carDetails?.id },
      {
        onSuccess: onSuccessHandlerForDelete,
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      }
    );
  };


  const settings = {
    dots: true,
    infinite: 5,
    slidesToShow: 1,
    cssEase: "ease-in-out",
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    variableHeight: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          swipeToSlide: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 360,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const allImages = [
    carDetails?.thumbnail_full_url,
    ...carDetails?.images_full_url,
  ];

  return (
    <CustomBoxFullWidth
      sx={{
        width: "100%",
        padding: "30px",
        mx: "auto",
        maxHeight: "78vh",
        overflowY: "scroll",
       
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6}>
          <Slider {...settings}>
            {allImages?.map((item, index) => {
              return (
                <Box key={index} sx={{ position: "relative" }}>
                  <Typography
                  width="200px"
                    component="span"
                    sx={{
                      position: "absolute",
                      borderStartStartRadius: "10px",
                      borderEndEndRadius: "10px",
                      px: "5px",
                      py: "2px",
                      fontSize: "13px",
                      fontWeight: "500",
                      zIndex: 1000,
                      color: (theme) => theme.palette.neutral[100],
                    }}
                  >
                    {handleBadgeRental(carDetails)}
                  </Typography>
                  {carDetails?.new_tag === 1 ? (
                    <CustomBadge
                      top={30}
                      bg_color="#EF8C45"
                      text={t("New Arrival")}
                      fontSize="12px"
                      border_radius="5px 1px 14px 0px"
                    />
                  ) : null}
                  <CustomImageContainer
                    src={item}
                    width={{ xs: "100%" }}
                    height="214px"
                    borderRadius={"10px"}
                  />
                </Box>
              );
            })}
          </Slider>
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <RentalCardWrapper borderRadius="10px" sx={{paddingTop:"0px"}}>
            <Box
              sx={{
                borderBottom: (theme) =>
                  `1px solid ${theme.palette.neutral[200]}`,
                pb: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: "400",
                      fontSize: "13px",
                      mb: "5px",
                    }}
                  >
                    {carDetails?.provider?.name}
                  </Typography>
                  <H2 text={carDetails?.name} sx={{ textAlign: "left" }} />
                </Box>
                <Box>
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "5px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      border: (theme) =>
                        `1px solid ${theme.palette.neutral[200]}`,
                      background: (theme) => theme.palette.background.paper,
                    }}
                  >
                    {checkIsWishListed() ? (
                      <PrimaryToolTip text="Remove from wishlist">
                        <IconButtonStyled
                          width="30px"
                          height="30px"
                          color="#EF7822"
                          border="1px solid"
                          margin="0px"
                          onClick={(e) => removeFromWishlistHandler(e)}
                          sx={{
                            svg: {
                              width: "20px",
                              height: "20px",
                            },
                          }}
                        >
                          <FavoriteIcon />
                        </IconButtonStyled>
                      </PrimaryToolTip>
                    ) : (
                      <PrimaryToolTip text="Add to wishlist">
                        <IconButtonStyled
                          width="30px"
                          height="30px"
                          border="1px solid #EAEEF2"
                          color="#EF7822"
                          margin="0px"
                          onClick={(e) => addToWishlistHandler(e)}
                          sx={{
                            svg: {
                              width: "20px",
                              height: "20px",
                            },
                          }}
                        >
                          <FavoriteBorderIcon />
                        </IconButtonStyled>
                      </PrimaryToolTip>
                    )}
                  </Box>
                </Box>
              </Box>
              <div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: formattedText,
                  }}
                  style={{
                    color: theme.palette.neutral[400],
                    maxHeight: "70px",
                    overflowY: "auto",
                    marginBottom: "10px",
                    fontSize: "12px",
                    marginTop: "5px",
                  }}
                />
              </div>
            </Box>
            <Stack
              direction="row"
              flexWrap="wrap"
              rowGap={0.5}
              columnGap={2}
              sx={{
                mt: "20px",
                color: (theme) => theme.palette.neutral[400],
                svg: {
                  fontSize: "16px",
                  marginBottom: "2px",
                },
              }}
            >
              {carDetails?.seating_capacity && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <GroupIcon />
                  <Typography variant="body2" component="div">
                    {carDetails?.seating_capacity} {t("Seats")}
                  </Typography>
                </Stack>
              )}
              {carDetails?.type && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <DirectionsCarFilledIcon />
                  <Typography
                    variant="body2"
                    component="div"
                    mt={1}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {carDetails?.type?.replace("_", " ")}
                  </Typography>
                </Stack>
              )}
              {carDetails?.air_condition > 0 && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <AirIcon />
                  <Typography
                    variant="body2"
                    component="div"
                    mt={1}
                    sx={{ textTransform: "capitalize" }}
                  >
                    AC
                  </Typography>
                </Stack>
              )}
              {carDetails?.transmission_type && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <ManageHistoryIcon />
                  <Typography
                    variant="body2"
                    component="div"
                    mt={1}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {carDetails?.transmission_type.replace("_", " ")}
                  </Typography>
                </Stack>
              )}
              {carDetails?.fuel_type && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <EvStationIcon />
                  <Typography
                    variant="body2"
                    component="div"
                    mt={1}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {carDetails?.fuel_type}
                  </Typography>
                </Stack>
              )}
            </Stack>

            <Box
              sx={{
                mt: "24px",
                background: (theme) => alpha(theme.palette.neutral[200], 0.7),
                display: "flex",
                justifyContent: "space-between",
                borderRadius: "5px",
              }}
            >
              {carDetails?.trip_hourly === 1 ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    pl: "13px",
                    py: "8px",
                    flex: 1,
                    background: "transparent",
                  }}
                >
                  {tripType==="hourly" && (<svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 0C4.03725 0 0 4.03725 0 9C0 13.9628 4.03725 18 9 18C13.9628 18 18 13.9628 18 9C18 4.03725 13.9628 0 9 0ZM8.93175 11.5642C8.6415 11.8545 8.25975 11.9992 7.8765 11.9992C7.49325 11.9992 7.10775 11.853 6.8145 11.5605L4.728 9.5385L5.77275 8.46075L7.8675 10.491L12.2242 6.21525L13.2772 7.284L8.93175 11.5642Z"
                      fill="#039D55"
                    />
                  </svg>) }
                  
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "14px",
                      color: (theme) => theme.palette.neutral[500],
                    }}
                  >
                    {getAmountWithSign(carDetails?.hourly_price)}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "400",
                      fontSize: "12px",
                      color: (theme) => theme.palette.neutral[400],
                    }}
                  >
                    /hr
                  </Typography>
                </Box>
              ) : null}

              {carDetails?.trip_hourly === 1 && carDetails?.trip_distance === 1 ? (
                <Box
                  sx={{
                    width: "0.2px",
                    borderRight: (theme) =>
                      `1px solid ${alpha(theme.palette.neutral[400], 0.3)}`,
                  }}
                ></Box>
              ) : null}

              {carDetails?.trip_distance === 1 ? (
                <Box
                  sx={{
                    pl: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    pr: "13px",
                    py: "8px",
                    flex: 1,
                    
                    background: "transparent",
                  }}
                >
                  {tripType==="distance_wise" && (<svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 0C4.03725 0 0 4.03725 0 9C0 13.9628 4.03725 18 9 18C13.9628 18 18 13.9628 18 9C18 4.03725 13.9628 0 9 0ZM8.93175 11.5642C8.6415 11.8545 8.25975 11.9992 7.8765 11.9992C7.49325 11.9992 7.10775 11.853 6.8145 11.5605L4.728 9.5385L5.77275 8.46075L7.8675 10.491L12.2242 6.21525L13.2772 7.284L8.93175 11.5642Z"
                      fill="#039D55"
                    />
                  </svg>)}
                  
                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "14px",
                      textAlign: "left",
                      color: (theme) => theme.palette.neutral[500],
                    }}
                  >
                    {getAmountWithSign(carDetails?.distance_price)}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "400",
                      fontSize: "12px",
                      color: (theme) => theme.palette.neutral[400],
                    }}
                  >
                    /km
                  </Typography>
                </Box>

              ) : null}
              {carDetails?.trip_hourly === 1 && carDetails?.trip_distance === 1 ? (
                <Box
                  sx={{
                    width: "0.2px",
                    borderRight: (theme) =>
                      `1px solid ${alpha(theme.palette.neutral[400], 0.3)}`,
                  }}
                ></Box>
              ) : null}
              {carDetails?.trip_day_wise === 1 ? (
                <Box
                  sx={{
                    pl: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    pr: "13px",
                    py: "8px",
                    flex: 1,

                    background: "transparent",
                  }}
                >
                  {tripType==="day_wise" && (<svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 0C4.03725 0 0 4.03725 0 9C0 13.9628 4.03725 18 9 18C13.9628 18 18 13.9628 18 9C18 4.03725 13.9628 0 9 0ZM8.93175 11.5642C8.6415 11.8545 8.25975 11.9992 7.8765 11.9992C7.49325 11.9992 7.10775 11.853 6.8145 11.5605L4.728 9.5385L5.77275 8.46075L7.8675 10.491L12.2242 6.21525L13.2772 7.284L8.93175 11.5642Z"
                      fill="#039D55"
                    />
                  </svg>)}

                  <Typography
                    sx={{
                      fontWeight: "600",
                      fontSize: "14px",
                      textAlign: "left",
                      color: (theme) => theme.palette.neutral[500],
                    }}
                  >
                    {getAmountWithSign(carDetails?.day_wise_price)}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "400",
                      fontSize: "12px",
                      color: (theme) => theme.palette.neutral[400],
                    }}
                  >
                    /day
                  </Typography>
                </Box>
              ) : null}
            </Box>
          </RentalCardWrapper>
        </Grid>
      </Grid>
      <VehicleDetailsRentThisCar
        isFixed={false}
        marginTop={"20px"}
        borderRadius={"10px"}
        height="100%"
        vehicleDetails={carDetails}
        typeWisePrice={typeWisePrice}
        userData={userData}
        selectedPricing={tripType}
        from={from}
        shadow={false}
        handleClose={handleClose}
        setIsSameOpen={setIsSameOpen}
        setOpenTripChange={setOpenTripChange}
        updateCartObject={updateCartObject}
        setIds={setIds}
        setUpdateCartObject={setUpdateCartObject}
        openCarBookingModal={openCarBookingModal}
        handleIncrementFromCard={handleIncrementFromCard}
        handleDecrementFromCard={handleDecrementFromCard}
        addToCartHandler={addToCartHandler}
        fullWidth={true}
      />
    </CustomBoxFullWidth>
  );
};

export default RentalCarQuickView;
