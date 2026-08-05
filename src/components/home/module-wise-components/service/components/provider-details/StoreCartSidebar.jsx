import React from "react";
import { Box, Skeleton, Stack, Typography, alpha, styled, useTheme } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import StarIcon from "@mui/icons-material/Star";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { PrimaryButton } from "components/Map/map.style";
import ProSavingsBanner from "components/pro-plan/ProSavingsBanner";

import useStoreCartData from "./cart/useStoreCartData";
import EmptyCartState, { FreeDeliveryHint } from "./cart/EmptyCartState";
import CartItemsList from "./cart/CartItemsList";
import SuggestedItemsCarousel from "./cart/SuggestedItemsCarousel";
import CartSubtotalBreakdown from "./cart/CartSubtotalBreakdown";
import CartAuxModals from "./cart/CartAuxModals";

const SidebarSurface = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 70,
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: `0px 2px 12px ${alpha(theme.palette.text.primary, 0.04)}`,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  maxHeight: "calc(100vh - 32px)",
}));

const ServiceProPlanBanner = ({ onSubscribe }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Box
      onClick={onSubscribe}
      sx={{
        width: "100%",
        px: 1.5,
        py: 1.25,
        borderRadius: "14px",
        backgroundColor: theme.palette.customColor.proBannerBlueBg,
        border: `1.5px dashed ${alpha(
          theme.palette.whiteContainer.main,
          0.45,
        )}`,
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          backgroundColor: theme.palette.customColor.starAmber,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <i
          className="fi fi-sr-crown"
          style={{
            fontSize: "12px",
            lineHeight: 1,
            color: theme.palette.whiteContainer.main,
            display: "flex",
          }}
        />
      </Box>
      <Typography
        sx={{
          flex: 1,
          fontSize: "13px",
          color: theme.palette.whiteContainer.main,
          lineHeight: 1.4,
        }}
      >
        {t("Use")}{" "}
        <Box component="span" sx={{ fontWeight: 700, fontStyle: "italic" }}>
          {t("Pro Plan")}
        </Box>{" "}
        {t("to get extra savings in every order.")}
      </Typography>
      <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 700,
            color: theme.palette.whiteContainer.main,
            whiteSpace: "nowrap",
          }}
        >
          {t("Explore")}
        </Typography>
        <ChevronRightIcon
          sx={{ fontSize: 18, color: theme.palette.whiteContainer.main }}
        />
      </Stack>
    </Box>
  );
};

const CartSkeleton = () => (
  <Stack sx={{ px: 2.5, py: 2.5 }} spacing={2}>
    <Stack direction="row" justifyContent="space-between">
      <Skeleton width={60} height={24} />
      <Skeleton width={70} height={20} />
    </Stack>
    {[1, 2].map((i) => (
      <Stack key={i} direction="row" spacing={1.5} alignItems="center">
        <Skeleton variant="rounded" width={56} height={56} />
        <Stack spacing={0.75} flex={1}>
          <Skeleton width="70%" height={18} />
          <Skeleton width="40%" height={16} />
        </Stack>
      </Stack>
    ))}
    <Stack spacing={1} sx={{ pt: 1 }}>
      <Skeleton width="50%" height={18} />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Skeleton width={80} height={28} />
        <Skeleton variant="rounded" width={100} height={40} />
      </Stack>
    </Stack>
  </Stack>
);

