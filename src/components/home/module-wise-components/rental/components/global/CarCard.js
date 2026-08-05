import { CustomCarCard } from "components/home/module-wise-components/rental/components/Rental.style";
import { Box, Stack } from "@mui/system";
import {
  alpha,
  Button,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import GroupIcon from "@mui/icons-material/Group";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import AirIcon from "@mui/icons-material/Air";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import EvStationIcon from "@mui/icons-material/EvStation";
import InfoIcon from "@mui/icons-material/Info";
import QuickView from "components/cards/QuickView";
import { CustomOverLay } from "components/cards/Card.style";
import RentWithIncrementDecrement from "components/home/module-wise-components/rental/components/global/RentWithIncrementDecrement";
import HorizontalCarCard from "./HorizontalCarCard";
import { t } from "i18next";
import WarningIcon from "@mui/icons-material/Warning";
import React, { useEffect, useReducer, useState } from "react";
import {
  ACTIONS,
  carCardInitialState,
  carCardReducer,
} from "components/home/module-wise-components/rental/components/global/carCardState";
import CustomModal from "components/modal";
import VerifiedStoreBadge from "components/cards/VerifiedStoreBadge";
import RentalCarQuickView from "./RentalCarQuickView";
import { useRouter } from "next/router";
import useTextEllipsis from "api-manage/hooks/custom-hooks/useTextEllipsis";

import { useDispatch, useSelector } from "react-redux";
import useUpdateBookingCart from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/confirm-booking/useUpdateBookingCart";
import useDeleteItemFromBooking from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/confirm-booking/useDeleteItemFromBooking";
import {
  removeItemFromCart,
  updateCart,
} from "components/home/module-wise-components/rental/components/rental-cart/helper";
import { setCartList } from "redux/slices/cart";
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "helper-functions/CardHelpers";
import useConfirmBooking from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/confirm-booking/useConfirmBooking";
import { bookingConfirm } from "components/home/module-wise-components/rental/components/global/search/searchHepler";
import { toast } from "react-hot-toast";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useAddWishlist } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useAddWishlist";
import { mainPrice } from "components/home/module-wise-components/rental/components/utils/bookingHepler";
import CustomImageContainer from "components/CustomImageContainer";
import { not_logged_in_message } from "utils/toasterMessages";
import {
  addWishListVehicle,
  removeWishListVehicle,
} from "redux/slices/wishList";
import { useRemoveRentalWishList } from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/wishlist/useRemoveWishlist";
import { getGuestId, getToken } from "helper-functions/getToken";
import CustomBadge from "components/cards/CustomBadge";
import dynamic from "next/dynamic";
import ProviderCheck from "components/home/module-wise-components/rental/components/global/ProviderCheck";
import TripModalContent from "../rental-cart/TripModalContent";
import TripVehicleList from "../rental-cart/TripVehicleList";
import usePostLocationUpdate from "../../rental-api-manage/hooks/react-query/confirm-booking/usePostLocationUpdate";
import { LoadingButton } from "@mui/lab";
import ChangeTripType from "components/home/module-wise-components/rental/components/vehicle-details/ChangeTripType";
import ChangeTripHours from "components/home/module-wise-components/rental/components/vehicle-details/ChangeTripHours";
import NextImage from "components/NextImage";
import { RentalImageOverlay } from "components/cards/newCard/NewProductCard";

const CarBookingModal = dynamic(() =>
  import(
    "components/home/module-wise-components/rental/components/global/CarBookingModal"
  )
);

const p_off = t("% off");

export const handleBadgeRental = (data) => {
  if (Number.parseInt(data?.discount_price) > 0) {
    if (data?.discount_type === "percent") {
      return (
        <CustomBadge
          bg_color="#DA6868"
          fontSize="12px"
          border_radius="5px 1px 14px 0px"
          top={0}
          text={`${data?.discount_price}${p_off}`}
        />
      );
    } else {
      return (
        <CustomBadge
          fontSize="12px"
          bg_color="#DA6868"
          border_radius="5px 1px 14px 0px"
          top={0}
          text={`${getAmountWithSign(
            data?.discount_price,
            data?.discount_price % 1 ? true : false
          )} ${t("off")}`}
        />
      );
    }
  }
};

