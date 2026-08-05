import React, { useEffect, useReducer, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { Stack } from "@mui/system";
import { IconButton, Typography } from "@mui/material";
import deleteIcon from "assets/delete.png";
import { useTheme } from "@emotion/react";
import { CustomIconButton } from "styled-components/CustomButtons.style";
import { useDispatch, useSelector } from "react-redux";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { setCart, setCartList } from "redux/slices/cart";
import toast from "react-hot-toast";
import {
  ACTION,
  initialState,
  reducer,
} from "components/product-details/product-details-section/states";
import { t } from "i18next";
import { removeWishListVehicle } from "redux/slices/wishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import { getGuestId } from "helper-functions/getToken";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import CloseIcon from "@mui/icons-material/Close";
import RentalCarQuickView from "components/home/module-wise-components/rental/components/global/RentalCarQuickView";
import { mainPrice } from "components/home/module-wise-components/rental/components/utils/bookingHepler";
import {
  removeItemFromCart,
  updateCart,
} from "components/home/module-wise-components/rental/components/rental-cart/helper";
import useUpdateBookingCart from "components/home/module-wise-components/rental/rental-api-manage/hooks/react-query/confirm-booking/useUpdateBookingCart";
import RentalCartIcon from "components/home/module-wise-components/rental/components/global/icon/RentalCartIcon";
import dynamic from "next/dynamic";
import { useRemoveRentalWishList } from "api-manage/hooks/react-query/rental-wishlist/useRemoveWishlist";
import CustomImageContainer from "components/CustomImageContainer";
import AmountWithDiscountedAmount from "components/AmountWithDiscountedAmount";
import Loading from "components/custom-loading/Loading";
import CustomDivider from "components/CustomDivider";
import CustomModal from "components/modal";
import CustomDialogConfirm from "components/custom-dialog/confirm/CustomDialogConfirm";
import CartClearModal from "components/product-details/product-details-section/CartClearModal";
import useAddCartItem from "api-manage/hooks/react-query/add-cart/useAddCartItem";
import { Router, useRouter } from "next/router";
const CarBookingModal = dynamic(() =>
  import(
    "components/home/module-wise-components/rental/components/global/CarBookingModal"
  )
);

const RentalWishListCard = ({ item }) => {
  const theme = useTheme();
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const reduxDispatch = useDispatch();
  const [openModal, setOpenModal] = React.useState(false);
  const [openItemModal, setOpenItemModal] = useState(false);
  const [carDetails, setCarDetails] = useState({});
  const [state, dispatch] = useReducer(reducer, initialState);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [cartItemData, setCartItemData] = useState({});
  const [sameProvider,setSameProvider]=useState(false)

  const { cartList: aliasCartList } = useSelector((state) => state.cart);
  const cartList = getCartListModuleWise(aliasCartList);
  const { wishLists } = useSelector((state) => state.wishList);
  const { mutate } = useWishListDelete();
  const { rentalSearch } = useSelector((state) => state?.rentalSearch);
  const { mutate: addToMutate, isLoading } = useAddCartItem();
  const handleCloseCart = () => {
    dispatch({ type: ACTION.setOpenModal, payload: false });
  };

  const handleClearCartModalOpen = () =>
    dispatch({ type: ACTION.setClearCartModal, payload: true });
  const handleCloseForClearCart = (value) => {
    if (value === "add-item") {
      reduxDispatch(
        setCart({
          ...state.modalData[0],
          selectedOption: [],
        })
      );
      dispatch({ type: ACTION.setClearCartModal, payload: false });
    } else {
      dispatch({ type: ACTION.setClearCartModal, payload: false });
    }
  };
  const isProductExist = cartList?.carts?.find(
    (item) => item.vehicle?.id === item?.id
  );
  const handleIncrement = (cartItem) => {
    const updateQuantity = cartItem?.quantity + 1;
    if (item.vehicle?.total_vehicles < updateQuantity) {
      toast.error(t(`Vehicle can have up to ${item.vehicle?.total_vehicles?.total_vehicles} rental options; no more can be added`));
    }else{
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
  const handleDecrement = (cartItem) => {
    const updateQuantity = cartItem?.quantity - 1;
    updateCart(
      cartItem,
      cartList?.user_data,
      dispatch,
      setCartList,
      updateQuantity,
      updateMutate
    );
  };
  const { mutate: updateMutate, isLoading: updateIsLoading } =
    useUpdateBookingCart();

  const removeItemCart = (cartItem) => {
    removeItemFromCart(cartItem, mutate, dispatch, setCartList);
  };

  useEffect(() => {
    if (item) {
      dispatch({
        type: ACTION.setModalData,
        payload: {
          ...item,
          quantity: 1,
          price: item?.price,
          totalPrice: item?.price,
        },
      });
    }
  }, [item]);
  const handleSuccess = (res) => {
    if (res) {
      let product = {};
      res?.forEach((item) => {
        product = {
          ...item?.item,
          cartItemId: item?.id,
          quantity: item?.quantity,
          totalPrice: item?.price,
          selectedOption: [],
        };
      });
      reduxDispatch(setCart(product));
      toast.success(t("Item added to cart"));
      dispatch({ type: ACTION.setClearCartModal, payload: false });
    }
  };
  const addToRentalCartHandler = () => {
    setOpenBookingModal(true);
  };
  const addToCartHandler = () => {
    if (cartList.length > 0) {
      const isStoreExist = cartList.find(
        (item) => item?.store_id === state?.modalData[0]?.store_id
      );

      if (isStoreExist) {
        const itemObject = {
          guest_id: getGuestId(),
          model: state.modalData[0]?.available_date_starts
            ? "ItemCampaign"
            : "Item",
          add_on_ids: [],
          add_on_qtys: [],
          item_id: state.modalData[0]?.id,
          price: state?.modalData[0]?.price,
          quantity: state?.modalData[0]?.quantity,
          variation: [],
        };
        addToMutate(itemObject, {
          onSuccess: handleSuccess,
          onError: onErrorResponse,
        });
      } else {
        if (cartList.length !== 0) {
          handleClearCartModalOpen();
        }
      }
    } else {
      const itemObject = {
        guest_id: getGuestId(),
        model: state.modalData[0]?.available_date_starts
          ? "ItemCampaign"
          : "Item",
        add_on_ids: [],
        add_on_qtys: [],
        item_id: state.modalData[0]?.id,
        price: state?.modalData[0]?.price,
        quantity: state?.modalData[0]?.quantity,
        variation: [],
      };
      addToMutate(itemObject, {
        onSuccess: handleSuccess,
        onError: onErrorResponse,
      });
    }
  };
  const addToCart = (e) => {
    setCarDetails(item);
    setOpenItemModal(true);
  };

  const { mutate: removeFavoriteMutation } = useRemoveRentalWishList();
  const removeFromRentalWishlistHandler = (e) => {
    const onSuccessHandlerForDelete = (res) => {
      reduxDispatch(removeWishListVehicle(item?.id));
      setIsWishlisted(false);
      toast.success(res.message, {
        id: "wishlist",
      });
    };
    removeFavoriteMutation(
      { key: "vehicle_id", id: item?.id },
      {
        onSuccess: onSuccessHandlerForDelete,
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      }
    );
  };

  useEffect(() => {
    wishlistItemExistHandler();
  }, [wishLists]);

  const wishlistItemExistHandler = () => {
    if (wishLists?.item?.find((wishItem) => wishItem.id === item?.id)) {
      setIsWishlisted(true);
    } else {
      setIsWishlisted(false);
    }
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    setOpenModal(true);
  };
  const isDifferentProvider = cartList?.carts?.some(
    (cart) => cart.provider?.id !== item?.provider?.id
  );

  const handleProviderCheck = (payload) => {
    setSameProvider(payload)
  };

  return (
    <>
      <CustomStackFullWidth
        direction="row"
        sx={{ marginTop: "1rem", cursor: "pointer" }}
        gap="10px"
      >
        <CustomImageContainer
          src={item?.thumbnail_full_url}
          width="60px"
          height="60px"
          borderRadius="5px"
        />
        <Stack width="0px" flexGrow="1" justifyContent="center" spacing={0.5}>
          <Typography fontWeight="500" fontSize="14px"  onClick={() =>
            router.push({
              pathname: `/rental/vehicle/${item?.slug|| item?.id}`,
              query: {
                from: "",
              },
            })
          }>
            {item?.name}
          </Typography>
          <Typography fontWeight="400" fontSize="14px">
            {item?.provider?.name}
          </Typography>
          <AmountWithDiscountedAmount item={item} />
          <Typography fontWeight="500" fontSize="16px"></Typography>
        </Stack>
        <Stack direction="row" gap="20px" alignSelf="center">
          {/* <CustomIconButton onClick={(e) => addToCart(e)}>
            {isLoading ? (
              <Loading />
            ) : (
              <RentalCartIcon
                width="18px"
                height="18px"
                color={theme.palette.primary.main}
              />
            )}
          </CustomIconButton> */}
          <IconButton onClick={(e) => handleDelete(e)}>
            <CustomImageContainer
              src={deleteIcon?.src}
              width="18px"
              height="18px"
            />
          </IconButton>
        </Stack>
      </CustomStackFullWidth>
      <CustomDivider paddingTop="1rem" width="100%" />
      {openBookingModal && (
        <CarBookingModal
          open={openBookingModal}
          handleClose={() => setOpenBookingModal(false)}
          id={item?.id}
          fromCard={cartList?.carts?.length > 0}

          // isDifferentProvider={isDifferentProvider}
          handleProviderCheck={handleProviderCheck}
          setCartItemData={setCartItemData}
          // selectedPricing={state.selectedTripType}
          isHourly={item?.trip_hourly}
          isDistence={item?.trip_distance}
          isDayWise={item?.trip_day_wise
          }
          card
          callUpdateUserData={false}
        />
      )}
      {openItemModal && (
        <CustomModal
          openModal={openItemModal}
          handleClose={() => setOpenItemModal(false)}
          maxWidth="900px"
        >
          <IconButton
            onClick={() => setOpenItemModal(false)}
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <CloseIcon sx={{ fontSize: "16px" }} />
          </IconButton>
          <RentalCarQuickView
            carDetails={{ ...carDetails, mainPrice: mainPrice(item,rentalSearch?.tripType) }}
            addToCartHandler={addToRentalCartHandler}
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
          />
        </CustomModal>
      )}
      <CustomDialogConfirm
        dialogTexts={t("Are you sure you want to  delete this item?")}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={removeFromRentalWishlistHandler}
      />
      <CustomModal
        openModal={state.clearCartModal}
        handleClose={handleCloseCart}
      >
        <CartClearModal
          dispatchRedux={reduxDispatch}
          handleClose={handleCloseForClearCart}
          addToCard={addToCartHandler}
        />
      </CustomModal>
    </>
  );
};

export default RentalWishListCard;
