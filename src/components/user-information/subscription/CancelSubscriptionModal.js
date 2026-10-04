import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import { useTranslation } from "react-i18next";

const CancelSubscriptionModal = ({ open, onClose, onConfirm, isWorking }) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: "16px", overflow: "visible" } }}
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
            zIndex: 1,
            color: "text.secondary",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#374151" : "#F3F4F6",
            p: 0.5,
            "&:hover": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#4B5563" : "#E5E7EB",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <DialogContent sx={{ px: 4, py: 4 }}>
          <Stack alignItems="center" spacing={1.5}>
            <ReportProblemRoundedIcon
              htmlColor="#EF4444"
              sx={{ fontSize: 56 }}
            />
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                color: "text.primary",
                textAlign: "center",
              }}
            >
              {t("Cancel Subscription?")}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", textAlign: "center", px: 1 }}
            >
              {t(
                "Are you sure you want to cancel your subscription? You will lose access to exclusive Pro benefits and savings."
              )}
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ mt: 1, width: "100%" }}>
              <Button
                fullWidth
                variant="outlined"
                disabled={isWorking}
                onClick={onClose}
                sx={{
                  color: "text.primary",
                  borderColor: "divider",
                  fontWeight: 600,
                  fontSize: "14px",
                  textTransform: "none",
                  borderRadius: "8px",
                  py: 1,
                }}
              >
                {t("Keep Subscription")}
              </Button>
              <Button
                fullWidth
                variant="contained"
                disableElevation
                disabled={isWorking}
                onClick={onConfirm}
                sx={{
                  backgroundColor: "#EF4444",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "14px",
                  textTransform: "none",
                  borderRadius: "8px",
                  py: 1,
                  "&:hover": { backgroundColor: "#DC2626" },
                }}
              >
                {t("Yes, Cancel")}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default CancelSubscriptionModal;
