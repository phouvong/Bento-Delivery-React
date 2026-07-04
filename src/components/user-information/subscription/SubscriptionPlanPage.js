import React, { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Drawer,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";
import moment from "moment";
import toast from "react-hot-toast";

import useGetProActiveOffer from "../../../api-manage/hooks/react-query/pro-plans/useGetProActiveOffer";
import useGetProFaqs, {
  resolveFaq,
  toFaqList,
} from "../../../api-manage/hooks/react-query/pro-plans/useGetProFaqs";
import useGetProPlans from "../../../api-manage/hooks/react-query/pro-plans/useGetProPlans";
import useSubscribeProPlan from "../../../api-manage/hooks/react-query/pro-plans/useSubscribeProPlan";
import useCancelProPlan from "../../../api-manage/hooks/react-query/pro-plans/useCancelProPlan";
import { getAmountWithSign } from "../../../helper-functions/CardHelpers";
import ChoosePlanContent from "../../pro-plan/ChoosePlanContent";
import ProTermsModal from "../../pro-plan/ProTermsModal";
import ProPlanPaymentModal from "../../pro-plan/ProPlanPaymentModal";
import ProPlanSubscriptionModal from "../../pro-plan/ProPlanSubscriptionModal";
import CancelSubscriptionModal from "./CancelSubscriptionModal";
import RenewSubscriptionModal from "./RenewSubscriptionModal";
import { useDispatch, useSelector } from "react-redux";
import useGetProfile from "../../../api-manage/hooks/react-query/profile/useGetProfile";
import { setUser } from "../../../redux/slices/profileInfo";

const DASH = "—";

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const formatDate = (raw) => {
  if (!raw) return DASH;
  const m = moment(raw);
  return m.isValid() ? m.format("MMMM D, YYYY") : DASH;
};

const DetailRow = ({ icon, label, value }) => (
  <Stack direction="row" alignItems="flex-start" spacing={1.25}>
    <Box sx={{ color: "text.secondary", mt: "2px" }}>{icon}</Box>
    <Stack>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography fontSize="14px" fontWeight={600} color="text.primary">
        {value}
      </Typography>
    </Stack>
  </Stack>
);

const StatTile = ({ label, value }) => (
  <Box
    sx={{
      flex: 1,
      backgroundColor: (theme) => theme.palette.background.paper,
      borderRadius: "10px",
      px: 1.75,
      py: 1.25,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 1,
    }}
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography fontWeight={700} color="text.primary">
      {value}
    </Typography>
  </Box>
);

const SubscriptionPlanPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useDispatch();
  const flagToastShownRef = useRef(false);
  console.log({ profileInfo });

  // Pulls a fresh user profile + pushes it into redux. Triggered after
  // cancel/subscribe so `pro_status` and the wallet balance stay in sync
  // without waiting for a navigation.
  const { refetch: refetchProfile } = useGetProfile((res) => {
    if (res) dispatch(setUser(res));
  });
  console.log({ profileInfo });

  const { data: activeOfferRaw, isLoading } = useGetProActiveOffer();

  // Dialog state collapses `open` + `variant` so a single setState atomically
  // flips both; `variant` survives close animation via the Dialog's onExited.
  const [resultState, setResultState] = useState({
    open: false,
    variant: null,
  });
  const resultModalOpen = resultState.open;
  const resultModal = resultState.variant;
  // Strips the gateway callback params (`flag`/`token`/`status`/
  // `payment_status` at the top level, plus the malformed
  // `?flag=...&&token=...` tail buried inside other values like
  // `module=food?flag=fail&&token=...`). Called from the dialog close/OK
  // handler so the URL only clears once the user has acknowledged the
  // result.
  const clearCallbackParamsFromUrl = () => {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      ["flag", "token", "status", "payment_status"].forEach((k) =>
        url.searchParams.delete(k)
      );
      url.searchParams.forEach((value, key) => {
        const cleaned = value
          .replace(/\?(?:flag|status|payment_status)=[A-Za-z]+.*$/i, "")
          .replace(/&{1,}token=[^&]*$/i, "");
        if (cleaned !== value) url.searchParams.set(key, cleaned);
      });
      window.history.replaceState(
        {},
        "",
        url.pathname + (url.search ? url.search : "") + url.hash
      );
    } catch {
      router.replace(
        { pathname: router.pathname, query: { page: "subscription-plan" } },
        undefined,
        { shallow: true }
      );
    }
  };

  const openResultModal = (variant) => {
    setResultState({ open: true, variant });
  };
  const handleResultClose = () => {
    setResultState((s) => ({ ...s, open: false }));
    clearCallbackParamsFromUrl();
  };

  useEffect(() => {
    if (flagToastShownRef.current) return;

    // Gateway callbacks come back with malformed separators —
    // `?flag=success&&token=...` is appended even when the URL already had a
    // `?`, so `flag` and `token` end up buried inside other query values
    // (e.g. `module=food?flag=success&&token=...`). Scan the raw URL with a
    // regex so we can still detect the flag regardless of where it lives.
    const rawUrl =
      (typeof window !== "undefined" && window.location.href) ||
      router.asPath ||
      "";
    const pageQuery = router.query?.page;
    const flagFromPage =
      typeof pageQuery === "string" && pageQuery.includes("?flag=")
        ? pageQuery.split("?flag=")[1]?.split(/[&?]/)[0]
        : null;
    // Gateways aren't consistent — accept all the common spellings here so
    // failure / cancellation callbacks still surface the right dialog.
    const rawFlagMatch = rawUrl.match(
      /[?&]+(?:flag|status|payment_status)=([A-Za-z]+)/i
    );
    const rawFlag = (
      router.query?.flag ??
      router.query?.status ??
      router.query?.payment_status ??
      flagFromPage ??
      rawFlagMatch?.[1] ??
      ""
    )
      .toString()
      .toLowerCase();
    if (!rawFlag) return;
    const isSuccess = [
      "success",
      "succeeded",
      "succeed",
      "paid",
      "ok",
    ].includes(rawFlag);
    const isCancel = ["cancel", "cancelled", "canceled"].includes(rawFlag);
    const isFail = [
      "fail",
      "failed",
      "failure",
      "error",
      "declined",
      "unpaid",
    ].includes(rawFlag);
    if (!isSuccess && !isCancel && !isFail) return;
    flagToastShownRef.current = true;
    if (isSuccess) {
      openResultModal("success");
      queryClient.invalidateQueries("pro-customer-active-offer");
      queryClient.invalidateQueries("user-info");
    } else if (isCancel) {
      openResultModal("cancel");
    } else {
      openResultModal("fail");
    }
    // URL stays as-is until the user closes the dialog via OK/close —
    // see clearCallbackParamsFromUrl() inside handleResultClose.
  }, [router.query?.page, router.query?.flag, router.asPath]);

  const [termsOpen, setTermsOpen] = useState(false);
  const [renewOpen, setRenewOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [changePlanOpen, setChangePlanOpen] = useState(false);
  const [proPlanSelected, setProPlanSelected] = useState(null);
  const [proPlanPaymentOpen, setProPlanPaymentOpen] = useState(false);
  const [renewPlanSelectOpen, setRenewPlanSelectOpen] = useState(false);

  const subscribeMutation = useSubscribeProPlan();
  const subscribing = subscribeMutation.isLoading;
  const { mutate: cancelProPlan, isLoading: cancelling } = useCancelProPlan();

  // Active-offer payload may arrive axios-wrapped or flat.
  const offer = activeOfferRaw?.data ?? activeOfferRaw ?? {};
  const isActive = profileInfo?.pro_status === true;
  // Subscription details: backend variants put them under `plan_details`,
  // `subscription`, `plan`, or at the root.
  const sub =
    offer?.plan_details ?? offer?.subscription ?? offer?.plan ?? offer ?? {};
  const benefit = offer?.benefit;

  const planName = sub.plan_name ?? sub.name ?? DASH;

  const totalSavedNumber = toNumber(sub.total_saved, NaN);
  const totalSavedDisplay = Number.isFinite(totalSavedNumber)
    ? getAmountWithSign(totalSavedNumber)
    : DASH;

  const ordersPlacedRaw =
    sub.total_orders ?? sub.orders_placed ?? sub.order_count;
  const ordersPlacedDisplay =
    ordersPlacedRaw === undefined || ordersPlacedRaw === null
      ? DASH
      : String(ordersPlacedRaw);

  const activeSinceRaw = sub.start_at ?? sub.start_date ?? sub.active_since;
  const expiresOnRaw = sub.end_at ?? sub.end_date ?? sub.expires_on;
  const paidByRaw = String(sub.payment_method ?? sub.paid_by ?? "");
  const paidBy = (paidByRaw || DASH).replace(/_/g, " ");
  // Free-trial subscribers see a "Change Plan" CTA instead of "Renew" — they
  // haven't paid yet, so the right action is to pick a real plan.
  const isFreeTrial = paidByRaw === "free_trial";

  const daysRemainingExplicit = toNumber(sub.days_remaining, NaN);
  const daysRemainingDerived = expiresOnRaw
    ? Math.max(0, moment(expiresOnRaw).diff(moment(), "days"))
    : NaN;
  const daysRemainingValue = Number.isFinite(daysRemainingExplicit)
    ? daysRemainingExplicit
    : daysRemainingDerived;
  const daysRemainingDisplay = Number.isFinite(daysRemainingValue)
    ? `${daysRemainingValue} ${t("days")}`
    : DASH;
  // Renew CTA only fires when we have a resolvable days-remaining and it's
  // at/past zero. If neither the API nor the end date provides one, default
  // to "not expired" instead of showing a renew prompt the user can't act on.
  const isExpired =
    Number.isFinite(daysRemainingValue) && daysRemainingValue <= 0;

  // Derive the bullet-list benefit lines from whatever the backend returns.
  // Real payloads describe the benefit via {type, offer_type, charge_discount_percentage,
  // min_order_status, min_order_amount}; a legacy variant just exposes `percentage`.
  const benefits = (() => {
    if (!benefit) return [];
    const lines = [];

    const minOrderQualifier =
      benefit?.min_order_status === 1 && toNumber(benefit?.min_order_amount) > 0
        ? ` ${t("on orders above")} ${getAmountWithSign(
            benefit.min_order_amount
          )}`
        : "";

    if (benefit?.type === "delivery_fee") {
      const pct = toNumber(benefit?.charge_discount_percentage, 0);
      if (benefit?.offer_type === "free") {
        lines.push(`${t("Free delivery")}${minOrderQualifier}`);
      } else if (benefit?.offer_type === "partial_free" && pct > 0) {
        lines.push(`${pct}% ${t("off on delivery fee")}${minOrderQualifier}`);
      } else if (pct > 0) {
        lines.push(`${pct}% ${t("off on delivery fee")}${minOrderQualifier}`);
      } else {
        lines.push(`${t("Delivery fee benefit")}${minOrderQualifier}`);
      }
    } else if (benefit?.type === "discount") {
      const pct = toNumber(benefit?.percentage, 0);
      const maxAmount = toNumber(benefit?.max_amount, 0);
      const cap =
        maxAmount > 0 ? ` (${t("up to")} ${getAmountWithSign(maxAmount)})` : "";
      if (pct > 0) {
        lines.push(
          `${pct}% ${t("off on all orders")}${cap}${minOrderQualifier}`
        );
      } else {
        lines.push(`${t("Pro member discount")}${cap}${minOrderQualifier}`);
      }
    } else if (benefit?.type === "coupon") {
      lines.push(t("Pro coupon benefit unlocked"));
    }

    const legacyPct = toNumber(benefit?.percentage, 0);
    if (legacyPct > 0) {
      lines.push(`${legacyPct}% ${t("off on all orders")}`);
    }

    return lines;
  })();

  const { data: faqsRaw } = useGetProFaqs();
  const faqs = toFaqList(faqsRaw)
    .map(resolveFaq)
    .filter((f) => f.question.length > 0 || f.answer.length > 0);

  // Plans list used at renew time to look up the active plan price for the
  // payment modal's total display.
  const { data: plansResponse } = useGetProPlans();
  const plansList = (() => {
    const wrapped = plansResponse?.data?.plans;
    const flat = plansResponse?.plans;
    const list = Array.isArray(wrapped) ? wrapped : flat ?? [];
    return Array.isArray(list) ? list : [];
  })();

  const handleSubscribeFromPage = (plan) => {
    if (!plan) return;
    if (plan.price === 0) {
      subscribeMutation.mutate(
        {
          plan_id: plan.id,
          payment_type: "free_trial",
          payment_method: "free_trial",
          callback_url:
            typeof window !== "undefined" ? window.location.href : "",
        },
        {
          onSuccess: (resp) => {
            const redirect = resp?.redirect_link ?? resp?.data?.redirect_link;
            if (redirect && typeof window !== "undefined") {
              window.location.href = redirect;
              return;
            }
            queryClient.invalidateQueries("pro-customer-active-offer");
            queryClient.invalidateQueries("user-info");
            // Free-trial activation flips `pro_status` server-side —
            // pull the fresh profile so the rest of the app sees the
            // user as Pro immediately without a navigation.
            refetchProfile();
            openResultModal("success");
          },
          onError: (err) => {
            toast.error(
              err?.response?.data?.message ?? t("Subscription failed")
            );
          },
        }
      );
      return;
    }
    setProPlanSelected(plan);
    setProPlanPaymentOpen(true);
  };

  const handleConfirmCancel = () => {
    cancelProPlan(undefined, {
      onSuccess: (resp) => {
        setCancelOpen(false);
        queryClient.invalidateQueries("pro-customer-active-offer");
        queryClient.invalidateQueries("user-info");
        // Cancellation flips `pro_status` server-side — refresh the
        // profile so the rest of the app sees the user is no longer Pro.
        refetchProfile();
        toast.success(resp?.message ?? t("Subscription cancelled"));
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message ?? t("Failed to cancel subscription")
        );
      },
    });
  };

  const handleConfirmRenew = () => {
    setRenewOpen(false);
    setRenewPlanSelectOpen(true);
  };

  const faqsSection = faqs.length > 0 && (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "16px",
        p: 2,
      }}
    >
      <Typography fontWeight={700} mb={1.25} color="text.primary">
        {t("Frequently Asked Questions")}
      </Typography>
      <Stack>
        {faqs.map((faq, i) => (
          <Accordion
            key={i}
            disableGutters
            elevation={0}
            sx={{
              background: "transparent",
              "&:before": { display: "none" },
              borderBottom:
                i < faqs.length - 1
                  ? `1px solid ${theme.palette.divider}`
                  : "none",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreRoundedIcon />}
              sx={{ px: 0 }}
            >
              <Typography fontSize="14px" color="text.primary">
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 0, pt: 0 }}>
              <Typography variant="body2" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  );

  const resultDialog = (
    <Dialog
      open={resultModalOpen}
      onClose={handleResultClose}
      keepMounted
      TransitionProps={{
        onExited: () => setResultState({ open: false, variant: null }),
      }}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          p: 0,
          m: 1,
          width: { xs: "90%", sm: "360px" },
        },
      }}
    >
      <DialogContent sx={{ p: 1.5 }}>
        <Stack alignItems="center" spacing={0.75} sx={{ py: 0 }}>
          {resultModal === "success" ? (
            <CheckCircleRoundedIcon sx={{ fontSize: 48, color: "#22C55E" }} />
          ) : resultModal === "cancel" ? (
            <ErrorOutlineRoundedIcon sx={{ fontSize: 48, color: "#F59E0B" }} />
          ) : (
            <CancelRoundedIcon sx={{ fontSize: 48, color: "#EF4444" }} />
          )}
          <Typography
            fontSize="16px"
            fontWeight={700}
            color="text.primary"
            textAlign="center"
            sx={{ m: 0 }}
          >
            {resultModal === "success"
              ? t("Subscription Successful")
              : resultModal === "cancel"
              ? t("Subscription Cancelled")
              : t("Subscription Failed")}
          </Typography>
          <Typography
            fontSize="13px"
            color="text.secondary"
            textAlign="center"
            sx={{ m: 0 }}
          >
            {resultModal === "success"
              ? t("Your Pro subscription is now active. Enjoy your benefits!")
              : resultModal === "cancel"
              ? t("You cancelled the subscription payment. No charge was made.")
              : t(
                  "Your subscription payment did not go through. Please try again."
                )}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 1, pt: 0, justifyContent: "center" }}>
        <Button
          onClick={handleResultClose}
          variant="contained"
          size="small"
          sx={{
            backgroundColor:
              resultModal === "success"
                ? "#22C55E"
                : resultModal === "cancel"
                ? "#F59E0B"
                : "#EF4444",
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            py: 0.5,
            borderRadius: "6px",
            "&:hover": {
              backgroundColor:
                resultModal === "success"
                  ? "#16A34A"
                  : resultModal === "cancel"
                  ? "#D97706"
                  : "#DC2626",
            },
          }}
        >
          {t("OK")}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Always render the result Dialog as the SAME child position across every
  // branch — otherwise React unmounts/remounts it when isActive flips and
  // the dialog appears to fire twice (open animation runs in the unmounted
  // tree, then again in the remounted tree).
  const withResultDialog = (body) => (
    <>
      {body}
      {resultDialog}
    </>
  );

  if (isLoading) {
    return withResultDialog(
      <>
        <Stack spacing={2.5} sx={{ p: { xs: 1, sm: 2 } }}>
          <Skeleton
            variant="text"
            width={180}
            height={36}
            sx={{ mx: "auto" }}
          />
          {/* Plan header card */}
          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "16px",
              p: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: (t) =>
                  t.palette.mode === "dark"
                    ? "rgba(139,92,246,0.10)"
                    : "#F3EEFF",
                borderRadius: "12px",
                p: 2,
                mb: 2.5,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={1.75}
              >
                <Skeleton variant="text" width={160} height={28} />
                <Skeleton
                  variant="rounded"
                  width={58}
                  height={24}
                  sx={{ borderRadius: "12px" }}
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Skeleton
                  variant="rounded"
                  height={64}
                  sx={{ flex: 1, borderRadius: "10px" }}
                />
                <Skeleton
                  variant="rounded"
                  height={64}
                  sx={{ flex: 1, borderRadius: "10px" }}
                />
              </Stack>
            </Box>

            {/* Plan details */}
            <Box
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "12px",
                p: 2,
                mb: 2,
              }}
            >
              <Skeleton
                variant="text"
                width={100}
                height={24}
                sx={{ mb: 1.5 }}
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  rowGap: 1.5,
                  columnGap: 2,
                }}
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <Stack
                    key={i}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Skeleton variant="circular" width={20} height={20} />
                    <Stack spacing={0.25} flex={1}>
                      <Skeleton variant="text" width="50%" height={16} />
                      <Skeleton variant="text" width="70%" height={20} />
                    </Stack>
                  </Stack>
                ))}
              </Box>
            </Box>

            {/* Package benefits */}
            <Box
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "12px",
                p: 2,
                mb: 2,
              }}
            >
              <Skeleton
                variant="text"
                width={130}
                height={24}
                sx={{ mb: 1.5 }}
              />
              {Array.from({ length: 2 }).map((_, i) => (
                <Stack
                  key={i}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  mb={1}
                >
                  <Skeleton variant="circular" width={10} height={10} />
                  <Skeleton variant="text" width="80%" height={18} />
                </Stack>
              ))}
            </Box>

            {/* Action buttons */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Skeleton
                variant="rounded"
                height={44}
                sx={{ flex: 1, borderRadius: "8px" }}
              />
              <Skeleton
                variant="rounded"
                height={44}
                sx={{ flex: 1, borderRadius: "8px" }}
              />
            </Stack>
          </Box>

          {/* FAQ */}
          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "16px",
              p: 2,
            }}
          >
            <Skeleton variant="text" width={200} height={24} sx={{ mb: 1.5 }} />
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={48}
                sx={{ mb: 1, borderRadius: "8px" }}
              />
            ))}
          </Box>

          <Skeleton
            variant="text"
            width={140}
            height={20}
            sx={{ mx: "auto" }}
          />
        </Stack>
      </>
    );
  }

  if (!isActive) {
    return withResultDialog(
      <>
        <Stack spacing={2.5} sx={{ p: { xs: 1, sm: 2 } }}>
          <ChoosePlanContent
            layout="split"
            onSubscribe={handleSubscribeFromPage}
            isSubmitting={subscribing}
          />
          {faqsSection}
          <Divider />
          <Typography
            textAlign="center"
            color="text.primary"
            sx={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => setTermsOpen(true)}
          >
            {t("Terms and Condition")}
          </Typography>
        </Stack>
        <ProTermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
        {proPlanPaymentOpen && (
          <ProPlanPaymentModal
            open={proPlanPaymentOpen}
            onClose={() => setProPlanPaymentOpen(false)}
            plan={proPlanSelected}
            onSuccess={() => {
              queryClient.invalidateQueries("pro-customer-active-offer");
              queryClient.invalidateQueries("user-info");
              openResultModal("success");
            }}
          />
        )}
      </>
    );
  }

  return withResultDialog(
    <>
      <Stack spacing={2.5} sx={{ p: { xs: 1, sm: 2 } }}>
        <Typography
          variant="h5"
          fontWeight={700}
          textAlign="center"
          color="text.primary"
        >
          {t("My Subscription")}
        </Typography>

        <Box
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "16px",
            p: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(139, 92, 246, 0.15)"
                  : "#E9DFFF",
              borderRadius: "12px",
              p: 2,
              mb: 2.5,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={1.75}
            >
              <Typography fontSize="18px" fontWeight={700} color="text.primary">
                {planName}
              </Typography>
              <Chip
                label={t("Active")}
                size="small"
                sx={{
                  fontWeight: 600,
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "#86EFAC" : "#16A34A",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(34, 197, 94, 0.15)"
                      : "#DCFCE7",
                }}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              <StatTile label={t("Total Saved")} value={totalSavedDisplay} />
              <StatTile
                label={t("Orders Placed")}
                value={ordersPlacedDisplay}
              />
            </Stack>
          </Box>

          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "12px",
              p: 2,
              mb: 2,
            }}
          >
            <Typography fontWeight={700} mb={1.5} color="text.primary">
              {t("Plan Details")}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                rowGap: 1.5,
                columnGap: 2,
              }}
            >
              <DetailRow
                icon={<CalendarMonthOutlinedIcon fontSize="small" />}
                label={t("Active Since")}
                value={formatDate(activeSinceRaw)}
              />
              <DetailRow
                icon={<EventBusyOutlinedIcon fontSize="small" />}
                label={t("Expires On")}
                value={formatDate(expiresOnRaw)}
              />
              <DetailRow
                icon={<HourglassEmptyRoundedIcon fontSize="small" />}
                label={t("Days Remaining")}
                value={daysRemainingDisplay}
              />
              <DetailRow
                icon={<ReceiptLongOutlinedIcon fontSize="small" />}
                label={t("Paid By")}
                value={paidBy}
              />
            </Box>
          </Box>

          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "12px",
              p: 2,
              mb: 2,
            }}
          >
            <Typography fontWeight={700} mb={1.25} color="text.primary">
              {t("Package Benefits")}
            </Typography>
            {benefits.length > 0 ? (
              <Stack spacing={1}>
                {benefits.map((line, i) => (
                  <Stack
                    key={i}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#22C55E",
                        flexShrink: 0,
                      }}
                    />
                    <Typography fontSize="14px" color="text.primary">
                      {line}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            ) : (
              // Subscribed but `benefit: null` (e.g. backend returned
              // `message: "no_benefit_for_module"`) — surface a friendly
              // explainer instead of an empty card.
              <Stack
                direction="row"
                alignItems="flex-start"
                spacing={1.25}
                sx={{
                  p: 1.5,
                  borderRadius: "10px",
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(245, 158, 11, 0.08)"
                      : "#FFFBEB",
                  border: (theme) =>
                    `1px solid ${
                      theme.palette.mode === "dark"
                        ? "rgba(245, 158, 11, 0.25)"
                        : "#FDE68A"
                    }`,
                }}
              >
                <ErrorOutlineRoundedIcon
                  sx={{
                    fontSize: "20px",
                    color: "#F59E0B",
                    flexShrink: 0,
                    mt: "1px",
                  }}
                />
                <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    fontSize="14px"
                    fontWeight={600}
                    color="text.primary"
                  >
                    {t("No benefits available for this module")}
                  </Typography>
                  <Typography
                    fontSize="13px"
                    color="text.secondary"
                    sx={{ lineHeight: 1.45 }}
                  >
                    {offer?.message === "no_benefit_for_module"
                      ? t(
                          "Your current Pro plan does not include any savings for this module. Switch plans to unlock more rewards."
                        )
                      : t(
                          "We could not find any active benefits on your plan right now."
                        )}
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              fullWidth
              onClick={() => setCancelOpen(true)}
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#192238" : "#F1F5F9",
                color: theme.palette.text.primary,
                fontWeight: 600,
                py: 1.25,
                borderRadius: "10px",
              }}
            >
              {t("Cancel Subscription")}
            </Button>

            <Button
              fullWidth
              onClick={() =>
                isFreeTrial ? setChangePlanOpen(true) : setRenewOpen(true)
              }
              variant="contained"
              sx={{
                backgroundColor: "#8B5CF6",
                fontWeight: 600,
                py: 1.25,
                borderRadius: "10px",
                "&:hover": { backgroundColor: "#7C3AED" },
              }}
            >
              {isFreeTrial ? t("Change Plan") : t("Renew Subscription")}
            </Button>
          </Stack>
        </Box>

        {faqsSection}

        <Divider />
        <Typography
          textAlign="center"
          color="text.primary"
          sx={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => setTermsOpen(true)}
        >
          {t("Terms and Condition")}
        </Typography>
      </Stack>

      <ProTermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
      <RenewSubscriptionModal
        open={renewOpen}
        onClose={() => setRenewOpen(false)}
        onConfirm={handleConfirmRenew}
        isWorking={subscribing}
      />
      <CancelSubscriptionModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleConfirmCancel}
        isWorking={cancelling}
      />
      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={changePlanOpen}
          onClose={() => setChangePlanOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 2,
              py: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              flexShrink: 0,
            }}
          >
            <Typography fontSize="18px" fontWeight={700} color="text.primary">
              {t("Choose a Plan")}
            </Typography>
            <IconButton
              onClick={() => setChangePlanOpen(false)}
              size="small"
              aria-label={t("Close")}
              sx={{ color: "text.secondary" }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>
          <Box
            sx={{
              p: 2,
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <Stack spacing={2.5}>
              <ChoosePlanContent
                layout="split"
                hideHeading
                hideFreeTrial
                onSubscribe={(plan) => {
                  setChangePlanOpen(false);
                  handleSubscribeFromPage(plan);
                }}
                isSubmitting={subscribing}
              />
            </Stack>
          </Box>
        </Drawer>
      ) : (
        <Dialog
          open={changePlanOpen}
          onClose={() => setChangePlanOpen(false)}
          fullWidth
          maxWidth="md"
          scroll="paper"
          PaperProps={{
            sx: {
              borderRadius: "16px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: { xs: 2, sm: 3 },
              py: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              flexShrink: 0,
            }}
          >
            <Typography fontSize="18px" fontWeight={700} color="text.primary">
              {t("Choose a Plan")}
            </Typography>
            <IconButton
              onClick={() => setChangePlanOpen(false)}
              size="small"
              aria-label={t("Close")}
              sx={{ color: "text.secondary" }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>
          <DialogContent
            sx={{
              p: { xs: 2, sm: 3 },
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <Stack spacing={2.5}>
              <ChoosePlanContent
                layout="split"
                hideHeading
                hideFreeTrial
                onSubscribe={(plan) => {
                  setChangePlanOpen(false);
                  handleSubscribeFromPage(plan);
                }}
                isSubmitting={subscribing}
              />
            </Stack>
          </DialogContent>
        </Dialog>
      )}
      <ProPlanSubscriptionModal
        open={renewPlanSelectOpen}
        onClose={() => setRenewPlanSelectOpen(false)}
        headingTitle="Update Your Plan"
        hideFaq
        hideTerms
        hideFreeTrial
        activePlanId={benefit?.plan_id}
        onSubscribe={(selectedPlan) => {
          setProPlanSelected(selectedPlan);
          setRenewPlanSelectOpen(false);
          setProPlanPaymentOpen(true);
        }}
      />
      {proPlanPaymentOpen && (
        <ProPlanPaymentModal
          open={proPlanPaymentOpen}
          onClose={() => setProPlanPaymentOpen(false)}
          plan={proPlanSelected}
          onSuccess={() => {
            queryClient.invalidateQueries("pro-customer-active-offer");
            queryClient.invalidateQueries("user-info");
            openResultModal("success");
          }}
        />
      )}
    </>
  );
};

export default SubscriptionPlanPage;
