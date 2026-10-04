import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { Box, Stack, Typography, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import CustomImageContainerImpl from "components/CustomImageContainer";
import type { ChatStore } from "./types";

// CustomImageContainer is a JS component whose props are all optional, but
// destructured-prop inference makes TS treat them as required. Re-type it
// with an explicit (loose) prop shape so the call site stays clean.
const CustomImageContainer = CustomImageContainerImpl as (props: {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  objectfit?: string;
  borderRadius?: string;
}) => ReactElement;

interface ChatStoreChipsProps {
  stores: ChatStore[];
  storeImageUrl?: string;
  onSelect?: (store: ChatStore) => void;
}

const buildLogoSrc = (
  store: ChatStore,
  storeImageUrl?: string
): string | undefined => {
  if (store.logo_full_url) return store.logo_full_url;
  if (!store.logo) return undefined;
  if (/^https?:\/\//i.test(store.logo)) return store.logo;
  if (!storeImageUrl) return undefined;
  return `${storeImageUrl.replace(/\/$/, "")}/${store.logo}`;
};

const ChatStoreChips = ({
  stores,
  storeImageUrl,
  onSelect,
}: ChatStoreChipsProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  if (!stores?.length) return null;

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
        {stores.map((s) => {
          const logoSrc = buildLogoSrc(s, storeImageUrl);
          const closed = s.is_open === false;
          return (
            <Stack
              key={s.id}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : -1}
              onClick={() => onSelect?.(s)}
              onKeyDown={(e) => {
                if (onSelect && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onSelect(s);
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
                position: "relative",
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
                  src={logoSrc ?? undefined}
                  alt={s.name}
                  width="44px"
                  height="44px"
                  objectfit="cover"
                  borderRadius="4px"
                />
              </Box>
              <Stack flex={1} minWidth={0}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={0.5}
                >
                  <Typography
                    fontSize={12.5}
                    fontWeight={600}
                    noWrap
                    title={s.name}
                  >
                    {s.name}
                  </Typography>
                  {closed && (
                    <Box
                      sx={{
                        px: 0.75,
                        py: 0.125,
                        borderRadius: 0.75,
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: theme.palette.error.main,
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                        flexShrink: 0,
                      }}
                    >
                      {t("Closed")}
                    </Box>
                  )}
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 0.25 }}
                >
                  {Number(s.avg_rating) > 0 && (
                    <Stack direction="row" alignItems="center" spacing={0.25}>
                      <StarRoundedIcon
                        sx={{
                          fontSize: 14,
                          color: theme.palette.warning.main,
                        }}
                      />
                      <Typography fontSize={11.5} fontWeight={600}>
                        {Number(s.avg_rating).toFixed(1)}
                      </Typography>
                    </Stack>
                  )}
                  {s.delivery_time && (
                    <Stack direction="row" alignItems="center" spacing={0.25}>
                      <AccessTimeIcon
                        sx={{
                          fontSize: 12,
                          color: theme.palette.text.secondary,
                        }}
                      />
                      <Typography fontSize={11} color="text.secondary" noWrap>
                        {s.delivery_time}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
                {(s.free_delivery || s.featured) && (
                  <Stack direction="row" spacing={0.5} sx={{ mt: 0.375 }}>
                    {s.free_delivery && (
                      <Box
                        sx={{
                          px: 0.75,
                          py: 0.125,
                          borderRadius: 0.75,
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: theme.palette.success.main,
                          backgroundColor: alpha(
                            theme.palette.success.main,
                            0.1
                          ),
                        }}
                      >
                        {t("Free delivery")}
                      </Box>
                    )}
                    {s.featured && (
                      <Box
                        sx={{
                          px: 0.75,
                          py: 0.125,
                          borderRadius: 0.75,
                          fontSize: 9.5,
                          fontWeight: 700,
                          color: theme.palette.primary.main,
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1
                          ),
                        }}
                      >
                        {t("Featured")}
                      </Box>
                    )}
                  </Stack>
                )}
              </Stack>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ChatStoreChips;
