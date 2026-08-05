import { alpha, Stack, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";

const QuantityButton = ({ onClick, disabled, icon, ariaLabel, theme }) => (
  <Box
    role="button"
    aria-label={ariaLabel}
    aria-disabled={disabled}
    onClick={disabled ? undefined : onClick}
    sx={{
      width: 24,
      height: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: disabled ? "not-allowed" : "pointer",
      color: disabled
        ? alpha(theme.palette.text.secondary, 0.4)
        : theme.palette.text.secondary,
      transition: "color 0.15s ease",
      "&:hover": disabled
        ? undefined
        : {
            color: theme.palette.text.primary,
          },
    }}
  >
    <i
      className={icon}
      style={{ fontSize: "14px", display: "flex", lineHeight: 1 }}
    />
  </Box>
);

const IncrementDecrementManager = (props) => {
  const { decrementQuantity, incrementQuantity, modalData, counterOnly } = props;
  const theme = useTheme();
  const { t } = useTranslation();

  const counter = (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        backgroundColor: alpha(
          theme.palette.neutral?.[400] || theme.palette.text.secondary,
          0.1
        ),
        borderRadius: "8px",
        px: 1,
        py: 0.5,
        justifyContent: "center",
      }}
    >
      <QuantityButton
        onClick={decrementQuantity}
        disabled={modalData?.totalPrice === 0 || modalData?.quantity <= 1}
        icon="fi fi-rr-minus-small"
        ariaLabel={t("decrease quantity")}
        theme={theme}
      />
      <Box
        sx={{
          minWidth: { xs: 24, md: 28 },
          textAlign: "center",
          fontSize: { xs: "15px", md: "16px" },
          fontWeight: 700,
          color: theme.palette.text.primary,
          userSelect: "none",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {modalData?.quantity < 10 && "0"}
        {modalData?.quantity}
      </Box>
      <QuantityButton
        onClick={incrementQuantity}
        icon="fi fi-rr-plus-small"
        ariaLabel={t("increase quantity")}
        theme={theme}
      />
    </Stack>
  );

  if (counterOnly) return counter;

  return (
    <CustomStackFullWidth>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: { xs: 1.5, md: 1.5 },
          borderRadius: "10px",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* <Stack direction="column" spacing={0} alignItems="baseline">
          <Typography
            sx={{
              fontSize: { xs: "13px", md: "14px" },
              fontWeight: 500,
              color: theme.palette.text.secondary,
            }}
          >
            {t("Total")}
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: "16px", md: "18px" },
              color: theme.palette.text.primary,
            }}
          >
            {totalAmount}
          </Typography>
        </Stack> */}
        {counter}
      </Stack>
    </CustomStackFullWidth>
  );
};

IncrementDecrementManager.propTypes = {};

export default IncrementDecrementManager;