const StoreCartSidebar = ({ providerDetails, isLoading }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const cart = useStoreCartData({ providerDetails });

  if (isLoading) {
    return (
      <SidebarSurface>
        <CartSkeleton />
      </SidebarSurface>
    );
  }
  const {
    configData,
    moduleCartList,
    isEmpty,
    subtotal,
    originalSubtotal,
    showOriginalSubtotal,
    suggestedItems,
    subtotalCollapsed,
    setSubtotalCollapsed,
    proFeatureEnabled,
    hasToken,
    activeOffer,
    isProMember,
    isProActive,
    proOfferResolved,
    proSavingsMessage,
    setProModalOpen,
    handleCheckout,
  } = cart;

  return (
    <SidebarSurface>
      {!isEmpty && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            padding: "16px 20px",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {t("Cart")}
          </Typography>
          <Typography
            onClick={() => cart.setClearOpen(true)}
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: theme.palette.warning.main,
              cursor: "pointer",
              "&:hover": {
                color: theme.palette.warning.dark,
              },
            }}
          >
            {t("Clear All")}
          </Typography>
        </Stack>
      )}

      <SimpleBar style={{ maxHeight: "calc(100vh - 300px)", width: "100%" }}>
        <Stack sx={{ px: 2.5, pb: 1, mt: "1rem" }}>
          {isEmpty ? (
            <EmptyCartState configData={configData} />
          ) : (
            <>
              <CartItemsList
                moduleCartList={moduleCartList}
                rowSpacingTop="1rem"
              />
              <FreeDeliveryHint configData={configData} />
            </>
          )}

          {/* Pro Plan banners */}
          {proFeatureEnabled &&
            hasToken &&
            proOfferResolved &&
            !isProMember && (
              <Box sx={{ mt: 2, width: "100%" }}>
                <ServiceProPlanBanner
                  onSubscribe={() => setProModalOpen(true)}
                />
              </Box>
            )}
          {proFeatureEnabled && hasToken && proOfferResolved && isProActive && (
            <Box sx={{ mt: 2, width: "100%", mb: 1 }}>
              <ProSavingsBanner
                amount={
                  activeOffer?.total_saved ??
                  activeOffer?.plan_details?.total_saved
                }
                message={proSavingsMessage}
              />
            </Box>
          )}

          <SuggestedItemsCarousel suggestedItems={suggestedItems} />
        </Stack>
      </SimpleBar>

      {!isEmpty && (
        <CustomStackFullWidth
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            padding: "12px 20px 16px",
            backgroundColor: theme.palette.background.paper,
          }}
          spacing={1.25}
        >
          <CartSubtotalBreakdown
            collapsed={subtotalCollapsed}
            subtotal={subtotal}
            originalSubtotal={originalSubtotal}
            showOriginalSubtotal={showOriginalSubtotal}
          />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
          >
            {/* Subtotal row with collapse toggle */}
            <Stack
              direction="column"
              alignItems="start"
              justifyContent="space-between"
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.5}
                sx={{ cursor: isEmpty ? "default" : "pointer" }}
                onClick={() => !isEmpty && setSubtotalCollapsed((v) => !v)}
              >
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  {t("Subtotal")}
                </Typography>
                {!isEmpty && (
                  <>
                    <StarIcon
                      sx={{
                        fontSize: 15,
                        color: theme.palette.warning.new,
                      }}
                    />
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: 18,
                        color: theme.palette.text.secondary,
                        transform: subtotalCollapsed
                          ? "rotate(0deg)"
                          : "rotate(180deg)",
                        transition: "transform 250ms ease",
                      }}
                    />
                  </>
                )}
              </Stack>
              <Stack direction="row" alignItems="baseline" spacing={0.75}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  }}
                >
                  {getAmountWithSign(subtotal)}
                </Typography>
                {showOriginalSubtotal && (
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: theme.palette.text.disabled,
                      textDecoration: "line-through",
                    }}
                  >
                    {getAmountWithSign(originalSubtotal)}
                  </Typography>
                )}
              </Stack>
            </Stack>

            <PrimaryButton
              onClick={handleCheckout}
              variant="contained"
              width="auto"
              borderRadius="10px"
            >
              {t("Checkout")}
            </PrimaryButton>
          </Stack>
        </CustomStackFullWidth>
      )}

      <CartAuxModals {...cart} />
    </SidebarSurface>
  );
};

export default StoreCartSidebar;
