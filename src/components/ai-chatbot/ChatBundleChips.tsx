import { Box, Stack, Tooltip, Typography, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import CustomImageContainerImpl from "components/CustomImageContainer";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import type { ChatBundle } from "./types";

// See ChatStoreChips for why the loose prop shape.
const CustomImageContainer = CustomImageContainerImpl as (props: {
  src?: string | null;
  alt?: string;
  width?: string;
  height?: string;
  objectfit?: string;
  borderRadius?: string;
}) => ReactElement;

interface ChatBundleChipsProps {
  bundles: ChatBundle[];
  onSelect?: (bundle: ChatBundle) => void;
}

// A minimal, read-only take on the store page's horizontal bundle card
// (BundleProductCard) — that one expects a per-item image grid and wires up
// its own add/remove-from-cart mutations, neither of which the chat's
// bundle summary (one thumbnail, no cart identity) has any use for.
const ChatBundleChips = ({ bundles, onSelect }: ChatBundleChipsProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  if (!bundles?.length) return null;

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        "&::-webkit-scrollbar": { height: 4 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: alpha(theme.palette.text.primary, 0.15),
          borderRadius: 2,
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ pb: 0.5, pr: 1, minWidth: "min-content", marginTop: 1 }}
      >
        {bundles.map((bundle) => {
          const originalPrice = bundle.base_price ?? 0;
          const finalPrice = bundle.bundle_price ?? originalPrice;
          const hasDiscount = Number(bundle.discount_percentage) > 0;
          const memberItems = Array.isArray(bundle.member_items)
            ? bundle.member_items
            : [];

          return (
            <Stack
              key={bundle.id}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : -1}
              onClick={() => onSelect?.(bundle)}
              onKeyDown={(e) => {
                if (onSelect && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onSelect(bundle);
                }
              }}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                width: 240,
                p: 0.75,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                cursor: onSelect ? "pointer" : "default",
                transition: "border-color 120ms ease, transform 120ms ease",
                "&:hover": onSelect
                  ? {
                      borderColor: theme.palette.primary.main,
                      transform: "translateY(-1px)",
                    }
                  : undefined,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1,
                  overflow: "hidden",
                  flexShrink: 0,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <CustomImageContainer
                  src={bundle.image_full_url ?? undefined}
                  alt={bundle.name}
                  width="44px"
                  height="44px"
                  objectfit="cover"
                  borderRadius="4px"
                />
              </Box>
              <Stack flex={1} minWidth={0}>
                <Typography fontSize={12.5} fontWeight={600} noWrap>
                  {bundle.name}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography fontSize={12} fontWeight={700}>
                    {getAmountWithSign(finalPrice)}
                  </Typography>
                  {hasDiscount && (
                    <Typography
                      fontSize={10.5}
                      sx={{
                        color: theme.palette.text.secondary,
                        textDecoration: "line-through",
                      }}
                    >
                      {getAmountWithSign(originalPrice)}
                    </Typography>
                  )}
                  {hasDiscount && (
                    <Box
                      sx={{
                        px: 0.5,
                        borderRadius: 0.5,
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: theme.palette.error.main,
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                      }}
                    >
                      -{bundle.discount_percentage}%
                    </Box>
                  )}
                </Stack>
                {Number(bundle.item_count) > 0 && (
                  <Tooltip
                    title={memberItems.length ? memberItems.join(", ") : ""}
                    arrow
                    placement="top"
                    disableHoverListener={!memberItems.length}
                    // The chat popover itself sits at zIndex 100000 (see
                    // ChatBotPopover.tsx), well above MUI's default tooltip
                    // z-index — without this the tooltip rendered behind it.
                    slotProps={{ popper: { sx: { zIndex: 100001 } } }}
                  >
                    <Typography
                      fontSize={10.5}
                      color="text.secondary"
                      noWrap
                      sx={{ width: "fit-content" }}
                    >
                      {t("{{count}} items", { count: bundle.item_count })}
                    </Typography>
                  </Tooltip>
                )}
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ChatBundleChips;
