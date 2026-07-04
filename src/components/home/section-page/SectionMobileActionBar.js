import { Box, IconButton, InputBase, Stack, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

/**
 * Mobile-only sticky action bar for section pages.
 * Shows search input + filter icon with badge.
 * Sits inside page content, sticky just below the header.
 */
const SectionMobileActionBar = ({
  searchValue,
  onSearchChange,
  onSearchCommit,
  onFilterOpen,
  filterCount = 0,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const inputRef = useRef(null);

  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        position: "sticky",
        top: "56px",
        zIndex: 9,
        backgroundColor: theme.palette.background.default,
        px: "16px",
        py: "10px",
        mt: "0 !important",
      }}
    >
      <Stack direction="row" alignItems="center" gap="8px" sx={{ width: "100%" }}>
        {/* Search */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            height: "40px",
            px: "14px",
            borderRadius: "9999px",
            backgroundColor: theme.palette.background.secondary,
          }}
        >
          <i
            className="fi fi-rr-search"
            style={{ fontSize: "15px", lineHeight: 1, display: "flex", color: theme.palette.neutral[450], flexShrink: 0 }}
          />
          <InputBase
            inputRef={inputRef}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onSearchCommit(searchValue); }}
            onBlur={() => onSearchCommit(searchValue)}
            placeholder={t("Search...")}
            sx={{
              flex: 1,
              fontSize: "15px",
              color: "neutral.1050",
              "& input::placeholder": { color: theme.palette.neutral[450] },
            }}
          />
          {searchValue && (
            <IconButton
              onClick={() => { onSearchChange(""); onSearchCommit(""); }}
              size="small"
              sx={{ p: "2px", flexShrink: 0 }}
            >
              <i className="fi fi-rr-cross-small" style={{ fontSize: "15px", lineHeight: 1, display: "flex", color: theme.palette.neutral[450] }} />
            </IconButton>
          )}
        </Box>

        {/* Filter icon */}
        <Box
          onClick={onFilterOpen}
          sx={{
            position: "relative",
            width: 40, height: 40,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "8px", cursor: "pointer", flexShrink: 0,
            backgroundColor: theme.palette.background.secondary,
          }}
        >
          <i className="fi fi-ss-sliders-v" style={{ fontSize: "16px", lineHeight: 1, display: "flex", color: theme.palette.neutral[1050] }} />
          {filterCount > 0 && (
            <Box sx={{
              position: "absolute", top: -4, right: -4,
              minWidth: 16, height: 16, borderRadius: "50%",
              backgroundColor: "primary.main",
              display: "flex", alignItems: "center", justifyContent: "center",
              px: "3px",
            }}>
              <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "common.white", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {filterCount}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default SectionMobileActionBar;
