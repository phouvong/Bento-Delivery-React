import React from "react";
import { alpha, Box } from "@mui/system";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  CustomRentalCard,
  useUpdateBookingCart,
  useDeleteItemFromBooking,
  removeItemFromCart,
  updateCart,
  setCartList,
} from "./imports";
import {t} from "i18next";

const CartPageCartContentCard = ({ item, userData, cartPage,showPrice }) => {
  const dispatch = useDispatch();
  const { mutate: updateMutate, isLoading: updateIsLoading } =
    useUpdateBookingCart();
  const { mutate } = useDeleteItemFromBooking();

  const handleIncrement = (cartItem) => {
    const updateQuantity = cartItem?.quantity + 1;
    if (item?.vehicle?.total_vehicle_count < updateQuantity) {
      toast.error(t(`You can't add more than ${item.vehicle?.total_vehicle_count} quantities of this vehicle.`));;
    } else {
      updateCart(
        cartItem,
        userData,
        dispatch,
        setCartList,
        updateQuantity,
        updateMutate
      );
    }
  };

  const handleDecrement = (cartItem) => {
    const updateQuantity = cartItem?.quantity - 1;
    updateCart(
      cartItem,
      userData,
      dispatch,
      setCartList,
      updateQuantity,
      updateMutate
    );
  };

  const removeItemCart = (cartItem) => {
    removeItemFromCart(cartItem, mutate, dispatch, setCartList);
  };

  return (
    <>
      <CustomRentalCard.root
        sx={{
          background: (theme) => alpha(theme.palette.neutral[200], 0.2),

          p: "20px",
          mb: "20px",
          justifyContent: "start",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <CustomRentalCard.image
          imgWidth={{
            xs: "100%",
            sm: "189px",
            lg: "160px",
          }}
          imgHeight={{
            xs: "120px",
            md: "80px",
          }}
          itemImage={item?.vehicle?.thumbnail_full_url}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flex: 1,
            flexWrap: { xs: "wrap", md: "nowrap" },
            gap: "5px",
          }}
        >
          <CustomRentalCard.details item={item} showPrice={showPrice} />
          <CustomRentalCard.counter
            isShowPrice={true}
            isVerticle={false}
            quantity={item.quantity}
            handleIncrement={handleIncrement}
            itemId={item?.id}
            handleDecrement={handleDecrement}
            updateIsLoading={updateIsLoading}
            removeItemCart={removeItemCart}
            price={
              userData?.rental_type === "hourly"
                ? item?.vehicle?.hourly_price
                : userData?.rental_type === "day_wise"
                  ? item?.vehicle?.day_wise_price
                  : item?.vehicle?.distance_price
            }

            item={item}
            // basePrice={item?}
          />
        </Box>
      </CustomRentalCard.root>
    </>
  );
};

export default CartPageCartContentCard;
