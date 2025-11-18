import React, { useEffect, useRef, useState } from "react";
import {
  alpha,
  Avatar,
  IconButton,
  NoSsr,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import LogoSide from "../../logo/LogoSide";
import NavLinks from "./NavLinks";
import { t } from "i18next";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useRouter } from "next/router";
import NavBarIcon from "./NavBarIcon";
import { useDispatch, useSelector } from "react-redux";
import AccountPopover from "./account-popover";
import CardView from "../../added-cart-view";
import CustomContainer from "../../container";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import ModuleWiseNav from "./ModuleWiseNav";
import WishListCardView from "../../wishlist";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import useGetAllCartList from "../../../api-manage/hooks/react-query/add-cart/useGetAllCartList";
import { setCartList } from "redux/slices/cart";
import { clearOfflinePaymentInfo } from "redux/slices/offlinePaymentData";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { getModule } from "helper-functions/getLanguage";
import { handleProductValueWithOutDiscount } from "utils/CustomFunctions";
import useGetGuest from "../../../api-manage/hooks/react-query/guest/useGetGuest";
import ThemeSwitches from "../top-navbar/ThemeSwitches";
import CallToAdmin from "../../CallToAdmin";
import CustomLanguage from "../top-navbar/language/CustomLanguage";
import { SignInButton } from "components/header/NavBar.style";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import dynamic from "next/dynamic";
import TaxiView from "components/home/module-wise-components/rental/components/home/TaxiView";
import useGetBookingList from "api-manage/hooks/react-query/useGetBookingList";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import Box from "@mui/material/Box";
import cookie from "js-cookie";
import CustomModal from "components/modal";
import ForgotPassword from "components/auth/ForgotPassword/ForgotPassword";
import { setOpenForgotPasswordModal } from "redux/slices/utils";
import TrackOrderSvg from "components/header/TrackOrderSvg";
import NextImage from "components/NextImage";
import trackImage from "./assets/fi_2726193.png"
const AuthModal = dynamic(() => import("components/auth/AuthModal"));

const Cart = ({ isLoading }) => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const { cartList } = useSelector((state) => state.cart);
  const handleIconClick = () => {
    setSideDrawerOpen(true);
  };
  return (
    <>
      <NavBarIcon
        icon={<ShoppingCartOutlinedIcon sx={{ fontSize: "22px" }} />}
        label={t("Cart")}
        user="false"
        handleClick={handleIconClick}
        badgeCount={
          getCartListModuleWise(cartList)?.length > 0
            ? getCartListModuleWise(cartList).length
            : null // or use `0` if you want the badge to show as "0"
        }
      />
      {!!sideDrawerOpen && (
        <CardView
          isLoading={isLoading}
          sideDrawerOpen={sideDrawerOpen}
          setSideDrawerOpen={setSideDrawerOpen}
          cartList={cartList}
        />
      )}
    </>
  );
};

export const Taxi = ({ isLoading, label, color }) => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const { cartList } = useSelector((state) => state.cart);
  const handleIconClick = () => {
    setSideDrawerOpen(true);
  };

  return (
    <>
      <NavBarIcon
        icon={
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <DirectionsCarOutlinedIcon sx={{ fontSize: "20px", color: color || "inherit" }} />
            {label && (
              <Typography
                sx={{
                  color: (theme) => theme.palette.neutral[1000],
                }}
                variant="caption"
              >
                {label}
              </Typography>
            )}
          </Box>
        }
        user="false"
        handleClick={handleIconClick}
        badgeCount={
          getCartListModuleWise(cartList?.carts)?.length > 0
            ? getCartListModuleWise(cartList?.carts).length
            : null // or use `0` if you want the badge to show as "0"
        }
      />

      {!!sideDrawerOpen && (
        <TaxiView
          isLoading={isLoading}
          sideDrawerOpen={sideDrawerOpen}
          setSideDrawerOpen={setSideDrawerOpen}
          cartList={cartList}
        />
      )}
    </>
  );
};

