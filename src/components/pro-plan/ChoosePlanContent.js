import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import useGetProPlans from "../../api-manage/hooks/react-query/pro-plans/useGetProPlans";
import useGetProFaqs, {
  resolveFaq,
  toFaqList,
} from "../../api-manage/hooks/react-query/pro-plans/useGetProFaqs";
import ProTermsModal from "./ProTermsModal";
import { getAmountWithSign } from "helper-functions/CardHelpers";

const PURPLE =
  "linear-gradient(93.06deg, rgba(255, 255, 255, 0.46) 0.4%, rgba(255, 255, 255, 0.3) 99.81%)";
const PURPLE_DARK = "#7C3AED";
const LIGHT_PURPLE = "#EDE7FF";
const NEUTRAL_BG = "#F3F4F6";
const GREEN = "#22C55E";
const ORANGE = "#F59E0B";

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const mapApiPlan = (raw) => {
  const days = toNumber(raw?.duration, 0);
  return {
    id: String(raw?.id ?? ""),
    days,
    price: toNumber(raw?.price, 0),
    title: String(raw?.plan_name ?? ""),
    label: String(
      raw?.duration_label ?? `${String(days).padStart(2, "0")} Days`
    ),
  };
};

// Prettified fallback label for a module key like "ride-share" → "Ride Share"
// — only used when the module isn't found in the app's own module list
// below, so it's an English string as a last resort, not the normal path.
const prettifyModuleName = (key) =>
  String(key || "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const normalizeModuleKey = (key) =>
  String(key || "")
    .toLowerCase()
    .replace(/[-_\s]+/g, "");

// Resolves a benefits-object module key (e.g. "ride_share") to the SAME
// module_name the rest of the app already shows (module tabs, home page —
// see NewNavBar.js) — that name comes from the backend already localized to
// the active language, so this avoids inventing new translation keys per
// module per language. Falls back to a prettified (English) key only if the
// module truly isn't in the account's module list.
const makeModuleLabelResolver = (modules) => (key) => {
  const target = normalizeModuleKey(key);
  const match = modules?.find(
    (m) => normalizeModuleKey(m?.module_type) === target,
  );
  return match?.module_name || prettifyModuleName(key);
};

// Build one bullet per module from the modules map. Used when the
// backend ships `setup_mode: "individual"` and the actual percentages
// live under `modules.<moduleKey>`. The flat `b.<type>.percentage` style
// is treated as an "all modules" fallback.
const hasModulesMap = (group) =>
  group?.modules &&
  typeof group.modules === "object" &&
  Object.keys(group.modules).length > 0;

// Every sentence below is composed via t() + interpolation (never a plain JS
// template string handed to t() after the fact) — i18next only translates on
// an exact key match, so a pre-built string like "10% off on Grocery (up to
// $100)" can never match a translation entry and silently renders in English
// regardless of the active language. The {{percent}}/{{module}}/{{cap}}/
// {{min}} keys below must stay in sync with src/language/*.js.
const buildDiscountLines = (discount, t, moduleLabel) => {
  const out = [];
  if (!discount || discount.active !== 1) return out;
  const hasMin = (mod) =>
    mod?.min_order_status === 1 && toNumber(mod?.min_order_amount, 0) > 0;
  const hasCap = (mod) => toNumber(mod?.max_amount, 0) > 0;

  const titleFor = (pct, moduleName, mod) => {
    const cap = getAmountWithSign(toNumber(mod?.max_amount, 0));
    const min = getAmountWithSign(toNumber(mod?.min_order_amount, 0));
    if (hasCap(mod) && hasMin(mod)) {
      return t("{{percent}}% off on {{module}} (up to {{cap}}) (on orders above {{min}})", {
        percent: pct,
        module: moduleName,
        cap,
        min,
      });
    }
    if (hasCap(mod)) {
      return t("{{percent}}% off on {{module}} (up to {{cap}})", {
        percent: pct,
        module: moduleName,
        cap,
      });
    }
    if (hasMin(mod)) {
      return t("{{percent}}% off on {{module}} (on orders above {{min}})", {
        percent: pct,
        module: moduleName,
        min,
      });
    }
    return t("{{percent}}% off on {{module}}", { percent: pct, module: moduleName });
  };

  const descFor = (pct, mod) => {
    const cap = getAmountWithSign(toNumber(mod?.max_amount, 0));
    const min = getAmountWithSign(toNumber(mod?.min_order_amount, 0));
    if (hasCap(mod) && hasMin(mod)) {
      return t("Get {{percent}}% off (up to {{cap}}) (on orders above {{min}})", {
        percent: pct,
        cap,
        min,
      });
    }
    if (hasCap(mod)) {
      return t("Get {{percent}}% off (up to {{cap}})", { percent: pct, cap });
    }
    if (hasMin(mod)) {
      return t("Get {{percent}}% off (on orders above {{min}})", { percent: pct, min });
    }
    return t("Get {{percent}}% off", { percent: pct });
  };

  // Per-module mode — emit one bullet for each module the admin
  // configured. We trigger this whenever a `modules` map is present
  // (setup_mode is optional on some backend versions).
  if (hasModulesMap(discount)) {
    Object.entries(discount.modules).forEach(([key, mod]) => {
      const pct = toNumber(mod?.percentage, 0);
      if (pct <= 0) return;
      out.push({
        title: titleFor(pct, moduleLabel(key), mod),
        description: descFor(pct, mod),
      });
    });
    return out;
  }
  const pct = toNumber(discount.percentage, 0);
  const max = toNumber(discount.max_amount, 0);
  out.push({
    title: t("Discount on all orders"),
    description:
      max > 0
        ? t("Get {{percent}}% off on all orders (up to {{cap}})", {
            percent: pct,
            cap: getAmountWithSign(max),
          })
        : t("Get {{percent}}% off on all orders", { percent: pct }),
  });
  return out;
};

const buildDeliveryFeeLines = (deliveryFee, t, moduleLabel) => {
  const out = [];
  if (!deliveryFee || deliveryFee.active !== 1) return out;
  const hasMin = (mod) =>
    mod?.min_order_status === 1 && toNumber(mod?.min_order_amount, 0) > 0;
  const isFree = (mod) =>
    mod?.offer_type === "full_free" || mod?.offer_type === "free";

  const titleFor = (moduleName, mod) => {
    const min = getAmountWithSign(toNumber(mod?.min_order_amount, 0));
    if (isFree(mod)) {
      return hasMin(mod)
        ? t("Free delivery on {{module}} (on orders above {{min}})", { module: moduleName, min })
        : t("Free delivery on {{module}}", { module: moduleName });
    }
    const pct = toNumber(mod?.charge_discount_percentage, 0);
    if (pct > 0) {
      return hasMin(mod)
        ? t("{{percent}}% off on delivery fee on {{module}} (on orders above {{min}})", {
            percent: pct,
            module: moduleName,
            min,
          })
        : t("{{percent}}% off on delivery fee on {{module}}", {
            percent: pct,
            module: moduleName,
          });
    }
    return hasMin(mod)
      ? t("Delivery fee benefit on {{module}} (on orders above {{min}})", { module: moduleName, min })
      : t("Delivery fee benefit on {{module}}", { module: moduleName });
  };

  const descFor = (mod) => {
    const min = getAmountWithSign(toNumber(mod?.min_order_amount, 0));
    if (isFree(mod)) {
      return hasMin(mod)
        ? t("Free delivery (on orders above {{min}})", { min })
        : t("Free delivery");
    }
    const pct = toNumber(mod?.charge_discount_percentage, 0);
    if (pct > 0) {
      return hasMin(mod)
        ? t("{{percent}}% off on delivery fee (on orders above {{min}})", { percent: pct, min })
        : t("{{percent}}% off on delivery fee", { percent: pct });
    }
    return hasMin(mod)
      ? t("Delivery fee benefit (on orders above {{min}})", { min })
      : t("Delivery fee benefit");
  };

  if (hasModulesMap(deliveryFee)) {
    Object.entries(deliveryFee.modules).forEach(([key, mod]) => {
      out.push({
        title: titleFor(moduleLabel(key), mod),
        description: descFor(mod),
      });
    });
    return out;
  }
  const fullFree = deliveryFee.offer_type === "full_free";
  const pct = toNumber(deliveryFee.charge_discount_percentage, 0);
  out.push({
    title: t("Free delivery"),
    description: fullFree
      ? t("Enjoy unlimited free deliveries")
      : t("Get {{percent}}% off delivery fee", { percent: pct }),
  });
  return out;
};

const mapBenefitsObject = (b, t, moduleLabel) => {
  if (!b) return [];
  const out = [];
  out.push(...buildDiscountLines(b.discount, t, moduleLabel));
  // The sample payload sometimes has the delivery_fee modules even when
  // `active: 0` — we treat the top-level flag as the source of truth so
  // we don't list inactive promises.
  out.push(...buildDeliveryFeeLines(b.delivery_fee, t, moduleLabel));
  if (b.coupon?.active === 1) {
    out.push({
      title: t("Exclusive coupon on order"),
      description: t("Unlock exclusive coupon deals for all orders"),
    });
  }
  return out;
};

// Shared plan-selection UI used by both ProPlanSubscriptionModal (stacked
// layout) and SubscriptionPlanPage (split layout). `onSubscribe(plan)` is
// fired when the user clicks the CTA — parent decides whether to subscribe
// inline (free-trial) or open the payment-method modal (paid plans).
const ChoosePlanContent = ({
  onSubscribe,
  hideHeading = false,
  headingTitle,
  ctaLabel,
  layout = "stacked",
  isSubmitting = false,
  hideFaq = false,
  hideTerms = false,
  activePlanId,
  hideFreeTrial = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { modules } = useSelector((state) => state.configData);

  const { data: plansResponse, isLoading: plansLoading } = useGetProPlans();

  const response = useMemo(() => {
    const raw = plansResponse?.data ?? plansResponse ?? {};
    return raw && typeof raw === "object" ? raw : {};
  }, [plansResponse]);

  const plans = useMemo(() => {
    const list = Array.isArray(response.plans) ? response.plans : [];
    const mapped = list
      .filter((p) => p.status === undefined || p.status === 1)
      .map(mapApiPlan);
    // Renew flow hides the free-trial option since the user has already used
    // their trial — only paid plans should be selectable.
    return hideFreeTrial ? mapped.filter((p) => Number(p.price) > 0) : mapped;
  }, [response, hideFreeTrial]);

  // Benefits are entirely backend-driven (per-module percentages/caps set by
  // the admin) — there's no static fallback here anymore. Showing a fixed
  // "10% off on all orders" placeholder when the account actually has no
  // active Pro benefits configured would just be a promise the app can't
  // keep, so an empty/loading response renders an empty list, not fake data.
  const moduleLabel = useMemo(() => makeModuleLabelResolver(modules), [modules]);
  const benefits = useMemo(
    () => mapBenefitsObject(response.benefits, t, moduleLabel),
    [response, t, moduleLabel],
  );

  const headerTitle = response.pro_brand ?? "Pro Plan";
  const headerSubtitle = "Save more on every order";

  const { data: faqsRaw } = useGetProFaqs();
  const faqs = toFaqList(faqsRaw)
    .map(resolveFaq)
    .filter((f) => f.question.length > 0 || f.answer.length > 0);
  const [termsOpen, setTermsOpen] = useState(false);

  const [selectedId, setSelectedId] = useState("");
  useEffect(() => {
    if (plans.length > 0 && !plans.some((p) => p.id === selectedId)) {
      const activeMatch =
        activePlanId != null
          ? plans.find((p) => p.id === String(activePlanId))
          : null;
      const fallback = activeMatch ?? plans[0];
      setSelectedId(fallback.id);
    }
  }, [plans, selectedId, activePlanId]);

  const selectedPlan =
    plans.find((p) => p.id === selectedId) ?? plans[0] ?? null;

  const isRenewingActivePlan =
    activePlanId != null && selectedId === String(activePlanId);
  const buttonLabel =
    ctaLabel ??
    (activePlanId != null
      ? isRenewingActivePlan
        ? t("Renew")
        : t("Shift Plan")
      : selectedPlan && selectedPlan.price === 0
      ? t("Start Free Trial")
      : t("Subscribe Now"));

  const heading = !hideHeading && (
    <Stack alignItems="center" spacing={0.5}>
      <Typography fontSize="20px" fontWeight={700} textAlign="center">
        {t(headingTitle ?? "Choose Your Plan")}
      </Typography>
      <Typography fontSize="13px" color="text.secondary" textAlign="center">
        {t(
          "Unlock exclusive benefits, save more on every order, and enjoy free deliveries."
        )}
      </Typography>
    </Stack>
  );

  const brandHeader = (
    <Stack alignItems="center" spacing={1}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: ORANGE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <i
          className="fi fi-sr-crown"
          style={{
            fontSize: 18,
            lineHeight: 1,
            display: "flex",
            color: "#fff",
          }}
        />
      </Box>
      <Stack alignItems="center" spacing={0.25} sx={{ mt: 0.25 }}>
        <Typography
          fontSize="16px"
          fontWeight={400}
          color="text.primary"
          textAlign="center"
        >
          {t(headerTitle)}
        </Typography>
        <Typography fontSize="14px" color="text.secondary" textAlign="center">
          {t(headerSubtitle)}
        </Typography>
      </Stack>
    </Stack>
  );

  const benefitsList = (
    <Stack spacing={{ xs: 1.25, sm: 1.75 }}>
      {plansLoading && benefits.length === 0
        ? Array.from({ length: 3 }).map((_, i) => (
            <Stack
              key={`benefit-skel-${i}`}
              direction="row"
              spacing={1.25}
              alignItems="flex-start"
            >
              <Skeleton variant="circular" width={20} height={20} />
              <Stack spacing={0.25} sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="80%" />
              </Stack>
            </Stack>
          ))
        : benefits.map((b) => (
            <Stack
              key={b.title}
              direction="row"
              spacing={1.25}
              alignItems="flex-start"
            >
              <Box
                sx={{
                  width: { xs: 20, sm: 22 },
                  height: { xs: 20, sm: 22 },
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  mt: "1px",
                }}
              >
                <CheckRoundedIcon sx={{ color: GREEN, fontSize: { xs: 13, sm: 16 } }} />
              </Box>
              <Stack spacing={0.25}>
                <Typography
                  fontSize={{ xs: "13px", sm: "15px" }}
                  fontWeight={600}
                  color="text.primary"
                >
                  {b.title}
                </Typography>
                <Typography fontSize={{ xs: "12px", sm: "14px" }} color="text.secondary">
                  {b.description}
                </Typography>
              </Stack>
            </Stack>
          ))}
    </Stack>
  );

  const durationScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  useEffect(() => {
    const el = durationScrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY || e.deltaX;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });

  useEffect(() => {
    const el = durationScrollRef.current;
    if (!el) return;
    const update = () => {
      const overflow = el.scrollWidth > el.clientWidth + 1;
      setCanScrollLeft(overflow && el.scrollLeft > 0);
      setCanScrollRight(
        overflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 1
      );
    };
    update();
    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(el);
      Array.from(el.children).forEach((child) => ro.observe(child));
    }
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, [plans.length]);

  const scrollDurationBy = (direction) => {
    const el = durationScrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * Math.max(el.clientWidth * 0.7, 120),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = durationScrollRef.current;
    if (!container || !selectedId) return;
    const selectedEl = container.querySelector(
      `[data-plan-id="${selectedId}"]`
    );
    if (!selectedEl) return;
    const containerLeft = container.scrollLeft;
    const containerRight = containerLeft + container.clientWidth;
    const elLeft = selectedEl.offsetLeft;
    const elRight = elLeft + selectedEl.offsetWidth;
    if (elLeft < containerLeft || elRight > containerRight) {
      selectedEl.scrollIntoView({ inline: "nearest", block: "nearest" });
    }
  }, [selectedId]);

  const durationSelector = (
    <Stack spacing={1}>
      <Typography fontSize="13px" fontWeight={500} color="text.primary">
        {t("Select duration")}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={0.75}>
        {canScrollLeft && (
          <IconButton
            onClick={() => scrollDurationBy(-1)}
            aria-label={t("Scroll left")}
            size="small"
            sx={{
              flexShrink: 0,
              width: 28,
              height: 28,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              backgroundColor: (theme) => theme.palette.background.paper,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
            }}
          >
            <ChevronLeftRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
        <Box
          ref={durationScrollRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            p: 0.75,
            flex: 1,
            minWidth: 0,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#192238" : NEUTRAL_BG,
            borderRadius: "14px",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {plansLoading && plans.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <Box
                  key={`skeleton-${i}`}
                  sx={{ minWidth: 72, py: 1.5, px: 1 }}
                >
                  <Skeleton variant="rounded" height={20} />
                </Box>
              ))
            : plans.map((plan) => {
                const isSelected = plan.id === selectedId;
                return (
                  <Box
                    key={plan.id}
                    data-plan-id={plan.id}
                    onClick={() => setSelectedId(plan.id)}
                    sx={{
                      flexShrink: 0,
                      minWidth: "fit-content",
                      px: 1.5,
                      py: 1.5,
                      borderRadius: "10px",
                      textAlign: "center",
                      fontSize: "13px",
                      fontWeight: isSelected ? 700 : 500,
                      cursor: "pointer",
                      backgroundColor: (theme) =>
                        isSelected
                          ? theme.palette.background.paper
                          : "transparent",
                      color: (theme) =>
                        isSelected ? PURPLE : theme.palette.text.primary,
                      boxShadow: isSelected
                        ? "0 1px 2px rgba(0,0,0,0.06)"
                        : "none",
                      userSelect: "none",
                      transition: "background-color 120ms, color 120ms",
                    }}
                  >
                    {plan.label}
                  </Box>
                );
              })}
        </Box>
        {canScrollRight && (
          <IconButton
            onClick={() => scrollDurationBy(1)}
            aria-label={t("Scroll right")}
            size="small"
            sx={{
              flexShrink: 0,
              width: 28,
              height: 28,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              backgroundColor: (theme) => theme.palette.background.paper,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
            }}
          >
            <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Stack>
    </Stack>
  );

  const priceCard = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(139, 92, 246, 0.18)"
            : LIGHT_PURPLE,
        borderRadius: "12px",
        px: 2,
        py: 1,
      }}
    >
      {selectedPlan ? (
        <>
          <Typography fontSize="14px" fontWeight={700} color="text.primary">
            {selectedPlan.price === 0 ? t("Free Trial") : t(selectedPlan.title)}
          </Typography>
          <Stack direction="row" alignItems="baseline" spacing={0.5}>
            <Typography fontSize="28px" fontWeight={800} color="text.primary">
              ${selectedPlan.price.toFixed(2)}
            </Typography>
            <Typography fontSize="12px" color="text.secondary">
              / {selectedPlan.days} {t("days")}
            </Typography>
          </Stack>
        </>
      ) : (
        <Skeleton variant="text" width="100%" height={40} />
      )}
    </Stack>
  );

  const ctaButton = (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        // Pushes the CTA to the bottom of its flex column parent
        // (right pane in the split layout, plan card otherwise) so
        // the button sits at the end no matter how short the price
        // section is.
        mt: "auto",
      }}
    >
      <Button
        variant="contained"
        disabled={!selectedPlan || isSubmitting}
        onClick={() => selectedPlan && onSubscribe?.(selectedPlan)}
        sx={{
          background:
            selectedPlan && selectedPlan.price === 0
              ? "#111827"
              : `linear-gradient(90deg, ${PURPLE} 0%, #A78BFA 100%)`,
          width: "100%",
          maxWidth: 270,
          height: "40px",
          minHeight: "40px",
          py: 0,
          fontSize: "14px",
          fontWeight: 700,
          textTransform: "none",
          borderRadius: "6px",
          boxShadow: "none",
          color: "#fff",
          "&:hover": {
            background:
              selectedPlan && selectedPlan.price === 0
                ? "#000"
                : `linear-gradient(90deg, ${PURPLE_DARK} 0%, ${PURPLE} 100%)`,
            boxShadow: "none",
          },
          "&.Mui-disabled": {
            color: "#fff",
            opacity: 0.85,
          },
        }}
      >
        {isSubmitting ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          buttonLabel
        )}
      </Button>
    </Box>
  );

  if (layout === "split") {
    return (
      <Stack spacing={2}>
        {heading}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="stretch"
        >
          <Box
            sx={{
              flex: 1,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(139, 92, 246, 0.15)"
                  : LIGHT_PURPLE,
              borderRadius: "14px",
            }}
          >
            <Stack spacing={2.25}>
              <Box
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.04)"
                      : "rgba(255, 255, 255, 0.45)",
                  borderBottomLeftRadius: "14px",
                  borderBottomRightRadius: "14px",
                  px: 2.5,
                  pt: 2.5,
                  pb: 2.5,
                }}
              >
                {brandHeader}
              </Box>
              <Box sx={{ px: 2.5, py: 2.25 }}>{benefitsList}</Box>
            </Stack>
          </Box>
          <Box
            sx={{
              flex: 1,
              backgroundColor: (theme) => theme.palette.background.paper,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: "14px",
              p: 2.5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {durationSelector}
            {priceCard}
            {/* ctaButton ships its own `mt: auto` — now that it's a
                direct child of this flex column, that margin actually
                consumes the remaining vertical space. */}
            {ctaButton}
          </Box>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      {heading}
      <Box
        sx={{
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(139, 92, 246, 0.15)"
                : LIGHT_PURPLE,
          }}
        >
          <Box
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.04)"
                  : "rgba(255, 255, 255, 0.45)",
              borderBottomLeftRadius: "14px",
              borderBottomRightRadius: "14px",
              px: { xs: 2, sm: 2.5 },
              pt: { xs: 2, sm: 2.5 },
              pb: { xs: 2, sm: 2.5 },
            }}
          >
            {brandHeader}
          </Box>
          <Box sx={{ px: { xs: 2, sm: 2.5 }, py: { xs: 1.5, sm: 2.25 } }}>{benefitsList}</Box>
        </Box>
        <Stack
          spacing={2}
          sx={{
            backgroundColor: (theme) => theme.palette.background.paper,
            px: { xs: 2, sm: 2.5 },
            py: { xs: 2, sm: 2.5 },
          }}
        >
          {durationSelector}
          {priceCard}
          {ctaButton}
        </Stack>
      </Box>

      {!hideFaq && faqs.length > 0 && (
        <Box
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "14px",
            p: 2,
          }}
        >
          <Typography fontWeight={700} mb={1.25}>
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
                  <Typography fontSize="14px">{faq.question}</Typography>
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
      )}

      {!hideTerms && <Divider />}
      {!hideTerms && (
        <Typography
          textAlign="center"
          sx={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => setTermsOpen(true)}
        >
          {t("Terms and Condition")}
        </Typography>
      )}

      <ProTermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </Stack>
  );
};

export default ChoosePlanContent;
