import React from "react";
import { alpha, Stack, Typography, useTheme } from "@mui/material";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { t } from "i18next";
import { useRouter } from "next/router";
import { setActiveStep } from "redux/slices/storeRegistrationData";
import { useDispatch } from "react-redux";
import CustomImageContainer from "components/CustomImageContainer";
import successGif from "../../assets/GIF 1.gif";
import failGif from "../../assets/GIF 2.gif";

const SuccessStoreRegistration = ({ flag }) => {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const tryAgain = () => {
    router.replace(
      {
        pathname: router.pathname,
      },
      undefined,
      { shallow: true }
    );
    dispatch(setActiveStep(2));
  };
  return (
    <CustomStackFullWidth
      sx={{
        border: `1px solid ${alpha(theme.palette.neutral[400], 0.6)}`,
        marginTop: "2rem",
        borderRadius: "8px",
        padding: "30px",
        justifyContent: "center",
        alignItems: "center",
      }}
      spacing={2}
    >
      {flag === "success" ? (
        <>
          <CustomImageContainer
            src={successGif.src}
            alt="my gif"
            height={150}
            width={150}
            objectFit="contain"
          />
          <Typography fontSize="22px" fontWeight="600">
            {t("Congratulations!")}
          </Typography>
          <Stack justifyContent="center" alignItems="center" width="100%">
            <Typography fontSize="16px" textAlign="center">
              {t("Your Registration Has been Completed Successfully.")}
            </Typography>
            <Typography fontSize="13px" textAlign="center">
              {t(
                "Admin will confirm your registration request  within 48 hour"
              )}
            </Typography>
          </Stack>
        </>
      ) : (
        <>
          <CustomImageContainer
            src={failGif.src}
            alt="my gif"
            height={200}
            width={200}
            objectFit="contain"
          />
          <Typography fontSize="22px" fontWeight="600">
            {t("Payment Error !")}
          </Typography>
          <Stack justifyContent="center" alignItems="center">
            <Typography fontSize="16px" textAlign="center">
              {t("Your Registration Could Not Completed .")}
            </Typography>
            <Typography fontSize="13px" component="span">
              {t(
                "Due to payment transaction error your registration could not complete."
              )}
              <Typography
                textAlign="center"
                onClick={tryAgain}
                component="span"
                fontSize="13px"
                color={theme.palette.primary.main}
                sx={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {t("Please Try Again")}
              </Typography>
            </Typography>
          </Stack>
        </>
      )}
    </CustomStackFullWidth>
  );
};

export default SuccessStoreRegistration;
