import React, { useState } from "react";
import { Box } from "@mui/system";
import {
  Divider,
  ListItemIcon,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";

import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";
import LogoutIcon from "@mui/icons-material/Logout";
import CustomDialogConfirm from "../../../custom-dialog/confirm/CustomDialogConfirm";
import { useDispatch, useSelector } from "react-redux";
import { setLogoutUser } from "redux/slices/profileInfo";
import toast from "react-hot-toast";
import { logoutSuccessFull } from "utils/toasterMessages";
import { menuData } from "./menuData";
import { useRouter } from "next/router";
import { setWelcomeModal } from "redux/slices/utils";

const Menu = ({ onClose, cartListRefetch }) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const { configData } = useSelector((state) => state.configData);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = async () => {
    setIsLogoutLoading(true);
    dispatch(setWelcomeModal(false));
    try {
      setTimeout(() => {
        cartListRefetch();
        dispatch(setLogoutUser(null));
        localStorage.removeItem("token");
        onClose?.();
        toast.success(t(logoutSuccessFull));

        router.push("/home");
        setOpenModal(false);

        // dispatch(removeToken())
        // let a = []
        // dispatch(clearWishList(a))
        // dispatch(setClearCart())
        //
        // toast.success(t(logoutSuccessFull))
        // onClose?.()
        // if (router.pathname === '/') {
        //   router.push('/')
        // } else {
        //   router.push('/home')
        // }
      }, 500);
    } catch (err) {
      //   toast.error('Unable to logout.');
    }
  };
  const handleClick = (item) => {
    if (item?.id === 10) {
      router.push({
        pathname: "/track-order",
      });
    } else {
      router.push({
        pathname: "/profile",
        query: {
          page: item?.name,
        },
      });
    }
  };
  return (
    <Box>
      <MenuList>
        {menuData.map((item, index) => {
          if (
            (configData?.customer_wallet_status === 0 && item.id === 4) ||
            (configData?.loyalty_point_status === 0 && item.id === 5) ||
            (configData?.ref_earning_status === 0 && item.id === 6)
          ) {
            return null;
          } else {
            if (item?.id !== 8) {
              return (
                <MenuItem
                  key={index}
                  onClick={() => handleClick(item)}
                  sx={{
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.primary.semiLight,
                      color: (theme) =>
                        theme.palette.mode === "dark"
                          ? theme.palette.neutral[100]
                          : theme.palette.neutral[1000],
                    },
                  }}
                >
                  <ListItemIcon>{item?.icon}</ListItemIcon>
                  <ListItemText
                    sx={{
                      textTransform: "capitalize",
                    }}
                  >
                    {t(item?.name?.replace("-", " "))}
                  </ListItemText>
                </MenuItem>
              );
            }
          }
        })}
        <Divider />
        <MenuItem
          onClick={() => {
            setOpenModal(true);
            setIsLogoutLoading(false);
          }}
          sx={{
            "&:hover": {
              backgroundColor: (theme) => theme.palette.primary.semiLight,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: "25px !important" }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="body1"
                sx={{
                  "&:hover": {
                    color: (theme) =>
                      theme.palette.mode === "dark"
                        ? theme.palette.neutral[100]
                        : theme.palette.neutral[1000],
                  },
                }}
              >
                {t("Logout")}
              </Typography>
            }
          />
        </MenuItem>
      </MenuList>
      <CustomDialogConfirm
        isLoading={isLogoutLoading}
        dialogTexts={t("Are you sure you want to  logout?")}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleLogout}
      />
    </Box>
  );
};
export default Menu;
