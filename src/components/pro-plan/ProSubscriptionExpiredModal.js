import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import CustomModal from "components/modal";
import { clearProSubscription, setUser } from "redux/slices/profileInfo";
import useGetUserInfo from "api-manage/hooks/react-query/user/useGetUserInfo";
import { setWalletAmount } from "redux/slices/cart";

const DISMISSED_KEY_PREFIX = "pro_sub_expired_dismissed_";

const isExpired = (endAt) => {
  if (!endAt) return false;
  const endDate = new Date(endAt);
  endDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return endDate < today;
};

const getDismissedKey = (userId) => `${DISMISSED_KEY_PREFIX}${userId}`;

const ProSubscriptionExpiredModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const handleUserInfoSuccess = (res) => {
    localStorage.setItem("wallet_amount", res?.wallet_balance);
    dispatch(setWalletAmount(res?.wallet_balance));
    dispatch(setUser(res));
  };

  useGetUserInfo(handleUserInfoSuccess);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const userId = profileInfo?.id;
    const proSub = profileInfo?.pro_subscription;

    if (!userId || !proSub) return;
    if (!isExpired(proSub.end_at)) return;

    const alreadyDismissed = localStorage.getItem(getDismissedKey(userId));
    if (alreadyDismissed) return;

    setOpen(true);
  }, [profileInfo?.id, profileInfo?.pro_subscription]);

  const dismiss = () => {
    const userId = profileInfo?.id;
    if (userId) {
      localStorage.setItem(getDismissedKey(userId), "1");
    }
    dispatch(clearProSubscription());
    setOpen(false);
  };

  const handleSubscribe = () => {
    dismiss();
    router.push("/profile?page=subscription-plan");
  };

  if (!open) return null;

  const planName = profileInfo?.pro_subscription?.plan_name;

  return (
    <CustomModal openModal={open} handleClose={dismiss} closeButton>
      <Stack
        spacing={2.5}
        sx={{
          p: { xs: 2.5, sm: 3 },
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ fontSize: 48, lineHeight: 1 }}>⚠️</Box>

        <Stack spacing={1}>
          <Typography fontSize="18px" fontWeight={700} color="text.primary">
            {t("Subscription Expired")}
          </Typography>
          <Typography fontSize="14px" color="text.secondary">
            {planName
              ? t("Your {{plan}} has expired. Renew your subscription to continue enjoying exclusive benefits.", { plan: planName })
              : t("Your Pro subscription has expired. Renew to continue enjoying exclusive benefits.")}
          </Typography>
        </Stack>

        <Stack spacing={1.25} sx={{ width: "100%" }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubscribe}
            sx={{
              background: "linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)",
              height: 44,
              fontWeight: 700,
              fontSize: "14px",
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(90deg, #7C3AED 0%, #8B5CF6 100%)",
                boxShadow: "none",
              },
            }}
          >
            {t("Renew Subscription")}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={dismiss}
            sx={{
              height: 40,
              fontWeight: 500,
              fontSize: "14px",
              textTransform: "none",
              color: "text.secondary",
            }}
          >
            {t("Maybe Later")}
          </Button>
        </Stack>
      </Stack>
    </CustomModal>
  );
};

export default ProSubscriptionExpiredModal;
