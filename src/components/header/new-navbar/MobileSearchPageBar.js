import { Box, IconButton, Stack, useTheme } from "@mui/material";
import { useRef, useState } from "react";
import { t } from "i18next";
import { useRouter } from "next/router";
import ManageSearch from "../second-navbar/ManageSearch";

/**
 * Fixed search bar shown on mobile at the top of the /search page.
 * Replaces MobileNavBar (which hides itself on /search).
 *
 * Unfocused:  [← back]   [input]   [filter ⊞]
 * Focused:    [✕ cancel] [input]   [→ submit]
 */
const MobileSearchPageBar = ({
  searchQuery,
  query,
  onFilterOpen,
  appliedFilterCount = 0,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const filterBtnRef = useRef(null);
  const inputBoxRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const submitSearch = () => {
    const input = inputBoxRef.current?.querySelector("input");
    const value = input?.value?.trim();
    if (!input || !value) return;
    input.focus();
    input.dispatchEvent(
      new KeyboardEvent("keypress", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
      }),
    );
  };

  const cancelFocus = () => {
    const input = inputBoxRef.current?.querySelector("input");
    if (input) input.blur();
    setFocused(false);
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar,
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap="8px"
          sx={{ px: "12px", py: "10px" }}
        >
          {/* Left: cancel (focused) or back (unfocused) — single button so the
              element is never swapped mid-click (which would land the trailing
              click on the back button and trigger its navigation). Everything
              happens in onMouseDown; preventDefault stops the input blur from racing. */}
          <IconButton
            onMouseDown={(e) => {
              e.preventDefault();
              if (focused) {
                cancelFocus();
              } else {
                router.push("/home");
              }
            }}
            sx={{ p: "2px", color: theme.palette.text.primary, flexShrink: 0 }}
            aria-label={focused ? t("Cancel") : t("Back")}
          >
            <i
              className={focused ? "fi fi-rr-cross-small" : "fi fi-rr-arrow-small-left"}
              style={{ fontSize: "22px", lineHeight: 1, display: "flex" }}
            />
          </IconButton>

          {/* Search input */}
          <Box
            ref={inputBoxRef}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            sx={{
              flex: 1,
              minWidth: 0,
              "& > div": { maxWidth: "100% !important" },
              // Only target the pill Search Stack (the one with the search icon inside)
              "& .MuiStack-root:has(.fi-bs-search)": {
                position: "relative !important",
                backgroundColor: `${theme.palette.background.secondary} !important`,
                height: "40px !important",
                borderRadius: "9999px !important",
                border: "none !important",
                boxShadow: "none !important",
                padding: "0 16px !important",
                gap: "8px !important",
                overflow: "hidden",
              },
              "& .MuiInputBase-root": { color: theme.palette.text.primary, width: "100%" },
              "& .MuiInputBase-input": {
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: 1.3,
                padding: "0 !important",
                "&::placeholder": { color: theme.palette.text.disabled, opacity: 1, fontSize: "13px !important" },
              },
              "& .MuiInputBase-input:placeholder-shown": { fontSize: "13px !important" },
              // Search page bar never needs the leading search icon
              "& .fi-bs-search": { display: "none !important" },
              // Fix CloseIconWrapper right — hardcoded 27px was for voice search button spacing
              "& .MuiStack-root:has(.fi-bs-search) > div:last-child": {
                right: "7px !important",
              },
              // Dropdown: full-width fixed panel below bar, max 90vh
              "& .MuiPaper-root": {
                position: "fixed !important",
                top: "60px !important",
                left: "0 !important",
                right: "0 !important",
                width: "100% !important",
                maxWidth: "100% !important",
                borderRadius: "0 0 20px 20px !important",
                boxShadow:
                  "0px 8px 8px -4px rgba(0,0,0,0.08), 0px 16px 16px -8px rgba(0,0,0,0.12) !important",
              },
              "& .MuiPaper-root > div": {
                maxHeight: "calc(90vh - 60px) !important",
                overflowY: "auto !important",
              },
            }}
          >
            <ManageSearch
              fullWidth
              searchFromNav
              searchQuery={searchQuery}
              query={query}
            />
          </Box>

          {/* Right: submit arrow (focused) or filter (unfocused) */}
          {focused ? (
            <IconButton
              onMouseDown={(e) => {
                e.preventDefault();
                submitSearch();
              }}
              sx={{ p: "2px", color: theme.palette.text.primary, flexShrink: 0 }}
              aria-label={t("Submit search")}
            >
              <i
                className="fi fi-rr-arrow-small-right"
                style={{ fontSize: "22px", lineHeight: 1, display: "flex" }}
              />
            </IconButton>
          ) : (
            <IconButton
              ref={filterBtnRef}
              onClick={onFilterOpen ? (e) => onFilterOpen(e) : undefined}
              sx={{
                p: "2px",
                color: theme.palette.text.primary,
                flexShrink: 0,
                position: "relative",
              }}
              aria-label={t("Filter")}
            >
              <i
                className="fi fi-rr-settings-sliders"
                style={{ fontSize: "18px", lineHeight: 1, display: "flex" }}
              />
              {appliedFilterCount > 0 && (
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
                  <Box
                    component="span"
                    sx={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1,
                    }}
                  >
                    {appliedFilterCount}
                  </Box>
                </Box>
              )}
            </IconButton>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MobileSearchPageBar;
