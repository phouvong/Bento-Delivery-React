import { Box, Button, Stack, Typography, alpha, useTheme } from "@mui/material";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import { useTranslation } from "react-i18next";

interface Props {
  onSwitch: () => void;
  onCancel: () => void;
  entity?: "item" | "store" | "category";
}

export default function ChatModuleSwitchWarning({
  onSwitch,
  onCancel,
  entity = "item",
}: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  // Keep each entity's copy as one whole sentence so translators get full,
  // grammatical strings instead of an interpolated noun that breaks in
  // other languages.
  const message =
    t("This belongs to another module. Switch now to view it?") ||
    `This ${entity} belongs to another module. Switch now to view it?`;

  return (
    <Stack
      alignItems="center"
      textAlign="center"
      sx={{
        px: { xs: 3, md: 4 },
        py: { xs: 4, md: 4.5 },
        maxWidth: "380px",
      }}
      spacing={2.5}
    >
      <Box
        sx={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: alpha(theme.palette.error.main, 0.1),
        }}
      >
        <PriorityHighRoundedIcon
          sx={{ fontSize: "34px", color: "error.main" }}
        />
      </Box>

      <Typography
        sx={{
          fontWeight: 500,
          fontSize: "14px",
          lineHeight: 1.4,
          color: "text.primary",
        }}
      >
        {message}
      </Typography>

      <Stack direction="row" spacing={1.5} sx={{ width: "100%" }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onCancel}
          sx={{
            py: 1.25,
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "15px",
            color: "text.primary",
            borderColor: "divider",
            "&:hover": {
              borderColor: "text.secondary",
              backgroundColor: alpha(theme.palette.text.primary, 0.04),
            },
          }}
        >
          {t("No")}
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={onSwitch}
          sx={{
            py: 1.25,
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: "15px",
            backgroundColor: "primary.main",
            color: "common.white",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "primary.dark",
              boxShadow: "none",
            },
          }}
        >
          {t("Yes")}
        </Button>
      </Stack>
    </Stack>
  );
}