const CarCard = ({
  data,
  setOpenModal,
  currentView = 0,
  direction = "column",
  showSameVehicleText = true,
  from,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { ref: textRef, isEllipsed } = useTextEllipsis(data?.name);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartItemData, setCartItemData] = useState({});
  const [carDetails, setCarDetails] = useState({});
  const [open, setOpen] = useState(false);
  const [isSameOpen, setIsSameOpen] = useState(false);
  const [openTripChange, setOpenTripChange] = React.useState(false);
  const [ids, setIds] = React.useState(null);
  const [updateCartObject, setUpdateCartObject] = React.useState({});
  const [callUpdateUserData, setCallUpdateUserData] = useState(false);
  const [openHourDiffModal, setOpenHourDiffModal] = useState(false);
  const [updateOrAdd, setUpdateOrAdd] = useState({
    type: "add",
    quantity: 0,
  });
  const [state, carCardDispatch] = useReducer(
    carCardReducer,
    carCardInitialState
  );
  const { cartList } = useSelector((state) => state.cart);
  const rentalSearch = useSelector(
    (state) => state?.rentalSearch?.rentalSearch
  );
  const fromSearch = router?.query?.from;
  const { mutate: addFavoriteMutation } = useAddWishlist();
  const { mutate: removeFavoriteMutation } = useRemoveRentalWishList();
  const { mutate: userDataUpdateMutate, isLoading: userDataIsLoading } =
    usePostLocationUpdate();
  const { wishLists } = useSelector((state) => state?.wishList);

  useEffect(() => {
    wishlistItemExistHandler();
  }, [wishLists]);

  const wishlistItemExistHandler = () => {
    if (wishLists?.vehicles?.find((wishItem) => wishItem.id === data?.id)) {
      setIsWishlisted(true);
    } else {
      setIsWishlisted(false);
    }
  };

  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    if (getToken()) {
      addFavoriteMutation(
        { key: "vehicle_id", id: data?.id },
        {
          onSuccess: (response) => {
            if (response) {
              dispatch(addWishListVehicle(data));
              setIsWishlisted(true);
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
      dispatch(removeWishListVehicle(data?.id));
      setIsWishlisted(false);
      toast.success(res.message, {
        id: "wishlist",
      });
    };
    removeFavoriteMutation(
      { key: "vehicle_id", id: data?.id },
      {
        onSuccess: onSuccessHandlerForDelete,
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      }
    );
  };

  const { mutate: confirmMutate, isLoading: confirmIsLoading } =
    useConfirmBooking();

  const isProductExist = cartList?.carts?.find(
    (item) => item.vehicle?.id === data?.id
  );
  const { mutate: updateMutate, isLoading: updateIsLoading } =
    useUpdateBookingCart();
  const { mutate } = useDeleteItemFromBooking();

  const handleIncrement = (cartItem) => {
    const updateQuantity = cartItem?.quantity + 1;
    if (data?.total_vehicle_count < updateQuantity) {
      toast.error(
        t(
          `You can't add more than ${data?.total_vehicle_count} quantities of this vehicle.`
        )
      );
    } else {
      if (from === "from_search") {
        if (
          Number(rentalSearch?.duration) ===
          Number(cartList?.user_data?.estimated_hours)
        ) {
          updateCart(
            cartItem,
            cartList?.user_data,
            dispatch,
            setCartList,
            updateQuantity,
            updateMutate
          );
        } else {
          setUpdateOrAdd({
            type: "update",
            quantity: updateQuantity,
            cartItem: cartItem,
          });
          setOpenHourDiffModal(true);
          setOpen(false);
        }
      } else {
        updateCart(
          cartItem,
          cartList?.user_data,
          dispatch,
          setCartList,
          updateQuantity,
          updateMutate
        );
      }
    }
  };

  const handleDecrement = (cartItem) => {
    const updateQuantity = cartItem?.quantity - 1;
    if (from === "from_search") {
      if (
        Number(rentalSearch?.duration) ===
        Number(cartList?.user_data?.estimated_hours)
      ) {
        updateCart(
          cartItem,
          cartList?.user_data,
          dispatch,
          setCartList,
          updateQuantity,
          updateMutate
        );
      } else {
        setUpdateOrAdd({
          type: "update",
          quantity: updateQuantity,
          cartItem: cartItem,
        });
        setOpenHourDiffModal(true);
      }
    } else {
      updateCart(
        cartItem,
        cartList?.user_data,
        dispatch,
        setCartList,
        updateQuantity,
        updateMutate
      );
    }
  };

  const removeItemCart = (cartItem) => {
    removeItemFromCart(cartItem, mutate, dispatch, setCartList);
  };

  const isDifferentProvider = cartList?.carts?.some(
    (cart) => cart.provider?.id !== data?.provider?.id
  );

  const openCarBookingModal = () => {
    carCardDispatch({ type: ACTIONS.setOpen, payload: true });
    setOpen(false);
  };

  const rentalLocations = {
    pickup: rentalSearch?.pickup_location,
    destination: rentalSearch?.destination_location,
  };

  const bookingDetails = {
    id: data?.id,
    locations: rentalLocations,
    searchKey1: rentalSearch?.pickup_location?.location_name,
    searchKey2: rentalSearch?.destination_location?.location_name,
    tripType: rentalSearch?.tripType,
    durationValue: rentalSearch?.duration,
    dateValue: rentalSearch?.selectedDate?.$d,
    data: rentalSearch?.distanceData,
  };

  const addToCartHandler = () => {
    if (from === "from_search") {
      if (isDifferentProvider) {
        handleDifferentProvider(bookingDetails);
      } else {
        handleSameProvider(bookingDetails);
      }
      setOpen(false);
    } else {
      openCarBookingModal();
      setOpen(false);
    }
  };

  const handleDifferentProvider = (bookingDetails) => {
    carCardDispatch({ type: ACTIONS.setOpenSameProvider, payload: true });
    setCartItemData(bookingDetails);
  };

  const handleSameProvider = (bookingDetails) => {
    if (cartList?.carts?.length > 0) {
      if (rentalSearch?.tripType === cartList?.user_data?.rental_type) {
        if (
          cartList?.user_data?.rental_type === "hourly" ||
          cartList?.user_data?.rental_type === "day_wise"
        ) {
          if (
            Number(rentalSearch?.duration) ===
            Number(cartList?.user_data?.estimated_hours)
          ) {
            bookingConfirm({
              ...bookingDetails,
              confirmMutate,
              dispatch,
              setCartList,
              toast,
              handleClose: null,
              onErrorResponse,
            });
          } else {
            setUpdateOrAdd({
              type: "add",
            });
            setOpenHourDiffModal(true);
          }
        } else {
          bookingConfirm({
            ...bookingDetails,
            confirmMutate,
            dispatch,
            setCartList,
            toast,
            handleClose: null,
            onErrorResponse,
          });
        }
      } else {
        setUpdateCartObject?.({
          ...bookingDetails,
          userId: cartList?.user_data?.id,
          id: data?.id,
        });
        setIsSameOpen?.(true);
        handleClose?.();
      }
    } else {
      bookingConfirm({
        ...bookingDetails,
        confirmMutate,
        dispatch,
        setCartList,
        toast,
        handleClose: null,
        onErrorResponse,
      });
    }
  };

  const handleClose = (value) => {
    carCardDispatch({
      type: ACTIONS.setOpen,
      payload: value,
    });
  };

  const handleProviderCheck = (payload) => {
    carCardDispatch({
      type: ACTIONS.setOpenSameProvider,
      payload: payload,
    });
  };

  const handleRentalTripType = (value) => {
    carCardDispatch({
      type: ACTIONS.setSelectedTripType,
      payload: value,
    });
  };

  const handleChangePrvTripType = () => {
    const tempUpdateCartObject = {
      userId: updateCartObject?.userId,
      pickup_location: updateCartObject?.locations?.pickup,
      destination_location: updateCartObject?.locations?.destination,
      rental_type: updateCartObject?.tripType,
      estimated_hours: updateCartObject?.durationValue,
      pickup_time: updateCartObject?.dateValue,
      destination_time: Math.floor(
        updateCartObject?.data?.distanceMeters / (60 * 60)
      ),
      distance:
        Number(updateCartObject?.data?.duration?.replace("s", "")) / 1000,
      guest_id: getToken() ? null : getGuestId(),
    };

    userDataUpdateMutate(tempUpdateCartObject, {
      onSuccess: (res) => {
        bookingConfirm({
          ...updateCartObject,
          confirmMutate,
          dispatch,
          setCartList,
          toast,
          handleClose: setIsSameOpen(false),
          onErrorResponse,
        });
        handleClose?.(false);
      },
      onError: (error) => {
        if (error.response.data?.length > 0) {
          setIds?.(error.response.data);
          setUpdateCartObject?.(updateCartObject);
          setOpenTripChange?.(true);
          setIsSameOpen(false);
        } else {
          onErrorResponse(error);
        }
      },
    });
  };

  const handleHourDiffModal = (bookingDetails, updateOrAdd) => {
    if (updateOrAdd?.type === "add") {
      bookingConfirm({
        ...bookingDetails,
        confirmMutate,
        dispatch,
        setCartList,
        toast,
        handleClose: () => setOpenHourDiffModal(false),
        onErrorResponse,
      });
    } else {
      const tempUserData = {
        ...cartList?.user_data,
        estimated_hours: rentalSearch?.duration,
      };
      updateCart(
        updateOrAdd?.cartItem,
        tempUserData,
        dispatch,
        setCartList,
        updateOrAdd?.quantity,
        updateMutate
      );
      setOpenHourDiffModal(false);
    }
  };

  const handleClick = () =>
    router.push({
      pathname: `/rental/vehicle/${data?.slug || data?.id}`,
      query: {
        from: from,
        module: router?.query?.module || router?.query?.module_id,
      },
    });

  const toggleWishlist = (e) => {
    if (isWishlisted) {
      removeFromWishlistHandler(e);
    } else {
      addToWishlistHandler(e);
    }
  };

  const discountText =
    data?.discount_price > 0
      ? data?.discount_type === "percent"
        ? `${data?.discount_price}% Off`
        : `${getAmountWithSign(data?.discount_price)} Off`
      : "";

  const basePrice = mainPrice(data, rentalSearch?.tripType);
  const hasDiscount =
    data?.discount_price > 0 || data?.provider?.discount?.discount > 0;
  const discountedPrice = getDiscountedAmount(
    basePrice,
    data?.discount_price,
    data?.discount_type,
    data?.provider?.discount,
    1,
    data?.provider?.discount?.max_discount
  );
  const displayPrice = hasDiscount ? discountedPrice : basePrice;
  const originalPrice = hasDiscount ? basePrice : 0;
  const isStore = data?.is_store ?? false;

  const shortenTransmission = (val) => {
    if (!val) return val;
    const lower = String(val).toLowerCase();
    if (lower.includes("semi")) return "Semi";
    if (lower.includes("auto")) return "Auto";
    if (lower.includes("manual")) return "Manual";
    if (lower.includes("dual")) return "Dual";
    if (lower.includes("cvt")) return "CVT";
    const first = val.replace(/_/g, " ").trim().split(/\s+/)[0] || val;
    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  };

  const builtFeatureCount =
    (data?.seating_capacity ? 1 : 0) +
    (data?.air_condition > 0 ? 1 : 0) +
    (data?.transmission_type ? 1 : 0);
  const hiddenFeatures = data?.fuel_type ? 1 : 0;

  // Search API and home API expose the vehicle thumbnail under different
  // keys — `thumbnail_full_url`, `image_full_url`, the first of an
  // `images_full_url[]` array, or nested under `vehicle_details`. Resolve
  // through every candidate so list / grid view always paint something.
  // next/image requires absolute URLs (http(s)://) or paths with a leading
  // "/" — bare relative filenames like "2025-07-02-...png" throw at runtime,
  // so we filter them out here and let the empty-string branch render a
  // placeholder instead.
  const isUsableImageUrl = (value) =>
    typeof value === "string" &&
    value.length > 0 &&
    (value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("/"));
  const thumbnailCandidates = [
    data?.thumbnail_full_url,
    data?.image_full_url,
    Array.isArray(data?.images_full_url) ? data?.images_full_url[0] : null,
    data?.vehicle?.thumbnail_full_url,
    data?.vehicle_details?.thumbnail_full_url,
  ];
  const resolvedThumbnail =
    thumbnailCandidates.find((value) => isUsableImageUrl(value)) || "";

  const enrichedItem = {
    ...data,
    thumbnail_full_url: resolvedThumbnail,
    store_name: data?.provider?.name || data?.store_name || "",
    store: {
      ...(data?.store || {}),
      logo_full_url:
        data?.provider?.logo_full_url || data?.store?.logo_full_url || "",
    },
    capacity: data?.seating_capacity || data?.capacity,
    air_conditioning: data?.air_condition > 0 || data?.air_conditioning,
    transmission:
      shortenTransmission(data?.transmission_type) || data?.transmission,
    extra_features:
      builtFeatureCount >= 3 && hiddenFeatures > 0
        ? `+${hiddenFeatures}`
        : data?.fuel_type
        ? data.fuel_type.replace("_", " ")
        : undefined,
  };

  // List-view (currentView === 1) renders the horizontal/wide layout.
  // Grid (currentView === 0) falls through to the inline Box markup below.
  const isListView = Number(currentView) === 1;
  if (isListView) {
    return (
      <>
        <HorizontalCarCard
          data={enrichedItem}
          setCarDetails={setCarDetails}
          setOpenModal={setOpenModal}
          addToCartHandler={addToCartHandler}
          isProductExist={isProductExist}
          count={isProductExist?.quantity}
          handleIncrement={handleIncrement}
          itemId={isProductExist?.id}
          handleDecrement={handleDecrement}
          updateLoading={updateIsLoading}
          removeItemCart={removeItemCart}
          fromSearch={fromSearch}
          addToWishlistHandler={addToWishlistHandler}
          removeFromWishlistHandler={removeFromWishlistHandler}
          isWishlisted={isWishlisted}
          hideRentButton
        />
      </>
    );
  }

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          width: "100%",
          // Mobile: fill the column (max-width 100%); desktop: cap at 270px.
          maxWidth: { xs: "100%", md: "270px" },
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          cursor: "pointer",
          gap: "8px",
          "&:hover .card-img img": { transform: "scale(1.05)" },
          "& > .MuiStack-root": {
            px: "0 !important",
          },
        }}
      >
        <Box
          className="card-img"
          sx={{
            position: "relative",
            backgroundColor: theme.palette.background.secondary,
            border: `1px solid ${theme.palette.neutral[200]}`,
            borderRadius: "12px",
            overflow: "hidden",
            width: "100%",
            height: "136px",
            maxHeight: "136px",
            display: "block",
            "& img": {
              position: "absolute !important",
              inset: "0 !important",
              top: "0 !important",
              left: "0 !important",
              width: "100% !important",
              height: "100% !important",
              maxWidth: "100% !important",
              maxHeight: "136px !important",
              objectFit: "cover !important",
              transition: "transform 0.3s ease",
            },
          }}
        >
          <NextImage
            src={enrichedItem?.thumbnail_full_url}
            alt={enrichedItem?.name}
            width="340"
            height="340"
            objectFit="cover"
          />
          <RentalImageOverlay
            discountText={discountText}
            item={enrichedItem}
            isWishlisted={isWishlisted}
            onWishlist={toggleWishlist}
          />
        </Box>

        <Stack
          sx={{
            flexDirection: "column",
            gap: "8px",
            pt: "8px",
            flex: 1,
            minWidth: 0,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap="8px"
          >
            <Stack
              direction="row"
              alignItems="center"
              gap="6px"
              sx={{ flex: 1, minWidth: 0 }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                  border: `1px solid ${theme.palette.neutral[200]}`,
                  backgroundColor: theme.palette.background.secondary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {enrichedItem?.store?.logo_full_url ? (
                  <NextImage
                    src={enrichedItem.store.logo_full_url}
                    alt={enrichedItem?.store_name}
                    width="16"
                    height="16"
                    objectFit="cover"
                  />
                ) : (
                  <i
                    className="fi fi-br-shop"
                    style={{
                      fontSize: "9px",
                      lineHeight: 1,
                      display: "flex",
                      color: theme.palette.neutral[500],
                    }}
                  />
                )}
              </Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: theme.palette.neutral[500],
                  lineHeight: 1.3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {enrichedItem?.store_name}
              </Typography>
            </Stack>
            {data?.avg_rating > 0 && (
              <Stack
                direction="row"
                alignItems="center"
                gap="3px"
                sx={{ flexShrink: 0 }}
              >
                <StarIcon sx={{ fontSize: "14px", color: "#F5B027" }} />
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    lineHeight: 1.3,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {Number(data?.avg_rating).toFixed(1)}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Typography
            ref={textRef}
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              color: theme.palette.text.primary,
              lineHeight: 1.2,
              fontFamily: "'DM Sans', sans-serif",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textTransform: "capitalize",
            }}
          >
            {data?.name}
          </Typography>

          <Stack sx={{ flexDirection: "column", gap: "2px" }}>
            <Typography
              sx={{
                fontSize: "13px",
                color: theme.palette.neutral[500],
                lineHeight: 1.2,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {t("Start From")}
            </Typography>
            <Stack
              direction="row"
              alignItems="baseline"
              gap="6px"
              flexWrap="nowrap"
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  lineHeight: 1.1,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {getAmountWithSign(displayPrice)}
              </Typography>
              {originalPrice > displayPrice && (
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: theme.palette.neutral[500],
                    textDecoration: "line-through",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {getAmountWithSign(originalPrice)}
                </Typography>
              )}
            </Stack>
          </Stack>

          <Stack
            direction="row"
            gap="6px"
            alignItems="center"
            sx={{
              flexWrap: "nowrap",
              overflowX: "auto",
              overflowY: "hidden",
              minWidth: 0,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              pt: "2px",
            }}
          >
            {data?.seating_capacity && (
              <Stack
                direction="row"
                alignItems="center"
                gap="4px"
                sx={{
                  backgroundColor: alpha(theme.palette.text.primary, 0.06),
                  borderRadius: "999px",
                  px: "8px",
                  py: "4px",
                  flexShrink: 0,
                }}
              >
                <i
                  className="fi fi-rs-user"
                  style={{
                    fontSize: "12px",
                    lineHeight: 1,
                    display: "flex",
                    color: theme.palette.text.primary,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  {data.seating_capacity} {t("Seats")}
                </Typography>
              </Stack>
            )}
            {data?.air_condition > 0 && (
              <Stack
                direction="row"
                alignItems="center"
                gap="4px"
                sx={{
                  backgroundColor: alpha(theme.palette.text.primary, 0.06),
                  borderRadius: "999px",
                  px: "8px",
                  py: "4px",
                  flexShrink: 0,
                }}
              >
                <i
                  className="fi fi-rs-wind"
                  style={{
                    fontSize: "12px",
                    lineHeight: 1,
                    display: "flex",
                    color: theme.palette.text.primary,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("AC")}
                </Typography>
              </Stack>
            )}
            {enrichedItem?.transmission && (
              <Stack
                direction="row"
                alignItems="center"
                gap="4px"
                sx={{
                  backgroundColor: alpha(theme.palette.text.primary, 0.06),
                  borderRadius: "999px",
                  px: "8px",
                  py: "4px",
                  flexShrink: 0,
                }}
              >
                <i
                  className="fi fi-rs-command"
                  style={{
                    fontSize: "12px",
                    lineHeight: 1,
                    display: "flex",
                    color: theme.palette.text.primary,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: "nowrap",
                    textTransform: "capitalize",
                  }}
                >
                  {enrichedItem.transmission}
                </Typography>
              </Stack>
            )}
            {data?.fuel_type && (
              <Stack
                direction="row"
                alignItems="center"
                gap="4px"
                sx={{
                  backgroundColor: alpha(theme.palette.text.primary, 0.06),
                  borderRadius: "999px",
                  px: "8px",
                  py: "4px",
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: "nowrap",
                    textTransform: "capitalize",
                  }}
                >
                  +1
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Box>

      {state.open && (
        <CarBookingModal
          open={state.open}
          handleClose={handleClose}
          id={data?.id}
          fromCard={cartList?.carts?.length > 0}
          isDifferentProvider={isDifferentProvider}
          handleProviderCheck={handleProviderCheck}
          setCartItemData={setCartItemData}
          selectedPricing={state.selectedTripType}
          isHourly={data?.trip_hourly}
          isDistence={data?.trip_distance}
          card
          setIsSameOpen={setIsSameOpen}
          setOpenTripChange={setOpenTripChange}
          setIds={setIds}
          setUpdateCartObject={setUpdateCartObject}
          isDayWise={data?.trip_day_wise}
        />
      )}
      <CustomModal
        openModal={state.openSameProvider}
        handleClose={() => handleProviderCheck(false)}
      >
        <IconButton
          onClick={() => handleProviderCheck(false)}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <CloseIcon sx={{ fontSize: "16px" }} />
        </IconButton>
        <ProviderCheck
          cartItemData={cartItemData}
          handleProviderCheck={handleProviderCheck}
          confirmMutate={confirmMutate}
          providerId={data?.provider?.id}
        />
      </CustomModal>
      <CustomModal
        openModal={open}
        handleClose={() => setOpen(false)}
        maxWidth="900px"
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <CloseIcon sx={{ fontSize: "16px" }} />
        </IconButton>
        <RentalCarQuickView
          carDetails={{
            ...carDetails,
            mainPrice: mainPrice(data, rentalSearch?.tripType),
          }}
          addToCartHandler={addToCartHandler}
          selectedTripType={rentalSearch?.tripType}
          tripHours={
            rentalSearch?.duration ||
            (cartList?.carts?.length > 0 &&
              cartList?.user_data?.estimated_hours)
          }
          quantity={isProductExist?.quantity || 1}
          isProductExist={isProductExist}
          count={isProductExist?.quantity}
          handleIncrement={handleIncrement}
          itemId={isProductExist?.id}
          handleDecrement={handleDecrement}
          updateLoading={updateIsLoading}
          removeItemCart={removeItemCart}
          userData={cartList?.user_data}
          tripDistance={cartList?.user_data?.distance}
          handleRentalTripType={handleRentalTripType}
          handleClose={() => {
            setOpen(false);
          }}
          setIsSameOpen={setIsSameOpen}
          setOpenTripChange={setOpenTripChange}
          updateCartObject={updateCartObject}
          setIds={setIds}
          setUpdateCartObject={setUpdateCartObject}
          openCarBookingModal={openCarBookingModal}
          handleIncrementFromCard={handleIncrement}
          handleDecrementFromCard={handleDecrement}
          from={fromSearch}
        />
      </CustomModal>
      <CustomModal
        openModal={isSameOpen}
        handleClose={() => {
          setIsSameOpen(false);
        }}
        maxWidth="380px"
      >
        <IconButton
          onClick={() => setIsSameOpen(false)}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <CloseIcon sx={{ fontSize: "16px" }} />
        </IconButton>
        <ChangeTripType
          cartList={cartList}
          setIsSameOpen={setIsSameOpen}
          userDataIsLoading={userDataIsLoading}
          handleChangePrvTripType={handleChangePrvTripType}
          updateCartObject={updateCartObject}
        />
      </CustomModal>
      <CustomModal openModal={openTripChange} maxWidth="380px">
        <TripModalContent
          title="Trip Vehicle List"
          onCloseModal={() => {
            setOpenTripChange(false);
          }}
          content={
            <TripVehicleList
              onCloseModal={() => {
                setOpenTripChange(false);
              }}
              ids={ids}
              cartLists={cartList?.carts}
              updateCartObject={updateCartObject}
              card
              confirmMutate={confirmMutate}
              dispatch={dispatch}
            />
          }
        />
      </CustomModal>
      <CustomModal
        openModal={openHourDiffModal}
        handleClose={() => {
          setOpenHourDiffModal(false);
        }}
        maxWidth="350px"
      >
        <IconButton
          onClick={() => setOpenHourDiffModal(false)}
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          <CloseIcon sx={{ fontSize: "16px" }} />
        </IconButton>
        <ChangeTripHours
          rentalSearch={rentalSearch}
          setOpenHourDiffModal={setOpenHourDiffModal}
          confirmIsLoading={confirmIsLoading}
          handleHourDiffModal={handleHourDiffModal}
          bookingDetails={bookingDetails}
          updateOrAdd={updateOrAdd}
        />
      </CustomModal>
    </>
  );
};

export default CarCard;
