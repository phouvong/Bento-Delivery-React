import React, { useState } from "react";
import { Typography, useTheme } from "@mui/material";
import { Box, Stack, styled } from "@mui/system";
import { t } from "i18next";
import { useRouter } from "next/router";
import GuestCheckoutModal from "../cards/GuestCheckoutModal";
import { getToken } from "helper-functions/getToken";
import toast from "react-hot-toast";
import { not_logged_in_message } from "utils/toasterMessages";
import CustomImageContainer from "components/CustomImageContainer";
import prescription from "../store-details/assets/Frame.png";

const AnimatedContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "expanded",
})(({ theme, expanded }) => ({
  position: "fixed",
  right: "10%",
  top: "80%",
  bottom: { xs: 100, md: 40 },
  cursor: "pointer",
  zIndex: 999,
  boxShadow: "0px 10px 30px 0px rgba(3, 157, 85, 0.24)",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: theme.palette.neutral[100],
  paddingLeft: expanded ? "20px" : "0px",
  borderRadius: expanded ? "8px 50px 50px 8px" : "50px",
  transition: "all 0.3s ease", // This enables the smooth transition
  gap: "10px",
  [theme.breakpoints.down("sm")]: {
    right: "0%",
    gap: "10px",
  },
}));
const Prescription = ({ storeId, expanded }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const token = getToken();
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const router = useRouter();
  const handleClick = () => {
    if (token) {
      handleRoute();
    } else {
      toast.error(t(not_logged_in_message));
    }
  };
  const handleRoute = () => {
    router.push(
      {
        pathname: "/checkout",
        query: { page: "prescription", store_id: storeId },
      },
      undefined,
      { shallow: true }
    );
    setOpen(false);
  };

  const iconColor = theme.palette.neutral[100];

  return (
    <AnimatedContainer expanded={expanded} onClick={handleClick} spacing={2}>
      {expanded && (
        <Typography
          fontSize={{ xs: "14px", sm: "14px" }}
          fontWeight="500"
          color={theme.palette.primary.main}
        >
          {t("Prescription Order")}
        </Typography>
      )}
      <Stack
        backgroundColor={theme.palette.primary.main}
        padding="18px"
        width={{ xs: "50px", sm: "50px", md: "65px" }}
        hight={{ xs: "50px", sm: "50px", md: "65px" }}
        borderRadius="50%"
        alignItems="center"
        justifyContent="center"
        //marginRight="5px"
      >
        <CustomImageContainer width="100%" src={prescription.src} />
      </Stack>
      {open && (
        <GuestCheckoutModal
          open={open}
          setOpen={setOpen}
          setSideDrawerOpen={setSideDrawerOpen}
          handleRoute={handleRoute}
        />
      )}
    </AnimatedContainer>
  );
};

export default Prescription;
