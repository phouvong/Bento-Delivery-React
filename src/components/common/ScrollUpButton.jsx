import { Box, Typography, useMediaQuery } from "@mui/material";
import useScrollDirection from "hooks/useScrollDirection";
import { useTranslation } from "react-i18next";

const SCROLL_THRESHOLD = 300;

const ScrollUpButton = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:900px)");
  const { scrollY } = useScrollDirection({ threshold: 8 });

  const visible = isMobile && scrollY > SCROLL_THRESHOLD;

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: "fixed",
        bottom: "80px",
        left: "50%",
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(120px)",
        zIndex: 800,
        display: { xs: "flex", md: "none" },
        alignItems: "center",
        gap: "6px",
        px: "16px",
        py: "8px",
        borderRadius: "9999px",
        backgroundColor: "primary.main",
        cursor: "pointer",
        userSelect: "none",
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        boxShadow:
          "0px -4px 16px -8px rgba(0,0,0,0.10), 0px -1px 4px -4px rgba(0,0,0,0.05)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#fff",
          letterSpacing: "-0.42px",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}
      >
        {t("Scroll Up")}
      </Typography>
      <i
        className="fi fi-rr-arrow-small-up"
        style={{
          fontSize: "16px",
          lineHeight: 1,
          display: "flex",
          color: "#fff",
        }}
      />
    </Box>
  );
};

export default ScrollUpButton;
