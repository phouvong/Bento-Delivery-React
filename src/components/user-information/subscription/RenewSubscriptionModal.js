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
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import { useTranslation } from "react-i18next";

const RenewSubscriptionModal = ({ open, onClose, onConfirm, isWorking }) => {
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
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <DialogContent sx={{ px: 4, py: 4 }}>
          <Stack alignItems="center" spacing={1.5}>
            <NotificationsActiveRoundedIcon
              htmlColor="#F5B400"
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
              {t("Renew Your Subscription")}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", textAlign: "center", px: 1 }}
            >
              {t(
                "Your plan is about to expire. Renew now to continue enjoying exclusive benefits and savings."
              )}
            </Typography>
            <Button
              variant="contained"
              disableElevation
              disabled={isWorking}
              onClick={onConfirm}
              sx={{
                mt: 1,
                backgroundColor: "primary.main",
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
                py: 1,
                "&:hover": { backgroundColor: "primary.dark" },
              }}
            >
              {t("Renew Subscription")}
            </Button>
          </Stack>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default RenewSubscriptionModal;
