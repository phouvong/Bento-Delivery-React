import {Grid, Radio, Stack, Typography, useMediaQuery, useTheme} from "@mui/material";
import { alpha, Box } from "@mui/system";
import CustomImageContainer from "components/CustomImageContainer";
import React, { useState } from "react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import StarIcon from "@mui/icons-material/Star";
import { t } from "i18next";
import RentalCardWrapper from "../global/RentalCardWrapper";
import GroupIcon from "@mui/icons-material/Group";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import AirIcon from "@mui/icons-material/Air";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import EvStationIcon from "@mui/icons-material/EvStation";
import VehicleDetailsRentThisCar from "./VehicleDetailsRentThisCar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import {useDispatch, useSelector} from "react-redux";
import CustomBadge from "components/cards/CustomBadge";
import {handleBadgeRental} from "components/home/module-wise-components/rental/components/global/CarCard";
import {IconButtonStyled, PrimaryToolTip} from "components/cards/QuickView";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import toast from "react-hot-toast";
import {addWishListVehicle, removeWishListVehicle} from "redux/slices/wishList";
import {getToken} from "helper-functions/getToken";
import {not_logged_in_message} from "utils/toasterMessages";
import {
  useAddWishlist
} from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useAddWishlist";
import {
  useRemoveRentalWishList
} from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useRemoveWishlist";

const VehicleDetailsTopSection = ({
  vehicleDetails,
  selectedPricing,
  handleSelect,
  typeWisePrice,
  userData,
  from,
  
}) => {
  const theme=useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const rentalSearch = useSelector(
    (state) => state?.rentalSearch?.rentalSearch
  );

  return (
    <CustomStackFullWidth>
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <ImageSection vehicleDetails={vehicleDetails} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RentalCardWrapper borderRadius="10px" padding="16px">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Box>
                {
                  Number(vehicleDetails?.avg_rating) !==0 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "10px",
                        mb: "4px",
                      }}
                    >
                      <Box
                        sx={{
                          justifyContent: "center",
                          display: "flex",
                          alignItems: "center",
                          borderRadius: "5px",
                          background: (theme) =>
                            alpha(theme.palette.primary.main, 0.1),
                          gap: "4px",
                          py: "2px",
                          px: "10px",
                        }}
                      >
                        <StarIcon
                          sx={{
                            fontSize: "15px",
                            mt: -0.2,
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
                          {Number(vehicleDetails?.avg_rating).toFixed(1)}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: "400",
                          color: (theme) => theme.palette.neutral[400],
                        }}
                      >
                        {vehicleDetails?.total_reviews} {t("Reviews")}
                      </Typography>
                    </Box>
                  )

                }
                <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
                  {vehicleDetails?.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  padding: "10px",
                  borderRadius: "7px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",

                  flexWrap: { xs: "wrap", md: "nowrap" },
                  background: (theme) => alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <Typography
                  component={"span"}
                  sx={{
                    fontSize: "12px",
                    lineHeight: "14.22px",
                  }}
                >
                  {t("Similar")} <br></br>
                  {t("Vehicle")}
                </Typography>
                <Typography
                  component={"span"}
                  sx={{
                    p: "15px",
                    height: "34px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "5px",
                    fontSize: "14px",
                    fontWeight: "500",
                    background: (theme) => theme.palette.neutral[100],
                  }}
                >
                  {vehicleDetails?.total_vehicles}
                </Typography>
              </Box>
            </Box>

            <Stack
              direction="row"
              flexWrap="wrap"
              rowGap={1}
              columnGap={5}
              sx={{
                mt: "20px",
                color: (theme) => theme.palette.neutral[400],
                svg: {
                  fontSize: "16px",
                  marginBottom: "2px",
                },
              }}
            >
              {vehicleDetails?.seating_capacity && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <GroupIcon />
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {vehicleDetails?.seating_capacity} {t("Seats")}
                  </Typography>
                </Stack>
              )}
              {vehicleDetails?.type && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <DirectionsCarFilledIcon />
                  <Typography
                    variant="body2"
                    component="div"
                    mt={1}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {vehicleDetails?.type}
                  </Typography>
                </Stack>
              )}
              {vehicleDetails?.air_condition > 0 && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <AirIcon />
                  <Typography
                    variant="body2"
                    component="div"
                    mt={1}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {t("AC")}
                  </Typography>
                </Stack>
              )}

              {vehicleDetails?.transmission_type && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <ManageHistoryIcon />
                  <Typography
                    variant="body2"
                    component="div"
                    mt={1}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {vehicleDetails?.transmission_type.replace("_", " ")}
                  </Typography>
                </Stack>
              )}

              {vehicleDetails?.fuel_type && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <EvStationIcon />
                  <Typography
                    variant="body2"
                    component="div"
                    mt={1}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {vehicleDetails?.fuel_type?.replace("_", " ")}
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
              {/* Hourly Pricing */}
              {vehicleDetails?.trip_hourly === 1 ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    pl: "13px",
                    py: "8px",
                    flex: 1,
                    
                    background:
                      "transparent",
                  }}
                  
                >
                   {selectedPricing==="hourly" && (<svg
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
                    {getAmountWithSign(vehicleDetails?.hourly_price)}
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

              {/* Divider */}
              {vehicleDetails?.trip_hourly === 1 &&
              vehicleDetails?.trip_distance === 1 ? (
                <Box
                  sx={{
                    width: "0.2px",
                    borderRight: (theme) =>
                      `1px solid ${alpha(theme.palette.neutral[400], 0.3)}`,
                  }}
                ></Box>
              ) : null}
              {vehicleDetails?.trip_distance === 1 ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    pr: "13px",
                    py: "8px",
                    pl: "10px",
                    flex: 1,
                      
                    background: "transparent",
                  }}
                
                >
                   {selectedPricing === "distance_wise" && (<svg
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
                      textAlign: "left",
                      color: (theme) => theme.palette.neutral[500],
                    }}
                  >
                    {getAmountWithSign(vehicleDetails?.distance_price)}
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
              {/* Distance Pricing */}
              {vehicleDetails?.trip_hourly === 1 &&
              vehicleDetails?.trip_distance === 1 ? (
                <Box
                  sx={{
                    width: "0.2px",
                    borderRight: (theme) =>
                      `1px solid ${alpha(theme.palette.neutral[400], 0.3)}`,
                  }}
                ></Box>
              ) : null}
              {vehicleDetails?.trip_day_wise === 1 ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    pr: "13px",
                    py: "8px",
                    pl: "10px",
                    flex: 1,

                    background: "transparent",
                  }}

                >
                  {selectedPricing === "day_wise" && (<svg
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
                      textAlign: "left",
                      color: (theme) => theme.palette.neutral[500],
                    }}
                  >
                    {getAmountWithSign(vehicleDetails?.day_wise_price)}
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
          <VehicleDetailsRentThisCar
            isFixed={false}
            marginTop={"20px"}
            borderRadius={"10px"}
            height={isSmall ? "90px" : "66px"}
            vehicleDetails={vehicleDetails}
            shadow={false}
            typeWisePrice={typeWisePrice}
            userData={userData}
            selectedPricing={selectedPricing}
            from={from}
            fullWidth
          />
        </Grid>
      </Grid>
    </CustomStackFullWidth>
  );
};

