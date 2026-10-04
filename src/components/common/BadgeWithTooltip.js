import {
  Box,
  Popover,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";

/**
 * Renders a tooltip on desktop (hover) and a dark popover on mobile (tap).
 * Popover closes on outside tap without propagating to parent click handlers.
 *
 * Usage:
 *   <BadgeWithTooltip title="Halal">
 *     <Box>...</Box>
 *   </BadgeWithTooltip>
 */
const BadgeWithTooltip = ({
  title,
  children,
  placement = "top",
  containerSx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState(null);

  if (isMobile) {
    return (
      <>
        <Box
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
          }}
          sx={{
            ...containerSx,
          }}
        >
          {children}
        </Box>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          onClick={(e) => e.stopPropagation()}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "bottom", horizontal: "center" }}
          disableRestoreFocus
          sx={{ zIndex: (t) => t.zIndex.modal + 200 }}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: "rgba(97,97,97,0.92)",
                borderRadius: "6px",
                px: "10px",
                py: "5px",
                boxShadow: "none",
                border: "none",
                mt: "-6px",
              },
            },
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#fff",
              lineHeight: 1.4,
            }}
          >
            {title}
          </Typography>
        </Popover>
      </>
    );
  }

  return (
    <Tooltip title={title} placement={placement} arrow>
      {children}
    </Tooltip>
  );
};

export default BadgeWithTooltip;
