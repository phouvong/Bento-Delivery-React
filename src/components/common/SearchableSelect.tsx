import { useMemo, useRef, useState } from "react";
import {
  Box,
  InputBase,
  Popover,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface SearchableSelectOption {
  id: string | number;
  name: string;
}

interface SearchableSelectProps {
  value: string | number | "";
  onChange: (value: string | number) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  hasError?: boolean;
  popoverZIndex?: number;
}

export default function SearchableSelect({
  value,
  onChange,
  options = [],
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled = false,
  hasError = false,
  popoverZIndex,
}: SearchableSelectProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [search, setSearch] = useState("");

  const open = Boolean(anchorEl);
  const selectedOption = options.find((opt) => opt.id === value);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const query = search.trim().toLowerCase();
    return options.filter((opt) => opt.name?.toLowerCase().includes(query));
  }, [options, search]);

  const handleOpen = () => {
    if (disabled) return;
    setAnchorEl(anchorRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearch("");
  };

  const handleSelect = (optionId: string | number) => {
    onChange(optionId);
    handleClose();
  };

  return (
    <>
      <Box
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          width: "100%",
          height: { xs: "40px", md: "44px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          px: 1.75,
          borderRadius: "10px",
          backgroundColor: disabled
            ? theme.palette.neutral?.[100] || theme.palette.action.disabledBackground
            : theme.palette.background.paper,
          border: `1px solid ${
            hasError
              ? theme.palette.error.main
              : open
                ? theme.palette.primary.main
                : theme.palette.divider
          }`,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "border-color 0.15s ease",
          "&:hover": {
            borderColor: disabled
              ? theme.palette.divider
              : hasError
                ? theme.palette.error.main
                : theme.palette.neutral?.[300] || theme.palette.primary.main,
          },
        }}
      >
        <Typography
          noWrap
          sx={{
            fontSize: { xs: "13px", md: "14px" },
            color: selectedOption
              ? theme.palette.text.primary
              : theme.palette.neutral?.[450] || theme.palette.text.disabled,
          }}
        >
          {selectedOption ? t(selectedOption.name) : placeholder}
        </Typography>
        <i
          className="fi fi-rr-angle-small-down"
          style={{
            fontSize: "16px",
            display: "flex",
            lineHeight: 1,
            color: theme.palette.text.secondary,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s ease",
            flexShrink: 0,
          }}
        />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        disableRestoreFocus
        disableScrollLock
        sx={popoverZIndex ? { zIndex: popoverZIndex } : undefined}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              width: anchorRef.current?.offsetWidth || "auto",
              minWidth: 240,
              maxHeight: 360,
              display: "flex",
              flexDirection: "column",
              borderRadius: "12px",
              boxShadow: `0 4px 20px ${alpha(theme.palette.text.primary, 0.12)}`,
              border: `1px solid ${theme.palette.divider}`,
              overflow: "hidden",
            },
          },
        }}
      >
        {/* Search bar */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            px: 1.5,
            py: 1,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{
              backgroundColor:
                theme.palette.neutral?.[100] ||
                alpha(theme.palette.text.primary, 0.04),
              borderRadius: "8px",
              px: 1.25,
              height: "36px",
            }}
          >
            <i
              className="fi fi-rr-search"
              style={{
                fontSize: "14px",
                display: "flex",
                lineHeight: 1,
                color: theme.palette.text.secondary,
              }}
            />
            <InputBase
              autoFocus
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder || t("Search...")}
              sx={{
                fontSize: "13px",
                color: theme.palette.text.primary,
                "& input::placeholder": {
                  color:
                    theme.palette.neutral?.[450] || theme.palette.text.disabled,
                  opacity: 1,
                },
              }}
            />
          </Stack>
        </Box>

        {/* Options list */}
        <Box sx={{ overflowY: "auto", py: 0.5 }}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => {
              const isSelected = opt.id === value;
              return (
                <Box
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  sx={{
                    px: 1.75,
                    py: 1.1,
                    cursor: "pointer",
                    fontSize: "13.5px",
                    color: isSelected
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                    fontWeight: isSelected ? 600 : 400,
                    backgroundColor: isSelected
                      ? alpha(theme.palette.primary.main, 0.08)
                      : "transparent",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? alpha(theme.palette.primary.main, 0.1)
                        : theme.palette.neutral?.[100] ||
                          alpha(theme.palette.text.primary, 0.04),
                    },
                  }}
                >
                  {t(opt.name)}
                </Box>
              );
            })
          ) : (
            <Box sx={{ px: 1.75, py: 2 }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  color:
                    theme.palette.neutral?.[450] || theme.palette.text.disabled,
                  textAlign: "center",
                }}
              >
                {emptyText || t("No options found")}
              </Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
}
