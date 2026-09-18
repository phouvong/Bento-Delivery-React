import React from "react";
import CustomImageContainer from "components/CustomImageContainer";
import { Stack, Typography, useTheme } from "@mui/material";
import { PrimaryButton } from "components/Map/map.style";
import Box from "@mui/material/Box";
import { t } from "i18next";
import successImg from "../../asset/success.png";
import { useRouter } from "next/router";
import {getToken} from "helper-functions/getToken";
import toast from "react-hot-toast";

const RentalSuccessModal = ({ handleCloseSuccessModal, tripDetails }) => {
  const theme = useTheme();
  const router = useRouter();
  const handleClick = () => {
    if(getToken()){
      router.push({
        pathname: "/profile",
        query: {
          page: "inbox",
          type: "vendor",
          id: tripDetails?.provider?.id,
          routeName: "vendor_id",
          chatFrom: "true",
          deliveryman_name: tripDetails?.provider?.name,
          deliveryManData_image: tripDetails?.provider?.logo_full_url,
        },
      });
    }else{
      toast.error(t("Please login to continue"))
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "440px",
        width: "100%",
        padding: "30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <CustomImageContainer
        width="80x"
        height="80px"
        maxWidth="80px"
        src={successImg.src}
      />
      <Stack justifyContent="center" alignItems="center" gap="1rem">
        <Typography
          fontSize="1rem"
          fontWeight="700"
          color={theme.palette.neutral[1000]}
          textAlign="center"
        >
          {t("Trip Booking Request Successful!")}
        </Typography>
        <Typography color={theme.palette.neutral[500]} textAlign="center">
          {t(
            "Your request has been submitted successfully. your preferable vehicles will be arrived on time after confirmation."
          )}
        </Typography>
        {getToken() && <Typography fontSize="12px" textAlign="center">
          {t("To know others information you may")}{" "}
          <span
            style={{ textDecoration: "underline", color: "blue",cursor:"pointer" }}
            onClick={handleClick}
          >
            {t("Contact With Vendor")}
          </span>{" "}
          {t("from trip details.")}
        </Typography>}

        <PrimaryButton
          onClick={handleCloseSuccessModal}
          sx={{ marginTop: ".5rem" }}
        >
          {t("Okay")}
        </PrimaryButton>
      </Stack>
    </Box>
  );
};

export default RentalSuccessModal;
