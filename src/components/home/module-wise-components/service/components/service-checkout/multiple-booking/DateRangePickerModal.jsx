import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomModal from "components/modal";
import CustomDateRangePicker from "components/common/CustomDateRangePicker";

export default function DateRangePickerModal({
  open,
  onClose,
  value,
  onConfirm,
  title,
  subtitle,
  minDate,
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  const [localRange, setLocalRange] = useState(value);

  const handleChange = (item) => {
    setLocalRange([item.selection]);
  };

  const handleConfirm = () => {
    onConfirm(localRange);
    onClose();
  };

  const handleCancel = () => {
    setLocalRange(value);
    onClose();
  };

  return (
    <CustomModal openModal={open} handleClose={handleCancel} closeButton>
      <Box sx={{ display: "flex", flexDirection: "column", maxHeight: "80vh" }}>
        {/* Scrollable content */}
        <Box sx={{ flex: 1, overflowY: "auto", px: { xs: 2, md: 3 }, pb: 2 }}>
          {/* Header */}
          <Typography
            sx={{
              fontSize: { xs: "16px", md: "18px" },
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 0.25,
            }}
          >
            {title ?? t("Select Date Range")}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "14px" },
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          >
            {subtitle ?? t("Choose which days you want your service")}
          </Typography>

          {/* Calendar */}
          <Box
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "10px",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CustomDateRangePicker
              value={localRange}
              onChange={handleChange}
              minDate={minDate ?? new Date()}
            />
          </Box>
        </Box>

        {/* Fixed footer */}
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            px: { xs: 2, md: 3 },
            py: 2,
            backgroundColor: theme.palette.background.paper,
            flexShrink: 0,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={handleCancel}
            sx={{
              height: "48px",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "15px",
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              "&:hover": {
                borderColor: theme.palette.text.secondary,
                backgroundColor: theme.palette.background.secondary,
              },
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleConfirm}
            sx={{
              height: "48px",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "15px",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.whiteContainer.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            {t("Confirm Dates")}
          </Button>
        </Stack>
      </Box>
    </CustomModal>
  );
}
