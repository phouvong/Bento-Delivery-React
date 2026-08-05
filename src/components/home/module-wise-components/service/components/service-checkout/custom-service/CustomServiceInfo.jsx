import { Box, Button, Stack, Typography, useTheme, alpha } from "@mui/material";
import { useTranslation } from "react-i18next";
import emptyImg from "public/static/empty.png";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Image from "next/image";

const CustomServiceInfo = ({ service }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        overflow: "hidden",
        px: 2.5,
        pb: 2,
      }}
    >
        <Box 
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "start",
                justifyContent: "start",
                gap: 1.5,
                mb: {xs: 2, md: 3},
            }}
        >
            {/* Service image */}
            <Box
                sx={{
                width: { xs: 40, md: 60 },
                height: { xs: 40, md: 60 },
                borderRadius: "8px",
                position: "relative",
                backgroundColor: theme.palette.background.secondary,
                overflow: "hidden",
                }}
            >
                <Image
                src={service.image || emptyImg}
                alt={service.category}
                fill
                style={{ objectFit: "cover" }}
                />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "start",
                    gap: 0.5,
                }}
            >
                <Typography
                    sx={{
                    fontSize: { xs: "14px", md: "16px" },
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    }}
                >
                    {service.category}
                    <Box component="span" sx={{ fontWeight: 400, mx: 0.75 }}>
                    –
                    </Box>
                    {service.sub_category}
                </Typography>
                <Typography
                    sx={{
                        fontSize: { xs: "12px", md: "14px" },
                        color: theme.palette.text.secondary,
                    }}
                >
                    {service.service_date}, {service.service_time}
                </Typography>
            </Box>
        </Box>

        <Box>

            {/* Description */}
            <Typography
            sx={{
                fontSize: { xs: "14px", md: "16px" },
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.75,
            }}
            >
            {t("Description")}
            </Typography>
            <Typography
            sx={{
                fontSize: { xs: "12px", md: "14px" },
                color: theme.palette.text.secondary,
                lineHeight: 1.6,
                mb: 2,
            }}
            >
            {service.description}
            </Typography>
        </Box>
    </Box>
  );
};

export default CustomServiceInfo;