export default VehicleDetailsTopSection;

const ImageSection = ({ vehicleDetails }) => {
  const allImages = [
    vehicleDetails?.thumbnail_full_url,
    ...vehicleDetails?.images_full_url,
  ];
  const theme=useTheme()
  const dispatch=useDispatch()
  const [selectImage, setSelectImage] = useState(0);
  const { mutate: addFavoriteMutation } = useAddWishlist();
  const { mutate: removeFavoriteMutation } = useRemoveRentalWishList();
  const { wishLists } = useSelector((state) => state?.wishList);
  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    if (getToken()) {
      addFavoriteMutation(
        { key: "vehicle_id", id: vehicleDetails?.id },
        {
          onSuccess: (response) => {
            if (response) {
              dispatch(addWishListVehicle(vehicleDetails));
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
      dispatch(removeWishListVehicle(vehicleDetails?.id));
      toast.success(res.message, {
        id: "wishlist",
      });
    };
    removeFavoriteMutation(
      { key: "vehicle_id", id: vehicleDetails?.id },
      {
        onSuccess: onSuccessHandlerForDelete,
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      }
    );
  };
  const checkIsWishListed=()=>{
  return  wishLists?.vehicles?.find((wishItem) => wishItem.id === vehicleDetails?.id)
  }


  return (
    <>
      <CustomBoxFullWidth sx={{position:"relative"}}>
        <Stack sx={{ position: "absolute", top: "10px", right: "5px" ,zIndex:"888"}}>
          {checkIsWishListed() ? (
            <PrimaryToolTip text="Remove from wishlist">
              <IconButtonStyled
                color="#EF7822"
                border="1px solid"
                 onClick={(e) => removeFromWishlistHandler(e)}
              >
                <FavoriteIcon />
              </IconButtonStyled>
            </PrimaryToolTip>
          ) : (
            <PrimaryToolTip text="Add to wishlist">
              <IconButtonStyled
                border="1px solid #EAEEF2"
                color="#EF7822"
                 onClick={(e) => addToWishlistHandler(e)}
              >
                <FavoriteBorderIcon />
              </IconButtonStyled>
            </PrimaryToolTip>
          )}
        </Stack>
        <CustomImageContainer
          src={selectImage || vehicleDetails?.thumbnail_full_url}
          height={"200px"}
          width={"100%"}
          borderRadius="10px"
          objectfit="cover"
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            gap: "12px",
            mt: "12px",
          }}
        >
          {vehicleDetails?.new_tag === 1 ? (
            <CustomBadge
              top={30}
              bg_color="#EF8C45"
              text={t("New Arrival")}
              fontSize="12px"
               border_radius="5px 1px 14px 0px"
            />
          ) : null}

          {handleBadgeRental(vehicleDetails)}
          {allImages?.map((image, index) => (
            <CustomImageContainer
              onClick={() => {
                setSelectImage(image);
              }}
              key={index}
              src={image}
              height={"40px"}
              width={"40px"}
              borderRadius="10px"
              sx={{
                cursor: "pointer",
              }}
            />
          ))}
        </Box>
      </CustomBoxFullWidth>
    </>
  );
};

const TripType = ({ title, price, unit = "hr" }) => {
  return (
    <>
      <RentalCardWrapper borderRadius="10px" padding="12px">
        <Typography sx={{ fontWeight: "500", fontSize: "12px", mb: "5px" }}>
          {t(title)}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            component="span"
            sx={{ fontWeight: "400", fontSize: "12px" }}
          >
            $
          </Typography>
          <Typography sx={{ fontWeight: "700", fontSize: "16px" }}>
            {price}
          </Typography>
          <Typography
            component="span"
            sx={{
              fontWeight: "400",
              fontSize: "12px",
              color: (theme) => theme.palette.neutral[400],
            }}
          >
            /{unit}
          </Typography>
        </Box>
      </RentalCardWrapper>
    </>
  );
};
