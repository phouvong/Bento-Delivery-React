import { alpha, Box, Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import VariationModal from "../global/VariationModal";

const ServiceVariation = ({
  variations = [],
  onSelectVariation,
  selectedVariation,
  compact = false,
  cartLoading = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const items = variations;

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        sx={{
          px: 2,
          py: 1.5,
          borderRadius: "12px",
          backgroundColor: alpha(theme.palette.text.primary, 0.05),
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setOpen(true)}
      >
        <Box>
          {!compact && (
            <Typography fontWeight={700} fontSize={{ xs: "14px", md: "15px" }} color="text.primary">
              {t("Select Variation")}
              {!selectedVariation?.length && (
                <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              )}
            </Typography>
          )}
          {cartLoading ? (
            <Skeleton variant="text" width={120} height={20} />
          ) : (
            <Typography
              fontWeight={compact || selectedVariation?.length ? 700 : undefined}
              fontSize={ compact ? { xs: "14px", md: "15px" } : { xs: "12px", md: "13px" }}
              color={compact ? "text.primary" : "text.secondary"}
            >
              {selectedVariation?.length
                ? `${selectedVariation.length} ${t("Variation Selected")}`
                : `${items.length} ${t("Variation Available")}`}
              {compact && !selectedVariation?.length && (
                <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
                  *
                </Typography>
              )}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            flexShrink: 0,
          }}
        >
          <i className="fi fi-rr-plus" style={{ fontSize: "14px", display: "flex", lineHeight: 1 }} />
        </Box>
      </Stack>

      {/* Variations modal */}
      <VariationModal
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        selectedVariation={selectedVariation}
        onSelectVariation={onSelectVariation}
      />
    </>
  );
};

export default ServiceVariation;
