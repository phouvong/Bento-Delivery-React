import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { CustomTextField } from "../../styled-components/CustomStyles.style";
import { RoundButton } from "./CheckOut.style";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { getGuestId, getToken } from "helper-functions/getToken";

const DEFAULT_TIPS = [0, 2, 5, 10, 15, 20, 25];

// One slot per identity so a guest session and a logged-in session
// don't overwrite each other's saved tips on the same browser.
const buildSavedTipKey = () => {
  if (typeof window === "undefined") return null;
  const token = getToken();
  const guestId = getGuestId();
  const id = token || guestId;
  if (!id) return null;
  return `saved-delivery-tip:${token ? "user" : "guest"}:${id}`;
};

const DeliveryManTip = ({
  deliveryTip,
  setDeliveryTip,
  isSmall,
  tripsData,
}) => {
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const [fieldValue, setFieldValue] = useState(deliveryTip);
  const [isCustom, setIsCustom] = useState(false);
  const [saveForLater, setSaveForLater] = useState(false);
  const { t } = useTranslation();

  // Restore the saved tip (if any) once on mount so a returning user sees
  // their previous choice already applied. Defaults to "Save It For Later"
  // checked when a value is found, so accidental edits keep persisting.
  useEffect(() => {
    const key = buildSavedTipKey();
    if (!key) return;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null || raw === "") return;
      const saved = Number(raw);
      if (!Number.isFinite(saved)) return;
      setFieldValue(saved);
      setDeliveryTip(saved);
      setSaveForLater(true);
      // Anything not in the default pill list is treated as a custom amount.
      if (!DEFAULT_TIPS.includes(saved)) setIsCustom(true);
    } catch {
      /* localStorage unavailable — ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist whenever the checkbox is on and the committed tip changes.
  // We watch `deliveryTip` (the parent's debounced value) rather than the
  // raw `fieldValue` so the custom-input flow doesn't write on every
  // keystroke — the parent's 300ms debounce coalesces them for us.
  useEffect(() => {
    const key = buildSavedTipKey();
    if (!key) return;
    try {
      if (saveForLater) {
        window.localStorage.setItem(key, String(deliveryTip ?? 0));
      } else {
        window.localStorage.removeItem(key);
      }
    } catch {
      /* localStorage unavailable — ignore */
    }
  }, [saveForLater, deliveryTip]);

  let debounceTimeout;

  const debouncedSetInputValue = (value) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      setDeliveryTip(value);
    }, 300);
  };

  const handleOnChange = (e) => {
    if (e.target.value > -1) {
      setFieldValue(e.target.value);
      debouncedSetInputValue(e.target.value);
      setIsCustom(true);
    } else {
      setIsCustom(false);
    }
  };

  const handleClickOnTips = (tip) => {
    setFieldValue(tip);
    setIsCustom(false);
  };

  useEffect(() => {
    debouncedSetInputValue(fieldValue);
  }, [fieldValue]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const neutralBase =
    theme.palette.neutral?.[400] || theme.palette.text.secondary;

  const pillSx = (selected) => ({
    minWidth: "auto",
    height: "36px",
    px: "16px",
    py: 0,
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "14px",
    letterSpacing: "-0.42px",
    boxShadow: "none",
    backgroundColor: selected
      ? theme.palette.primary.main
      : theme.palette.background.secondary,
    color: selected
      ? theme.palette.whiteContainer.main
      : theme.palette.neutral[1050],
    "&:hover": {
      boxShadow: "none",
      backgroundColor: selected
        ? theme.palette.primary.dark
        : alpha(neutralBase, 0.2),
    },
  });

  const renderPillCell = ({ key, label, selected, onClick, isMostUsed }) => (
    <Stack key={key} alignItems="center" spacing={0.5}>
      <Button
        variant="contained"
        disableElevation
        onClick={onClick}
        sx={pillSx(selected)}
      >
        {label}
      </Button>
      {isMostUsed && (
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "-0.42px",
            color: theme.palette.info?.main || "#3979e0",
          }}
        >
          {t("Most Used")}
        </Typography>
      )}
    </Stack>
  );

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "16px",
        boxShadow: "none",
        padding: { xs: "16px", md: "20px" },
      }}
    >
      <Stack spacing={0.5}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: "16px", md: "18px" },
            letterSpacing: "-0.54px",
            color: "neutral.1050",
          }}
        >
          {t("Deliveryman Tips")}
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            letterSpacing: "-0.42px",
            color: theme.palette.neutral?.[500] || theme.palette.text.secondary,
          }}
        >
          {t("Your provided tips will 100% goes to deliveryman.")}
        </Typography>
      </Stack>

      {!show ? (
        <Stack
          direction="row"
          alignItems="flex-start"
          gap={{ xs: 0.75, md: 1 }}
          mt={{ xs: 1, md: 1.5 }}
          sx={{
            flexWrap: { xs: "nowrap", md: "wrap" },
            overflowX: { xs: "auto", md: "visible" },
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            "& > *": { flexShrink: 0 },
          }}
        >
          {renderPillCell({
            key: "not-now",
            label: t("Not Now"),
            selected: deliveryTip === 0 && !isCustom,
            onClick: () => handleClickOnTips(0),
            isMostUsed: false,
          })}
          {renderPillCell({
            key: "custom",
            label: t("Custom"),
            selected: isCustom,
            onClick: handleShow,
            isMostUsed: false,
          })}
          {DEFAULT_TIPS.filter((tip) => tip !== 0).map((tip) =>
            renderPillCell({
              key: tip,
              label: getAmountWithSign(tip),
              selected: deliveryTip === tip && !isCustom,
              onClick: () => handleClickOnTips(tip),
              isMostUsed: tripsData?.most_tips_amount === tip,
            })
          )}
        </Stack>
      ) : (
        <Stack
          width="100%"
          direction="row"
          spacing={1.8}
          mt={{ xs: 1, md: 1.5 }}
        >
          <CustomTextField
            type="number"
            label={t("Amount")}
            autoFocus={true}
            value={fieldValue}
            onChange={(e) => handleOnChange(e)}
            InputProps={{ inputProps: { min: 0 } }}
            onKeyPress={(event) => {
              if (event?.key === "-" || event?.key === "+") {
                event.preventDefault();
              }
            }}
          />
          <RoundButton onClick={handleClose} minWidth="50px" padding="9px 16px">
            <CloseIcon sx={{ width: "15px", height: "20px" }} />
          </RoundButton>
        </Stack>
      )}

      <FormControlLabel
        sx={{ mt: { xs: 1.5, md: 2 }, ml: 0 }}
        control={
          <Checkbox
            checked={saveForLater}
            onChange={(e) => setSaveForLater(e.target.checked)}
            sx={{ p: 0, mr: 1, "& .MuiSvgIcon-root": { fontSize: 20 } }}
          />
        }
        label={
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "16px",
              letterSpacing: "-0.48px",
              color: "neutral.1050",
            }}
          >
            {t("Save It For Later")}
          </Typography>
        }
      />
    </Box>
  );
};

export default DeliveryManTip;
