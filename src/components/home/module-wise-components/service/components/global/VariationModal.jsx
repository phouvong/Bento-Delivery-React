import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomModal from "components/modal";
import {
  getAmountWithSign,
  getDiscountedAmount,
} from "helper-functions/CardHelpers";

const VariationModal = ({
  open,
  onClose,
  items = [],
  onSelectVariation,
  selectedVariation,
  title,
  description,
  isUpdateFromCard = false,
  isLoading = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [quantities, setQuantities] = useState({});

  const identifyVariation = (item) => item?.variant_key ?? item?.name;

  useEffect(() => {
    if (!open) return;
    if (selectedVariation?.length) {
      const initial = {};
      selectedVariation.forEach(({ variation, quantity }) => {
        const index = items.findIndex(
          (item) => identifyVariation(item) === identifyVariation(variation),
        );
        if (index !== -1) initial[index] = quantity;
      });
      setQuantities(initial);
    } else {
      setQuantities({});
    }
  }, [open]);

  const getQty = (index) => quantities[index] ?? 0;

  const increment = (index) => {
    setQuantities((prev) => ({ ...prev, [index]: (prev[index] ?? 0) + 1 }));
  };

  const decrement = (index) => {
    setQuantities((prev) => {
      const current = prev[index] ?? 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[index];
        return next;
      }
      return { ...prev, [index]: current - 1 };
    });
  };

  const hasSelection = Object.values(quantities).some((q) => q > 0);

  const handleConfirm = () => {
    const selected = items
      .map((variation, index) => ({ variation, quantity: getQty(index) }))
      .filter(({ quantity }) => quantity > 0);
    onSelectVariation?.(selected);
    // When isUpdateFromCard the parent owns the close lifecycle (via onOneDone after
    // all mutations complete). Calling handleClose here would shut the modal before
    // isLoading ever becomes true.
    if (!isUpdateFromCard) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setQuantities({});
    onClose?.();
  };

  const QtyBtn = ({ onClick, icon }) => (
    <Box
      onClick={onClick}
      sx={{
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: theme.palette.text.secondary,
        "&:hover": { color: theme.palette.text.primary },
      }}
    >
      <i
        className={icon}
        style={{ fontSize: "16px", display: "flex", lineHeight: 1 }}
      />
    </Box>
  );

  return (
    <CustomModal openModal={open} handleClose={handleClose} closeButton>
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          pb: { xs: 2, md: 3 },
          pt: 0,
          minWidth: { md: 420 },
        }}
      >
        <Typography
          fontWeight={700}
          fontSize={{ xs: "16px", md: "20px" }}
          color="text.primary"
        >
          {title ??
            (isUpdateFromCard ? t("Update Variation") : t("Select Variation"))}

          <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
            *
          </Typography>
        </Typography>
        <Typography
          fontSize={{ xs: "12px", md: "14px" }}
          color="text.secondary"
          mb={2.5}
        >
          {description ??
            (isUpdateFromCard
              ? t("Adjust quantities or remove variations from cart")
              : t("Choose which variation service you want"))}
        </Typography>

        <Box
          sx={{
            border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
            borderRadius: "12px",
            overflow: "hidden",
            mb: 3,
            maxHeight: "55vh",
            overflowY: "auto",
          }}
        >
          {items.map((variation, index) => {
            const qty = getQty(index);
            const discountedPrice = getDiscountedAmount(
              variation?.price,
              variation?.discount,
              variation?.discount_type,
              variation?.store_discount,
            );
            const hasDiscount = discountedPrice !== variation?.price;

            return (
              <Box key={index}>
                {index > 0 && <Divider />}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 2, py: 1.5 }}
                >
                  <Box>
                    <Typography
                      fontWeight={700}
                      fontSize={{ xs: "12px", md: "14px" }}
                      color="text.primary"
                    >
                      {variation?.name ||
                        t("Variation {{num}}", { num: index + 1 })}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <Typography
                        fontSize={{ xs: "12px", md: "14px" }}
                        color="text.secondary"
                      >
                        {getAmountWithSign(discountedPrice)}
                      </Typography>
                      {hasDiscount && (
                        <Typography
                          fontSize="12px"
                          color="text.disabled"
                          sx={{ textDecoration: "line-through" }}
                        >
                          {getAmountWithSign(variation?.price)}
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  {qty === 0 ? (
                    <Box
                      onClick={() => increment(index)}
                      sx={{
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.primary",
                        borderRadius: "8px",
                        border: `1.5px solid ${alpha(
                          theme.palette.text.primary,
                          0.15,
                        )}`,
                        cursor: "pointer",
                        flexShrink: 0,
                        transition: "border-color 0.15s",
                        "&:hover": { borderColor: theme.palette.primary.main },
                      }}
                    >
                      <i
                        className="fi fi-rr-plus"
                        style={{
                          fontSize: "14px",
                          display: "flex",
                          lineHeight: 1,
                        }}
                      />
                    </Box>
                  ) : (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.5}
                      sx={{
                        border: `1px solid ${alpha(
                          theme.palette.text.primary,
                          0.5,
                        )}`,
                        borderRadius: "8px",
                        px: 0.75,
                        py: 0.25,
                        flexShrink: 0,
                      }}
                    >
                      <QtyBtn
                        onClick={() => decrement(index)}
                        icon="fi fi-rr-minus-small"
                      />
                      <Typography
                        fontWeight={700}
                        fontSize="15px"
                        minWidth={20}
                        textAlign="center"
                        color="text.primary"
                        sx={{ userSelect: "none" }}
                      >
                        {qty}
                      </Typography>
                      <QtyBtn
                        onClick={() => increment(index)}
                        icon="fi fi-rr-plus-small"
                      />
                    </Stack>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            onClick={handleClose}
            disabled={isLoading}
            fullWidth
            disableElevation
            sx={{
              height: 48,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "15px",
              backgroundColor: alpha(theme.palette.text.primary, 0.06),
              color: theme.palette.text.primary,
              "&:hover": {
                backgroundColor: alpha(theme.palette.text.primary, 0.1),
              },
              "&.Mui-disabled": {
                backgroundColor: alpha(theme.palette.text.primary, 0.04),
                color: alpha(theme.palette.text.primary, 0.3),
              },
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            fullWidth
            sx={{
              height: 48,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "15px",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              "&:hover": { backgroundColor: theme.palette.primary.dark },
              "&.Mui-disabled": {
                backgroundColor: alpha(theme.palette.primary.main, 0.55),
                color: alpha(theme.palette.primary.contrastText, 0.85),
              },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              justifyContent="center"
            >
              {isLoading && (
                <CircularProgress
                  size={16}
                  thickness={4}
                  sx={{ color: "inherit", flexShrink: 0 }}
                />
              )}
              <span>
                {isUpdateFromCard ? t("Update Cart") : t("Confirm Variation")}
              </span>
            </Stack>
          </Button>
        </Stack>
      </Box>
    </CustomModal>
  );
};

export default VariationModal;
