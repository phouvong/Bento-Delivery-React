import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import CustomImageContainer from "components/CustomImageContainer";
import { shadows } from "@mui/system";

const ModalWrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: theme.palette.background.paper,
  boxShadow: shadows[24],
  borderRadius: "12px",
  border: `4px solid ${theme.palette.grey[100]}`,
  maxWidth: "90vw",
  width: "100%",
  maxHeight: "90vh",
  outline: "none",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflow: "hidden",
  width: "max-content",
  minWidth: "300px",
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  borderRadius: "50%",
  top: "-4px",
  right: "-4px",
  zIndex: 1,
  backgroundColor: theme.palette.grey[100],
  padding: ".25rem",
  svg: {
    fontSize: "1.25rem",
  },
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
}));

const ImageWrapper = styled(Box)({
  maxWidth: "100%",
  maxHeight: "calc(90vh - 8px)",
  overflowY: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflowX: "hidden",

  minHeight: "200px",
});

const ImageViewModal = ({ open, onClose, imageSrc, alt = "Preview" }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="image-preview-modal"
      aria-describedby="large-image-preview"
    >
      <ModalWrapper>
        <CloseButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </CloseButton>
        <ImageWrapper>
          <CustomImageContainer
            src={imageSrc}
            alt={alt}
            width="auto"
            height="auto"
            objectfit="contain"
            borderRadius="12px"
            style={{
              maxWidth: "100%",
              maxHeight: "calc(90vh - 48px)",
            }}
          />
        </ImageWrapper>
      </ModalWrapper>
    </Modal>
  );
};

export default ImageViewModal;
