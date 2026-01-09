import React from "react";
import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

const OverlayWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: ".5rem",
  opacity: 0,
  transition: "opacity 0.3s ease-in-out",
  borderRadius: "0.5rem",
  "&:hover": {
    opacity: 1,
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  color: theme.palette.info.main,
  border: `1px solid ${theme.palette.info.main}`,
  width: "28px",
  height: "28px",
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
    transform: "scale(1.1)",
  },
  transition: "all 0.2s ease-in-out",
  // boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  svg: {
    fontSize: ".875rem",
  }
}));

const ImageHoverOverlay = ({ onViewClick, onEditClick }) => {
  return (
    <OverlayWrapper>
      <StyledIconButton
        onClick={(e) => {
          e.stopPropagation();
          onEditClick?.();
        }}
        aria-label="edit image"
      >
        <EditIcon />
      </StyledIconButton>
      <StyledIconButton
        onClick={(e) => {
          e.stopPropagation();
          onViewClick?.();
        }}
        aria-label="view image"
      >
        <VisibilityIcon />
      </StyledIconButton>
    </OverlayWrapper>
  );
};

export default ImageHoverOverlay;
