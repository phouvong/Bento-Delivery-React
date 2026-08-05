import { Avatar, Box, Stack, Typography, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import type { ChatCategory } from "./types";

interface ChatCategoryChipsProps {
  categories: ChatCategory[];
  categoryImageUrl?: string;
  onSelect?: (category: ChatCategory) => void;
}

const buildImageSrc = (
  cat: ChatCategory,
  categoryImageUrl?: string,
): string | undefined => {
  if (cat.image_full_url) return cat.image_full_url;
  if (!cat.image) return undefined;
  if (/^https?:\/\//i.test(cat.image)) return cat.image;
  if (!categoryImageUrl) return undefined;
  return `${categoryImageUrl.replace(/\/$/, "")}/${cat.image}`;
};

const ChatCategoryChips = ({
  categories,
  categoryImageUrl,
  onSelect,
}: ChatCategoryChipsProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  if (!categories?.length) return null;

  return (
    <Box
      sx={{
        width: "100%",
        pt: "5px",
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
        sx={{ pb: 0.5, pr: 1, minWidth: "min-content" }}
      >
        {categories.map((cat) => {
          const imgSrc = buildImageSrc(cat, categoryImageUrl);
          return (
            <Stack
              key={cat.id}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : -1}
              onClick={() => onSelect?.(cat)}
              onKeyDown={(e) => {
                if (onSelect && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  onSelect(cat);
                }
              }}
              direction="column"
              alignItems="center"
              spacing={0.75}
              sx={{
                width: 72,
                py: 1,
                px: 0.5,
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                cursor: onSelect ? "pointer" : "default",
                transition:
                  "border-color 120ms ease, background-color 120ms ease, transform 120ms ease",
                "&:hover": onSelect
                  ? {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: alpha(
                        theme.palette.primary.main,
                        0.04,
                      ),
                      transform: "translateY(-2px)",
                    }
                  : undefined,
              }}
            >
              <Avatar
                src={imgSrc}
                alt={cat.name}
                variant="rounded"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                {!imgSrc && cat.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                fontSize={11}
                fontWeight={600}
                textAlign="center"
                noWrap
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  px: 0.25,
                }}
                title={cat.name}
              >
                {t(cat.name)}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ChatCategoryChips;
