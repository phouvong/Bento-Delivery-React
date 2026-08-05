import { Box, Button, Stack, Typography, useTheme, alpha } from "@mui/material";
import { useTranslation } from "react-i18next";
import emptyImg from "public/static/empty.png";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Image from "next/image";

const ServiceInfoCard = ({ service }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  console.log({service});
  
  return (
    <Box
      sx={{
        overflow: "hidden",
      }}
    >
        <Box 
            sx={{
                display: "flex",
                flexDirection: {xs: "row", md: "column"},
                alignItems: "center",
                justifyContent: {xs: "start", md: "center"},
                gap: 1.5,
                mb: {xs: 2, md: 3},
            }}
        >
            {/* Service image */}
            <Box
                sx={{
                width: { xs: 60, md: 100 },
                height: { xs: 60, md: 100 },
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
                    alignItems: {xs: "start", md: "center"},
                    justifyContent: "center",
                    gap: 0.5,
                }}
            >
                <Typography
                    sx={{
                    fontSize: { xs: "14px", md: "18px" },
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
                fontSize: { xs: "14px", md: "18px" },
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

            {/* My Details */}
            <Typography
            sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 0.75,
            }}
            >
            {t("My Details")}
            </Typography>
            <Typography
            sx={{
                fontSize: "14px",
                color: theme.palette.text.primary,
                fontWeight: 500,
                lineHeight: 1.5,
                mb: 0.5,
            }}
            >
            {service.contact_person_name}{" "}
            <Box component="span" sx={{ color: theme.palette.text.secondary, fontWeight: 400 }}>
                ({service.contact_person_number})
            </Box>
            </Typography>
            <Stack direction="row" alignItems="flex-start" gap={0.5}>
                <LocationOnOutlinedIcon
                    sx={{ fontSize: 16, color: theme.palette.text.secondary, mt: "1px", flexShrink: 0 }}
                />
                <Typography
                    sx={{ fontSize: "12px", color: theme.palette.text.secondary, lineHeight: 1.5 }}
                >
                    {service.address}
                </Typography>
            </Stack>
        </Box>
    </Box>
  );
};

export default ServiceInfoCard;