import React from "react";
import { Stack } from "@mui/system";
import { Box, Card, Typography, useTheme } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";

const DeliveryInfoCard = ({
  title,
  name,
  phone,
  address,
  houseNumber,
  floor,
  roadNumber,
  email,
  icon,
  variant,
}) => {
  const IconComponent =
    icon ||
    (variant === "receiver" ? NearMeOutlinedIcon : LocationOnOutlinedIcon);
  const theme = useTheme();
  const neutralBorder = theme.palette.neutral?.[200] || "rgba(0, 0, 0, 0.08)";
  const subtleText =
    theme.palette.neutral?.[500] || theme.palette.text.secondary;

  const hasAddressDetails = roadNumber || houseNumber || floor;

  return (
    <CustomStackFullWidth sx={{ height: "100%" }}>
      <Card
        sx={{
          padding: { xs: "16px", md: "16px" },
          backgroundColor: theme.palette.background.paper,
          border: "none",
          borderRadius: "12px",
          boxShadow:
            "0px 4px 16px 0px rgba(17, 24, 39, 0.06), 0px 1px 2px 0px rgba(17, 24, 39, 0.04)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <Typography fontWeight={700} fontSize="16px" color="neutral.1050">
          {title}
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `1px solid ${neutralBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <IconComponent
              sx={{
                fontSize: 18,
                color: theme.palette.text.primary,
              }}
            />
          </Box>

          <Stack spacing={0.25} flex={1} minWidth={0}>
            {name && (
              <Typography
                fontWeight={700}
                fontSize="15px"
                color="text.primary"
                lineHeight={1.3}
              >
                {name}
              </Typography>
            )}
            {phone && (
              <Typography
                fontWeight={600}
                fontSize="14px"
                color="text.primary"
                lineHeight={1.3}
              >
                {phone}
              </Typography>
            )}
            {email && (
              <Typography fontSize="13px" color={subtleText} lineHeight={1.4}>
                {email}
              </Typography>
            )}
            {address && (
              <Typography
                fontSize="13px"
                color={subtleText}
                lineHeight={1.4}
                sx={{ mt: 0.5 }}
              >
                {address}
              </Typography>
            )}
            {hasAddressDetails && (
              <Stack
                direction="row"
                flexWrap="wrap"
                rowGap={0.25}
                columnGap={2}
                sx={{ mt: 0.25 }}
              >
                {floor && (
                  <Typography fontSize="13px" color={subtleText}>
                    Floor : {floor}
                  </Typography>
                )}
                {houseNumber && (
                  <Typography fontSize="13px" color={subtleText}>
                    House : {houseNumber}
                  </Typography>
                )}
                {roadNumber && (
                  <Typography fontSize="13px" color={subtleText}>
                    Street : {roadNumber}
                  </Typography>
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Card>
    </CustomStackFullWidth>
  );
};

export default DeliveryInfoCard;
