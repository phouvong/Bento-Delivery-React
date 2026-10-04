import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Slide } from "@mui/material";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";
import MobileTopMenu from "./MobileTopMenu";
import { CustomDrawer } from "../../NavBar.style";
import { setLogoutUser } from "redux/slices/profileInfo";
import toast from "react-hot-toast";
import { logoutSuccessFull } from "utils/toasterMessages";
import { clearWishList } from "redux/slices/wishList";
import { setClearCart, clearAllCartData } from "redux/slices/cart";

const DrawerMenu = ({ setToggled, openDrawer, setOpenDrawer }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const toggleDrawer = (openDrawer) => (event) => {
    setToggled(openDrawer);
    setOpenDrawer(openDrawer);
  };
  const handleRoute = (path) => {
    router.push(`/${path}`, undefined, { shallow: true });
    setOpenDrawer(false);
  };
  const handleLogout = async () => {
    setIsLogoutLoading(true);
    try {
      setTimeout(() => {
        dispatch(setLogoutUser(null));
        localStorage.removeItem("token");
        // Clear any "don't show this incomplete order again" flags so the
        // next user sees a fresh state.
        Object.keys(localStorage)
          .filter((k) => k.startsWith("incomplete_order_hidden_"))
          .forEach((k) => localStorage.removeItem(k));
        setOpenDrawer(false);
        toast.success(t(logoutSuccessFull));
        setOpenModal(false);
        let a = [];
        dispatch(clearWishList(a));
        dispatch(setClearCart());
        dispatch(clearAllCartData());
        if (router.pathname === "/") {
          router.push("/", undefined, { shallow: true });
        } else {
          router.push("/home", undefined, { shallow: true });
        }
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={toggleDrawer(!openDrawer)}
        sx={{
          color: (theme) => theme.palette.primary.main,
          paddingRight: "0px",
        }}
      >
        <MenuIcon />
      </IconButton>
      {openDrawer && (
        <CustomDrawer
          variant="temporary"
          anchor="right"
          open={openDrawer}
          onClose={toggleDrawer(false)}
          router={router}
          TransitionComponent={Slide}
          TransitionProps={{
            direction: "right", // Customize the direction ('left', 'right', 'up', or 'down')
            timeout: 300, // Transition duration in milliseconds
          }}
        >
          <MobileTopMenu
            handleRoute={handleRoute}
            toggleDrawer={toggleDrawer}
            setOpenDrawer={setOpenDrawer}
            handleLogout={handleLogout}
            openModal={openModal}
            isLogoutLoading={isLogoutLoading}
            setOpenModal={setOpenModal}
            t={t}
          />
        </CustomDrawer>
      )}
    </>
  );
};

export default DrawerMenu;
