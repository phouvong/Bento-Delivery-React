import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Radio,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import CustomImageContainer from "../CustomImageContainer";
import useSubscribeProPlan from "../../api-manage/hooks/react-query/pro-plans/useSubscribeProPlan";
import useGetProfile from "../../api-manage/hooks/react-query/profile/useGetProfile";
import { setUser } from "../../redux/slices/profileInfo";
import { getAmountWithSign } from "../../helper-functions/CardHelpers";

// Translate one selection into the subscribe-endpoint payload shape:
// digital gateways → `digital_payment` with the gateway slug.
// wallet           → `wallet`.
const buildPayload = (plan, selection, callbackUrl) => {
  const base = {
    plan_id: plan?.id,
    callback: callbackUrl,
  };
  if (selection?.kind === "wallet") {
    return { ...base, payment_type: "wallet", payment_method: "wallet" };
  }
  // digital gateway
  return {
    ...base,
    payment_type: "digital_payment",
    payment_method: selection?.gateway,
    payment_platform: "web",
  };
};

const ProPlanPaymentModal = ({
  open,
  onClose,
  plan,
  onSuccess,
  callbackUrl,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { configData } = useSelector((state) => state.configData);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const subscribeMutation = useSubscribeProPlan();
  // Refetch the user profile after a successful wallet subscription so
  // the wallet balance + Pro subscription state stay in sync.
  const { refetch: refetchProfile } = useGetProfile((res) => {
    if (res) dispatch(setUser(res));
  });

  // Memo to keep useEffect deps stable — without it `gateways` is a new
  // array each render and the preselect effect re-fires every paint.
  const gateways = useMemo(
    () =>
      Array.isArray(configData?.active_payment_method_list)
        ? configData.active_payment_method_list
        : [],
    [configData?.active_payment_method_list]
  );
  // Wallet is only a valid choice if the feature is on AND the user's
  // balance can cover the plan price — otherwise the payment would fail
  // server-side and the option would be a dead-end for the user.
  const walletBalance = Number(profileInfo?.wallet_balance) || 0;
  const planPrice = Number(plan?.price) || 0;
  const walletHasEnough = walletBalance >= planPrice;
  const walletEnabled =
    configData?.customer_wallet_status === 1 && walletHasEnough;
  const digitalEnabled = !!configData?.digital_payment_info?.digital_payment;

  const [selectedKey, setSelectedKey] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedKey("");
      return;
    }
    // Pull the latest profile (and wallet balance) every time the modal
    // opens — otherwise a debit from a previous purchase would leave the
    // user looking at the stale balance.
    refetchProfile();
    // Preselect the first available method so the Proceed button is enabled.
    if (digitalEnabled && gateways[0]?.gateway) {
      setSelectedKey(`gateway:${gateways[0].gateway}`);
    } else if (walletEnabled) {
      setSelectedKey("wallet");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, digitalEnabled, walletEnabled, gateways]);

  const selectionFromKey = () => {
    if (selectedKey === "wallet") return { kind: "wallet" };
    if (selectedKey.startsWith("gateway:")) {
      const gw = selectedKey.slice("gateway:".length);
      return { kind: "gateway", gateway: gw };
    }
    return null;
  };

  const handleProceed = () => {
    const selection = selectionFromKey();
    if (!selection || !plan) return;
    const resolvedCallback =
      callbackUrl ??
      (typeof window !== "undefined" ? window.location.href : "");
    const payload = buildPayload(plan, selection, resolvedCallback);
    subscribeMutation.mutate(payload, {
      onSuccess: (res) => {
        // Some backends respond with a hosted-payment redirect URL.
        const redirect = res?.redirect_link ?? res?.data?.redirect_link;
        if (redirect && typeof window !== "undefined") {
          window.location.href = redirect;
          return;
        }
        // Wallet payments debit the balance server-side. The refetch is
        // async, so we *also* optimistically deduct the price locally —
        // this avoids the "stale balance" flash users see between the
        // success modal closing and the profile API returning.
        if (selection?.kind === "wallet") {
          const nextBalance = Math.max(0, walletBalance - planPrice);
          dispatch(setUser({ ...profileInfo, wallet_balance: nextBalance }));
          refetchProfile();
        }
        // No success toast here — callers (e.g. SubscriptionPlanPage)
        // already surface the result via a modal/result dialog.
        onSuccess?.(res);
        onClose?.();
      },
      onError: (err) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          t("Subscription failed");
        toast.error(msg);
      },
    });
  };

  const submitting = subscribeMutation.isLoading;
  const noMethods =
    (!digitalEnabled || gateways.length === 0) && !walletEnabled;

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: "16px" } }}
    >
      <Box sx={{ position: "relative" }}>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label={t("Close")}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "#9CA3AF",
            p: 0.5,
            zIndex: 1,
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Typography fontSize="18px" fontWeight={700}>
                {t("Select a payment method")}
              </Typography>
              {plan && (
                <Typography fontSize="13px" color="text.secondary">
                  {t(plan.title)} — {getAmountWithSign(plan.price)} /{" "}
                  {plan.days} {t("days")}
                </Typography>
              )}
            </Stack>

            {noMethods ? (
              <Typography color="text.secondary" fontSize="13px">
                {t("No payment method available.")}
              </Typography>
            ) : (
              <Stack spacing={1}>
                {digitalEnabled &&
                  gateways.map((gw) => {
                    const key = `gateway:${gw.gateway}`;
                    const checked = selectedKey === key;
                    return (
                      <Stack
                        key={key}
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        onClick={() => setSelectedKey(key)}
                        sx={{
                          px: 1.5,
                          py: 1,
                          borderRadius: "10px",
                          border: (theme) =>
                            `1px solid ${
                              checked
                                ? theme.palette.primary.main
                                : theme.palette.divider
                            }`,
                          cursor: "pointer",
                        }}
                      >
                        <Radio checked={checked} size="small" />
                        {gw.gateway_image_full_url && (
                          <CustomImageContainer
                            src={gw.gateway_image_full_url}
                            width="28px"
                            height="22px"
                            objectfit="contain"
                          />
                        )}
                        <Typography fontSize="13px" fontWeight={500}>
                          {gw.gateway_title || gw.gateway}
                        </Typography>
                      </Stack>
                    );
                  })}

                {walletEnabled && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    onClick={() => setSelectedKey("wallet")}
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: "10px",
                      border: (theme) =>
                        `1px solid ${
                          selectedKey === "wallet"
                            ? theme.palette.primary.main
                            : theme.palette.divider
                        }`,
                      cursor: "pointer",
                    }}
                  >
                    <Radio checked={selectedKey === "wallet"} size="small" />
                    <AccountBalanceWalletRoundedIcon
                      sx={{ fontSize: 22, color: "primary.main" }}
                    />
                    <Stack sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontSize="13px" fontWeight={500}>
                        {t("Wallet")}
                      </Typography>
                      <Typography fontSize="11px" color="text.secondary">
                        {t("Balance")}: {getAmountWithSign(walletBalance)}
                      </Typography>
                    </Stack>
                  </Stack>
                )}
              </Stack>
            )}

            {plan && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  px: 1.5,
                  py: 1.25,
                  borderRadius: "10px",
                  backgroundColor: (theme) =>
                    theme.palette.action?.hover || "rgba(0,0,0,0.04)",
                }}
              >
                <Typography fontSize="13px" color="text.secondary">
                  {t("Amount to pay")}
                </Typography>
                <Typography
                  fontSize="15px"
                  fontWeight={700}
                  color="text.primary"
                >
                  {getAmountWithSign(planPrice)}
                </Typography>
              </Stack>
            )}

            <Button
              variant="contained"
              fullWidth
              disabled={!selectedKey || submitting || noMethods}
              onClick={handleProceed}
              sx={{ borderRadius: "8px", textTransform: "none", py: 1.25 }}
            >
              {submitting ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                t("Proceed")
              )}
            </Button>
          </Stack>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default ProPlanPaymentModal;
