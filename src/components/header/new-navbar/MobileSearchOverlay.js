import { Box, IconButton, Modal, Stack, useTheme } from "@mui/material";
import { useEffect, useRef } from "react";
import { t } from "i18next";
import ManageSearch from "../second-navbar/ManageSearch";

const MobileSearchOverlay = ({ open, onClose }) => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const bg = theme.palette.background.paper;
  const border = theme.palette.divider;
  const inputBg = theme.palette.mode === "dark" ? theme.palette.neutral[800] : "#f2f2f2";
  const inputBorder = theme.palette.mode === "dark" ? theme.palette.neutral[700] : "#e0e0e0";
  const textColor = theme.palette.neutral[1000];
  const placeholderColor = theme.palette.neutral[500];

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => {
      containerRef.current?.querySelector("input")?.focus();
    }, 80);
    return () => clearTimeout(id);
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ zIndex: theme.zIndex.modal + 1 }}
      slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.3)" } } }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: bg,
          display: "flex",
          flexDirection: "column",
          outline: "none",
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
            backgroundColor: `${bg} !important`,
            overflow: "hidden !important",
          },
          "& .MuiPaper-root > div": {
            maxHeight: "calc(90vh - 60px) !important",
            overflowY: "auto !important",
          },
        }}
      >
        {/* Top nav: X close — search input — arrow submit */}
        <Stack
          direction="row"
          alignItems="center"
          gap="8px"
          sx={{
            px: "12px",
            py: "10px",
            borderBottom: `1px solid ${border}`,
            backgroundColor: bg,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{ p: "2px", color: textColor, flexShrink: 0 }}
            aria-label={t("Close")}
          >
            <i
              className="fi fi-rr-cross-small"
              style={{ fontSize: "20px", lineHeight: 1, display: "flex" }}
            />
          </IconButton>

          <Box
            ref={containerRef}
            sx={{
              flex: 1,
              minWidth: 0,
              "& > div": { maxWidth: "100% !important" },
              "& .MuiStack-root:has(> .MuiInputBase-root)": {
                backgroundColor: `${inputBg} !important`,
                height: "40px !important",
                borderRadius: "9999px !important",
                border: `1px solid ${inputBorder} !important`,
                boxShadow: "none !important",
                padding: "0 2px !important",
                gap: "8px !important",
              },
              "& .MuiStack-root:has(> .MuiInputBase-root):focus-within": {
                border: `1px solid ${inputBorder} !important`,
                boxShadow: "none !important",
              },
              "& .MuiInputBase-root": { color: textColor },
              "& .MuiInputBase-input": {
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: 1.3,
                padding: "0 0 0 5px !important",
                "&::placeholder": { color: placeholderColor, opacity: 1 },
              },
            }}
          >
            <ManageSearch fullWidth searchFromNav />
          </Box>

          <IconButton
            sx={{ p: "2px", color: textColor, flexShrink: 0 }}
            aria-label={t("Submit search")}
            onClick={() => {
              const input = containerRef.current?.querySelector("input");
              const value = input?.value?.trim();
              if (!input || !value) return;
              input.focus();
              const event = new KeyboardEvent("keypress", {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
              });
              input.dispatchEvent(event);
            }}
          >
            <i
              className="fi fi-rr-arrow-small-right"
              style={{ fontSize: "20px", lineHeight: 1, display: "flex" }}
            />
          </IconButton>
        </Stack>
      </Box>
    </Modal>
  );
};

export default MobileSearchOverlay;
