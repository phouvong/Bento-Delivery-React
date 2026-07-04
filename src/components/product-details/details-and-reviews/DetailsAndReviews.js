import { Box, Typography, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const COLLAPSED_LENGTH = 220;

const stripHtml = (html = "") =>
  typeof html === "string" ? html.replace(/<[^>]*>/g, "") : "";

const DetailsAndReviews = ({ description }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const text = useMemo(() => stripHtml(description || ""), [description]);
  const isLong = text.length > COLLAPSED_LENGTH;
  const shownText =
    expanded || !isLong ? text : text.slice(0, COLLAPSED_LENGTH).trimEnd();

  if (!text) return null;

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: "12px",
        //border: `1px solid ${theme.palette.divider}`,
        p: { xs: 1, md: 2 },
      }}
    >
      <Typography
        component="h2"
        sx={{
          fontWeight: 700,
          fontSize: { xs: "15px", md: "17px" },
          color: theme.palette.text.primary,
          mb: { xs: 1, md: 1.25 },
        }}
      >
        {t("Product Details")}
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: "13px", md: "14px" },
          lineHeight: 1.55,
          color: theme.palette.text.secondary,
          whiteSpace: "pre-wrap",
        }}
      >
        {shownText}
        {isLong && (
          <>
            {!expanded && "… "}
            <Box
              component="span"
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
                color: theme.palette.primary.main,
                fontWeight: 600,
                cursor: "pointer",
                ml: 0.5,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {expanded ? t("See Less") : t("See More")}
            </Box>
          </>
        )}
      </Typography>
    </Box>
  );
};

export default DetailsAndReviews;
