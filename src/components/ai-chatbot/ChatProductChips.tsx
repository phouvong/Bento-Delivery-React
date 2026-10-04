import React from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import CustomImageContainerImpl from "components/CustomImageContainer";
import type { ChatProduct } from "./types";
import { getAmountWithSign } from "helper-functions/CardHelpers";

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
}) => React.ReactElement;

interface ChatProductChipsProps {
  products: ChatProduct[];
  productImageUrl?: string;
  onSelect?: (product: ChatProduct) => void;
  onAddToCart?: (product: ChatProduct) => void;
  addingProductId?: number | null;
}

const buildImage = (base: string | undefined, name: string) => {
  if (!name) return undefined;
  if (/^https?:\/\//i.test(name)) return name;
  if (!base) return undefined;
  return `${base.replace(/\/$/, "")}/${name}`;
};

const ChatProductChips = ({
  products,
  productImageUrl,
  onSelect,
  onAddToCart,
  addingProductId,
}: ChatProductChipsProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  if (!products?.length) return null;

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
        {products.map((p) => {
          const imgSrc = p?.image_full_url;
          return (
            <Stack
              key={p.id}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : -1}
              onClick={() => onSelect?.(p)}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                width: 220,
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
                  src={imgSrc}
                  alt={p.name}
                  width="44px"
                  height="44px"
                  objectfit="cover"
                  borderRadius="4px"
                />
              </Box>
              <Stack flex={1} minWidth={0}>
                <Typography
                  fontSize={12.5}
                  fontWeight={600}
                  noWrap
                  title={p.name}
                >
                  {p.name}
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.75}
                  sx={{ mt: 0.25 }}
                >
                  <Typography
                    fontSize={12}
                    fontWeight={700}
                    color="primary.main"
                  >
                    {getAmountWithSign(p.discounted_price)}
                  </Typography>
                  {p.price > p.discounted_price && (
                    <Typography
                      fontSize={11}
                      color="text.secondary"
                      sx={{ textDecoration: "line-through" }}
                    >
                      {getAmountWithSign(p.price)}
                    </Typography>
                  )}
                  {p.discount_label && (
                    <Box
                      sx={{
                        ml: "auto",
                        px: 0.75,
                        py: 0.125,
                        borderRadius: 0.75,
                        fontSize: 10,
                        fontWeight: 700,
                        color: theme.palette.error.main,
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                      }}
                    >
                      {p.discount_label}
                    </Box>
                  )}
                </Stack>
                {p.store_name && (
                  <Typography
                    fontSize={10.5}
                    color="text.secondary"
                    noWrap
                    sx={{ mt: 0.125 }}
                  >
                    {p.store_name}
                  </Typography>
                )}
              </Stack>
              {/* {onAddToCart && (
                <Tooltip title={t("Add to cart") as string}>
                  <span>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(p);
                      }}
                      disabled={addingProductId === p.id}
                      sx={{
                        flexShrink: 0,
                        width: 30,
                        height: 30,
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          0.1,
                        ),
                        color: theme.palette.primary.main,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                        },
                        "&.Mui-disabled": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.06,
                          ),
                          color: alpha(theme.palette.primary.main, 0.5),
                        },
                      }}
                    >
                      <AddRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </span>
                </Tooltip>
              )} */}
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ChatProductChips;