const WishListSideBar = ({ totalWishList }) => {
  const [wishListSideDrawerOpen, setWishListSideDrawerOpen] = useState(false);
  const handleIconClick = () => {
    setWishListSideDrawerOpen(true);
  };
  return (
    <>
      <NavBarIcon
        id="wish-list-icon"
        icon={<FavoriteBorderIcon sx={{ fontSize: "22px" }} />}
        label={t("WishList")}
        user="false"
        handleClick={handleIconClick}
        badgeCount={totalWishList > 0 ? totalWishList : null}
      />

      {!!wishListSideDrawerOpen && (
        <WishListCardView
          sideDrawerOpen={wishListSideDrawerOpen}
          setSideDrawerOpen={setWishListSideDrawerOpen}
        />
      )}
    </>
  );
};

export const getSelectedVariations = (variations) => {
  let selectedItem = [];
  if (variations?.length > 0) {
    variations?.forEach((item, index) => {
      item?.values?.forEach((value, optionIndex) => {
        if (value?.isSelected) {
          const itemObj = {
            choiceIndex: index,
            isSelected: value?.isSelected,
            label: value?.label,
            optionIndex: optionIndex,
            optionPrice: value?.optionPrice,
            // type:item?.
          };
          selectedItem.push(itemObj);
        }
      });
    });
  }
  return selectedItem;
};
const getOtherModuleVariation = (itemVariations, selectedVariation) => {
  let selectedItem = [];
  itemVariations?.forEach((item) => {
    selectedVariation?.forEach((sVari) => {
      if (sVari?.type === item?.type) {
        selectedItem.push(item);
      }
    });
  });

  return selectedItem;
};
const SecondNavBar = ({ configData }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { cartList } = useSelector((state) => state.cart);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const { offlineInfoStep } = useSelector((state) => state.offlinePayment);
  const { countryCode, language } = useSelector((state) => state.configData);
  const isSmall = useMediaQuery("(max-width:1180px)");
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const [openPopover, setOpenPopover] = useState(false);
  const [moduleType, SetModuleType] = useState("");
  const { wishLists } = useSelector((state) => state.wishList);
  const [toggled, setToggled] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const anchorRef = useRef(null);
  const [modalFor, setModalFor] = useState("sign-in");
  const { openForgotPasswordModal } = useSelector((state) => state.utilsData);
  let token = undefined;
  let location = undefined;
  let zoneId = undefined;
  let guestId = undefined;
  const currentModuleType = getCurrentModuleType();

  let totalWishList = undefined;
  if (currentModuleType === "rental") {
    totalWishList = wishLists?.vehicles?.length + wishLists?.providers?.length;
  } else {
    totalWishList = wishLists?.item?.length + wishLists?.store?.length;
  }

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  if (typeof window !== "undefined") {
    guestId = localStorage.getItem("guest_id");
  }

  const {
    data: guestData,
    refetch: guestRefetch,
    isLoading: guestIsLoading,
  } = useGetGuest();

  useEffect(() => {
    const fetchGuestId = async () => {
      try {
        // Check if there is no guest ID in local storage
        if (!guestId) {
          // Trigger API call to get guest ID
          await guestRefetch();
        }
      } catch (error) {
        // Handle error (e.g., log it or show a notification)
        console.error("Error fetching guest ID:", error);
      }
    };

    // Call the function to fetch guest ID
    fetchGuestId();
  }, [guestId, guestRefetch]);

  useEffect(() => {
    // Update guestId when guestData is available
    if (guestData?.guest_id) {
      localStorage.setItem("guest_id", guestData.guest_id);
      guestId = guestData.guest_id;
    }
  }, [guestData]);

  const {
    data,
    refetch: cartListRefetch,
    isLoading,
  } = useGetAllCartList(guestId);

  const {
    data: bookingLists,
    isLoading: bookingListsIsLoading,
    refetch: bookingRefetch,
  } = useGetBookingList(guestId);

  useEffect(() => {
    if (moduleType) {
      if (moduleType === "rental") {
        bookingRefetch();
      } else {
        cartListRefetch();
      }
    }
  }, [moduleType]);

  const setItemIntoCart = () => {
    return data?.map((item) => ({
      ...item?.item,
      cartItemId: item?.id,
      totalPrice:
        handleProductValueWithOutDiscount({
          ...item?.item,
          selectedOption:
            getModule()?.module_type !== "food"
              ? getOtherModuleVariation(item?.item?.variations, item?.variation)
              : [],
        }) * item?.quantity,
      selectedAddons: item?.item?.addons,
      quantity: item?.quantity,
      food_variations: item?.item?.food_variations,
      itemBasePrice: item?.item?.price,
      selectedOption:
        getModule()?.module_type !== "food"
          ? getOtherModuleVariation(item?.item?.variations, item?.variation)
          : getSelectedVariations(item?.item?.food_variations),
    }));
  };

  useEffect(() => {
    if (moduleType === "rental") {
      dispatch(setCartList(bookingLists));
      if (bookingLists?.carts?.length > 0) {
        cookie.set("cart-list", bookingLists?.carts?.length);
      }
    } else {
      dispatch(setCartList(setItemIntoCart()));
    }
  }, [data, moduleType, bookingLists, location]);

  useEffect(() => {
    if (offlineInfoStep !== 0) {
      if (router.pathname !== "/checkout") {
        dispatch(clearOfflinePaymentInfo());
      }
    }
  }, []);

  useEffect(() => {
    SetModuleType(selectedModule?.module_type);
  }, [selectedModule]);

  if (typeof window !== "undefined") {
    location = localStorage.getItem("location");
    token = localStorage.getItem("token");
    zoneId = JSON.parse(localStorage.getItem("zoneid"));
  }

  const handleOpenPopover = () => {
    setOpenPopover(true);
  };
  const handleWishlistClick = (pathName) => {
    router.push({
      pathname: "/profile",
      query: {
        page: pathName,
      },
    });
  };

  const handleTrackOrder = () => {
    router.push({
      pathname: "/track-order",
    });
  };
  const handleClose = () => {
    setModalFor("sign-in");
    setOpenSignIn(false);
  };
  const getMobileScreenComponents = () => (
    <ModuleWiseNav
      router={router}
      configData={configData}
      token={token}
      setToggled={setToggled}
      location={location}
      setOpenSignIn={setOpenSignIn}
      setModalFor={setModalFor}
    />
  );
  const getDesktopScreenComponents = () => (
    <CustomStackFullWidth
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        marginLeft: "0 !important",
      }}
    >
      <Stack direction="row" alignItems="center" width="100%">
        {!isSmall && (
          <LogoSide
            width="110px"
            height="50px"
            configData={configData}
            objectFit="contain"
          />
        )}
        {!isSmall && location && (
          <NavLinks t={t} zoneid="zoneid" moduleType={moduleType} />
        )}
      </Stack>

      {!isSmall && (
        <CustomStackFullWidth
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={2.5}
        >
          {!token && moduleType !== "parcel" && location && (
            <IconButton onClick={handleTrackOrder} id="track-order-button">
              <Tooltip
                title={moduleType !== "rental" ? t("Track order") : t("Track Trip")}
                arrow
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: (theme) => theme.palette.toolTipColor,
                      "& .MuiTooltip-arrow": {
                        color: (theme) => theme.palette.toolTipColor,
                      },
                    },
                  },
                }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_8090_182934)">
                    <path
                      d="M20.5925 10.1037C19.5446 9.05571 18.1288 8.59448 16.757 8.71965V3.91016C16.757 2.84397 15.8896 1.97656 14.8235 1.97656H1.90506C0.89723 1.97656 0 2.82386 0 3.91016V16.8008C0 17.867 0.867367 18.7344 1.93351 18.7344C15.3016 18.69 14.9 18.8404 15.5132 18.6065L16.7414 19.8346C16.9931 20.0864 17.4011 20.0863 17.6528 19.8346L20.5925 16.8948C22.469 15.0181 22.4693 11.9806 20.5925 10.1037ZM7.13247 3.26563H9.71046V6.48828H7.13247V3.26563ZM1.93351 17.4453C1.57811 17.4453 1.28902 17.1562 1.28902 16.8008V3.91016C1.28902 3.55476 1.57816 3.26563 1.93351 3.26563H5.84349V7.13281C5.84349 7.48877 6.13203 7.77734 6.48798 7.77734H10.355C10.7109 7.77734 10.9995 7.48877 10.9995 7.13281V3.26563H14.8235C15.1789 3.26563 15.468 3.55476 15.468 3.91016V9.01974C14.8604 9.25332 14.2909 9.61443 13.8017 10.1037C11.9295 11.976 11.9295 15.0225 13.8017 16.8948L14.3521 17.4453H1.93351ZM19.681 15.9833L17.197 18.4675L14.7131 15.9833C13.3403 14.6104 13.3401 12.3883 14.7131 11.0152C16.0828 9.64545 18.3113 9.64541 19.681 11.0152C21.0538 12.3881 21.054 14.6102 19.681 15.9833Z"
                      fill="#727272" />
                    <path
                      d="M17.2186 11.46C16.0861 11.46 15.1648 12.3813 15.1648 13.5139C15.1648 14.6464 16.0861 15.5678 17.2186 15.5678C18.3511 15.5678 19.2723 14.6464 19.2723 13.5139C19.2723 12.3814 18.351 11.46 17.2186 11.46ZM17.2186 14.2788C16.7969 14.2788 16.4538 13.9356 16.4538 13.5139C16.4538 13.0922 16.7968 12.749 17.2186 12.749C17.6403 12.749 17.9834 13.0921 17.9834 13.5139C17.9833 13.9356 17.6403 14.2788 17.2186 14.2788Z"
                      fill="#727272" />
                    <path
                      d="M7.13458 12.2891H3.26326C2.90731 12.2891 2.61877 12.5776 2.61877 12.9336C2.61877 13.2895 2.90731 13.5781 3.26326 13.5781H7.13458C7.49053 13.5781 7.77906 13.2895 7.77906 12.9336C7.77906 12.5776 7.49053 12.2891 7.13458 12.2891Z"
                      fill="#727272" />
                    <path
                      d="M7.13028 14.8672H3.26326C2.90731 14.8672 2.61877 15.1558 2.61877 15.5117C2.61877 15.8677 2.90731 16.1562 3.26326 16.1562H7.13028C7.48623 16.1562 7.77477 15.8677 7.77477 15.5117C7.77477 15.1558 7.48623 14.8672 7.13028 14.8672Z"
                      fill="#727272" />
                  </g>
                  <defs>
                    <clipPath id="clip0_8090_182934">
                      <rect width="22" height="22" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                {/*<NextImage*/}
                {/*  src={trackImage}*/}
                {/*  alt="track-order"*/}
                {/*  width={22}*/}
                {/*  height={22}*/}
                {/*  style={{objectFit: "contain", color: theme.palette.primary.main}}*/}
                {/*/>*/}
              </Tooltip>
            </IconButton>
          )}
          {token && moduleType !== "parcel" && (
            <NavBarIcon
              icon={<ChatBubbleOutlineIcon sx={{ fontSize: "22px" }} />}
              label={t("Chat")}
              user="false"
              handleClick={() => handleWishlistClick("inbox")}
            />
          )}
          {token && zoneId && moduleType !== "parcel" && (
            <WishListSideBar totalWishList={totalWishList} />
          )}

          {moduleType !== "parcel" &&
            moduleType !== "rental" &&
            // !isLoading &&
            (location || cartList?.length !== 0) &&
            zoneId && <Cart isLoading={isLoading} />}

          {moduleType === "rental" && <Taxi isLoading={isLoading} />}

          {token ? (
            <IconButton
              ref={anchorRef}
              onClick={() => handleOpenPopover()}
              sx={{
                padding: "5px",
                gap: "10px",
              }}
            >
              {profileInfo?.image ? (
                <Avatar
                  alt={profileInfo?.last_name}
                  sx={{ width: 34, height: 34 }}
                  src={profileInfo?.image_full_url}
                />
              ) : (
                <AccountCircleIcon
                  color="primary"
                  sx={{
                    fontSize: "30px",
                    borderRadius: "50%",
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.1),
                  }}
                />
              )}

              <Typography
                color={theme.palette.neutral[1000]}
                textTransform="capitalize"
              >
                {profileInfo?.f_name}
              </Typography>
            </IconButton>
          ) : (
            <Stack flexDirection="row" gap="1rem" alignItems="" center>
              {!location && (
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="end"
                  alignItems="center"
                >
                  <ThemeSwitches />
                  <Box
                    sx={{
                      backgroundColor: theme => theme.palette.neutral[300],
                      borderRadius: '32px',
                      paddingBlock: "2px",
                      display: 'flex',
                      alignItems: 'center', marginInlineEnd: "10px"
                    }}
                  >
                    <CallToAdmin configData={configData} />
                  </Box>

                  <Box
                    sx={{
                      backgroundColor: theme => theme.palette.neutral[300],
                      borderRadius: '32px',

                      display: 'flex',
                      alignItems: 'center', marginInlineEnd: "10px"
                    }}
                  >
                    <CustomLanguage
                      countryCode={countryCode}
                      language={language}
                    />
                  </Box>
                </Stack>
              )}
              <Stack justifyContent="flex-end" alignItems="end">
                <SignInButton
                  onClick={() => setOpenSignIn(true)}
                  variant="contained"
                  id="header-sign-in-button"
                >
                  <CustomStackFullWidth
                    direction="row"
                    alignItems="center"
                    spacing={1}
                  >
                    <LockOutlinedIcon
                      fontSize="small"
                      style={{
                        color: theme.palette.whiteContainer.main,
                      }}
                    />
                    <Typography color={theme.palette.whiteContainer.main}>
                      {t("Sign In")}
                    </Typography>
                  </CustomStackFullWidth>
                </SignInButton>
              </Stack>
            </Stack>
          )}
        </CustomStackFullWidth>
      )
      }
    </CustomStackFullWidth >
  );

  return (
    <CustomBoxFullWidth
      sx={{
        backgroundColor: theme.palette.neutral[100],
        boxShadow: (theme) =>
          `0px 5px 20px -3px ${alpha(theme.palette.primary.main, 0.1)}`,
        zIndex: 1251,
      }}
    >
      <NoSsr>
        <CustomContainer>
          <Toolbar disableGutters={true}>
            {isSmall
              ? getMobileScreenComponents()
              : getDesktopScreenComponents()}
            <AccountPopover
              anchorEl={anchorRef.current}
              onClose={() => setOpenPopover(false)}
              open={openPopover}
              cartListRefetch={cartListRefetch}
            />
          </Toolbar>
        </CustomContainer>
        <AuthModal
          modalFor={modalFor}
          setModalFor={setModalFor}
          open={openSignIn}
          handleClose={handleClose}
        />
        {openForgotPasswordModal &&
          <CustomModal
            handleClose={() => dispatch(setOpenForgotPasswordModal(false))}
            openModal={openForgotPasswordModal}
          >
            <ForgotPassword configData={configData} />
          </CustomModal>
        }

      </NoSsr>
    </CustomBoxFullWidth>
  );
};

export default SecondNavBar;
