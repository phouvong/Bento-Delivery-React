import { Box, Skeleton, Stack, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ChatDetailShimmerProps {
  rows?: number;
}

const layout = [
  { isUser: false, lines: 2, w: 78 },
  { isUser: true, lines: 1, w: 52 },
  { isUser: false, lines: 3, w: 82 },
  { isUser: true, lines: 1, w: 36 },
  { isUser: false, lines: 2, w: 70 },
];

const ChatDetailShimmer = ({ rows = 5 }: ChatDetailShimmerProps) => {
  const theme = useTheme();
  const items = layout.slice(0, rows);

  return (
    <Stack spacing={1.5} sx={{ py: 0.5 }}>
      {items.map((row, i) => (
        <Stack
          key={i}
          direction="row"
          spacing={1}
          alignItems="flex-end"
          justifyContent={row.isUser ? "flex-end" : "flex-start"}
        >
          {!row.isUser && (
            <Skeleton
              variant="circular"
              width={28}
              height={28}
              sx={{ flexShrink: 0 }}
            />
          )}
          <Stack
            alignItems={row.isUser ? "flex-end" : "flex-start"}
            spacing={0.5}
            sx={{ maxWidth: "78%" }}
          >
            <Box
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 2,
                borderTopRightRadius: row.isUser ? 4 : 16,
                borderTopLeftRadius: row.isUser ? 16 : 4,
                backgroundColor: row.isUser
                  ? alpha(theme.palette.primary.main, 0.18)
                  : theme.palette.background.paper,
                border: row.isUser
                  ? "none"
                  : `1px solid ${theme.palette.divider}`,
                width: `${Math.min(row.w * 2.4, 240)}px`,
              }}
            >
              <Stack spacing={0.5}>
                {Array.from({ length: row.lines }).map((_, li) => (
                  <Skeleton
                    key={li}
                    variant="text"
                    width={
                      li === row.lines - 1
                        ? `${Math.max(row.w - 18, 30)}%`
                        : `${row.w}%`
                    }
                    sx={{ fontSize: 13.5 }}
                  />
                ))}
              </Stack>
            </Box>
            <Skeleton variant="text" width={36} sx={{ fontSize: 10.5 }} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

export default ChatDetailShimmer;
