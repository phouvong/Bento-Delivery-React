import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const COLLAPSED_LINE_CLAMP = 4;

const ServiceDescription = ({ description, serviceDetailsData }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, [description]);

  if (!description) return null;

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "12px",
        p: { xs: 1, md: 2 },
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "18px", md: "24px" },
          color: theme.palette.text.primary,
          mb: { xs: 1, md: 1.25 },
        }}
      >
        {t("Service Details")}
      </Typography>

      <Box
        ref={contentRef}
        sx={{
          fontSize: { xs: "13px", md: "14px" },
          lineHeight: 1.55,
          color: theme.palette.text.secondary,
          "& p": { margin: 0, mb: 1, "&:last-child": { mb: 0 } },
          "& ul, & ol": { pl: 3, mb: 1 },
          "& a": { color: theme.palette.primary.main },
          ...(!expanded && {
            display: "-webkit-box",
            WebkitLineClamp: COLLAPSED_LINE_CLAMP,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }),
        }}
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {isOverflowing && (
        <Box
          role="button"
          tabIndex={0}
          onClick={() => setExpanded((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setExpanded((v) => !v);
            }
          }}
          sx={{
            display: "inline-block",
            fontSize: { xs: "13px", md: "14px" },
            color: theme.palette.primary.main,
            fontWeight: 600,
            cursor: "pointer",
            mt: 0.5,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {expanded ? t("See Less") : t("See More")}
        </Box>
      )}
    </Box>
  );
};

export default ServiceDescription;
