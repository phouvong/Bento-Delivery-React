import { useTheme } from "@emotion/react";
import { Clear } from "@mui/icons-material";
import { Box, Dialog, Stack } from "@mui/material";
import PropTypes from "prop-types";
const CustomModal = (props) => {
  const { openModal, handleClose, disableAutoFocus, closeButton, children } =
    props;
  const handleCloseModal = (event, reason) => {
    if (reason && reason == "backdropClick") {
      if (disableAutoFocus) {
        return;
      } else {
        handleClose?.();
      }
    } else {
      handleClose?.();
    }
  };
  const theme = useTheme();
  return (
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      sx={{
        ".MuiDialog-paper": {
          margin: "16px",
        },
      }}
    >
      {closeButton && (
        <Stack direction={"row"} justifyContent={"flex-end"}>
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
      )}
      {children}
    </Dialog>
  );
};

CustomModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CustomModal;
