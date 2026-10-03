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
  const subtleText =
    theme.palette.neutral?.[500] || theme.palette.text.secondary;

  const hasAddressDetails = roadNumber || houseNumber || floor;

  return (
    <CustomStackFullWidth sx={{ height: "100%" }}>
      <Card
        sx={{
          padding: "12px",
          backgroundColor: theme.palette.background.paper,
          border: "none",
          borderRadius: "8px",
          boxShadow:
            "0px 1px 2px 0px rgba(0,0,0,0.1), 0px 1px 2px 0px rgba(0,0,0,0.05)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Typography fontWeight={500} fontSize="16px" color="neutral.1050">
          {title}
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              backgroundColor: theme.palette.background.secondary,
            }}
          >
            <IconComponent
              sx={{
                fontSize: 16,
                color: theme.palette.neutral[1050],
              }}
            />
          </Box>

          <Stack spacing={0.5} flex={1} minWidth={0}>
            {name && (
              <Typography
                fontWeight={500}
                fontSize="16px"
                color="neutral.1050"
                lineHeight={1.1}
              >
                {name}
              </Typography>
            )}
            {phone && (
              <Typography
                fontWeight={400}
                fontSize="14px"
                color="neutral.1050"
                lineHeight={1.1}
              >
                {phone}
              </Typography>
            )}
            {email && (
              <Typography
                fontWeight={400}
                fontSize="14px"
                color="neutral.1050"
                lineHeight={1.1}
              >
                {email}
              </Typography>
            )}
            {address && (
              <Typography
                fontSize="14px"
                color={subtleText}
                lineHeight={1.4}
                sx={{ mt: 0.25 }}
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
              >
                {floor && (
                  <Typography fontSize="14px" color={subtleText}>
                    Floor : {floor}
                  </Typography>
                )}
                {houseNumber && (
                  <Typography fontSize="14px" color={subtleText}>
                    House : {houseNumber}
                  </Typography>
                )}
                {roadNumber && (
                  <Typography fontSize="14px" color={subtleText}>
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
