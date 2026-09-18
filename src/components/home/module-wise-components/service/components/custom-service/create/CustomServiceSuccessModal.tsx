import { Box, Button, Stack, Typography, alpha, useTheme } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";

interface Props {
  onViewPost: () => void;
}

export default function CustomServiceSuccessModal({ onViewPost }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack
      alignItems="center"
      textAlign="center"
      sx={{
        px: { xs: 2.5, md: 4 },
        py: { xs: 3, md: 4 },
        maxWidth: "380px",
      }}
      spacing={2.5}
    >
      <Box
        sx={{
          position: "relative",
          width: "84px",
          height: "84px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
        }}
      >
        <i
          className="fi fi-rr-document"
          style={{
            fontSize: "34px",
            display: "flex",
            lineHeight: 1,
            color: theme.palette.primary.main,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-2px",
            right: "-2px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "primary.main",
            border: `2px solid ${theme.palette.background.paper}`,
          }}
        >
          <CheckIcon sx={{ fontSize: "16px", color: "common.white" }} />
        </Box>
      </Box>

      <Stack spacing={0.75}>
        <Typography
          sx={{ fontWeight: 700, fontSize: "18px", color: "text.primary" }}
        >
          {t("Custom Service Created Successfully!")}
        </Typography>
        <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
          {t(
            "Your custom service has been created successfully. Providers can view your custom service and send offers based on your requirements."
          )}
        </Typography>
      </Stack>

      <Button
        fullWidth
        variant="contained"
        onClick={onViewPost}
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
        {t("View Post")}
      </Button>
    </Stack>
  );
}
