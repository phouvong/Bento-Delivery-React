import {
  Box,
  IconButton,
  InputBase,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

/**
 * Mobile-only sticky action row for the category page: context search + filter icon.
 * The back+title header is rendered by MobileNavBar (section-page block) at the very top.
 */
const CategoryMobilePageBar = ({
  placeholder,
  onFilterOpen,
  filterCount = 0,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const inputRef = useRef(null);

  const [value, setValue] = useState(
    typeof router.query.q === "string" ? router.query.q : "",
  );

  useEffect(() => {
    const q = typeof router.query.q === "string" ? router.query.q : "";
    setValue(q);
  }, [router.query.q]);

  const commit = (val) => {
    const trimmed = val.trim();
    const { q: _removed, ...rest } = router.query;
    const nextQuery = trimmed ? { ...rest, q: trimmed } : rest;
    router.push({ pathname: router.pathname, query: nextQuery }, undefined, {
      shallow: true,
    });
  };

  return (
    <Box
      sx={{
        display: { xs: "block", md: "none" },
        position: "sticky",
        top: "60px", // sits just below MobileNavBar's section title bar
        zIndex: theme.zIndex.appBar - 1,
        backgroundColor: theme.palette.background.default,
        px: "12px",
        pt: "6px",
        pb: "6px",
        mb: "6px",
      }}
    >
      <Stack direction="row" alignItems="center" gap="8px">
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
            style={{
              fontSize: "15px",
              lineHeight: 1,
              display: "flex",
              color: theme.palette.neutral[450],
              flexShrink: 0,
            }}
          />
          <InputBase
            inputRef={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit(value);
            }}
            placeholder={t(placeholder || "Search...")}
            sx={{
              flex: 1,
              fontSize: "14px",
              color: "neutral.1050",
              "& input::placeholder": { color: theme.palette.neutral[450] },
            }}
          />
          {value && (
            <IconButton
              onClick={() => {
                setValue("");
                commit("");
              }}
              size="small"
              sx={{ p: "2px", flexShrink: 0 }}
              aria-label={t("Clear search")}
            >
              <i
                className="fi fi-rr-cross-small"
                style={{
                  fontSize: "15px",
                  lineHeight: 1,
                  display: "flex",
                  color: theme.palette.neutral[450],
                }}
              />
            </IconButton>
          )}
        </Box>

        <Box
          onClick={onFilterOpen}
          sx={{
            position: "relative",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            cursor: "pointer",
            flexShrink: 0,
            backgroundColor: theme.palette.background.secondary,
          }}
        >
          <i
            className="fi fi-ss-sliders-v"
            style={{
              fontSize: "16px",
              lineHeight: 1,
              display: "flex",
              color: theme.palette.neutral[1050],
            }}
          />
          {filterCount > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: -4,
                right: -4,
                minWidth: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: "3px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "common.white",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {filterCount}
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default CategoryMobilePageBar;
