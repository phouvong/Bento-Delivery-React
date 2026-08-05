import { Box, Divider, Skeleton, Stack, useMediaQuery, useTheme } from "@mui/material";

interface Props {
  rows?: number;
}

const ListViewSkeleton = ({ rows = 5 }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box>
      <Stack sx={{ mt: { md: "4px" } }}>
        <Stack direction="row" alignItems="center" gap="16px" sx={{ mb: "8px" }}>
          <Box sx={{ flex: 1, height: "1px", backgroundColor: "divider" }} />
          <Skeleton variant="text" width={90} height={20} />
          <Box sx={{ flex: 1, height: "1px", backgroundColor: "divider" }} />
        </Stack>

        <Stack divider={<Divider sx={{ borderColor: "divider" }} />} spacing={0}>
          {Array.from({ length: rows }).map((_, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap="20px"
              sx={{ py: { xs: "12px", md: "16px" } }}
            >
              <Stack direction="row" alignItems="center" gap="12px" sx={{ flexShrink: 0 }}>
                <Skeleton variant="rounded" width={44} height={44} />
                <Stack spacing="6px">
                  <Skeleton variant="text" width={isMobile ? 120 : 160} height={18} />
                  <Skeleton variant="text" width={isMobile ? 90 : 200} height={14} />
                </Stack>
              </Stack>

              {!isMobile && (
                <Skeleton variant="text" sx={{ flex: 1, maxWidth: "400px" }} height={16} />
              )}

              <Stack direction="row" gap="8px" sx={{ flexShrink: 0 }}>
                {Array.from({ length: isMobile ? 1 : 3 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rounded"
                    width={isMobile ? 36 : 40}
                    height={isMobile ? 36 : 40}
                  />
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ListViewSkeleton;
