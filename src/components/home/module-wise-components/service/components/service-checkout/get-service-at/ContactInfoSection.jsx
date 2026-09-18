import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { IconButton, Typography, alpha, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { getToken } from "helper-functions/getToken";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { resolveContactPerson } from "./resolveContactPerson";

const ContactInfoSection = ({
  address,
  onAddContactInfo,
  onEditContactInfo,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { guestUserInfo } = useSelector((s) => s.guestUserInfo);
  const { profileInfo } = useSelector((s) => s.profileInfo);
  const token = getToken();

  const { name: contactName, number: contactPhone } = resolveContactPerson({
    address,
    guestUserInfo,
    profileInfo,
    token,
  });
  const hasContactInfo = Boolean(contactName && contactPhone);

  const iconCircleSx = {
    width: 28,
    height: 28,
    borderRadius: "50%",
    backgroundColor: alpha(
      theme.palette.neutral?.[400] || theme.palette.text.secondary,
      0.15,
    ),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  const pillBoxSx = {
    flex: 1,
    minWidth: 0,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "10px",
    px: { xs: 1, md: 1.25 },
    py: { xs: 0.75, md: 1 },
    display: "flex",
    alignItems: "center",
    gap: 1,
    backgroundColor: theme.palette.background.paper,
  };

  if (hasContactInfo) {
    return (
      <Box sx={pillBoxSx}>
        <Box sx={iconCircleSx}>
          <PersonOutlineOutlinedIcon
            sx={{ fontSize: 16, color: theme.palette.text.secondary }}
          />
        </Box>
        <Stack spacing={0.25} flex={1} minWidth={0}>
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "13px" },
              fontWeight: 600,
              color: theme.palette.text.primary,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {contactName}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "10px", md: "11px" },
              color: theme.palette.text.secondary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {contactPhone}
          </Typography>
        </Stack>
        <IconButton
          onClick={onEditContactInfo}
          size="small"
          sx={{ p: 0.5, color: theme.palette.primary.main, flexShrink: 0 }}
        >
          <i
            className="fi fi-rs-pencil"
            style={{ fontSize: 14, display: "flex", lineHeight: 1 }}
          />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      component="button"
      type="button"
      onClick={onAddContactInfo}
      sx={{
        flex: 1,
        border: "none",
        py: { xs: 1, md: 1.25 },
        px: 2,
        borderRadius: "10px",
        backgroundColor: alpha(
          theme.palette.neutral?.[400] || theme.palette.text.secondary,
          0.12,
        ),
        color: theme.palette.text.primary,
        fontWeight: 600,
        fontSize: { xs: "13px", md: "14px" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.75,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: alpha(
            theme.palette.neutral?.[400] || theme.palette.text.secondary,
            0.18,
          ),
        },
      }}
    >
      <AddCircleOutlineIcon
        sx={{ fontSize: 18, color: theme.palette.text.primary }}
      />
      {t("Add Contact Info")}
    </Box>
  );
};

export default ContactInfoSection;
