import { Box, Skeleton, Typography } from "@mui/material";
import { Stack } from "@mui/system";

const CIRCLE_SIZE = 36;
const CIRCLE_BG = "rgba(17, 24, 39, 0.05)";
const CONNECTOR_COLOR = "rgba(17, 24, 39, 0.18)";

const ParcelInstruction = ({ steps, theme, isLoading }) => {
  const renderRow = (left, content, isLast) => (
    <Stack direction="row" alignItems="stretch" spacing={2.25}>
      <Stack alignItems="center" sx={{ width: CIRCLE_SIZE, flexShrink: 0 }}>
        {left}
        {!isLast && (
          <Box
            sx={{
              flex: 1,
              width: 0,
              borderLeft: `1.5px dashed ${CONNECTOR_COLOR}`,
              minHeight: { xs: 18, md: 24 },
              mt: "4px",
              mb: "-4px",
            }}
          />
        )}
      </Stack>
      <Box sx={{ flex: 1, minWidth: 0, pb: isLast ? 0 : { xs: 2, md: 2.5 } }}>
        {content}
      </Box>
    </Stack>
  );

  if (isLoading) {
    return (
      <Stack>
        {[...Array(3)].map((_, index) => {
          const isLast = index === 2;
          return (
            <Box key={index}>
              {renderRow(
                <Skeleton
                  variant="circular"
                  width={CIRCLE_SIZE}
                  height={CIRCLE_SIZE}
                />,
                <Stack spacing={0.5}>
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="90%" height={16} />
                  <Skeleton variant="text" width="75%" height={16} />
                </Stack>,
                isLast
              )}
            </Box>
          );
        })}
      </Stack>
    );
  }

  return (
    <Stack>
      {steps?.map((step, index) => {
        const isLast = index === (steps?.length || 0) - 1;
        return (
          <Box key={index}>
            {renderRow(
              <Box
                sx={{
                  width: CIRCLE_SIZE,
                  height: CIRCLE_SIZE,
                  borderRadius: "50%",
                  backgroundColor: CIRCLE_BG,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.palette.text?.primary,
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </Box>,
              <Stack spacing={0.5}>
                <Typography
                  component="h3"
                  sx={{
                    fontSize: { xs: "15px", md: "16px" },
                    fontWeight: 700,
                    color: "neutral.1050",
                    lineHeight: 1.3,
                  }}
                >
                  {step?.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "13px", md: "14px" },
                    color: theme.palette.text?.secondary,
                    lineHeight: 1.55,
                  }}
                >
                  {step?.description}
                </Typography>
              </Stack>,
              isLast
            )}
          </Box>
        );
      })}
    </Stack>
  );
};

export default ParcelInstruction;
