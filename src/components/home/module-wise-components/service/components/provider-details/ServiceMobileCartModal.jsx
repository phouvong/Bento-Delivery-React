import React from "react";
import { Box, Drawer, Stack, Typography, useTheme } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { PrimaryButton } from "components/Map/map.style";
import ProPlanBanner from "components/pro-plan/ProPlanBanner";
import ProSavingsBanner from "components/pro-plan/ProSavingsBanner";

import useStoreCartData from "./cart/useStoreCartData";
import EmptyCartState, { FreeDeliveryHint } from "./cart/EmptyCartState";
import CartItemsList from "./cart/CartItemsList";
import SuggestedItemsCarousel from "./cart/SuggestedItemsCarousel";
import CartSubtotalBreakdown from "./cart/CartSubtotalBreakdown";
import CartAuxModals from "./cart/CartAuxModals";

const ServiceMobileCartModal = ({ open, onClose, providerDetails }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const cart = useStoreCartData({ providerDetails, onAfterNavigate: onClose });
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
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            borderRadius: "16px 16px 0 0",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Drag handle */}
        <Box
          sx={{
            pt: 1.25,
            pb: 0.5,
            display: "flex",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: theme.palette.divider,
            }}
          />
        </Box>

        {!isEmpty && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 2.5,
              py: 1.25,
              borderBottom: `1px solid ${theme.palette.divider}`,
              flexShrink: 0,
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
                "&:hover": { color: theme.palette.warning.dark },
              }}
            >
              {t("Clear All")}
            </Typography>
          </Stack>
        )}

        {/* Scrollable content */}
        <SimpleBar style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
          <Stack sx={{ px: 2.5, pb: 2, pt: 1.5 }}>
            {isEmpty ? (
              <EmptyCartState configData={configData} />
            ) : (
              <>
                <CartItemsList moduleCartList={moduleCartList} />
                <FreeDeliveryHint configData={configData} />
              </>
            )}

            {/* Pro Plan banners */}
            {proFeatureEnabled && hasToken && proOfferResolved && !isProMember && (
              <Box sx={{ mt: 2, width: "100%" }}>
                <ProPlanBanner onSubscribe={() => setProModalOpen(true)} />
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
            padding: "12px 20px 20px",
            backgroundColor: theme.palette.background.paper,
            flexShrink: 0,
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
            size="large"
            fullWidth
            borderRadius="10px"
          >
            {t("Checkout")}
          </PrimaryButton>
        </CustomStackFullWidth>
        )}
      </Drawer>

      <CartAuxModals {...cart} />
    </>
  );
};

export default ServiceMobileCartModal;
