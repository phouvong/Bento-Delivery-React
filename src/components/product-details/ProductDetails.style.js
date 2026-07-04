import { Box, styled } from "@mui/material";
import { Stack } from "@mui/system";
import { alpha } from "@mui/material";

export const CustomColorBox = styled(Stack)(
  ({ theme, color, productcolor }) => ({
    width: "32px",
    height: "32px",
    backgroundColor: color,
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow:
      color === productcolor
        ? `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.primary.main}`
        : `inset 0 0 0 1px ${alpha(theme.palette.text.secondary, 0.18)}`,
    justifyContent: "center",
    alignItems: "center",
    transition: "box-shadow 0.15s ease, transform 0.15s ease",
    "&:hover": {
      transform: "translateY(-1px)",
    },
  })
);

export const CustomSizeBox = styled(Stack)(({ theme, productsize, size }) => {
  const isSelected = productsize === size;
  return {
    justifyContent: "center",
    alignItems: "center",
    minWidth: "32px",
    height: "32px",
    padding: "4px 8px",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${
      isSelected
        ? theme.palette.neutral?.[1050] ?? theme.palette.text.primary
        : theme.palette.divider
    }`,
    color: theme.palette.text.primary,
    transition: "border-color 0.15s ease",
  };
});
