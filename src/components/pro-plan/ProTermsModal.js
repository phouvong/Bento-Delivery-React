import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Drawer,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

import useGetProTermsAndConditions, {
  resolveTermsBody,
  resolveTermsImage,
  resolveTermsTitle,
  resolveTermsEnabled,
} from "../../api-manage/hooks/react-query/pro-plans/useGetProTermsAndConditions";

// Body is shared between the desktop Dialog and mobile Drawer so only the
// surrounding surface differs between presentations.
const TermsBody = ({ onClose }) => {
  const { t } = useTranslation();
  const { data, isLoading } = useGetProTermsAndConditions();
  const body = resolveTermsBody(data);
  const title = resolveTermsTitle(data);
  const image = resolveTermsImage(data);
  const enabled = resolveTermsEnabled(data);

  return (
    <Stack sx={{ height: "100%" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2.5, pt: 2, pb: 1.5 }}
      >
        <Typography fontSize="18px" fontWeight={700} align="center">
          {title || t("Terms and Condition")}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label={t("Close")}
          sx={{ color: "#9CA3AF", p: 0.5 }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>

      <Box
        sx={{
          px: 2.5,
          pb: 2.5,
          flex: 1,
          overflowY: "auto",
        }}
      >
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={160}
            sx={{ borderRadius: "10px", mb: 1.5 }}
          />
        ) : (
          image && (
            <Box
              component="img"
              src={image}
              alt={title || "terms"}
              loading="lazy"
              sx={{
                width: "100%",
                maxHeight: 220,
                objectFit: "cover",
                borderRadius: "10px",
                mb: 1.75,
                display: "block",
              }}
            />
          )
        )}
        {isLoading ? (
          <Stack spacing={1.25}>
            <Skeleton variant="text" width="60%" height={22} />
            <Skeleton variant="text" width="100%" height={18} />
            <Skeleton variant="text" width="95%" height={18} />
            <Skeleton variant="text" width="90%" height={18} />
            <Skeleton variant="text" width="80%" height={18} />
            <Skeleton variant="text" width="50%" height={22} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="100%" height={18} />
            <Skeleton variant="text" width="92%" height={18} />
            <Skeleton variant="text" width="85%" height={18} />
            <Skeleton variant="text" width="70%" height={18} />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={96}
              sx={{ mt: 1, borderRadius: "8px" }}
            />
          </Stack>
        ) : !enabled ? (
          <Typography color="text.secondary">
            {t("Terms and conditions are currently unavailable.")}
          </Typography>
        ) : body ? (
          <Box
            sx={{
              fontSize: "14px",
              lineHeight: 1.65,
              color: "text.primary",
              "& p": { m: 0, mb: 1.25 },
              "& ul, & ol": { pl: 3, mb: 1.25 },
              "& li": { mb: 0.5 },
              "& a": { color: "primary.main" },
            }}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        ) : (
          <Typography color="text.secondary">
            {t("No terms available.")}
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

const ProTermsModal = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            height: "80vh",
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 4,
            backgroundColor: "#E5E7EB",
            borderRadius: "999px",
            mx: "auto",
            mt: 1,
          }}
        />
        <TermsBody onClose={onClose} />
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          maxHeight: "80vh",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <TermsBody onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default ProTermsModal;
