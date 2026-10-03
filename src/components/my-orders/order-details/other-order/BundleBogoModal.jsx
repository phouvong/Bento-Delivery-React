import {
  alpha,
  Box,
  Dialog,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NextImage from "components/NextImage";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { t } from "i18next";

const ItemRow = ({ row }) => {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap="12px"
      sx={{
        p: "12px",
        borderRadius: "12px",
        border: `1px solid ${theme.palette.customColor.tagBg}`,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 44,
          height: 44,
          borderRadius: "8px",
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: theme.palette.background.secondary,
        }}
      >
        <NextImage
          src={row.image}
          alt={row.name || ""}
          fill
          objectFit="cover"
        />
      </Box>
      <Stack sx={{ minWidth: 0, gap: "2px" }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            color: "neutral.1050",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {row.name}
        </Typography>
        <Stack direction="row" alignItems="center" gap="4px">
          <Typography sx={{ fontSize: "13px", color: "neutral.500" }}>
            {t("QTY")} : {row.quantity ?? 1} ·
          </Typography>
          {row.isFree ? (
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: theme.palette.success.main,
              }}
            >
              {t("Free")}
            </Typography>
          ) : (
            <Typography sx={{ fontSize: "13px", color: "neutral.500" }}>
              {getAmountWithSign(row.price)}
            </Typography>
          )}
        </Stack>
        {!!row.variationText && (
          <Typography sx={{ fontSize: "12px", color: "neutral.500" }}>
            {t("Variation")} : {row.variationText}
          </Typography>
        )}
        {!!row.addOnSummary && (
          <Typography sx={{ fontSize: "12px", color: "neutral.500" }}>
            {t("Addon")} : {row.addOnSummary}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

const BundleBogoModal = ({
  open,
  onClose,
  title,
  badgeLabel,
  sections = [],
  quantity,
  unitPrice,
  unitLabel,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"), { noSsr: true });

  const content = (
    <Stack sx={{ flex: 1, minHeight: 0 }}>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        gap="12px"
        sx={{ p: { xs: "16px 16px 12px", md: "24px 24px 12px" } }}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap="8px"
          sx={{ minWidth: 0 }}
        >
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 700,
              color: "neutral.1050",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textTransform: "capitalize",
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              flexShrink: 0,
              px: "8px",
              py: "2px",
              borderRadius: "6px",
              border: `1px solid ${theme.palette.primary.main}`,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.4px",
              textTransform: "capitalize",
            }}
          >
            {badgeLabel}
          </Box>
        </Stack>
        <IconButton
          onClick={onClose}
          sx={{ flexShrink: 0, m: "-8px -8px 0 0" }}
        >
          <i className="fi fi-rr-cross-small" style={{ fontSize: "18px" }} />
        </IconButton>
      </Stack>

      <Stack
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          gap: "20px",
          px: { xs: "16px", md: "24px" },
          pt: "4px",
          pb: { xs: "16px", md: "24px" },
        }}
      >
        {sections
          .filter((section) => section.rows?.length > 0)
          .map((section, si) => (
            <Stack key={section.title ?? si} sx={{ gap: "10px" }}>
              {!!section.title && (
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "neutral.500",
                  }}
                >
                  {section.title}
                </Typography>
              )}
              {section.rows.map((row, i) => (
                <ItemRow key={`${row.key ?? "item"}-${i}`} row={row} />
              ))}
            </Stack>
          ))}
      </Stack>

      <Stack
        gap="12px"
        sx={{
          p: { xs: "16px", md: "20px 24px" },
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap="8px"
        >
          <Box
            sx={{
              px: "12px",
              py: "6px",
              borderRadius: "8px",
              backgroundColor: theme.palette.background.secondary,
              fontSize: "14px",
              fontWeight: 600,
              color: "neutral.1050",
            }}
          >
            {t("QTY")} : {quantity ?? 1}
          </Box>
          <Stack alignItems="flex-end" gap="2px">
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.2,
                letterSpacing: "-0.48px",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {getAmountWithSign(unitPrice)}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                color: "neutral.500",
                lineHeight: 1.2,
                textTransform: "capitalize",
                letterSpacing: "0.4px",
              }}
            >
              {unitLabel}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        sx={{ zIndex: (t) => t.zIndex.modal + 10 }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            maxHeight: "85vh",
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ zIndex: (t) => t.zIndex.modal + 10 }}
      PaperProps={{
        sx: {
          width: "420px",
          maxWidth: "92vw",
          borderRadius: "16px",
        },
      }}
    >
      {content}
    </Dialog>
  );
};

export default BundleBogoModal;
