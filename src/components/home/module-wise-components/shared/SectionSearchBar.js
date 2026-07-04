import { Box, IconButton, InputBase } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Contextual search bar for section and category pages.
 * Updates URL with `?q=value` (shallow) so the page can fetch filtered results.
 * Does NOT show global suggestions — it only scopes search to current context.
 */
const SectionSearchBar = ({ placeholder }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const inputRef = useRef(null);

  const [value, setValue] = useState(
    typeof router.query.q === "string" ? router.query.q : "",
  );

  // Sync input when URL q param changes (e.g. browser back/forward)
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") commit(value);
  };

  const handleClear = () => {
    setValue("");
    commit("");
    inputRef.current?.focus();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        height: "44px",
        px: "16px",
        borderRadius: "9999px",
        backgroundColor: (theme) =>
          theme.palette.background.secondary ?? "#f2f2f2",
        width: "100%",
        maxWidth: "820px",
      }}
    >
      <i
        className="fi fi-rr-search"
        style={{ fontSize: "16px", lineHeight: 1, display: "flex", flexShrink: 0, color: "#757575" }}
      />
      <InputBase
        inputRef={inputRef}
        value={value}
        onChange={(e) => {
          const newVal = e.target.value;
          setValue(newVal);
          if (newVal === "") commit("");
        }}
        onKeyDown={handleKeyDown}
        placeholder={t(placeholder || "Search...")}
        sx={{
          flex: 1,
          fontSize: "16px",
          color: "neutral.1050",
          "& input::placeholder": { color: "#a3a3a3" },
        }}
      />
      {value && (
        <IconButton
          onClick={handleClear}
          size="small"
          sx={{ p: "2px", flexShrink: 0 }}
          aria-label={t("Clear search")}
        >
          <i
            className="fi fi-rr-cross-small"
            style={{ fontSize: "16px", lineHeight: 1, display: "flex", color: "#757575" }}
          />
        </IconButton>
      )}
    </Box>
  );
};

export default SectionSearchBar;
