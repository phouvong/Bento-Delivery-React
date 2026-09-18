import React from "react";
import { Box, Dialog, DialogContent, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

import ChoosePlanContent from "./ChoosePlanContent";

const SlideUpTransition = React.forwardRef(function SlideUpTransition(
  props,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProPlanSubscriptionModal = ({
  open,
  onClose,
  onSubscribe,
  isSubmitting = false,
  headingTitle,
  hideFaq = false,
  hideTerms = false,
  activePlanId,
  hideFreeTrial = false,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      scroll="paper"
      TransitionComponent={SlideUpTransition}
      sx={{
        // Bottom-sheet on mobile, centered dialog on desktop.
        "& .MuiDialog-container": {
          alignItems: { xs: "flex-end", sm: "center" },
        },
      }}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "569px" },
          maxWidth: { xs: "100%", sm: "569px" },
          m: { xs: 0, sm: 2 },
          maxHeight: { xs: "85vh", sm: "90vh" },
          borderRadius: {
            xs: "16px 16px 0 0",
            sm: "16px",
          },
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label={t("Close")}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            color: "#9CA3AF",
            p: 0.5,
            backgroundColor: (theme) => theme.palette.background.paper,
            "&:hover": {
              backgroundColor: (theme) => theme.palette.background.paper,
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
      <DialogContent
        sx={{
          px: { xs: 1.5, sm: 5 },
          py: { xs: 2.5, sm: 4 },
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <ChoosePlanContent
          onSubscribe={onSubscribe}
          isSubmitting={isSubmitting}
          headingTitle={headingTitle}
          hideFaq={hideFaq}
          hideTerms={hideTerms}
          activePlanId={activePlanId}
          hideFreeTrial={hideFreeTrial}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProPlanSubscriptionModal;
