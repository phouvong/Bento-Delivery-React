import { useTheme } from "@emotion/react";
import { Clear } from "@mui/icons-material";
import { Box, Dialog, Drawer, Stack, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
const CustomModal = (props) => {
  const {
    openModal,
    handleClose,
    disableAutoFocus,
    closeButton,
    children,
    maxWidth,
    drawerHeight,
  } = props;
  const handleCloseModal = (event, reason) => {
    event?.stopPropagation?.();
    if (reason && reason === "backdropClick") {
      if (disableAutoFocus) {
        return true;
      } else {
        handleClose?.();
      }
    } else {
      handleClose?.();
    }
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const closeButtonNode = closeButton && (
    <Stack direction="row" justifyContent="flex-end">
      <Box
        onClick={handleCloseModal}
        sx={{
          cursor: "pointer",
          color: theme.palette.text.primary,
          mt: 1.3,
          mr: 1.3,
        }}
      >
        <Clear sx={{ height: "16px" }} />
      </Box>
    </Stack>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={openModal}
        onClose={handleCloseModal}
        sx={{ zIndex: 1500 }}
        PaperProps={{
          sx: {
            borderRadius: "16px 16px 0 0",
            maxHeight: "90vh",
            overflowY: "auto",
            ...(drawerHeight && { height: drawerHeight }),
          },
        }}
      >
        {closeButtonNode}
        {children}
      </Drawer>
    );
  }

  return (
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      maxWidth={maxWidth ? false : "sm"}
      sx={{
        zIndex: 1500,
        ".MuiDialog-paper": {
          margin: "16px",
          overflowX: "hidden",
          ...(maxWidth && {
            width: `min(${maxWidth}, calc(100vw - 32px))`,
            maxWidth: "100%",
          }),
        },
      }}
    >
      {closeButtonNode}
      {children}
    </Dialog>
  );
};

CustomModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CustomModal;
