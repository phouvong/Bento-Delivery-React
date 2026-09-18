import { Box, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import Image from "next/image";
import customServiceEmptyIcon from "public/static/custom-service-empty.svg";

const InitialView = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: "8px",
        backgroundColor: theme.palette.background.default,
        p: { xs: "16px", md: "80px" },
      }}
    >
      <Stack alignItems="center" spacing="8px">
        <Box sx={{ width: "70px", height: "70px", position: "relative" }}>
          <Image
            src={customServiceEmptyIcon}
            alt="custom service"
            width={70}
            height={70}
          />
        </Box>
        <Stack alignItems="center" spacing="8px">
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              color: theme.palette.text.primary,
              textAlign: "center",
              pt: "8px",
            }}
          >
            {t("Find the Right Provider for Your Service")}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 400,
              color: theme.palette.text.secondary,
              textAlign: "center",
              maxWidth: "480px",
            }}
          >
            {t(
              "Create a service request, share your requirements, and receive offers from qualified providers ready to help."
            )}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default InitialView;