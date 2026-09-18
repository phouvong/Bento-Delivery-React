import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Avatar, Box, Skeleton, Stack, Typography, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

export const ProviderProfileCard = ({ providerData, isFetching }) => {
  const theme = useTheme();

  const name = providerData?.name;
  const phone = providerData?.phone;
  const address = providerData?.address;
  const image = providerData?.logo_full_url;

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderRadius: "8px",
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0px 1px 4px ${alpha(theme.palette.text.primary, 0.05)}, 0px 1px 4px ${alpha(theme.palette.text.primary, 0.1)}`,
      }}
    >
      {isFetching ? (
        <Skeleton variant="circular" width={48} height={48} sx={{ flexShrink: 0 }} />
      ) : (
        <Avatar
          src={image}
          alt={name}
          sx={{
            width: 48,
            height: 48,
            backgroundColor: theme.palette.neutral[300],
            flexShrink: 0,
          }}
        />
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {isFetching ? (
          <>
            <Skeleton width="60%" height={20} />
            <Skeleton width="80%" height={16} sx={{ mt: 0.5 }} />
          </>
        ) : (
          <>
            <Typography
              variant="body1"
              fontWeight={700}
              color="text.primary"
              lineHeight={1.4}
              sx={{ fontSize: { xs: "14px", md: "16px" } }}
            >
              {name}{" "}
              {phone && (
                <Typography
                  component="span"
                  variant="body2"
                  fontWeight={400}
                  color="text.secondary"
                  sx={{ fontSize: { xs: "12px", md: "14px" } }}
                >
                  ({phone})
                </Typography>
              )}
            </Typography>
            {address && (
              <Stack direction="row" alignItems="center" spacing={0.25} mt={0.5}>
                <LocationOnOutlinedIcon
                  sx={{ fontSize: { xs: "12px", md: "14px" }, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                  {address}
                </Typography>
              </Stack>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export const ProviderLocationNote = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        p: "8px 12px",
        borderRadius: "8px",
        backgroundColor: theme.palette.info.tertiary,
      }}
    >
      <Typography variant="body2" color="text.primary">
        {t("You have to go to provider location in order to receive this service")}
      </Typography>
    </Box>
  );
};

const ProviderLocationDetails = ({ providerData, isFetching }) => (
  <Stack spacing={2.5}>
    <ProviderProfileCard providerData={providerData} isFetching={isFetching} />
    <ProviderLocationNote />
  </Stack>
);

export default ProviderLocationDetails;
