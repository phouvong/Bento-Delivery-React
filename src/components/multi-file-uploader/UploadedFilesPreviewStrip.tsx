import React, { useRef, useState, useEffect } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTranslation } from "react-i18next";

export interface UploadedFileEntry {
  file: File | null;
  preview: string;
  name?: string;
  autoSave?: boolean;
}

export interface UploadedFilesPreviewStripProps {
  files: UploadedFileEntry[];
  onRemove: (index: number) => void;
  onPreviewClick?: (index: number) => void;
}

// Fixed card width — never changes regardless of how many files exist
const CARD_WIDTH_MD = 110;
const CARD_WIDTH_XS = 80;

const SCROLL_STEP = 130;

const UploadedFilesPreviewStrip: React.FC<UploadedFilesPreviewStripProps> = ({
  files,
  onRemove,
  onPreviewClick,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
  }, [files]);

  if (!files.length) return null;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "right" ? SCROLL_STEP : -SCROLL_STEP,
      behavior: "smooth",
    });
  };

  const arrowSx = {
    width: 28,
    height: 28,
    flexShrink: 0,
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[3],
    "&:hover": {
      background: theme.palette.background.paper,
      color: theme.palette.primary.main,
    },
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "6px", width: "100%", minWidth: 0 }}>
      {canScrollLeft && (
        <IconButton onClick={() => scroll("left")} aria-label={t("Previous")} size="small" sx={arrowSx}>
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
      )}

      <Box
        ref={scrollRef}
        onScroll={updateScrollState}
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          overflowX: "auto",
          overflowY: "hidden",
          flex: 1,
          minWidth: 0,
          pb: 0.5,
          // "&::-webkit-scrollbar": { height: "4px" },
          // "&::-webkit-scrollbar-thumb": {
          //   background: theme.palette.divider,
          //   borderRadius: "4px",
          // },
        }}
      >
      {files.map((entry, index) => (
        <Box
          key={`${entry.file?.name ?? entry.name ?? entry.preview}-${index}`}
          onClick={() => onPreviewClick?.(index)}
          sx={{
            position: "relative",
            flexShrink: 0,
            width: { xs: CARD_WIDTH_XS, sm: CARD_WIDTH_MD },
            height: { xs: CARD_WIDTH_XS, sm: CARD_WIDTH_MD },
            border: `1.5px dashed ${theme.palette.divider}`,
            borderRadius: "12px",
            overflow: "hidden",
            background: theme.palette.background.paper,
            cursor: onPreviewClick ? "pointer" : "default",
            transition: "border-color 150ms ease",
            "&:hover": {
              borderColor: onPreviewClick
                ? theme.palette.primary.main
                : theme.palette.divider,
            },
          }}
        >
          <Box
            component="img"
            src={entry.preview}
            alt={entry.file?.name ?? entry.name ?? ""}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "6px",
            }}
          />
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
            aria-label={t("Remove")}
            size="small"
            sx={{
              position: "absolute",
              top: 4,
              insetInlineEnd: 4,
              width: 20,
              height: 20,
              background: theme.palette.error.main,
              color: theme.palette.common.white,
              boxShadow: theme.shadows[2],
              "&:hover": { background: theme.palette.error.dark },
            }}
          >
            <CloseIcon sx={{ fontSize: 12 }} />
          </IconButton>
        </Box>
      ))}
      </Box>

      {canScrollRight && (
        <IconButton onClick={() => scroll("right")} aria-label={t("Next")} size="small" sx={arrowSx}>
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default UploadedFilesPreviewStrip;
