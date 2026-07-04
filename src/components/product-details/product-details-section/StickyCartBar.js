import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  alpha,
  Box,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "../../../helper-functions/CardHelpers";
import { isVariationAvailable } from "./helperFunction";

const QtyBtn = ({ icon, onClick, disabled, theme, small }) => (
  <Box
    role="button"
    aria-disabled={disabled}
    onClick={disabled ? undefined : onClick}
    sx={{
      width: small ? 28 : 36,
      height: small ? 28 : 36,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      cursor: disabled ? "not-allowed" : "pointer",
      flexShrink: 0,
      color: disabled
        ? alpha(theme.palette.text.secondary, 0.4)
        : theme.palette.neutral?.[1050] ?? theme.palette.text.primary,
      "&:hover": disabled ? undefined : { backgroundColor: theme.palette.action.hover },
    }}
  >
    <i
      className={icon}
      style={{ fontSize: small ? "14px" : "16px", display: "flex", lineHeight: 1 }}
    />
  </Box>
);

const StickyCartBar = ({
  visible,
  modalData,
  decrementQuantity,
  incrementQuantity,
  addToCard,
  isLoading,
  modalmanage,
  handleUpdateToCart,
  updateIsLoading,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isInModal = modalmanage === "true" || modalmanage === true;
  const [portalTarget, setPortalTarget] = useState(null);
  const { cartList } = useSelector((state) => state.cart);
  // Find the cart row for this product+store. If present, the bar should
  // act as Update-to-Cart (correct label + route click to update handler)
  // instead of always saying Add To Cart and creating a duplicate row.
  const inCartItem =
    cartList?.length > 0
      ? cartList.find(
          (item) =>
            String(item?.id) === String(modalData?.id) &&
            (modalData?.store_id == null ||
              String(item?.store_id) === String(modalData?.store_id))
        )
      : null;

  useEffect(() => {
    if (!isInModal) return;
    const node = document.getElementById("module-modal-sticky-target");
    setPortalTarget(node);
  }, [isInModal, modalData]);

  if (!modalData) return null;

  // On mobile or in a modal, the bar is always shown; on desktop, it depends
  // on the scroll-based `visible` flag from the parent.
  const isShown = isMobile || isInModal ? true : visible;

  const discountedPrice = getDiscountedAmount(
    modalData?.totalPrice,
    modalData?.discount,
    modalData?.discount_type,
    modalData?.store_discount,
    modalData?.quantity
  );
  const totalAmount = getAmountWithSign(discountedPrice);
  const hasDiscount =
    typeof modalData?.totalPrice === "number" &&
    discountedPrice < modalData.totalPrice;
  const originalAmount = hasDiscount
    ? getAmountWithSign(modalData.totalPrice)
    : null;

  const totalBlock = (
    <Stack spacing={0.25} sx={{ minWidth: 0 }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography
          sx={{
            fontSize: { xs: "12px", md: "13px" },
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {t("Total")}
        </Typography>
        {/* <Typography
          sx={{
            fontSize: { xs: "11px", md: "12px" },
            color: theme.palette.text.secondary,
          }}
        >
          {t("(Inc. VAT/TAX)")}
        </Typography> */}
      </Stack>
      <Stack direction="row" alignItems="baseline" spacing={1}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: "18px", md: "20px" },
            color: theme.palette.text.primary,
            whiteSpace: "nowrap",
          }}
        >
          {totalAmount}
        </Typography>
        {originalAmount && (
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "14px" },
              color: theme.palette.text.secondary,
              textDecoration: "line-through",
              whiteSpace: "nowrap",
            }}
          >
            {originalAmount}
          </Typography>
        )}
      </Stack>
    </Stack>
  );

  const selectedLabels =
    Array.isArray(modalData?.selectedOption) && modalData.selectedOption.length
      ? modalData.selectedOption
          .map((opt) => opt?.type?.replaceAll("-", ", "))
          .filter(Boolean)
          .join(", ")
      : "";

  const inStock = modalData?.stock > 0 && isVariationAvailable(modalData);

  const qtyControl = (
    <Stack
      direction="row"
      alignItems="center"
      gap="4px"
      sx={{
        flexShrink: 0,
        p: { xs: "3px", md: "4px" },
        backgroundColor: theme.palette.background.secondary,
        borderRadius: "8px",
      }}
    >
      <QtyBtn
        icon="fi fi-rr-minus-small"
        onClick={decrementQuantity}
        disabled={modalData?.totalPrice === 0 || modalData?.quantity <= 1}
        theme={theme}
        small={isMobile}
      />
      <Box
        sx={{
          width: { xs: 28, md: 36 },
          height: { xs: 28, md: 36 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.background.paper,
          borderRadius: "6px",
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: "15px", md: "18px" },
            letterSpacing: "-0.54px",
            lineHeight: 1.1,
            fontVariantNumeric: "tabular-nums",
            color: "neutral.1050",
            userSelect: "none",
          }}
        >
          {modalData?.quantity}
        </Typography>
      </Box>
      <QtyBtn
        icon="fi fi-rr-plus-small"
        onClick={incrementQuantity}
        theme={theme}
        small={isMobile}
      />
    </Stack>
  );

  const isCartLoading = isLoading || updateIsLoading;

  const cartButton = (
    <LoadingButton
      onClick={() => {
        if (inCartItem && typeof handleUpdateToCart === "function") {
          handleUpdateToCart(inCartItem);
        } else {
          addToCard?.();
        }
      }}
      loading={isCartLoading}
      loadingPosition="end"
      loadingIndicator={
        <CircularProgress
          size={16}
          sx={{ color: theme.palette.background.paper }}
        />
      }
      endIcon={<span />}
      disabled={!inStock}
      sx={{
        flexShrink: 0,
        flex: { xs: 1, md: "0 0 auto" },
        minWidth: { xs: "130px", md: "150px" },
        py: { xs: 1, md: 1.25 },
        px: { xs: 2, md: 3.5 },
        borderRadius: "8px",
        textTransform: "none",
        fontWeight: 700,
        fontSize: { xs: "13px", md: "14px" },
        boxShadow: "none",
        backgroundColor: inStock
          ? theme.palette.primary.main
          : alpha(theme.palette.error.main, 0.12),
        color: inStock
          ? theme.palette.background.paper
          : theme.palette.error.main,
        "&:hover": {
          boxShadow: "none",
          backgroundColor: inStock
            ? theme.palette.primary.dark
            : alpha(theme.palette.error.main, 0.18),
        },
        "&.Mui-disabled": {
          color: theme.palette.error.main,
          backgroundColor: alpha(theme.palette.error.main, 0.12),
        },
        "&.MuiLoadingButton-loading": {
          backgroundColor: theme.palette.primary.main,
          opacity: 0.85,
          color: theme.palette.background.paper,
        },
        "& .MuiLoadingButton-loadingIndicatorEnd": {
          position: "relative",
          right: 0,
          ml: 1,
        },
      }}
    >
      {!inStock
        ? t("Out of Stock")
        : inCartItem
        ? t("Update To Cart")
        : t("Add To Cart")}
    </LoadingButton>
  );

  const bar = (
    <Box
      sx={{
        position: isInModal ? "static" : "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: isInModal ? "auto" : 1200,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        boxShadow: isInModal ? "none" : "0 -4px 16px rgba(0,0,0,0.06)",
        py: { xs: 1.25, md: 1 },
        px: { xs: 1.5, md: 2 },
        transform: isShown ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.25s ease",
        pointerEvents: isShown ? "auto" : "none",
        width: "100%",
      }}
    >
      {isInModal && isMobile ? (
        <Stack spacing={1} sx={{ width: "100%" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {t("Total")}
              </Typography>
              {/* <Typography
                sx={{ fontSize: "11px", color: theme.palette.text.secondary }}
              >
                {t("(Inc. VAT/TAX)")}
              </Typography> */}
            </Stack>
            <Stack direction="row" alignItems="baseline" spacing={0.75}>
              {originalAmount && (
                <Typography
                  sx={{
                    fontSize: "13px",
                    color: theme.palette.text.secondary,
                    textDecoration: "line-through",
                    whiteSpace: "nowrap",
                  }}
                >
                  {originalAmount}
                </Typography>
              )}
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: theme.palette.text.primary,
                  whiteSpace: "nowrap",
                }}
              >
                {totalAmount}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1.5}
          >
            {qtyControl}
            {cartButton}
          </Stack>
        </Stack>
      ) : isInModal ? (
        <Stack
          direction="row"
          alignItems="center"
          gap={2}
          sx={{ width: "100%" }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>{totalBlock}</Box>
          {qtyControl}
          {cartButton}
        </Stack>
      ) : isMobile ? (
        <Stack
          spacing={1}
          sx={{ maxWidth: "1200px", mx: "auto", width: "100%" }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                fontSize: "13px",
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              {t("Total")}
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "18px",
                color: theme.palette.text.primary,
              }}
            >
              {totalAmount}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {qtyControl}
            {cartButton}
          </Stack>
        </Stack>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          gap={3}
          sx={{ maxWidth: "1200px", mx: "auto", width: "100%" }}
        >
          <Stack spacing={0.25} flex={1} minWidth={0}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "15px",
                color: theme.palette.text.primary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {modalData?.name}
            </Typography>
            {selectedLabels && (
              <Typography
                sx={{
                  fontSize: "12px",
                  color: theme.palette.text.secondary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {t("Selected")} : {selectedLabels}
              </Typography>
            )}
          </Stack>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "20px",
              color: theme.palette.text.primary,
              flexShrink: 0,
            }}
          >
            {totalAmount}
          </Typography>
          {qtyControl}
          {cartButton}
        </Stack>
      )}
    </Box>
  );

  if (isInModal) {
    if (!portalTarget) return null;
    return createPortal(bar, portalTarget);
  }

  return bar;
};

export default StickyCartBar;
