import { Skeleton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

interface ChatListShimmerProps {
  rows?: number;
}

const ChatListShimmer = ({ rows = 6 }: ChatListShimmerProps) => {
  const theme = useTheme();

  return (
    <Stack sx={{ flex: 1 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <Stack
          key={i}
          direction="row"
          spacing={1.25}
          alignItems="flex-start"
          sx={{
            px: 2,
            py: 1.25,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          }}
        >
          <Skeleton
            variant="circular"
            width={36}
            height={36}
            sx={{ flexShrink: 0 }}
          />
          <Stack flex={1} minWidth={0} spacing={0.75}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <Skeleton
                variant="text"
                width={`${50 + (i % 3) * 12}%`}
                sx={{ fontSize: 14 }}
              />
              <Skeleton variant="text" width={28} sx={{ fontSize: 11 }} />
            </Stack>
            <Skeleton
              variant="text"
              width={`${70 + (i % 4) * 6}%`}
              sx={{ fontSize: 12.5 }}
            />
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};

export default ChatListShimmer;
