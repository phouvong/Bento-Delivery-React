import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import customServiceEmptyIcon from "public/static/custom-service-empty.svg";
import Image from "next/image";

const EmptyBidderCard = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 6, md: 10 },
        px: 3,
        backgroundColor: theme.palette.background.paper,
        borderRadius: "14px",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ width: 80, height: 80, mb: 2, opacity: 0.7 }}>
        <Image src={customServiceEmptyIcon} alt="no bids" width={80} height={80} />
      </Box>
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 0.5,
          textAlign: "center",
        }}
      >
        {t("No Bids Yet")}
      </Typography>
      <Typography
        sx={{
          fontSize: "13px",
          color: theme.palette.text.secondary,
          textAlign: "center",
          maxWidth: "90%",
        }}
      >
        {t("All bids have been reviewed. Check back later for new offers.")}
      </Typography>
    </Box>
  );
};

export default EmptyBidderCard;