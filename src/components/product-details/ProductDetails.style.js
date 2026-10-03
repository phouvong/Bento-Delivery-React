import { Box, styled } from "@mui/material";
import { Stack } from "@mui/system";

export const CustomColorBox = styled(Stack)(
  ({ theme, color, productcolor }) => {
    const isSelected = color === productcolor;
    return {
      width: "32px",
      height: "32px",
      padding: "4px",
      borderRadius: "8px",
      cursor: "pointer",
      backgroundColor: theme.palette.background.paper,
      border: `${isSelected ? "2px" : "1px"} solid ${
        isSelected
          ? theme.palette.neutral?.[1050] ?? theme.palette.text.primary
          : theme.palette.divider
      }`,
      boxSizing: "border-box",
      justifyContent: "center",
      alignItems: "center",
      transition: "border-color 0.15s ease, transform 0.15s ease",
      "&:hover": {
        transform: "translateY(-1px)",
      },
      "&::before": {
        content: '""',
        display: "block",
        width: "100%",
        height: "100%",
        borderRadius: "4px",
        backgroundColor: color,
      },
    };
  }
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
    border: `${isSelected ? "2px" : "1px"} solid ${
      isSelected
        ? theme.palette.neutral?.[1050] ?? theme.palette.text.primary
        : theme.palette.divider
    }`,
    color: theme.palette.text.primary,
    transition: "border-color 0.15s ease",
  };
});
