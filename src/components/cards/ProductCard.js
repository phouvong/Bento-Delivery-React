import DeleteIcon from "@mui/icons-material/Delete";
import {
  alpha,
  Card,
  CardMedia,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box, Stack } from "@mui/system";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  setCart,
  setDecrementToCartItem,
  setIncrementToCartItem,
  setRemoveItemFromCart,
} from "redux/slices/cart";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import {
  CustomBoxFullWidth,
  CustomSpan,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { textWithEllipsis } from "styled-components/TextWithEllipsis";
import CustomImageContainer from "../CustomImageContainer";
import FoodDetailModal from "../food-details/foodDetail-modal/FoodDetailModal";
import {
  ACTION,
  initialState,
  reducer,
} from "../product-details/product-details-section/states";
import CustomBadge from "./CustomBadge";

import FavoriteIcon from "@mui/icons-material/Favorite";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { getLanguage } from "helper-functions/getLanguage";
import { getModuleId } from "helper-functions/getModuleId";
import { getGuestId } from "helper-functions/getToken";
import { ModuleTypes } from "helper-functions/moduleTypes";
import {
  not_logged_in_message,
  out_of_limits,
  out_of_stock,
} from "utils/toasterMessages";
import useAddCartItem from "../../api-manage/hooks/react-query/add-cart/useAddCartItem";
import useCartItemUpdate from "../../api-manage/hooks/react-query/add-cart/useCartItemUpdate";
import useDeleteCartItem from "../../api-manage/hooks/react-query/add-cart/useDeleteCartItem";
import { addWishList, removeWishListItem } from "../../redux/slices/wishList";
import AmountWithDiscountedAmount from "../AmountWithDiscountedAmount";
import CustomDialogConfirm from "../custom-dialog/confirm/CustomDialogConfirm";
import CustomMultipleRatings from "../CustomMultipleRatings";
import GetLocationAlert from "../GetLocationAlert";
import { HeartWrapper } from "../home/stores-with-filter/cards-grid/StoresInfoCard";
import CustomLinearProgressbar from "../linear-progressbar";
import CustomModal from "../modal";
import CartClearModal from "../product-details/product-details-section/CartClearModal";
import {
  getItemDataForAddToCart,
  getPriceAfterQuantityChange,
} from "../product-details/product-details-section/helperFunction";
import Body2 from "../typographies/Body2";
import H3 from "../typographies/H3";
import AddWithIncrementDecrement from "./AddWithIncrementDecrement";
import { CustomOverLay } from "./Card.style";
import ModuleModal from "./ModuleModal";
import ProductsUnavailable from "./ProductsUnavailable";
import QuickView, { PrimaryToolTip } from "./QuickView";
import SpecialCard, { FoodHalalHaram, FoodVegNonVegFlag } from "./SpecialCard";

export const CardWrapper = styled(Card)(
  ({
    theme,
    cardheight,
    horizontalcard,
    wishlistcard,
    nomargin,
    cardType,
    cardFor,
    cardWidth,
    pharmaCommon,
  }) => ({
    cursor: "pointer",
    backgroundColor: theme.palette.background.custom6,

    padding: horizontalcard !== "true" && "10px",
    maxWidth:
      cardFor === "list-view"
        ? "100%"
        : horizontalcard === "true"
        ? "440px"
        : "320px",
    width:
      cardType === "vertical-type" || cardType === "list-view"
        ? "100%"
        : horizontalcard === "true" && "440px",
    margin:
      wishlistcard === "true"
        ? "0rem"
        : nomargin === "true"
        ? "0rem"
        : cardType === "vertical-type"
        ? "0rem"
        : ".7rem",
    borderRadius: "8px",
    height: cardheight ? cardheight : "220px",
    marginBottom: pharmaCommon && "20px !important",
    // boxShadow:
    //   theme.palette.mode !== "dark"
    //     ? "0px 30px 20px 0px rgba(0, 0, 0, 0.10)"
    //     : "0px 30px 20px 0px rgba(88, 110, 125, 0.10)",
    border:
      getCurrentModuleType() === ModuleTypes.FOOD &&
      `1px solid ${alpha(theme.palette.moduleTheme.food, 0.1)}`,

    "&:hover": {
      boxShadow:
        theme.palette.mode !== "dark"
          ? ` 0px 10px 20px 0px ${alpha(theme.palette.neutral[1000], 0.1)}`
          : "0px 10px 20px 0px rgba(88, 110, 125, 0.10)",
      img: {
        transform: "scale(1.05)",
      },
    },

    "&:hover .MuiTypography-subtitle1, &:hover .name": {},
    [theme.breakpoints.down("sm")]: {
      height:
        horizontalcard !== "true" ? "320px" : cardheight ? "130px" : "150px",
      width:
        horizontalcard === "true"
          ? cardFor === "list-view"
            ? "100%"
            : cardWidth
            ? cardWidth
            : "95%"
          : "100%",
      margin:
        wishlistcard === "true"
          ? "0rem"
          : nomargin === "true"
          ? "0rem"
          : ".4rem",
    },
    [theme.breakpoints.up("sm")]: {
      height: cardheight ? cardheight : "330px",
      //paddingBottom: horizontalcard === "true" && "10px",
    },
    [theme.breakpoints.up("md")]: {
      height: cardheight ? cardheight : "350px",
    },
  })
);
const CustomCardMedia = styled(CardMedia)(
  ({ theme, horizontalcard, loveItem }) => ({
    position: "relative",
    //overflow: "hidden",
    padding:
      loveItem === "true"
        ? "2px"
        : horizontalcard === "true"
        ? ".5rem"
        : "0rem",
    margin: "2px",
    //borderRadius: horizontalcard === "true" ? "0x 10px" : "10px 10px 0 0",
    height: horizontalcard === "true" ? "100%" : "212px",
    width: horizontalcard === "true" && "215px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "5px",
    ".MuiBox-root": {
      overflow: "hidden",
      borderRadius: "5px",
    },
    backgroundColor:
      horizontalcard === "true" ? theme.palette.neutral[100] : "none",
    [theme.breakpoints.down("sm")]: {
      width: horizontalcard === "true" ? "160px" : "100%",
      height: horizontalcard === "true" ? "135px" : "175px",
    },
  })
);
export const CustomCardButton = styled(CustomButtonPrimary)(
  ({ theme, disabled }) => ({
    background: disabled
      ? alpha(theme.palette.secondary.light, 0.3)
      : theme.palette.secondary.light,
  })
);

const ProductCard = (props) => {
  const {
    loveItem,
    item,
    cardheight,
    horizontalcard,
    changed_bg,
    wishlistcard,
    deleteWishlistItem,
    cardFor,
    noMargin,
    cardType,
    specialCard,
    cardWidth,
    sold,
    stock,
    pharmaCommon,
    noRecommended,
  } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [openModal, setOpenModal] = React.useState(false);
  const [openLocationAlert, setOpenLocationAlert] = useState(false);
  const { configData } = useSelector((state) => state.configData);
  const imageBaseUrl = configData?.base_urls?.item_image_url;
  const router = useRouter();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const reduxDispatch = useDispatch();
  const { cartList: aliasCartList } = useSelector((state) => state.cart);
  const cartList = getCartListModuleWise(aliasCartList);
  const classes = textWithEllipsis();
  const { t } = useTranslation();
  const p_off = t("%");
  const { wishLists } = useSelector((state) => state.wishList);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { mutate: addFavoriteMutation } = useAddToWishlist();
  const { mutate } = useWishListDelete();
  const [isProductExist, setIsProductExist] = useState(false);
  const [count, setCount] = useState(0);
  const { mutate: addToMutate, isLoading } = useAddCartItem();
  const { mutate: updateMutate, isLoading: updateLoading } =
    useCartItemUpdate();
  const { mutate: cartItemRemoveMutate } = useDeleteCartItem();
  useEffect(() => {
    const isInCart = getItemFromCartlist();
    if (isInCart) {
      setIsProductExist(true);
      setCount(isInCart?.quantity);
    } else {
      setIsProductExist(false);
    }
  }, [aliasCartList]);

  const getItemFromCartlist = () => {
    const cartList = getCartListModuleWise(aliasCartList);
    return cartList?.find((things) => things.id === item?.id);
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

  useEffect(() => {}, [state.clearCartModal]);
  const handleClearCartModalOpen = () =>
    dispatch({ type: ACTION.setClearCartModal, payload: true });
  const handleCloseForClearCart = (value) => {
    if (value === "add-item") {
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
      dispatch({ type: ACTION.setClearCartModal, payload: false });
    }
  };
  const handleBadge = () => {
    if (Number.parseInt(item?.store_discount) === 0) {
      if (Number.parseInt(item?.discount) > 0) {
        if (item?.discount_type === "percent") {
          return <CustomBadge top={10} text={`${item?.discount}${p_off}`} />;
        } else {
          return (
            <CustomBadge
              top={10}
              text={`${getAmountWithSign(
                item?.discount,
                item?.discount % 1 ? true : false
              )}`}
            />
          );
        }
      }
    } else {
      if (Number.parseInt(item?.store_discount) > 0) {
        return (
          <CustomBadge top={10} text={`${item?.store_discount}${p_off}`} />
        );
      }
    }
  };
  const handleClick = () => {
    if (item?.module_type === "ecommerce") {
      router.push({
        pathname: "/product/[id]",
        query: {
          id: `${item?.slug ? item?.slug : item?.id}`,
          module_id: `${getModuleId()}`,
        },
      });
    } else {
      dispatch({ type: ACTION.setOpenModal, payload: true });
    }
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
  const isInCart = cartList?.find((things) => things.id === item?.id);
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

  const addToCartHandler = () => {
    if (cartList.length > 0) {
      const isStoreExist = cartList.find(
        (item) => item?.store_id === state?.modalData[0]?.store_id
      );

      if (isStoreExist) {
        if (!isInCart) {
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
      } else {
        if (cartList.length !== 0) {
          handleClearCartModalOpen();
        }
      }
    } else {
      if (!isInCart) {
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
    }
  };

  const addToCart = (e) => {
    if (item?.module_type === "ecommerce") {
      if (item?.variations.length > 0) {
        router.push({
          pathname: "/product/[id]",
          query: {
            id: `${item?.slug ? item?.slug : item?.id}`,
            module_id: `${getModuleId()}`,
          },
        });
      } else {
        e.stopPropagation();
        addToCartHandler();
      }
    } else {
      if (item?.module_type === "food") {
        if (item?.food_variations?.length > 0) {
          dispatch({ type: ACTION.setOpenModal, payload: true });
        } else {
          e.stopPropagation();
          addToCartHandler();
        }
      } else if (item?.variations?.length > 0) {
        dispatch({ type: ACTION.setOpenModal, payload: true });
      } else {
        e.stopPropagation();
        addToCartHandler();
      }
    }
  };

  const quickViewHandleClick = () => {};
  const cartUpdateHandleSuccess = (res) => {
    if (res) {
      res?.forEach((item) => {
        if (isInCart?.cartItemId === item?.id) {
          const product = {
            ...item?.item,
            cartItemId: item?.id,
            totalPrice: item?.price,
            quantity: item?.quantity,
            food_variations: item?.item?.food_variations,
            selectedAddons: item?.item?.addons,
            itemBasePrice: item?.item?.price,
            selectedOption: item?.variation,
          };

          reduxDispatch(setIncrementToCartItem(product)); // Dispatch the single product
        }
      });
    }
  };
  const cartUpdateHandleSuccessDecrement = (res) => {
    if (res) {
      res?.forEach((item) => {
        const product = {
          ...item?.item,
          cartItemId: item?.id,
          totalPrice: item?.price,
          quantity: item?.quantity,
          food_variations: item?.item?.food_variations,
          selectedAddons: item?.item?.addons,
          itemBasePrice: item?.item?.price,
          selectedOption: item?.variation,
        };
        reduxDispatch(setDecrementToCartItem(product));
      });
    }
  };
  const handleIncrement = () => {
    const isExisted = getItemFromCartlist();
    const updateQuantity = isInCart?.quantity + 1;
    const itemObject = getItemDataForAddToCart(
      isInCart,
      updateQuantity,
      getPriceAfterQuantityChange(isInCart, updateQuantity),
      getGuestId()
    );
    if (isExisted) {
      if (getCurrentModuleType() === "food") {
        if (item?.maximum_cart_quantity) {
          if (item?.maximum_cart_quantity <= isExisted?.quantity) {
            toast.error(t(out_of_limits));
          } else {
            updateMutate(itemObject, {
              onSuccess: cartUpdateHandleSuccess,
              onError: onErrorResponse,
            });
          }
        } else {
          updateMutate(itemObject, {
            onSuccess: cartUpdateHandleSuccess,
            onError: onErrorResponse,
          });
        }
      } else {
        if (isExisted?.quantity + 1 <= item?.stock) {
          if (item?.maximum_cart_quantity) {
            if (item?.maximum_cart_quantity <= isExisted?.quantity) {
              toast.error(t(out_of_limits));
            } else {
              updateMutate(itemObject, {
                onSuccess: cartUpdateHandleSuccess,
                onError: onErrorResponse,
              });
            }
          } else {
            updateMutate(itemObject, {
              onSuccess: cartUpdateHandleSuccess,
              onError: onErrorResponse,
            });
            reduxDispatch(setIncrementToCartItem(isInCart));
          }
        } else {
          toast.error(t(out_of_stock));
        }
      }
    }
  };
  const handleClose = () => {
    dispatch({ type: ACTION.setOpenModal, payload: false });
  };

  const handleSuccessRemoveItem = () => {
    reduxDispatch(setRemoveItemFromCart(isInCart));
    toast.success(t("Removed from cart."));
  };
  const handleDecrement = () => {
    const updateQuantity = isInCart?.quantity - 1;

    const isExisted = getItemFromCartlist();
    if (isExisted?.quantity === 1) {
      const cartIdAndGuestId = {
        cart_id: isInCart?.cartItemId,
        guestId: getGuestId(),
      };
      cartItemRemoveMutate(cartIdAndGuestId, {
        onSuccess: handleSuccessRemoveItem,
        onError: onErrorResponse,
      });
    } else {
      const itemObject = getItemDataForAddToCart(
        isInCart,
        updateQuantity,
        getPriceAfterQuantityChange(isInCart, updateQuantity),
        getGuestId()
      );
      updateMutate(itemObject, {
        onSuccess: cartUpdateHandleSuccessDecrement,
        onError: onErrorResponse,
      });
    }
  };
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const popularCardUi = () => {
    return (
      <CustomStackFullWidth
        justifyContent="center"
        alignItems="flex-start"
        sx={{ position: "relative", padding: "13px 16px 16px 13px" }}
      >
        {isWishlisted && (
          <Box
            sx={{
              color: "primary.main",
              position: "absolute",
              top: 20,
              right: 10,
            }}
          >
            <FavoriteIcon sx={{ fontSize: "15px" }} />
          </Box>
        )}
        <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
          <Typography
            variant={horizontalcard === "true" ? "subtitle2" : "h6"}
            marginBottom="4px"
            sx={{
              lineHeight: "45px",
              textAlign: lanDirection === "rtl" && "end",
              color: (theme) => theme.palette.text.custom,
              fontSize: { xs: "13px", sm: "inherit" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              height: "36px",
              mt: "5px",
              width: "210px",
              [theme.breakpoints.down("sm")]: {
                width: "146px",
              },
            }}
            className="name"
            component="h3"
          >
            {item?.name}
          </Typography>
        </PrimaryToolTip>
        <Stack mt="5px">
          <Typography fontSize="10px" component="h4">
            {t("start from")}
          </Typography>
          <Typography
            fontSize={{ xs: "14px", md: "16px" }}
            fontWeight="600"
            color={theme.palette.text.primary}
            component="h4"
          >
            {getAmountWithSign(item?.price)}
          </Typography>
        </Stack>
        <CustomStackFullWidth
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
          mb="3px"
          paddingRight="3px"
        >
          <Typography
            mt="4px"
            color="text.secondary"
            variant={isSmall ? "body2" : "body1"}
          >
            {item?.unit_type}
          </Typography>
          <AddWithIncrementDecrement
            onHover={state.isTransformed}
            addToCartHandler={addToCart}
            isProductExist={isProductExist}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            count={count}
            isLoading={isLoading}
            updateLoading={updateLoading}
          />
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  };

  const listViewCardUi = () => {
    return (
      <CustomStackFullWidth
        justifyContent="space-between"
        alignItems="flex-start"
        spacing={1}
        p="1rem"
      >
        {isWishlisted && (
          <Box
            sx={{
              color: "primary.main",
              position: "absolute",
              top: 20,
              right: 10,
            }}
          >
            <FavoriteIcon sx={{ fontSize: "15px" }} />
          </Box>
        )}

        <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
          <H3 text={item?.name} component="h3" />
        </PrimaryToolTip>
        <CustomBoxFullWidth>
          {item?.module_type === "pharmacy" ? (
            <Typography
              className={classes.singleLineEllipsis}
              variant="body2"
              color="text.secondary"
              sx={{ wordBreak: "break-word" }}
              component="h4"
            >
              {item?.generic_name[0]}
            </Typography>
          ) : (
            <Body2 text={item?.store_name} component="h4" />
          )}
        </CustomBoxFullWidth>
        {item?.unit_type ? (
          <Typography
            sx={{
              color: (theme) => theme.palette.customColor.textGray,
            }}
          >
            {item?.unit_type}
          </Typography>
        ) : (
          <Typography
            sx={{
              color: (theme) => theme.palette.customColor.textGray,
            }}
          >
            {t("No unit type")}
          </Typography>
        )}

        <CustomStackFullWidth
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
          sx={{ pb: "15px" }}
        >
          <AmountWithDiscountedAmount item={item} />
          <AddWithIncrementDecrement
            onHover={state.isTransformed}
            addToCartHandler={addToCart}
            isProductExist={isProductExist}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            count={count}
            isLoading={isLoading}
            updateLoading={updateLoading}
          />
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  };
  const foodHorizontalCardUi = () => {
    return (
      <CustomStackFullWidth
        justifyContent="center"
        alignItems="flex-start"
        sx={{ position: "relative", padding: "13px 16px 16px 13px" }}
      >
        {isWishlisted && (
          <Box
            sx={{
              color: "primary.main",
              position: "absolute",
              top: 20,
              right: 10,
            }}
          >
            <FavoriteIcon sx={{ fontSize: "15px" }} />
          </Box>
        )}
        {/* <CustomStackFullWidth> */}
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          spacing={0.8}
        >
          <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
            <Typography
              variant={horizontalcard === "true" ? "subtitle2" : "h6"}
              marginBottom="4px"
              sx={{
                color: (theme) => theme.palette.text.custom,
                fontSize: { xs: "13px", sm: "inherit" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                lineHeight: "1.2", // Adjust this value to control line height
                mt: "5px",
              }}
              className="name"
              component="h3"
            >
              {item?.name}
            </Typography>
          </PrimaryToolTip>
          {configData?.toggle_veg_non_veg ? (
            <FoodVegNonVegFlag veg={item?.veg === 0 ? "false" : "true"} />
          ) : null}
        </CustomStackFullWidth>
        <Typography
          color="text.secondary"
          variant={isSmall ? "body2" : "body1"}
          component="h4"
        >
          {item?.store_name}
        </Typography>
        {/* </CustomStackFullWidth> */}
        <CustomStackFullWidth
          direction="row"
          alignItems="flex-start"
          // justifyContent="space-between"
          spacing={13}
          mb="3px"
          mt="10px"
        >
          <AmountWithDiscountedAmount item={item} />
        </CustomStackFullWidth>
        <CustomStackFullWidth
          alignItems="flex-end"
          sx={{ paddingRight: "6px" }}
        >
          <Box>
            <AddWithIncrementDecrement
              onHover={state.isTransformed}
              addToCartHandler={addToCart}
              isProductExist={isProductExist}
              handleIncrement={handleIncrement}
              handleDecrement={handleDecrement}
              count={count}
              isLoading={isLoading}
              updateLoading={updateLoading}
            />
          </Box>
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  };

  const verticalCardUi = () => {
    return (
      <CustomStackFullWidth
        justifyContent="center"
        alignItems="center"
        spacing={0.6}
        p={item?.module_type === "pharmacy" ? "5px 16px 16px 16px" : "1rem"}
      >
        {item?.module_type === "pharmacy" ? (
          <Typography
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "1",
              WebkitBoxOrient: "vertical",
              width: "100%",
              paddingTop: "3px",
              maxWidth: "200px",
              wordWrap: "break-word",
            }}
            variant="body2"
            color="#93A2AE"
            textAlign="center"
            component="h4"
          >
            {item?.generic_name[0]}
          </Typography>
        ) : (
          <Body2 text={item?.store_name} component="h4" />
        )}

        <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
          <Typography
            className={classes.singleLineEllipsis}
            fontSize={{ xs: "12px", md: "14px" }}
            fontWeight="500"
            component="h3"
          >
            {item?.name}
          </Typography>
        </PrimaryToolTip>
        <CustomStackFullWidth
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
        >
          {cardType === "vertical-type" ? (
            <Typography>{item?.unit_type}</Typography>
          ) : (
            <CustomMultipleRatings rating={4.5} withCount />
          )}

          <AmountWithDiscountedAmount item={item} />
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  };
  const verticalCardFlashUi = () => {
    return (
      <CustomStackFullWidth
        justifyContent="center"
        alignItems="center"
        spacing={1.5}
        // p="1rem"
        p="0 4px"
      >
        <Body2 text={item?.store_name} />
        <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
          <H3 text={item?.name} component="h3" />
        </PrimaryToolTip>
        <CustomStackFullWidth
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
        >
          {cardType === "vertical-type" ? (
            <Typography>{item?.unit_type}</Typography>
          ) : (
            <CustomMultipleRatings rating={4.5} withCount />
          )}

          {stock === 0 ? (
            <Typography
              variant="h5"
              display="flex"
              alignItems="center"
              flexWrap="wrap"
              gap="5px"
              sx={{
                fontSize: { xs: "13px", sm: "18px" },
                color: alpha(theme.palette.error.deepLight, 0.7),
              }}
            >
              {t("Out of Stock")}
            </Typography>
          ) : (
            <AmountWithDiscountedAmount item={item} />
          )}
          <CustomStackFullWidth mt="100px" spacing={1}>
            <CustomLinearProgressbar value={(sold / stock) * 100} height={3} />
            <CustomStackFullWidth
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                fontSize="11px"
                fontWeight="bold"
                lineHeight="16px"
                variant="body2"
              >
                <CustomSpan>{t("Sold")}</CustomSpan> : {sold} {t("items")}
              </Typography>
              <Typography
                fontSize="11px"
                fontWeight="bold"
                lineHeight="16px"
                variant="body2"
              >
                <CustomSpan>{t("Available")}</CustomSpan> : {stock} {t("items")}
              </Typography>
            </CustomStackFullWidth>
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  };
  const verticalCardFlashSliderUi = () => {
    return (
      <CustomStackFullWidth
        justifyContent="center"
        alignItems="center"
        spacing={1.5}
        p="1rem"
      >
        <Body2 text={item?.store_name} component="h4" />
        <PrimaryToolTip text={item?.name} placement="bottom" arrow="false">
          <H3 text={item?.name} component="h3" />
        </PrimaryToolTip>
        <CustomStackFullWidth
          justifyContent="center"
          alignItems="center"
          spacing={0.5}
        >
          {cardType === "vertical-type" ? (
            <Typography>{item?.unit_type}</Typography>
          ) : (
            <CustomMultipleRatings rating={4.5} withCount />
          )}
          <AmountWithDiscountedAmount item={item} />
        </CustomStackFullWidth>
      </CustomStackFullWidth>
    );
  };
  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    let token = undefined;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    if (token) {
      addFavoriteMutation(item?.id, {
        onSuccess: (response) => {
          if (response) {
            reduxDispatch(addWishList(item));
            setIsWishlisted(true);
            toast.success(response?.message);
          }
        },
        onError: (error) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error(t(not_logged_in_message));
  };
  const removeFromWishlistHandler = (e) => {
    e.stopPropagation();
    const onSuccessHandlerForDelete = (res) => {
      reduxDispatch(removeWishListItem(item?.id));
      setIsWishlisted(false);
      toast.success(res.message, {
        id: "wishlist",
      });
    };
    mutate(item?.id, {
      onSuccess: onSuccessHandlerForDelete,
      onError: (error) => {
        toast.error(error.response.data.message);
      },
    });
  };

  const handleHoverOnCartIcon = (value) => {
    dispatch({ type: ACTION.setIsTransformed, payload: value });
  };

  return (
    <Stack sx={{ position: "relative" }}>
      {state.openModal && getCurrentModuleType() === "food" && item ? (
        <FoodDetailModal
          product={item}
          imageBaseUrl={imageBaseUrl}
          open={state.openModal}
          handleModalClose={handleClose}
          setOpen={(value) =>
            dispatch({ type: ACTION.setOpenModal, payload: value })
          }
          addToWishlistHandler={addToWishlistHandler}
          removeFromWishlistHandler={removeFromWishlistHandler}
          isWishlisted={isWishlisted}
        />
      ) : (
        <>
          {cardFor === "flashSale" ? (
            <>
              {stock !== 0 && (
                <ModuleModal
                  open={state.openModal}
                  handleModalClose={handleClose}
                  configData={configData}
                  productDetailsData={item}
                  addToWishlistHandler={addToWishlistHandler}
                  removeFromWishlistHandler={removeFromWishlistHandler}
                  isWishlisted={isWishlisted}
                />
              )}
            </>
          ) : (
            item && (
              <ModuleModal
                open={state.openModal}
                handleModalClose={handleClose}
                configData={configData}
                productDetailsData={item}
                addToWishlistHandler={addToWishlistHandler}
                removeFromWishlistHandler={removeFromWishlistHandler}
                isWishlisted={isWishlisted}
              />
            )
          )}
        </>
      )}
      {wishlistcard === "true" && (
        <HeartWrapper onClick={() => setOpenModal(true)} top="5px" right="5px">
          <DeleteIcon style={{ color: theme.palette.error.light }} />
        </HeartWrapper>
      )}

      {specialCard === "true" ? (
        <SpecialCard
          item={item}
          imageBaseUrl={imageBaseUrl}
          quickViewHandleClick={quickViewHandleClick}
          addToCart={addToCart}
          handleBadge={handleBadge}
          addToCartHandler={addToCart}
          isProductExist={isProductExist}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
          count={count}
          handleClick={handleClick}
          isLoading={isLoading}
          updateLoading={updateLoading}
          setOpenLocationAlert={setOpenLocationAlert}
          noRecommended={noRecommended}
          configData={configData}
        />
      ) : (
        <CardWrapper
          cardFor={cardFor}
          cardType={cardType}
          nomargin={noMargin ? "true" : "false"}
          cardheight={cardheight}
          horizontalcard={horizontalcard}
          wishlistcard={wishlistcard}
          cardWidth={cardWidth}
          pharmaCommon={pharmaCommon}
          onClick={() => handleClick()}
          onMouseEnter={() =>
            dispatch({
              type: ACTION.setIsTransformed,
              payload: true,
            })
          }
          onMouseDown={() =>
            dispatch({
              type: ACTION.setIsTransformed,
              payload: true,
            })
          }
          onMouseLeave={() =>
            dispatch({
              type: ACTION.setIsTransformed,
              payload: false,
            })
          }
        >
          <CustomStackFullWidth
            direction={{
              xs: horizontalcard === "true" ? "row" : "column",
              sm: horizontalcard === "true" ? "row" : "column",
            }}
            justifyContent="flex-start"
            height="100%"
            sx={{
              backgroundColor:
                horizontalcard === "true" &&
                changed_bg === "true" &&
                "primary.semiLight",
              position: "relative",
            }}
          >
            <CustomCardMedia
              horizontalcard={horizontalcard}
              loveItem={loveItem}
            >
              {item?.module?.module_type === "pharmacy" && (
                <Stack
                  width="100%"
                  alignItems="center"
                  justifyContent="center"
                  padding={{
                    xs: "3px 3px 8px 3px",
                    md: "3px 3px 3px 3px",
                  }}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#B3B3B399" : "#EDEDED99",
                    color: theme.palette.neutral[1000],
                    fontSize: "12px",
                    zIndex: "999",
                  }}
                  component="h4"
                >
                  {item?.store_name}
                </Stack>
              )}
              {handleBadge()}
              <CustomImageContainer
                src={item?.image_full_url}
                alt={item?.title}
                height="100%"
                width="100%"
                objectfit="cover"
                borderRadius="3px"
              />
              {item?.module?.module_type === "food" && (
                <ProductsUnavailable product={item} />
              )}
              {item?.halal_tag_status && item?.is_halal ? (
                <FoodHalalHaram width={30} />
              ) : (
                ""
              )}
              <CustomOverLay hover={state.isTransformed} border_radius="10px">
                <QuickView
                  quickViewHandleClick={quickViewHandleClick}
                  addToWishlistHandler={addToWishlistHandler}
                  removeFromWishlistHandler={removeFromWishlistHandler}
                  isWishlisted={isWishlisted}
                  isProductExist={isProductExist}
                  addToCartHandler={addToCart}
                  showAddtocart={cardFor === "vertical" && !isProductExist}
                  isLoading={isLoading}
                  openLocationAlert={openLocationAlert}
                  setOpenLocationAlert={setOpenLocationAlert}
                />
              </CustomOverLay>
              {cardFor === "vertical" && isProductExist && (
                <Box
                  sx={{
                    position: "absolute",
                    right: 10,
                    bottom: 0,
                    zIndex: 999,
                  }}
                >
                  <AddWithIncrementDecrement
                    verticalCard
                    onHover={state.isTransformed}
                    addToCartHandler={addToCart}
                    isProductExist={isProductExist}
                    handleIncrement={handleIncrement}
                    handleDecrement={handleDecrement}
                    setIsHover={handleHoverOnCartIcon}
                    count={count}
                    updateLoading={updateLoading}
                  />
                </Box>
              )}
            </CustomCardMedia>
            <CustomStackFullWidth justifyContent="center">
              {cardFor === "popular items" && popularCardUi()}
              {cardFor === "vertical" && verticalCardUi()}
              {cardFor === "flashSale" && verticalCardFlashUi()}
              {cardFor === "flashSaleSlider" && verticalCardFlashSliderUi()}
              {cardFor === "food horizontal card" && foodHorizontalCardUi()}
              {cardFor === "list-view" && listViewCardUi()}
            </CustomStackFullWidth>
          </CustomStackFullWidth>
        </CardWrapper>
      )}

      <CustomModal openModal={state.clearCartModal} handleClose={handleClose}>
        <CartClearModal
          handleClose={handleCloseForClearCart}
          dispatchRedux={reduxDispatch}
          addToCard={addToCartHandler}
        />
      </CustomModal>
      <CustomDialogConfirm
        dialogTexts={t("Are you sure you want to  delete this item?")}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => deleteWishlistItem(item?.id)}
      />
      <CustomModal
        openModal={openLocationAlert}
        handleClose={() => setOpenLocationAlert(false)}
      >
        <GetLocationAlert setOpenAlert={setOpenLocationAlert} />
      </CustomModal>
    </Stack>
  );
};

ProductCard.propTypes = {};

export default ProductCard;
