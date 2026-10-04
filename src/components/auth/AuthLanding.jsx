import React from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import SocialLogins from "components/auth/sign-in/social-login/SocialLogins";

const AuthLanding = ({
  handleClose,
  onSelectPassword,
  onSelectOtp,
  onGuestContinue,
  configData,
  setJwtToken,
  setUserInfo,
  handleSuccess,
  setModalFor,
  setMedium,
  loginMutation,
  setLoginInfo,
  state,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const hasSocialLogins =
    configData?.social_login?.length > 0 || configData?.apple_login?.length > 0;

  const socialProps = {
    socialLogin: configData?.social_login ?? [],
    configData,
    state,
    setJwtToken,
    setUserInfo,
    handleSuccess,
    setModalFor,
    setMedium,
    loginMutation,
    setLoginInfo,
    isLandingVariant: true,
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: "20px",
        position: "relative",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      {/* Top bar — close button right-aligned */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 0 }}>
        <IconButton
          onClick={handleClose}
          sx={{
            p: "12px",
            borderRadius: "16px",
            "&:hover": {
              backgroundColor: theme.palette.neutral?.[100] ?? "action.hover",
            },
          }}
          size="small"
        >
          <CloseIcon sx={{ fontSize: "20px" }} />
        </IconButton>
      </Box>

      {/* Content */}
      <Stack sx={{ gap: "20px", pb: "32px", pt: "8px", px: "48px" }}>
        {/* Title section */}
        <Stack sx={{ gap: "4px", px: "16px", textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              letterSpacing: "-1.2px",
              lineHeight: 1.1,
              color: theme.palette.neutral?.[1050] ?? "text.primary",
              textAlign: "center",
            }}
          >
            {t("Login or Signup")}
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              letterSpacing: "-0.42px",
              lineHeight: 1.2,
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            {t(
              "To get more personalised & smooth experience please log in or sign up"
            )}
          </Typography>
        </Stack>

        {/* Social + OR + action buttons */}
        <Stack sx={{ pt: "12px", gap: "16px" }}>
          {hasSocialLogins && (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                letterSpacing: "-0.42px",
                lineHeight: 1.2,
                color: theme.palette.neutral?.[1050] ?? "text.primary",
                textAlign: "center",
              }}
            >
              {t("Continue With")}
            </Typography>
          )}

          <Stack sx={{ gap: "20px", alignItems: "center" }}>
            {hasSocialLogins && <SocialLogins {...socialProps} />}

            {hasSocialLogins && (
              <Stack
                direction="row"
                alignItems="center"
                sx={{ gap: "16px", width: "100%" }}
              >
                <Divider sx={{ flex: 1 }} />
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                    letterSpacing: "-0.42px",
                    lineHeight: 1.2,
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("OR")}
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Stack>
            )}

            {/* Action buttons */}
            <Stack sx={{ gap: "12px", width: "100%" }}>
              <Button
                onClick={onSelectPassword}
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  height: "44px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "-0.48px",
                  lineHeight: 1.1,
                  textTransform: "capitalize",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: "none",
                  },
                }}
              >
                {t("Login with Password")}
              </Button>

              <Button
                onClick={onSelectOtp}
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "background.secondary",
                  color: theme.palette.neutral?.[1050] ?? "text.primary",
                  height: "44px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "-0.48px",
                  lineHeight: 1.1,
                  textTransform: "capitalize",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: theme.palette.neutral?.[200],
                    boxShadow: "none",
                  },
                }}
              >
                {t("Login with OTP")}
              </Button>

              <Button
                onClick={onGuestContinue}
                fullWidth
                variant="text"
                sx={{
                  color: theme.palette.info?.blue ?? "#3979e0",
                  height: "40px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "16px",
                  letterSpacing: "-0.48px",
                  lineHeight: 1.1,
                  textTransform: "capitalize",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                {t("Continue as Guest")}
              </Button>
            </Stack>

            {/* Sign Up prompt */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{ gap: "4px", pt: "4px" }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 400,
                  letterSpacing: "-0.42px",
                  lineHeight: 1.2,
                  color: "text.secondary",
                }}
              >
                {t("New to {{name}}?", {
                  name: configData?.business_name ?? "",
                })}
              </Typography>
              <Typography
                onClick={() => setModalFor?.("sign-up")}
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "-0.42px",
                  lineHeight: 1.2,
                  color: theme.palette.info?.blue ?? "#3979e0",
                  cursor: "pointer",
                }}
              >
                {t("Sign Up")}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Terms & Conditions */}
        <Box sx={{ px: "32px", textAlign: "center" }}>
          <Typography
            component="p"
            sx={{
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: 1.3,
              color: "text.primary",
              textAlign: "center",
            }}
          >
            {t("By continuing, you agree to our")}{" "}
            <Box
              component="a"
              href="/terms-and-conditions"
              target="_blank"
              rel="noreferrer"
              sx={{
                color: theme.palette.info?.blue ?? "#245bd1",
                textDecoration: "none",
              }}
            >
              {t("Terms & Conditions")}
            </Box>{" "}
            {t("and")}{" "}
            <Box
              component="a"
              href="/privacy-policy"
              target="_blank"
              rel="noreferrer"
              sx={{
                color: theme.palette.info?.blue ?? "#245bd1",
                textDecoration: "none",
              }}
            >
              {t("Privacy Policy")}
            </Box>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default AuthLanding;
