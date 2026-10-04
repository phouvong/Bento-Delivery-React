import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

/**
 * Mobile-only sticky header with back arrow (→ home) + title.
 * Used on static/info pages that hide the main MobileNavBar.
 */
const SimpleMobileHeader = ({ title, action, sx, backHref }) => {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;
  const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";
  // Caller can override the default (→ home) destination, e.g. to return to the
  // orders list with the same module tab still selected.
  const targetHref = backHref || homeHref;

  return (
    <Box
      sx={{
        display: { xs: "block", md: "none" },
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.appBar,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        ...sx,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        gap="8px"
        sx={{ px: "12px", py: "12px" }}
      >
        <IconButton
          onClick={() => router.push(targetHref)}
          sx={{ p: "4px", color: "neutral.1050", flexShrink: 0 }}
        >
          <i
            className="fi fi-rr-arrow-small-left"
            style={{ fontSize: "22px", lineHeight: 1, display: "flex" }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: "neutral.1050",
            letterSpacing: "-0.54px",
            lineHeight: 1.1,
            flex: 1,
          }}
        >
          {t(title)}
        </Typography>
        {action}
      </Stack>
    </Box>
  );
};

export default SimpleMobileHeader;
